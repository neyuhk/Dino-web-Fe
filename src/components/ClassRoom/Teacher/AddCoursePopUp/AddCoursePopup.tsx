import React, { useState, useRef, useEffect } from 'react'
import { FaTimes, FaVideo, FaLayerGroup } from 'react-icons/fa'
import styles from './AddCoursePopup.module.css'
import { Button, Upload } from 'antd'
import { UploadOutlined } from '@ant-design/icons'

interface FormData {
    title: string
    description: string
    startDate: string
    endDate: string
    status: string
}

interface AddCoursePopupProps {
    onClose: () => void
    onSubmit: (courseData: FormData) => void
}

interface NotificationState {
    show: boolean
    type: 'success' | 'error' | 'info'
    message: string
}

const AddCoursePopup: React.FC<AddCoursePopupProps> = ({
    onClose,
    onSubmit,
}) => {
    const [formData, setFormData] = useState<FormData>({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        certification: '',
        status: 'ACTIVE',
    })

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [selectedImage, setSelectedImage] = useState(null)
    const [notification, setNotification] = useState<NotificationState>({
        show: false,
        type: 'info',
        message: '',
    })

    const modalRef = useRef<HTMLDivElement>(null)
    const formRef = useRef<HTMLFormElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)


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
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedImage(e.target.files[0])
            console.log('loadddddd', e.target.files[0])
        }
    }


    const handleUploadClick = () => {
        fileInputRef.current?.click()
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

        setIsSubmitting(true)

        try {
            // Create FormData object
            const formDataToSend = new FormData()

            // Append text fields to FormData
            formDataToSend.append('title', formData.title)
            formDataToSend.append('description', formData.description)
            formDataToSend.append('startDate', formData.startDate)
            formDataToSend.append('endDate', formData.endDate)
            formDataToSend.append('status', formData.status)

            // Add image if selected
            if (selectedImage) {
                formDataToSend.append('file', selectedImage.originFileObj)
            }

            // Debug logging
            console.log('FormData contents:')
            for (let pair of formDataToSend.entries()) {
                console.log(`${pair[0]}:`, pair[1])
            }

            // Call the onSubmit function passed from parent
            onSubmit(formData)

            setNotification({
                show: true,
                type: 'success',
                message: 'Thêm khóa học thành công!',
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
                message: 'Có lỗi xảy ra khi thêm khóa học',
            })

            setTimeout(() => {
                setNotification((prev) => ({ ...prev, show: false }))
            }, 3000)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className={styles.popupOverlay}>
            <div className={styles.popupContainer} ref={modalRef}>
                <div className={styles.popupHeader}>
                    <h2>Thêm khóa học mới</h2>
                    <button className={styles.closeButton} onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>

                <form
                    ref={formRef}
                    onSubmit={handleSubmit}
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
                            rows={3}
                            required
                        />
                    </div>

                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label htmlFor="startDate">Ngày bắt đầu</label>
                            <input
                                type="date"
                                id="startDate"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="endDate">Ngày kết thúc</label>
                            <input
                                type="date"
                                id="endDate"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="status">Trạng thái</label>
                        <select
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                        >
                            <option value="ACTIVE">ACTIVE</option>
                            <option value="INACTIVE">INACTIVE</option>
                            <option value="DRAFT">DRAFT</option>
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="file">Ảnh bìa khóa học</label>
                        {/*<input*/}
                        {/*    ref={fileInputRef}*/}
                        {/*    type="file"*/}
                        {/*    id="file"*/}
                        {/*    name="file"*/}
                        {/*    onChange={handleImageChange}*/}
                        {/*    accept="image/*"*/}
                        {/*    style={{ display: 'none' }}*/}
                        {/*/>*/}
                        <Upload
                            listType="picture"
                            beforeUpload={() => false}
                            onChange={handleImageChange}
                            maxCount={1}
                        >    <Button icon={<UploadOutlined />}>Upload</Button>
                        </Upload>
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
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Đang xử lý...' : 'Thêm khóa học'}
                        </button>
                    </div>
                </form>

                {notification.show && (
                    <div
                        className={`${styles.notification} ${styles[notification.type]}`}
                    >
                        <p>{notification.message}</p>
                    </div>
                )}

                <div className={styles.usageTips}>
                    <div className={styles.tipItem}>
                        <FaVideo className={styles.tipIcon} />
                        <p>
                            Tạo khóa học với tiêu đ��� hấp dẫn và mô tả chi tiết
                            để thu hút học viên.
                        </p>
                    </div>
                    <div className={styles.tipItem}>
                        <FaLayerGroup className={styles.tipIcon} />
                        <p>
                            Đặt ngày bắt đầu và kết thúc để tạo lịch trình học
                            tập hiệu quả.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddCoursePopup
