
import styles from '../../pages/commons/styles/ClassRoom.module.css';
import { useSelector } from 'react-redux'
import RequireAuth from '../../components/commons/RequireAuth/RequireAuth.tsx'
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
