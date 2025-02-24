// LearningChallenge.tsx
import React from 'react';
import styles from './LearningPlatform.module.css';

const Grades = ({ data }: { data: any[] }) => {
    return (
        <div className={styles.content}>
            <h2 className={styles.title}>Bảng điểm</h2>
            {data.map((grade) => (
                <div key={grade.id} className={styles.gradeCard}>
                    <p className={styles.gradeAssignment}>{grade.assignment}</p>
                    <p className={styles.grade}>{grade.grade}</p>
                    <p className={styles.comments}>{grade.comments}</p>
                </div>
            ))}
        </div>
    );
};

export default Grades;
