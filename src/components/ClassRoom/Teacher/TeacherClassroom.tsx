import React, { useState, useEffect } from 'react'
import styles from './TeacherClassroom.module.css'
import Toast from '../../commons/Toast/Toast.tsx'
import { Course } from '../../../model/classroom.ts'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import RequireAuth from '../../commons/RequireAuth/RequireAuth.tsx'
import { getCourseByTeacherId, addCourse } from '../../../services/course.ts'
import AddCoursePopup from './AddCoursePopUp/AddCoursePopup.tsx'
import { FaPlus } from 'react-icons/fa'

interface ToastMessage {
    show: boolean
    type: 'success' | 'error' | 'info'
    title: string
    message: string
    image?: string
}

interface NotificationProps {
    title: string
    message: string
    image: string
}

// Empty state notification component
const EmptyStateNotification: React.FC<NotificationProps> = ({
    title,
    message,
    image,
}) => {
    return (
        <div className={styles.emptyStateContainer}>
            <div className={styles.emptyStateContent}>
                <img
                    src={image}
                    alt={title}
                    className={styles.emptyStateImage}
                />
                <h2 className={styles.emptyStateTitle}>{title}</h2>
                <p className={styles.emptyStateMessage}>{message}</p>
            </div>
        </div>
    )
}

const TeacherClassroom: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>([])
    const navigate = useNavigate()
    const [toast, setToast] = useState<ToastMessage>({
        show: false,
        type: 'info',
        title: '',
        message: '',
    })
    const [isAddCourseOpen, setIsAddCourseOpen] = useState(false)

    const { user } = useSelector((state: any) => state.auth)

    if (!user) {
        return <RequireAuth></RequireAuth>
    }

    // Get teacher ID from user object
    const teacherId = user._id || ''

    // Fetch courses data from API
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Use the service function to get courses by teacher ID
                const coursesData = await getCourseByTeacherId(teacherId)
                setCourses(coursesData.data)

                // Show success toast
                setToast({
                    show: true,
                    type: 'success',
                    title: 'Thành công',
                    message: 'Đã tải danh sách lớp học',
                    image: '/images/success.png',
                })

                // Hide toast after 3 seconds
                setTimeout(() => {
                    setToast((prev) => ({ ...prev, show: false }))
                }, 3000)
            } catch (error) {
                console.error('Error fetching courses:', error)
                setToast({
                    show: true,
                    type: 'error',
                    title: 'Lỗi',
                    message: 'Không thể tải danh sách lớp học',
                    image: '/images/error.png',
                })
            }
        }

        fetchData()
    }, [teacherId])

    const showToast = (
        type: 'success' | 'error' | 'info',
        title: string,
        message: string
    ) => {
        setToast({
            show: true,
            type,
            title,
            message,
        })
    }
    // Close toast
    const hideToast = () => {
        setToast((prev) => ({ ...prev, show: false }))
    }

    // Handle course click
    const handleCourseClick = (courseId: string, course: Course) => {
        setToast({
            show: true,
            type: 'info',
            title: 'Đã chọn lớp học',
            message: `Bạn đã chọn lớp học có ID: ${courseId}`,
            image: '/images/info.png',
        })

        // Hide toast after 3 seconds
        setTimeout(() => {
            setToast((prev) => ({ ...prev, show: false }))
        }, 3000)

        // Handle navigation with course ID
        console.log('Selected course ID:', courseId)
        navigate(`/classroom/courses/${courseId}`, { state: { course } })
    }

    // Format date function
    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A'
        if (dateString === 'unlimited') return 'Không giới hạn'

        const date = new Date(dateString)
        return date.toLocaleDateString('vi-VN')
    }

    // Handle adding new course
    const handleAddCourse = async (courseData: any) => {
        try {
            const newCourseData = {
                ...courseData,
                teacherId: user._id,
            }

            const result = await addCourse(newCourseData)

            // Add the new course to the list
            setCourses([...courses, result.data])

            showToast(
                'success',
                'Thêm thành công',
                'Đã thêm khóa học mới vào danh sách'
            )
        } catch (error) {
            console.error('Error adding course:', error)
            showToast(
                'error',
                'Lỗi',
                'Không thể thêm khóa học. Vui lòng thử lại sau.'
            )
        }
    }
    const addCourseList = (newCourse: Course) => {
        setCourses(prevCourses => [...prevCourses, newCourse]);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Quản lý khóa học</h1>
                <div className={styles.headerButton}>
                    <button
                        className={styles.addCourseButton}
                        onClick={() => setIsAddCourseOpen(true)}
                    >
                        <FaPlus /> Thêm khóa học
                    </button>
                </div>
            </div>

            {/* Courses Content - Centered */}
            <div className={styles.centeredContent}>
                {courses.length > 0 ? (
                    <div className={styles.coursesGrid}>
                        {courses.map((course) => (
                            <div
                                key={course._id}
                                className={styles.courseCard}
                                onClick={() =>
                                    handleCourseClick(course._id, course)
                                }
                            >
                                <div className={styles.courseImageContainer}>
                                    <img
                                        src={
                                            course.images &&
                                            course.images.length > 0
                                                ? course.images[0]
                                                : 'https://i.pinimg.com/736x/95/6f/0f/956f0fef63faac5be7b95715f6207fea.jpg'
                                        }
                                        alt={course.title}
                                        className={styles.courseImage}
                                    />
                                </div>
                                <div className={styles.courseContent}>
                                    <h3 className={styles.courseTitle}>
                                        {course.title}
                                    </h3>
                                    <p className={styles.courseDescription}>
                                        {course.description}
                                    </p>
                                    <div className={styles.courseStats}>
                                        {course.students && (
                                            <div className={styles.statsItem}>
                                                <span
                                                    className={
                                                        styles.statsLabel
                                                    }
                                                >
                                                    Học sinh:
                                                </span>
                                                <span
                                                    className={
                                                        styles.statsValue
                                                    }
                                                >
                                                    {course.students.length}
                                                </span>
                                            </div>
                                        )}
                                        <div className={styles.statsItem}>
                                            <span className={styles.statsLabel}>
                                                Thời gian:
                                            </span>
                                            <span className={styles.statsValue}>
                                                {formatDate(course.start_date)}{' '}
                                                -{' '}
                                                {course.end_date === 'unlimited'
                                                    ? 'Không giới hạn'
                                                    : formatDate(
                                                          course.end_date
                                                      )}
                                            </span>
                                        </div>
                                    </div>
                                    {course.progress !== undefined && (
                                        <div
                                            className={styles.progressContainer}
                                        >
                                            <div
                                                className={styles.progressLabel}
                                            >
                                                Tiến độ: {course.progress}%
                                            </div>
                                            <div className={styles.progressBar}>
                                                <div
                                                    className={
                                                        styles.progressFill
                                                    }
                                                    style={{
                                                        width: `${course.progress}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={styles.emptyStateWrapper}>
                        <EmptyStateNotification
                            title="Không có lớp học nào được phân công"
                            message="Hiện tại bạn chưa được phân công dạy lớp bộ môn nào. Hãy thêm lớp học mới hoặc liên hệ với quản trị viên."
                            image="https://i.pinimg.com/originals/d4/4c/38/d44c389f5c025d038a250e6219a2c195.gif"
                        />
                        <button
                            className={styles.addEmptyStateButton}
                            onClick={() => setIsAddCourseOpen(true)}
                        >
                            <FaPlus /> Thêm khóa học mới
                        </button>
                    </div>
                )}
            </div>

            {/* Add Course Popup */}
            {isAddCourseOpen && (
                <AddCoursePopup
                    onClose={() => setIsAddCourseOpen(false)}
                    onSubmit={handleAddCourse}
                    onAddCourse={addCourseList}
                    courses={courses} // Pass the courses to the popup
                />
            )}

            {/* Toast notification */}
            {toast.show && <Toast toast={toast} onClose={hideToast} type={''} />}
        </div>
    )
}

export default TeacherClassroom
