import React, { useEffect, useState, useMemo, useRef } from 'react';
import styles from './CourseScore.module.css';
import { getScoreForCourse, editScore, deleteScore } from '../../../../services/score.ts';
import { Search, X, RotateCcw, Edit, Filter, MoreVertical, Eye, Trash2, GraduationCap } from 'lucide-react'
import Toast from '../../../commons/Toast/Toast.tsx'
import ExerciseDetail from '../../ExerciseDetail/ExerciseDetail.tsx'

interface DetailPopup {
    show: boolean;
    userId: string | null;
    userName: string | null;
    exerciseId: string | null;
}

// Define Toast interface
interface ToastMessage {
    show: boolean;
    type: 'success' | 'error' | 'info' | 'warning';
    title: string;
    message: string;
}

interface Props {
    courseId: string;
}

const CourseScore: React.FC<Props> = ({ courseId }) => {
    const [data, setData] = useState<any[]>([]);
    const [courseTitle, setCourseTitle] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [editingScore, setEditingScore] = useState<{ userId: string, exerciseId: string } | null>(null);
    const [editScoreValue, setEditScoreValue] = useState<string>('');
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
    const dropdownRefs = useRef<{[key: string]: HTMLDivElement | null}>({});
    const [deleteConfirm, setDeleteConfirm] = useState<{
        show: boolean;
        userId: string | null;
        exerciseId: string | null;
    }>({
        show: false,
        userId: null,
        exerciseId: null
    });
    const [detailPopup, setDetailPopup] = useState<DetailPopup>({
        show: false,
        userId: null,
        userName: null,
        exerciseId: null
    });
    // Toast state
    const [toast, setToast] = useState<ToastMessage>({
        show: false,
        type: 'info',
        title: '',
        message: '',
    });

    // Filtering and Sorting States
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [sortField, setSortField] = useState<string>('lessonTitle');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    // Stats for summary
    const [stats, setStats] = useState({
        totalStudents: 0,
        averageScore: 0,
        completionRate: 0,
    });

    useEffect(() => {
        fetchScores();
    }, [courseId]);

    // Toast auto hide after 3 seconds
    useEffect(() => {
        let toastTimer: ReturnType<typeof setTimeout>;
        if (toast.show) {
            toastTimer = setTimeout(() => {
                hideToast();
            }, 3000);
        }
        return () => {
            if (toastTimer) clearTimeout(toastTimer);
        };
    }, [toast.show]);

    // Separate useEffect for handling click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // Only close if we have an open dropdown and clicked outside of it
            if (openDropdownId &&
                dropdownRefs.current[openDropdownId] &&
                !dropdownRefs.current[openDropdownId]?.contains(event.target as Node)) {
                setOpenDropdownId(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [openDropdownId]); // Depend on openDropdownId to re-attach listener when it changes

    // Show toast function
    const showToast = (type: 'success' | 'error' | 'info' | 'warning', title: string, message: string) => {
        setToast({
            show: true,
            type,
            title,
            message,
        });
    };

    // Hide toast function
    const hideToast = () => {
        setToast(prev => ({ ...prev, show: false }));
    };
    const closeDetailPopup = () => {
        setDetailPopup({
            show: false,
            userId: null,
            userName: null,
            exerciseId: null
        });
    };
    const fetchScores = async () => {
        try {
            setLoading(true);
            const response = await getScoreForCourse(courseId);
            const lessons = response.data.lessons;
            setCourseTitle(response.data.title);

            const transformedData = lessons.flatMap((lesson: any, lessonIndex: number) =>
                lesson.exercises.flatMap((exercise: any, exerciseIndex: number) => {
                    // Generate a unique identifier for each exercise
                    const exerciseId = `${lessonIndex}-${exerciseIndex}-${exercise.title}`;

                    return exercise.member.map((member: any) => ({
                        lessonTitle: lesson.title,
                        lessonIndex: lessonIndex,
                        exerciseTitle: exercise.title,
                        exerciseIndex: exerciseIndex,
                        exerciseId: exercise.exercise_id, // Store unique exercise identifier
                        userId: member.user_id,
                        username: member.username,
                        email: member.email,
                        userAvatar: member.avatar || 'https://i.pinimg.com/474x/0b/10/23/0b10236ae55b58dceaef6a1d392e1d15.jpg',
                        score: member.score,
                        status: member.score !== null ? 'Completed' : 'Not Completed',
                        scoreId: member.scoreId || null, // Add scoreId for API calls
                    }));
                }),
            );

            setData(transformedData);

            // Calculate stats
            const uniqueStudents = new Set(transformedData.map((item: any) => item.userId)).size;
            const completedEntries = transformedData.filter((item: any) => item.status === 'Completed');
            const avgScore = completedEntries.length > 0
                ? completedEntries.reduce((sum: number, item: any) => sum + (item.score || 0), 0) / completedEntries.length
                : 0;

            setStats({
                totalStudents: uniqueStudents,
                averageScore: Math.round(avgScore * 10) / 10,
                completionRate: Math.round((completedEntries.length / transformedData.length ) * 100),
            });

        } catch (err) {
            setError('Failed to fetch scores');
            showToast('error', 'Lỗi', 'Không thể tải dữ liệu điểm số. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    const handleSort = (field: string) => {
        setSortDirection(sortField === field && sortDirection === 'asc' ? 'desc' : 'asc');
        setSortField(field);
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    const handleStatusFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setStatusFilter(e.target.value);
    };

    const clearFilters = () => {
        setSearchTerm('');
        setStatusFilter('all');
        setSortField('lessonTitle');
        setSortDirection('asc');
    };

    // Toggle dropdown menu
    const toggleDropdown = (id: string, event?: React.MouseEvent) => {
        if (event) {
            event.stopPropagation(); // Prevent event bubbling
        }
        setOpenDropdownId(openDropdownId === id ? null : id);
    };

    // Start editing score
    const startEditScore = (userId: string, exerciseId: string, currentScore: number | null, event?: React.MouseEvent) => {
        if (event) {
            event.stopPropagation(); // Prevent event bubbling
        }
        setEditingScore({ userId, exerciseId });
        setEditScoreValue(currentScore !== null ? String(currentScore) : '');
        setOpenDropdownId(null); // Close dropdown after selection
    };

    // Handle edit score input change
    const handleScoreInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditScoreValue(e.target.value);
    };

    // Handle edit score input key down
    const handleScoreInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            saveScore();
        } else if (e.key === 'Escape') {
            cancelEditScore();
        }
    };

    // Cancel editing score
    const cancelEditScore = () => {
        setEditingScore(null);
    };

    // Save edited score
    const saveScore = async () => {
        if (!editingScore) return;

        const score = parseFloat(editScoreValue);
        if (isNaN(score)) {
            showToast('error', 'Lỗi', 'Vui lòng nhập số hợp lệ.');
            return;
        }

        // Find the score entry in the data
        const scoreEntry = data.find(
            item => item.userId === editingScore.userId &&
                item.exerciseId === editingScore.exerciseId
        );

        if (!scoreEntry) return;

        // Check if scoreId is null
        if (!scoreEntry.scoreId) {
            showToast('error', 'Lỗi', 'Không thể cập nhật điểm số nếu học sinh chưa làm');
            setEditingScore(null);
            return;
        }

        try {
            // Update score via API
            await editScore(scoreEntry.scoreId, score);

            // Update UI
            const updatedData = data.map(item => {
                if (
                    item.userId === editingScore.userId &&
                    item.exerciseId === editingScore.exerciseId
                ) {
                    return {
                        ...item,
                        score: score,
                        status: 'Completed'
                    };
                }
                return item;
            });

            setData(updatedData);
            updateStats(updatedData);
            setEditingScore(null);
            showToast('success', 'Thành công', 'Điểm số đã được cập nhật.');
        } catch (error) {
            console.error("Error updating score:", error);
            showToast('error', 'Lỗi', 'Có lỗi khi cập nhật điểm số. Vui lòng thử lại.');
        }
    };

    // Delete score
    const handleDeleteScore = (userId: string, exerciseId: string, event?: React.MouseEvent) => {
        if (event) {
            event.stopPropagation();
        }
        setDeleteConfirm({
            show: true,
            userId,
            exerciseId
        });
        setOpenDropdownId(null);
    };
    // Confirm delete score
    const confirmDeleteScore = async () => {
        if (!deleteConfirm.userId || !deleteConfirm.exerciseId) return;

        // Find the score entry in the data
        const scoreEntry = data.find(
            item => item.userId === deleteConfirm.userId &&
                item.exerciseId === deleteConfirm.exerciseId
        );

        if (!scoreEntry) {
            showToast('error', 'Lỗi', 'Không tìm thấy dữ liệu điểm số.');
            setDeleteConfirm({ show: false, userId: null, exerciseId: null });
            return;
        }

        // Check if scoreId is null
        if (!scoreEntry.scoreId) {
            showToast('error', 'Lỗi', 'Không thể xóa điểm số. Điểm số chưa được tạo hoặc đã bị xóa.');
            setDeleteConfirm({ show: false, userId: null, exerciseId: null });
            return;
        }

        try {
            await deleteScore(scoreEntry.scoreId);

            // Update UI
            const updatedData = data.map(item => {
                if (
                    item.userId === deleteConfirm.userId &&
                    item.exerciseId === deleteConfirm.exerciseId
                ) {
                    return {
                        ...item,
                        score: null,
                        status: 'Not Completed'
                    };
                }
                return item;
            });

            setData(updatedData);
            updateStats(updatedData);
            showToast('success', 'Thành công', 'Điểm số đã được xóa.');
        } catch (error) {
            console.error("Error deleting score:", error);
            showToast('error', 'Lỗi', 'Có lỗi khi xóa điểm số. Vui lòng thử lại.');
        } finally {
            // Close confirmation popup
            setDeleteConfirm({ show: false, userId: null, exerciseId: null });
        }
    };

// Cancel delete
    const cancelDeleteScore = () => {
        setDeleteConfirm({ show: false, userId: null, exerciseId: null });
    };
    // View details
    const viewDetails = (userId: string, userName: string, exerciseId: string, scoreId: any, event?: React.MouseEvent) => {
        if(scoreId === null){
            showToast('info', '', 'Học viên chưa hoàn thành bài tập này.');
            return;
        }
        if (event) {
            event.stopPropagation(); // Prevent event bubbling
        }

        // Find user details from data
        const userEntry = data.find(
            item => item.userId === userId && item.exerciseId === exerciseId
        );

        console.log(`Viewing details for user ${userId} in exercise ${userEntry?.exerciseTitle}`);

        // Open the detail popup instead of showing a toast
        setDetailPopup({
            show: true,
            userId,
            userName,
            exerciseId
        });

        // Close the dropdown menu
        setOpenDropdownId(null);
    };

    // Update stats after data changes
    const updateStats = (updatedData: any[]) => {
        const uniqueStudents = new Set(updatedData.map((item: any) => item.userId)).size;
        const completedEntries = updatedData.filter((item: any) => item.status === 'Completed');
        const avgScore = completedEntries.length > 0
            ? completedEntries.reduce((sum: number, item: any) => sum + (item.score || 0), 0) / completedEntries.length
            : 0;

        setStats({
            totalStudents: uniqueStudents,
            averageScore: Math.round(avgScore * 10) / 10,
            completionRate: Math.round((completedEntries.length / updatedData.length) * 100),
        });
    };
    const getSortIcon = (field: string) => {
        if (sortField !== field) return null;
        return sortDirection === 'asc' ? <span className={styles.sortIcon}>↑</span> : <span className={styles.sortIcon}>↓</span>;
    };

    // phân nhóm dữ liệu theo bài học và bài tập, giữ nguyên thứ tự ban đầu
    const groupedData = useMemo(() => {
        // Lấy thứ tự ban đầu của các bài học
        const lessonOrder = Array.from(new Set(data.map(item => item.lessonTitle)));
        // Tạo một map để lưu thứ tự các bài tập trong mỗi bài học
        const exerciseOrderMap: { [key: string]: string[] } = {};

        lessonOrder.forEach(lessonTitle => {
            const exercisesInLesson = Array.from(
                new Set(
                    data
                        .filter(item => item.lessonTitle === lessonTitle)
                        .map(item => item.exerciseId)
                )
            );
            exerciseOrderMap[lessonTitle] = exercisesInLesson;
        });

        // Tạo cấu trúc phân nhóm giữ nguyên thứ tự ban đầu
        const groupedByLesson: { [key: string]: { [key: string]: any[] } } = {};

        // Khởi tạo cấu trúc rỗng với thứ tự đúng
        lessonOrder.forEach(lessonTitle => {
            groupedByLesson[lessonTitle] = {};
        });

        // Lọc dữ liệu trước khi thêm vào nhóm
        const trimmedSearchTerm = searchTerm.trim().toLowerCase();

        data.forEach(item => {
            const matchesSearch = trimmedSearchTerm === '' || (
                item.lessonTitle.toLowerCase().includes(trimmedSearchTerm) ||
                item.exerciseTitle.toLowerCase().includes(trimmedSearchTerm) ||
                item.username.toLowerCase().includes(trimmedSearchTerm) ||
                (item.email && item.email.toLowerCase().includes(trimmedSearchTerm))
            );

            const matchesStatus =
                statusFilter === 'all' ||
                (statusFilter === 'completed' && item.status === 'Completed') ||
                (statusFilter === 'not-completed' && item.status === 'Not Completed');

            if (matchesSearch && matchesStatus) {
                if (!groupedByLesson[item.lessonTitle]) {
                    groupedByLesson[item.lessonTitle] = {};
                }

                if (!groupedByLesson[item.lessonTitle][item.exerciseId]) {
                    groupedByLesson[item.lessonTitle][item.exerciseId] = [];
                }

                groupedByLesson[item.lessonTitle][item.exerciseId].push(item);
            }
        });

        // Remove empty lessons or exercises
        for (const lessonTitle in groupedByLesson) {
            // Filter out exercises with no matching items
            const exercisesWithItems = Object.keys(groupedByLesson[lessonTitle])
                .filter(exerciseId => groupedByLesson[lessonTitle][exerciseId].length > 0);

            // If no exercises have items, remove the lesson
            if (exercisesWithItems.length === 0) {
                delete groupedByLesson[lessonTitle];
            } else {
                // Keep only exercises with items
                const filteredExercises: { [key: string]: any[] } = {};
                exercisesWithItems.forEach(exerciseId => {
                    filteredExercises[exerciseId] = groupedByLesson[lessonTitle][exerciseId];
                });
                groupedByLesson[lessonTitle] = filteredExercises;
            }
        }

        // Sort dữ liệu trong mỗi nhóm bài tập
        for (const lessonTitle in groupedByLesson) {
            for (const exerciseId in groupedByLesson[lessonTitle]) {
                groupedByLesson[lessonTitle][exerciseId].sort((a, b) => {
                    let valA = a[sortField];
                    let valB = b[sortField];

                    // Handle null scores for sorting
                    if (sortField === 'score') {
                        valA = valA === null ? -1 : valA;
                        valB = valB === null ? -1 : valB;
                    }

                    if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
                    if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
                    return 0;
                });
            }
        }

        return groupedByLesson;
    }, [data, searchTerm, sortField, sortDirection, statusFilter]);
    const hasFilteredData = useMemo(() => {
        return Object.keys(groupedData).some(lessonTitle =>
            Object.keys(groupedData[lessonTitle]).some(exerciseId =>
                groupedData[lessonTitle][exerciseId].length > 0
            )
        );
    }, [groupedData]);

    const hasFilters = searchTerm.trim() !== '' || statusFilter !== 'all' || sortField !== 'lessonTitle' || sortDirection !== 'asc';

    if (loading)
    return (
        <div className={"loadingContainer"} style={{ justifyContent: "flex-start" }}>
            <div className={"loadingSpinner"}>
                <GraduationCap size={32} className={"loadingIcon"} />
            </div>
            <p>Đang tải...</p>
        </div>
    );

    if (error) return (
        <div className={styles.errorContainer}>
            <p>{error}</p>
            <button className={styles.retryButton} onClick={() => fetchScores()}>
                <RotateCcw size={16} />
                Thử lại
            </button>
        </div>
    );

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2>Quản lý điểm số: {courseTitle}</h2>
                <div className={styles.statCards}>
                    <div className={styles.statCard}>
                        <span className={styles.statValue}>{stats.totalStudents}</span>
                        <span className={styles.statLabel}>Học viên</span>
                    </div>
                    <div className={styles.statCard}>
                        <span className={styles.statValue}>{stats.averageScore}</span>
                        <span className={styles.statLabel}>Điểm trung bình</span>
                    </div>
                    <div className={styles.statCard}>
                        <span className={styles.statValue}>{stats.completionRate ? stats.completionRate : 100}%</span>
                        <span className={styles.statLabel}>Tỷ lệ hoàn thành</span>
                    </div>
                </div>
            </div>

            <div className={styles.controls}>
                <div className={styles.searchBox}>
                    <Search size={20} className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo bài học, bài tập hoặc tên học viên..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className={styles.searchInput}
                    />
                    {searchTerm && (
                        <button
                            className={styles.clearSearchButton}
                            onClick={() => setSearchTerm('')}
                            title="Xóa tìm kiếm"
                        >
                            <X size={18} />
                        </button>
                    )}
                </div>

                <div className={styles.filterBox}>
                    <select
                        value={statusFilter}
                        onChange={handleStatusFilter}
                        className={styles.filterSelect}
                    >
                        <option value="all">Tất cả</option>
                        <option value="completed">Đã hoàn thành</option>
                        <option value="not-completed">Chưa hoàn thành</option>
                    </select>
                </div>

                {hasFilters && (
                    <button
                        className={styles.clearFilterButton}
                        onClick={clearFilters}
                        title="Xóa tất cả bộ lọc"
                    >
                        <Filter size={20} />
                        <span>Xóa bộ lọc</span>
                    </button>
                )}
            </div>

            {!hasFilteredData ? (
                <div className={styles.noResults}>
                    <p>Không tìm thấy kết quả phù hợp.</p>
                </div>
            ) : (
                <div className={styles.tableWrapper}>
                    {Object.keys(groupedData).map(lessonTitle => (
                        <div key={lessonTitle} className={styles.lessonSection}>
                            <div className={styles.lessonHeader}>
                                <h3>{lessonTitle}</h3>
                            </div>

                            {Object.keys(groupedData[lessonTitle]).map(exerciseId => {
                                // Get the first item to extract exercise title
                                const firstItem = groupedData[lessonTitle][exerciseId][0];
                                const exerciseTitle = firstItem.exerciseTitle;

                                return (
                                    <div key={exerciseId} className={styles.exerciseSection}>
                                        <div className={styles.exerciseHeader}>
                                            <h4>{exerciseTitle}</h4>
                                        </div>

                                        <table className={styles.table}>
                                            <thead>
                                            <tr>
                                                <th className={styles.userColumn} onClick={() => handleSort('username')}>
                                                    <div className={styles.sortableHeader}>
                                                        Học viên {getSortIcon('username')}
                                                    </div>
                                                </th>
                                                <th className={styles.emailColumn} onClick={() => handleSort('email')}>
                                                    <div className={styles.sortableHeader}>
                                                        Email {getSortIcon('email')}
                                                    </div>
                                                </th>
                                                <th className={styles.scoreColumn} onClick={() => handleSort('score')}>
                                                    <div className={styles.sortableHeader}>
                                                        Điểm số {getSortIcon('score')}
                                                    </div>
                                                </th>
                                                <th className={styles.statusColumn} onClick={() => handleSort('status')}>
                                                    <div className={styles.sortableHeader}>
                                                        Trạng thái {getSortIcon('status')}
                                                    </div>
                                                </th>
                                                <th className={styles.actionColumn}>
                                                    <div className={styles.sortableHeader}>
                                                        Thao tác
                                                    </div>
                                                </th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {groupedData[lessonTitle][exerciseId].map((row, index) => {
                                                const rowId = `${row.userId}-${row.exerciseId}`;
                                                const isEditing = editingScore &&
                                                    editingScore.userId === row.userId &&
                                                    editingScore.exerciseId === row.exerciseId;

                                                return (
                                                    <tr key={index} className={row.status === 'Not Completed' ? styles.notCompleted : ''}>
                                                        <td>
                                                            <div className={styles.userCell}>
                                                                <img
                                                                    src={row.userAvatar}
                                                                    alt={row.username}
                                                                    className={styles.avatar}
                                                                />
                                                                <span>{row.username}</span>
                                                            </div>
                                                        </td>
                                                        <td>{row.email || '—'}</td>
                                                        <td className={styles.scoreValue}>
                                                            {isEditing ? (
                                                                <input
                                                                    type="text"
                                                                    value={editScoreValue}
                                                                    onChange={handleScoreInputChange}
                                                                    onKeyDown={handleScoreInputKeyDown}
                                                                    onBlur={saveScore}
                                                                    autoFocus
                                                                    className={styles.scoreInput}
                                                                />
                                                            ) : (
                                                                row.score !== null ? row.score : '—'
                                                            )}
                                                        </td>
                                                        <td>
                                                            <span className={`${styles.statusBadge} ${row.status === 'Completed' ? styles.completed : styles.notCompleted}`}>
                                                                {row.status === 'Completed' ? 'Đã hoàn thành' : 'Chưa hoàn thành'}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <div className={styles.actionCell}>
                                                                <div
                                                                    className={styles.dropdownContainer}
                                                                    ref={node => dropdownRefs.current[rowId] = node}
                                                                >
                                                                    <button
                                                                        className={styles.actionButton}
                                                                        onClick={(e) => toggleDropdown(rowId, e)}
                                                                    >
                                                                        <MoreVertical size={18} />
                                                                    </button>

                                                                    {openDropdownId === rowId && (
                                                                        <div className={styles.dropdownMenu}>
                                                                            <button
                                                                                className={styles.dropdownItem}
                                                                                onClick={(e) => startEditScore(row.userId, row.exerciseId, row.score, e)}
                                                                            >
                                                                                <Edit size={16} />
                                                                                Sửa điểm
                                                                            </button>
                                                                            <button
                                                                                className={styles.dropdownItem}
                                                                                onClick={(e) => handleDeleteScore(row.userId, row.exerciseId, e)}
                                                                            >
                                                                                <Trash2 size={16} />
                                                                                Xóa điểm
                                                                            </button>
                                                                            <button
                                                                                className={styles.dropdownItem}
                                                                                onClick={(e) => viewDetails(row.userId, row.username, row.exerciseId, row.scoreId, e)}
                                                                            >
                                                                                <Eye size={16} />
                                                                                Xem chi tiết
                                                                            </button>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                            </tbody>
                                        </table>
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            )}
            {/* Add the detail popup component */}
            {detailPopup.show && detailPopup.userId && detailPopup.exerciseId && (
                <ExerciseDetail
                    userId={detailPopup.userId}
                    userName={detailPopup.userName || ''}
                    exerciseId={detailPopup.exerciseId}
                    onClose={closeDetailPopup}
                />
            )}
            {/* Delete confirmation popup */}
            {deleteConfirm.show && (
                <div className={styles.modalOverlay}>
                    <div className={styles.confirmDialog}>
                        <div className={styles.confirmHeader}>
                            <h3>Xác nhận xóa</h3>
                        </div>
                        <div className={styles.confirmBody}>
                            <p>Bạn có chắc muốn xóa điểm số này không?</p>
                            <p>Hành động này không thể hoàn tác.</p>
                        </div>
                        <div className={styles.confirmFooter}>
                            <button
                                className={styles.cancelButton}
                                onClick={cancelDeleteScore}
                            >
                                Hủy
                            </button>
                            <button
                                className={styles.deleteButton}
                                onClick={confirmDeleteScore}
                            >
                                Xóa
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {toast.show && (
                <Toast toast={toast} onClose={hideToast} type={''} />
            )}
        </div>

    );
};

export default CourseScore;
