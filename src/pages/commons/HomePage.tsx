import React from 'react'
import styles from '../../pages/commons/styles/HomePage.module.css'
import HomePage2 from '../../components/Homepage/HomePage2.tsx'
import dinoBgr from '../../assets/dino-bgr.png'

const HomePage: React.FC = () => {
    return (
        <main>
            <img
                src={dinoBgr}
                alt="Background"
                className={styles.backgroundImage}
            />
            <div className={styles.container}>
                <HomePage2></HomePage2>
            </div>

        </main>
    )
}

export default HomePage
