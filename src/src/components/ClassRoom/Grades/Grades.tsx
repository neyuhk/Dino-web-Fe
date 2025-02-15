import React from 'react';
import styles from './Grades.module.css';

const grades = [
    { assignment: 'Bài tập 1', score: 9.5 },
    { assignment: 'Bài tập 2', score: 8.0 },
];

const Grades = () => {
    return (
        <section className={styles.gradesSection}>
            <h2>Bảng điểm</h2>
            <div className={styles.gradesTable}>
                <table>
                    <thead>
                    <tr>
                        <th>Bài tập</th>
                        <th>Điểm</th>
                    </tr>
                    </thead>
                    <tbody>
                    {grades.map((grade, index) => (
                        <tr key={index}>
                            <td>{grade.assignment}</td>
                            <td>{grade.score}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default Grades;
