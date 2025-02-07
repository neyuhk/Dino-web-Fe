import React from 'react';
import styles from './Section4.module.css';

interface School {
    logo: string;
    name: string;
}

const Section4: React.FC = () => {
    const schools: School[] = [
        { logo: 'src/assets/homepage/section4/csl.png', name: 'THPT CSL' },
        { logo: 'src/assets/homepage/section4/hnue.jpg', name: 'HNUE' },
        { logo: 'src/assets/homepage/section4/kt.jpg', name: 'HAU' },
        { logo: 'src/assets/homepage/section4/uet.png', name: 'UET' },
    ];

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <h2 className={styles.title}>Tham gia học tập cùng Dino</h2>
                <div className={styles.scrollContainer}>
                    <div className={styles.scrollContent}>
                        {[...schools, ...schools].map((school, index) => (
                            <div key={index} className={styles.schoolCard}>
                                <img
                                    src={school.logo}
                                    alt={school.name}
                                    className={styles.schoolLogo}
                                />
                                <span className={styles.schoolName}>{school.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Section4;
