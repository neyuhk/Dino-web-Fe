import React, { useState, useEffect } from 'react';
import styles from './Section3.module.css';

interface CountdownTimerProps {
    initialDays: number;
    initialHours: number;
    initialMinutes: number;
    initialSeconds: number;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
                                                           initialDays,
                                                           initialHours,
                                                           initialMinutes,
                                                           initialSeconds,
                                                       }) => {
    const [days, setDays] = useState(initialDays);
    const [hours, setHours] = useState(initialHours);
    const [minutes, setMinutes] = useState(initialMinutes);
    const [seconds, setSeconds] = useState(initialSeconds);
    const [flippingMinutes, setFlippingMinutes] = useState(false);
    const [flippingSeconds, setFlippingSeconds] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setFlippingSeconds(true);

            setTimeout(() => {
                if (seconds > 0) {
                    setSeconds((prev) => prev - 1);
                } else if (minutes > 0) {
                    setFlippingMinutes(true);
                    setMinutes((prev) => prev - 1);
                    setSeconds(59);
                } else if (hours > 0) {
                    setHours((prev) => prev - 1);
                    setMinutes(59);
                    setSeconds(59);
                } else if (days > 0) {
                    setDays((prev) => prev - 1);
                    setHours(23);
                    setMinutes(59);
                    setSeconds(59);
                }

                setFlippingSeconds(false);
                setFlippingMinutes(false);
            }, 500); // Duration of flip animation
        }, 1000); // Update every second

        return () => clearInterval(timer);
    }, [days, hours, minutes, seconds]);

    return (
        <div className={styles.countdown}>
            <div className={styles.timeBox}>
                <div className={styles.timeValue}>{days}</div>
                <div className={styles.timeLabel}>Ngày</div>
            </div>
            <div className={styles.timeBox}>
                <div className={styles.timeValue}>{hours}</div>
                <div className={styles.timeLabel}>Giờ</div>
            </div>
            <div className={styles.timeBox}>
                <div className={`${styles.timeValue} ${flippingMinutes ? styles.flip : ''}`}>
                    {minutes}
                </div>
                <div className={styles.timeLabel}>Phút</div>
            </div>
            <div className={styles.timeBox}>
                <div className={`${styles.timeValue} ${flippingSeconds ? styles.flip : ''}`}>
                    {seconds}
                </div>
                <div className={styles.timeLabel}>Giây</div>
            </div>
        </div>
    );
};

export default CountdownTimer;
