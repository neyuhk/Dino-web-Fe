import React from 'react'
import styles from '../../pages/commons/styles/HomePage.module.css'
import Forum from '../../components/Forum/Forum.tsx'

const ForumPage: React.FC = () => {
    return (
        <main>
            <div className={styles.container}>
                <Forum></Forum>
            </div>
        </main>
    )
}

export default ForumPage
