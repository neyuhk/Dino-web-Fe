import React, { useEffect, useRef, useState } from 'react';
import styles from './AboutUs.module.css';
import { RocketOutlined, ExperimentOutlined, ToolOutlined, TeamOutlined, MailOutlined, PhoneOutlined, GlobalOutlined } from '@ant-design/icons';

// Import media assets
import blockImage from './image/block-image.png';
import blockVideo from './image/block.mov';
import quizImage from './image/quiz.jpg';
import teacherImage from './image/teacher.png';

const AboutUs: React.FC = () => {
    const sectionRefs = {
        heroRef: useRef<HTMLElement>(null),
        missionRef: useRef<HTMLElement>(null),
        fieldsRef: useRef<HTMLElement>(null),
        storyRef: useRef<HTMLElement>(null),
        valuesRef: useRef<HTMLElement>(null),
        teamRef: useRef<HTMLElement>(null),
        contactRef: useRef<HTMLElement>(null),
        galleryRef: useRef<HTMLElement>(null),
    };

    useEffect(() => {
        const hash = window.location.hash;
        if (hash) {
            const element = document.querySelector(hash);
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center',
                    });
                }, 100);
            }
        }
    }, []);

    const [visibleSections, setVisibleSections] = useState<Record<string, boolean>>({
        hero: false,
        mission: false,
        fields: false,
        story: false,
        values: false,
        team: false,
        contact: false,
        gallery: false,
    });

    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.2,
        };

        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                const sectionName = entry.target.getAttribute('data-section');
                if (sectionName) {
                    setVisibleSections((prev) => ({
                        ...prev,
                        [sectionName]: entry.isIntersecting,
                    }));
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        Object.values(sectionRefs).forEach((ref) => {
            if (ref.current) {
                observer.observe(ref.current);
            }
        });

        return () => {
            observer.disconnect();
        };
    }, []);

    const getAnimationClass = (sectionName: string, delayClass?: string) => {
        return visibleSections[sectionName]
            ? `${styles.sectionAnimation} ${delayClass ? styles[delayClass] : ''}`
            : '';
    };

    return (
        <div className={styles.aboutContainer}>
            <section
                ref={sectionRefs.heroRef}
                data-section="hero"
                className={`${styles.heroSection} ${getAnimationClass('hero')}`}
            >
                <div className={styles.heroBackground}></div>
                <div className={styles.heroOverlay}></div>
                <div className={styles.heroContent}>
                    <h1 className={styles.mainTitle}>Về Chúng Tôi</h1>
                    <p className={styles.description}>
                        <strong>Nền tảng học lập trình kéo thả – hỗ trợ xuất mã ra phần cứng</strong> như Arduino.
                        Trang web được thiết kế dành cho học sinh, giáo viên và nhà trường, mang đến môi trường học tập
                        hiện đại, trực quan và dễ tiếp cận.
                    </p>
                    <p className={styles.description}>
                        Tại đây, học sinh có thể tham gia các <strong>khóa học lập trình</strong>, thực hành trực tiếp
                        với phần cứng, làm bài tập và theo dõi tiến độ.
                        Giáo viên có thể <strong>tạo và quản lý lớp học</strong>, giao bài tập, chấm điểm và hỗ trợ học
                        sinh trong quá trình học lập trình phần cứng.
                    </p>
                </div>
            </section>

            <section
                ref={sectionRefs.missionRef}
                data-section="mission"
                className={`${styles.missionSection} ${getAnimationClass('mission')}`}
            >
                <h2 className={styles.sectionTitle}>
                    <RocketOutlined className={styles.icon} /> Sứ Mệnh
                </h2>
                <p>Chúng tôi mong muốn đem đến:</p>
                <ul className={styles.missionList}>
                    <li>Trải nghiệm học lập trình đơn giản, sinh động, phù hợp với mọi học sinh.</li>
                    <li>Giải pháp hiệu quả cho giáo viên trong việc giảng dạy lập trình phần cứng.</li>
                    <li>Cầu nối giữa công nghệ và giáo dục hiện đại, thúc đẩy phong trào STEM trong trường học.</li>
                </ul>
            </section>

            <section
                ref={sectionRefs.fieldsRef}
                data-section="fields"
                className={`${styles.fieldsSection} ${getAnimationClass('fields')}`}
            >
                <h2 className={styles.sectionTitle}>
                    <ExperimentOutlined className={styles.icon} /> Lĩnh Vực Hoạt Động
                </h2>
                <div className={styles.fieldsGrid}>
                    <div className={`${styles.fieldCard} ${getAnimationClass('fields', 'animateDelay1')}`}>
                        <div className={styles.fieldIcon}>🎓</div>
                        <div className={styles.fieldTitle}>Giáo dục công nghệ (EdTech)</div>
                    </div>
                    <div className={`${styles.fieldCard} ${getAnimationClass('fields', 'animateDelay2')}`}>
                        <div className={styles.fieldIcon}>🧩</div>
                        <div className={styles.fieldTitle}>Lập trình kéo thả trực quan</div>
                    </div>
                    <div className={`${styles.fieldCard} ${getAnimationClass('fields', 'animateDelay1')}`}>
                        <div className={styles.fieldIcon}>🤖</div>
                        <div className={styles.fieldTitle}>Lập trình phần cứng (Arduino, IoT)</div>
                    </div>
                    <div className={`${styles.fieldCard} ${getAnimationClass('fields', 'animateDelay2')}`}>
                        <div className={styles.fieldIcon}>👨‍🏫</div>
                        <div className={styles.fieldTitle}>Hỗ trợ giáo viên và nhà trường</div>
                    </div>
                </div>
            </section>

            <section
                ref={sectionRefs.galleryRef}
                data-section="gallery"
                className={`${styles.gallerySection} ${getAnimationClass('gallery')}`}
            >
                <h2 className={styles.sectionTitle}>
                    <ExperimentOutlined className={styles.icon} /> Hình Ảnh & Video Minh Họa
                </h2>
                <div className={styles.galleryGrid}>
                    <div className={`${styles.galleryItem} ${getAnimationClass('gallery', 'animateDelay1')}`}>
                        <div className={styles.mediaWrapper}>
                            <img src={blockImage} alt="Học tập với block" />
                        </div>
                        <p>Học tập với Block</p>
                    </div>
                    <div className={`${styles.galleryItem} ${getAnimationClass('gallery', 'animateDelay1')}`}>
                        <div className={styles.mediaWrapper}>
                            <video autoPlay loop muted playsInline>
                                <source src={blockVideo} type="video/mp4" />
                                Trình duyệt của bạn không hỗ trợ video.
                            </video>
                        </div>
                        <p>Video demo trang học lập trình kéo thả</p>
                    </div>
                    <div className={`${styles.galleryItem} ${getAnimationClass('gallery', 'animateDelay1')}`}>
                        <div className={styles.mediaWrapper}>
                            <img src={quizImage} alt="Trang làm bài tập" />
                        </div>
                        <p>Học sinh đang làm bài tập</p>
                    </div>
                    <div className={`${styles.galleryItem} ${getAnimationClass('gallery', 'animateDelay1')}`}>
                        <div className={styles.mediaWrapper}>
                            <img src={teacherImage} alt="Giao diện quản lý lớp học" />
                        </div>
                        <p>Giao diện quản lý lớp học của giáo viên</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutUs;
