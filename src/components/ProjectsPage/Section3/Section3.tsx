import React, { useEffect, useState } from 'react'
import { Heart, Bookmark, Download } from 'lucide-react'
import styles from './Section3.module.css'
import { Project } from '../../../model/model.ts'
import { getProjects } from '../../../services/project.ts'
import { Pagination } from 'antd'
import { useNavigate } from 'react-router-dom'

interface Section3Props {
    searchQuery: string
}

const Section3: React.FC<Section3Props> = ({ searchQuery }) => {
    const [projects, setProjects] = useState<Project[]>([])
    const [page, setPage] = useState(1)
    const [perPage, setPerPage] = useState(12) // Default to 12 (divisible by 4)
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProjects = async () => {
            setLoading(true)
            console.log(searchQuery)
            try {
                const data = await getProjects(page, perPage, searchQuery, '')
                setProjects(data.data)
                setTotal(data.total)
            } catch (error) {
                console.error('Error fetching projects:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchProjects()
    }, [page, perPage, searchQuery])

    const [interactions, setInteractions] = React.useState<{
        [key: string]: { liked: boolean; saved: boolean }
    }>({})

    const handleInteraction = (
        projectId: string,
        type: 'like' | 'save' | 'download'
    ) => {
        setProjects((prev) => {
            return prev.map((project) => {
                if (project._id === projectId) {
                    const updated = { ...project }
                    switch (type) {
                        case 'like':
                            updated.like_count = interactions[projectId]?.liked
                                ? project.like_count - 1
                                : project.like_count + 1
                            break
                        case 'save':
                            updated.like_count = interactions[projectId]?.saved
                                ? project.like_count - 1
                                : project.like_count + 1
                            break
                        case 'download':
                            updated.view_count = project.view_count + 1
                            break
                    }
                    return updated
                }
                return project
            })
        })

        if (type !== 'download') {
            setInteractions((prev) => ({
                ...prev,
                [projectId]: {
                    ...prev[projectId],
                    [type === 'like' ? 'liked' : 'saved']:
                        !prev[projectId]?.[type === 'like' ? 'liked' : 'saved'],
                },
            }))
        }
    }

    const handlePageChange = (newPage: number, newPageSize: number) => {
        setPage(newPage)
        setPerPage(newPageSize)
    }

    const handleProjectClick = (projectId: string) => {
        navigate(`/projects/project-detail/${projectId}`);
    };

    // Prevent event bubbling for interaction buttons
    const handleInteractionClick = (
        e: React.MouseEvent,
        projectId: string,
        type: 'like' | 'save' | 'download'
    ) => {
        e.stopPropagation();
        handleInteraction(projectId, type);
    };

    return (
        <section className={styles.section3}>
            <div className={styles.projectsGrid}>
                {loading ? (
                    <div className={styles.loadingContainer}>
                        Loading projects...
                    </div>
                ) : projects.length === 0 ? (
                    <div className={styles.noResults}>
                        No projects found
                        {searchQuery ? ` for "${searchQuery}"` : ''}
                    </div>
                ) : (
                    projects.map((project) => (
                        <div
                            key={project._id}
                            className={styles.projectCard}
                            onClick={() => handleProjectClick(project._id)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className={styles.imageContainer}>
                                <img
                                    src={project.images[0] || "https://i.pinimg.com/736x/95/6f/0f/956f0fef63faac5be7b95715f6207fea.jpg"}
                                    alt={project.name}
                                    className={styles.projectImage}
                                />
                            </div>
                            <div className={styles.projectContent}>
                                <h3 className={styles.projectTitle}>
                                    {project.name}
                                </h3>
                                <p className={styles.projectAuthor}>
                                    {project.user_id.username}
                                </p>
                                <p className={styles.projectDescription}>
                                    {project.description?.length > 100
                                        ? `${project.description.slice(0, 100)}... `
                                        : project.description || ''}
                                    {project.description?.length > 100 && (
                                        <span className={styles.readMore}>
                                            xem thêm
                                        </span>
                                    )}
                                </p>
                                <div className={styles.interactions}>
                                    <button
                                        className={`${styles.interactionButton} ${interactions[project._id]?.liked ? styles.liked : ''}`}
                                        onClick={(e) =>
                                            handleInteractionClick(
                                                e,
                                                project._id,
                                                'like'
                                            )
                                        }
                                    >
                                        <Heart size={20} />
                                        <span>{project.like_count}</span>
                                    </button>
                                    <button
                                        className={`${styles.interactionButton} ${interactions[project._id]?.saved ? styles.saved : ''}`}
                                        onClick={(e) =>
                                            handleInteractionClick(
                                                e,
                                                project._id,
                                                'save'
                                            )
                                        }
                                    >
                                        <Bookmark size={20} />
                                        <span>{project.like_count}</span>
                                    </button>
                                    <button
                                        className={styles.interactionButton}
                                        onClick={(e) =>
                                            handleInteractionClick(
                                                e,
                                                project._id,
                                                'download'
                                            )
                                        }
                                    >
                                        <Download size={20} />
                                        <span>{project.view_count}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className={styles.paginationContainer}>
                <Pagination
                    current={page}
                    pageSize={perPage}
                    total={total}
                    onChange={handlePageChange}
                    showSizeChanger
                    pageSizeOptions={['4', '8', '12', '16', '20', '24']} // All divisible by 4
                    showTotal={(total) => `${total} projects in total`}
                />
            </div>
        </section>
    )
}

export default Section3
