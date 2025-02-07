import { Avatar, Button, Dropdown, Menu, type MenuProps } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import { PATHS } from '../../../router/path.ts'
import '../styles/header.css'

const items1: MenuProps['items'] = ['1', '2', '3'].map((key) => ({
    key,
    label: `nav ${key}`,
}));
const HeaderAdmin = () => {
    const { isAuthenticated } = useSelector((state: any) => state.auth)
    const isLogin = true
    const navLeft = (
        <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['2']}
            items={items1}
            style={{ flex: 1, minWidth: 0 }}
        />
    )
    const menu = (
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
    return (
        <div className="header-content">
            <h2
                style={{
                    color: '#F26526',
                }}
            >
                Logo
            </h2>
            {navLeft}
            <div>
                <Dropdown overlay={menu} trigger={['click']}>
                    <div
                        className="user-info"
                        onClick={(e) => e.preventDefault()}
                    >
                        <Avatar icon={<UserOutlined />} />
                        <span className="username white-text">Amin</span>
                    </div>
                </Dropdown>
            </div>
        </div>
    )
}

export default HeaderAdmin
