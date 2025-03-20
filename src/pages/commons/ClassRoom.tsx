
import styles from '../../pages/commons/styles/ClassRoom.module.css';
import ClassroomList from '../../components/ClassRoom/ClassroomPage.tsx'
import { useSelector } from 'react-redux'
import React, { useEffect } from 'react'
import RequireAuth from '../../components/commons/RequireAuth/RequireAuth.tsx'
import TeacherClassroom from '../../components/ClassRoom/Teacher/TeacherClassroom.tsx'
const ClassroomPage = () => {
    const { user } = useSelector((state: any) => state.auth);

    if(!user){
        return (
            <RequireAuth></RequireAuth>
        );
    }

    return (
        <div className={styles.container}>
            {user.role === 'teacher' ? <TeacherClassroom /> : <ClassroomList />}
        </div>
    );
};

export default ClassroomPage;
