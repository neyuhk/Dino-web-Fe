import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './CourseLessons.module.css';
import {
    FaArrowLeft,
    FaEdit,
    FaEye,
    FaPlus,
    FaVideo,
    FaFileAlt,
    FaStopwatch,
    FaClipboardCheck,
    FaRecycle, FaTrash,
} from 'react-icons/fa'
import { Course, Exercise, Lesson } from '../../../../model/classroom.ts'
import { getLessonByCourseId } from '../../../../services/lesson.ts'
import Toast from '../../../commons/Toast/Toast.tsx'
import AddLessonPopup from '../AddLessonPopup/AddLessonPopup.tsx'
import { FaDeleteLeft } from 'react-icons/fa6'

interface ToastMessage {
    show: boolean;
    type: 'success' | 'error' | 'info';
    title: string;
    message: string;
    image?: string;
}

interface EmptyStateProps {
    title: string;
    message: string;
    image: string;
}

interface CourseLessonsProps {
    courseId: string;
}

// Empty state component
const EmptyStateNotification: React.FC<EmptyStateProps> = ({ title, message, image }) => {
    return (
        <div className={styles.emptyStateContainer}>
            <div className={styles.emptyStateContent}>
                <img src={image} alt={title} className={styles.emptyStateImage} />
                <h2 className={styles.emptyStateTitle}>{title}</h2>
                <p className={styles.emptyStateMessage}>{message}</p>
            </div>
        </div>
    );
};

const CourseLessons: React.FC<CourseLessonsProps> = ({ courseId }) => {
    const navigate = useNavigate();
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [courseTitle, setCourseTitle] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);
    const [toast, setToast] = useState<ToastMessage>({
        show: false,
        type: 'info',
        title: '',
        message: ''
    });


    const [showAddLessonPopup, setShowAddLessonPopup] = useState<boolean>(false);

    useEffect(() => {
        const fetchLessons = async () => {
            try {
                setLoading(true);
                setError(false);

                if (!courseId) {
                    throw new Error('Course ID is missing');
                }

                const response = await getLessonByCourseId(courseId);
                console.log('lesson', response.data);

                if (!response.data || response.data.length === 0) {
                    setLessons([]);
                } else {
                    setLessons(response.data);
                    setCourseTitle('Ten lop hoc');
                }

                setToast({
                    show: true,
                    type: 'success',
                    title: 'Thành công',
                    message: 'Đã tải danh sách bài học',
                    image: '/images/success.png'
                });

                setTimeout(() => {
                    setToast(prev => ({ ...prev, show: false }));
                }, 3000);
            } catch (err) {
                console.error('Error fetching lessons:', err);
                setError(true);
                setToast({
                    show: true,
                    type: 'error',
                    title: 'Lỗi',
                    message: 'Không thể tải danh sách bài học',
                    image: '/images/error.png'
                });
            } finally {
                setLoading(false);
            }
        };

        fetchLessons();
    }, [courseId]); // Chỉ phụ thuộc vào courseId

    const handleBack = () => {
        navigate(-1);
    };

    const handleViewLesson = (lesson: Lesson) => {
        setToast({
            show: true,
            type: 'info',
            title: 'Xem bài học',
            message: `Đang mở ${lesson.title}`,
            image: '/images/info.png'
        });

        setTimeout(() => {
            setToast(prev => ({ ...prev, show: false }));
        }, 3000);

        // Navigate to lesson detail page
        console.log('lesson', lesson._id);

        navigate(`/classroom/courses/${courseId}/lesson/${lesson._id}`, { state: { lesson } });
    };

    const handleEditLesson = (lessonId: string) => {
        setToast({
            show: true,
            type: 'info',
            title: 'Chỉnh sửa bài học',
            message: `Đang mở chỉnh sửa bài học có ID: ${lessonId}`,
            image: '/images/info.png'
        });

        setTimeout(() => {
            setToast(prev => ({ ...prev, show: false }));
        }, 3000);

        // Navigate to lesson edit page
        navigate(`/lessons/${lessonId}/edit`);
    };

    const handleAddLesson = () => {
        setShowAddLessonPopup(true);
    };

    const handleCloseAddLessonPopup = () => {
        setShowAddLessonPopup(false);
    };

// Thêm hàm để xử lý khi submit form
    const handleSubmitLesson = async (lessonData: any) => {
        try {
            // Gọi API để tạo lesson mới (giả định)
            // const response = await createLesson(lessonData);
            console.log('Submitting lesson data:', lessonData);

            // Hiển thị thông báo thành công
            setToast({
                show: true,
                type: 'success',
                title: 'Thành công',
                message: 'Đã thêm bài học mới',
                image: '/images/success.png'
            });

            setTimeout(() => {
                setToast(prev => ({ ...prev, show: false }));
            }, 3000);

            // Tải lại danh sách bài học
            // fetchLessons();
        } catch (error) {
            console.error('Error creating lesson:', error);
            setToast({
                show: true,
                type: 'error',
                title: 'Lỗi',
                message: 'Không thể thêm bài học mới',
                image: '/images/error.png'
            });

            setTimeout(() => {
                setToast(prev => ({ ...prev, show: false }));
            }, 3000);
        }
    };

    const hideToast = () => {
        setToast(prev => ({ ...prev, show: false }));
    };

    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    };

    // Format duration in minutes to hours and minutes
    const formatDuration = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;

        if (hours > 0) {
            return `${hours} giờ ${mins > 0 ? `${mins} phút` : ''}`;
        }
        return `${mins} phút`;
    };

    if (loading) {
        return (
            <div className={styles.loaderContainer}>
                <div className={styles.loader}></div>
                <p>Đang tải dữ liệu...</p>
            </div>
        );
    }

    if (error) {
        return (
            <EmptyStateNotification
                title="Không thể tải dữ liệu"
                message="Đã xảy ra lỗi khi tải danh sách bài học. Vui lòng thử lại sau hoặc liên hệ với quản trị viên."
                image="/images/error-state.png"
            />
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                {/*<button className={styles.backButton} onClick={handleBack}>*/}
                {/*    <FaArrowLeft /> Quay lại*/}
                {/*</button>*/}
                {/*<h1 className={styles.title}>{courseTitle}</h1>*/}
                <button className={styles.addButton} onClick={handleAddLesson}>
                    <FaPlus /> Thêm bài học
                </button>
            </div>

            {lessons && lessons.length > 0 ? (
                <div className={styles.lessonList}>
                    {lessons.map((lesson) => (
                        <div key={lesson._id} className={styles.lessonCard}>
                            <div className={styles.lessonOrder}>
                                {lesson.order}
                            </div>
                            <div className={styles.lessonImageContainer}>
                                {lesson.images && lesson.images.length > 0 ? (
                                    <img
                                        src={lesson.images[0]}
                                        alt={lesson.title}
                                        className={styles.lessonImage}
                                    />
                                ) : (
                                    <div className={styles.noImage}>
                                        <FaFileAlt size={40} />
                                    </div>
                                )}
                            </div>
                            <div className={styles.lessonContent}>
                                <h3 className={styles.lessonTitle}>
                                    {lesson.title}
                                </h3>
                                <p className={styles.lessonDescription}>
                                    {lesson.description}
                                </p>
                                <div className={styles.lessonMeta}>
                                    <div className={styles.metaItem}>
                                        <FaStopwatch />{' '}
                                        <span>
                                            {formatDuration(
                                                lesson.duration || 0
                                            )}
                                        </span>
                                    </div>
                                    {lesson.video_url && (
                                        <div className={styles.metaItem}>
                                            <FaVideo />{' '}
                                            <span>Video bài giảng</span>
                                        </div>
                                    )}
                                    <div className={styles.metaItem}>
                                        <FaClipboardCheck />{' '}
                                        <span>
                                            {(lesson.exercises &&
                                                lesson.exercises.length) ||
                                                0}{' '}
                                            bài tập
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.lessonActions}>
                                <button
                                    className={`${styles.actionButton} ${styles.viewButton}`}
                                    onClick={() => handleViewLesson(lesson)}
                                >
                                    <FaEye /> Xem
                                </button>
                                <button
                                    className={`${styles.actionButton} ${styles.editButton}`}
                                    onClick={() => handleEditLesson(lesson._id)}
                                >
                                    <FaEdit /> Sửa
                                </button>

                                <button
                                    className={`${styles.actionButton} ${styles.deleteButton}`}
                                    onClick={() => handleEditLesson(lesson._id)}
                                >
                                    <FaTrash /> Xoá
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <EmptyStateNotification
                    title="Chưa có bài học nào"
                    message="Khóa học này chưa có bài học nào. Hãy nhấn nút 'Thêm bài học' để tạo bài học đầu tiên."
                    image="/images/empty-lessons.png"
                />
            )}

            {showAddLessonPopup && (
                <AddLessonPopup
                    courseId={courseId || ''}
                    onClose={handleCloseAddLessonPopup}
                    onSubmit={handleSubmitLesson}
                />
            )}

            {toast.show && <Toast toast={toast} onClose={hideToast} />}
        </div>
    )
};

export default CourseLessons;