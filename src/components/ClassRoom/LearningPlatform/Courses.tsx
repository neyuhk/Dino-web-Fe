// Courses.tsx
import React from 'react';
import styles from './LearningPlatform.module.css';

const Courses = ({ data }: { data: any[] }) => {
    return (
        <div className={styles.content}>
            <h2 className={styles.title}>Khóa học của tôi</h2>
            {data.map((course) => (

                <div key={course.id} className={styles.courseCard}>
                    {/*<img className={styles.imageBackground}*/}
                    {/*     src={course.image}>*/}

                    {/*</img>*/}
                    <div className={styles.courseContainer}>
                        <h3 className={styles.courseTitle}>{course.title}</h3>
                        <p className={styles.courseDescription}>{course.description}</p>
                        <span className={styles.lessons}>{course.lessons} bài học</span>
                    </div>

                </div>
            ))}
        </div>
    );
};

export default Courses;
