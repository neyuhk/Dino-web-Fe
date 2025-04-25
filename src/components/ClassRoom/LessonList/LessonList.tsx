import React, { useEffect, useState } from 'react';
import { GraduationCap, Book, CheckCircle, AlertCircle, ChevronRight, ChevronLeft, ArrowRight, ChevronFirst, ChevronLast } from 'lucide-react';
import styles from './LessonList.module.css';
import { Lesson } from '../../../model/classroom.ts';
import { getLessonByCourseId, getLessonByCourseIdStudent } from '../../../services/lesson.ts'
import { useSelector } from 'react-redux';
import RequireAuth from '../../commons/RequireAuth/RequireAuth.tsx';
import { useNavigate } from 'react-router-dom';
import DinoLoading from '../../commons/DinoLoading/DinoLoading.tsx'

interface LessonListProps {
    courseId: string;
}

const LessonList: React.FC<LessonListProps> = ({ courseId }) => {
    const { user } = useSelector((state: any) => state.auth);
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'all' | 'completed' | 'incomplete'>('all');
    const navigate = useNavigate();

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [lessonsPerPage] = useState(5);

    useEffect(() => {
        fetchLessons();
    }, [courseId]);

    const fetchLessons = async () => {
        try {
            setIsLoading(true);
            const data = await getLessonByCourseIdStudent(courseId, user._id);
            setLessons(data.data);
        } catch (err) {
            setError('Có lỗi xảy ra khi tải bài học. Vui lòng thử lại sau!');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLessonClick = (lessonId: string) => {
        const selectedLesson = lessons.find(lesson => lesson._id === lessonId);
        if (selectedLesson) {
            navigate(`/classroom/courses/lesson/${lessonId}`);
        }
    };

    const getIncompleteExercises = (lesson: Lesson) => {
        return lesson.unFinished;
    };

    // Filter lessons based on active tab
    const getFilteredLessons = () => {

        return lessons.filter(lesson => {
            const isCompleted = lesson.unFinished === 0;
            switch (activeTab) {
                case 'completed':
                    return isCompleted;
                case 'incomplete':
                    return !isCompleted;
                default:
                    return true;
            }
        });
    };

    // Get current lessons for pagination
    const filteredLessons = getFilteredLessons();
    const indexOfLastLesson = currentPage * lessonsPerPage;
    const indexOfFirstLesson = indexOfLastLesson - lessonsPerPage;
    const currentLessons = filteredLessons.slice(indexOfFirstLesson, indexOfLastLesson);
    const totalPages = Math.ceil(filteredLessons.length / lessonsPerPage);

    // Change page
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
    const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
    const goToPrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
    const goToFirstPage = () => setCurrentPage(1);
    const goToLastPage = () => setCurrentPage(totalPages);

    useEffect(() => {
        // Reset pagination when tab changes
        setCurrentPage(1);
    }, [activeTab]);

    // Navigate to course list
    const handleViewCourses = () => {
        navigate('/classroom');
    };

    if (!user) {
        return <RequireAuth />;
    }

    if (isLoading) {
        return (
            // <div className={styles.loadingContainer}>
            //     <div className={styles.loadingSpinner}>
            //         <GraduationCap size={32} className={styles.loadingIcon} />
            //     </div>
            //     <p>Chờ xíuuuu...</p>
            // </div>
            <DinoLoading
                message="Chờ xíuuuu..."
            />
        );
    }

    if (error) {
        return (
            <div className={styles.errorContainer}>
                <AlertCircle size={32} className={styles.errorIcon} />
                <p>{error}</p>
                <button onClick={fetchLessons} className={styles.retryButton}>
                    Thử lại
                </button>
            </div>
        );
    }

    // Empty state check
    if (lessons.length === 0) {
        return (
            <div className={styles.emptyState}>
                <div className={styles.emptyContent}>
                    <div className={styles.emptyIcon}>
                        <GraduationCap size={48} />
                    </div>
                    <h2 className={styles.emptyTitle}>Bắt đầu hành trình học tập của bạn</h2>
                    <p className={styles.emptyDescription}>
                        Lớp học hiện chưa có bài học nào. Hãy chờ giáo viên thêm nội dung trong thời gian tới nhé!
                    </p>
                    <button className={styles.emptyButton} onClick={handleViewCourses}>
                        Xem các lớp học
                        <ArrowRight size={16} />
                    </button>
                </div>
            </div>
        );
    }

    // Empty state check for filtered tabs
    if (filteredLessons.length === 0) {
        const emptyMessage = activeTab === 'completed'
            ? 'Bạn chưa hoàn thành bài học nào trong khóa học này.'
            : 'Tất cả các bài học đã được hoàn thành. Thật xuất sắc!';

        return (
            <div className={styles.container}>
                <div className={styles.tabContainer}>
                    {['all', 'completed', 'incomplete'].map((tab) => (
                        <button
                            key={tab}
                            className={`${styles.tabButton} ${activeTab === tab ? styles.activeTab : ''}`}
                            onClick={() => setActiveTab(tab as 'all' | 'completed' | 'incomplete')}
                        >
                            {tab === 'all' ? 'Tất cả' : tab === 'completed' ? 'Đã hoàn thành' : 'Chưa hoàn thành'}
                        </button>
                    ))}
                </div>

                <div className={styles.emptyState}>
                    <div className={styles.emptyContent}>
                        <div className={styles.emptyIcon}>
                            {activeTab === 'completed'
                                ? <Book size={48} />
                                : <CheckCircle size={48} />}
                        </div>
                        <h2 className={styles.emptyTitle}>
                            {activeTab === 'completed' ? 'Chưa có bài học nào hoàn thành' : 'Tất cả đã hoàn thành'}
                        </h2>
                        <p className={styles.emptyDescription}>{emptyMessage}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.tabContainer}>
                {['all', 'completed', 'incomplete'].map((tab) => (
                    <button
                        key={tab}
                        className={`${styles.tabButton} ${activeTab === tab ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab(tab as 'all' | 'completed' | 'incomplete')}
                    >
                        {tab === 'all' ? 'Tất cả' : tab === 'completed' ? 'Đã hoàn thành' : 'Chưa hoàn thành'}
                    </button>
                ))}
            </div>

            <div className={styles.lessonList}>
                {currentLessons.map((lesson) => (
                    <div key={lesson._id} className={styles.lessonCard}>
                        <div className={styles.lessonHeader} onClick={() => handleLessonClick(lesson._id)}>
                            <div className={styles.lessonInfo}>
                                <Book size={24} className={styles.lessonIcon} />
                                <div>
                                    <h3 className={styles.lessonTitle}>{lesson.title}</h3>
                                    <p className={styles.lessonMeta}>
                                        {lesson.duration} phút • {lesson.progress}% hoàn thành
                                    </p>
                                </div>
                            </div>

                            {lesson.isCompleted ? (
                                <CheckCircle size={24} className={styles.completedIcon} />
                            ) : getIncompleteExercises(lesson) > 0 && (
                                <div className={styles.exerciseBadge}>
                                    {getIncompleteExercises(lesson)} bài tập chưa hoàn thành
                                </div>
                            )}

                            <ChevronRight size={24} className={styles.expandIcon} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className={styles.paginationContainer}>
                    <button
                        className={`${styles.pageButton} ${currentPage === 1 ? styles.disabled : ''}`}
                        onClick={goToFirstPage}
                        disabled={currentPage === 1}
                    >
                        <ChevronFirst size={16} />
                    </button>
                    <button
                        className={`${styles.pageButton} ${currentPage === 1 ? styles.disabled : ''}`}
                        onClick={goToPrevPage}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeft size={16} />
                    </button>

                    <span className={styles.pageInfo}>
                        Trang {currentPage} / {totalPages}
                    </span>

                    <button
                        className={`${styles.pageButton} ${currentPage === totalPages ? styles.disabled : ''}`}
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages}
                    >
                        <ChevronRight size={16} />
                    </button>
                    <button
                        className={`${styles.pageButton} ${currentPage === totalPages ? styles.disabled : ''}`}
                        onClick={goToLastPage}
                        disabled={currentPage === totalPages}
                    >
                        <ChevronLast size={16} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default LessonList;