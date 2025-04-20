import React from 'react';
import styles from './Section5.module.css';

// Import image sources
import ic4 from './image/ic4.png';
import ss4 from './image/ss4.png';
import ic3 from './image/ic3.png';
import ss3 from './image/ss3.png';
import ic2 from './image/ic2.png';
import ss2 from './image/ss2.png';
import ic1 from './image/ic1.png';
import ss1 from './image/ss1.png';

interface RectangleProps {
    title: string;
    description: string;
    iconSrc: string;
    imageSrc: string;
    backgroundColor: string;
    textAlign: 'left' | 'right';
}

const Rectangle: React.FC<RectangleProps> = ({
                                                 title,
                                                 description,
                                                 iconSrc,
                                                 imageSrc,
                                                 backgroundColor,
                                                 textAlign,
                                             }) => {
    return (
        <a
            className={`${styles.rectangle} ${textAlign === 'right' ? styles.reverseLayout : ''}`}
            style={{ backgroundColor }}
        >
            <div
                className={`${styles.content} ${textAlign === 'right' ? styles.alignRight : styles.alignLeft}`}
            >
                <div className={styles.text}>
                    <h3 className={styles.title}>{title}</h3>
                    <p className={styles.description}>{description}</p>
                </div>

                <img src={iconSrc} alt="Icon" className={styles.icon} />
            </div>
            <div className={styles.imageContainer}>
                <div className={styles.imageWrapper}>
                    <img src={imageSrc} alt={title} className={styles.image} />
                </div>
            </div>
        </a>
    )
};

const Section5: React.FC = () => {
    const rectangles: RectangleProps[] = [
        {
            title: "Xếp hạng",
            description: "Tham gia diễn đàn để thảo luận, giải đáp thắc mắc của bạn",
            iconSrc: ic4,
            imageSrc: ss4,
            backgroundColor: "#BFF0DB",
            textAlign: "right",
        },
        {
            title: "Khoá học",
            description: "Tham khảo các dự án mẫu từ bạn bè của Dino ",
            iconSrc: ic3,
            imageSrc: ss3,
            backgroundColor: "#FAE0C1",
            textAlign: "left",
        },
        {
            title: "Diễn đàn",
            description: "Tham gia diễn đàn để thảo luận, giải đáp thắc mắc của bạn",
            iconSrc: ic2,
            imageSrc: ss2,
            backgroundColor: "#F3C5C5",
            textAlign: "right",
        },
        {
            title: "Dự án mẫu",
            description: "Tham khảo các dự án mẫu từ bạn bè của Dino ",
            iconSrc: ic1,
            imageSrc: ss1,
            backgroundColor: "#D6D2FF",
            textAlign: "left",
        }
    ];

    return (
        <section className={styles.section}>
            <h2 className={styles.mainTitle}>Dino gợi ý cho bạn</h2>
            <div className={styles.grid}>
                {rectangles.map((rectangle, index) => (
                    <Rectangle key={index} {...rectangle} />
                ))}
            </div>
        </section>
    );
};

export default Section5;
