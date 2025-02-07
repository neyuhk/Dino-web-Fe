// Header.tsx
import React from 'react';
import styles from './LearningPlatform.module.css';

const Header = ({ setActiveSection, activeSection }: { setActiveSection: Function, activeSection: string }) => {
    const menuItems = [
        { id: 'courses', label: 'Khóa học' },
        { id: 'assignments', label: 'Bài tập' },
        { id: 'grades', label: 'Bảng điểm' },
        { id: 'profile', label: 'Tài khoản' },
    ];

    return (
        <nav className={styles.navbar}>
            <div className={styles.navContainer}>
                <div className={styles.logo}>
                    <span className={styles.logoText}>Dino Learn</span>
                </div>

                <div className={styles.menu}>
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            className={`${styles.menuItem} ${activeSection === item.id ? styles.active : ''}`}
                            onClick={() => setActiveSection(item.id)}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default Header;
