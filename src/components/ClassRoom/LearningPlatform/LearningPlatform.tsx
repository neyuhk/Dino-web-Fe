// Classroom.tsx
import React, { useEffect, useState } from 'react';
import { fetchData } from './dataService';
import Header from './Header';
import Courses from './Courses';
import Assignments from './Assignments';
import Grades from './Grades';
import Profile from './Profile';
import styles from './LearningPlatform.module.css';

const Classroom = () => {
    const [activeSection, setActiveSection] = useState('courses');
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        const loadData = async () => {
            const response = await fetchData(activeSection);
            setData(response);
        };
        loadData();
    }, [activeSection]);

    return (
        <div className={styles.container}>
            <Header setActiveSection={setActiveSection} activeSection={activeSection} />

            <main className={styles.mainContent}>
                {activeSection === 'courses' && <Courses data={data} />}
                {activeSection === 'assignments' && <Assignments data={data} />}
                {activeSection === 'grades' && <Grades data={data} />}
                {activeSection === 'profile' && <Profile data={data} />}
            </main>
        </div>
    );
};

export default Classroom;
