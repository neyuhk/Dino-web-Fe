import React, { useRef, useState } from 'react'
import { Input, Dropdown, Menu, MenuProps, Space, Avatar } from 'antd'
import { DownOutlined, UserOutlined } from '@ant-design/icons'
import './styles/headerBlockly.css'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../../assets/dinologo-nobgr.png'
import { color } from 'framer-motion'

const HeaderBlocklyComponent: React.FC = () => {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [projectName, setProjectName] = React.useState('')
    const [isFileActive, setIsFileActive] = useState(false)
    const navigate = useNavigate();
    const isLogin = true

    const handleUploadClick = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // Handle file upload logic here
    }

    const handleSaveProject = () => {
        // Handle save project logic here
    }

    const handleSaveCode = () => {
        // Handle save code logic here
    }

    const handleSaveXML = () => {
        // Handle save XML logic here
    }

    const handleRestore = () => {
        // Handle restore logic here
    }

    const handleMenuClick = () => {
        setIsFileActive(!isFileActive)
    }
    const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
        e.preventDefault();

        if (location.pathname === path) return;

        // Thêm class để bắt đầu hiệu ứng fade-out
        document.body.classList.add('page-transitioning');

        // Đợi hiệu ứng hoàn thành trước khi chuyển trang
        setTimeout(() => {
            navigate(path);
            setTimeout(() => {
                document.body.classList.remove('page-transitioning');
            }, 100);
        }, 300);
    };

    const userMenu = (
        <Menu>
            <Menu.Item key="profile">
                <a href="/profile">Trang cá nhân</a>
            </Menu.Item>
            <Menu.Item key="logout">
                <a
                    onClick={() => {
                        console.log('logout')
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
            label: 'Save ProjectItem',
            //className: 'white-text menuprops',
            onClick: handleSaveProject,
        },
        {
            key: '2',
            label: 'Save Code File',
            onClick: handleSaveCode,
        },
        {
            key: '3',
            label: 'Save XML File',
            onClick: handleSaveXML,
        },
        {
            key: '4',
            label: 'Open File from Computer',
            onClick: handleUploadClick,
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

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                margin: '0px 16px',
            }}
        >
            <img
                src={logo}
                alt="Logo"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate('/')}
            />
            <div style={{ marginRight: '16px' }}>
                <Dropdown
                    menu={{ items: taptinn }}
                    trigger={['click']}
                    onOpenChange={handleMenuClick}
                >
                    <a
                        className={`white-text `}
                        onClick={(e) => e.preventDefault()}
                    >
                        <Space>
                            File
                            <DownOutlined />
                        </Space>
                    </a>
                </Dropdown>
            </div>
            <div style={{ marginRight: '16px' }}>
                <Dropdown
                    menu={{ items: chinhsuaa }}
                    trigger={['click']}
                    onOpenChange={handleMenuClick}
                >
                    <a
                        className={`white-text`}
                        onClick={(e) => e.preventDefault()}
                    >
                        <Space>
                            Edit
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
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />

            <div style={{ marginLeft: 'auto' }}>
                {isLogin ? (
                    <Dropdown overlay={userMenu} trigger={['click']}>
                        <div
                            className="user-info"
                            onClick={(e) => e.preventDefault()}
                        >
                            <Avatar size={'small'} icon={<UserOutlined />} />
                            <span
                                style={{ color: 'white' }}
                                className="username-blockly"
                            >
                                {'Name'}
                            </span>
                        </div>
                    </Dropdown>
                ) : (
                    <Link
                        to="/auth"
                        className="sign-in-btn"
                        onClick={(e) => handleNavigation(e, '/auth')}
                    >
                        Đăng nhập
                    </Link>
                )}
            </div>
        </div>
    )
}

export default HeaderBlocklyComponent
