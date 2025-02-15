import React from 'react';
import styles from './Exercise.module.css';

const Exercise = () => {
    return (
        <section className={styles.exerciseSection}>
            <h2>Bài tập</h2>
            <div className={styles.exerciseContainer}>
                <div className={styles.exerciseQuestion}>
                    <h3>Câu hỏi 1:</h3>
                    <p>Chọn lệnh đúng để bật LED trên chân số 13:</p>
                    <div className={styles.options}>
                        <label>
                            <input type="radio" name="q1" /> digitalWrite(13, HIGH);
                        </label>
                        <label>
                            <input type="radio" name="q1" /> digitalRead(13, HIGH);
                        </label>
                    </div>
                </div>
                <button className={styles.submitButton}>Gửi bài</button>
            </div>
        </section>
    );
};

export default Exercise;
