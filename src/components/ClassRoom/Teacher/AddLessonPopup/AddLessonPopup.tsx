import React, { useState, useRef, useEffect } from 'react';
import { FaPlus, FaTimes, FaVideo, FaLayerGroup, FaRegListAlt } from 'react-icons/fa';
import styles from './AddLessonPopup.module.css';
import { addLesson } from '../../../../services/lesson.ts'

interface AddLessonPopupProps {
    courseId: string;
    onClose: () => void;
    onSubmit: (lessonData: any) => void;
}

const AddLessonPopup: React.FC<AddLessonPopupProps> = ({ courseId, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        videoUrl: '',
        body: '',
        status: 'DEFAULT'
    });
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [showPreviousLessonsModal, setShowPreviousLessonsModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notification, setNotification] = useState<{show: boolean, type: string, message: string}>({
        show: false,
        type: '',
        message: ''
    });

    const modalRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    // For clicking outside to close
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation check
        if (!formData.title || !formData.description) {
            setNotification({
                show: true,
                type: 'error',
                message: 'Vui lòng điền đầy đủ thông tin tiêu đề và mô tả'
            });

            setTimeout(() => {
                setNotification(prev => ({ ...prev, show: false }));
            }, 3000);
            return;
        }

        setIsSubmitting(true);

        try {
            // Create FormData object
            const formDataToSend = new FormData();

            // Append text fields to FormData
            formDataToSend.append('title', formData.title);
            formDataToSend.append('description', formData.description);

            // Only append non-empty values
            if (formData.videoUrl) formDataToSend.append('videoUrl', formData.videoUrl);
            if (formData.body) formDataToSend.append('body', formData.body);
            if (formData.status) formDataToSend.append('status', formData.status);

            // Add image if selected
            if (selectedImage) {
                formDataToSend.append('images', selectedImage);
            }

            // Debug logging
            console.log('Sending to courseId:', courseId);
            console.log('FormData contents:');
            for (let pair of formDataToSend.entries()) {
                console.log(`${pair[0]}:`, pair[1]);
            }

            // Call API
            const response = await addLesson(courseId, formDataToSend);
            console.log("API response:", response);

            if (response?.status === 201 || response?.status === 200) {
                setNotification({
                    show: true,
                    type: 'success',
                    message: 'Thêm bài học thành công!'
                });

                onSubmit({ ...formData, courseId });

                setTimeout(() => {
                    setNotification(prev => ({ ...prev, show: false }));
                    onClose();
                }, 1500);
            } else {
                throw new Error('Lỗi khi thêm bài học!');
            }
        } catch (error) {
            console.error('Error submitting lesson:', error);
            setNotification({
                show: true,
                type: 'error',
                message: 'Có lỗi xảy ra khi thêm bài học'
            });

            setTimeout(() => {
                setNotification(prev => ({ ...prev, show: false }));
            }, 3000);
        } finally {
            setIsSubmitting(false);
        }
    };
    const handleShowPreviousLessons = () => {
        setShowPreviousLessonsModal(true);
        // Hiện tại chưa có API nên chỉ hiển thị modal
        console.log("Show previous lessons modal");

        setNotification({
            show: true,
            type: 'info',
            message: 'Tính năng đang được phát triển'
        });

        setTimeout(() => {
            setNotification(prev => ({ ...prev, show: false }));
            setShowPreviousLessonsModal(false);
        }, 2000);
    };

    return (
        <div className={styles.popupOverlay}>
            <div className={styles.popupContainer} ref={modalRef}>
                <div className={styles.popupHeader}>
                    <h2>Thêm bài học mới</h2>
                    <button className={styles.closeButton} onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>

                <form ref={formRef} onSubmit={handleSubmit} className={styles.form} encType="multipart/form-data">
                    <div className={styles.quickActionRow}>
                        <button
                            type="button"
                            className={styles.quickActionButton}
                            onClick={handleShowPreviousLessons}
                        >
                            <FaLayerGroup />
                            <span>Thêm từ bài học đã có</span>
                        </button>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="title">Tiêu đề bài học<span className={styles.required}>*</span></label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Nhập tiêu đề bài học"
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="description">Mô tả<span className={styles.required}>*</span></label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Mô tả ngắn gọn về bài học"
                            rows={3}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="videoUrl">Đường dẫn video (nếu có)</label>
                        <div className={styles.videoInputContainer}>
                            <FaVideo className={styles.videoIcon} />
                            <input
                                type="text"
                                id="videoUrl"
                                name="videoUrl"
                                value={formData.videoUrl}
                                onChange={handleChange}
                                placeholder="Nhập đường dẫn video (YouTube, Vimeo,...)"
                            />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="body">Nội dung bài học</label>
                        <textarea
                            id="body"
                            name="body"
                            value={formData.body}
                            onChange={handleChange}
                            placeholder="Nhập nội dung chi tiết của bài học"
                            rows={6}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="status">Trạng thái</label>
                        <select
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                        >
                            <option value="DEFAULT">DEFAULT</option>
                            <option value="ACTIVE">ACTIVE</option>
                            <option value="INACTIVE">INACTIVE</option>
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="images">Hình ảnh bài học</label>
                        <input
                            type="file"
                            id="images"
                            name="images"
                            onChange={handleImageChange}
                            accept="image/*"
                        />
                        {selectedImage && (
                            <div className={styles.selectedImage}>
                                <span>Đã chọn: {selectedImage.name}</span>
                            </div>
                        )}
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
                            {isSubmitting ? 'Đang xử lý...' : 'Thêm bài học'}
                        </button>
                    </div>
                </form>

                {notification.show && (
                    <div className={`${styles.notification} ${styles[notification.type]}`}>
                        {notification.message}
                    </div>
                )}

                {showPreviousLessonsModal && (
                    <div className={styles.previousLessonsModal}>
                        <div className={styles.previousLessonsContainer}>
                            <div className={styles.previousLessonsHeader}>
                                <h3>Chọn bài học đã có</h3>
                                <button onClick={() => setShowPreviousLessonsModal(false)}>
                                    <FaTimes />
                                </button>
                            </div>
                            <div className={styles.previousLessonsList}>
                                <div className={styles.emptyMessage}>
                                    <FaRegListAlt size={40} />
                                    <p>Chức năng này đang được phát triển</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddLessonPopup;