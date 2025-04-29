import { useState, useEffect } from 'react';
import { Play, Users, BookOpen, Code, ChevronRight } from 'lucide-react';
import styles from '../../pages/commons/styles/CoursePage.module.css';
import Section2 from '../../components/CoursePage/Section2/Section2.tsx'
import Section3 from '../../components/CoursePage/Section3/Section3.tsx'
import imageHero from '../../components/CoursePage/Section1/image/ss1.png'
import { useNavigate } from 'react-router-dom'
interface FeatureProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

const Feature: React.FC<FeatureProps> = ({ icon, title, description }) => {
    return (
        <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
                {icon}
            </div>
            <h3 className={styles.featureTitle}>{title}</h3>
            <p className={styles.featureDescription}>{description}</p>
        </div>
    );
};

const CoursePage: React.FC = () => {
    const [isVisible, setIsVisible] = useState({
        header: false,
        heroSection: false,
        features: false,
        benefits: false,
        cta: false
    });
    const navigate = useNavigate();

    useEffect(() => {
        // Animation timing sequence
        setTimeout(() => setIsVisible(prev => ({ ...prev, header: true })), 300);
        setTimeout(() => setIsVisible(prev => ({ ...prev, heroSection: true })), 600);
        setTimeout(() => setIsVisible(prev => ({ ...prev, features: true })), 900);
        setTimeout(() => setIsVisible(prev => ({ ...prev, benefits: true })), 1200);
        setTimeout(() => setIsVisible(prev => ({ ...prev, cta: true })), 1500);
    }, []);

    // Features of the Dino platform
    const features: FeatureProps[] = [
        {
            icon: <Code className={styles.iconCode} />,
            title: "Lập Trình Kéo Thả",
            description: "Học lập trình Arduino dễ dàng bằng cách kéo và thả các khối lệnh, không cần kiến thức code phức tạp."
        },
        {
            icon: <Play className={styles.iconPlay} />,
            title: "Bài Giảng Video",
            description: "Học qua các video bài giảng trực quan, giúp hiểu rõ từng khái niệm và thực hành hiệu quả."
        },
        {
            icon: <BookOpen className={styles.iconBook} />,
            title: "Bài Tập Thực Hành",
            description: "Áp dụng kiến thức qua các bài tập tương tác, nhận phản hồi ngay lập tức để cải thiện."
        }
    ];

    const fadeInAnimation = (isActive: boolean): string =>
        isActive ? styles.fadeIn : styles.fadeOut;

    return (
        <div className={styles.container}>
            {/* Hero Section */}
            <section
                className={`${styles.heroSection} ${fadeInAnimation(isVisible.heroSection)}`}
            >
                <div className={styles.heroContainer}>
                    <div className={styles.heroContent}>
                        <h1 className={styles.heroTitle}>
                            Bắt Đầu Hành Trình{' '}
                            <span className={styles.titleGradient}>
                                Lập Trình Arduino
                            </span>{' '}
                            Của Bạn
                        </h1>
                        <p className={styles.heroDescription}>
                            Khám phá thế giới lập trình Arduino với phương pháp
                            kéo thả đơn giản. Giải pháp học tập hiện đại dành
                            cho học sinh, trường học và trung tâm đào tạo.
                        </p>
                        <div className={styles.heroCta}>
                            <button
                                className={styles.primaryButton}
                                onClick={() => navigate('/blockly')}
                            >
                                Khám Phá Ngay
                                <ChevronRight className={styles.buttonIcon} />
                            </button>
                            <button
                                className={styles.secondaryButton}
                                onClick={() => navigate('/our-product')}
                            >
                                Tìm Hiểu Thêm
                            </button>
                        </div>
                    </div>
                    <div className={styles.heroImage}>
                        <div className={styles.imageWrapper}>
                            <img
                                src={imageHero}
                                alt="Dino Arduino Learning Platform"
                                className={styles.image}
                            />
                        </div>
                    </div>
                </div>
            </section>
            <Section2></Section2>
            {/* Features */}
            <section
                className={`${styles.featuresSection} ${fadeInAnimation(isVisible.features)}`}
            >
                <div className={styles.sectionContainer}>
                    <h2 className={styles.sectionTitle}>Tính Năng Nổi Bật</h2>

                    <div className={styles.featuresGrid}>
                        {features.map((feature, index) => (
                            <Feature
                                key={index}
                                icon={feature.icon}
                                title={feature.title}
                                description={feature.description}
                            />
                        ))}
                    </div>
                </div>
            </section>
            <Section3></Section3>
            {/* Learning Experience Section */}
            <section
                className={`${styles.benefitsSection} ${fadeInAnimation(isVisible.benefits)}`}
            >
                <div className={styles.sectionContainer}>
                    <h2 className={styles.sectionTitle}>
                        Trải Nghiệm Học Tập Tuyệt Vời
                    </h2>

                    <div className={styles.benefitsGrid}>
                        <div className={styles.benefitsCards}>
                            <div className={styles.benefitCard}>
                                <div className={styles.benefitHeader}>
                                    <Users className={styles.benefitIcon} />
                                    <h3 className={styles.benefitTitle}>
                                        Học Cùng Bạn Bè
                                    </h3>
                                </div>
                                <p className={styles.benefitDescription}>
                                    Môi trường học tập cộng tác, chia sẻ ý tưởng
                                    và giải quyết vấn đề cùng nhau.
                                </p>
                            </div>

                            <div className={styles.benefitCard}>
                                <div className={styles.benefitHeader}>
                                    <BookOpen className={styles.benefitIcon} />
                                    <h3 className={styles.benefitTitle}>
                                        Tài Liệu Đa Dạng
                                    </h3>
                                </div>
                                <p className={styles.benefitDescription}>
                                    Tài liệu học tập phong phú với video, bài
                                    tập tương tác và dự án thực tế.
                                </p>
                            </div>
                        </div>

                        <div className={styles.educationSolution}>
                            <h3 className={styles.solutionTitle}>
                                Giải Pháp Hoàn Hảo Cho Giáo Dục
                            </h3>
                            <p className={styles.solutionDescription}>
                                Dino không chỉ là một nền tảng học lập trình, mà
                                còn là giải pháp toàn diện cho các trường học và
                                trung tâm đào tạo. Chúng tôi cung cấp:
                            </p>
                            <ul className={styles.solutionList}>
                                <li className={styles.solutionItem}>
                                    <div className={styles.itemBullet}>
                                        <ChevronRight
                                            className={styles.bulletIcon}
                                        />
                                    </div>
                                    <span>
                                        Hệ thống quản lý lớp học và học sinh
                                        toàn diện
                                    </span>
                                </li>
                                <li className={styles.solutionItem}>
                                    <div className={styles.itemBullet}>
                                        <ChevronRight
                                            className={styles.bulletIcon}
                                        />
                                    </div>
                                    <span>
                                        Báo cáo tiến độ và thành tích chi tiết
                                    </span>
                                </li>
                                <li className={styles.solutionItem}>
                                    <div className={styles.itemBullet}>
                                        <ChevronRight
                                            className={styles.bulletIcon}
                                        />
                                    </div>
                                    <span>
                                        Tích hợp dễ dàng với hệ thống quản lý
                                        học tập hiện có
                                    </span>
                                </li>
                                <li className={styles.solutionItem}>
                                    <div className={styles.itemBullet}>
                                        <ChevronRight
                                            className={styles.bulletIcon}
                                        />
                                    </div>
                                    <span>
                                        Hỗ trợ kỹ thuật chuyên nghiệp 24/7
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section
                className={`${styles.ctaSection} ${fadeInAnimation(isVisible.cta)}`}
            >
                <div className={styles.ctaContainer}>
                    <h2 className={styles.ctaTitle}>Sẵn Sàng Khám Phá Dino?</h2>
                    <p className={styles.ctaDescription}>
                        Tham gia ngay hôm nay và mở ra cánh cửa đến với thế giới
                        lập trình Arduino thú vị và đầy sáng tạo!
                    </p>
                    <div className={styles.ctaButtons}>
                        <button className={styles.ctaPrimary}>
                            Đăng Ký Miễn Phí
                        </button>
                    </div>
                </div>
            </section>
        </div>
    )
};

export default CoursePage;