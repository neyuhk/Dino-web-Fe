import React, { useEffect, useRef } from 'react'
import styles from './HomePage2.module.css';
import Section4 from './Section4/Section4'
import Section3 from './Section3/Section3.tsx'
import Section5 from './Section5/Section5.tsx'
import { useNavigate } from 'react-router-dom'

const HomePage2 = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const exploreRef = useRef<HTMLDivElement | null>(null);
    const scrollToExplore = () => {
        if (exploreRef.current) {
            exploreRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add(styles.show);
                }
            },
            { threshold: 0.2 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, []);
    return (
        <div className={styles.container}>
            {/* Hero Section */}
            <section ref={sectionRef} className={styles.heroSection}>
                <div className={styles.heroContent}>
                    <h1 className={styles.titleGradient}>
                        Khám Phá Thế Giới IoT Cùng Chúng Tôi
                    </h1>
                    <p>
                        Nền tảng học tập lập trình IoT toàn diện dành cho giáo
                        viên và học sinh
                    </p>
                    <div className={styles.heroBtns}>
                        <button onClick={() => navigate('/blockly')} className={styles.primaryBtn}>
                            Bắt Đầu Ngay
                        </button>
                        <button onClick={() => {
                            const el = document.getElementById('explore-section');
                            el?.scrollIntoView({ behavior: 'smooth' });
                        }} className={styles.secondaryBtn}>
                            Khám Phá Thêm
                        </button>
                    </div>
                </div>
                <div className={styles.heroImage}>
                    <img
                        src="src/components/Homepage/image/homepage-ss1.png"
                        alt="Học sinh đang lập trình IoT"
                    />
                </div>
            </section>

            <Section5></Section5>
            {/* Explore Topics Section */}
            <section id={'explore-section'} className={styles.exploreSection}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.titleGradient}>
                        Khám Phá Chủ Đề Công Nghệ Tiên Tiến và Sáng Tạo
                    </h2>
                    <p>
                        Tìm hiểu các khái niệm IoT hiện đại thông qua các dự án
                        thực tế
                    </p>
                </div>

                <div className={styles.videoContainer}>
                    <div className={styles.videoCard}>
                        <div className={styles.videoWrapper}>
                            <video
                                src="https://cdn.shopify.com/videos/c/o/v/75910daba3ff479d81c38b1f6d21e397.mp4"
                                autoPlay
                                loop
                                muted
                                playsInline
                                className={styles.video}
                            />
                        </div>

                        <h3>Điện Tử và Robot</h3>
                        <p>
                            Khám phá cách kết hợp điện tử và robot để giải quyết
                            các vấn đề thực tế
                        </p>
                    </div>

                    <div className={styles.videoCard}>
                        <div className={styles.videoWrapper}>
                            <img
                                src="https://cdn.shopify.com/s/files/1/0869/7921/5672/files/Dive_into_the_world_of_coding.jpg?v=1715850105"
                                alt="Video lập trình IoT"
                            />
                            <div className={styles.playButton}></div>
                        </div>
                        <h3>Lập Trình IoT Cơ Bản</h3>
                        <p>
                            Bắt đầu hành trình IoT với các bài học dễ hiểu và
                            thực hành ngay
                        </p>
                    </div>

                    <div className={styles.videoCard}>
                        <div className={styles.videoWrapper}>
                            <img
                                src="https://cdn.shopify.com/s/files/1/0070/5901/3716/files/Hands-on_Learning_Cultivates_Creativity.jpg?v=1710989420"
                                alt="Video dự án STEAM"
                            />
                            <div className={styles.playButton}></div>
                        </div>
                        <h3>Dự Án STEAM</h3>
                        <p>
                            Tích hợp Khoa học, Công nghệ, Kỹ thuật, Nghệ thuật
                            và Toán học
                        </p>
                    </div>
                </div>
            </section>

            {/* Create Section */}
            <section className={styles.createSection}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.titleGradient}>
                        Xem Những Gì Bạn Có Thể Tạo Ra
                    </h2>
                    <p>
                        Từ ý tưởng đến dự án thực tế chỉ trong vài bước đơn giản
                    </p>
                </div>

                <div className={styles.projectShowcase}>
                    <div className={styles.projectVideo}>
                        <video
                            src="https://cdn.shopify.com/videos/c/o/v/d1c70af4f1964d528226fb90bd46198a.mp4"
                            autoPlay
                            loop
                            muted
                            playsInline
                            className={styles.video}
                        />
                        <div className={styles.playButton}></div>
                    </div>

                    <div className={styles.projectInfo}>
                        <h3>Dự Án Thông Minh</h3>
                        <p>
                            Học sinh từ khắp mọi nơi đã tạo ra các dự án IoT
                            thông minh và hữu ích cho cộng đồng. Khám phá cách
                            họ áp dụng kiến thức lập trình vào thực tế.
                        </p>
                        <button onClick={() => navigate('/projects')} className={styles.primaryBtn}>
                            Xem Thêm Dự Án
                        </button>
                    </div>
                </div>
            </section>

            {/* CyberPi Section */}
            <section className={styles.cyberpiSection}>
                <div className={styles.cyberpiContent}>
                    <h2 className={styles.titleGradient}>
                        Với Dino, Trí Tưởng Tượng Là Giới Hạn Duy Nhất
                    </h2>
                    <p>
                        Khám phá vô số khả năng sáng tạo với bộ công cụ lập
                        trình IoT toàn diện của chúng tôi
                    </p>
                    <ul className={styles.featureList}>
                        <li>Lập trình trực quan bằng các khối mã</li>
                        <li>Kết nối với nhiều cảm biến và thiết bị</li>
                        <li>
                            Tương thích với Arduino và các nền tảng phổ biến
                        </li>
                    </ul>
                    <button onClick={() => {
                        navigate('/our-product');
                        window.scrollTo({ top: 0, behavior: 'smooth' }); // hoặc 'auto'
                    }} className={styles.primaryBtn}>
                        Tìm Hiểu Về Dino
                    </button>
                </div>

                <div className={styles.cyberpiGallery}>
                    <img
                        src="https://cdn.shopify.com/s/files/1/0869/7921/5672/files/Beginner_s_Guide.jpg?v=1718967395"
                        alt="CyberPi project 1"
                        className={styles.galleryImg}
                    />
                    <img
                        src="https://cdn.shopify.com/s/files/1/0070/5901/3716/files/STEM_Toys_and_Robot_Kits.jpg?v=1712546448"
                        alt="CyberPi project 2"
                        className={styles.galleryImg}
                    />
                    <img
                        src="https://cdn.shopify.com/s/files/1/0070/5901/3716/files/Hands-on_Learning_Cultivates_Creativity.jpg?v=1710989420"
                        alt="CyberPi project 3"
                        className={styles.galleryImg}
                    />
                    <img
                        src="https://cdn.shopify.com/s/files/1/0070/5901/3716/files/Product_Trial.jpg?v=1711012385"
                        alt="CyberPi project 4"
                        className={styles.galleryImg}
                    />
                </div>
            </section>

            <Section3></Section3>
            {/* School Offers Section */}
            <section className={styles.schoolOffersSection}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.titleGradient}>
                        Ưu Đãi Đặc Biệt Cho Trường Học
                    </h2>
                    <p>
                        Giải pháp toàn diện cho việc tích hợp IoT vào chương
                        trình giảng dạy
                    </p>
                </div>

                <div className={styles.offersContainer}>
                    <div className={styles.offerCard}>
                        <img
                            src="https://cdn.shopify.com/s/files/1/0070/5901/3716/files/Grants_Guide_to_Contribute_30f4a837-9611-456b-9405-bbc886f4bc09.jpg?v=1711003942"
                            alt="Tài liệu giảng dạy"
                            className={styles.offerIcon}
                        />
                        <h3>Tài Liệu Giảng Dạy</h3>
                        <p>
                            Giáo án chi tiết, bài tập và hướng dẫn thực hành
                            dành cho giáo viên
                        </p>
                    </div>

                    <div className={styles.offerCard}>
                        <img
                            src="https://cdn.shopify.com/s/files/1/0070/5901/3716/files/About_Makeblock.jpg?v=1709020921"
                            alt="Bộ công cụ lớp học"
                            className={styles.offerIcon}
                        />
                        <h3>Bộ Công Cụ Lớp Học</h3>
                        <p>
                            Thiết bị và phần mềm đầy đủ cho lớp học với 20-30
                            học sinh
                        </p>
                    </div>

                    <div className={styles.offerCard}>
                        <img
                            src="https://cdn.shopify.com/s/files/1/0070/5901/3716/files/User_graph_8.jpg?v=1709020920"
                            alt="Đào tạo giáo viên"
                            className={styles.offerIcon}
                        />
                        <h3>Đào Tạo Giáo Viên</h3>
                        <p>
                            Chương trình đào tạo trực tuyến và trực tiếp cho đội
                            ngũ giáo viên
                        </p>
                    </div>

                    <div className={styles.offerCard}>
                        <img
                            src="https://cdn.shopify.com/s/files/1/0070/5901/3716/files/Support_Center.jpg?v=1711012385"
                            alt="Hỗ trợ kỹ thuật"
                            className={styles.offerIcon}
                        />
                        <h3>Hỗ Trợ Kỹ Thuật</h3>
                        <p>
                            Đội ngũ chuyên gia hỗ trợ kỹ thuật 24/7 cho mọi vấn
                            đề
                        </p>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}

            <section className={styles.testimonialsSection}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.titleGradient}>
                        Nhà Giáo Dục Yêu Thích Chúng Tôi
                    </h2>
                    <p>
                        Những đánh giá từ giáo viên và học sinh đã sử dụng nền
                        tảng của chúng tôi
                    </p>
                </div>

                <div className={styles.testimonialCards}>
                    <div className={styles.testimonialCard}>
                        <div className={styles.testimonialContent}>
                            <p>
                                "Nền tảng này đã giúp học sinh của tôi hiểu rõ
                                hơn về IoT và ứng dụng thực tế. Các em rất hào
                                hứng và sáng tạo trong mỗi dự án."
                            </p>
                        </div>
                        <div className={styles.testimonialAuthor}>
                            <img
                                src="https://scontent.fhan14-1.fna.fbcdn.net/v/t1.6435-9/46514352_810958672572403_7563036778001596416_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=833d8c&_nc_ohc=sKhGe0NXDjMQ7kNvwEDXhJJ&_nc_oc=Adni4T1BYtK7-1Ndl-PSMqaUbWEI_WcGAIMP2Y7vCvr768fw2nTmj0emwnZwYhuwlnA&_nc_pt=1&_nc_zt=23&_nc_ht=scontent.fhan14-1.fna&_nc_gid=3p0eP6j2eUmXltab2fCl7A&oh=00_AfH7qPRzDopO9lmxJMOrI_yBh479TITogSnMKaFGe7i_4g&oe=68240B15"
                                alt="Avatar"
                                className={styles.authorAvatar}
                            />
                            <div>
                                <h4>Cô Trương Thị Tiến</h4>
                                <p>
                                    Giáo viên Tin học, Trường THPT Chuyên Sơn La
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className={styles.testimonialCard}>
                        <div className={styles.testimonialContent}>
                            <p>
                                "Tài liệu giảng dạy rất chi tiết và dễ hiểu. Tôi
                                có thể nhanh chóng áp dụng vào lớp học mà không
                                cần nhiều thời gian chuẩn bị."
                            </p>
                        </div>
                        <div className={styles.testimonialAuthor}>
                            <img
                                src="https://scontent.fhan14-5.fna.fbcdn.net/v/t39.30808-6/472756579_1546237986767644_7766063904131055002_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=a5f93a&_nc_ohc=cfbMyTBlaosQ7kNvwHo6c-S&_nc_oc=Adk-7hJxLW8j5gMVUruWVXn1SUG5rUG3OeIPesbpRSe0AeEM26G9X1A-SCWtHVkLFSE&_nc_pt=1&_nc_zt=23&_nc_ht=scontent.fhan14-5.fna&_nc_gid=vUfIigrI1pGfeo8QhtaT9Q&oh=00_AfEeQLH3uSLJjVxSSPx2lUluFuvn-7DUb1HB3FCckesdhQ&oe=68028440"
                                alt="Avatar"
                                className={styles.authorAvatar}
                            />
                            <div>
                                <h4>Cô Nguyễn Huyền Châu</h4>
                                <p>
                                    Giáo viên STEM, Trường PTDTNT Huyện Yên Châu
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className={styles.testimonialCard}>
                        <div className={styles.testimonialContent}>
                            <p>
                                "Chúng tôi rất ấn tượng với hệ thống học lập
                                trình mới. Đây chắc chắn là bước tiến quan trọng
                                trong việc đổi mới phương pháp dạy và học."
                            </p>
                        </div>
                        <div className={styles.testimonialAuthor}>
                            <img
                                src="https://scontent.fhan14-3.fna.fbcdn.net/v/t39.30808-6/483593034_3984450625126786_8647156293972212944_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=833d8c&_nc_ohc=NQ8-lUnQMBUQ7kNvwE-tIuh&_nc_oc=Adm3muI3iNGZufgvxpGni65_5klNdKwMZ-VbBSGSrnNicIc0QkRaoLn5luRuHmO4GRE&_nc_pt=1&_nc_zt=23&_nc_ht=scontent.fhan14-3.fna&_nc_gid=jCv_98HVlTcBKjTNxp5x-Q&oh=00_AfFxORcLLkFg_B1vLNCNHJYz6KJ-2ivGvsb_NcHEEF-NxQ&oe=68026E11"
                                alt="Avatar"
                                className={styles.authorAvatar}
                            />
                            <div>
                                <h4>Bà Lê Thị Hương</h4>
                                <p>Hiệu trưởng, Trường Tiểu học Thăng Long</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Section4></Section4>
            {/* Call to Action */}
            <section className={styles.ctaSection}>
                <h2>Sẵn Sàng Đưa IoT Vào Lớp Học Của Bạn?</h2>
                <p>Đăng ký ngay để nhận tư vấn miễn phí và bộ tài liệu mẫu</p>
                <div className={styles.ctaForm}>
                    <button onClick={() => {
                        navigate('/about-us');
                        window.scrollTo({ top: 0, behavior: 'smooth' }); // hoặc 'auto'
                    }}
                            className={styles.primaryBtn}>Liên hệ ngay</button>
                </div>
            </section>
        </div>
    )
};

export default HomePage2;