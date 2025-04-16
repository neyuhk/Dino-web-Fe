// Section1.tsx with animations
import React, { useEffect, useRef } from 'react';
import styles from './Section1.module.css';
import ButtonGradient from '../../ButtonGradient/ButtonGradient.tsx'
import { useSelector } from 'react-redux';

const Section1: React.FC = () => {
    const { isAuthenticated, user} = useSelector((state: any) => state.auth);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const descRef = useRef<HTMLParagraphElement>(null);
    const dinoRef = useRef<HTMLImageElement>(null);
    const rightImageRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        // Animate elements when component mounts
        const title = titleRef.current;
        const desc = descRef.current;
        const dino = dinoRef.current;
        const rightImage = rightImageRef.current;

        if (title && desc && dino && rightImage) {
            // Initial states
            title.style.opacity = '0';
            title.style.transform = 'translateY(20px)';
            desc.style.opacity = '0';
            desc.style.transform = 'translateY(20px)';
            dino.style.opacity = '0';
            dino.style.transform = 'translateX(-20px) rotate(-10deg)';
            rightImage.style.opacity = '0';
            rightImage.style.transform = 'translateX(20px)';

            // Animate title
            setTimeout(() => {
                title.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                title.style.opacity = '1';
                title.style.transform = 'translateY(0)';
            }, 300);

            // Animate dino icon
            setTimeout(() => {
                dino.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                dino.style.opacity = '1';
                dino.style.transform = 'translateX(0) rotate(0)';
            }, 800);

            // Animate description
            setTimeout(() => {
                desc.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                desc.style.opacity = '1';
                desc.style.transform = 'translateY(0)';
            }, 1200);

            // Animate right image
            setTimeout(() => {
                rightImage.style.transition = 'opacity 1s ease, transform 1s ease';
                rightImage.style.opacity = '1';
                rightImage.style.transform = 'translateX(0)';
            }, 600);
        }
    }, []);

    return (
        <div className={styles.section1}>
            <div className={styles.container}>
                {/* Left Section */}
                <div className={styles.leftSection}>
                    <div className={styles.textContainer}>
                        <div className={styles.titleContainer}>
                            <h1 ref={titleRef} className={styles.title}>Hello, I'm Dino</h1>
                            <img
                                ref={dinoRef}
                                src="src/components/Homepage/Section1/image/dino.png"
                                alt="Small Icon"
                                className={styles.titleIcon}
                            />
                        </div>

                        <p ref={descRef} className={styles.description}>
                            Bắt đầu sáng tạo cùng Dino và khám phá thế giới IoT ngay
                            hôm nay!
                        </p>

                        {!isAuthenticated ? (<div className={styles.buttonContainer}>
                            <ButtonGradient text="Đăng ký" />
                            <ButtonGradient text="Đăng nhập" />
                        </div>) : null}
                    </div>
                </div>

                {/* Right Section */}
                <div className={styles.rightSection}>
                    <img
                        ref={rightImageRef}
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