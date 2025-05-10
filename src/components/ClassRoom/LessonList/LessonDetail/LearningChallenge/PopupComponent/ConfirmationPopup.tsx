import React from 'react';
import { Clock, BookOpen, CheckCircle, XCircle } from 'lucide-react';
import styles from './ConfirmationPopup.module.css';
import { Exercise } from '../../../../../../model/classroom.ts'

interface ConfirmationPopupProps {
    exercise: Exercise;
    quizCount: number;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmationPopup: React.FC<ConfirmationPopupProps> = ({
    exercise,
    quizCount,
    onConfirm,
    onCancel,
}) => {
    return (
        <div className={styles.overlayContainer}>
            <div className={styles.confirmationPopup}>
                <h2>Xác nhận làm bài</h2>

                <div className={styles.exerciseDetails}>
                    <div className={styles.detailItem}>
                        <BookOpen size={20} />
                        <div>
                            <h3>Tiêu đề</h3>
                            <p>{exercise.title}</p>
                        </div>
                    </div>

                    <div className={styles.detailItem}>
                        <div>
                            <h3>Mô tả</h3>
                            <p>{exercise.description || 'Không có mô tả'}</p>
                        </div>
                    </div>

                    <div className={styles.detailItem}>
                        <Clock size={20} />
                        <div>
                            <h3>Thời gian</h3>
                            <p>
                                {exercise.type === 'quiz'
                                    ? `${exercise.time || 0} giây / câu hỏi`
                                    : `${exercise.time/60 || 0} phút cho cả bài`}
                            </p>
                        </div>
                    </div>

                    <div className={styles.detailItem}>
                        <div>
                            <h3>Số lượng câu hỏi</h3>
                            <p>{quizCount} câu hỏi</p>
                        </div>
                    </div>
                </div>

                <div className={styles.confirmationActions}>
                    <button
                        className={`${styles.confirmButton} ${styles.confirmYes}`}
                        onClick={onConfirm}
                    >
                        <CheckCircle size={20} />
                        Xác nhận
                    </button>

                    <button
                        className={`${styles.confirmButton} ${styles.confirmNo}`}
                        onClick={onCancel}
                    >
                        <XCircle size={20} />
                        Hủy
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationPopup;
