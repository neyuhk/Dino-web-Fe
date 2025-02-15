import React from 'react'
import Section1 from '../../components/Homepage/Section1/Section1.tsx'
import Section2 from '../../components/Homepage/Section2/Section2.tsx'
import Section3 from '../../components/Homepage/Section3/Section3.tsx'
import Section4 from '../../components/Homepage/Section4/Section4.tsx'
import Section5 from '../../components/Homepage/Section5/Section5.tsx'
// import styles from '../../components/Homepage/Section2/Section2.module.css'
import styles from '../../pages/commons/styles/HomePage.module.css'

const HomePage: React.FC = () => {
    return (
        <main>
            <img
                src="src/components/Homepage/Section1/image/dino-bgr.png"
                alt="Background"
                className={styles.backgroundImage}
            />
            <div className={styles.container}>
                <Section1 />
                <Section2 />
                <Section3 />
                <Section4 />
                <Section5 />
            </div>

        </main>
    )
}

export default HomePage
