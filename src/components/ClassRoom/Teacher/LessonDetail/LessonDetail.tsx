import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import styles from './LessonDetail.module.css'
import Toast from '../../../commons/Toast/Toast.tsx'
import { Exercise, Lesson } from '../../../../model/classroom.ts'
import { useSelector } from 'react-redux'
import RequireAuth from '../../../commons/RequireAuth/RequireAuth.tsx'
import { deleteExercise } from '../../../../services/lesson.ts'
import DeleteConfirmPopup from './DeletePopup/DeleteConfirmPopup.tsx'
import { convertDateTimeToDate } from '../../../../helpers/convertDateTime.ts'
import { getExerciseForTeacher } from '../../../../services/exercise.ts'
import { getScoreForExercise } from '../../../../services/score.ts'
import { FaTimes } from 'react-icons/fa'

interface ToastMessage {
    show: boolean;
    type: 'success' | 'error' | 'info';
    title: string;
    message: string;
    image?: string;
}

const LessonDetail: React.FC = () => {
    const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>()
    const navigate = useNavigate()
    const location = useLocation()
    const lesson = location.state?.lesson || null
    const [exercises, setExercises] = useState<Exercise[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null)
    const [activeTab, setActiveTab] = useState<'content' | 'exercises'>('content')
    const { user } = useSelector((state: any) => state.auth)
    const [deleteConfirm, setDeleteConfirm] = useState({
        show: false,
        exerciseId: '',
        title: '',
        description: '',
    })
    const [showScoreModal, setShowScoreModal] = useState(false)
    const [scoreData, setScoreData] = useState<any[]>([])
    const [loadingScores, setLoadingScores] = useState(false)


    const [toast, setToast] = useState<ToastMessage>({
        show: false,
        type: 'info',
        title: '',
        message: '',
    })

    useEffect(() => {
        const fetchLessonDetail = async () => {
            try {
                setLoading(true)

                // If lesson is passed through location state, use it
                if (lesson) {
                    setCurrentLesson(lesson)
                } else {
                    // Otherwise you would fetch it from your API
                    // This is a placeholder for your actual API call
                    console.log('Would fetch lesson with ID:', lessonId)
                }

                setLoading(false)

                setToast({
                    show: true,
                    type: 'success',
                    title: 'Thành công',
                    message: 'Đã tải thông tin bài học',
                    image: '/images/success.png',
                })

                setTimeout(() => {
                    setToast(prev => ({ ...prev, show: false }))
                }, 3000)
            } catch (error) {
                console.error('Error fetching lesson details:', error)
                setLoading(false)
                setToast({
                    show: true,
                    type: 'error',
                    title: 'Lỗi',
                    message: 'Không thể tải thông tin bài học',
                    image: '/images/error.png',
                })
            }
        }

        //fetch exercise by lessonId for teacher
        const fetchExercises = async () => {
            try {
                const listExercise = await getExerciseForTeacher(lesson._id)
                console.log(listExercise.data)
                setExercises(listExercise.data)
            } catch (error) {
                console.error('Error fetching exercises:', error)
            }
        }
        fetchExercises()
        fetchLessonDetail()
    }, [lessonId, lesson, courseId, navigate])

    if (!user) {
        return (
            <RequireAuth></RequireAuth>
        )
    }

    const handleBack = () => {
        navigate(-1)
    }

    const hideToast = () => {
        setToast(prev => ({ ...prev, show: false }))
    }

    const handleViewProgress = async (exerciseId: string) => {
        try {
            setLoadingScores(true)
            const response = await getScoreForExercise(exerciseId)
            setScoreData(response.data)
            setShowScoreModal(true)
        } catch (error) {
            console.error('Error fetching scores:', error)
        } finally {
            setLoadingScores(false)
        }
    }

    const closeScoreModal = () => {
        setShowScoreModal(false)
        setScoreData([])
    }

    const handleAddExercise = () => {
        setToast({
            show: true,
            type: 'info',
            title: 'Thông báo',
            message: 'Chức năng thêm bài tập đang được phát triển',
            image: '/images/info.png',
        })
        navigate(`/classroom/courses/${courseId}/lesson/${lessonId}/new_exercise`)
    }

    const handleViewExercise = (exercise: Exercise) => {
        console.log('xem chi tiet ', courseId, lessonId, exercise._id)
        if (courseId && lessonId && exercise._id) {
            navigate(`/classroom/courses/${courseId}/lesson/${lessonId}/${exercise._id}`, {
                state: { exercise },
            })
        }
    }

    const handleDeleteExercise = (exercise: Exercise) => {
        setDeleteConfirm({
            show: true,
            exerciseId: exercise._id,
            title: exercise.title,
            description: exercise.description,
        })
    }

    const confirmDelete = async () => {
        try {
            await deleteExercise(deleteConfirm.exerciseId)

            setToast({
                show: true,
                type: 'success',
                title: 'Xóa thành công',
                message: 'Bài tập đã được xóa khỏi danh sách.',
                image: '/images/success.png',
            })

            // Cập nhật danh sách bài tập sau khi xóa
            setCurrentLesson(prevLesson => ({
                ...prevLesson!,
                exercises: prevLesson?.exercises.filter(ex => ex._id !== deleteConfirm.exerciseId) || [],
            }))

            // Đóng popup
            setDeleteConfirm({
                show: false,
                exerciseId: '',
                title: '',
                description: '',
            })
        } catch (error) {
            console.error('Lỗi khi xóa bài tập:', error)

            setToast({
                show: true,
                type: 'error',
                title: 'Lỗi',
                message: 'Không thể xóa bài tập. Vui lòng thử lại sau.',
                image: '/images/error.png',
            })
        }
    }

    const cancelDelete = () => {
        setDeleteConfirm({
            show: false,
            exerciseId: '',
            title: '',
            description: '',
        })
    }

    const getYoutubeEmbedUrl = (url: string) => {
        if (!url) return ''
        let videoId = ''
        const watchRegex = /youtube\.com\/watch\?v=([^&]+)/
        const shortRegex = /youtu\.be\/([^?]+)/
        const embedRegex = /youtube\.com\/embed\/([^?]+)/

        const watchMatch = url.match(watchRegex)
        const shortMatch = url.match(shortRegex)
        const embedMatch = url.match(embedRegex)

        if (watchMatch && watchMatch[1]) {
            videoId = watchMatch[1]
        } else if (shortMatch && shortMatch[1]) {
            videoId = shortMatch[1]
        } else if (embedMatch && embedMatch[1]) {
            videoId = embedMatch[1]
        } else {
            return url
        }
        return `https://www.youtube.com/embed/${videoId}`
    }
    const formatDuration = (minutes: number) => {
        const hours = Math.floor(minutes / 60)
        const mins = minutes % 60
        return `${hours > 0 ? `${hours} giờ ` : ''}${mins > 0 ? `${mins} phút` : ''}`
    }

    if (loading) {
        return <div className={styles.loadingContainer}>Đang tải...</div>
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
                                    src={getYoutubeEmbedUrl(currentLesson.video_url)}
                                    title={currentLesson.title}
                                    className={styles.videoFrame}
                                    allowFullScreen
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                />
                            </div>
                        ) : currentLesson.images && currentLesson.images.length > 0 ? (
                            <div className={styles.imageContainer}>
                                <img
                                    src={
                                        currentLesson.images[0]
                                            ? currentLesson.images[0]
                                            : 'src/assets/dinologo-black.jpg'
                                    }
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

                        {/*<div className={styles.progressContainer}>*/}
                        {/*<div className={styles.progressLabel}>*/}
                        {/*    Tiến độ hoàn thành: {currentLesson.progress}%*/}
                        {/*</div>*/}
                        {/*<div className={styles.progressBar}>*/}
                        {/*    <div*/}
                        {/*        className={styles.progressFill}*/}
                        {/*        style={{*/}
                        {/*            width: `${currentLesson.progress}%`,*/}
                        {/*        }}*/}
                        {/*    />*/}
                        {/*</div>*/}
                        {/*</div>*/}
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

                        {exercises.length > 0 ? (
                            <div className={styles.exercisesList}>
                                {exercises.map((exercise) => (
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
                                            <div
                                                className={
                                                    styles.exerciseDeadline
                                                }
                                            >
                                        <span
                                            className={
                                                styles.deadlineLabel
                                            }
                                        >
                                            Thời hạn nộp bài:
                                        </span>
                                                <span
                                                    className={
                                                        styles.deadlineValue
                                                    }
                                                >
                                            {exercise.end_date
                                                ? convertDateTimeToDate(exercise.end_date)
                                                : 'Không giới hạn'}
                                            </span>
                                            </div>
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
                                                    Hoàn thành: {exercise.userSubmited}/{exercise.userInCourse}
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
                                                            width: `${exercise.userInCourse ? (exercise.userSubmited / exercise.userInCourse) * 100 : 0}%`,
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
                                                            exercise,
                                                        )
                                                    }
                                                >
                                                    Xem chi tiết
                                                </button>
                                                <button
                                                    className={styles.actionButton}
                                                    onClick={() => handleViewProgress(exercise._id)} // Replace 'exerciseId' with the actual ID
                                                >
                                                    xem tiến độ
                                                </button>
                                                <button
                                                    className={
                                                        styles.actionButtonDelete
                                                    }
                                                    onClick={() => handleDeleteExercise(exercise)}
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
                        {showScoreModal && (
                            <div className={styles.modalOverlay}>
                                <div className={styles.popupContainer}>
                                    <div className={styles.popupHeader}>
                                        <h2 className={styles.popupTitle}>Điểm số bài tập</h2>
                                        <button className={styles.closeIconButton} onClick={closeScoreModal}>
                                            <FaTimes />
                                        </button>
                                    </div>
                                    <div className={styles.popupContent}>
                                        {loadingScores ? (
                                            <p className={styles.loadingText}>Đang tải...</p>
                                        ) : (
                                            <table className={styles.table}>
                                                <thead>
                                                <tr>
                                                    <th>Username</th>
                                                    <th>Email</th>
                                                    <th>Score</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {scoreData.map((user) => (
                                                    <tr key={user.user_id}>
                                                        <td>{user.username}</td>
                                                        <td>{user.email}</td>
                                                        <td>{user.score !== null ? user.score : 'Chưa có điểm'}</td>
                                                    </tr>
                                                ))}
                                                </tbody>
                                            </table>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <DeleteConfirmPopup
                show={deleteConfirm.show}
                title={deleteConfirm.title}
                description={deleteConfirm.description}
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
            />
            {/* Toast notification */}
            {toast.show && <Toast toast={toast} onClose={hideToast} type={''} />}
        </div>

    )


}

export default LessonDetail
