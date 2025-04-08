import React, { useState, useEffect } from 'react';
import styles from './CourseStudents.module.css';
import { User } from '../../../../model/model.ts';
import { addStudent, getStudentByCourseId } from '../../../../services/course.ts';
import { findUser, getUserById } from '../../../../services/user.ts'
import EmptyStateNotification from '../common/EmptyStateNotification/EmptyStateNotification.tsx';
interface CourseStudentsProps {
    courseId: string;
}

const CourseStudents: React.FC<CourseStudentsProps> = ({ courseId }) => {
    const [students, setStudents] = useState<User[]>([]);
    const [filteredStudents, setFilteredStudents] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchId, setSearchId] = useState<string>('');
    const [searchResult, setSearchResult] = useState<User[]>([]);
    const [pendingStudents, setPendingStudents] = useState<User[]>([]);
    const [addingStudents, setAddingStudents] = useState<boolean>(false);
    const [searching, setSearching] = useState<boolean>(false);
    const [studentFilter, setStudentFilter] = useState<string>('');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
    const [studentManagement, setStudentManagement] = useState<{
        open: boolean;
        student: User | null;
    }>({
        open: false,
        student: null,
    });

    useEffect(() => {
        fetchStudents();
    }, [courseId]);

    // Thêm vào useEffect
    useEffect(() => {
        return () => {
            // Cleanup
            if (searchTimeout) {
                clearTimeout(searchTimeout);
            }
        };
    }, [searchTimeout]);

    useEffect(() => {
        // Filter and sort students when the filter text changes or when the student list changes
        const filtered = students.filter(student =>
            student.username?.toLowerCase().includes(studentFilter.toLowerCase()) ||
            student.email?.toLowerCase().includes(studentFilter.toLowerCase()) ||
            student.username?.toLowerCase().includes(studentFilter.toLowerCase())
        );

        // Sort students by name
        const sorted = [...filtered].sort((a, b) => {
            const nameA = a.username?.toLowerCase() || '';
            const nameB = b.username?.toLowerCase() || '';

            if (sortOrder === 'asc') {
                return nameA.localeCompare(nameB);
            } else {
                return nameB.localeCompare(nameA);
            }
        });

        setFilteredStudents(sorted);
    }, [studentFilter, students, sortOrder]);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const data = await getStudentByCourseId(courseId);
            const listStudent = data.data;
            const studentsList = Array.isArray(listStudent) ? listStudent : [];
            setStudents(studentsList);
            setFilteredStudents(studentsList);
            setError(null);
        } catch (err) {
            console.error('Error fetching students:', err);
            setError('Không thể tải danh sách học sinh');
            setStudents([]);
            setFilteredStudents([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (searchValue: string = searchId) => {
        if (!searchValue.trim()) {
            setError('Vui lòng nhập tên/mã học sinh');
            return;
        }

        try {
            setSearching(true);
            const data = await findUser(searchValue);
            const users = data.data;

            // Lọc chỉ giữ lại những người dùng có role "user"
            const studentUsers = Array.isArray(users)
                ? users.filter(user => user.role === 'user')
                : [];

            if (studentUsers.length > 0) {
                setSearchResult(studentUsers);
                setError(null);
            } else {
                setError('Không tìm thấy học sinh phù hợp');
                setSearchResult([]);
            }
        } catch (err) {
            console.error('Error searching for users:', err);
            setError('Không tìm thấy học sinh với thông tin đã nhập');
            setSearchResult([]);
        } finally {
            setSearching(false);
        }
    };
    const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchId(value);

        // Xóa timeout cũ nếu có
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }

        // Nếu input trống, reset kết quả tìm kiếm
        if (!value.trim()) {
            setSearchResult([]);
            setError(null);
            return;
        }

        // Thiết lập timeout mới (debounce 1 giây)
        const newTimeout = setTimeout(() => {
            handleSearch(value);
        }, 1000);

        setSearchTimeout(newTimeout);
    };
    const addToPending = (student: User) => {
        // Check if student is already in the course
        if (students.some((s) => s._id === student._id)) {
            setError('Học sinh này đã có trong lớp học');
            return;
        }

        // Check if student is already in pending list
        if (pendingStudents.some((s) => s._id === student._id)) {
            setError('Học sinh này đã có trong danh sách chờ');
            return;
        }

        setPendingStudents([...pendingStudents, student]);
        setError(null);
    };

    const removePending = (id: string) => {
        setPendingStudents(pendingStudents.filter((student) => student._id !== id));
    };

    const handleAddStudents = async () => {
        if (pendingStudents.length === 0) {
            setError('Không có học sinh nào trong danh sách chờ');
            return;
        }

        setAddingStudents(true);

        try {
            // Add students one by one
            for (const student of pendingStudents) {
                await addStudent({
                    courseId: courseId,
                    studentId: student._id,
                });
            }

            // Clear pending list and refresh student list
            setPendingStudents([]);
            await fetchStudents();
            setError(null);
        } catch (err) {
            console.error('Error adding students:', err);
            setError('Có lỗi khi thêm học sinh');
        } finally {
            setAddingStudents(false);
        }
    };

    const openStudentManagement = (student: User) => {
        setStudentManagement({
            open: true,
            student,
        });
    };

    const closeStudentManagement = () => {
        setStudentManagement({
            open: false,
            student: null,
        });
    };

    const handleRemoveStudent = async (studentId: string) => {
        try {
            // Implement remove student API call here
            // For now, just simulating removal from the local state
            setStudents(students.filter((student) => student._id !== studentId));
            closeStudentManagement();
        } catch (err) {
            console.error('Error removing student:', err);
            setError('Có lỗi khi xóa học sinh');
        }
    };

    const toggleSortOrder = () => {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    if (loading && students.length === 0) {
        return <div className={styles.loading}>Đang tải...</div>;
    }

    return (
        <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Quản lý học sinh</h2>

            {/* Search for new students */}
            <div className={styles.searchSection}>
                <h3>Thêm học sinh mới</h3>
                <div className={styles.searchForm}>
                    <input
                        type="text"
                        placeholder="Nhập ID học sinh"
                        value={searchId}
                        onChange={handleSearchInputChange}
                        className={styles.searchInput}
                    />
                    <button
                        onClick={() => handleSearch()}
                        className={styles.searchButton}
                        disabled={searching}
                    >
                        {searching ? 'Đang tìm...' : 'Tìm kiếm'}
                    </button>
                </div>

                <div className={styles.errorContainer}>
                    {error && <div className={styles.error}>{error}</div>}
                </div>

                {/* Search Result */}
                <div className={styles.searchResultContainer}>
                    {searchResult.length > 0 && (
                        <div className={styles.searchResult}>
                            <div className={styles.studentCardHeader}>
                                <h4>
                                    Kết quả tìm kiếm ({searchResult.length})
                                </h4>
                            </div>
                            {searchResult.map((student) => (
                                <div
                                    key={student._id}
                                    className={styles.studentCard}
                                >
                                    <div className={styles.avatarContainer}>
                                        <img
                                            src={
                                                student.avatar.length != 0
                                                    ? student.avatar[0]
                                                    : 'https://i.pinimg.com/474x/0b/10/23/0b10236ae55b58dceaef6a1d392e1d15.jpg'
                                            }
                                            alt={
                                                student.name || student.username
                                            }
                                            className={styles.avatar}
                                        />
                                        <div className={styles.userRole}>
                                            <span>Học sinh</span>
                                        </div>
                                    </div>
                                    <div className={styles.studentInfo}>
                                        <h4>
                                            {student.name || student.username}
                                        </h4>
                                        <div className={styles.infoGrid}>
                                            <div className={styles.infoItem}>
                                                <span
                                                    className={styles.infoLabel}
                                                >
                                                    ID:
                                                </span>
                                                <span
                                                    className={styles.infoValue}
                                                >
                                                    {student._id}
                                                </span>
                                            </div>
                                            <div className={styles.infoItem}>
                                                <span
                                                    className={styles.infoLabel}
                                                >
                                                    Email:
                                                </span>
                                                <span
                                                    className={styles.infoValue}
                                                >
                                                    {student.email}
                                                </span>
                                            </div>
                                            {student.username && (
                                                <div
                                                    className={styles.infoItem}
                                                >
                                                    <span
                                                        className={
                                                            styles.infoLabel
                                                        }
                                                    >
                                                        Tên người dùng:
                                                    </span>
                                                    <span
                                                        className={
                                                            styles.infoValue
                                                        }
                                                    >
                                                        {student.username}
                                                    </span>
                                                </div>
                                            )}
                                            {student.phonenumber && (
                                                <div
                                                    className={styles.infoItem}
                                                >
                                                    <span
                                                        className={
                                                            styles.infoLabel
                                                        }
                                                    >
                                                        Số điện thoại:
                                                    </span>
                                                    <span
                                                        className={
                                                            styles.infoValue
                                                        }
                                                    >
                                                        {student.phonenumber}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className={styles.studentActions}>
                                        <button
                                            onClick={() =>
                                                addToPending(student)
                                            }
                                            className={styles.addButton}
                                        >
                                            <span className={styles.addIcon}>
                                                +
                                            </span>
                                            Thêm vào hàng chờ
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <div className={styles.searchResultActions}>
                                <button
                                    onClick={() => setSearchResult([])}
                                    className={styles.cancelSearchButton}
                                >
                                    Hủy tìm kiếm
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Pending Students */}
                {pendingStudents.length > 0 && (
                    <div className={styles.pendingSection}>
                        <h3>
                            Học sinh đang chờ thêm ({pendingStudents.length})
                        </h3>
                        {pendingStudents.length > 0 ? (
                            <>
                                <div className={styles.pendingList}>
                                    {pendingStudents.map((student) => (
                                        <div
                                            key={student._id}
                                            className={styles.pendingItem}
                                        >
                                            <div className={styles.pendingInfo}>
                                                <img
                                                    src={
                                                        student.avatar.length !=
                                                        0
                                                            ? student.avatar[0]
                                                            : 'https://i.pinimg.com/474x/0b/10/23/0b10236ae55b58dceaef6a1d392e1d15.jpg'
                                                    }
                                                    className={
                                                        styles.smallAvatar
                                                    }
                                                />
                                                <div
                                                    className={
                                                        styles.pendingDetails
                                                    }
                                                >
                                                    <span
                                                        className={
                                                            styles.pendingName
                                                        }
                                                    >
                                                        {student.username ||
                                                            student.username}
                                                    </span>
                                                    <span
                                                        className={
                                                            styles.pendingEmail
                                                        }
                                                    >
                                                        {student.email}
                                                    </span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() =>
                                                    removePending(student._id)
                                                }
                                                className={styles.removeButton}
                                                title="Xóa khỏi danh sách chờ"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    onClick={handleAddStudents}
                                    className={styles.addAllButton}
                                    disabled={addingStudents}
                                >
                                    {addingStudents ? (
                                        <>
                                            <span
                                                className={styles.loadingIcon}
                                            >
                                                ●
                                            </span>
                                            Đang thêm...
                                        </>
                                    ) : (
                                        <>
                                            <span className={styles.plusIcon}>
                                                +
                                            </span>
                                            Thêm tất cả học sinh vào lớp
                                        </>
                                    )}
                                </button>
                            </>
                        ) : (
                            <div className={styles.emptyPending}>
                                <p>Chưa có học sinh nào trong hàng chờ.</p>
                                <p className={styles.emptyPendingSubtext}>
                                    Tìm kiếm và thêm học sinh vào hàng chờ để
                                    đưa vào lớp học.
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Current Students List with Search and Filter */}
            <div className={styles.studentsList}>
                <div className={styles.studentsListHeader}>
                    <h3>Danh sách học sinh ({students.length})</h3>
                    <div className={styles.filterControls}>
                        <div className={styles.searchFilter}>
                            <input
                                type="text"
                                placeholder="Tìm kiếm học sinh..."
                                value={studentFilter}
                                onChange={(e) =>
                                    setStudentFilter(e.target.value)
                                }
                                className={styles.filterInput}
                            />
                        </div>
                        <button
                            className={styles.sortButton}
                            onClick={toggleSortOrder}
                            title={
                                sortOrder === 'asc'
                                    ? 'Sắp xếp A-Z'
                                    : 'Sắp xếp Z-A'
                            }
                        >
                            {sortOrder === 'asc' ? 'A-Z ↓' : 'Z-A ↑'}
                        </button>
                    </div>
                </div>

                {students.length === 0 ? (
                    <EmptyStateNotification
                        title="Chưa có học sinh nào"
                        message="Khóa học này chưa có học sinh nào. Hãy tìm kiếm và thêm học sinh vào khóa học."
                        image="https://i.pinimg.com/originals/9f/7c/90/9f7c9024044595556cf3025fa510e369.gif"
                    />
                ) : filteredStudents.length === 0 ? (
                    <div className={styles.noResults}>
                        <p>
                            Không tìm thấy học sinh phù hợp với tìm kiếm của bạn
                        </p>
                    </div>
                ) : (
                    <div className={styles.studentsTable}>
                        <table>
                            <thead>
                                <tr>
                                    <th>Họ tên học sinh</th>
                                    <th>Email</th>
                                    <th>Số điện thoại</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStudents.map((student) => (
                                    <tr key={student._id}>
                                        <td className={styles.studentCell}>
                                            <img
                                                src={
                                                    student.avatar.length != 0
                                                        ? student.avatar[0]
                                                        : 'https://i.pinimg.com/474x/0b/10/23/0b10236ae55b58dceaef6a1d392e1d15.jpg'
                                                }
                                                alt={student.Tên}
                                                className={styles.tableAvatar}
                                            />
                                            <span>{student.username}</span>
                                        </td>
                                        <td>{student.email}</td>
                                        <td>{student.phonenumber || 'N/A'}</td>
                                        <td>
                                            <button
                                                onClick={() =>
                                                    openStudentManagement(
                                                        student
                                                    )
                                                }
                                                className={
                                                    styles.tableActionButton
                                                }
                                            >
                                                Chi tiết
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Student Management Modal */}
            {studentManagement.open && studentManagement.student && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <h3>Quản lý học sinh</h3>
                            <button
                                onClick={closeStudentManagement}
                                className={styles.closeButton}
                            >
                                ×
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            <div className={styles.studentDetail}>
                                <img
                                    src={
                                        studentManagement.student.avatar
                                            .length != 0
                                            ? studentManagement.student
                                                  .avatar[0]
                                            : 'https://i.pinimg.com/474x/0b/10/23/0b10236ae55b58dceaef6a1d392e1d15.jpg'
                                    }
                                    alt={studentManagement.student.username}
                                    className={styles.detailAvatar}
                                />
                                <div className={styles.detailInfo}>
                                    <h4>
                                        {studentManagement.student.username}
                                    </h4>
                                    <p>ID: {studentManagement.student._id}</p>
                                    <p>
                                        Email: {studentManagement.student.email}
                                    </p>
                                    <p>
                                        Username:{' '}
                                        {studentManagement.student.username}
                                    </p>
                                    <p>
                                        Số điện thoại:{' '}
                                        {studentManagement.student.phonenumber}
                                    </p>
                                    <p>
                                        Ngày sinh:{' '}
                                        {studentManagement.student.birthday
                                            ? new Date(
                                                  studentManagement.student.birthday
                                              ).toLocaleDateString('vi-VN')
                                            : 'N/A'}
                                    </p>
                                    <p>
                                        Ngày tham gia:{' '}
                                        {studentManagement.student.createdAt
                                            ? new Date(
                                                  studentManagement.student.createdAt
                                              ).toLocaleDateString('vi-VN')
                                            : 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className={styles.modalFooter}>
                            <button
                                onClick={() =>
                                    handleRemoveStudent(
                                        studentManagement.student?._id
                                    )
                                }
                                className={styles.deleteButton}
                            >
                                Xóa khỏi lớp học
                            </button>
                            <button
                                onClick={closeStudentManagement}
                                className={styles.cancelButton}
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