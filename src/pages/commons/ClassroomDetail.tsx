
import styles from '../../pages/commons/styles/ClassRoom.module.css';
import LearningPlatform from '../../components/ClassRoom/LearningPlatform/LearningPlatform.tsx'
import ClassroomList from '../../components/ClassRoom/ClassroomPage.tsx'
import { useSelector } from 'react-redux'
import RequireAuth from '../../components/RequireAuth/RequireAuth.tsx'
import React from 'react'
const ClassroomDetailPage = () => {
    const { user } = useSelector((state: any) => state.auth);

    if(!user){
        return (
            <RequireAuth></RequireAuth>
        );
    }
    return (
        <div className={styles.container}>
            {/*<LearningPlatform classroomId="123"></LearningPlatform>*/}
        </div>
    );
};

export default ClassroomDetailPage;
