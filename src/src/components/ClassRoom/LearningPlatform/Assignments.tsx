// Assignments.tsx
import React from 'react';
import styles from './LearningPlatform.module.css';
import { Button } from 'antd'

const Assignments = ({ data }: { data: any[] }) => {
    return (
        <div className={styles.content}>
            <h2 className={styles.title}>Bài tập</h2>
            {data.map((assignment) => (
                <div key={assignment.id} className={styles.assignmentCard}>
                    <div className={styles.assignmentInfor}>
                        <h3 className={styles.assignmentTitle}>
                            {assignment.title}
                        </h3>
                        <p className={styles.dueDate}>
                            Hạn nộp: {assignment.dueDate}
                        </p>
                        <Button className={styles.confirmButton}
                                type="primary"
                                htmlType="submit"
                                // loading={submitLoading}
                        >
                            Làm bài
                        </Button>
                    </div>

                    <span className={styles.status}>{assignment.status}</span>
                </div>
            ))}
        </div>
    )
};

export default Assignments;
