import React from 'react';
import styles from './Profile-Courses.module.css';

interface Course {
    id: string;
    title: string;
    image: string;
    startDate: Date;
    progress: number;
    totalLessons: number;
    completedLessons: number;
}

const CourseProgressBar: React.FC<{ progress: number }> = ({ progress }) => (
    <div className={styles.progressContainer}>
        <div
            className={styles.progressBar}
            style={{ width: `${progress}%` }}
        ></div>
        <span className={styles.progressText}>{progress}%</span>
    </div>
);

const CourseCard: React.FC<{ course: Course }> = ({ course }) => (
    <div className={styles.courseCard}>
        <div className={styles.courseHeader}>
            <img
                src={course.image}
                alt={course.title}
                className={styles.courseImage}
            />
            <div className={styles.courseInfo}>
                <h3 className={styles.courseTitle}>{course.title}</h3>
                <p className={styles.courseDate}>
                    Started on {course.startDate.toLocaleDateString()}
                </p>
            </div>
        </div>
        <div className={styles.courseProgress}>
            <CourseProgressBar progress={course.progress} />
            <span className={styles.progressDetails}>
        {course.completedLessons} of {course.totalLessons} lessons completed
      </span>
            <button className={styles.continueButton}>Continue Learning</button>
        </div>
    </div>
);

const ProfileCourses: React.FC<{ courses: Course[] }> = ({ courses }) => {
    return (
        <div className={styles.coursesContainer}>
            <h2 className={styles.sectionTitle}>Courses</h2>
            {courses.length === 0 ? (
                <p className={styles.emptyCourses}>No courses in progress</p>
            ) : (
                <div className={styles.coursesList}>
                    {courses.map(course => (
                        <CourseCard key={course.id} course={course} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProfileCourses;