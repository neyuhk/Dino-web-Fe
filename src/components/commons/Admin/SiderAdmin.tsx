import { Menu } from 'antd'
import {
    AppstoreOutlined,
    UserOutlined,
    BookOutlined,
    MessageOutlined,
    HomeOutlined
} from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'
import styles from './SiderAdmin.module.css'
import { useState, useEffect, useRef } from 'react'

const SiderAdmin = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const [selectedKey, setSelectedKey] = useState('1')
    const [collapsed, setCollapsed] = useState(true)
    const siderRef = useRef<HTMLDivElement>(null)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)
    const [isOpen, setIsOpen] = useState<boolean>(false)

    useEffect(() => {
        // Đặt selected key dựa trên đường dẫn hiện tại
        if (location.pathname.includes('/admin/projects')) {
            setSelectedKey('1');
        } else if (location.pathname.includes('/admin/users')) {
            setSelectedKey('2');
        } else if (location.pathname.includes('/admin/courses')) {
            setSelectedKey('3');
        } else if (location.pathname.includes('/admin/forum')) {
            setSelectedKey('4');
        } else if (location.pathname.includes('/admin')) {
            setSelectedKey('0');
        }
    }, [location.pathname]);

    const handleMouseEnter = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        setCollapsed(false);
        setIsOpen(true)
    };

    const handleMouseLeave = () => {
        // Thêm độ trễ nhỏ trước khi đóng để tránh đóng quá nhanh
        timeoutRef.current = setTimeout(() => {
            setCollapsed(true);
            setIsOpen(false)
        }, 300);
    };

    useEffect(() => {
        // Cleanup function khi component unmount
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const items = [
        {
            key: '0',
            icon: <HomeOutlined className={styles.menuIcon} />,
            label: isOpen ? 'Trang chủ' : "" ,
            onClick: () => navigate('/admin'),
        },
        {
            key: '1',
            icon: <AppstoreOutlined className={styles.menuIcon} />,
            label: isOpen ?'Danh sách dự án' : "",
            onClick: () => navigate('/admin/projects'),
        },
        {
            key: '2',
            icon: <UserOutlined className={styles.menuIcon} />,
            label: isOpen ? 'Quản lý người dùng' : "",
            onClick: () => navigate('/admin/users'),
        },
        {
            key: '3',
            icon: <BookOutlined className={styles.menuIcon} />,
            label: isOpen ? 'Khóa học' : "",
            onClick: () => navigate('/admin/courses'),
        },
        {
            key: '4',
            icon: <MessageOutlined className={styles.menuIcon} />,
            label: isOpen ? 'Diễn đàn' : "",
            onClick: () => navigate('/admin/forum'),
        },
    ];

    return (
        <div
            className={`${styles.siderContainer} ${collapsed ? styles.collapsed : styles.expanded}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            ref={siderRef}
        >
            <Menu
                mode="inline"
                selectedKeys={[selectedKey]}
                className={styles.menu}
                items={items}
                inlineCollapsed={collapsed}
            />
        </div>
    )
}

export default SiderAdmin