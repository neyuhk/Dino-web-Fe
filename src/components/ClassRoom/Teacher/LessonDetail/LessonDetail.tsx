import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import styles from './LessonDetail.module.css';
import Toast from '../../../commons/Toast/Toast.tsx';
import { Exercise, Lesson } from '../../../../model/classroom.ts'
import { useSelector } from 'react-redux'
import RequireAuth from '../../../commons/RequireAuth/RequireAuth.tsx'

interface ToastMessage {
    show: boolean;
    type: 'success' | 'error' | 'info';
    title: string;
    message: string;
    image?: string;
}

const LessonDetail: React.FC = () => {
    const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const lesson = location.state?.lesson || null;
    const [loading, setLoading] = useState<boolean>(true);
    const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
    const [activeTab, setActiveTab] = useState<'content' | 'exercises'>('content');
    const { user } = useSelector((state: any) => state.auth);

    if(!user){
        return (
            <RequireAuth></RequireAuth>
        );
    }

    const [toast, setToast] = useState<ToastMessage>({
        show: false,
        type: 'info',
        title: '',
        message: ''
    });

    useEffect(() => {
        const fetchLessonDetail = async () => {
            try {
                setLoading(true);

                // If lesson is passed through location state, use it
                if (lesson) {
                    setCurrentLesson(lesson);
                } else {
                    // Otherwise you would fetch it from your API
                    // This is a placeholder for your actual API call
                    console.log('Would fetch lesson with ID:', lessonId);

                    // Mock data for demo purposes
                    // const mockLesson: Lesson = {
                    //     id: lessonId || '1',
                    //     title: 'Introduction to React',
                    //     description: 'Learn the basics of React and component architecture',
                    //     videoUrl: 'https://example.com/video.mp4',
                    //     images: ['/images/react-lesson.jpg'],
                    //     body: '<p>React is a JavaScript library for building user interfaces...</p>',
                    //     course_id: courseId? courseId : '1',
                    //     createdAt: new Date().toISOString(),
                    //     updatedAt: new Date().toISOString(),
                    //     exercises: [
                    //         {
                    //             id: "1",
                    //             type: "quiz",
                    //             time: 30,
                    //             title: "Bài kiểm tra Toán",
                    //             description: "Bài kiểm tra nhanh về toán học cơ bản.",
                    //             score: 85,
                    //             isCompleted: true,
                    //             submittedAt: "2025-03-01T10:30:00Z",
                    //             endDate: new Date("2025-03-10"),
                    //         },
                    //         {
                    //             id: "2",
                    //             type: "test",
                    //             time: 60,
                    //             title: "Bài kiểm tra Vật lý",
                    //             description: "Bài kiểm tra về các định luật Newton.",
                    //             isCompleted: false,
                    //             endDate: new Date("2025-03-15"),
                    //         },
                    //         {
                    //             id: "3",
                    //             type: "quiz",
                    //             time: 20,
                    //             title: "Bài kiểm tra Tiếng Anh",
                    //             description: "Kiểm tra nhanh về ngữ pháp tiếng Anh.",
                    //             score: 90,
                    //             isCompleted: true,
                    //             submittedAt: "2025-02-28T08:15:00Z",
                    //             endDate: new Date("2025-03-12"),
                    //         }
                    //     ],
                    //     order: 1,
                    //     duration: 45,
                    //     isCompleted: false,
                    //     progress: 30,
                    //     averageScore: 85,
                    //     lastAccessedAt: new Date().toISOString()
                    // };

                    // setCurrentLesson(mockLesson);
                }

                setLoading(false);

                setToast({
                    show: true,
                    type: 'success',
                    title: 'Thành công',
                    message: 'Đã tải thông tin bài học',
                    image: '/images/success.png'
                });

                setTimeout(() => {
                    setToast(prev => ({ ...prev, show: false }));
                }, 3000);
            } catch (error) {
                console.error('Error fetching lesson details:', error);
                setLoading(false);
                setToast({
                    show: true,
                    type: 'error',
                    title: 'Lỗi',
                    message: 'Không thể tải thông tin bài học',
                    image: '/images/error.png'
                });
            }
        };

        fetchLessonDetail();
    }, [lessonId, lesson, courseId]);

    const handleBack = () => {
        navigate(-1);
    };

    const hideToast = () => {
        setToast(prev => ({ ...prev, show: false }));
    };

    const handleAddExercise = () => {
        setToast({
            show: true,
            type: 'info',
            title: 'Thông báo',
            message: 'Chức năng thêm bài tập đang được phát triển',
            image: '/images/info.png'
        });
        navigate(`/classroom/courses/${courseId}/lesson/${lessonId}/new_exercise`);
    };

    const handleViewExercise = (exercise: Exercise) => {
        console.log('xem chi tiet ',courseId, lessonId, exercise._id);
        if (courseId && lessonId && exercise._id) {
            navigate(`/classroom/courses/${courseId}/lesson/${lessonId}/${exercise._id}`, {
                state: { exercise },
            });
        }
    };

    const formatDuration = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours > 0 ? `${hours} giờ ` : ''}${mins > 0 ? `${mins} phút` : ''}`;
    };

    if (loading) {
        return <div className={styles.loadingContainer}>Đang tải...</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <button onClick={handleBack} className="backButton">
                    ← Quay lại
                </button>
                <h1 className={styles.title}>
                    {currentLesson?.title || 'Chi tiết bài học'}
                </h1>
            </div>

            {currentLesson && (
                <div className={styles.lessonInfo}>
                    <div className={styles.lessonMedia}>
                        {currentLesson.video_url ? (
                            <div className={styles.videoContainer}>
                                <iframe
                                    src={currentLesson.video_url}
                                    title={currentLesson.title}
                                    className={styles.videoFrame}
                                    allowFullScreen
                                />
                            </div>
                        ) : currentLesson.images &&
                          currentLesson.images.length > 0 ? (
                            <div className={styles.imageContainer}>
                                <img
                                    src={currentLesson.images[0]}
                                    alt={currentLesson.title}
                                    className={styles.lessonImage}
                                />
                            </div>
                        ) : (
                            <div className={styles.placeholderContainer}>
                                <div className={styles.mediaPlaceholder}>
                                    Không có video hoặc hình ảnh
                                </div>
                            </div>
                        )}
                    </div>

                    <div className={styles.lessonDetails}>
                        <div className={styles.lessonMetadata}>
                            <div className={styles.metadataItem}>
                                <span className={styles.metadataLabel}>
                                    Thời lượng:
                                </span>
                                <span className={styles.metadataValue}>
                                    {formatDuration(currentLesson.duration)}
                                </span>
                            </div>
                            <div className={styles.metadataItem}>
                                <span className={styles.metadataLabel}>
                                    Bài tập:
                                </span>
                                <span className={styles.metadataValue}>
                                    {currentLesson.exercises.length} bài
                                </span>
                            </div>
                            <div className={styles.metadataItem}>
                                <span className={styles.metadataLabel}>
                                    Điểm trung bình:
                                </span>
                                <span className={styles.metadataValue}>
                                    {currentLesson.averageScore
                                        ? `${currentLesson.averageScore}/100`
                                        : 'Chưa có'}
                                </span>
                            </div>
                        </div>

                        <div className={styles.progressContainer}>
                            <div className={styles.progressLabel}>
                                Tiến độ hoàn thành: {currentLesson.progress}%
                            </div>
                            <div className={styles.progressBar}>
                                <div
                                    className={styles.progressFill}
                                    style={{
                                        width: `${currentLesson.progress}%`,
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Tab navigation */}
            <div className={styles.tabs}>
                <button
                    className={`${styles.tabButton} ${activeTab === 'content' ? styles.active : ''}`}
                    onClick={() => setActiveTab('content')}
                >
                    Nội dung bài học
                </button>
                <button
                    className={`${styles.tabButton} ${activeTab === 'exercises' ? styles.active : ''}`}
                    onClick={() => setActiveTab('exercises')}
                >
                    Danh sách bài tập
                </button>
            </div>

            {/* Tab content */}
            <div className={styles.tabContent}>
                {activeTab === 'content' ? (
                    <div className={styles.lessonContent}>
                        <div className={styles.lessonDescription}>
                            <h3 className={styles.sectionTitle}>Mô tả</h3>
                            <p>{currentLesson?.description}</p>
                        </div>

                        <div className={styles.lessonBodyContent}>
                            <h3 className={styles.sectionTitle}>
                                Nội dung chi tiết
                            </h3>
                            <div
                                className={styles.bodyHtml}
                                dangerouslySetInnerHTML={{
                                    __html: currentLesson?.body || '',
                                }}
                            />
                        </div>
                    </div>
                ) : (
                    <div className={styles.exercisesContainer}>
                        <div className={styles.exercisesHeader}>
                            <h3 className={styles.sectionTitle}>
                                Danh sách bài tập
                            </h3>
                            <button
                                onClick={handleAddExercise}
                                className={styles.addExerciseButton}
                            >
                                + Thêm bài tập
                            </button>
                        </div>

                        {currentLesson?.exercises &&
                        currentLesson.exercises.length > 0 ? (
                            <div className={styles.exercisesList}>
                                {currentLesson.exercises.map((exercise) => (
                                    <div
                                        key={exercise._id}
                                        className={styles.exerciseItem}
                                    >
                                        <div className={styles.exerciseInfo}>
                                            <h4
                                                className={styles.exerciseTitle}
                                            >
                                                {exercise.title}
                                            </h4>
                                            <p
                                                className={
                                                    styles.exerciseDescription
                                                }
                                            >
                                                {exercise.description}
                                            </p>
                                        </div>

                                        <div className={styles.exerciseStats}>
                                            <div
                                                className={
                                                    styles.completionContainer
                                                }
                                            >
                                                <div
                                                    className={
                                                        styles.completionLabel
                                                    }
                                                >
                                                    Hoàn thành: 20%
                                                </div>
                                                <div
                                                    className={
                                                        styles.completionBar
                                                    }
                                                >
                                                    <div
                                                        className={
                                                            styles.completionFill
                                                        }
                                                        style={{
                                                            width: `${20}%`,
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            <div
                                                className={
                                                    styles.exerciseActions
                                                }
                                            >
                                                <button
                                                    className={
                                                        styles.actionButton
                                                    }
                                                    onClick={() =>
                                                        handleViewExercise(
                                                            exercise
                                                        )
                                                    }
                                                >
                                                    Xem chi tiết
                                                </button>
                                                <button
                                                    className={
                                                        styles.actionButton
                                                    }
                                                >
                                                    Sửa
                                                </button>
                                                <button
                                                    className={
                                                        styles.actionButtonDelete
                                                    }
                                                >
                                                    Xóa
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className={styles.emptyStateContainer}>
                                <p className={styles.emptyStateMessage}>
                                    Chưa có bài tập nào trong bài học này
                                </p>
                                <button
                                    onClick={handleAddExercise}
                                    className={styles.emptyStateButton}
                                >
                                    Thêm bài tập đầu tiên
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Toast notification */}
            {toast.show && <Toast toast={toast} onClose={hideToast} />}
        </div>
    )
};

export default LessonDetail;