import React from 'react'
import styles from '../../pages/commons/styles/HomePage.module.css'
import OurProduct from '../../components/OurProduct/OurProduct.tsx'

const OurProductPage: React.FC = () => {
    return (
        <main>
            <div className={styles.container}>
                <OurProduct></OurProduct>
            </div>

        </main>
    )
}

export default OurProductPage
