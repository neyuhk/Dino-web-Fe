import styles from '../LessonDetail.module.css';
import LessonDetail from '../LessonDetail.tsx'

const DeleteConfirmPopup = ({ show, title, description, onConfirm, onCancel }) => {
    if (!show) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.popupContainer}>
                <div className={styles.popupHeader}>
                    <img src="https://i.pinimg.com/originals/9c/d9/93/9cd993416b048e20880abe55f24f0215.gif" alt="Cảnh báo" className={styles.popupIcon} />
                    <h3 className={styles.popupTitle}>Xác nhận xóa bài tập</h3>
                </div>
                <div className={styles.popupContent}>
                    <p>Bạn có chắc chắn muốn xóa bài tập sau?</p>
                    <div className={styles.exerciseDetails}>
                        <h4>{title}</h4>
                        <p>{description}</p>
                    </div>
                    <p className={styles.warningText}>Hành động này không thể hoàn tác!</p>
                </div>
                <div className={styles.popupActions}>
                    <button className={styles.cancelButton} onClick={onCancel}>
                        Hủy bỏ
                    </button>
                    <button className={styles.deleteButton} onClick={onConfirm}>
                        Xác nhận xóa
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmPopup;