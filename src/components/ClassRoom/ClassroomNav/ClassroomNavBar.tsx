import React from 'react';
import { Link } from 'react-router-dom';
import styles from './ClassroomNavBar.module.css';

const Header = () => {
    return (
        <header className={styles.header}>
            <div className={styles.logo}>
                <img src="/api/placeholder/50/50" alt="Arduino Logo" />
                <h1>Arduino Classroom</h1>
            </div>
            <nav className={styles.nav}>
                <Link to="/lectures" className={styles.navLink}>Bài giảng</Link>
                <Link to="/exercises" className={styles.navLink}>Bài tập</Link>
                <Link to="/grades" className={styles.navLink}>Điểm số</Link>
            </nav>
        </header>
    );
};

export default Header;
