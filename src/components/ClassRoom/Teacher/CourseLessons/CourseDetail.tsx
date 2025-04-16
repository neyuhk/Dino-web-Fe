import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import styles from './CourseDetail.module.css'
import CourseLessons from './CourseLessons'
import Toast from '../../../commons/Toast/Toast.tsx'
import CourseStudents from './CourseStudents.tsx'
import { useSelector } from 'react-redux'
import RequireAuth from '../../../commons/RequireAuth/RequireAuth.tsx'
import { User } from '../../../../model/model.ts'
import {
    getStudentByCourseId,
    editCourse,
    deleteCourse,
} from '../../../../services/course.ts'
import { FaTimes } from 'react-icons/fa'
import { Button, Upload } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { convertDateTimeToDate } from '../../../../helpers/convertDateTime.ts'
import CourseScore from './CourseScore.tsx'

interface ToastMessage {
    show: boolean
    type: 'success' | 'error' | 'info'
    title: string
    message: string
    image?: string
}

const CourseDetail: React.FC = () => {
    const { courseId } = useParams<{ courseId: string }>()
    const navigate = useNavigate()
    const location = useLocation()
    const course = location.state?.course || null
    const [activeTab, setActiveTab] = useState<'lessons' | 'students' | 'scores'>(
        'lessons'
    )
    const [loading, setLoading] = useState<boolean>(true)
    const { user } = useSelector((state: any) => state.auth)
    const [listStudent, setListStudent] = useState<User[]>([])
    const [showEditModal, setShowEditModal] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [selectedImage, setSelectedImage] = useState<any>(null)
    const [showConfirmModal, setShowConfirmModal] = useState(false)


    // Initialize edit form data from course
    const [editFormData, setEditFormData] = useState({
        title: course?.title || '',
        description: course?.description || '',
        startDate: course?.start_date || '',
        endDate: course?.end_date || '',
        status: course?.status || 'ACTIVE',
    })

    const [toast, setToast] = useState<ToastMessage>({
        show: false,
        type: 'info',
        title: '',
        message: '',
    })

    useEffect(() => {
        const fetchCourseDetail = async () => {
            try {
                setLoading(true)

                // Fetch students for this course
                if (courseId) {
                    const students = await getStudentByCourseId(courseId)
                    setListStudent(students.data)
                }

                if (course) {
                    // Update edit form data with course details
                    setEditFormData({
                        title: course.title || '',
                        description: course.description || '',
                        startDate: course.start_date || '',
                        endDate: course.end_date || '',
                        status: course.status || 'ACTIVE',
                    })
                }

                setLoading(false)

                setToast({
                    show: true,
                    type: 'success',
                    title: 'Thành công',
                    message: 'Đã tải thông tin lớp học',
                    image: '/images/success.png',
                })

                // Hide toast after 3 seconds
                setTimeout(() => {
                    setToast((prev) => ({ ...prev, show: false }))
                }, 3000)
            } catch (error) {
                console.error('Error fetching course details:', error)
                setLoading(false)
                setToast({
                    show: true,
                    type: 'error',
                    title: 'Lỗi',
                    message: 'Không thể tải thông tin lớp học',
                    image: '/images/error.png',
                })
            }
        }

        fetchCourseDetail()
    }, [courseId, course])

    const handleBack = () => {
        navigate(-1) // Go back to previous page
    }

    const hideToast = () => {
        setToast((prev) => ({ ...prev, show: false }))
    }

    // Handle opening edit modal
    const handleOpenEditModal = () => {
        setShowEditModal(true)
        console.log('Opening edit modal, showEditModal set to:', true)
    }

    // Handle form input changes
    const handleEditChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target
        setEditFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    // Handle image upload
    const handleImageChange = (info: any) => {
        if (info.fileList && info.fileList.length > 0) {
            const file = info.fileList[0]
            setSelectedImage(file)
        }
    }

    // Submit form handler
    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            // Create FormData object
            const formDataToSend = new FormData()

            // Append text fields to FormData
            formDataToSend.append('title', editFormData.title)
            formDataToSend.append('description', editFormData.description)
            formDataToSend.append('startDate', editFormData.startDate)
            formDataToSend.append('endDate', editFormData.endDate)
            formDataToSend.append('status', editFormData.status)

            // Add image if selected
            if (selectedImage && selectedImage.originFileObj) {
                formDataToSend.append('file', selectedImage.originFileObj)
            }

            // Call API to update course
            if (courseId) {
                console.log('edit', formDataToSend)
                console.log('FormData contents:')
                for (let pair of formDataToSend.entries()) {
                    console.log(`${pair[0]}:`, pair[1])
                }
                await editCourse(courseId, formDataToSend)
            }

            setToast({
                show: true,
                type: 'success',
                title: 'Thành công',
                message: 'Cập nhật khóa học thành công',
                image: '/images/success.png',
            })

            // setTimeout(() => {
            //     setShowEditModal(false)
            //     // Refresh page to show updated data
            //     window.location.reload()
            // }, 1500)
        } catch (error) {
            console.error('Error updating course:', error)
            setToast({
                show: true,
                type: 'error',
                title: 'Lỗi',
                message: 'Không thể cập nhật khóa học',
                image: '/images/error.png',
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    // Delete course handler
    // const handleDeleteCourse = async () => {
    //     if (!window.confirm('Bạn có chắc chắn muốn xóa khóa học này không?')) {
    //         return
    //     }
    //
    //     setIsSubmitting(true)
    //
    //     try {
    //         if (courseId) {
    //             await deleteCourse(courseId)
    //         }
    //
    //         setToast({
    //             show: true,
    //             type: 'success',
    //             title: 'Thành công',
    //             message: 'Đã xóa khóa học',
    //             image: '/images/success.png',
    //         })
    //
    //         setTimeout(() => {
    //             navigate(-1)
    //         }, 1500)
    //     } catch (error) {
    //         console.error('Error deleting course:', error)
    //         setToast({
    //             show: true,
    //             type: 'error',
    //             title: 'Lỗi',
    //             message: 'Không thể xóa khóa học',
    //             image: '/images/error.png',
    //         })
    //     } finally {
    //         setIsSubmitting(false)
    //     }
    // }

    const confirmDeleteCourse = async () => {
        setIsSubmitting(true)
        setShowConfirmModal(false)
        try {
            if (courseId) {
                await deleteCourse(courseId)
            }
            setToast({
                show: true,
                type: 'success',
                title: 'Thành công',
                message: 'Đã xóa khóa học',
                image: '/images/success.png',
            })
            setTimeout(() => {
                navigate(-1)
            }, 1500)
        } catch (error) {
            console.error('Error deleting course:', error)
            setToast({
                show: true,
                type: 'error',
                title: 'Lỗi',
                message: 'Không thể xóa khóa học',
                image: '/images/error.png',
            })
        } finally {
            setIsSubmitting(false)
        }
    }
    const handleDeleteClick = () => {
        setShowConfirmModal(true)
    }

    if (!user) {
        return <RequireAuth />
    }

    if (loading) {
        return <div className={styles.loadingContainer}>Đang tải...</div>
    }

    function onClick(event: MouseEvent<HTMLButtonElement, MouseEvent>): void {
        throw new Error('Function not implemented.')
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <button onClick={handleBack} className={styles.backButton}>
                    ← Quay lại
                </button>
                <h1 className={styles.title}>
                    {course?.title || 'Chi tiết lớp học'}
                </h1>
                <button
                    onClick={handleOpenEditModal}
                    className={styles.editButton}
                >
                    Chỉnh sửa
                </button>
            </div>

            {course && (
                <div className={styles.courseInfo}>
                    <div className={styles.courseImageContainer}>
                        <img
                            src={
                                (course.images && course.images[0]) ||
                                '/images/default-course.jpg'
                            }
                            alt={course.title}
                            className={styles.courseImage}
                        />
                    </div>
                    <div className={styles.courseDetails}>
                        <p className={styles.courseDescription}>
                            {course.description}
                        </p>
                        <div className={styles.courseStats}>
                            <div className={styles.statsItem}>
                                <span className={styles.statsLabel}>
                                    Số học sinh:
                                </span>
                                <span className={styles.statsValue}>
                                    {listStudent.length}
                                </span>
                            </div>
                            <div className={styles.statsItem}>
                                <span className={styles.statsLabel}>
                                    Thời gian:
                                </span>
                                <span className={styles.statsValue}>
                                    {convertDateTimeToDate(course.start_date)} -{' '}
                                    {course.end_date === 'unlimited'
                                        ? 'Không giới hạn'
                                        : convertDateTimeToDate(
                                              course.end_date
                                          )}
                                </span>
                            </div>
                            {course.certification && (
                                <div className={styles.statsItem}>
                                    <span className={styles.statsLabel}>
                                        Chứng chỉ:
                                    </span>
                                    <span className={styles.statsValue}>
                                        {course.certification}
                                    </span>
                                </div>
                            )}
                        </div>
                        {course.progress !== undefined && (
                            <div className={styles.progressContainer}>
                                <div className={styles.progressLabel}>
                                    Tiến độ: {course.progress}%
                                </div>
                                <div className={styles.progressBar}>
                                    <div
                                        className={styles.progressFill}
                                        style={{ width: `${course.progress}%` }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Tab navigation */}
            <div className={styles.tabs}>
                <button
                    className={`${styles.tabButton} ${activeTab === 'lessons' ? styles.active : ''}`}
                    onClick={() => setActiveTab('lessons')}
                >
                    Quản lý bài học
                </button>
                <button
                    className={`${styles.tabButton} ${activeTab === 'students' ? styles.active : ''}`}
                    onClick={() => setActiveTab('students')}
                >
                    Quản lý học sinh
                </button>
                <button
                    className={`${styles.tabButton} ${activeTab === 'scores' ? styles.active : ''}`}
                    onClick={() => setActiveTab('scores')}
                >
                    Điểm khóa học
                </button>
            </div>

            {/* Tab content */}
            <div className={styles.tabContent}>
                {activeTab === 'lessons' ? (
                    <CourseLessons courseId={courseId ? courseId : ''} />
                ) : activeTab === 'students' ? (
                    <CourseStudents
                        courseId={courseId ? courseId : ''}
                        students={listStudent}
                    />
                ) : (
                    <CourseScore courseId={courseId ? courseId : ''} />
                )}
            </div>

            {/* Edit Course Popup */}
            {showEditModal && (
                <div className={styles.popupOverlay}>
                    <div className={styles.popupContainer}>
                        <div className={styles.popupHeader}>
                            <h2>Chỉnh sửa khóa học</h2>
                            <button
                                className={styles.closeButton}
                                onClick={() => setShowEditModal(false)}
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <form
                            onSubmit={handleEditSubmit}
                            className={styles.form}
                            encType="multipart/form-data"
                        >
                            <div className={styles.formGroup}>
                                <label htmlFor="title">
                                    Tiêu đề khóa học
                                    <span className={styles.required}>*</span>
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={editFormData.title}
                                    onChange={handleEditChange}
                                    placeholder="Nhập tiêu đề khóa học"
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="description">
                                    Mô tả
                                    <span className={styles.required}>*</span>
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={editFormData.description}
                                    onChange={handleEditChange}
                                    placeholder="Mô tả ngắn gọn về khóa học"
                                    rows={3}
                                    required
                                />
                            </div>

                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label htmlFor="startDate">
                                        Ngày bắt đầu
                                    </label>
                                    <input
                                        type="date"
                                        id="startDate"
                                        name="startDate"
                                        value={editFormData.startDate}
                                        onChange={handleEditChange}
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="endDate">
                                        Ngày kết thúc
                                    </label>
                                    <input
                                        type="date"
                                        id="endDate"
                                        name="endDate"
                                        value={editFormData.endDate}
                                        onChange={handleEditChange}
                                    />
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="status">Trạng thái</label>
                                <select
                                    id="status"
                                    name="status"
                                    value={editFormData.status}
                                    onChange={handleEditChange}
                                >
                                    <option value="ACTIVE">ACTIVE</option>
                                    <option value="INACTIVE">INACTIVE</option>
                                    <option value="DRAFT">DRAFT</option>
                                </select>
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="file">Ảnh bìa khóa học</label>
                                <Upload
                                    listType="picture"
                                    beforeUpload={() => false}
                                    onChange={handleImageChange}
                                    maxCount={1}
                                    defaultFileList={
                                        course?.images && course.images[0]
                                            ? [
                                                  {
                                                      uid: '-1',
                                                      name: 'Ảnh hiện tại',
                                                      status: 'done',
                                                      url: course.images[0],
                                                  },
                                              ]
                                            : []
                                    }
                                >
                                    <Button icon={<UploadOutlined />}>
                                        Upload
                                    </Button>
                                </Upload>
                            </div>

                            <div className={styles.buttonGroup}>
                                {/*<button*/}
                                {/*    type="button"*/}
                                {/*    className={styles.deleteButton}*/}
                                {/*    onClick={handleDeleteCourse}*/}
                                {/*    disabled={isSubmitting}*/}
                                {/*>*/}
                                {/*    <FaTimes /> Xóa khóa học*/}
                                {/*</button>*/}
                                <button
                                    type="button"
                                    className={styles.deleteButton}
                                    onClick={handleDeleteClick}
                                    disabled={isSubmitting}
                                >
                                    <FaTimes /> Xóa khóa học
                                </button>
                                <div>
                                    <button
                                        type="button"
                                        className={styles.cancelButton}
                                        onClick={() => setShowEditModal(false)}
                                        disabled={isSubmitting}
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="submit"
                                        className={styles.submitButton}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting
                                            ? 'Đang xử lý...'
                                            : 'Lưu thay đổi'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showConfirmModal && (
                <div className={styles.confirmOverlay}>
                    <div className={styles.confirmModal}>
                        <h3 className={styles.confirmTitle}>
                            Xác nhận xóa khóa học
                        </h3>
                        <p className={styles.confirmMessage}>
                            Bạn có chắc chắn muốn xóa khóa học này không?
                        </p>
                        <div className={styles.confirmButtonGroup}>
                            <button
                                className={styles.cancelButton}
                                onClick={() => setShowConfirmModal(false)}
                                disabled={isSubmitting}
                            >
                                Hủy
                            </button>
                            <button
                                className={styles.confirmButton}
                                onClick={confirmDeleteCourse}
                                disabled={isSubmitting}
                            >
                                Xác nhận
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast notification */}
            {/*{toast.show && (*/}
            {/*    <Toast*/}
            {/*        type={toast.type || 'info'}*/}
            {/*        title={toast.title || ''}*/}
            {/*        message={toast.message || ''}*/}
            {/*        image={toast.image || ''}*/}
            {/*        onClose={hideToast}*/}
            {/*    />*/}
            {/*)}*/}
            {/*{toast.show && (*/}
            {/*    <Toast toast={toast} onClose={hideToast} />*/}
            {/*)}*/}
        </div>
    )
}

export default CourseDetail
