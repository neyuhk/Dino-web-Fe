import React, { useEffect, useRef, useState } from 'react'
import { Layout, Typography, Modal, Input, Dropdown, Menu, Space, Avatar, MenuProps, message, Button } from 'antd'
import { DownOutlined, UserOutlined, SaveOutlined, UploadOutlined, FileOutlined, EditOutlined, PlayCircleOutlined } from '@ant-design/icons'
import * as Blockly from 'blockly'
import { blocks } from '../../Blockly/blocks/defineBlock.ts'
import { forBlock } from '../../Blockly/generators/customBlock.ts'
import { javascriptGenerator } from 'blockly/javascript'
import { toolbox } from '../../Blockly/toolbox.ts'
import { save, load } from '../../Blockly/serialization'
import { Link, useParams } from 'react-router-dom'
import '../../Blockly/index.css'
import '../../components/commons/styles/headerBlockly.css'
import { createProject, getProjectById, updateProject } from '../../services/project.ts'
import { Project } from '../../model/model.ts'
import { useSelector } from 'react-redux'
import { logout } from '../../stores/authSlice.ts'
import store from '../../stores'
import {pushCodeToDb, saveCodeBlock} from '../../services/codeBlock.ts'
import styles from './BlocklyPage.module.css'

const { Header, Content } = Layout
const { Title } = Typography

const BlocklyPage: React.FC = () => {
    const { projectId } = useParams<{ projectId: string }>()
    const blocklyDiv = useRef<HTMLDivElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [workspace, setWorkspace] = useState<Blockly.WorkspaceSvg | null>(null)
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [projectName, setProjectName] = useState('')
    const [isFileActive, setIsFileActive] = useState(false)
    const [currentProject, setCurrentProject] = useState<Project>()
    const { isAuthenticated, user } = useSelector((state: any) => state.auth)
    const [ledState, setLedState] = useState('off')

    // Attach simulateLED function to window so it's available in generated code.
    // useEffect(() => {
    //     (window as any).simulateLED = (state: string): void => {
    //         const ledElement = document.getElementById('simulated-led')
    //         if (ledElement) {
    //             if (state === 'HIGH') {
    //                 ledElement.style.backgroundColor = 'yellow'
    //                 ledElement.classList.add('on')
    //                 setLedState('on')
    //             } else {
    //                 ledElement.style.backgroundColor = '#333'
    //                 ledElement.classList.remove('on')
    //                 setLedState('off')
    //             }
    //         }
    //         console.log('LED state:', state)
    //     }
    // }, [])

    useEffect(() => {
        const initializeWorkspace = async () => {
            if (blocklyDiv.current) {
                Blockly.common.defineBlocks(blocks)
                Object.assign(javascriptGenerator.forBlock, forBlock)

                const newWorkspace = Blockly.inject(blocklyDiv.current, {
                    toolbox,
                    zoom: {
                        controls: true,    // Show zoom in/out buttons
                        wheel: true,       // Enable mouse wheel zoom
                        startScale: 1.0,   // Initial zoom level
                        maxScale: 3,       // Maximum zoom in level
                        minScale: 0.3,     // Maximum zoom out level
                        scaleSpeed: 1.2    // Zoom speed factor
                    }
                });
                setWorkspace(newWorkspace)

                if (projectId) {
                    try {
                        const project = await getProjectById(projectId)
                        setCurrentProject(project.data)
                        setProjectName(project.data.name)
                        Blockly.serialization.workspaces.load(JSON.parse(project.data.block), newWorkspace)
                    } catch (error) {
                        console.error('Error loading project:', error)
                    }
                } else {
                    load(newWorkspace)
                }

                const runCode = () => {
                    const code = javascriptGenerator.workspaceToCode(newWorkspace)
                    const codeDiv = document.getElementById('generatedCode')?.firstChild
                    if (codeDiv) codeDiv.textContent = code
                }

                newWorkspace.addChangeListener((e: Blockly.Events.Abstract) => {
                    if (e.isUiEvent || e.type === Blockly.Events.FINISHED_LOADING || newWorkspace.isDragging()) return
                    runCode()
                })
                newWorkspace.addChangeListener((e: Blockly.Events.Abstract) => {
                    if (e.isUiEvent) return
                    save(newWorkspace)
                    setWorkspace(newWorkspace)
                })

                runCode()
            }
        }

        initializeWorkspace()
    }, [projectId])

    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            if (workspace && workspace.getUndoStack().length > 0) {
                event.preventDefault()
                event.returnValue = 'You have unsaved changes. Are you sure you want to leave?'
            }
        }

        window.addEventListener('beforeunload', handleBeforeUnload)

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload)
        }
    }, [workspace])


    const executeCode = () => {
    };

    const pushCodeBlock = () => {
        if (workspace) {
            const javascriptCode = javascriptGenerator.workspaceToCode(workspace)
            const jsonCode = JSON.stringify(Blockly.serialization.workspaces.save(workspace), null, 2)
            const xml = Blockly.Xml.workspaceToDom(workspace)
            const xmlCode = Blockly.Xml.domToPrettyText(xml)

            const payload = {
                javascriptCode,
                jsonCode,
                xmlCode,
            }

            console.log('Pushing code block:', payload)
        }
    }
    const saveCodeBlockToDB = async () => {
        executeCode();

        const outputDiv = document.getElementById("output");
        if (outputDiv) outputDiv.innerText = ""; // Xóa kết quả cũ nếu có

        if (workspace) {
            javascriptGenerator.finish = function (code: string): string {
                const definitions = this.definitions_ || {};
                const includes: string[] = [];
                const others: string[] = [];

                for (const [_, value] of Object.entries(definitions)) {
                    if (value.trim().startsWith('#include')) {
                        includes.push(value);
                    } else {
                        others.push(value);
                    }
                }

                return includes.join('\n') + '\n\n' + others.join('\n') + '\n\n' + code;
            };

            const javascriptCode = javascriptGenerator.workspaceToCode(workspace);
            console.log('Generated JavaScript code:', javascriptCode);

            try {
                message.loading({ content: 'Đang lưu code block...', key: 'saveCodeBlock' });
                await pushCodeToDb(javascriptCode);
                message.success({ content: 'Code block đã được lưu thành công!', key: 'saveCodeBlock' });
                if (outputDiv) outputDiv.innerText = "✅ Code block saved successfully!";
            } catch (e) {
                console.error('Error saving code block', e);
                message.error({ content: `Lỗi: ${e instanceof Error ? e.message : 'Không thể lưu code block'}`, key: 'saveCodeBlock' });
                if (outputDiv) outputDiv.innerText = `❌ Error: ${e instanceof Error ? e.message : e}`;
            }
        } else {
            message.warning('Workspace không tồn tại!');
            if (outputDiv) outputDiv.innerText = "⚠️ Workspace not found.";
        }
    };

    const downloadXML = () => {
        if (workspace) {
            const xml = Blockly.Xml.workspaceToDom(workspace)
            const xmlText = Blockly.Xml.domToPrettyText(xml)
            const blob = new Blob([xmlText], { type: 'text/xml' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'workspace.xml'
            a.click()
            URL.revokeObjectURL(url)
        }
    }

    const saveAsJSON = () => {
        if (workspace) {
            const json = Blockly.serialization.workspaces.save(workspace)
            const jsonString = JSON.stringify(json, null, 2)
            const blob = new Blob([jsonString], { type: 'application/json' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'workspace.json'
            a.click()
            URL.revokeObjectURL(url)
        }
    }

    const handleUploadClick = () => {
        fileInputRef.current?.click()
    }

    const saveCodeAsTxt = () => {
        if (workspace) {
            const code = javascriptGenerator.workspaceToCode(workspace)
            const blob = new Blob([code], { type: 'text/plain' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'code.txt'
            a.click()
            URL.revokeObjectURL(url)
        }
    }

    const clearWorkspace = () => {
        if (workspace) {
            const xml = Blockly.utils.xml.textToDom('<xml></xml>')
            Blockly.Xml.clearWorkspaceAndLoadFromXml(xml, workspace)
            localStorage.removeItem('mainWorkspace')
        }
    }

    const showModal = () => {
        setIsModalVisible(true)
    }

    const handleOk = () => {
        clearWorkspace()
        setIsModalVisible(false)
    }

    const handleCancel = () => {
        setIsModalVisible(false)
    }

    const uploadXML = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log('file change')
        if (workspace && event.target.files?.length) {
            const file = event.target.files[0]
            const reader = new FileReader()
            reader.onload = (e) => {
                const xmlText = e.target?.result as string
                const parser = new DOMParser()
                const xml = parser.parseFromString(xmlText, 'text/xml')
                Blockly.Xml.clearWorkspaceAndLoadFromXml(xml.documentElement, workspace)
            }
            reader.readAsText(file)
        }
    }

    const loadFromJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (workspace && event.target.files?.length) {
            const file = event.target.files[0]
            const reader = new FileReader()
            reader.onload = (e) => {
                const jsonText = e.target?.result as string
                const json = JSON.parse(jsonText)
                console.log(jsonText)
                Blockly.serialization.workspaces.load(json, workspace)
            }
            reader.readAsText(file)
        }
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            const fileType = file.type
            console.log(fileType)
            if (fileType === 'application/json') {
                loadFromJSON(event)
            } else if (fileType === 'text/xml') {
                uploadXML(event)
            } else {
                console.error('Unsupported file type')
            }
        }
    }

    const handleSaveProject = async () => {
        if (!isAuthenticated) {
            message.error('Vui lòng đăng nhập để lưu dự án!');
            return;
        }

        if (!projectName.trim()) {
            message.warning('Vui lòng nhập tên dự án trước khi lưu!');
            return;
        }

        if (workspace) {
            try {
                const json = Blockly.serialization.workspaces.save(workspace)
                const jsonString = JSON.stringify(json, null, 2)
                console.log(currentProject)

                message.loading({ content: 'Đang lưu dự án...', key: 'saveProject' });

                if (projectId) {
                    const project = {
                        ...currentProject,
                        name: projectName,
                        block: jsonString,
                    }
                    await updateProject(project, projectId)
                    message.success({ content: 'Dự án đã được cập nhật thành công!', key: 'saveProject' });
                } else {
                    const project = {
                        name: projectName,
                        block: jsonString,
                        createdBy: user._id
                    }
                    await createProject(project)
                    message.success({ content: 'Dự án đã được lưu thành công!', key: 'saveProject' });
                }
            } catch (e) {
                console.error('Error saving project', e)
                message.error({ content: 'Có lỗi xảy ra khi lưu dự án!', key: 'saveProject' });
            }
        } else {
            console.error('Workspace not found')
            message.error('Không tìm thấy workspace!');
        }
    }

    const handleRestore = () => {
        // Handle restore logic here
    }

    const handleLogCode = () => {
        const code = document.getElementById('generatedCode')?.textContent
        if (code) console.log(code)
    }

    const handleMenuClick = () => {
        setIsFileActive(!isFileActive)
    }

    const userMenu = (
        <Menu>
            <Menu.Item key="profile">
                <a href="/profile">Trang cá nhân</a>
            </Menu.Item>
            <Menu.Item key="logout">
                <a
                    onClick={() => {
                        console.log('logout')
                        store.dispatch(logout())
                    }}
                >
                    Đăng xuất
                </a>
            </Menu.Item>
        </Menu>
    )

    const taptinn: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <span>
          <SaveOutlined /> Save Project
        </span>
            ),
            onClick: handleSaveProject,
        },
        {
            key: '2',
            label: (
                <span>
          <UploadOutlined /> Load File (XML or JSON)
        </span>
            ),
            onClick: handleUploadClick,
        },
        {
            key: '3',
            label: (
                <span>
          <FileOutlined /> Save XML File
        </span>
            ),
            onClick: downloadXML,
        },
        {
            key: '4',
            label: (
                <span>
          <FileOutlined /> Save JSON File
        </span>
            ),
            onClick: saveAsJSON,
        },
    ]

    const chinhsuaa: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <span>
          <EditOutlined /> Undo
        </span>
            ),
            onClick: handleRestore,
        },
        {
            key: '2',
            label: (
                <span>
          <EditOutlined /> Redo
        </span>
            ),
        },
    ]

    const hoatdong: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <span>
          <FileOutlined /> Log Code
        </span>
            ),
            onClick: handleLogCode,
        },
        {
            key: '2',
            label: (
                <span>
          <PlayCircleOutlined /> Execute Code
        </span>
            ),
            onClick: executeCode,
        },
        {
            key: '3',
            label: (
                <span>
          <FileOutlined /> Save Code as TXT
        </span>
            ),
            onClick: saveCodeAsTxt,
        },
        {
            key: '4',
            label: 'New',
            onClick: showModal,
        },
    ]

    // Send the workspace file to the Python backend
    const sendFileToPythonBackend = async () => {
        if (!workspace) {
            message.error('Workspace chưa được khởi tạo!');
            console.error("Workspace is not initialized.");
            return;
        }

        // Generate JSON representation of the workspace
        const jsonWorkspace = Blockly.serialization.workspaces.save(workspace);
        const jsonText = JSON.stringify(jsonWorkspace, null, 2);

        // Prepare FormData for the JSON format
        const jsonFormData = new FormData();
        jsonFormData.append("file", new Blob([jsonText], { type: "application/json" }), "workspace.json");

        try {
            message.loading({ content: 'Đang gửi file...', key: 'sendFile' });

            // Send the JSON file to the backend
            const response = await fetch("http://127.0.0.1:5001/upload-json", {
                method: "POST",
                body: jsonFormData,
            });

            // Process the response
            const result = await response.json();
            console.log("JSON Response:", result);
            message.success({ content: 'File đã được gửi thành công!', key: 'sendFile' });
        } catch (error) {
            console.error("Error sending JSON file to Python backend:", error);
            message.error({ content: 'Lỗi khi gửi file!', key: 'sendFile' });
        }
    }

    return (
        <Layout
            style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100vh',
            }}
        >
            <Header className="header-blockly">
                <div className="header-content">
                    <div className="logo-title">
                        <Link to={'/'}>
                            <Title level={3}>Blockly</Title>
                        </Link>
                    </div>

                    <div className="menu-section">
                        <Dropdown
                            menu={{ items: taptinn }}
                            trigger={['click']}
                            onOpenChange={handleMenuClick}
                        >
                            <a
                                className="dropdown-menu white-text"
                                onClick={(e) => e.preventDefault()}
                            >
                                <Space>
                                    File
                                    <DownOutlined />
                                </Space>
                            </a>
                        </Dropdown>

                        <Dropdown
                            menu={{ items: chinhsuaa }}
                            trigger={['click']}
                            onOpenChange={handleMenuClick}
                        >
                            <a
                                className="dropdown-menu white-text"
                                onClick={(e) => e.preventDefault()}
                            >
                                <Space>
                                    Edit
                                    <DownOutlined />
                                </Space>
                            </a>
                        </Dropdown>

                        <Dropdown
                            menu={{ items: hoatdong }}
                            trigger={['click']}
                            onOpenChange={handleMenuClick}
                        >
                            <a
                                className="dropdown-menu white-text"
                                onClick={(e) => e.preventDefault()}
                            >
                                <Space>
                                    Action
                                    <DownOutlined />
                                </Space>
                            </a>
                        </Dropdown>

                        <Input
                            className="project-name-input"
                            placeholder="Project Name"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            style={{ width: '200px' }}
                        />

                        {/* Nút Save Project mới */}
                        <Button
                            type="primary"
                            icon={<SaveOutlined />}
                            onClick={handleSaveProject}
                            className={styles.saveProjectButton}
                        >
                            Lưu dự án
                        </Button>
                    </div>

                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                    />

                    <div>
                        {isAuthenticated ? (
                            <Dropdown overlay={userMenu} trigger={['click']}>
                                <div className="user-info">
                                    <Avatar icon={<UserOutlined />} />
                                    <span className="username">
                                        {user.username}
                                    </span>
                                </div>
                            </Dropdown>
                        ) : (
                            <Link to="/auth" className="white-text">
                                Đăng nhập
                            </Link>
                        )}
                    </div>
                </div>
            </Header>

            <Content style={{ flex: 1, overflow: 'hidden' }}>
                <div id="pageContainer">
                    <div id="outputPane">
                        <h3>Dịch khối thành mã nguồn</h3>
                        <pre id="generatedCode">
                            <code></code>
                        </pre>

                        <button className={styles.saveDBbutton} id="saveCodeBlockToDB" onClick={saveCodeBlockToDB}>
                            <PlayCircleOutlined /> Chạy trên phần cứng
                        </button>
                        {/*<button className={styles.executeCode} id="executeButton" onClick={executeCode}>*/}
                        {/*    <PlayCircleOutlined /> Chạy và xem kết quả*/}
                        {/*</button>*/}

                        <button
                            className={styles.saveDBbutton}
                            id="sendFileButton"
                            onClick={sendFileToPythonBackend}
                        >
                            <SaveOutlined /> Lưu tệp của bạn vào hệ thống
                        </button>

                        <h3>Output</h3>
                        <div id="output"></div>
                    </div>

                    <div id="blocklyDiv" ref={blocklyDiv}></div>
                </div>

                <Modal
                    title="Xác nhận"
                    visible={isModalVisible}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    okText="Đồng ý"
                    cancelText="Hủy bỏ"
                >
                    <p>Bạn có chắc chắn muốn xóa không gian làm việc?</p>
                </Modal>
            </Content>
        </Layout>
    )

}

export default BlocklyPage
