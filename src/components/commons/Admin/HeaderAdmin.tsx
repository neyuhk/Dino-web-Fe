import { Avatar, Button, Dropdown, Modal } from 'antd'
import { UserOutlined, LogoutOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import { PATHS } from '../../../router/path.ts'
import React, { useState } from 'react'
import { logout } from '../../../stores/authSlice.ts'
import { AppDispatch } from '../../../stores'
import { Link, useNavigate } from 'react-router-dom'
import styles from './HeaderAdmin.module.css'
import dinoLogo from '../../../assets/dinologo-nobgr.png'

const HeaderAdmin = () => {
    const { isAuthenticated } = useSelector((state: any) => state.auth)
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();

    const confirmLogout = () => {
        setShowLogoutModal(true);
    };

    const handleLogout = async () => {
        console.log('Đăng xuất')
        dispatch(logout());
        setShowLogoutModal(false);
        window.location.href = PATHS.AUTH;
    };

    const cancelLogout = () => {
        setShowLogoutModal(false);
    };

    const dropdownItems = [
        {
            key: 'profile',
            label: (
                <div className={styles.menuItem}>
                    <UserOutlined />
                    <span>Trang cá nhân</span>
                </div>
            ),
            onClick: () => navigate('/profile')
        },
        {
            key: 'logout',
            label: (
                <div className={styles.menuItem}>
                    <LogoutOutlined />
                    <span>Đăng xuất</span>
                </div>
            ),
            onClick: confirmLogout
        }
    ];

    return (
        <header className={styles.headerContainer}>
            <div className={styles.logoSection}>
                <img
                    src={dinoLogo}
                    alt="Logo"
                    className={styles.logo}
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate('/')}
                />
                <h2 className={styles.logoText}>Hệ Thống Quản Trị</h2>
            </div>

            <div className={styles.userSection}>
                {isAuthenticated ? (
                    <Dropdown
                        menu={{ items: dropdownItems }}
                        placement="bottomRight"
                        trigger={['click']}
                    >
                        <div className={styles.userInfo}>
                            <Avatar
                                icon={<UserOutlined />}
                                className={styles.avatar}
                                size="large"
                            />
                            <span className={styles.username}>Admin</span>
                        </div>
                    </Dropdown>
                ) : (
                    <Button
                        type="primary"
                        className={styles.loginButton}
                        onClick={() => navigate('/auth')}
                    >
                        Đăng nhập
                    </Button>
                )}
            </div>

            <Modal
                open={showLogoutModal}
                onCancel={cancelLogout}
                footer={null}
                centered
                closable={false}
                width={400}
                className={styles.logoutModal}
            >
                <div className={styles.modalContent}>
                    <div className={styles.modalIcon}>
                        <LogoutOutlined />
                    </div>
                    <h3 className={styles.modalTitle}>Xác nhận đăng xuất</h3>
                    <p className={styles.modalText}>
                        Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?
                    </p>
                    <div className={styles.modalActions}>
                        <Button
                            className={styles.cancelButton}
                            onClick={cancelLogout}
                        >
                            Hủy bỏ
                        </Button>
                        <Button
                            type="primary"
                            className={styles.confirmButton}
                            onClick={handleLogout}
                        >
                            Đồng ý
                        </Button>
                    </div>
                </div>
            </Modal>
        </header>
    )
}

export default HeaderAdmin