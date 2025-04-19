// ProjectList.tsx
import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './ProjectList.module.css'
import { getListProjectsByUser, deleteProjectById } from '../../../services/project.ts'
import { useSelector } from 'react-redux'
import { Project } from '../../../model/model.ts'
import Toast, { ToastMessage } from '../../commons/Toast/Toast.tsx'
import { DeleteOutlined } from '@ant-design/icons'

interface ProjectResponse {
    data: Project[];
    page: number;
    total: number;
    totalPages: number;
    message: string;
}

const ProjectList: React.FC = () => {
    const navigate = useNavigate()
    const { user } = useSelector((state: any) => state.auth)
    const [projects, setProjects] = useState<Project[]>([])
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [totalPages, setTotalPages] = useState<number>(1)
    const [perPage, setPerPage] = useState<number>(10)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768)
    const [mobileProjects, setMobileProjects] = useState<Project[]>([])
    const [hasMore, setHasMore] = useState<boolean>(true)
    const [mobilePage, setMobilePage] = useState<number>(1)
    const observer = useRef<IntersectionObserver | null>(null)
    const lastProjectElementRef = useRef<HTMLDivElement>(null)
    const [toast, setToast] = useState<ToastMessage>({
        show: false,
        type: 'info',
        title: '',
        message: ''
    });

    // Delete confirmation popup states
    const [showDeletePopup, setShowDeletePopup] = useState<boolean>(false)
    const [projectToDelete, setProjectToDelete] = useState<string | null>(null)
    const [projectNameToDelete, setProjectNameToDelete] = useState<string>('')
    const [projectImageToDelete, setProjectImageToDelete] = useState<string>('')

    // Format date to DD/MM/YYYY HHhMM
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');

        return `${day}/${month}/${year} ${hours}h${minutes}`;
    };

    // Handle project click to navigate to detail page
    const handleProjectClick = (projectId: string) => {
        navigate(`/projects/project-detail/${projectId}`);
    };

    // Check if device is mobile
    useEffect(() => {
        const handleResize = () => {
            const newIsMobile = window.innerWidth < 768;
            if (isMobile !== newIsMobile) {
                setIsMobile(newIsMobile);
                if (!newIsMobile) {
                    // Reset to page 1 when switching to desktop
                    setCurrentPage(1);
                } else {
                    // Reset mobile state when switching to mobile
                    setMobilePage(1);
                    setMobileProjects([]);
                    setHasMore(true);
                }
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isMobile]);

    // For desktop - fetch projects on page change or perPage change
    useEffect(() => {
        if (!isMobile) {
            fetchProjects(currentPage);
        }
    }, [currentPage, perPage, isMobile]);

    // For mobile - initial fetch
    useEffect(() => {
        if (isMobile) {
            fetchMobileProjects(1, true);
        }
    }, [isMobile, perPage]);

    // Setup intersection observer for infinite scroll
    useEffect(() => {
        if (isMobile && lastProjectElementRef.current && hasMore && !isLoading) {
            if (observer.current) observer.current.disconnect();

            observer.current = new IntersectionObserver(entries => {
                if (entries[0].isIntersecting && hasMore && !isLoading) {
                    loadMoreProjects();
                }
            }, { threshold: 0.5 });

            observer.current.observe(lastProjectElementRef.current);
        }

        return () => {
            if (observer.current) {
                observer.current.disconnect();
            }
        };
    }, [isMobile, hasMore, isLoading, mobileProjects]);

    const hideToast = () => {
        setToast(prev => ({ ...prev, show: false }));
    };

    const fetchProjects = async (page: number) => {
        try {
            setIsLoading(true);
            const response: ProjectResponse = await getListProjectsByUser(user._id, page, perPage);
            setProjects(response.data);
            setTotalPages(response.totalPages);
        } catch (error) {
            console.error("Error fetching projects:", error);
            setToast({
                show: true,
                type: 'error',
                title: 'Error',
                message: 'Failed to load projects. Please try again.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const fetchMobileProjects = async (page: number, reset: boolean = false) => {
        try {
            setIsLoading(true);
            const response: ProjectResponse = await getListProjectsByUser(user._id, page, perPage);

            if (reset) {
                setMobileProjects(response.data);
            } else {
                setMobileProjects(prev => [...prev, ...response.data]);
            }

            setHasMore(page < response.totalPages);
            setMobilePage(page);
            setTotalPages(response.totalPages);
        } catch (error) {
            console.error("Error fetching projects:", error);
            setToast({
                show: true,
                type: 'error',
                title: 'Error',
                message: 'Failed to load projects. Please try again.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const loadMoreProjects = () => {
        if (!isLoading && hasMore) {
            fetchMobileProjects(mobilePage + 1);
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newPerPage = parseInt(e.target.value);
        setPerPage(newPerPage);
        setCurrentPage(1); // Reset to first page when changing items per page

        if (isMobile) {
            setMobileProjects([]);
            setMobilePage(1);
            setHasMore(true);
        }
    };

    // Open delete confirmation popup with stopPropagation to prevent navigation
    const openDeleteConfirmation = (e: React.MouseEvent, id: string, name: string, image: string) => {
        e.stopPropagation();
        const defaultImage = 'https://i.pinimg.com/736x/39/2a/26/392a261b73dbcd361a0dac2e93a05284.jpg';
        setProjectToDelete(id);
        setProjectNameToDelete(name);
        setProjectImageToDelete(image || defaultImage);
        setShowDeletePopup(true);
    };

    // Close delete confirmation popup
    const closeDeleteConfirmation = () => {
        setShowDeletePopup(false);
        setProjectToDelete(null);
        setProjectNameToDelete('');
        setProjectImageToDelete('');
    };

    // Handle project delete after confirmation
    const handleDeleteProject = async () => {
        if (!projectToDelete) return;

        try {
            await deleteProjectById(projectToDelete);

            // Refresh projects after delete
            if (isMobile) {
                fetchMobileProjects(1, true);
            } else {
                fetchProjects(currentPage);
            }

            // Show success toast
            setToast({
                show: true,
                type: 'success',
                title: 'Success',
                message: `Project "${projectNameToDelete}" has been deleted.`
            });

            // Close the popup
            closeDeleteConfirmation();
        } catch (error) {
            console.error("Error deleting project:", error);

            // Show friendly error toast
            setToast({
                show: true,
                type: 'error',
                title: 'Error',
                message: `Could not delete project "${projectNameToDelete}". Please try again later.`
            });

            // Close the popup even if there's an error
            closeDeleteConfirmation();
        }
    };

    const renderPagination = () => {
        const pages = [];
        const maxVisiblePages = 5;

        // Calculate range of pages to show
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        // Previous button
        pages.push(
            <button
                key="prev"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || isLoading}
                className={styles.pageButton}
                aria-label="Previous page"
            >
                &lt;
            </button>
        );

        // Page numbers
        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`${styles.pageButton} ${currentPage === i ? styles.activePage : ''}`}
                    disabled={isLoading}
                    aria-current={currentPage === i ? 'page' : undefined}
                >
                    {i}
                </button>
            );
        }

        // Next button
        pages.push(
            <button
                key="next"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || isLoading}
                className={styles.pageButton}
                aria-label="Next page"
            >
                &gt;
            </button>
        );

        return (
            <div className={styles.paginationContainer}>
                <div className={styles.paginationControls}>
                    <div className={styles.perPageSelector}>
                        <label htmlFor="perPage">Show:</label>
                        <select
                            id="perPage"
                            value={perPage}
                            onChange={handlePerPageChange}
                            className={styles.perPageSelect}
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
                            <option value="20">20</option>
                        </select>
                    </div>
                    <div className={styles.paginationInfo}>
                        Page {currentPage} of {totalPages}
                    </div>
                </div>
                <div className={styles.pagination}>
                    {pages}
                </div>
            </div>
        );
    };

    // Render desktop or mobile view based on screen size
    const renderProjectsGrid = () => {
        if (isMobile) {
            return (
                <div className={styles.grid}>
                    {mobileProjects.length > 0 ? (
                        mobileProjects.map((project, index) => {
                            const projectImage = project.images && project.images[0] !== '' && project.images[0]
                                ? project.images[0]
                                : 'https://i.pinimg.com/474x/95/6f/0f/956f0fef63faac5be7b95715f6207fea.jpg';

                            // If this is the last item, attach the ref for infinite scrolling
                            if (index === mobileProjects.length - 1) {
                                return (
                                    <div
                                        className={styles.card}
                                        key={project._id}
                                        ref={lastProjectElementRef}
                                        onClick={() => handleProjectClick(project._id)}
                                    >
                                        <div className={styles.imageWrapper}>
                                            <img
                                                src={projectImage}
                                                alt={project.name}
                                                className={styles.image}
                                                loading="lazy"
                                            />
                                            <div className={styles.cardOverlay}>
                                                <div className={styles.viewDetailsText}>View Details</div>
                                            </div>
                                        </div>
                                        <div className={styles.cardContent}>
                                            <h3 className={styles.name}>{project.name}</h3>
                                            <div className={styles.cardFooter}>
                                                <p className={styles.time}>
                                                    {formatDate(project.createdAt)}
                                                </p>
                                                <button
                                                    className={styles.deleteButton}
                                                    onClick={(e) => openDeleteConfirmation(e, project._id, project.name, projectImage)}
                                                    aria-label={`Delete project ${project.name}`}
                                                >
                                                    <DeleteOutlined
                                                        style={{
                                                            fontSize: '18px',
                                                            color: '#ff4d4f',
                                                        }}
                                                    />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            } else {
                                return (
                                    <div
                                        className={styles.card}
                                        key={project._id}
                                        onClick={() => handleProjectClick(project._id)}
                                    >
                                        <div className={styles.imageWrapper}>
                                            <img
                                                src={projectImage}
                                                alt={project.name}
                                                className={styles.image}
                                                loading="lazy"
                                            />
                                            <div className={styles.cardOverlay}>
                                                <div className={styles.viewDetailsText}>View Details</div>
                                            </div>
                                        </div>
                                        <div className={styles.cardContent}>
                                            <h3 className={styles.name}>{project.name}</h3>
                                            <div className={styles.cardFooter}>
                                                <p className={styles.time}>
                                                    {formatDate(project.createdAt)}
                                                </p>
                                                <button
                                                    className={styles.deleteButton}
                                                    onClick={(e) => openDeleteConfirmation(e, project._id, project.name, projectImage)}
                                                    aria-label={`Delete project ${project.name}`}
                                                >
                                                    <DeleteOutlined
                                                        style={{
                                                            fontSize: '18px',
                                                            color: '#ff4d4f',
                                                        }}
                                                    />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        })
                    ) : (
                        <div className={styles.noProjects}>
                            <div className={styles.noProjectsContent}>
                                <svg className={styles.emptyIcon} xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="9" cy="7" r="4"></circle>
                                    <line x1="23" y1="11" x2="17" y2="11"></line>
                                </svg>
                                <h3>No projects found</h3>
                                <p>Create a new project to get started</p>
                            </div>
                        </div>
                    )}
                </div>
            )
        } else {
            return (
                <div className={styles.grid}>
                    {projects.length > 0 ? (
                        projects.map((project) => {
                            const projectImage =
                                project.images && project.images[0] !== '' && project.images[0]
                                    ? project.images[0]
                                    : 'https://i.pinimg.com/474x/95/6f/0f/956f0fef63faac5be7b95715f6207fea.jpg'

                            return (
                                <div
                                    className={styles.card}
                                    key={project._id}
                                    onClick={() =>
                                        handleProjectClick(project._id)
                                    }
                                >
                                    <div className={styles.imageWrapper}>
                                        <img
                                            src={projectImage}
                                            alt={project.name}
                                            className={styles.image}
                                            loading="lazy"
                                        />
                                        <div className={styles.cardOverlay}>
                                            <div
                                                className={
                                                    styles.viewDetailsText
                                                }
                                            >
                                                View Details
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles.cardContent}>
                                        <h3 className={styles.name}>
                                            {project.name}
                                        </h3>
                                        <div className={styles.cardFooter}>
                                            <p className={styles.time}>
                                                {formatDate(project.createdAt)}
                                            </p>
                                            <button
                                                className={styles.deleteButton}
                                                onClick={(e) =>
                                                    openDeleteConfirmation(
                                                        e,
                                                        project._id,
                                                        project.name,
                                                        projectImage
                                                    )
                                                }
                                                aria-label={`Delete project ${project.name}`}
                                            >
                                                <DeleteOutlined
                                                    style={{
                                                        fontSize: '18px',
                                                        color: '#ff4d4f',
                                                    }}
                                                />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    ) : (
                        <div className={styles.noProjects}>
                            <div className={styles.noProjectsContent}>
                                <svg
                                    className={styles.emptyIcon}
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="64"
                                    height="64"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="9" cy="7" r="4"></circle>
                                    <line
                                        x1="23"
                                        y1="11"
                                        x2="17"
                                        y2="11"
                                    ></line>
                                </svg>
                                <h3>No projects found</h3>
                                <p>Create a new project to get started</p>
                            </div>
                        </div>
                    )}
                </div>
            )
        }
    }

    return (
        <div className={styles.projectList}>
            <div className={styles.sectionTitle}>
                Dự án của tôi
            </div>
            {isLoading && !hasMore && (
                <div className={styles.loading}>
                    <div className={styles.spinner}></div>
                    <p>Loading projects...</p>
                </div>
            )}

            {renderProjectsGrid()}

            {isLoading && isMobile && hasMore && (
                <div className={styles.loadingMore}>
                    <div className={styles.spinner}></div>
                    <p>Loading more projects...</p>
                </div>
            )}

            {!isMobile && !isLoading && totalPages > 1 && renderPagination()}

            {/* Custom delete confirmation popup */}
            {showDeletePopup && (
                <div className={styles.popupOverlay} onClick={closeDeleteConfirmation}>
                    <div className={styles.popupContent} onClick={e => e.stopPropagation()}>
                        <button className={styles.closeButton} onClick={closeDeleteConfirmation} aria-label="Close popup">
                            &times;
                        </button>
                        <div className={styles.popupImageContainer}>
                            <img
                                src={projectImageToDelete}
                                alt={projectNameToDelete}
                                className={styles.popupImage}
                            />
                        </div>
                        <h3 className={styles.popupTitle}>Delete Project</h3>
                        <p className={styles.popupMessage}>
                            Are you sure you want to delete <span className={styles.highlightText}>"{projectNameToDelete}"</span>?
                            <br />
                            This action cannot be undone.
                        </p>
                        <div className={styles.popupButtons}>
                            <button
                                className={styles.cancelButton}
                                onClick={closeDeleteConfirmation}
                            >
                                Cancel
                            </button>
                            <button
                                className={styles.confirmButton}
                                onClick={handleDeleteProject}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {toast.show && <Toast toast={toast} onClose={hideToast} type={''} />}
        </div>
    )
};

export default ProjectList;
