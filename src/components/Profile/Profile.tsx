import React, { useEffect, useState } from 'react'
import styles from './Profile.module.css'
import ProjectList from './ProjectList/ProjectList.tsx'
import AboutMe from './AboutMe/AboutMe.tsx'
import { Project, User } from '../../model/model.ts'
import ProfileCourses from './Courses/Profile-Courses.tsx'
import { Typography, Pagination } from 'antd'
import SavedProjects from './SavedProjects/SavedProjects.tsx'
import { useSelector, useDispatch } from 'react-redux'
import { getFavoriteProjects, searchProject } from '../../services/project.ts'
import { updateUser } from '../../stores/authAction.ts'

const Profile: React.FC = () => {
    const [activeTab, setActiveTab] = useState('me')
    const { user } = useSelector((state: any) => state.auth)
    const dispatch = useDispatch() // Get the dispatch function
    const { Title } = Typography
    const [savedProjects, setSavedProjects] = useState<Project[]>([]);
    const [page, setPage] = useState<number>(1);
    const [perPage, setPerPage] = useState<number>(10);
    const [totalProjects, setTotalProjects] = useState<number>(0);

    const handleSaveToggle = (projectId: string) => {
        const updatedProjects = savedProjects.filter(
            (project) => project._id !== projectId
        );
        setSavedProjects(updatedProjects);
    };

    const fetchSavedProjects = async (currentPage = page, itemsPerPage = perPage) => {
        try {
            const response = await searchProject(currentPage, itemsPerPage, '', 'false', user._id);
            setSavedProjects(response.data);
            setTotalProjects(response.total);
        } catch (error) {
            console.error('Error fetching saved projects:', error);
        }
    };

    useEffect(() => {
        if (activeTab === 'saved') {
            fetchSavedProjects();
        }
    }, [activeTab, page, perPage])

    const handlePageChange = (newPage: number, newPerPage?: number) => {
        setPage(newPage);
        if (newPerPage) {
            setPerPage(newPerPage);
        }
    };

    // Handle user update from AboutMe component
    const handleUserUpdate = (updatedUser: User) => {
        dispatch(updateUser(updatedUser)); // Dispatch the updateUser action
    };

    return (
        <div className={styles.profileContainer}>
            <header className={styles.header}>
                <div className={styles.avatar}>
                    <img
                        src={user.avatar[0] ? user.avatar:'https://i.pinimg.com/474x/20/c0/0f/20c00f0f135c950096a54b7b465e45cc.jpg'}
                        className={styles.avatar}
                    />
                </div>
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
                    <AboutMe onUserUpdate={handleUserUpdate} />
                ) : null}

                {activeTab === 'projects' ? <ProjectList /> : null}
                {activeTab === 'saved' ? (
                    <>
                        <SavedProjects
                            projects={savedProjects}
                            onSaveToggle={handleSaveToggle}
                        />
                        <div className={styles.paginationContainer}>
                            <Pagination
                                current={page}
                                pageSize={perPage}
                                total={totalProjects}
                                onChange={handlePageChange}
                                showSizeChanger
                                pageSizeOptions={['5', '10', '20', '50']}
                                onShowSizeChange={(current, size) => handlePageChange(1, size)}
                            />
                        </div>
                    </>
                ) : null}
            </main>
        </div>
    )
}

export default Profile