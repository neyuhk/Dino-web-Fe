import React, { useState } from 'react';
import styles from './Section2.module.css';

interface FeatureBoxProps {
    id: string;
    icon: string;
    text: string;
    description: string;
}

const FeatureBox: React.FC<FeatureBoxProps> = ({ id, icon, text, description }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    // Determine className based on the text
    const boxClass = id === 'eazyy' ? styles.easiness :
        id === 'fast' ? styles.speed :
            id === 'free' ? styles.free : '';

    const handleClick = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div
            id={id}
            className={`${styles.featureBox} ${boxClass} ${isExpanded ? styles.expanded : ''}`}
            onClick={handleClick}
        >
            <img src={icon} alt={text} className={styles.icon} />
            <p className={styles.text}>{text}</p>

            {isExpanded && (
                <div className={styles.detailsContainer}>
                    <p className={styles.detailText}>{description}</p>
                </div>
            )}

            <div className={styles.pulseIndicator}>
                <span>{isExpanded ? 'Thu gọn' : 'Xem chi tiết'}</span>
            </div>
        </div>
    );
};

const Section2: React.FC = () => {
    const features = [
        {
            id: 'eazyy',
            icon: 'src/components/Homepage/Section2/image/eazyy.png',
            text: 'Dễ dàng',
            description: 'Giao diện kéo thả trực quan, không cần kiến thức lập trình phức tạp. Thích hợp cho mọi lứa tuổi và trình độ.'
        },
        {
            id: 'fast',
            icon: 'src/components/Homepage/Section2/image/fast.png',
            text: 'Nhanh chóng',
            description: 'Chuyển đổi code tức thì, tải lên thiết bị nhanh chóng. Tiết kiệm thời gian với các mẫu có sẵn và hỗ trợ trực tuyến.'
        },
        {
            id: 'free',
            icon: 'src/components/Homepage/Section2/image/Freelancer.png',
            text: 'Miễn phí',
            description: 'Hoàn toàn miễn phí để sử dụng. Bao gồm thư viện mã nguồn mở, hướng dẫn và tài nguyên học tập không giới hạn.'
        },
    ];

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.features}>
                    {features.map((feature) => (
                        <FeatureBox
                            key={feature.id}
                            id={feature.id}
                            icon={feature.icon}
                            text={feature.text}
                            description={feature.description}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Section2;