import React from 'react';
import styles from './LectureList.module.css';

const lectures = [
    { id: 1, title: 'Giới thiệu Arduino', description: 'Tổng quan về Arduino và ứng dụng', completed: true },
    { id: 2, title: 'Lập trình cơ bản', description: 'Cấu trúc chương trình Arduino', completed: false },
];

const LectureList = () => {
    return (
        <section className={styles.lectureSection}>
            <h2>Danh sách bài giảng</h2>
            <div className={styles.lectureGrid}>
                {lectures.map((lecture) => (
                    <div key={lecture.id} className={styles.lectureCard}>
                        <div className={styles.lectureIcon}>
                            <img src="/api/placeholder/40/40" alt="Arduino Icon" />
                            {lecture.completed && <span className={styles.completedBadge}>✓</span>}
                        </div>
                        <h3>{lecture.title}</h3>
                        <p>{lecture.description}</p>
                        <button className={styles.viewButton}>Xem bài giảng</button>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default LectureList;
