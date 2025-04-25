import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import QuestionForm from '../QuestionForm/QuestionForm'
import styles from './ExerciseDetail.module.css'
import { format } from 'date-fns'
import { FaArrowLeft, FaEdit, FaPlus, FaEye, FaTrash, FaChevronDown, FaChevronUp } from 'react-icons/fa'
import { Exercise, Quiz } from '../../../../../model/classroom.ts'
import { getQuizForTeacher, deleteQuiz } from '../../../../../services/lesson.ts'
import Toast, { ToastMessage } from '../../../../commons/Toast/Toast.tsx'
import ExerciseForm from '../ExerciseForm/ExerciseForm.tsx'
import { convertDateTimeToDate, convertDateTimeToDate2 } from '../../../../../helpers/convertDateTime.ts'
import { GraduationCap } from 'lucide-react'

const ExerciseDetail: React.FC = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const { lessonId } = useParams()
    const [exercise, setExercise] = useState<Exercise>(location.state?.exercise || null)
    const [questions, setQuestions] = useState<Quiz[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [showQuestionForm, setShowQuestionForm] = useState<boolean>(false)
    const [exerciseId, setExerciseId] = useState<string | null>(null)
    const [editingQuestion, setEditingQuestion] = useState<Quiz | null>(null)
    const [expandedQuestions, setExpandedQuestions] = useState<string[]>([])

    const [deletingQuestionId, setDeletingQuestionId] = useState<string | null>(null)
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)
    const [questionToDelete, setQuestionToDelete] = useState<Quiz | null>(null)

    const [showEditModal, setShowEditModal] = useState<boolean>(false)

    const [toast, setToast] = useState<ToastMessage>({
        show: false,
        type: 'info',
        title: '',
        message: '',
    })

    useEffect(() => {
        if (!exercise) {
            navigate(-1)
            return
        }

        const fetchQuestions = async () => {
            try {
                setIsLoading(true)
                const data = await getQuizForTeacher(exercise._id)
                setQuestions(data.data || [])
            } catch (error) {
                console.error('Lỗi khi tải câu hỏi:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchQuestions()
    }, [exercise, navigate])

    const handleQuestionFormComplete = () => {
        setShowQuestionForm(false)
        setExerciseId(null)
        setEditingQuestion(null)
        // Cập nhật lại danh sách câu hỏi sau khi thêm/sửa
        getQuizForTeacher(exercise._id).then(data => setQuestions(data.data || []))
    }

    const handleAddQuestion = () => {
        setShowQuestionForm(true)
        setExerciseId(exercise._id)
        setEditingQuestion(null)
    }

    const handleViewQuestion = (question: Quiz) => {
        setEditingQuestion(question)
        setShowQuestionForm(true)
        setExerciseId(exercise._id)
    }

    const toggleQuestionExpand = (questionId: string) => {
        setExpandedQuestions(prev =>
            prev.includes(questionId)
                ? prev.filter(id => id !== questionId)
                : [...prev, questionId],
        )
    }

    const isQuestionExpanded = (questionId: string) => {
        return expandedQuestions.includes(questionId)
    }

    const handleDeleteQuestion = (question: Quiz) => {
        setQuestionToDelete(question)
        setShowDeleteModal(true)
    }

    const confirmDeleteQuestion = async () => {
        if (!questionToDelete) return
        setDeletingQuestionId(questionToDelete._id)

        try {
            await deleteQuiz(questionToDelete._id)
            const data = await getQuizForTeacher(exercise._id)
            setQuestions(data || [])
            setShowDeleteModal(false)
            setQuestionToDelete(null)
            setToast({
                show: true,
                type: 'success',
                title: 'Thành công',
                message: 'Xoá câu hỏi thành công',
            })
        } catch (error) {
            setToast({
                show: true,
                type: 'error',
                title: 'Không thành công',
                message: 'Có lỗi khi xoá câu hỏi, hãy thử lại sau',
            })
        } finally {
            setDeletingQuestionId(null)
        }
    }

    const renderTime = () => {
        const totalSeconds = exercise.time
        const hours = Math.floor(totalSeconds / 3600)
        const minutes = Math.floor((totalSeconds % 3600) / 60)
        const seconds = totalSeconds % 60

        let formattedTime = ''

        if (hours > 0) {
            formattedTime += `${hours} giờ `
        }
        if (minutes > 0) {
            formattedTime += `${minutes} phút `
        }
        if (seconds > 0 && formattedTime === '') {
            // Chỉ hiển thị giây nếu không có giờ và phút
            formattedTime += `${seconds} giây `
        }

        if (exercise.type === 'quiz') {
            return `${formattedTime.trim()} cho mỗi câu hỏi`
        }
        if (exercise.type === 'test') {
            return `${formattedTime.trim()} để hoàn thành`
        }
        return `Hạn nộp: ${convertDateTimeToDate2(new Date(exercise.end_date))}`
    }

    const getExerciseTypeLabel = () => {
        switch (exercise.type) {
            case 'quiz':
                return 'Bài Tập Quiz'
            case 'test':
                return 'Bài Kiểm Tra'
            case 'file':
                return 'Nộp File'
            default:
                return 'Bài Tập'
        }
    }

    const handleOpenEditModal = () => {
        setShowEditModal(true)
    }

    const handleCloseEditModal = () => {
        setShowEditModal(false)
    }

    const hideToast = () => {
        setToast(prev => ({ ...prev, show: false }))
    }

    if (!exercise) {
        return <div className={styles.loading}>Đang tải...</div>
    }

    return (
        <div className={styles.container}>
            {showDeleteModal && questionToDelete && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h2 className={styles.modalTitle}>
                            Xác nhận xoá câu hỏi
                        </h2>
                        <p className={styles.modalText}>
                            Bạn có chắc chắn muốn xoá câu hỏi này?
                        </p>
                        <div className={styles.questionPreview}>
                            <img
                                src={
                                    'https://i.pinimg.com/originals/a1/ad/16/a1ad1633c910da81cfedc8428105ced5.gif'
                                }
                                alt="Câu hỏi"
                                className={styles.questionImage}
                            />
                            <p className={styles.modalQuestion}>
                                {questionToDelete.question}
                            </p>
                        </div>
                        <div className={styles.modalActions}>
                            <button
                                className={styles.cancelButton}
                                onClick={() => setShowDeleteModal(false)}
                            >
                                Huỷ
                            </button>
                            <button
                                className={styles.confirmButton}
                                onClick={confirmDeleteQuestion}
                                disabled={
                                    deletingQuestionId === questionToDelete._id
                                }
                            >
                                {deletingQuestionId === questionToDelete._id
                                    ? 'Đang xóa...'
                                    : 'Xác nhận xoá'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showQuestionForm ? (
                <QuestionForm
                    lessonId={lessonId || ''}
                    exerciseId={exerciseId || ''}
                    exerciseType={exercise.type}
                    onComplete={handleQuestionFormComplete}
                    onCancel={() => {
                        setShowQuestionForm(false)
                        setExerciseId(null)
                        setEditingQuestion(null)
                    }}
                />
            ) : (
                <>
                    <div className={styles.header}>
                        <button
                            className="backButton"
                            onClick={() => navigate(-1)}
                        >
                            <FaArrowLeft /> Quay lại
                        </button>
                        <h1 className={styles.title}>{exercise.title}</h1>
                        <button
                            onClick={handleOpenEditModal}
                            className={styles.addButton}
                        >
                            <FaEdit /> Chỉnh sửa
                        </button>
                    </div>

                    <div className={styles.details}>
                        <div className={styles.infoSection}>
                            <div className={styles.badge}>
                                {getExerciseTypeLabel()}
                            </div>
                            <p className={styles.time}>{renderTime()}</p>
                            <p className={styles.description}>
                                {exercise.description}
                            </p>
                            <span className={styles.description}>
                                Thời hạn nộp bài: {exercise.end_date
                                ? convertDateTimeToDate(exercise.end_date)
                                : 'Không giới hạn'}
                            </span>
                        </div>
                    </div>

                    <div className={styles.questionsSection}>
                        <div className={styles.sectionHeader}>
                            <h2>Câu hỏi</h2>
                            <button
                                className={styles.addButton}
                                onClick={handleAddQuestion}
                            >
                                <FaPlus /> Thêm câu hỏi
                            </button>
                        </div>

                        {isLoading ? (
                            <div className={"loadingContainer"} style={{ justifyContent: "flex-start", backgroundColor: "transparent"}}>
                                <div className={"loadingSpinner"}>
                                    <GraduationCap size={32} className={"loadingIcon"} />
                                </div>
                                <p>Đang tải lớp học của bạn...</p>
                            </div>
                        ) : questions.length > 0 ? (

                            <div className={styles.questionsList}>
                                {questions.map((question, index) => (
                                    <div
                                        key={question._id}
                                        className={`${styles.questionItem} ${isQuestionExpanded(question._id) ? styles.expanded : ''}`}
                                    >
                                        <div
                                            className={styles.questionContent}
                                            onClick={() =>
                                                toggleQuestionExpand(
                                                    question._id,
                                                )
                                            }
                                        >
                                            <span
                                                className={
                                                    styles.questionNumber
                                                }
                                            >
                                                #{index + 1}
                                            </span>
                                            <p className={styles.questionText}>
                                                {question.question}
                                            </p>
                                            <div
                                                className={styles.questionType}
                                            >
                                                {question.type_answer ===
                                                'multiple_choice'
                                                    ? 'Nhiều lựa chọn'
                                                    : 'Một lựa chọn'}
                                            </div>
                                            <div className={styles.expandIcon}>
                                                {isQuestionExpanded(
                                                    question._id,
                                                ) ? (
                                                    <FaChevronUp />
                                                ) : (
                                                    <FaChevronDown />
                                                )}
                                            </div>
                                        </div>

                                        {isQuestionExpanded(question._id) && (
                                            <div
                                                className={
                                                    styles.expandedContent
                                                }
                                            >
                                                {question.image && (
                                                    <img
                                                        src={question.image}
                                                        alt="Hình minh họa câu hỏi"
                                                        style={{ maxWidth: '20%', marginBottom: '1rem' }}
                                                    />
                                                )}
                                                <div
                                                    className={
                                                        styles.answersList
                                                    }
                                                >
                                                    {question.answers &&
                                                        question.answers.map(
                                                            (
                                                                answer,
                                                                answerIndex,
                                                            ) => (
                                                                <div
                                                                    key={
                                                                        answerIndex
                                                                    }
                                                                    className={`${styles.answerItem} ${
                                                                        question.correct_answer &&
                                                                        question.correct_answer.includes(
                                                                            answer,
                                                                        )
                                                                            ? styles.correctAnswer
                                                                            : ''
                                                                    }`}
                                                                >
                                                                    <span
                                                                        className={
                                                                            styles.answerLetter
                                                                        }
                                                                    >
                                                                        {String.fromCharCode(
                                                                            65 +
                                                                            answerIndex,
                                                                        )}
                                                                    </span>
                                                                    <span
                                                                        className={
                                                                            styles.answerText
                                                                        }
                                                                    >
                                                                        {answer}
                                                                    </span>
                                                                </div>
                                                            ),
                                                        )}
                                                </div>

                                                <div
                                                    className={
                                                        styles.expandedActions
                                                    }
                                                >
                                                    <button
                                                        className={
                                                            styles.editButton
                                                        }
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            handleViewQuestion(
                                                                question,
                                                            )
                                                        }}
                                                    >
                                                        <FaEdit /> Sửa
                                                    </button>
                                                    <button
                                                        className={
                                                            styles.deleteButton
                                                        }
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            handleDeleteQuestion(
                                                                question,
                                                            )
                                                        }}
                                                        disabled={
                                                            deletingQuestionId ===
                                                            question._id
                                                        }
                                                    >
                                                        <FaTrash />{' '}
                                                        {deletingQuestionId ===
                                                        question._id
                                                            ? 'Đang xóa...'
                                                            : 'Xóa'}
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className={styles.noQuestions}>
                                <img
                                    src={
                                        'https://i.pinimg.com/originals/90/e7/0f/90e70f540578955ac0fcf9453ec4ac38.gif'
                                    }
                                    alt="Chưa có câu hỏi"
                                    className={styles.noQuestionsImage}
                                />
                                <h3>Chưa có câu hỏi</h3>
                                <p>
                                    Bài tập này chưa có câu hỏi nào. Hãy thêm
                                    câu hỏi đầu tiên để bắt đầu.
                                </p>
                                <button
                                    className={styles.addFirstButton}
                                    onClick={handleAddQuestion}
                                >
                                    <FaPlus /> Thêm câu hỏi đầu tiên
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}

            {showEditModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.editExerciseModal}>
                        <div className={styles.modalHeader}>
                            <h2>Chỉnh sửa bài tập</h2>
                            <button
                                className={styles.closeButton}
                                onClick={handleCloseEditModal}
                            >
                                &times;
                            </button>
                        </div>
                        <ExerciseForm
                            lessonId={lessonId || ''}
                            exerciseData={exercise}
                            isEditing={true}
                            onSuccess={(updatedExercise) => {
                                handleCloseEditModal()
                                if (updatedExercise) {
                                    setExercise(updatedExercise) // Thêm state này
                                } // Thêm state này
                                setToast({
                                    show: true,
                                    type: 'success',
                                    title: 'Thành công',
                                    message: 'Cập nhật bài tập thành công!',
                                })
                            }}
                        />
                    </div>
                </div>
            )}

            {toast.show && <Toast toast={toast} onClose={hideToast} type={''} />}
        </div>
    )
}

export default ExerciseDetail
