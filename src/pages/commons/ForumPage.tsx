import React from 'react'
import styles from '../../pages/commons/styles/HomePage.module.css'
import Forum from '../../components/Forum/Forum.tsx'
import { useSelector } from 'react-redux'
import RequireAuth from '../../components/commons/RequireAuth/RequireAuth.tsx'

const ForumPage: React.FC = () => {
    const { user } = useSelector((state: any) => state.auth);

    if(!user){
        return (
            <RequireAuth></RequireAuth>
        );
    }
    return (
        <main>
            <div className={styles.container}>
                <Forum></Forum>
            </div>
        </main>
    )
}

export default ForumPage
