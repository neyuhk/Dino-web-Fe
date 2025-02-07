import React from 'react';
import styles from './Section2.module.css';

interface FeatureBoxProps {
    id: string;
    icon: string;
    text: string;
}

const FeatureBox: React.FC<FeatureBoxProps> = ({ id, icon, text }) => {
    // Xác định className tùy thuộc vào text
    const boxClass = id === 'eazyy' ? styles.easiness :
        id === 'fast' ? styles.speed :
            id === 'free' ? styles.free : '';

    return (
        <div id={id} className={`${styles.featureBox} ${boxClass}`}>
            <img src={icon} alt={text} className={styles.icon} />
            <p className={styles.text}>{text}</p>
        </div>
    );
};

const Section2: React.FC = () => {
    const features = [
        { id: 'eazyy', icon: 'src/components/Homepage/Section2/image/eazyy.png', text: 'Dễ dàng' },
        { id: 'fast', icon: 'src/components/Homepage/Section2/image/fast.png', text: 'Nhanh chóng' },
        { id: 'free', icon: 'src/components/Homepage/Section2/image/Freelancer.png', text: 'Miễn phí' },
    ];

    return (
        <section className={styles.section}>
            {/*<img*/}
            {/*    src="src/components/Homepage/Section1/image/dino-bgr.png"*/}
            {/*    alt="Background"*/}
            {/*    className={styles.backgroundImage}*/}
            {/*/>*/}
            <div className={styles.container}>
                <div className={styles.features}>
                    {features.map((feature) => (
                        <FeatureBox
                            key={feature.id}    // Sử dụng id làm key cho mỗi feature
                            id={feature.id}     // Truyền id cho từng FeatureBox
                            icon={feature.icon}
                            text={feature.text}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Section2;
