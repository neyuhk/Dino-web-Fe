import React from 'react';
import styles from '../common/styles/ClassroomInfo.module.css';
import { Classroom } from '../../../../model/classroom.ts'

const ClassroomInfo = ({ classroom }: { classroom: Classroom }) => {
    return (
        <div className={styles.infoContainer}>
            <div className={styles.header}>
                <h1 className={styles.className}>{classroom.name}</h1>
                <p className={styles.description}>{classroom.description}</p>
            </div>

            <div className={styles.teacherSection}>
                <h2>Teacher Information</h2>
                <div className={styles.teacherCard}>
                    <img
                        src={classroom.teacher_id.avatar[0]}
                        alt={classroom.teacher_id.name}
                        className={styles.teacherAvatar}
                    />
                    <div className={styles.teacherInfo}>
                        <h3>{classroom.teacher_id.username}</h3>
                        <p>Email: {classroom.teacher_id.email}</p>
                        <p>Phone: {classroom.teacher_id.phonenumber}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default ClassroomInfo;