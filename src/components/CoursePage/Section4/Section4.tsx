import React from 'react';
import styles from './Section4.module.css';
import blockColors from './data.tsx';

// Import image sources
import launchingAmico from './image/Launching-amico.png';
import missionImpossibleBro from './image/Mission Impossible-bro.png';
import searchEnginesRafiki from './image/Search engines-rafiki.png';
import roboticsPana from './image/Robotics-pana.png';

interface ContentData {
    title: string;
    description: string;
    imagePath: string;
}

const Section4: React.FC = () => {
    const contentData: ContentData[] = [
        {
            title: "Khóa Học Arduino Cơ Bản",
            description: "Khóa học này giới thiệu về Arduino, giúp học viên làm quen với các khái niệm cơ bản và lập trình các dự án đơn giản. Bạn sẽ học cách sử dụng board Arduino, kết nối cảm biến, và tạo ra các ứng dụng thú vị.",
            imagePath: launchingAmico
        },
        {
            title: "Khóa Học Arduino Nâng Cao",
            description: "Khóa học này hướng dẫn các kỹ thuật nâng cao với Arduino, bao gồm việc sử dụng các module phức tạp hơn như Bluetooth, Wi-Fi, và các hệ thống cảm biến đa dạng. Bạn sẽ phát triển các dự án thực tế để ứng dụng Arduino vào các giải pháp kỹ thuật.",
            imagePath: missionImpossibleBro
        },
        {
            title: "Khóa Học Arduino IoT (Internet of Things)",
            description: "Khóa học này tập trung vào việc kết nối Arduino với Internet để tạo ra các ứng dụng IoT. Bạn sẽ học cách giao tiếp với các thiết bị từ xa, thu thập dữ liệu và điều khiển thiết bị qua mạng.",
            imagePath: searchEnginesRafiki
        },
        {
            title: "Khóa Học Arduino Robotics",
            description: "Khóa học này sẽ dạy bạn cách xây dựng các robot tự động sử dụng Arduino. Bạn sẽ học về các cảm biến, động cơ, và các kỹ thuật điều khiển robot thông minh để thực hiện các nhiệm vụ tự động hóa.",
            imagePath: roboticsPana
        }
    ];

    const renderBlock = (blockId: number) => {
        const color = blockColors.find(color => color.id === blockId);
        const content = contentData[blockId - 1];

        if (!color || !content) return null;

        const blockStyle = {
            backgroundColor: color.blockBackground
        };

        const titleWrapperStyle = {
            backgroundColor: color.divBackground
        };

        const titleStyle = {
            backgroundColor: color.titleBackground
        };

        if (blockId === 1) {
            return (
                <div
                    key={blockId}
                    className={`${styles.block} ${styles.block1}`}
                    style={blockStyle}
                >
                    <div className={styles.imageContainer}>
                        <img src={content.imagePath} alt={content.title} className={styles.image} />
                    </div>
                    <div className={styles.content}>
                        <div className={styles.titleWrapper} style={titleWrapperStyle}>
                            <h3 className={styles.title} style={titleStyle}>{content.title}</h3>
                        </div>
                        <p className={styles.description}>{content.description}</p>
                    </div>
                </div>
            );
        }

        if (blockId === 4) {
            return (
                <div
                    key={blockId}
                    className={`${styles.block} ${styles.block4}`}
                    style={blockStyle}
                >
                    <div className={styles.imageContainer}>
                        <img src={content.imagePath} alt={content.title} className={styles.image} />
                    </div>
                    <div className={styles.content}>
                        <div className={styles.titleWrapper} style={titleWrapperStyle}>
                            <h3 className={styles.title} style={titleStyle}>{content.title}</h3>
                        </div>
                        <p className={styles.description}>{content.description}</p>
                    </div>
                </div>
            );
        }

        return (
            <div
                key={blockId}
                className={`${styles.block} ${styles[`block${blockId}`]}`}
                style={blockStyle}
            >
                <div className={styles.titleWrapper} style={titleWrapperStyle}>
                    <h3 className={styles.title} style={titleStyle}>{content.title}</h3>
                </div>
                <div className={styles.content}>
                    <div className={styles.imageContainer}>
                        <img src={content.imagePath} alt={content.title} className={styles.image} />
                    </div>
                    <p className={styles.description}>{content.description}</p>
                </div>
            </div>
        );
    };

    return (
        <section className={styles.section4}>
            <div className={styles.grid}>
                {[1, 2, 3, 4].map(blockId => renderBlock(blockId))}
            </div>
        </section>
    );
};

export default Section4;
