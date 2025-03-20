import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Clock, ChevronLeft, Book, CheckCircle } from 'lucide-react';
import styles from './LessonStudentDetail.module.css';
import { useSelector } from 'react-redux';
import { Exercise, Lesson } from '../../../../model/classroom.ts'
import { PATHS } from '../../../../router/path.ts'
import RequireAuth from '../../../commons/RequireAuth/RequireAuth.tsx'

const LessonStudentDetail: React.FC = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useSelector((state: any) => state.auth);

    // Get lesson data from navigation state
    const { lesson } = location.state as { lesson: Lesson };

    if (!lesson) {
        // Handle case where lesson data is not available
        return (
            <div className={styles.errorContainer}>
                <p>Không tìm thấy thông tin bài học.</p>
                <button onClick={() => navigate(-1)} className="backButton">
                    Quay lại
                </button>
            </div>
        );
    }

    const isExerciseExpired = (exercise: Exercise): boolean => {
        if (!exercise.endDate) return false;
        return new Date(exercise.endDate) < new Date();
    };

    const handleSelectExercise = (exercise: Exercise, lessonId: string) => {
        // Prevent navigation if exercise is expired
        if (isExerciseExpired(exercise)) {
            return;
        }
        console.log(exercise);
        navigate(PATHS.CLASSROOM_LEARNING, { state: { exercise, lessonId } });
    };

    const formatDate = (dateString: string | undefined): string => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const convertYoutubeUrl = (url: string): string => {
        // Xử lý URL Youtube
        if (url.includes('youtube.com/watch')) {
            const videoId = new URL(url).searchParams.get('v');
            return `https://www.youtube.com/embed/${videoId}`;
        }
        // Trường hợp đã là URL nhúng hoặc URL khác
        return url;
    }

    if (!user) {
        return (
            <RequireAuth></RequireAuth>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <button
                    className={styles.backButton}
                    onClick={() => navigate(-1)}
                >
                    <ChevronLeft size={20} />
                    Quay lại danh sách bài học
                </button>
                <div className={styles.titleContainer}>
                    <div className={styles.titleInfo}>
                        <Book size={28} className={styles.lessonIcon} />
                        <h1 className={styles.lessonTitle}>{lesson.title}</h1>
                    </div>
                    {lesson.isCompleted && (
                        <CheckCircle
                            size={24}
                            className={styles.completedIcon}
                        />
                    )}
                </div>
            </div>

            <div className={styles.content}>
                <div className={styles.lessonInfo}>
                    <p className={styles.lessonMeta}>
                        {lesson.duration} phút • {lesson.progress}% hoàn thành
                        {lesson.lastAccessedAt &&
                            ` • Truy cập lần cuối: ${formatDate(lesson.lastAccessedAt)}`}
                    </p>
                    <p className={styles.lessonDescription}>
                        {lesson.description}
                    </p>

                    {lesson.video_url && (
                        <div className={styles.videoContainer}>
                            <h3>Video bài học</h3>
                            <div className={styles.video}>
                                <iframe
                                    src={convertYoutubeUrl(lesson.video_url)}
                                    title={lesson.title}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        </div>
                    )}

                    {lesson.images && lesson.images.length > 0 && (
                        <div className={styles.imagesContainer}>
                            <h3>Hình ảnh</h3>
                            <div className={styles.imageGallery}>
                                {lesson.images.map((img, index) => (
                                    <img
                                        key={index}
                                        src={img}
                                        alt={`Lesson image ${index + 1}`}
                                        className={styles.lessonImage}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {lesson.body && (
                        <div className={styles.lessonBody}>
                            <h3>Nội dung bài học</h3>
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: lesson.body,
                                }}
                            />
                        </div>
                    )}
                </div>

                {lesson.exercises && lesson.exercises.length > 0 ? (
                    <div className={styles.exerciseSection}>
                        <h2>Bài tập ({lesson.exercises.length})</h2>
                        <div className={styles.exerciseList}>
                            {lesson.exercises.map((exercise) => {
                                const expired = isExerciseExpired(exercise);
                                return (
                                    <div
                                        key={exercise._id}
                                        className={`${styles.exerciseItem} ${expired ? styles.exerciseExpired : ''}`}
                                        onClick={() => handleSelectExercise(exercise, lesson._id)}
                                    >
                                        <div className={styles.exerciseInfo}>
                                            <span className={styles.exerciseTitle}>{exercise.title}</span>
                                            <p className={styles.exerciseDescription}>{exercise.description}</p>
                                            {exercise.endDate && (
                                                <div className={styles.exerciseDeadline}>
                                                    <Clock size={16} className={styles.deadlineIcon} />
                                                    <span className={`${expired ? styles.deadlineExpired : ''}`}>
                                                        Hạn nộp: {formatDate(exercise.endDate.toLocaleDateString())}
                                                        {expired ? ' (Đã hết hạn)' : ''}
                                                    </span>
                                                </div>
                                            )}
                                            {(exercise.score !== undefined || expired) && (
                                                <span className={styles.exerciseScore}>
                                                    Điểm: {expired && !exercise.isCompleted ? '0' : exercise.score ?? 0}/10
                                                </span>
                                            )}
                                        </div>
                                        <span className={`
                                            ${styles.exerciseStatus} 
                                            ${exercise.isCompleted ? styles.completed : ''} 
                                            ${expired && !exercise.isCompleted ? styles.expired : ''}
                                        `}>
                                            {expired && !exercise.isCompleted
                                                ? 'Hết hạn'
                                                : exercise.isCompleted
                                                    ? 'Đã hoàn thành'
                                                    : 'Chưa hoàn thành'}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div className={styles.noExercisesContainer}>
                        <div className={styles.noExercisesImage}>
                            <Book size={48} className={styles.noExercisesIcon} />
                            <img src={"https://i.pinimg.com/originals/fe/93/b0/fe93b053043276b38386e625295af6cc.gif"}
                            />
                        </div>
                        <h3 className={styles.noExercisesTitle}>Chưa có bài tập</h3>
                        <p className={styles.noExercisesDescription}>
                            Hiện tại chưa có bài tập nào được giao cho bài học này. Vui lòng quay lại sau.
                        </p>
                    </div>
                )}

                {lesson.averageScore !== undefined && (
                    <div className={styles.averageScore}>
                        Điểm trung bình:{' '}
                        <strong>{lesson.averageScore.toFixed(1)}/10</strong>
                    </div>
                )}
            </div>
        </div>
    )
};

export default LessonStudentDetail;