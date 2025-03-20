import React from 'react'
import styles from '../../pages/commons/styles/HomePage.module.css'
import { useSelector } from 'react-redux'
import RequireAuth from '../../components/commons/RequireAuth/RequireAuth.tsx'

const LearningChallengePage: React.FC = () => {
    const { user } = useSelector((state: any) => state.auth);

    if(!user){
        return (
            <RequireAuth></RequireAuth>
        );
    }
    return (
        <main>
            <div className={styles.container}>
                <LearningChallengePage></LearningChallengePage>
            </div>
        </main>
    )
}

export default LearningChallengePage
