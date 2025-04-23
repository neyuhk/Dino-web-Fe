import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaEye, FaComment, FaSearch, FaLightbulb, FaUsers, FaGraduationCap, FaLaptopCode } from 'react-icons/fa';
import styles from './ProjectPages.module.css';
import { Project } from '../../../model/model.ts';
import { getProjects } from '../../../services/project.ts';
import defaultImg from '../../../assets/Dino-green.png';
import { PROJECT_TYPE } from '../../../enum/projectType.ts'

const ProjectPages: React.FC = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState<Project[]>([]);
    const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
    const [publicProjects, setPublicProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [featuredLoading, setFeaturedLoading] = useState<boolean>(true);
    const [publicLoading, setPublicLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentType, setCurrentType] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalProjects, setTotalProjects] = useState<number>(0);
    const [perPage, setPerPage] = useState<number>(6);
    const [showSearchSection, setShowSearchSection] = useState<boolean>(false);
     type ProjectTypeValue = (typeof PROJECT_TYPE)[keyof typeof PROJECT_TYPE];
     const projectTypes: { id: '' | ProjectTypeValue; label: string }[] = [
        { id: '', label: 'Tất cả dự án' },
        { id: PROJECT_TYPE.RECOMMEND, label: 'Dự án đề xuất' },
        { id: PROJECT_TYPE.DEFAULT, label: 'Dự án tiêu chuẩn' },
        { id: PROJECT_TYPE.PUBLIC, label: 'Dự án công khai' },
        { id: PROJECT_TYPE.EXAMPLE, label: 'Dự án mẫu' },
    ];

    // Tải dự án nổi bật và công khai một lần khi component mount
    useEffect(() => {
        const fetchStaticProjects = async () => {
            try {
                // Tải dự án nổi bật (RECOMMEND)
                setFeaturedLoading(true);
                const featured = await getProjects(1, 3, '', 'RECOMMEND');
                setFeaturedProjects(featured?.data || []);
                setFeaturedLoading(false);

                // Tải dự án công khai
                setPublicLoading(true);
                const public_projects = await getProjects(1, 4, '', 'PUBLIC');
                setPublicProjects(public_projects?.data || []);
                setPublicLoading(false);
            } catch (err) {
                console.error("Lỗi khi tải dự án cố định:", err);
                // Không đặt lỗi chung để tránh ảnh hưởng đến phần tìm kiếm
            }
        };

        fetchStaticProjects();
    }, []);

    // Tải dự án theo điều kiện tìm kiếm
    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!showSearchSection) return;

            setLoading(true);
            try {
                const data = await getProjects(currentPage, perPage, searchTerm, currentType);
                if (data && data.data) {
                    setProjects(data.data);
                    setTotalProjects(data.total || 0);
                } else {
                    setProjects([]);
                    setTotalProjects(0);
                }
            } catch (err) {
                setError('Không thể tải dự án. Vui lòng thử lại sau.');
            } finally {
                setLoading(false);
            }
        };

        fetchSearchResults();
    }, [currentPage, perPage, searchTerm, currentType, showSearchSection]);

    const totalPages = Math.ceil(totalProjects / perPage);

    const handleTypeChange = (type: string) => {
        setCurrentType(type);
        setCurrentPage(1);
        setShowSearchSection(true);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return 'Chưa có thông tin';

        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (e) {
            return 'Ngày không hợp lệ';
        }
    };

    const handleShowSearch = () => {
        setShowSearchSection(true);
        setTimeout(() => {
            const searchSection = document.querySelector(`.${styles.searchSection}`);
            if (searchSection) {
                searchSection.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
    };

    // Render project card component
    const renderProjectCard = (project: any, isLarge = false) => {
        if (!project) return null;

        // Đảm bảo project.user_id tồn tại
        const user = project.user_id || {};
        const projectDescription = project.description || '';
        const projectType = project.project_type || 'Chưa phân loại';

        return (
            <div
                key={project._id}
                className={`${styles.projectCard} ${isLarge ? styles.projectCardLarge : ''}`}
            >
                <div className={styles.projectImageContainer}>
                    {project.images &&
                    Array.isArray(project.images) &&
                    project.images.length > 0 ? (
                        <img
                            src={
                                project.images[0] ||
                                'https://i.pinimg.com/736x/95/6f/0f/956f0fef63faac5be7b95715f6207fea.jpg'
                            }
                            alt={project.name || 'Hình ảnh dự án'}
                            className={styles.projectImage}
                        />
                    ) : (
                        <img
                            src={defaultImg}
                            alt="Hình ảnh mặc định"
                            className={styles.projectImage}
                        />
                    )}
                    <div className={styles.projectType}>{projectType}</div>
                </div>
                <div className={styles.projectContent}>
                    <h3 className={styles.projectTitle}>
                        {project.name || 'Dự án chưa đặt tên'}
                    </h3>
                    <p className={styles.projectDescription}>
                        {projectDescription.trim() === ''
                            ? 'Chưa có mô tả về dự án'
                            : projectDescription.length > (isLarge ? 150 : 100)
                              ? `${projectDescription.substring(0, isLarge ? 150 : 100)}...`
                              : projectDescription}
                    </p>

                    <div className={styles.projectMeta}>
                        <div className={styles.authorInfo}>
                            {user.avatar &&
                            Array.isArray(user.avatar) &&
                            user.avatar.length > 0 ? (
                                <img
                                    src={user.avatar[0]}
                                    alt={user.username || 'Người dùng'}
                                    className={styles.authorAvatar}
                                />
                            ) : (
                                <img
                                    src={defaultImg}
                                    alt="Avatar mặc định"
                                    className={styles.authorAvatar}
                                />
                            )}
                            <span>{user.username || 'Ẩn danh'}</span>
                        </div>
                        <div className={styles.projectStats}>
                            <span className={styles.stat}>
                                <FaHeart className={styles.icon} />{' '}
                                {project.like_count || 0}
                            </span>
                            <span className={styles.stat}>
                                <FaEye className={styles.icon} />{' '}
                                {project.view_count || 0}
                            </span>
                            <span className={styles.stat}>
                                <FaComment className={styles.icon} />{' '}
                                {project.comment_count || 0}
                            </span>
                        </div>
                    </div>
                    <div className={styles.projectFooter}>
                        <span className={styles.projectDate}>
                            Tạo ngày: {formatDate(project.createdAt)}
                        </span>
                        <button
                            className={styles.viewButton}
                            onClick={() =>
                                navigate(
                                    `/projects/project-detail/${project._id}`
                                )
                            }
                        >
                            Xem chi tiết
                        </button>
                    </div>
                </div>
            </div>
        )
    };

    return (
        <div className={styles.projectPagesContainer}>
            {/* Hero Section - luôn hiển thị */}
            <section className={styles.heroSection}>
                <div className={styles.heroContent}>
                    <h1 className={styles.titleGradient}>
                        Khám Phá Không Gian Sáng Tạo
                    </h1>
                    <p>
                        Nơi chia sẻ và truyền cảm hứng qua những dự án học tập
                        đầy sáng tạo
                    </p>
                    <div className={styles.heroButtons}>
                        <button
                            className={styles.primaryButton}
                            onClick={handleShowSearch}
                        >
                            Khám phá dự án{' '}
                            <FaSearch className={styles.buttonIcon} />
                        </button>
                        <button
                            className={styles.secondaryButton}
                            onClick={() => navigate('/blockly')}
                        >
                            Tạo dự án mới
                        </button>
                    </div>
                </div>
                <div className={styles.heroImageContainer}>
                    <div className={styles.heroImageOverlay}></div>
                </div>
            </section>
            {/* Featured Projects Section - luôn hiển thị */}
            <section className={styles.featuredSection}>
                <div className={styles.sectionHeader}>
                    <h2>Dự Án Nổi Bật</h2>
                    <p>
                        Những dự án tiêu biểu được đánh giá cao từ cộng
                        đồng học tập
                    </p>
                </div>

                {featuredLoading ? (
                    <div className={styles.loadingContainer}>
                        <div className={styles.loadingSpinner}></div>
                        <p>Đang tải dự án nổi bật...</p>
                    </div>
                ) : featuredProjects.length === 0 ? (
                    <div className={styles.noProjects}>
                        <p>Hiện chưa có dự án nổi bật.</p>
                    </div>
                ) : (
                    <div className={styles.featuredProjectsGrid}>
                        {featuredProjects.map((project) =>
                            renderProjectCard(project, true)
                        )}
                    </div>
                )}
            </section>

            {/* Categories Section - luôn hiển thị */}
            <section className={styles.categoriesSection}>
                <div className={styles.sectionHeader}>
                    <h2>Khám Phá Theo Chủ Đề</h2>
                    <p>
                        Dự án được phân loại để bạn dễ dàng tìm kiếm
                        đúng nội dung mình quan tâm
                    </p>
                </div>

                <div className={styles.categoriesGrid}>
                    {projectTypes.slice(1).map((type) => (
                        <div
                            key={type.id}
                            className={styles.categoryCard}
                            onClick={() => handleTypeChange(type.id)}
                        >
                            {type.id === 'RECOMMEND' && (
                                <FaLightbulb
                                    className={styles.categoryIcon}
                                />
                            )}
                            {type.id === 'DEFAULT' && (
                                <FaLaptopCode
                                    className={styles.categoryIcon}
                                />
                            )}
                            {type.id === 'PUBLIC' && (
                                <FaUsers
                                    className={styles.categoryIcon}
                                />
                            )}
                            {type.id === 'EXAMPLE' && (
                                <FaGraduationCap
                                    className={styles.categoryIcon}
                                />
                            )}
                            <h3>{type.label}</h3>
                            <p>
                                {type.id === 'RECOMMEND' &&
                                    'Dự án được đề xuất bởi giáo viên và chuyên gia'}
                                {type.id === 'DEFAULT' &&
                                    'Dự án tiêu chuẩn cho mọi đối tượng học tập'}
                                {type.id === 'PUBLIC' &&
                                    'Dự án công khai chia sẻ từ cộng đồng học tập'}
                                {type.id === 'EXAMPLE' &&
                                    'Dự án mẫu giúp bạn học hỏi và lấy cảm hứng'}
                            </p>
                            <button className={styles.categoryButton}
                                    onClick={handleShowSearch}
                            >
                                Khám phá
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Public Projects Section - luôn hiển thị */}
            <section className={styles.publicSection}>
                <div className={styles.sectionHeader}>
                    <h2>Dự Án Từ Cộng Đồng</h2>
                    <p>
                        Những chia sẻ mới nhất từ cộng đồng học tập sáng
                        tạo
                    </p>
                </div>

                {publicLoading ? (
                    <div className={styles.loadingContainer}>
                        <div className={styles.loadingSpinner}></div>
                        <p>Đang tải dự án công khai...</p>
                    </div>
                ) : publicProjects.length === 0 ? (
                    <div className={styles.noProjects}>
                        <p>Hiện chưa có dự án công khai.</p>
                    </div>
                ) : (
                    <div className={styles.projectsGrid}>
                        {publicProjects.map((project) =>
                            renderProjectCard(project)
                        )}
                    </div>
                )}

                <div className={styles.sectionFooter}>
                    <button
                        className={styles.primaryButton}
                        onClick={handleShowSearch}
                    >
                        Xem tất cả dự án
                    </button>
                </div>
            </section>

            {/* Search Section - có thể mở rộng/thu gọn */}
            <section className={`${styles.searchSection} ${showSearchSection ? styles.expanded : styles.collapsed}`}>
                <div className={styles.searchHeader}>
                    <h2>Tìm kiếm dự án</h2>
                    <p>Khám phá các dự án phù hợp với sở thích và mục tiêu học tập của bạn</p>
                    <button
                        className={styles.toggleSearchButton}
                        onClick={() => setShowSearchSection(!showSearchSection)}
                    >
                        {showSearchSection ? 'Thu gọn tìm kiếm' : 'Mở rộng tìm kiếm'}
                    </button>
                </div>
                {showSearchSection && (
                    <>
                        <div className={styles.filterSection}>
                            <div className={styles.searchBar}>
                                <FaSearch className={styles.searchIcon} />
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm theo tên dự án..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <div className={styles.typeFilter}>
                                {projectTypes.map((type) => (
                                    <button
                                        key={type.id}
                                        className={`${styles.typeButton} ${currentType === type.id ? styles.active : ''}`}
                                        onClick={() => handleTypeChange(type.id)}
                                    >
                                        {type.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {error && (
                            <div className={styles.errorMessage}>{error}</div>
                        )}

                        {loading ? (
                            <div className={styles.loadingContainer}>
                                <div className={styles.loadingSpinner}></div>
                                <p>Đang tải dự án...</p>
                            </div>
                        ) : projects.length === 0 ? (
                            <div className={styles.noProjects}>
                                <h3>Không tìm thấy dự án</h3>
                                <p>
                                    Vui lòng thử thay đổi tiêu chí tìm kiếm hoặc
                                    quay lại sau để xem các dự án mới.
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className={styles.projectsGrid}>
                                    {projects.map((project) =>
                                        renderProjectCard(project)
                                    )}
                                </div>

                                {totalPages > 1 && (
                                    <div className={styles.pagination}>
                                        <button
                                            className={styles.pageButton}
                                            disabled={currentPage === 1}
                                            onClick={() =>
                                                handlePageChange(currentPage - 1)
                                            }
                                        >
                                            Trang trước
                                        </button>
                                        {Array.from(
                                            { length: Math.min(totalPages, 5) },
                                            (_, i) => {
                                                let pageNum = currentPage - 2 + i
                                                if (currentPage < 3) {
                                                    pageNum = i + 1
                                                } else if (
                                                    currentPage >
                                                    totalPages - 2
                                                ) {
                                                    pageNum = totalPages - 4 + i
                                                }

                                                if (
                                                    pageNum > 0 &&
                                                    pageNum <= totalPages
                                                ) {
                                                    return (
                                                        <button
                                                            key={pageNum}
                                                            className={`${styles.pageButton} ${
                                                                currentPage ===
                                                                pageNum
                                                                    ? styles.activePage
                                                                    : ''
                                                            }`}
                                                            onClick={() =>
                                                                handlePageChange(
                                                                    pageNum
                                                                )
                                                            }
                                                        >
                                                            {pageNum}
                                                        </button>
                                                    )
                                                }
                                                return null
                                            }
                                        )}
                                        <button
                                            className={styles.pageButton}
                                            disabled={currentPage === totalPages}
                                            onClick={() =>
                                                handlePageChange(currentPage + 1)
                                            }
                                        >
                                            Trang sau
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </>
                )}
            </section>
        </div>
    );
};

export default ProjectPages;