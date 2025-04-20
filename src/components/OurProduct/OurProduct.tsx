import React, { useState, useEffect } from 'react'
import styles from './OurProduct.module.css'
import { useNavigate } from 'react-router-dom'
import blockVideo from '../AboutUs/image/block.mov'
import schoolImage from './image/school.png'
import dinoBgr from './image/dino-bgr.png'

const OurProduct = () => {
    const navigate = useNavigate()
    const [isVisible, setIsVisible] = useState({
        hero: false,
        features: false,
        audiences: false,
        testimonials: false,
        courses: false,
        schools: false,
        advantages: false,
        demo: false,
        roadmap: false,
        cia: true,
    })

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(prev => ({
                            ...prev,
                            [entry.target.id]: true,
                        }))
                    }
                })
            },
            { threshold: 0.3 },
        )

        const sections = document.querySelectorAll('[id]')
        sections.forEach((section) => {
            observer.observe(section)
        })

        return () => {
            sections.forEach((section) => {
                observer.unobserve(section)
            })
        }
    }, [])

    return (
        <div className={styles.container}
             style={{
                 backgroundImage: `url(${dinoBgr})`,
             }}>
            {/* Hero Section */}
            <section
                id="hero"
                className={`${styles.heroSection} ${isVisible.hero ? styles.visible : ''}`}
            >
                <div className={styles.heroContent}>
                    <h1>
                        <span className={styles.gradientText}>
                            Học lập trình phần cứng
                        </span>
                        <span className={styles.subtitle}>
                            dễ dàng, trực quan với công cụ kéo thả
                        </span>
                    </h1>
                    <p className={styles.heroParagraph}>
                        Biến ý tưởng thành hiện thực với nền tảng học lập trình
                        phần cứng trực quan dành cho mọi lứa tuổi. Không cần
                        kiến thức lập trình phức tạp!
                    </p>
                    <div className={styles.ctaButtons}>
                        <button onClick={() => navigate('/courses')} className={styles.primaryButton}>
                            Bắt đầu học ngay
                        </button>
                        <button onClick={() => navigate('/blockly')} className={styles.secondaryButton}>
                            Dùng thử miễn phí
                        </button>
                    </div>
                </div>
                <div className={styles.heroImageContainer}>
                    <div className={styles.heroImage}>
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            className={styles.heroSectionVideo}
                        >
                            <source
                                src={blockVideo}
                                type="video/mp4"
                            />
                            Trình duyệt của bạn không hỗ trợ video.
                        </video>
                    </div>
                </div>
            </section>

            {/* Key Features */}
            <section
                id="features"
                className={`${styles.featuresSection} ${isVisible.features ? styles.visible : ''}`}
            >
                <h2 className={styles.sectionTitle}>Tính năng nổi bật</h2>
                <div className={styles.featuresGrid}>
                    {[
                        {
                            icon: '🧩',
                            title: 'Kéo thả dễ dàng',
                            description:
                                'Giao diện trực quan như Scratch, phù hợp với mọi lứa tuổi',
                        },
                        {
                            icon: '📟',
                            title: 'Xuất mã đa nền tảng',
                            description:
                                'Hỗ trợ Arduino, ESP32, và các thiết bị IoT phổ biến',
                        },
                        {
                            icon: '✅',
                            title: 'Học và đánh giá tự động',
                            description:
                                'Bài tập tương tác, chấm điểm tự động giúp theo dõi tiến độ',
                        },
                        {
                            icon: '👨‍🏫',
                            title: 'Quản lý lớp học',
                            description:
                                'Công cụ dành cho giáo viên quản lý học sinh và nội dung bài giảng',
                        },
                    ].map((feature, index) => (
                        <div key={index} className={styles.featureCard}>
                            <div className={styles.featureIcon}>
                                {feature.icon}
                            </div>
                            <h3>{feature.title}</h3>
                            <p>{feature.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Who it's for */}
            <section
                id="audiences"
                className={`${styles.audiencesSection} ${isVisible.audiences ? styles.visible : ''}`}
            >
                <h2 className={styles.sectionTitle}>Dành cho ai?</h2>
                <div className={styles.audienceContainer}>
                    <div className={styles.audienceItem}>
                        <div className={styles.audienceImageContainer}>
                            <img
                                src="https://cdn.shopify.com/s/files/1/0070/5901/3716/files/About_Makeblock.jpg?v=1709020921"
                                alt="Học sinh đang lập trình với giao diện kéo thả"
                                width="300"
                                height="200"
                            />
                        </div>
                        <h3>Học sinh</h3>
                        <p>
                            Từ tiểu học đến THPT, không cần kinh nghiệm lập
                            trình trước đó
                        </p>
                    </div>
                    <div className={styles.audienceItem}>
                        <div className={styles.audienceImageContainer}>
                            <img
                                src="https://cdn.shopify.com/s/files/1/0070/5901/3716/files/free_basic_courses_1.jpg?v=1715332075"
                                alt="Giáo viên đang dạy"
                                width={300}
                                height={200}
                            />
                        </div>
                        <h3>Giáo viên</h3>
                        <p>
                            Dạy công nghệ và STEM với công cụ trực quan, dễ
                            triển khai
                        </p>
                    </div>
                    <div className={styles.audienceItem}>
                        <div className={styles.audienceImageContainer}>
                            <img
                                src="https://cdn.shopify.com/s/files/1/0070/5901/3716/files/User_graph_8.jpg?v=1709020920"
                                alt="Trường học"
                                width={300}
                                height={200}
                            />
                        </div>
                        <h3>Trường học</h3>
                        <p>
                            Giải pháp toàn diện cho việc triển khai giáo dục
                            STEM và lập trình
                        </p>
                    </div>
                </div>
            </section>

            {/* Demo Video */}
            <section
                id="demo"
                className={`${styles.demoSection} ${isVisible.demo ? styles.visible : ''}`}
            >
                <h2 className={styles.sectionTitle}>Xem cách hoạt động</h2>
                <div className={styles.videoContainer}>
                    <div className={styles.videoPlaceholder}>
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            className={styles.demoSectionVideo}
                        >
                            <source
                                src={blockVideo}
                                type="video/mp4"
                            />
                            Trình duyệt của bạn không hỗ trợ video.
                        </video>
                        <div className={styles.playButton}>▶</div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section
                id="testimonials"
                className={`${styles.testimonialsSection} ${isVisible.testimonials ? styles.visible : ''}`}
            >
                <h2 className={styles.sectionTitle}>Cảm nhận từ người dùng</h2>
                <div className={styles.testimonialContainer}>
                    {[
                        {
                            content:
                                'Phần mềm giúp các em học sinh của tôi hiểu được lập trình phần cứng một cách dễ dàng. Chỉ sau vài tuần, các em đã có thể tự làm các dự án nhỏ!',
                            author: 'Cô Minh Nguyệt',
                            role: 'Giáo viên THCS Nguyễn Huệ',
                        },
                        {
                            content:
                                'Con trai tôi 10 tuổi đã có thể tự lập trình đèn LED nhấp nháy và cảm biến nhiệt độ. Thật tuyệt vời khi thấy con hứng thú với công nghệ từ sớm.',
                            author: 'Anh Tuấn Anh',
                            role: 'Phụ huynh học sinh',
                        },
                        {
                            content:
                                'Triển khai nền tảng này giúp trường chúng tôi tiết kiệm thời gian và chi phí đào tạo giáo viên. Học sinh rất thích thú với các dự án thực tế.',
                            author: 'Thầy Đức Thắng',
                            role: 'Hiệu trưởng THPT Chu Văn An',
                        },
                    ].map((testimonial, index) => (
                        <div key={index} className={styles.testimonialCard}>
                            <div className={styles.quote}>"</div>
                            <p>{testimonial.content}</p>
                            <div className={styles.testimonialAuthor}>
                                <strong>{testimonial.author}</strong>
                                <span>{testimonial.role}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* For Schools */}
            <section
                id="schools"
                className={`${styles.schoolsSection} ${isVisible.schools ? styles.visible : ''}`}
            >
                <h2 className={styles.sectionTitle}>Dành cho nhà trường</h2>
                <div className={styles.schoolsContent}>
                    <div className={styles.schoolsInfo}>
                        <h3>Giải pháp toàn diện cho giáo dục STEM</h3>
                        <ul className={styles.schoolsList}>
                            <li>
                                Chương trình học tùy chỉnh theo khung chương
                                trình giáo dục
                            </li>
                            <li>Quản lý lớp học và học sinh hiệu quả</li>
                            <li>Báo cáo tiến độ và kết quả học tập chi tiết</li>
                            <li>Đào tạo giáo viên và hỗ trợ kỹ thuật 24/7</li>
                            <li>
                                Tích hợp với các hệ thống quản lý học tập hiện
                                có
                            </li>
                        </ul>
                        <button onClick={() => navigate('/about-us#contact')} className={styles.primaryButton}>
                            Liên hệ tư vấn cho trường học
                        </button>
                    </div>
                    <div className={styles.schoolsImageContainer}>
                        <img
                            src={schoolImage}
                            alt="Lớp học STEM"
                        />
                    </div>
                </div>
            </section>

            {/* Competitive Advantages */}
            <section
                id="advantages"
                className={`${styles.advantagesSection} ${isVisible.advantages ? styles.visible : ''}`}
            >
                <h2 className={styles.sectionTitle}>Ưu điểm vượt trội</h2>
                <div className={styles.advantagesTable}>
                    <div className={styles.advantagesHeader}>
                        <div className={styles.advantagesFeature}>
                            Tính năng
                        </div>
                        <div className={styles.advantagesUs}>
                            Nền tảng của chúng tôi
                        </div>
                        <div className={styles.advantagesThem}>
                            Các phương pháp truyền thống
                        </div>
                    </div>
                    {[
                        {
                            feature: 'Trải nghiệm học tập',
                            us: 'Trực quan, kéo thả, tương tác cao',
                            them: 'Lập trình bằng code, phức tạp',
                        },
                        {
                            feature: 'Đường cong học tập',
                            us: 'Ngắn, dễ tiếp cận cho mọi lứa tuổi',
                            them: 'Dài, đòi hỏi kiến thức nền tảng',
                        },
                        {
                            feature: 'Hỗ trợ phần cứng',
                            us: 'Đa dạng thiết bị, từ Arduino đến IoT',
                            them: 'Thường giới hạn ở một số nền tảng',
                        },
                        {
                            feature: 'Theo dõi tiến độ',
                            us: 'Tự động, trực quan, chi tiết',
                            them: 'Thủ công, khó đánh giá chính xác',
                        },
                        {
                            feature: 'Hỗ trợ giáo viên',
                            us: 'Công cụ quản lý lớp học, mẫu bài giảng',
                            them: 'Thường thiếu hướng dẫn chi tiết',
                        },
                    ].map((advantage, index) => (
                        <div key={index} className={styles.advantagesRow}>
                            <div className={styles.advantagesFeature}>
                                {advantage.feature}
                            </div>
                            <div className={styles.advantagesUs}>
                                {advantage.us}
                            </div>
                            <div className={styles.advantagesThem}>
                                {advantage.them}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Learning Roadmap */}
            <section
                id="roadmap"
                className={`${styles.roadmapSection} ${isVisible.roadmap ? styles.visible : ''}`}
            >
                <h2 className={styles.sectionTitle}>Lộ trình học tập</h2>
                <div className={styles.roadmapContainer}>
                    <div className={styles.roadmapPath}>
                        {[
                            {
                                step: 1,
                                title: 'Làm quen với giao diện',
                                description:
                                    'Hiểu cách sử dụng công cụ kéo thả và các khối lệnh cơ bản',
                            },
                            {
                                step: 2,
                                title: 'Các dự án cơ bản',
                                description:
                                    'Điều khiển LED, đọc cảm biến, hiển thị thông tin',
                            },
                            {
                                step: 3,
                                title: 'Dự án nâng cao',
                                description:
                                    'Kết hợp nhiều cảm biến, tạo ứng dụng tương tác',
                            },
                            {
                                step: 4,
                                title: 'Dự án IoT',
                                description:
                                    'Kết nối internet, điều khiển từ xa, thu thập dữ liệu',
                            },
                            {
                                step: 5,
                                title: 'Dự án cá nhân',
                                description:
                                    'Áp dụng kiến thức để xây dựng dự án theo ý tưởng riêng',
                            },
                        ].map((stage, index) => (
                            <div key={index} className={styles.roadmapStage}>
                                <div className={styles.roadmapNumber}>
                                    {stage.step}
                                </div>
                                <div className={styles.roadmapInfo}>
                                    <h3>{stage.title}</h3>
                                    <p>{stage.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section
                id="hero"
                className={`${styles.finalCta} ${isVisible.cia ? styles.visible : ''}`}
            >
                <h2>Sẵn sàng bắt đầu hành trình lập trình phần cứng?</h2>
                <p>
                    Khám phá thế giới công nghệ một cách thú vị và trực quan
                    ngay hôm nay!
                </p>
                <div className={styles.ctaButtons}>
                    <button onClick={() => {
                        navigate('/projects')
                        window.scrollTo({ top: 0, behavior: 'smooth' }) // hoặc 'auto'
                    }}
                            className={styles.primaryButton}>
                        Xem dự án mẫu
                    </button>
                    <button onClick={() => navigate('/blockly')} className={styles.secondaryButton}>
                        Thực hành ngay
                    </button>
                </div>
            </section>
        </div>
    )
}

export default OurProduct
