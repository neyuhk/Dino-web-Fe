import { Avatar, Button, Dropdown, Menu } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import './styles/header.css'
import { useDispatch, useSelector } from 'react-redux'
import { PATHS } from '../../router/path.ts'
import { Link } from 'react-router-dom'
import { logout } from '../../stores/authSlice';
import { AppDispatch } from '../../stores'
import { getCurrentUserAction } from '../../stores/authAction.ts'
//import { logout } from '../../services/auth.ts'

const HeaderComponent = () => {
    const { isAuthenticated, user } = useSelector((state: any) => state.auth)
    const dispatch: AppDispatch = useDispatch();
    console.log(isAuthenticated, user)

    const logoutAction = async () => {
        console.log('logout')
        dispatch(logout())
    }

    const menu = (
        <Menu>
            <Menu.Item key="profile">
                <a href="/profile">Trang cá nhân</a>
            </Menu.Item>
            <Menu.Item key="logout">
                <a
                    onClick={logoutAction}
                >
                    Đăng xuất
                </a>
            </Menu.Item>
            <Menu.Item>
                <a onClick={() => {
                    console.log('test')
                    dispatch(getCurrentUserAction())
                }} >test</a>
            </Menu.Item>
        </Menu>
    )
    const headerMenu = [
        {
            key: 'projects',
            title: 'Projects',
            href: PATHS.PROJECTS,
        },
        {
            key: 'blockly',
            title: 'Blockly',
            href: PATHS.BLOCKLY,
        },
    ]
    return (
        <div className="header-content">
            <Link to="/">
                <h2
                    style={{
                        color: '#F26526',
                    }}
                >
                    Logo
                </h2>
            </Link>
            <Menu
                className="header-menu"
                mode="horizontal"
                items={headerMenu.map(item => ({
                    key: item.key,
                    label: <a className="hover-change white-text" href={item.href}>{item.title}</a>,
                }))}
            />
            <div>
                {isAuthenticated ? (
                    <Dropdown overlay={menu} trigger={['click']}>
                        <div
                            className="user-info"
                            onClick={(e) => e.preventDefault()}
                        >
                            <Avatar icon={<UserOutlined />} />
                            <span className="username">{user.username}</span>
                        </div>
                    </Dropdown>
                ) : (
                    <div style={{display:'flex'}}>
                        <Link to="/auth">
                            Đăng nhập
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}

export default HeaderComponent
