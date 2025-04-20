import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './RequireAuth.module.css';
import { PATHS } from '../../../router/path.ts'
import { useSelector } from 'react-redux'

const RequireAuth: React.FC = () => {
    const {user} = useSelector((state: any) => state.auth);
    const navigate = useNavigate();
    if (user && user.role !== "admin") {
        return (
            <div className={styles.container}>
                <div className={styles.content}>
                    <div className={styles.imageWrapper}>
                        <img
                            src="https://i.pinimg.com/originals/de/c3/9f/dec39fb225fd16cdce4562a10c520549.gif"
                            alt="Security illustration"
                            className={styles.image}
                        />
                    </div>

                    <h1 className={styles.title}> Bạn không phải quản trị viên </h1>

                    <p className={styles.description}>
                        Vui lòng đăng nhập tài khoản quản lý để tiếp tục truy cập nội dung này
                    </p>

                    <button
                        className={styles.loginButton}
                        onClick={() => navigate(PATHS.AUTH)}
                    >
                        Đăng nhập ngay
                        <span className={styles.arrow}>→</span>
                    </button>
                </div>
            </div>
        )
    }
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.imageWrapper}>
                    <img
                        src="https://i.pinimg.com/originals/de/c3/9f/dec39fb225fd16cdce4562a10c520549.gif"
                        alt="Security illustration"
                        className={styles.image}
                    />
                </div>

                <h1 className={styles.title}> Bạn cần đăng nhập</h1>

                <p className={styles.description}>
                    Vui lòng đăng nhập để tiếp tục truy cập nội dung này
                </p>

                <button
                    className={styles.loginButton}
                    onClick={() => navigate(PATHS.AUTH)}
                >
                    Đăng nhập ngay
                    <span className={styles.arrow}>→</span>
                </button>
            </div>
        </div>
    )
};

export default RequireAuth;