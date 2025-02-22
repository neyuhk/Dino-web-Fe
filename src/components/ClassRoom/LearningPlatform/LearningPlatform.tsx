import React, { useEffect, useState } from 'react';
import styles from './LearningPlatform.module.css';
import { Classroom } from '../../../model/classroom.ts'
import { getClassroomById } from '../../../services/classroom.ts'
import Header from './Header.tsx'
import Courses from './Courses.tsx'
import Assignments from './Assignments.tsx'
import Grades from './Grades.tsx'
// import ClassroomInfo from '/common/ClassroomInfo.tsx'
import Profile from './Profile.tsx'
import StudentList from './common/StudentList.tsx'
import ClassroomInfo from './common/ClassroomInfo.tsx'
import { useNavigate, useParams } from 'react-router-dom'
import { PATHS } from '../../../router/path.ts'

const LearningPlatform = () => {
    const { classroomId } = useParams<{ classroomId: string }>()
    const [activeSection, setActiveSection] = useState('info');
    const [classroom, setClassroom] = useState<Classroom | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadClassroom = async () => {
            try {
                const response = await getClassroomById(classroomId?? '');
                setClassroom(response);
            } catch (error) {
                console.error('Error loading classroom:', error);
            } finally {
                setLoading(false);
            }
        };

        loadClassroom();
    }, [classroomId]);

    if (loading) return <div className={styles.loading}>Loading...</div>;
    if (!classroom) return <div className={styles.error}>Classroom not found</div>;

    return (
        <div className={styles.container}>
            <Header
                setActiveSection={setActiveSection}
                activeSection={activeSection}
                className={classroom.name}
            />

            <main className={styles.mainContent}>
                {activeSection === 'info' && <ClassroomInfo classroom={classroom} />}
                {activeSection === 'students' && <StudentList students={classroom.students} />}
                {activeSection === 'courses' && <Courses courses={classroom.courses} />}
                {activeSection === 'assignments' && <Assignments data={classroom.courses}  />}
                {activeSection === 'grades' && <Grades data={classroom.courses} />}
                {activeSection === 'profile' && <Profile data={classroom.courses} />}
            </main>
        </div>
    );
};

export default LearningPlatform;