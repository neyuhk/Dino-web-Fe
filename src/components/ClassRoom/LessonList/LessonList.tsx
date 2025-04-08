import React, { useEffect, useState } from 'react';
import { GraduationCap, Book, CheckCircle, AlertCircle, ChevronRight, ChevronLeft } from 'lucide-react';
import styles from './LessonList.module.css';
import { Lesson } from '../../../model/classroom.ts';
import { getLessonByCourseId } from '../../../services/lesson.ts';
import { useSelector } from 'react-redux';
import RequireAuth from '../../commons/RequireAuth/RequireAuth.tsx';
import { useNavigate } from 'react-router-dom';

interface LessonListProps {
    courseId: string;
}

const LessonList: React.FC<LessonListProps> = ({ courseId }) => {
    const { user } = useSelector((state: any) => state.auth);
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'all' | 'completed' | 'incomplete'>('all');
    const navigate = useNavigate();

    useEffect(() => {
        fetchLessons();
    }, [courseId]);

    const fetchLessons = async () => {
        try {
            setIsLoading(true);
            const data = await getLessonByCourseId(courseId);
            setLessons(data.data);
        } catch (err) {
            setError('Có lỗi xảy ra khi tải bài học. Vui lòng thử lại sau!');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLessonClick = (lessonId: string) => {
        const selectedLesson = lessons.find(lesson => lesson._id === lessonId);
        if (selectedLesson) {
            navigate(`/classroom/courses/lesson/${lessonId}`, { state: { lesson: selectedLesson } });
        }
    };

    const getIncompleteExercises = (lesson: Lesson) => {
        return lesson.exercises.filter(ex => !ex.isCompleted).length;
    };

    if (!user) {
        return <RequireAuth />;
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

    const filteredLessons = lessons.filter(lesson => {
        switch (activeTab) {
            case 'completed':
                return lesson.isCompleted;
            case 'incomplete':
                return !lesson.isCompleted;
            default:
                return true;
        }
    });

    return (
        <div className={styles.container}>
            {/*<button className={styles.backButton} onClick={() => navigate(-1)}>*/}
            {/*    <ChevronLeft size={20} />*/}
            {/*    Quay lại lớp học*/}
            {/*</button>*/}

            <div className={styles.tabContainer}>
                {['all', 'completed', 'incomplete'].map((tab) => (
                    <button
                        key={tab}
                        className={`${styles.tabButton} ${activeTab === tab ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab(tab as 'all' | 'completed' | 'incomplete')}
                    >
                        {tab === 'all' ? 'Tất cả' : tab === 'completed' ? 'Đã hoàn thành' : 'Chưa hoàn thành'}
                    </button>
                ))}
            </div>

            <div className={styles.lessonList}>
                {filteredLessons.map((lesson) => (
                    <div key={lesson._id} className={styles.lessonCard}>
                        <div className={styles.lessonHeader} onClick={() => handleLessonClick(lesson._id)}>
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
                            ) : getIncompleteExercises(lesson) > 0 && (
                                <div className={styles.exerciseBadge}>
                                    {getIncompleteExercises(lesson)} bài tập chưa hoàn thành
                                </div>
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
