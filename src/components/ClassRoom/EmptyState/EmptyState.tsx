import React from 'react';
import { GraduationCap, ArrowRight } from 'lucide-react';
import styles from '../ClassroomPage.module.css';
import { useNavigate } from 'react-router-dom'

const EmptyState: React.FC = () => {
    const navigate = useNavigate()
    return (
        <div className={styles.emptyState}>
            <div className={styles.emptyContent}>
                <div className={styles.emptyIcon}>
                    <GraduationCap size={48} />
                </div>
                <h2 className={styles.emptyTitle}>Bắt đầu hành trình học tập của bạn</h2>
                <p className={styles.emptyDescription}>
                    Bạn chưa tham gia lớp học nào. Hãy tham gia lớp học đầu tiên để bắt đầu học tập cùng bạn bè!
                </p>
                <button className={styles.emptyButton}
                        onClick={() =>
                            navigate(
                                `/courses`,
                            )
                        }
                >
                    Xem các lớp học
                    <ArrowRight size={16} />
                </button>
            </div>
        </div>
    );
};

export default EmptyState;
