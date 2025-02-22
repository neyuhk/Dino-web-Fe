import React from 'react';
import { GraduationCap, ArrowRight } from 'lucide-react';
import styles from '../ClassroomPage.module.css';

const EmptyState: React.FC = () => {
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
                <button className={styles.emptyButton}>
                    Xem các lớp học
                    <ArrowRight size={16} />
                </button>
            </div>
        </div>
    );
};

export default EmptyState;
