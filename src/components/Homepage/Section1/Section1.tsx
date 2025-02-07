import React from 'react';
import styles from './Section1.module.css';
import ButtonGradient from '../../ButtonGradient/ButtonGradient.tsx'

const Section1: React.FC = () => {
    return (
        <div className={styles.section1}>
            {/*<img*/}
            {/*    src="src/components/Homepage/Section1/image/dino-bgr.png"*/}
            {/*    alt="Background"*/}
            {/*    className={styles.backgroundImage}*/}
            {/*/>*/}
            <div className={styles.container}>
                {/* Left Section */}
                <div className={styles.leftSection}>
                    <div className={styles.textContainer}>
                        <div className={styles.titleContainer}>
                            <h1 className={styles.title}>Hello, I'm Dino</h1>
                            <img
                                src="src/components/Homepage/Section1/image/dino.png"
                                alt="Small Icon"
                                className={styles.titleIcon}
                            />
                        </div>

                        <p className={styles.description}>
                            Bắt đầu sáng tạo cùng Dino và khám phá thế giới IoT ngay
                            hôm nay!
                        </p>

                        <div className={styles.buttonContainer}>
                            <ButtonGradient text="Đăng ký" />
                            <ButtonGradient text="Đăng nhập" />
                        </div>
                    </div>

                </div>

                {/* Right Section */}
                <div className={styles.rightSection}>
                    <img
                        src="src/components/Homepage/Section1/image/homepage-ss1.png"
                        alt="Overlay"
                        className={styles.overlayImage}
                    />
                </div>
            </div>
        </div>

    )
};

export default Section1;
