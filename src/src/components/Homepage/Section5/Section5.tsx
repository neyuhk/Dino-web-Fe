import React from 'react';
import styles from './Section5.module.css';

interface RectangleProps {
    title: string;
    description: string;
    iconSrc: string;
    imageSrc: string;
    backgroundColor: string;
    textAlign: 'left' | 'right';
    href: string;
}

const Rectangle: React.FC<RectangleProps> = ({
                                                 title,
                                                 description,
                                                 iconSrc,
                                                 imageSrc,
                                                 backgroundColor,
                                                 textAlign,
                                                 href
                                             }) => {
    return (
        <a
            href={href}
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
            iconSrc: "src/components/Homepage/Section5/image/ic4.png",
            imageSrc: "src/components/Homepage/Section5/image/ss4.png",
            backgroundColor: "#BFF0DB",
            textAlign: "right",
            href: "#"
        },
        {
            title: "Khoá học",
            description: "Tham khảo các dự án mẫu từ bạn bè của Dino ",
            iconSrc: "src/components/Homepage/Section5/image/ic3.png",
            imageSrc: "src/components/Homepage/Section5/image/ss3.png",
            backgroundColor: "#FAE0C1",
            textAlign: "left",
            href: "courses"
        },
        {
            title: "Diễn đàn",
            description: "Tham gia diễn đàn để thảo luận, giải đáp thắc mắc của bạn",
            iconSrc: "src/components/Homepage/Section5/image/ic2.png",
            imageSrc: "src/components/Homepage/Section5/image/ss2.png",
            backgroundColor: "#F3C5C5",
            textAlign: "right",
            href: "#"
        },
        {
            title: "Dự án mẫu",
            description: "Tham khảo các dự án mẫu từ bạn bè của Dino ",
            iconSrc: "src/components/Homepage/Section5/image/ic1.png",
            imageSrc: "src/components/Homepage/Section5/image/ss1.png",
            backgroundColor: "#D6D2FF",
            textAlign: "left",
            href: "projects"
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