import React from 'react';
import styles from '../../pages/commons/styles/CoursePage.module.css';
import Section1 from '../../components/CoursePage/Section1/Section1.tsx'
import Section2 from '../../components/CoursePage/Section2/Section2.tsx'
import Section3 from '../../components/CoursePage/Section3/Section3.tsx'
import Section4 from '../../components/CoursePage/Section4/Section4.tsx'
import { useSelector } from 'react-redux'
import RequireAuth from '../../components/RequireAuth/RequireAuth.tsx'

const CoursePage: React.FC = () => {
    const { user } = useSelector((state: any) => state.auth);

    if(!user){
        return (
            <RequireAuth></RequireAuth>
        );
    }
    return (
        <main>
            <img
                src="src/components/CoursePage/CourseSection1/image/course-bgr.png"
                alt="Background"
                className={styles.backgroundImage}
            />
            <div className={styles.container}>
                <Section1/>
                <Section2/>
                <Section3/>
                <Section4/>
            </div>
        </main>
    );
};

export default CoursePage;
