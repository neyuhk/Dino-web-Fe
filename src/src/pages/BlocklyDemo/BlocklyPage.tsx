import React, { useEffect, useRef, useState } from 'react'
import { Layout, Typography, Modal, Button, Input, Dropdown, Menu, Space, Avatar, MenuProps } from 'antd'
import { DownOutlined, UserOutlined } from '@ant-design/icons'
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
import { saveCodeBlock } from '../../services/codeBlock.ts'

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

    useEffect(() => {
        const initializeWorkspace = async () => {
            if (blocklyDiv.current) {
                Blockly.common.defineBlocks(blocks)
                Object.assign(javascriptGenerator.forBlock, forBlock)

                const newWorkspace = Blockly.inject(blocklyDiv.current, { toolbox })
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
                    if (e.isUiEvent || e.type == Blockly.Events.FINISHED_LOADING || newWorkspace.isDragging()) return
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
        if (workspace) {
            const code = javascriptGenerator.workspaceToCode(workspace)
            const outputDiv = document.getElementById('output')
            if (outputDiv) outputDiv.innerHTML = ''
            eval(code)
        }
    }

   const saveCodeBlockToDB = async () => {
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

        try {
            await saveCodeBlock(payload)
            console.log('Code block saved successfully')
        } catch (e) {
            console.error('Error saving code block', e)
        }
    }
}

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
        // Handle file upload logic here
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


    // Update the file input change handler
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
    if (workspace) {
        try {
            const json = Blockly.serialization.workspaces.save(workspace)
            const jsonString = JSON.stringify(json, null, 2)
            console.log(currentProject)
            if (projectId) {
                const project = {
                    ...currentProject,
                    name: projectName,
                    block: jsonString,
                }
                await updateProject(project, projectId)
                console.log('Project updated successfully')
            }
            else {
                const project = {
                    name: projectName,
                    block: jsonString,
                    createdBy: user._id
                }
                await createProject(project)
                console.log('Project saved successfully')
            }
        } catch (e) {
            console.error('Error saving project', e)
        }
    }
    else {
        console.error('Workspace not found')
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
            label: 'Save Project',
            onClick: handleSaveProject,
        },
        {
            key: '2',
            label: 'Load file(xml or json)',
            onClick: handleUploadClick,
        },
        {
            key: '3',
            label: 'Save XML File',
            onClick: downloadXML,
        },
        {
            key: '4',
            label: 'Save JSON File',
            onClick: saveAsJSON,
        },
    ]

    const chinhsuaa: MenuProps['items'] = [
        {
            key: '1',
            label: 'Undo',
            onClick: handleRestore,
        },
        {
            key: '2',
            label: 'Redo',
        },
    ]

    const hoatdong: MenuProps['items'] = [
        {
            key: '1',
            label: 'Log code',
            onClick: handleLogCode,
        },
        {
            key: '2',
            label: 'Execute code',
            onClick: executeCode,
        },
        {
            key: '3',
            label: 'Save code as TXT',
            onClick: saveCodeAsTxt,
        },
        {
            key: '4',
            label: 'New',
            onClick: showModal,
        },
    ]

    return (
        <Layout style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <Header style={{
                textAlign: 'center',
                color: '#fff',
                height: 64,
                paddingInline: 48,
                lineHeight: '64px',
                backgroundColor: '#37796F',
            }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Link to={'/'} style={{ color: 'rgb(242, 101, 38)' }}>
                        {/*<img src="/path/to/logo.png" alt="Logo" style={{ marginRight: '16px' }} />*/}
                        <Title level={3} style={{ color: 'rgb(242, 101, 38)', paddingRight: '20px' }}>Blockly</Title>
                    </Link>
                    <div style={{ marginRight: '16px' }}>
                        <Dropdown menu={{ items: taptinn }} trigger={['click']} onOpenChange={handleMenuClick}>
                            <a className={`white-text `} onClick={(e) => e.preventDefault()}>
                                <Space>
                                    File
                                    <DownOutlined />
                                </Space>
                            </a>
                        </Dropdown>
                    </div>
                    <div style={{ marginRight: '16px' }}>
                        <Dropdown menu={{ items: chinhsuaa }} trigger={['click']} onOpenChange={handleMenuClick}>
                            <a className={`white-text`} onClick={(e) => e.preventDefault()}>
                                <Space>
                                    Edit
                                    <DownOutlined />
                                </Space>
                            </a>
                        </Dropdown>
                    </div>
                    <div style={{ marginRight: '16px' }}>
                        <Dropdown menu={{ items: hoatdong }} trigger={['click']} onOpenChange={handleMenuClick}>
                            <a className={`white-text`} onClick={(e) => e.preventDefault()}>
                                <Space>
                                    Action
                                    <DownOutlined />
                                </Space>
                            </a>
                        </Dropdown>
                    </div>
                    <Input
                        placeholder="ProjectItem Name"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        style={{ width: '200px' }}
                    />
                    <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} />
                    <div style={{ marginLeft: 'auto' }}>
                        {isAuthenticated ? (
                            <Dropdown overlay={userMenu} trigger={['click']}>
                                <div
                                    className="user-info"
                                    onClick={(e) => e.preventDefault()}
                                >
                                    <Avatar icon={<UserOutlined />} />
                                    <span className="username">{user.username}</span>
                                </div>
                            </Dropdown>
                        ) : (
                            <div>chua dnag nhap</div>
                        )}
                    </div>
                </div>
            </Header>
            <Content style={{ flex: 1, overflow: 'auto' }}>
                <div>
                    <div id="pageContainer">
                        <div id="outputPane">
                            <pre id="generatedCode"><code style={{ textAlign: 'left' }}></code></pre>
                            <button style={{ marginTop: '16px' }} id="executeCodeButton" onClick={() => {
                                executeCode()
                            }}>Execute Code (test)
                            </button>
                            <button style={{ marginTop: '16px' }} id="saveCodeBlockToDB" onClick={() => {
                                saveCodeBlockToDB().then(r => console.log(r))
                            }}>Save code to DB
                            </button>
                            <pre id="generatedXML"><code style={{ textAlign: 'left' }}></code></pre>
                            <div id="output"></div>
                        </div>
                        <div id="blocklyDiv" ref={blocklyDiv}></div>
                    </div>
                    <Modal
                        title="Confirm"
                        visible={isModalVisible}
                        onOk={handleOk}
                        onCancel={handleCancel}
                        okText="Agree"
                        cancelText="Cancel"
                    >
                        <p>Are you sure you want to clear the workspace?</p>
                    </Modal>
                </div>
            </Content>
        </Layout>
    )
}

export default BlocklyPage
