import React, { useEffect, useState } from 'react';
import { GraduationCap, Book, CheckCircle, AlertCircle, ChevronRight } from 'lucide-react';
import styles from './LessonList.module.css';
import { Exercise, Lesson } from '../../../model/classroom.ts'
import { getLessonByCourseId } from '../../../services/lesson.ts'
import { useSelector } from 'react-redux'
import RequireAuth from '../../RequireAuth/RequireAuth.tsx'
import { PATHS } from '../../../router/path.ts'
import { useLocation, useNavigate } from 'react-router-dom'

interface LessonListProps {
    courseId: string;
}

const LessonList: React.FC = () => {

    const location = useLocation();
    const { user } = useSelector((state: any) => state.auth);
    const { coursesId } = location.state as { coursesId: string};

    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'all' | 'completed' | 'incomplete'>('all');
    const [expandedLesson, setExpandedLesson] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchLessons();
    }, [coursesId]);

    const fetchLessons = async () => {
        try {
            console.log('courseId', coursesId);
            setIsLoading(true);
            const data = await getLessonByCourseId(coursesId);
            setLessons(data);
        } catch (err) {
            setError('Có lỗi xảy ra khi tải bài học. Vui lòng thử lại sau!');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectExercise = (exercise: Exercise) => {
        console.log(exercise);
        navigate(PATHS.CLASSROOM_LEARNING, { state: { exercise } });
    };

    // const handleCardClick = (classroomId: string) => {
    //     console.log('class room',classroomId);
    //     navigate(`${PATHS.CLASSROOM_LESSON}`, { state: { classroomId } });
    // };

    if(!user){
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

    const getIncompleteExercises = (lesson: Lesson) => {
        return lesson.exercises.filter(ex => !ex.isCompleted).length;
    };

    return (
        <div className={styles.container}>
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
                    <div key={lesson.id} className={styles.lessonCard}>
                        <div
                            className={styles.lessonHeader}
                            onClick={() => setExpandedLesson(expandedLesson === lesson.id ? null : lesson.id)}
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

                            <ChevronRight
                                size={24}
                                className={`${styles.expandIcon} ${expandedLesson === lesson.id ? styles.expanded : ''}`}
                            />
                        </div>

                        {expandedLesson === lesson.id && (
                            <div className={styles.lessonDetails}>
                                <p className={styles.lessonDescription}>{lesson.description}</p>

                                {lesson.exercises.length > 0 && (
                                    <div className={styles.exerciseSection}>
                                        <h4>Bài tập ({lesson.exercises.length})</h4>
                                        <div className={styles.exerciseList}>
                                            {lesson.exercises.map((exercise) => (
                                                <div key={exercise.id} className={styles.exerciseItem} onClick={() => handleSelectExercise(exercise)}>
                                                    <div className={styles.exerciseInfo}>
                                                        <span className={styles.exerciseTitle}>{exercise.title}</span>
                                                        <p className={styles.exerciseDescription}>{exercise.description}</p>
                                                        {exercise.score !== undefined && (
                                                            <span className={styles.exerciseScore}>
                                Điểm: {exercise.score}/10
                              </span>
                                                        )}
                                                    </div>
                                                    <span className={`${styles.exerciseStatus} ${exercise.isCompleted ? styles.completed : ''}`}>
                            {exercise.isCompleted ? 'Đã hoàn thành' : 'Chưa hoàn thành'}
                          </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {lesson.averageScore !== undefined && (
                                    <div className={styles.averageScore}>
                                        Điểm trung bình: <strong>{lesson.averageScore.toFixed(1)}/10</strong>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LessonList;