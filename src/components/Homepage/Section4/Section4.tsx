import React from 'react';
import styles from './Section4.module.css';
import uetLogo from '../../../assets/homepage/section4/uet.png';
import HAULogo from '../../../assets/homepage/section4/kt.jpg';
import HNUELogo from '../../../assets/homepage/section4/hnue.jpg';
import CSLLogo from '../../../assets/homepage/section4/csl.png';

interface School {
    logo: string;
    name: string;
}

const Section4: React.FC = () => {
    const schools: School[] = [
        { logo: CSLLogo, name: 'THPT CSL' },
        { logo: HNUELogo, name: 'HNUE' },
        { logo: HAULogo, name: 'HAU' },
        { logo: 'public/dino.jpg', name: 'UET' },
    ];

    return (
        <section className={styles.section}>
            <div className={styles.container}>
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
