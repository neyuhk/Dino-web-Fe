import React from 'react';
import styles from './Section3.module.css';
import ButtonComponent from "../../Button/ButtonComponent.tsx";
import ButtonGradient from '../../ButtonGradient/ButtonGradient.tsx'

const Section3: React.FC = () => {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.card}>
                    <div className={styles.content}>
                        <h2>Lập trình dễ dàng</h2>
                        <p>
                            Thực hiện chuyển đổi code từ các khối một cách dễ dàng, chính xác
                        </p>
                        <p>
                            Dino hỗ trợ nạp mã nguồn sang phần cứng
                        </p>
                        <ButtonGradient
                            text = "Thử ngay"
                        />
                    </div>
                    <div className={styles.imageWrapper}>
                        <img
                            src="src/assets/homepage/section3.png"
                            alt="Programming"
                            className={styles.image}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Section3;