// AddCoursePopup.tsx
import React, { useState, useRef, useEffect } from 'react'
import { FaTimes, FaVideo, FaLayerGroup, FaImage, FaClone, FaSearch, FaArrowLeft, FaUndo } from 'react-icons/fa'
import styles from './AddCoursePopup.module.css'
import { Button, Upload } from 'antd'
import { Course } from '../../../../model/classroom.ts'
import { cloneCourse } from '../../../../services/course.ts'
import { convertDateTimeToDate2 } from '../../../../helpers/convertDateTime.ts' // Adjust import path as needed

interface FormData {
    courseId: string
    title: string
    description: string
    startDate: string
    endDate: string
    status: string
}

interface AddCoursePopupProps {
    onClose: () => void
    onSubmit: (courseData: FormData) => void
    courses: Course[]
    onAddCourse: (course: Course) => void;
}

interface NotificationState {
    show: boolean
    type: 'success' | 'error' | 'info'
    message: string
}

const AddCoursePopup: React.FC<AddCoursePopupProps> = ({
                                                           onClose,
                                                           onSubmit,
                                                           courses = [],
                                                           onAddCourse
                                                       }) => {
    const [formData, setFormData] = useState<FormData>({
        courseId: '',
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        status: 'ACTIVE',
    })

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [notification, setNotification] = useState<NotificationState>({
        show: false,
        type: 'info',
        message: '',
    })
    const [searchQuery, setSearchQuery] = useState('')
    const [filteredCourses, setFilteredCourses] = useState<Course[]>([])
    const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null)
    const [isCloneMode, setIsCloneMode] = useState(false)
    const [showCourseSearch, setShowCourseSearch] = useState(false)
    const [validationErrors, setValidationErrors] = useState<{
        startDate?: string;
        endDate?: string;
    }>({})

    const modalRef = useRef<HTMLDivElement>(null)
    const formRef = useRef<HTMLFormElement>(null)
    const searchInputRef = useRef<HTMLInputElement>(null)

    // Get today's date in YYYY-MM-DD format for validation
    const today = new Date().toISOString().split('T')[0]

    // Filter courses based on search query
    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredCourses(courses)
        } else {
            const filtered = courses.filter(course =>
                course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                course.description.toLowerCase().includes(searchQuery.toLowerCase())
            )
            setFilteredCourses(filtered)
        }
    }, [searchQuery, courses])

    // Focus search input when search section is shown
    useEffect(() => {
        if (showCourseSearch && searchInputRef.current) {
            searchInputRef.current.focus()
        }
    }, [showCourseSearch])

    // Close popup when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                modalRef.current &&
                !modalRef.current.contains(event.target as Node)
            ) {
                onClose()
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [onClose])

    // Close popup when ESC key is pressed
    useEffect(() => {
        const handleEscKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                if (showCourseSearch) {
                    setShowCourseSearch(false)
                } else {
                    onClose()
                }
            }
        }

        document.addEventListener('keydown', handleEscKey)
        return () => {
            document.removeEventListener('keydown', handleEscKey)
        }
    }, [onClose, showCourseSearch])

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))

        // Validate dates when they change
        if (name === 'startDate' || name === 'endDate') {
            validateDates({ ...formData, [name]: value })
        }
    }

    // Validate date fields
    const validateDates = (data: FormData) => {
        const errors: { startDate?: string; endDate?: string } = {}

        // Validate start date isn't in the past
        if (data.startDate && data.startDate < today) {
            errors.startDate = 'Ngày bắt đầu không thể trong quá khứ'
        }

        // Validate end date isn't before start date
        if (data.startDate && data.endDate && data.endDate < data.startDate) {
            errors.endDate = 'Ngày kết thúc không thể trước ngày bắt đầu'
        }

        setValidationErrors(errors)
        return Object.keys(errors).length === 0
    }

    const handleImageChange = (info: any) => {
        if (info.file) {
            setSelectedImage(info.file)
        }
    }

    const handleCourseSelect = (courseId: string) => {
        const selectedCourse = courses.find(course => course._id === courseId)
        if (selectedCourse) {
            // Pre-fill form with selected course data
            const newFormData = {
                courseId: selectedCourse._id,
                title: `${selectedCourse.title} (Bản sao)`,
                description: selectedCourse.description,
                startDate: convertDateTimeToDate2(selectedCourse.start_date) || '',
                endDate: convertDateTimeToDate2(selectedCourse.end_date) || '',
                status: 'ACTIVE',
            }

            setFormData(newFormData)
            setIsCloneMode(true)
            setSelectedCourseId(courseId)
            setShowCourseSearch(false)

            // Validate dates after setting form data
            validateDates(newFormData)

            // Show confirmation notification
            setNotification({
                show: true,
                type: 'info',
                message: 'Thông tin khóa học đã được điền. Bạn có thể chỉnh sửa trước khi tạo.',
            })
            setTimeout(() => {
                setNotification(prev => ({ ...prev, show: false }))
            }, 3000)
        }
    }

    // Reset clone mode and clear form
    const handleCancelClone = () => {
        setFormData({
            courseId: '',
            title: '',
            description: '',
            startDate: '',
            endDate: '',
            status: 'ACTIVE',
        })
        setIsCloneMode(false)
        setSelectedCourseId(null)
        setValidationErrors({})
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Form validation
        if (!formData.title || !formData.description) {
            setNotification({
                show: true,
                type: 'error',
                message: 'Vui lòng điền đầy đủ thông tin bắt buộc',
            })

            setTimeout(() => {
                setNotification((prev) => ({ ...prev, show: false }))
            }, 3000)
            return
        }

        // Validate dates before submission
        if (!validateDates(formData)) {
            setNotification({
                show: true,
                type: 'error',
                message: 'Vui lòng kiểm tra lại thông tin ngày tháng',
            })

            setTimeout(() => {
                setNotification((prev) => ({ ...prev, show: false }))
            }, 3000)
            return
        }

        setIsSubmitting(true)

        try {
            // Create FormData object
            const formDataToSend = new FormData()

            // Append text fields to FormData
            formDataToSend.append('courseId', formData.courseId)
            formDataToSend.append('title', formData.title)
            formDataToSend.append('description', formData.description)
            formDataToSend.append('startDate', formData.startDate)
            formDataToSend.append('endDate', formData.endDate)
            formDataToSend.append('status', formData.status)

            // Add image if selected
            if (selectedImage) {
                formDataToSend.append('file', selectedImage)
            }

            if (isCloneMode && selectedCourseId) {
                // Call the clone API if in clone mode
                const response = await cloneCourse(formDataToSend)
                onAddCourse(response.data)
            } else {
                const courseDataObj = {
                    ...formData,
                    file: selectedImage
                }
                onSubmit(courseDataObj)
            }

            setNotification({
                show: true,
                type: 'success',
                message: isCloneMode
                    ? 'Sao chép khóa học thành công!'
                    : 'Thêm khóa học thành công!',
            })

            setTimeout(() => {
                setNotification((prev) => ({ ...prev, show: false }))
                onClose()
            }, 1500)
        } catch (error) {
            console.error('Error submitting course:', error)
            setNotification({
                show: true,
                type: 'error',
                message: isCloneMode
                    ? 'Có lỗi xảy ra khi sao chép khóa học'
                    : 'Có lỗi xảy ra khi thêm khóa học',
            })

            setTimeout(() => {
                setNotification((prev) => ({ ...prev, show: false }))
            }, 3000)
        } finally {
            setIsSubmitting(false)
        }
    }

    const renderMainForm = () => (
        <>
            <div className={styles.popupHeader}>
                <h2>
                    {isCloneMode ? 'Sao chép khóa học' : 'Thêm khóa học mới'}
                </h2>
                <button
                    className={styles.closeButton}
                    onClick={onClose}
                    aria-label="Đóng"
                >
                    <p style={{ color: 'white' }}>x</p>
                    <FaTimes color={'white'} size={16} />
                </button>
            </div>

            <form
                ref={formRef}
                onSubmit={handleSubmit}
                className={styles.form}
                encType="multipart/form-data"
            >
                <div className={styles.cloneButtonContainer}>
                    <button
                        type="button"
                        className={styles.cloneButton}
                        onClick={() => setShowCourseSearch(true)}
                    >
                        <FaClone className={styles.cloneIcon} />
                        {isCloneMode
                            ? 'Đang sao chép khóa học'
                            : 'Sao chép từ khoá học đã có'}
                    </button>
                    {isCloneMode && (
                        <>
                            {/*<div className={styles.cloneIndicator}>*/}
                            {/*    Đang sao chép khóa học*/}
                            {/*</div>*/}
                            <button
                                type="button"
                                className={styles.cancelCloneButton}
                                onClick={handleCancelClone}
                            >
                                <FaUndo className={styles.cloneIcon} />
                                Hủy sao chép
                            </button>
                        </>
                    )}
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="title">
                        Tiêu đề khóa học
                        <span className={styles.required}>*</span>
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Nhập tiêu đề khóa học"
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="description">
                        Mô tả<span className={styles.required}>*</span>
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Mô tả ngắn gọn về khóa học"
                        rows={4}
                        required
                    />
                </div>

                <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                        <label htmlFor="startDate">Ngày bắt đầu</label>
                        <input
                            type="date"
                            id="startDate"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleChange}
                            min={today}
                        />
                        {validationErrors.startDate && (
                            <div className={styles.errorMessage}>
                                {validationErrors.startDate}
                            </div>
                        )}
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="endDate">Ngày kết thúc</label>
                        <input
                            type="date"
                            id="endDate"
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleChange}
                            min={formData.startDate || today}
                        />
                        {validationErrors.endDate && (
                            <div className={styles.errorMessage}>
                                {validationErrors.endDate}
                            </div>
                        )}
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="status">Trạng thái</label>
                    <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className={styles.selectField}
                    >
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="INACTIVE">INACTIVE</option>
                        <option value="DRAFT">DRAFT</option>
                    </select>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="file">Ảnh bìa khóa học</label>
                    <div className={styles.uploadWrapper}>
                        <Upload
                            listType="picture"
                            beforeUpload={() => false}
                            onChange={handleImageChange}
                            maxCount={1}
                            className={styles.uploadControl}
                        >
                            <Button
                                icon={<FaImage className={styles.uploadIcon} />}
                                className={styles.uploadButton}
                            >
                                Tải lên ảnh bìa
                            </Button>
                        </Upload>
                    </div>
                </div>

                <div className={styles.buttonGroup}>
                    <button
                        type="button"
                        className={styles.cancelButton}
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        Huỷ
                    </button>
                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={
                            isSubmitting ||
                            Object.keys(validationErrors).length > 0
                        }
                    >
                        {isSubmitting
                            ? 'Đang xử lý...'
                            : isCloneMode
                              ? 'Sao chép khóa học'
                              : 'Thêm khóa học'}
                    </button>
                </div>
            </form>

            <div className={styles.usageTips}>
                <div className={styles.tipItem}>
                    <FaVideo className={styles.tipIcon} />
                    <p>
                        Tạo khóa học với tiêu đề hấp dẫn và mô tả chi tiết để
                        thu hút học viên.
                    </p>
                </div>
                <div className={styles.tipItem}>
                    <FaLayerGroup className={styles.tipIcon} />
                    <p>
                        Đặt ngày bắt đầu và kết thúc để tạo lịch trình học tập
                        hiệu quả.
                    </p>
                </div>
                <div className={styles.tipItem}>
                    <FaClone className={styles.tipIcon} />
                    <p>
                        Sử dụng tính năng sao chép để nhanh chóng tạo các khóa
                        học tương tự, tiết kiệm thời gian.
                    </p>
                </div>
            </div>
        </>
    )

    const renderCourseSearch = () => (
        <>
            <div className={styles.popupHeader}>
                <div className={styles.headerWithBack}>
                    <button
                        className={styles.backButton}
                        onClick={() => setShowCourseSearch(false)}
                        aria-label="Quay lại"
                    >
                        <FaArrowLeft size={16} />
                    </button>
                    <h2>Tìm khóa học để sao chép</h2>
                </div>
                <button
                    className={styles.closeButton}
                    onClick={onClose}
                    aria-label="Đóng"
                >
                    <FaTimes color="white" size={16} />
                </button>
            </div>

            <div className={styles.searchSection}>
                <div className={styles.searchContainer}>
                    <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Tìm kiếm theo tên hoặc mô tả khóa học..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className={styles.searchInput}
                    />
                    <FaSearch className={styles.searchIcon} />
                </div>

                <div className={styles.courseList}>
                    {filteredCourses.length === 0 ? (
                        <div className={styles.noCourses}>
                            {courses.length === 0
                                ? "Chưa có khóa học nào để sao chép"
                                : "Không tìm thấy khóa học phù hợp"}
                        </div>
                    ) : (
                        filteredCourses.map(course => (
                            <div
                                key={course._id}
                                className={styles.courseItem}
                                onClick={() => handleCourseSelect(course._id)}
                            >
                                <div className={styles.courseTitle}>{course.title}</div>
                                <div className={styles.courseDescription}>
                                    {course.description.length > 100
                                        ? `${course.description.substring(0, 100)}...`
                                        : course.description}
                                </div>
                                <div className={styles.courseMeta}>
                                    {course.start_date && (
                                        <span>Ngày bắt đầu: {new Date(course.start_date).toLocaleDateString('vi-VN')}</span>
                                    )}
                                    {course.end_date && (
                                        <span>Ngày kết thúc: {new Date(course.end_date).toLocaleDateString('vi-VN')}</span>
                                    )}
                                </div>
                                <button className={styles.selectCourseButton}>
                                    Chọn khóa học này
                                </button>
                            </div>
                        ))
                    )}
                </div>

                <div className={styles.searchFooter}>
                    <button
                        className={styles.cancelButton}
                        onClick={() => setShowCourseSearch(false)}
                    >
                        Quay lại form
                    </button>
                </div>
            </div>
        </>
    )

    return (
        <div className={styles.popupOverlay}>
            <div className={styles.popupContainer} ref={modalRef}>
                {showCourseSearch ? renderCourseSearch() : renderMainForm()}

                {notification.show && (
                    <div
                        className={`${styles.notification} ${styles[notification.type]}`}
                    >
                        {notification.message}
                    </div>
                )}
            </div>
        </div>
    )
}

export default AddCoursePopup
