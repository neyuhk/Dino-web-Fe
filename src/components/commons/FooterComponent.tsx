import React from 'react';
import './styles/FooterStyles.css';
import dinologo from '../../assets/dinologo-black.jpg';

const FooterComponent = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer-container">
            <div className="footer-main">
                <div className="footer-section about-section">
                    <div className="logo-container">
                        <img src={dinologo} alt="Dino Education Logo" className="footer-logo" />
                        <h2 className="footer-title">Dino Education</h2>
                    </div>
                    <p className="footer-quote">"Học lập trình thông qua trải nghiệm trực quan - Nơi code trở nên thú vị và dễ dàng"</p>
                    <p className="footer-description">
                        Nền tảng học lập trình trực tuyến với phương pháp kéo thả trực quan,
                        giúp người học từ mọi lứa tuổi tiếp cận lập trình một cách dễ dàng và hiệu quả.
                    </p>
                </div>

                <div className="footer-section links-section">
                    <h3 className="section-title">Khám Phá</h3>
                    <ul className="footer-links">
                        <li><a href="/courses">Khóa Học</a></li>
                        <li><a href="/projects">Dự Án</a></li>
                        <li><a href="/classroom">Lớp Học</a></li>
                        <li><a href="/forum">Diễn Đàn</a></li>
                        <li><a href="/about-us">Về Chúng Tôi</a></li>
                    </ul>
                </div>

                <div className="footer-section contact-section">
                    <h3 className="section-title">Liên Hệ</h3>
                    <address className="contact-info">
                        <p><i className="icon location-icon"></i> Trường Đại học Công nghệ - ĐHQGHN</p>
                        <p><i className="icon address-icon"></i> 144 Xuân Thủy, Cầu Giấy, Hà Nội</p>
                        <p><i className="icon phone-icon"></i> <a href="tel:0919074899">0919 074 899</a></p>
                        <p><i className="icon email-icon"></i> <a href="mailto:DinoEdu@gmail.com">DinoEdu@gmail.com</a></p>
                    </address>
                    <div className="social-links">
                        <a href="https://facebook.com/dinoedu" aria-label="Facebook" className="social-icon facebook"></a>
                        <a href="https://youtube.com/dinoedu" aria-label="YouTube" className="social-icon youtube"></a>
                        <a href="https://github.com/dinoedu" aria-label="GitHub" className="social-icon github"></a>
                        <a href="https://linkedin.com/company/dinoedu" aria-label="LinkedIn" className="social-icon linkedin"></a>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <p className="copyright">© {currentYear} Dino Education. Đơn vị phát triển: Trường Đại học Công nghệ - ĐHQGHN. Mọi quyền được bảo lưu.</p>
                <div className="bottom-links">
                    <a href="/terms">Điều khoản sử dụng</a>
                    <span className="separator">|</span>
                    <a href="/privacy">Chính sách bảo mật</a>
                </div>
            </div>
        </footer>
    );
};

export default FooterComponent;
