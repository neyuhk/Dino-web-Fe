import React, { useEffect, useRef, useState } from 'react'
import { Layout, Typography, Modal, Input, Dropdown, Menu, Space, Avatar, MenuProps, message, Button } from 'antd'
import {
    DownOutlined,
    UserOutlined,
    SaveOutlined,
    UploadOutlined,
    FileOutlined,
    PlayCircleOutlined,
    CloudDownloadOutlined,
    CopyOutlined,
} from '@ant-design/icons'
import * as Blockly from 'blockly'
import { blocks } from '../../Blockly/blocks/defineBlock.ts'
import { forBlock } from '../../Blockly/generators/customBlock.ts'
import { javascriptGenerator } from 'blockly/javascript'
import { toolbox } from '../../Blockly/toolbox.ts'
import { save, load } from '../../Blockly/serialization'
import { Link, useParams } from 'react-router-dom'
import '../../Blockly/index.css'
import '../../components/commons/styles/headerBlockly.css'
import { cloneProject, createProject, getProjectById, updateProject } from '../../services/project.ts'
import { Project } from '../../model/model.ts'
import { useSelector } from 'react-redux'
import { logout } from '../../stores/authSlice.ts'
import store from '../../stores'
import { pushCodeToDb, saveCodeBlock } from '../../services/codeBlock.ts'
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

    // Kiểm tra xem người dùng hiện tại có phải là chủ sở hữu dự án không
    const isProjectOwner = currentProject && isAuthenticated ? currentProject.user_id._id === user._id : false

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
                        scaleSpeed: 1.2,    // Zoom speed factor
                    },
                })
                setWorkspace(newWorkspace)

                if (projectId) {
                    try {
                        const project = await getProjectById(projectId)
                        setCurrentProject(project.data)
                        setProjectName(project.data.name)
                        Blockly.serialization.workspaces.load(JSON.parse(project.data.block), newWorkspace)
                    } catch (error) {
                        console.error('Lỗi khi tải dự án:', error)
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
                event.returnValue = 'Bạn có thay đổi chưa lưu. Bạn có chắc chắn muốn rời đi không?'
            }
        }

        window.addEventListener('beforeunload', handleBeforeUnload)

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload)
        }
    }, [workspace])

    const saveCodeBlockToDB = async () => {
        const outputDiv = document.getElementById('output')
        if (outputDiv) outputDiv.innerText = '' // Xóa kết quả cũ nếu có

        if (workspace) {
            javascriptGenerator.finish = function(code: string): string {
                const definitions = this.definitions_ || {}
                const includes: string[] = []
                const others: string[] = []

                for (const [_, value] of Object.entries(definitions)) {
                    if (value.trim().startsWith('#include')) {
                        includes.push(value)
                    } else {
                        others.push(value)
                    }
                }

                return includes.join('\n') + '\n\n' + others.join('\n') + '\n\n' + code
            }

            const javascriptCode = javascriptGenerator.workspaceToCode(workspace)
            console.log('Mã JavaScript đã tạo:', javascriptCode)

            try {
                message.loading({ content: 'Đang tải mã lên thiết bị...', key: 'saveCodeBlock' })
                await pushCodeToDb(javascriptCode)
                message.success({ content: 'Mã đã được tải lên thiết bị thành công!', key: 'saveCodeBlock' })
                if (outputDiv) outputDiv.innerText = '✅ Mã đã được tải lên thiết bị thành công!'
            } catch (e) {
                console.error('Lỗi khi lưu mã', e)
                message.error({
                    content: `Lỗi: ${e instanceof Error ? e.message : 'Không thể tải mã lên thiết bị'}`,
                    key: 'saveCodeBlock',
                })
                if (outputDiv) outputDiv.innerText = `❌ Lỗi: ${e instanceof Error ? e.message : e}`
            }
        } else {
            message.warning('Không tìm thấy không gian làm việc!')
            if (outputDiv) outputDiv.innerText = '⚠️ Không tìm thấy không gian làm việc.'
        }
    }
    const handleMenuClick = () => {
        setIsFileActive(!isFileActive)
    }
    const downloadXML = () => {
        if (workspace) {
            const xml = Blockly.Xml.workspaceToDom(workspace)
            const xmlText = Blockly.Xml.domToPrettyText(xml)
            const blob = new Blob([xmlText], { type: 'text/xml' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'khoi-lenh.xml'
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
            a.download = 'khoi-lenh.json'
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
            a.download = 'ma-nguon.txt'
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
                console.error('Định dạng file không được hỗ trợ')
            }
        }
    }

    const cloneProjectFunc = async () => {
        if (!isAuthenticated) {
            message.error('Vui lòng đăng nhập để sao chép dự án!')
            return
        }

        if (currentProject) {
            try {
                await cloneProject(currentProject._id, user._id)
                message.success('Đã sao chép dự án này về tài khoản của bạn!')
            } catch (e) {
                console.error('Lỗi khi sao chép dự án', e)
                message.error('Có lỗi xảy ra khi sao chép dự án!')
            }
        } else {
            message.warning('Không tìm thấy dự án để sao chép!')
        }
    }

    const handleSaveProject = async () => {
        if (!isAuthenticated) {
            message.error('Vui lòng đăng nhập để lưu dự án!')
            return
        }

        if (!projectName.trim()) {
            message.warning('Vui lòng đặt tên cho dự án trước khi lưu!')
            return
        }

        if (workspace) {
            try {
                const json = Blockly.serialization.workspaces.save(workspace)
                const jsonString = JSON.stringify(json, null, 2)

                message.loading({ content: 'Đang lưu dự án...', key: 'saveProject' })

                if (currentProject && !isProjectOwner) {
                    message.error({ content: 'Bạn không có quyền sửa dự án này!', key: 'saveProject' })
                    return
                }

                if (projectId && isProjectOwner) {
                    const project = {
                        ...currentProject,
                        name: projectName,
                        block: jsonString,
                    }
                    await updateProject(project, projectId)
                    message.success({ content: 'dự án đã được cập nhật thành công!', key: 'saveProject' })
                } else {
                    const project = {
                        name: projectName,
                        block: jsonString,
                        createdBy: user._id,
                    }
                    await createProject(project)
                    message.success({ content: 'dự án đã được lưu thành công!', key: 'saveProject' })
                }
            } catch (e) {
                console.error('Lỗi khi lưu dự án', e)
                message.error({ content: 'Có lỗi xảy ra khi lưu dự án!', key: 'saveProject' })
            }
        } else {
            console.error('Không tìm thấy không gian làm việc')
            message.error('Không tìm thấy không gian làm việc!')
        }
    }

    const userMenu = (
        <Menu>
            <Menu.Item key="profile">
                <a href="/profile">Hồ sơ của tôi</a>
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

    // Menu Tệp
    const menuTep: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <span>
                    <SaveOutlined /> Lưu dự án
                </span>
            ),
            onClick: handleSaveProject,
            disabled: currentProject ? !isProjectOwner : !isAuthenticated,
        },
        {
            key: '2',
            label: (
                <span>
                    <CopyOutlined /> Sao chép dự án này
                </span>
            ),
            onClick: cloneProjectFunc,
            disabled: !isAuthenticated || !currentProject,
        },
        {
            key: '3',
            label: (
                <span>
                    <FileOutlined /> dự án mới
                </span>
            ),
            onClick: showModal,
        },
        {
            type: 'divider',
        },
        {
            key: '4',
            label: (
                <span>
                    <UploadOutlined /> Mở tệp (XML hoặc JSON)
                </span>
            ),
            onClick: handleUploadClick,
        },
        {
            key: '5',
            label: (
                <span>
                    <CloudDownloadOutlined /> Tải xuống dạng XML
                </span>
            ),
            onClick: downloadXML,
        },
        {
            key: '6',
            label: (
                <span>
                    <CloudDownloadOutlined /> Tải xuống dạng JSON
                </span>
            ),
            onClick: saveAsJSON,
        },
        {
            key: '7',
            label: (
                <span>
                    <FileOutlined /> Lưu mã nguồn dạng TXT
                </span>
            ),
            onClick: saveCodeAsTxt,
        },
    ]
    const sendFileToClient = async () => {
        if (!workspace) {
            message.error('Không gian làm việc chưa được khởi tạo!')
            return
        }

        // Generate JSON representation of the workspace
        const code = javascriptGenerator.workspaceToCode(workspace)

        const isWindows = navigator.platform.includes('Win')
        const fileName = isWindows ? 'run.bat' : 'run.sh'

        console.log('isWindows', isWindows)

        let scriptContent = ''

        if (isWindows) {
            // Escape & generate bat content
            const codeLines = code.split('\n')
            const echoLines = codeLines.map((line, index) => {
                const safeLine = line.replace(/([&<>|^])/g, '^$1')
                return `${index === 0 ? 'echo' : 'echo.'} ${safeLine} >> code\\code.ino`
            })

            scriptContent = `@echo off
setlocal

REM === Tạo thư mục code ===
if not exist "code" mkdir code

REM === Ghi nội dung vào code\\code.ino ===
del code\\code.ino >nul 2>&1
${echoLines.join('\n')}

REM === Locate Arduino IDE ===
set "ARDUINO_PATH="

if exist "C:\\Program Files\\Arduino\\Arduino.exe" (
    set "ARDUINO_PATH=C:\\Program Files\\Arduino\\Arduino.exe"
    goto found
)

if exist "C:\\Program Files\\Arduino\\Arduino_debug.exe" (
    set "ARDUINO_PATH=C:\\Program Files\\Arduino\\Arduino_debug.exe"
    goto found
)

if exist "C:\\Program Files (x86)\\Arduino\\Arduino.exe" (
    set "ARDUINO_PATH=C:\\Program Files (x86)\\Arduino\\Arduino.exe"
    goto found
)

if exist "C:\\Program Files (x86)\\Arduino\\Arduino_debug.exe" (
    set "ARDUINO_PATH=C:\\Program Files (x86)\\Arduino\\Arduino_debug.exe"
    goto found
)

echo Arduino IDE not found! Please install Arduino IDE.
pause
exit /b

:found
echo Found Arduino IDE at: "%ARDUINO_PATH%"

REM === Detect COM port ===
set "COMPORT="
for /f "tokens=3" %%A in ('reg query HKEY_LOCAL_MACHINE\\HARDWARE\\DEVICEMAP\\SERIALCOMM ^| find "REG_SZ"') do (
    set "COMPORT=%%A"
)

if not defined COMPORT (
    echo No COM port detected, defaulting to COM3.
    set "COMPORT=COM3"
)

echo Using port: %COMPORT%

REM === Upload sketch ===
echo uploading command: "%ARDUINO_PATH%" --upload --port %COMPORT% "%~dp0code\\code.ino"

"%ARDUINO_PATH%" --upload --port %COMPORT% "%~dp0code\\code.ino"

pause`
        } else {
            // Escape & generate bash content
            const codeLines = code.split('\n')
            const echoLines = codeLines.map(line => {
                const safeLine = line.replace(/(["`\\$])/g, '\\$1')
                return `echo "${safeLine}" >> code/code.ino`
            })

            scriptContent = `#!/bin/bash

mkdir -p code
rm -f code/code.ino
${echoLines.join('\n')}

# Tìm Arduino IDE path (có thể chỉnh sửa nếu khác)
ARDUINO_PATH="/Applications/Arduino.app/Contents/MacOS/Arduino"

if [ ! -f "$ARDUINO_PATH" ]; then
    echo "Arduino IDE không được tìm thấy!"
    exit 1
fi

# Cổng mặc định là /dev/cu.usbmodem*
PORT=$(ls /dev/cu.usbmodem* 2>/dev/null | head -n 1)
if [ -z "$PORT" ]; then
    echo "Không tìm thấy cổng thiết bị! Mặc định là /dev/cu.usbmodem14101"
    PORT="/dev/cu.usbmodem14101"
fi

"$ARDUINO_PATH" --upload --port "$PORT" "$(pwd)/code/code.ino"
`
        }

        const blob = new Blob([scriptContent], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)

        const link = document.createElement('a')
        link.href = url
        link.download = fileName
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        URL.revokeObjectURL(url)
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
                            <img
                                className="logo"
                                src={
                                    'https://raw.githubusercontent.com/NguyenBaHoangKim/store-image/main/quiz/dinologo-nobgr.pngcbfecc1c-0b6c-4fab-abb8-00fbd9dc97f0-1744633033359'
                                }
                                alt="Logo"
                            />
                        </Link>
                    </div>

                    <div className="menu-section">
                        <Dropdown
                            menu={{ items: menuTep }}
                            trigger={['click']}
                            onOpenChange={handleMenuClick}
                        >
                            <a
                                className="dropdown-menu white-text"
                                onClick={(e) => e.preventDefault()}
                            >
                                <Space>
                                    Tệp
                                    <DownOutlined />
                                </Space>
                            </a>
                        </Dropdown>

                        <Input
                            className="project-name-input"
                            placeholder="Tên dự án"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            style={{ width: '200px' }}
                        />

                        {/* Nút Lưu dự án */}
                        <Button
                            type="primary"
                            icon={<SaveOutlined />}
                            onClick={handleSaveProject}
                            className={styles.saveProjectButton}
                            disabled={currentProject ? !isProjectOwner : !isAuthenticated}
                        >
                            Lưu dự án
                        </Button>

                        {/* Hiển thị nút Sao chép nếu người dùng đang xem dự án của người khác */}
                        {currentProject && isAuthenticated && !isProjectOwner && (
                            <Button
                                type="primary"
                                icon={<CopyOutlined />}
                                onClick={cloneProjectFunc}
                                className={styles.saveProjectButton}
                            >
                                Sao chép dự án này
                            </Button>
                        )}
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
                                    <span className="username-blockly">
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
                        <h3>Chuyển đổi khối thành mã nguồn</h3>
                        <pre id="generatedCode">
                            <code></code>
                        </pre>

                        <button
                            className={styles.saveDBbutton}
                            id="saveCodeBlockToDB"
                            onClick={saveCodeBlockToDB}
                        >
                            <PlayCircleOutlined /> Chạy trên thiết bị
                        </button>

                        <button
                            className={styles.saveDBbutton}
                            id="sendFileButton"
                            onClick={sendFileToClient}
                        >
                            <SaveOutlined />Tải xuống tệp để chạy
                        </button>

                        <h3>Kết quả</h3>
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
                    <p>Bạn có chắc chắn muốn tạo dự án mới và xóa tất cả các khối lệnh hiện tại không?</p>
                </Modal>
            </Content>
        </Layout>
    )
}

export default BlocklyPage
