import React from 'react';
import styles from './DeleteLessonPopup.module.css';
import { FaExclamationTriangle, FaTrash, FaTimes, FaStopwatch, FaClipboardCheck, FaVideo } from 'react-icons/fa'
import { Lesson } from '../../../../../model/classroom.ts'

interface DeleteLessonPopupProps {
    lesson: Lesson;
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const DeleteLessonPopup: React.FC<DeleteLessonPopupProps> = ({ lesson, isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    // Format duration in minutes to hours and minutes
    const formatDuration = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;

        if (hours > 0) {
            return `${hours} giờ ${mins > 0 ? `${mins} phút` : ''}`;
        }
        return `${mins} phút`;
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.popup}>
                <div className={styles.header}>
                    <div className={styles.warningIcon}>
                        <FaExclamationTriangle />
                    </div>
                    <h2 className={styles.title}>Xác nhận xóa bài học</h2>
                    <button className={styles.closeButton} onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>

                <div className={styles.content}>
                    <p className={styles.message}>
                        Bạn có chắc chắn muốn xóa bài học này? Hành động này không thể hoàn tác.
                    </p>

                    <div className={styles.lessonDetails}>
                        <div className={styles.lessonImageContainer}>
                            <img
                                src={lesson.images && lesson.images.length > 0 ? lesson.images[0] : "https://i.pinimg.com/736x/fb/08/2e/fb082e7893d751e73578b2d668a338e3.jpg"}
                                alt={lesson.title}
                                className={styles.lessonImage}
                            />
                        </div>

                        <div className={styles.detailsContainer}>
                            <h3 className={styles.lessonTitle}>{lesson.title}</h3>
                            <p className={styles.lessonDescription}>{lesson.description}</p>

                            <div className={styles.metaInfo}>
                                <div className={styles.metaItem}>
                                    <FaStopwatch />
                                    <span>{formatDuration(lesson.duration || 0)}</span>
                                </div>
                                {lesson.video_url && (
                                    <div className={styles.metaItem}>
                                        <FaVideo />{' '}
                                        <span>Video bài giảng</span>
                                    </div>
                                )}
                                <div className={styles.metaItem}>
                                    <FaClipboardCheck />
                                    <span>{(lesson.exercises && lesson.exercises.length) || 0} bài tập</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.actions}>
                    <button className={styles.cancelButton} onClick={onClose}>
                        Hủy bỏ
                    </button>
                    <button className={styles.deleteButton} onClick={onConfirm}>
                        <FaTrash /> Xóa bài học
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteLessonPopup;