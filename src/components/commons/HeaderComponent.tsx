import React, { useState } from 'react';
import { Avatar, Button, Dropdown, Modal } from 'antd';
import { UserOutlined, MenuOutlined, CloseOutlined, DownOutlined } from '@ant-design/icons';
import './styles/header.css';
import { useDispatch, useSelector } from 'react-redux';
import { PATHS } from '../../router/path.ts';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { logout } from '../../stores/authSlice';
import { AppDispatch } from '../../stores';
import logo from '../../assets/dinologo-nobgr.png'

const HeaderComponent: React.FC = () => {
    const { isAuthenticated, user } = useSelector((state: any) => state.auth);
    const dispatch: AppDispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);



    const confirmLogout = () => {
        setShowLogoutModal(true);
    };

    const handleLogout = async () => {
        dispatch(logout());
        setShowLogoutModal(false);
    };

    const cancelLogout = () => {
        setShowLogoutModal(false);
    };

    const toggleMobileMenu = () => {
        setMobileMenuVisible(!mobileMenuVisible);
    };

    const handleMobileItemClick = () => {
        setMobileMenuVisible(false);
    };

    // Xử lý chuyển trang mượt
    const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
        e.preventDefault();

        if (location.pathname === path) return;

        setIsTransitioning(true);

        // Thêm class để bắt đầu hiệu ứng fade-out
        document.body.classList.add('page-transitioning');

        // Đợi hiệu ứng hoàn thành trước khi chuyển trang
        setTimeout(() => {
            navigate(path);
            setTimeout(() => {
                document.body.classList.remove('page-transitioning');
                setIsTransitioning(false);
            }, 100);
        }, 300);
    };

    const navItems = [
        {
            key: 'blockly',
            title: 'Dino Blocks',
            href: PATHS.BLOCKLY || '/blockly',
        },
        {
            key: 'forum',
            title: 'Diễn đàn',
            href: PATHS.FORUM || '/forum',
        },
        {
            key: 'projects',
            title: 'Dự án mẫu',
            href: PATHS.PROJECTS || '/projects',
        },
        {
            key: 'courses',
            title: 'Khóa học',
            href: PATHS.COURSES || '/courses',
        },
        {
            key: 'classroom',
            title: user && user.role === 'admin' ? 'Quản lý hệ thống' : 'Khóa học của tôi',
            href: user && user.role === 'admin' ? '/admin' : (PATHS.CLASSROOM || '/classroom'),
        }
    ];

    // Tạo menu dropdown cho tab Giới thiệu
    const aboutDropdownItems = [
        {
            key: 'our-product',
            label: <Link to="/our-product" onClick={(e) => handleNavigation(e, '/our-product')}>Sản phẩm của chúng tôi</Link>,
        },
        {
            key: 'about-us',
            label: <Link to="/about-us" onClick={(e) => handleNavigation(e, '/about-us')}>Về chúng tôi</Link>,
        },
    ];

    const userMenuItems = [
        {
            key: 'profile',
            label: <Link to="/profile" onClick={(e) => handleNavigation(e, '/profile')}>Trang cá nhân</Link>,
        },
        {
            key: 'logout',
            label: <span onClick={confirmLogout}>Đăng xuất</span>,
        },
    ];

    const isActive = (path: string) => {
        if (!path || !location.pathname) return false;
        return location.pathname.startsWith(path);
    };

    // Kiểm tra nếu đang ở trang about-us hoặc our-product
    const isAboutSectionActive = () => {
        return isActive('/about-us') || isActive('/our-product');
    };

    return (
        <>
            <header className={`modern-header ${isTransitioning ? 'transitioning' : ''}`}>
                <div className="header-container">
                    <Link
                        to="/"
                        className="logo"
                        onClick={(e) => handleNavigation(e, '/')}
                    >
                        <img className="logo" src={logo}/>
                    </Link>

                    <div className="mobile-toggle" onClick={toggleMobileMenu}>
                        {mobileMenuVisible ? <CloseOutlined /> : <MenuOutlined />}
                    </div>

                    <nav className={`nav-menu ${mobileMenuVisible ? 'visible' : ''}`}>
                        {navItems.map(item => (
                            <Link
                                key={item.key}
                                to={item.href}
                                className={`nav-item ${isActive(item.href) ? 'active' : ''}`}
                                onClick={(e) => {
                                    handleMobileItemClick();
                                    handleNavigation(e, item.href);
                                }}
                            >
                                {item.title}
                            </Link>
                        ))}

                        {/* Dropdown menu cho Giới thiệu */}
                        <Dropdown
                            menu={{ items: aboutDropdownItems }}
                            placement="bottom"
                            trigger={['click']}
                        >
                            <div className={`nav-item dropdown-trigger ${isAboutSectionActive() ? 'active' : ''}`}>
                                Giới thiệu <DownOutlined style={{ fontSize: '12px', marginLeft: '5px' }} />
                            </div>
                        </Dropdown>
                    </nav>

                    <div className="auth-section">
                        {isAuthenticated ? (
                            <Dropdown
                                menu={{ items: userMenuItems }}
                                placement="bottomRight"
                                arrow
                            >
                                <div className="header-user-profile">
                                    <Avatar
                                        size="small"
                                        icon={<UserOutlined />}
                                        src={user.avatar}
                                    />
                                    <span className="header-user-name">{user.username}</span>
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
            </header>

            <Modal
                open={showLogoutModal}
                onCancel={cancelLogout}
                footer={null}
                centered
                closable={false}
                width={400}
                className="logout-confirmation"
            >
                <div className="logout-modal">
                    <div className="modal-icon">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8.90002 7.55999C9.21002 3.95999 11.06 2.48999 15.11 2.48999H15.24C19.71 2.48999 21.5 4.27999 21.5 8.74999V15.27C21.5 19.74 19.71 21.53 15.24 21.53H15.11C11.09 21.53 9.24002 20.08 8.91002 16.54" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M15 12H3.62" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M5.85 8.6499L2.5 11.9999L5.85 15.3499" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <h3>Xác nhận đăng xuất</h3>
                    <p>Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?</p>
                    <div className="modal-actions">
                        <Button className="cancel-btn" onClick={cancelLogout}>
                            Hủy
                        </Button>
                        <Button type="primary" className="confirm-btn" onClick={handleLogout}>
                            Đồng ý
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default HeaderComponent;
