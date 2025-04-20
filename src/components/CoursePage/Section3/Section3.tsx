import React from 'react';
import CountdownTimer from './CountdownTimer';
import { section3Data } from './data';
import styles from './Section3.module.css';
import ss3 from './image/Work time-cuate.png';

const Section3: React.FC = () => {
    return (
        <section className={styles.section3}>
            <div className={styles.imageContainer}>
                <img
                    src={ss3}
                    alt="Learning Environment"
                    className={styles.image}
                />
            </div>

            <div className={styles.content}>
                <h2 className={styles.title}>{section3Data.title}</h2>

                <div className={styles.description}>
                    {section3Data.description.map((text, index) => (
                        <p key={index}>{text}</p>
                    ))}
                </div>

                <div className={styles.highlightContainer}>
                    {section3Data.highlight.map((text, index) => (
                        <p key={index} className={styles.highlight}>{text}</p>
                    ))}
                </div>

                <CountdownTimer
                    initialDays={section3Data.countdown.days}
                    initialHours={section3Data.countdown.hours}
                    initialMinutes={section3Data.countdown.minutes} initialSeconds={0}                />
            </div>
        </section>
    );
};

export default Section3;
