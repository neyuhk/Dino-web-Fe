import React from 'react';
import styles from './Footer.module.css';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <p>&copy; 2025 Arduino Classroom</p>
            <div className={styles.links}>
                <a href="#support">Hỗ trợ</a>
                <a href="#contact">Liên hệ giáo viên</a>
            </div>
        </footer>
    );
};

export default Footer;
