import { Menu, MenuProps } from 'antd'
import { BookOutlined, LaptopOutlined, UserOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

const SiderAdmin = () => {
    const navigate = useNavigate()

    const items: MenuProps['items'] = [
        {
            key: 'sub1',
            icon: <LaptopOutlined />,
            label: 'ProjectItem Management',
            children: [
                {
                    key: '1',
                    label: 'Projects List',
                    onClick: () => navigate('/admin/projects'),
                },
                {
                    key: '2',
                    label: 'Child 2',
                },
            ],
        },
        {
            key: 'sub2',
            icon: <UserOutlined />,
            label: 'User Management',
            children: [
                {
                    key: '3',
                    label: 'Users List',
                    onClick: () => navigate('/admin/users'),
                },
                {
                    key: '4',
                    label: 'Child 2',
                },
            ],
        },
        {
            key: 'sub3',
            icon: <BookOutlined />,
            label: 'Course Management',
            children: [
                {
                    key: '5',
                    label: 'Courses List',
                    onClick: () => navigate('/admin/courses'),
                },
                {
                    key: '6',
                    label: 'Child 2',
                },
            ],
        },
        {
            key: 'sub4',
            icon: <BookOutlined />,
            label: 'Forum Management',
            children: [
                {
                    key: '7',
                    label: 'Forum List',
                    onClick: () => navigate('/admin/forum'),
                },
                {
                    key: '8',
                    label: 'Child 2',
                },
            ],
        },
    ]

    return (
        <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            style={{ height: '100%', borderRight: 0 }}
            items={items}
        />
    )
}

export default SiderAdmin
