import React, { useEffect, useState } from 'react';
import { GraduationCap, Book, CheckCircle, AlertCircle, ChevronRight, ChevronLeft } from 'lucide-react'
import styles from './LessonList.module.css';
import { Lesson } from '../../../model/classroom.ts';
import { getLessonByCourseId } from '../../../services/lesson.ts';
import { useSelector } from 'react-redux';
import RequireAuth from '../../commons/RequireAuth/RequireAuth.tsx';
import { PATHS } from '../../../router/path.ts';
import { useLocation, useNavigate } from 'react-router-dom';

const LessonList: React.FC = () => {
    const location = useLocation();
    const { user } = useSelector((state: any) => state.auth);
    const { coursesId } = location.state as { coursesId: string };

    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'all' | 'completed' | 'incomplete'>('all');
    const navigate = useNavigate();

    useEffect(() => {
        fetchLessons();
    }, [coursesId]);

    const fetchLessons = async () => {
        try {
            console.log('courseId', coursesId);
            setIsLoading(true);
            const data = await getLessonByCourseId(coursesId);
            setLessons(data.data);
        } catch (err) {
            setError('Có lỗi xảy ra khi tải bài học. Vui lòng thử lại sau!');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLessonClick = (lessonId: string) => {
        // Find the selected lesson to pass as state
        const selectedLesson = lessons.find(lesson => lesson._id === lessonId);
        if (selectedLesson) {
            navigate(`/classroom/courses/lesson/${lessonId}`, { state: { lesson: selectedLesson } });
        }
    };

    const getIncompleteExercises = (lesson: Lesson) => {
        return lesson.exercises.filter(ex => !ex.isCompleted).length;
    };

    if (!user) {
        return (
            <RequireAuth></RequireAuth>
        );
    }

    if (isLoading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loadingSpinner}>
                    <GraduationCap size={32} className={styles.loadingIcon} />
                </div>
                <p>Chờ xíuuuu... Hông ai iu anh bằng tôi iu anh..</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.errorContainer}>
                <AlertCircle size={32} className={styles.errorIcon} />
                <p>{error}</p>
                <button onClick={fetchLessons} className={styles.retryButton}>
                    Thử lại
                </button>
            </div>
        );
    }

    const filteredLessons = Array.isArray(lessons)
        ? lessons.filter(lesson => {
            switch (activeTab) {
                case 'completed':
                    return lesson.isCompleted;
                case 'incomplete':
                    return !lesson.isCompleted;
                default:
                    return true;
            }
        })
        : [];

    return (
        <div className={styles.container}>
            <button
                className={styles.backButton}
                onClick={() => navigate(-1)}
            >
                <ChevronLeft size={20} />
                Quay lại lớp học
            </button>
            <div className={styles.tabContainer}>
                <button
                    className={`${styles.tabButton} ${activeTab === 'all' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('all')}
                >
                    Tất cả
                </button>
                <button
                    className={`${styles.tabButton} ${activeTab === 'completed' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('completed')}
                >
                    Đã hoàn thành
                </button>
                <button
                    className={`${styles.tabButton} ${activeTab === 'incomplete' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('incomplete')}
                >
                    Chưa hoàn thành
                </button>
            </div>

            <div className={styles.lessonList}>
                {filteredLessons.map((lesson) => (
                    <div key={lesson._id} className={styles.lessonCard}>
                        <div
                            className={styles.lessonHeader}
                            onClick={() => handleLessonClick(lesson._id)}
                        >
                            <div className={styles.lessonInfo}>
                                <Book size={24} className={styles.lessonIcon} />
                                <div>
                                    <h3 className={styles.lessonTitle}>{lesson.title}</h3>
                                    <p className={styles.lessonMeta}>
                                        {lesson.duration} phút • {lesson.progress}% hoàn thành
                                    </p>
                                </div>
                            </div>

                            {lesson.isCompleted ? (
                                <CheckCircle size={24} className={styles.completedIcon} />
                            ) : (
                                getIncompleteExercises(lesson) > 0 && (
                                    <div className={styles.exerciseBadge}>
                                        {getIncompleteExercises(lesson)} bài tập chưa hoàn thành
                                    </div>
                                )
                            )}

                            <ChevronRight size={24} className={styles.expandIcon} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LessonList;