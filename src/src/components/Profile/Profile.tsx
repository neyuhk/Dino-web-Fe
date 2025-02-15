import React, { useEffect, useState } from 'react'
import styles from './Profile.module.css'
import ProjectList from './ProjectList/ProjectList.tsx'
import AboutMe from './AboutMe/AboutMe.tsx'
import { Project, User } from '../../model/model.ts'
import ProfileCourses from './Courses/Profile-Courses.tsx'
import { Typography } from 'antd'
import SavedProjects from './SavedProjects/SavedProjects.tsx'
import { useSelector } from 'react-redux'
import { getListProjectsByUser, getProjects } from '../../services/project.ts'

const Profile: React.FC = () => {
    const [activeTab, setActiveTab] = useState('projects')
    const { user } = useSelector((state: any) => state.auth)
    const { Title } = Typography




    const mockProjects: Project[] = [
        {
            _id: "1",
            name: "Dự án 1",
            description: "Mô tả dự án 1",
            direction: "Hướng Bắc",
            images: ["https://i.pinimg.com/736x/8b/84/63/8b84630f622a272cfad466fd192b19ff.jpg"],
            user_id: {
                _id: "u1",
                email: "example@example.com",
                username: "username1",
                name: "Nguyễn Văn A",
                avatar: "https://i.pinimg.com/736x/8b/84/63/8b84630f622a272cfad466fd192b19ff.jpg",
                role: "user",
                createdAt: "2023-01-01T10:00:00Z",
                updatedAt: "2023-01-01T10:00:00Z",
                birthday: new Date("1990-05-20"),
            },
            like_count: 123,
            view_count: 456,
            project_type: "Kiến trúc",
            createdAt: "2023-01-01T10:00:00Z",
            updatedAt: "2023-01-02T12:00:00Z",
            blocks: "Block 1, Block 2",
        },
        {
            _id: "2",
            name: "Dự án 2",
            description: "Mô tả dự án 2",
            direction: "Hướng Đông",
            images: ["https://i.pinimg.com/736x/70/43/22/70432264e904355aaa4ad15a26797dcb.jpg"],
            user_id: {
                _id: "u2",
                email: "example2@example.com",
                username: "username2",
                name: "Nguyễn Văn B",
                avatar: "https://i.pinimg.com/736x/70/43/22/70432264e904355aaa4ad15a26797dcb.jpg",
                role: "user",
                createdAt: "2023-01-05T08:00:00Z",
                updatedAt: "2023-01-05T08:00:00Z",
                birthday: new Date("1992-10-10"),
            },
            like_count: 78,
            view_count: 200,
            project_type: "Xây dựng",
            createdAt: "2023-01-03T14:00:00Z",
            updatedAt: "2023-01-05T14:00:00Z",
            blocks: "Block 3, Block 4",
        },
    ];


    // const [user, setUser] = useState<User>({
    //     _id: '',
    //     email: 'user@example.com',
    //     username: 'johndoe',
    //     name: 'John Doe',
    //     avatar: 'https://i.pinimg.com/736x/70/a2/36/70a236f90d2803f9da32d0558be75ba1.jpg',
    //     role: 'User',
    //     createdAt: '',
    //     updatedAt: '',
    //     birthday: new Date('1990-01-01'),
    // })

    const mockCourses = [
        {
            id: '1',
            title: 'Learn Arduino from Scratch',
            image: '/path/to/arduino-course.jpg',
            startDate: new Date('2023-03-04'),
            progress: 20,
            totalLessons: 10,
            completedLessons: 2,
        },
        {
            id: '2',
            title: 'Advanced React Development',
            image: '/path/to/react-course.jpg',
            startDate: new Date('2023-05-15'),
            progress: 45,
            totalLessons: 15,
            completedLessons: 7,
        },
        {
            id: '3',
            title: 'Python for Data Science',
            image: 'https://i.pinimg.com/736x/8b/84/63/8b84630f622a272cfad466fd192b19ff.jpg',
            startDate: new Date('2023-01-20'),
            progress: 75,
            totalLessons: 20,
            completedLessons: 15,
        },
    ]

    const handleUpdateUser = (updatedUser: Partial<User>) => {
        // setUser((prev) => ({
        //     ...prev,
        //     ...updatedUser,
        //     updatedAt: new Date().toDateString(),
        // }))
    }
    const [savedProjects, setSavedProjects] = useState(mockProjects);

    const handleSaveToggle = (projectId: string) => {
        const updatedProjects = savedProjects.filter(
            (project) => project._id !== projectId
        );
        setSavedProjects(updatedProjects);
    };
    return (
        <div className={styles.profileContainer}>
            <header className={styles.header}>
                <div className={styles.avatar}></div>
                <div className={styles.userInfo}>
                    <h1 className={styles.userName}>{user.username}</h1>
                    <p className={styles.userEmail}>{user.email}</p>
                </div>
                <nav className={styles.nav}>
                    <ul>
                        <li
                            className={activeTab === 'me' ? styles.active : ''}
                            onClick={() => setActiveTab('me')}
                        >
                            Tôi
                        </li>
                        <li
                            className={
                                activeTab === 'projects' ? styles.active : ''
                            }
                            onClick={() => setActiveTab('projects')}
                        >
                            Dự án
                        </li>
                        <li
                            className={
                                activeTab === 'classes' ? styles.active : ''
                            }
                            onClick={() => setActiveTab('classes')}
                        >
                            Lớp học
                        </li>
                        <li
                            className={
                                activeTab === 'saved' ? styles.active : ''
                            }
                            onClick={() => setActiveTab('saved')}
                        >
                            Dự án đã lưu
                        </li>
                    </ul>
                </nav>
            </header>
            <main className={styles.content}>
                {activeTab === 'me' ? (
                    <AboutMe user={user} onUpdateUser={handleUpdateUser} />
                ) : null}

                {activeTab === 'projects' ? <ProjectList /> : null}

                {activeTab === 'classes' ? (
                    <ProfileCourses courses={mockCourses} />
                ) : null}

                {activeTab === 'saved' ? (
                    <SavedProjects
                        projects={savedProjects}
                        onSaveToggle={handleSaveToggle}
                    />
                ) : null}
            </main>
        </div>
    )
}

export default Profile
