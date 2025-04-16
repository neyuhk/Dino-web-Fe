import React, { useEffect, useRef, useState } from 'react';
import styles from './AboutUs.module.css';
import { RocketOutlined, ExperimentOutlined, ToolOutlined, TeamOutlined, MailOutlined, PhoneOutlined, GlobalOutlined } from '@ant-design/icons';

const AboutUs: React.FC = () => {
    // Create refs for each section
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
                        block: 'center', // 👈 phần này giúp phần tử nằm giữa màn hình
                    });
                }, 100); // Chờ một chút để DOM render xong
            }
        }
    }, []);
    // State to track which sections are visible
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
        // Set up intersection observer
        const observerOptions = {
            root: null, // Use viewport as root
            rootMargin: '0px',
            threshold: 0.2, // 20% of the element must be visible
        };

        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                // Get the section name from the data attribute
                const sectionName = entry.target.getAttribute('data-section');

                if (sectionName) {
                    setVisibleSections(prev => ({
                        ...prev,
                        [sectionName]: entry.isIntersecting
                    }));
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        // Observe all sections
        Object.values(sectionRefs).forEach(ref => {
            if (ref.current) {
                observer.observe(ref.current);
            }
        });

        // Clean up on component unmount
        return () => {
            observer.disconnect();
        };
    }, []);

    // Helper function to get animation classes
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
                    <li>
                        Trải nghiệm học lập trình đơn giản, sinh động, phù hợp
                        với mọi học sinh.
                    </li>
                    <li>
                        Giải pháp hiệu quả cho giáo viên trong việc giảng dạy
                        lập trình phần cứng.
                    </li>
                    <li>
                        Cầu nối giữa công nghệ và giáo dục hiện đại, thúc đẩy
                        phong trào STEM trong trường học.
                    </li>
                </ul>
            </section>

            <section
                ref={sectionRefs.fieldsRef}
                data-section="fields"
                className={`${styles.fieldsSection} ${getAnimationClass('fields')}`}
            >
                <h2 className={styles.sectionTitle}>
                    <ExperimentOutlined className={styles.icon} /> Lĩnh Vực Hoạt
                    Động
                </h2>
                <div className={styles.fieldsGrid}>
                    <div className={`${styles.fieldCard} ${getAnimationClass('fields', 'animateDelay1')}`}>
                        <div className={styles.fieldIcon}>🎓</div>
                        <div className={styles.fieldTitle}>
                            Giáo dục công nghệ (EdTech)
                        </div>
                    </div>
                    <div className={`${styles.fieldCard} ${getAnimationClass('fields', 'animateDelay2')}`}>
                        <div className={styles.fieldIcon}>🧩</div>
                        <div className={styles.fieldTitle}>
                            Lập trình kéo thả trực quan
                        </div>
                    </div>
                    <div className={`${styles.fieldCard} ${getAnimationClass('fields', 'animateDelay1')}`}>
                        <div className={styles.fieldIcon}>🤖</div>
                        <div className={styles.fieldTitle}>
                            Lập trình phần cứng (Arduino, IoT)
                        </div>
                    </div>
                    <div className={`${styles.fieldCard} ${getAnimationClass('fields', 'animateDelay2')}`}>
                        <div className={styles.fieldIcon}>👨‍🏫</div>
                        <div className={styles.fieldTitle}>
                            Hỗ trợ giáo viên và nhà trường
                        </div>
                    </div>
                </div>
            </section>

            <section
                ref={sectionRefs.storyRef}
                data-section="story"
                className={`${styles.storySection} ${getAnimationClass('story')}`}
            >
                <h2 className={styles.sectionTitle}>
                    <ToolOutlined className={styles.icon} /> Câu Chuyện Hình
                    Thành
                </h2>

                <div className={`${styles.storyBlock} ${getAnimationClass('story', 'animateDelay1')}`}>
                    <h3>💡 Dự án bắt đầu như thế nào?</h3>
                    <p>
                        Chúng tôi là hai sinh viên trường{' '}
                        <strong>Đại học Công nghệ – UET</strong>, cùng thực hiện
                        dự án này như một phần của{' '}
                        <strong>khoá luận tốt nghiệp</strong>. Xuất phát từ đam
                        mê với lập trình phần cứng và mong muốn tạo ra điều gì
                        đó thật ý nghĩa cho giáo dục.
                    </p>
                </div>

                <div className={`${styles.storyBlock} ${getAnimationClass('story', 'animateDelay2')}`}>
                    <h3>🧩 Vấn đề chúng tôi muốn giải quyết</h3>
                    <ul>
                        <li>
                            Học sinh gặp khó khăn khi học lập trình phần cứng do
                            rào cản về cú pháp và công cụ.
                        </li>
                        <li>
                            Giáo viên thiếu nền tảng thuận tiện để giao bài,
                            hướng dẫn, theo dõi và đánh giá học sinh.
                        </li>
                    </ul>
                </div>

                <div className={`${styles.storyBlock} ${getAnimationClass('story', 'animateDelay3')}`}>
                    <h3>🚀 Hành trình phát triển</h3>
                    <p>
                        Từ những ngày đầu với bản phác thảo trên giấy, chúng tôi
                        đã liên tục cải tiến và xây dựng sản phẩm với tinh thần
                        học hỏi, sáng tạo và hướng tới người dùng. Dự án hiện
                        đang được hoàn thiện và trình hội đồng chấm tốt nghiệp.
                    </p>
                </div>
            </section>

            <section
                ref={sectionRefs.valuesRef}
                data-section="values"
                className={`${styles.valuesSection} ${getAnimationClass('values')}`}
            >
                <h2 className={styles.sectionTitle}>
                    <ExperimentOutlined className={styles.icon} /> Giá Trị Cốt
                    Lõi
                </h2>
                <div className={styles.valuesGrid}>
                    <div className={`${styles.valueCard} ${getAnimationClass('values', 'animateDelay1')}`}>
                        <div className={styles.valueIcon}>🎓</div>
                        <h3>Niềm tin vào giáo dục</h3>
                        <p>
                            Công nghệ nên phục vụ cho việc học tập dễ dàng và
                            thú vị hơn.
                        </p>
                    </div>
                    <div className={`${styles.valueCard} ${getAnimationClass('values', 'animateDelay2')}`}>
                        <div className={styles.valueIcon}>🧠</div>
                        <h3>Trải nghiệm người dùng là trung tâm</h3>
                        <p>
                            Dễ dùng, gọn gàng, phù hợp với học sinh và giáo
                            viên.
                        </p>
                    </div>
                    <div className={`${styles.valueCard} ${getAnimationClass('values', 'animateDelay3')}`}>
                        <div className={styles.valueIcon}>🌱</div>
                        <h3>Vì cộng đồng học tập</h3>
                        <p>
                            Hướng tới hỗ trợ trường học, giáo viên và các em học
                            sinh một cách hiệu quả, miễn phí và bền vững.
                        </p>
                    </div>
                </div>
            </section>

            <section
                ref={sectionRefs.teamRef}
                data-section="team"
                className={`${styles.teamSection} ${getAnimationClass('team')}`}
            >
                <h2 className={styles.sectionTitle}>
                    <TeamOutlined className={styles.icon} /> Nhóm Phát Triển
                </h2>
                <div className={styles.teamGrid}>
                    <div className={`${styles.teamCard} ${getAnimationClass('team', 'animateDelay1')}`}>
                        <div className={styles.teamMemberImg}>
                            <img
                                src="https://i.pinimg.com/736x/18/c2/96/18c29680423dc8ec13e290b7bd9917a5.jpg"
                                alt="Vũ Khánh Huyền"
                            />
                        </div>
                        <h3>Vũ Khánh Huyền</h3>
                        <p className={styles.teamRole}>frontend</p>
                        <p className={styles.teamDesc}>
                            Thiết kế và phát triển giao diện người dùng. Đam mê
                            UI/UX và mong muốn tạo ra trải nghiệm học tập trực
                            quan, dễ dùng.
                        </p>
                    </div>

                    <div className={`${styles.teamCard} ${getAnimationClass('team', 'animateDelay2')}`}>
                        <div className={styles.teamMemberImg}>
                            <img
                                src="https://i.pinimg.com/736x/2a/67/91/2a67914c6fd71a84ef102d395e929015.jpg"
                                alt="Nguyễn Bá Hoàng Kim"
                            />
                        </div>
                        <h3>Nguyễn Bá Hoàng Kim</h3>
                        <p className={styles.teamRole}>backend</p>
                        <p className={styles.teamDesc}>
                            Phụ trách hệ thống máy chủ, API và cơ sở dữ liệu.
                            Yêu thích phát triển phần mềm giáo dục và các giải
                            pháp học tập hiệu quả.
                        </p>
                    </div>
                </div>
                <p className={`${styles.teamNote} ${getAnimationClass('team', 'animateDelay3')}`}>
                    Cả hai đều là sinh viên năm cuối của{' '}
                    <strong>Đại học Công nghệ (UET)</strong>, với chung một khát
                    vọng: biến việc học lập trình phần cứng trở nên dễ dàng và
                    thú vị hơn bao giờ hết.
                </p>
            </section>

            <section
                ref={sectionRefs.contactRef}
                data-section="contact"
                id={'contact'}
                className={`${styles.contactSection} ${getAnimationClass('contact')}`}
            >
                <h2 className={styles.sectionTitle}>
                    <MailOutlined className={styles.icon} /> Liên Hệ
                </h2>
                <div className={styles.contactGrid}>
                    <div className={`${styles.contactItem} ${getAnimationClass('contact', 'animateDelay1')}`}>
                        <MailOutlined className={styles.contactIcon} />
                        <p>Email: lienhe@tenweb.com</p>
                    </div>
                    <div className={`${styles.contactItem} ${getAnimationClass('contact', 'animateDelay2')}`}>
                        <PhoneOutlined className={styles.contactIcon} />
                        <p>Số điện thoại: 0901 xxx xxx</p>
                    </div>
                    <div className={`${styles.contactItem} ${getAnimationClass('contact', 'animateDelay3')}`}>
                        <GlobalOutlined className={styles.contactIcon} />
                        <p>
                            Mạng xã hội: <a href="#">Facebook</a> •{' '}
                            <a href="#">YouTube</a> • <a href="#">TikTok</a>
                        </p>
                    </div>
                </div>
                <div className={`${styles.contactButton} ${getAnimationClass('contact', 'animateDelay3')}`}>
                    <button className={styles.primaryButton}>
                        Liên Hệ Ngay
                    </button>
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
                            <img
                                src="src/components/AboutUs/image/block-image.png"
                                alt="Học tập với block"
                            />
                        </div>
                        <p>Học tập với Block</p>
                    </div>

                    <div className={`${styles.galleryItem} ${getAnimationClass('gallery', 'animateDelay1')}`}>
                        <div className={styles.mediaWrapper}>
                            <video autoPlay loop muted playsInline>
                                <source
                                    src="/src/components/AboutUs/image/block.mov"
                                    type="video/mp4"
                                />
                                Trình duyệt của bạn không hỗ trợ video.
                            </video>
                        </div>
                        <p>Video demo trang học lập trình kéo thả</p>
                    </div>

                    <div className={`${styles.galleryItem} ${getAnimationClass('gallery', 'animateDelay1')}`}>
                        <div className={styles.mediaWrapper}>
                            <img
                                src="src/components/AboutUs/image/quiz.jpg"
                                alt="Trang làm bài tập"
                            />
                        </div>
                        <p>Học sinh đang làm bài tập</p>
                    </div>

                    <div className={`${styles.galleryItem} ${getAnimationClass('gallery', 'animateDelay1')}`}>
                        <div className={styles.mediaWrapper}>
                            <img
                                src="src/components/AboutUs/image/teacher.png"
                                alt="Giao diện quản lý lớp học"
                            />
                        </div>
                        <p>Giao diện quản lý lớp học của giáo viên</p>
                    </div>
                </div>
            </section>

        </div>
    )
};

export default AboutUs;