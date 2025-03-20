import React, { useState, useEffect } from 'react';
import styles from './CourseStudents.module.css';
import { FaPlus, FaTrash, FaSearch, FaSort, FaFilter, FaEllipsisV, FaUserGraduate } from 'react-icons/fa';
import { Student } from '../../../../model/classroom.ts'
import { getStudentsByCourseId } from '../../../../services/lesson.ts'

interface CourseStudentsProps {
    courseId: string;
    getStudentsByCourseId: (courseId: string) => Promise<Student[]>;
}

// ConfirmDialog component
interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ isOpen, title, message, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h3 className={styles.modalTitle}>{title}</h3>
                <p className={styles.modalMessage}>{message}</p>
                <div className={styles.modalActions}>
                    <button onClick={onCancel} className={styles.cancelButton}>Hủy</button>
                    <button onClick={onConfirm} className={styles.confirmButton}>Xác nhận</button>
                </div>
            </div>
        </div>
    );
};

// StudentAddModal component
interface StudentAddModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (student: Partial<Student>) => void;
}

const StudentAddModal: React.FC<StudentAddModalProps> = ({ isOpen, onClose, onAdd }) => {
    const [studentData, setStudentData] = useState({
        name: '',
        email: '',
        studentId: ''
    });

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAdd(studentData);
        setStudentData({ name: '', email: '', studentId: '' });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setStudentData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h3 className={styles.modalTitle}>Thêm học sinh vào lớp</h3>
                    <button className={styles.closeButton} onClick={onClose}>×</button>
                </div>
                <form onSubmit={handleSubmit} className={styles.addForm}>
                    <div className={styles.formGroup}>
                        <label htmlFor="name" className={styles.formLabel}>Họ và tên</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={studentData.name}
                            onChange={handleChange}
                            className={styles.formInput}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="email" className={styles.formLabel}>Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={studentData.email}
                            onChange={handleChange}
                            className={styles.formInput}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="studentId" className={styles.formLabel}>Mã học sinh</label>
                        <input
                            type="text"
                            id="studentId"
                            name="studentId"
                            value={studentData.studentId}
                            onChange={handleChange}
                            className={styles.formInput}
                            required
                        />
                    </div>
                    <div className={styles.formActions}>
                        <button type="button" onClick={onClose} className={styles.cancelButton}>Hủy</button>
                        <button type="submit" className={styles.submitButton}>Thêm học sinh</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Main CourseStudents component
const CourseStudents: React.FC<CourseStudentsProps> = ({ courseId }) => {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState<boolean>(false);
    const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
    const [sortField, setSortField] = useState<string>('name');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [expandedStudent, setExpandedStudent] = useState<string | null>(null);

    const toggleStudentDetails = (studentId: string) => {
        setExpandedStudent(expandedStudent === studentId ? null : studentId);
    };


    // Fetch students data
    useEffect(() => {
        const loadStudents = async () => {
            try {
                setLoading(true);
                const data = await getStudentsByCourseId(courseId);
                setStudents(data);
                setError(null);
            } catch (err) {
                setError('Không thể tải danh sách học sinh. Vui lòng thử lại sau!');
                console.error('Error fetching students:', err);
            } finally {
                setLoading(false);
            }
        };

        loadStudents();
    }, [courseId, getStudentsByCourseId]);

    // Handle adding a new student
    const handleAddStudent = (studentData: Partial<Student>) => {
        // In a real app, you would call an API to add the student
        const newStudent: Student = {
            _id: `s${Date.now()}`,
            username: studentData.name || '',
            email: studentData.email || '',
            studentId: studentData.studentId || '',
            avatar: `/images/avatars/student-${Math.floor(Math.random() * 10) + 1}.jpg`,
            enrollmentDate: new Date().toISOString(),
            courses: [courseId],
            progress: [{
                courseId: courseId,
                completedLessons: [],
                completionPercentage: 0,
                lastAccessDate: new Date().toISOString()
            }],
            grades: [],
            attendance: [],
            rank: students.length + 1,
            averageScore: 0
        };

        setStudents(prev => [...prev, newStudent]);
        setIsAddModalOpen(false);
    };

    // Handle removing a student
    const handleRemoveStudent = (studentId: string) => {
        setSelectedStudentId(studentId);
        setIsConfirmDialogOpen(true);
    };

    const confirmRemoveStudent = () => {
        if (selectedStudentId) {
            setStudents(prev => prev.filter(student => student._id !== selectedStudentId));
            setIsConfirmDialogOpen(false);
            setSelectedStudentId(null);
        }
    };

    // Handle search
    const filteredStudents = Array.isArray(students)
        ? students.filter(student => {
            const name = student.name?.toLowerCase() || '';
            const studentId = student.studentId?.toLowerCase() || '';
            const email = student.email?.toLowerCase() || '';
            const query = searchQuery?.toLowerCase() || '';

            return name.includes(query) || studentId.includes(query) || email.includes(query);
        })
        : [];

    // Handle sorting
    const sortedStudents = [...filteredStudents].sort((a, b) => {
        let comparison = 0;

        if (sortField === 'name') {
            comparison = a.name.localeCompare(b.name);
        } else if (sortField === 'studentId') {
            comparison = a.studentId.localeCompare(b.studentId);
        } else if (sortField === 'completionPercentage') {
            const aProgress = a.progress.find(p => p.courseId === courseId)?.completionPercentage || 0;
            const bProgress = b.progress.find(p => p.courseId === courseId)?.completionPercentage || 0;
            comparison = aProgress - bProgress;
        } else if (sortField === 'averageScore') {
            const aScore = a.averageScore || 0;
            const bScore = b.averageScore || 0;
            comparison = aScore - bScore;
        } else if (sortField === 'lastAccess') {
            const aDate = new Date(a.progress.find(p => p.courseId === courseId)?.lastAccessDate || 0).getTime();
            const bDate = new Date(b.progress.find(p => p.courseId === courseId)?.lastAccessDate || 0).getTime();
            comparison = aDate - bDate;
        }

        return sortDirection === 'asc' ? comparison : -comparison;
    });

    // Handle sort toggle
    const handleSort = (field: string) => {
        if (sortField === field) {
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    // Get student progress for the current course
    const getStudentProgress = (student: Student) => {
        return student.progress.find(p => p.courseId === courseId)?.completionPercentage || 0;
    };

    // Calculate average score for the current course
    const getStudentAverageScore = (student: Student) => {
        const courseGrades = student.grades.filter(g => g.courseId === courseId);
        if (courseGrades.length === 0) return 0;

        const sum = courseGrades.reduce((acc, grade) => acc + (grade.score / grade.maxScore) * 10, 0);
        return Number((sum / courseGrades.length).toFixed(1));
    };

    // Get last access date
    const getLastAccessDate = (student: Student) => {
        const lastAccess = student.progress.find(p => p.courseId === courseId)?.lastAccessDate;
        if (!lastAccess) return 'Chưa truy cập';

        return new Date(lastAccess).toLocaleDateString('vi-VN');
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
                <p>Đang tải danh sách học sinh...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.errorContainer}>
                <p className={styles.errorMessage}>{error}</p>
                <button
                    className={styles.retryButton}
                    onClick={() => getStudentsByCourseId(courseId)}
                >
                    Thử lại
                </button>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.title}>
                    Quản lý học sinh{' '}
                    <span className={styles.studentCount}>
                        ({students.length})
                    </span>
                </h2>
                <div className={styles.actions}>
                    <div className={styles.searchContainer}>
                        <input
                            type="text"
                            placeholder="Tìm kiếm học sinh..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={styles.searchInput}
                        />
                        <FaSearch className={styles.searchIcon} />
                    </div>
                    <button
                        className={styles.addButton}
                        onClick={() => setIsAddModalOpen(true)}
                    >
                        <FaPlus className={styles.buttonIcon} />
                        Thêm học sinh
                    </button>
                </div>
            </div>

            {students.length === 0 ? (
                <div className={styles.emptyState}>
                    <FaUserGraduate className={styles.emptyStateIcon} />
                    <h3>Không có học sinh trong lớp này</h3>
                    <p>
                        Nhấn "Thêm học sinh" để bắt đầu quản lý lớp học của bạn
                    </p>
                    <button
                        className={styles.addButton}
                        onClick={() => setIsAddModalOpen(true)}
                    >
                        <FaPlus className={styles.buttonIcon} />
                        Thêm học sinh
                    </button>
                </div>
            ) : (
                <>
                    <div className={styles.studentTable}>
                        <div className={styles.tableHeader}>
                            <div
                                className={styles.headerCell}
                                onClick={() => handleSort('name')}
                            >
                                Học sinh
                                {sortField === 'name' && (
                                    <FaSort
                                        className={`${styles.sortIcon} ${sortDirection === 'desc' ? styles.sortDesc : ''}`}
                                    />
                                )}
                            </div>
                            <div
                                className={styles.headerCell}
                                onClick={() => handleSort('studentId')}
                            >
                                Mã học sinh
                                {sortField === 'studentId' && (
                                    <FaSort
                                        className={`${styles.sortIcon} ${sortDirection === 'desc' ? styles.sortDesc : ''}`}
                                    />
                                )}
                            </div>
                            <div
                                className={`${styles.headerCell} ${styles.headerCellCenter}`}
                                onClick={() =>
                                    handleSort('completionPercentage')
                                }
                            >
                                Tiến độ
                                {sortField === 'completionPercentage' && (
                                    <FaSort
                                        className={`${styles.sortIcon} ${sortDirection === 'desc' ? styles.sortDesc : ''}`}
                                    />
                                )}
                            </div>
                            <div
                                className={`${styles.headerCell} ${styles.headerCellCenter}`}
                                onClick={() => handleSort('averageScore')}
                            >
                                Điểm TB
                                {sortField === 'averageScore' && (
                                    <FaSort
                                        className={`${styles.sortIcon} ${sortDirection === 'desc' ? styles.sortDesc : ''}`}
                                    />
                                )}
                            </div>
                            <div
                                className={styles.headerCell}
                                onClick={() => handleSort('lastAccess')}
                            >
                                Truy cập gần nhất
                                {sortField === 'lastAccess' && (
                                    <FaSort
                                        className={`${styles.sortIcon} ${sortDirection === 'desc' ? styles.sortDesc : ''}`}
                                    />
                                )}
                            </div>
                            <div className={styles.headerCell}>Thao tác</div>
                        </div>
                        <div className={styles.tableBody}>
                            {sortedStudents.map((student) => (
                                <div
                                    key={student._id}
                                    className={styles.tableRow}
                                    onClick={() => {
                                        if (window.innerWidth <= 768) {
                                            toggleStudentDetails(student._id)
                                        }
                                    }}
                                >
                                    <div className={styles.studentCell}>
                                        <div className={styles.avatarContainer}>
                                            {student.avatar ? (
                                                <img
                                                    src={student.avatar}
                                                    alt={student.name}
                                                    className={styles.avatar}
                                                />
                                            ) : (
                                                <div
                                                    className={
                                                        styles.avatarPlaceholder
                                                    }
                                                >
                                                    {student.name.charAt(0)}
                                                </div>
                                            )}
                                        </div>
                                        <div className={styles.studentInfo}>
                                            <div className={styles.studentName}>
                                                {student.name}
                                            </div>
                                            <div
                                                className={styles.studentEmail}
                                            >
                                                {student.email}
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles.cell}>
                                        {student.studentId}
                                    </div>
                                    <div className={styles.cell}>
                                        <div
                                            className={styles.progressContainer}
                                        >
                                            <div
                                                className={styles.progressBar}
                                                style={{
                                                    width: `${getStudentProgress(student)}%`,
                                                }}
                                            ></div>
                                            <span
                                                className={styles.progressText}
                                            >
                                                {getStudentProgress(student)}%
                                            </span>
                                        </div>
                                    </div>
                                    <div
                                        className={`${styles.cell} ${styles.score}`}
                                    >
                                        <span
                                            className={`${styles.scoreLabel} ${getStudentAverageScore(student) >= 8 ? styles.highScore : getStudentAverageScore(student) >= 6.5 ? styles.mediumScore : styles.lowScore}`}
                                        >
                                            {getStudentAverageScore(student)}
                                        </span>
                                    </div>
                                    <div className={styles.cell}>
                                        {getLastAccessDate(student)}
                                    </div>
                                    <div className={styles.actionsCell}>
                                        <button
                                            className={styles.viewButton}
                                            onClick={() =>
                                                setSelectedStudent(student)
                                            }
                                        >
                                            Xem chi tiết
                                        </button>
                                        <button
                                            className={styles.removeButton}
                                            onClick={() =>
                                                handleRemoveStudent(student._id)
                                            }
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                    {expandedStudent === student._id && (
                                        <div className={styles.expandedDetails}>
                                            <div className={styles.cell}>
                                                <strong>Email:</strong>{' '}
                                                {student.email}
                                            </div>
                                            <div className={styles.cell}>
                                                <strong>Mã học sinh:</strong>{' '}
                                                {student.studentId}
                                            </div>
                                            <div className={styles.cell}>
                                                <strong>Tiến độ:</strong>{' '}
                                                {getStudentProgress(student)}%
                                            </div>
                                            <div className={styles.cell}>
                                                <strong>Điểm TB:</strong>{' '}
                                                {getStudentAverageScore(
                                                    student
                                                )}
                                            </div>
                                            <div className={styles.cell}>
                                                <strong>
                                                    Truy cập gần nhất:
                                                </strong>{' '}
                                                {getLastAccessDate(student)}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={styles.pagination}>
                        <div className={styles.paginationInfo}>
                            Hiển thị 1-{Math.min(sortedStudents.length, 10)} của{' '}
                            {sortedStudents.length} học sinh
                        </div>
                        <div className={styles.paginationControls}>
                            <button
                                className={styles.paginationButton}
                                disabled
                            >
                                Trước
                            </button>
                            <button
                                className={`${styles.paginationButton} ${styles.activePage}`}
                            >
                                1
                            </button>
                            <button
                                className={styles.paginationButton}
                                disabled
                            >
                                Sau
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* Add Student Modal */}
            <StudentAddModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={handleAddStudent}
            />

            {/* Confirm Dialog */}
            <ConfirmDialog
                isOpen={isConfirmDialogOpen}
                title="Xóa học sinh"
                message="Bạn có chắc chắn muốn xóa học sinh này khỏi lớp học? Hành động này không thể hoàn tác."
                onConfirm={confirmRemoveStudent}
                onCancel={() => setIsConfirmDialogOpen(false)}
            />

            {/* Student Detail Modal (can be implemented as needed) */}
            {selectedStudent && (
                <div className={styles.modalOverlay}>
                    <div
                        className={`${styles.modalContent} ${styles.detailModal}`}
                    >
                        <div className={styles.modalHeader}>
                            <h3 className={styles.modalTitle}>
                                Thông tin chi tiết học sinh
                            </h3>
                            <button
                                className={styles.closeButton}
                                onClick={() => setSelectedStudent(null)}
                            >
                                ×
                            </button>
                        </div>
                        <div className={styles.studentDetailContent}>
                            <div className={styles.studentDetailHeader}>
                                <div className={styles.detailAvatarContainer}>
                                    {selectedStudent.avatar ? (
                                        <img
                                            src={selectedStudent.avatar}
                                            alt={selectedStudent.name}
                                            className={styles.detailAvatar}
                                        />
                                    ) : (
                                        <div
                                            className={
                                                styles.detailAvatarPlaceholder
                                            }
                                        >
                                            {selectedStudent.name.charAt(0)}
                                        </div>
                                    )}
                                </div>
                                <div className={styles.studentDetailInfo}>
                                    <h2 className={styles.detailName}>
                                        {selectedStudent.name}
                                    </h2>
                                    <div className={styles.detailMeta}>
                                        <p className={styles.detailId}>
                                            Mã học sinh:{' '}
                                            {selectedStudent.studentId}
                                        </p>
                                        <p className={styles.detailEmail}>
                                            {selectedStudent.email}
                                        </p>
                                        <p className={styles.detailEnrollment}>
                                            Ngày tham gia:{' '}
                                            {new Date(
                                                selectedStudent.enrollmentDate
                                            ).toLocaleDateString('vi-VN')}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.detailTabs}>
                                <button
                                    className={`${styles.detailTabButton} ${styles.activeTab}`}
                                >
                                    Tổng quan
                                </button>
                                <button className={styles.detailTabButton}>
                                    Điểm số
                                </button>
                                <button className={styles.detailTabButton}>
                                    Điểm danh
                                </button>
                            </div>

                            <div className={styles.detailSection}>
                                <h3 className={styles.detailSectionTitle}>
                                    Tiến độ học tập
                                </h3>
                                <div className={styles.detailProgressContainer}>
                                    <div className={styles.detailProgressOuter}>
                                        <div
                                            className={
                                                styles.detailProgressInner
                                            }
                                            style={{
                                                width: `${getStudentProgress(selectedStudent)}%`,
                                            }}
                                        ></div>
                                    </div>
                                    <span
                                        className={styles.detailProgressLabel}
                                    >
                                        {getStudentProgress(selectedStudent)}%
                                        hoàn thành
                                    </span>
                                </div>

                                <div className={styles.detailStatsGrid}>
                                    <div className={styles.detailStatCard}>
                                        <div className={styles.detailStatValue}>
                                            {
                                                selectedStudent.grades.filter(
                                                    (g) =>
                                                        g.courseId === courseId
                                                ).length
                                            }
                                        </div>
                                        <div className={styles.detailStatLabel}>
                                            Bài kiểm tra đã làm
                                        </div>
                                    </div>
                                    <div className={styles.detailStatCard}>
                                        <div className={styles.detailStatValue}>
                                            {getStudentAverageScore(
                                                selectedStudent
                                            )}
                                        </div>
                                        <div className={styles.detailStatLabel}>
                                            Điểm trung bình
                                        </div>
                                    </div>
                                    <div className={styles.detailStatCard}>
                                        <div className={styles.detailStatValue}>
                                            {
                                                selectedStudent.attendance.filter(
                                                    (a) =>
                                                        a.status === 'present'
                                                ).length
                                            }
                                        </div>
                                        <div className={styles.detailStatLabel}>
                                            Buổi học tham gia
                                        </div>
                                    </div>
                                    <div className={styles.detailStatCard}>
                                        <div className={styles.detailStatValue}>
                                            {
                                                selectedStudent.attendance.filter(
                                                    (a) => a.status === 'absent'
                                                ).length
                                            }
                                        </div>
                                        <div className={styles.detailStatLabel}>
                                            Buổi học vắng mặt
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={styles.modalActions}>
                            <button
                                className={styles.cancelButton}
                                onClick={() => setSelectedStudent(null)}
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
};

export default CourseStudents;