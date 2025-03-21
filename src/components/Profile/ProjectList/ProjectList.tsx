// ProjectList.tsx
import React, { useEffect, useState, useRef, useCallback } from 'react'
import styles from './ProjectList.module.css';
import { getListProjectsByUser } from '../../../services/project.ts'
import { useSelector } from 'react-redux'
import { Project } from '../../../model/model.ts'

interface ProjectResponse {
    data: Project[];
    page: number;
    total: number;
    totalPages: number;
    message: string;
}

const ProjectList: React.FC = () => {
    const { user } = useSelector((state: any) => state.auth)
    const [projects, setProjects] = useState<Project[]>([])
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [totalPages, setTotalPages] = useState<number>(1)
    const [perPage] = useState<number>(10)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768)
    const [mobileProjects, setMobileProjects] = useState<Project[]>([])
    const [hasMore, setHasMore] = useState<boolean>(true)
    const [mobilePage, setMobilePage] = useState<number>(1)
    const observer = useRef<IntersectionObserver | null>(null)
    const lastProjectElementRef = useRef<HTMLDivElement>(null)

    // Check if device is mobile
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // For desktop - fetch projects on page change
    useEffect(() => {
        if (!isMobile) {
            fetchProjects(currentPage);
        }
    }, [currentPage, isMobile]);

    // For mobile - initial fetch
    useEffect(() => {
        if (isMobile) {
            fetchMobileProjects(1, true);
        }
    }, [isMobile]);

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

    const fetchProjects = async (page: number) => {
        try {
            setIsLoading(true);
            const response: ProjectResponse = await getListProjectsByUser(user._id, page, perPage);
            setProjects(response.data);
            setTotalPages(response.totalPages);
        } catch (error) {
            console.error("Error fetching projects:", error);
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
                <div className={styles.paginationInfo}>
                    Page {currentPage} of {totalPages}
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
                            // If this is the last item, attach the ref for infinite scrolling
                            if (index === mobileProjects.length - 1) {
                                return (
                                    <div
                                        className={styles.card}
                                        key={project._id}
                                        ref={lastProjectElementRef}
                                    >
                                        <img
                                            src={
                                                project.images[0]
                                                    ? project.images[0]
                                                    : 'https://i.pinimg.com/736x/39/2a/26/392a261b73dbcd361a0dac2e93a05284.jpg'
                                            }
                                            alt={project.name}
                                            className={styles.image}
                                        />
                                        <h3 className={styles.name}>
                                            {project.name}
                                        </h3>
                                        <p className={styles.time}>
                                            {project.createdAt}
                                        </p>
                                    </div>
                                )
                            } else {
                                return (
                                    <div
                                        className={styles.card}
                                        key={project._id}
                                    >
                                        <img
                                            src={
                                                project.images[0]
                                                    ? project.images[0]
                                                    : 'https://i.pinimg.com/736x/39/2a/26/392a261b73dbcd361a0dac2e93a05284.jpg'
                                            }
                                            alt={project.name}
                                            className={styles.image}
                                        />
                                        <h3 className={styles.name}>
                                            {project.name}
                                        </h3>
                                        <p className={styles.time}>
                                            {project.createdAt}
                                        </p>
                                    </div>
                                )
                            }
                        })
                    ) : (
                        <div className={styles.noProjects}>
                            No projects found.
                        </div>
                    )}
                </div>
            )
        } else {
            return (
                <div className={styles.grid}>
                    {projects.length > 0 ? (
                        projects.map((project) => (
                            <div className={styles.card} key={project._id}>
                                <img
                                    src={
                                        project.images[0]
                                            ? project.images[0]
                                            : 'https://i.pinimg.com/736x/39/2a/26/392a261b73dbcd361a0dac2e93a05284.jpg'
                                    }
                                    alt={project.name}
                                    className={styles.image}
                                />
                                <h3 className={styles.name}>{project.name}</h3>
                                <p className={styles.time}>
                                    {project.createdAt}
                                </p>
                            </div>
                        ))
                    ) : (
                        <div className={styles.noProjects}>
                            No projects found.
                        </div>
                    )}
                </div>
            )
        }
    }

    return (
        <div className={styles.projectList}>
            <h2 className={styles.title}>Projects</h2>
            {renderProjectsGrid()}

            {isLoading && isMobile && (
                <div className={styles.loadingMore}>
                    Loading more projects...
                </div>
            )}

            {!isMobile && !isLoading && totalPages > 1 && renderPagination()}
        </div>
    )
};

export default ProjectList;