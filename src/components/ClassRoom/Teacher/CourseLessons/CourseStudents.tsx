import React, { useState, useEffect, useRef } from 'react'
import styles from './CourseStudents.module.css'
import { User } from '../../../../model/model.ts'
import { addStudent, getStudentByCourseId, importStudent, removeStudent } from '../../../../services/course.ts'
import { findUser, getUserById } from '../../../../services/user.ts'
import EmptyStateNotification from '../common/EmptyStateNotification/EmptyStateNotification.tsx'
import { GraduationCap, Loader2 } from 'lucide-react'
import DinoLoading from '../../../commons/DinoLoading/DinoLoading.tsx'

interface CourseStudentsProps {
    courseId: string;
}
interface ErrorStudent{
    username: string;
    email: string;
    message: string;
}

function SpinnerIcon(props: { className: any }) {
    return null
}

const CourseStudents: React.FC<CourseStudentsProps> = ({ courseId }) => {
    const [students, setStudents] = useState<User[]>([])
    const [filteredStudents, setFilteredStudents] = useState<User[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [loadingImport, setLoadingImport] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)
    const [searchId, setSearchId] = useState<string>('')
    const [searchResult, setSearchResult] = useState<User[]>([])
    const [pendingStudents, setPendingStudents] = useState<User[]>([])
    const [addingStudents, setAddingStudents] = useState<boolean>(false)
    const [searching, setSearching] = useState<boolean>(false)
    const [studentFilter, setStudentFilter] = useState<string>('')
    const [errorStudents, setErrorStudent] = useState<ErrorStudent[]>([])
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
    const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(
        null
    )
    const [showErrorPopup, setShowErrorPopup] = useState(false)
    // Pagination states
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [perPage, setPerPage] = useState<number>(5)
    const [totalResults, setTotalResults] = useState<number>(0)
    const [totalPages, setTotalPages] = useState<number>(1)
    const [studentManagement, setStudentManagement] = useState<{
        open: boolean
        student: User | null
    }>({
        open: false,
        student: null,
    })
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchStudents()
    }, [courseId])

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            // Cleanup
            if (searchTimeout) {
                clearTimeout(searchTimeout)
            }
        }
    }, [searchTimeout])

    // Auto-hide success message after 3 seconds
    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage(null)
            }, 3000)
            return () => clearTimeout(timer)
        }
    }, [successMessage])

    useEffect(() => {
        // Filter and sort students when the filter text changes or when the student list changes
        const filtered = students.filter(
            (student) =>
                student.username
                    ?.toLowerCase()
                    .includes(studentFilter.toLowerCase()) ||
                student.email
                    ?.toLowerCase()
                    .includes(studentFilter.toLowerCase()) ||
                student.name
                    ?.toLowerCase()
                    .includes(studentFilter.toLowerCase())
        )

        // Sort students by name
        const sorted = [...filtered].sort((a, b) => {
            const nameA = a.username?.toLowerCase() || ''
            const nameB = b.username?.toLowerCase() || ''

            if (sortOrder === 'asc') {
                return nameA.localeCompare(nameB)
            } else {
                return nameB.localeCompare(nameA)
            }
        })

        setFilteredStudents(sorted)
    }, [studentFilter, students, sortOrder])

    const fetchStudents = async () => {
        try {
            setLoading(true)
            const data = await getStudentByCourseId(courseId)
            const listStudent = data.data
            const studentsList = Array.isArray(listStudent) ? listStudent : []
            setStudents(studentsList)
            setFilteredStudents(studentsList)
            setError(null)
        } catch (err) {
            console.error('Error fetching students:', err)
            setError('Không thể tải danh sách học sinh')
            setStudents([])
            setFilteredStudents([])
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = async (
        searchValue: string = searchId,
        page: number = currentPage
    ) => {
        if (!searchValue.trim()) {
            setError('Vui lòng nhập tên/mã học sinh')
            return
        }

        try {
            setSearching(true)
            setError(null)
            // Add page and perPage parameters to the findUser call
            const data = await findUser(searchValue, page, perPage)
            const users = data.data
            const total = data.total || 0 // Assuming API returns total count

            // Set total results and calculate total pages
            setTotalResults(total)
            setTotalPages(Math.ceil(total / perPage))

            // Reset currentPage to 1 if this is a new search
            if (page === 1 && searchValue !== searchId) {
                setCurrentPage(1)
            }

            // Filter users with role "user"
            const studentUsers = Array.isArray(users)
                ? users.filter((user) => user.role === 'user')
                : []

            if (studentUsers.length > 0) {
                setSearchResult(studentUsers)
            } else {
                if (total > 0) {
                    setError('Không tìm thấy học sinh ở trang này')
                } else {
                    setError('Không tìm thấy học sinh phù hợp')
                }
                setSearchResult([])
            }
        } catch (err) {
            console.error('Error searching for users:', err)
            setError('Không tìm thấy học sinh với thông tin đã nhập')
            setSearchResult([])
        } finally {
            setSearching(false)
        }
    }

    const handleSearchInputChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = e.target.value
        setSearchId(value)

        // Clear previous timeout if exists
        if (searchTimeout) {
            clearTimeout(searchTimeout)
        }

        // Reset search results if input is empty
        if (!value.trim()) {
            setSearchResult([])
            setError(null)
            setCurrentPage(1)
            setTotalResults(0)
            setTotalPages(1)
            return
        }

        // Set new timeout (debounce 1 second)
        const newTimeout = setTimeout(() => {
            // Reset to page 1 for new searches
            setCurrentPage(1)
            handleSearch(value, 1)
        }, 1000)

        setSearchTimeout(newTimeout)
    }

    const changePage = (page: number) => {
        if (page < 1 || page > totalPages || page === currentPage) {
            return
        }
        setCurrentPage(page)
        handleSearch(searchId, page)
    }

    const addToPending = (student: User) => {
        // Check if student is already in the course
        if (students.some((s) => s._id === student._id)) {
            setError('Học sinh này đã có trong lớp học')
            return
        }

        // Check if student is already in pending list
        if (pendingStudents.some((s) => s._id === student._id)) {
            setError('Học sinh này đã có trong danh sách chờ')
            return
        }

        setPendingStudents([...pendingStudents, student])
        setSuccessMessage(
            `Đã thêm ${student.username || student.email} vào hàng chờ`
        )
    }

    const removePending = (id: string) => {
        const studentToRemove = pendingStudents.find((s) => s._id === id)
        setPendingStudents(
            pendingStudents.filter((student) => student._id !== id)
        )
        if (studentToRemove) {
            setSuccessMessage(
                `Đã xóa ${studentToRemove.username || studentToRemove.email} khỏi hàng chờ`
            )
        }
    }

    const handleAddStudents = async () => {
        if (pendingStudents.length === 0) {
            setError('Không có học sinh nào trong danh sách chờ')
            return
        }

        setAddingStudents(true)

        try {
            // Add students one by one
            setLoading(true)
            for (const student of pendingStudents) {
                await addStudent({
                    courseId: courseId,
                    studentId: student._id,
                })
            }

            // Clear pending list and refresh student list
            const count = pendingStudents.length
            setPendingStudents([])
            await fetchStudents()
            setSuccessMessage(
                `Đã thêm thành công ${count} học sinh vào lớp học`
            )
        } catch (err) {
            console.error('Error adding students:', err)
            setError('Có lỗi khi thêm học sinh')
        } finally {
            setLoading(false)
            setAddingStudents(false)
        }
    }

    const openStudentManagement = (student: User) => {
        setStudentManagement({
            open: true,
            student,
        })
    }

    const closeStudentManagement = () => {
        setStudentManagement({
            open: false,
            student: null,
        })
    }

    const handleRemoveStudent = async (studentId: string) => {
        try {
            setLoading(true)
            // Implement remove student API call here
            // For now, just simulating removal from the local state
            setStudents(students.filter((student) => student._id !== studentId))
            closeStudentManagement()
            await removeStudent(courseId, studentId)
            setSuccessMessage('Đã xóa học sinh khỏi lớp học')
        } catch (err) {
            console.error('Error removing student:', err)
            setError('Có lỗi khi xóa học sinh')
        }
        setLoading(false)
    }

    const toggleSortOrder = () => {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    }

    const clearSearch = () => {
        setSearchId('')
        setSearchResult([])
        setError(null)
        setCurrentPage(1)
        setTotalResults(0)
        setTotalPages(1)
    }

    // Generate array for pagination numbers
    const getPaginationRange = () => {
        const range = []
        const delta = 1 // How many pages to show before and after current page

        let start = Math.max(2, currentPage - delta)
        let end = Math.min(totalPages - 1, currentPage + delta)

        // Always show first page
        if (totalPages > 0) {
            range.push(1)
        }

        // Add dots after first page if needed
        if (start > 2) {
            range.push('...')
        }

        // Add pages in the middle
        for (let i = start; i <= end; i++) {
            range.push(i)
        }

        // Add dots before last page if needed
        if (end < totalPages - 1) {
            range.push('...')
        }

        // Always show last page if it exists and is different from first page
        if (totalPages > 1) {
            range.push(totalPages)
        }

        return range
    }

    if (loading && students.length === 0) {
        return (
            <div
                className={'loadingContainer'}
                style={{ justifyContent: 'flex-start' }}
            >
                <div className={'loadingSpinner'}>
                    <GraduationCap size={32} className={'loadingIcon'} />
                </div>
                <p>Đang tải...</p>
            </div>
        )
    }

    const handleFileUpload = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0]
        if (!file) {
            setError('Vui lòng chọn một tệp để tải lên')
            return
        }
        setLoadingImport(true)
        try {
            // Parse the file (e.g., using a library like Papaparse for CSV or SheetJS for Excel)
            const studentsFromFile = await importStudent({ courseId, file })
            console.log('Parsed students from file:', studentsFromFile)
            setPendingStudents([
                ...pendingStudents,
                ...studentsFromFile.student,
            ])
            setErrorStudent(studentsFromFile.errorStudent)
            console.log("error Student", studentsFromFile.errorStudent)
            console.log("error Students", errorStudents)
            setSuccessMessage(
                `Đã thêm ${studentsFromFile.student.length} học sinh từ tệp`
            )
            event.target.value = '';
        } catch (err) {
            console.error('Error parsing file:', err)
            setError('Có lỗi khi xử lý tệp. Vui lòng kiểm tra định dạng tệp.')
        }
        setLoadingImport(false)
    }

    return (
        <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Quản lý học sinh</h2>

            {/* Notification area for success and error messages */}
            <div className={styles.notificationArea}>
                {successMessage && (
                    <div className={styles.successMessage}>
                        <span className={styles.successIcon}>✓</span>
                        {successMessage}
                    </div>
                )}
                {error && (
                    <div className={styles.error}>
                        <span className={styles.errorIcon}>!</span>
                        {error}
                        <button
                            className={styles.dismissError}
                            onClick={() => setError(null)}
                        >
                            ×
                        </button>
                    </div>
                )}
            </div>

            {/* Search for new students */}
            <div className={styles.searchSection}>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <h3>Thêm học sinh mới</h3>
                    {/* Thêm nút hiển thị học sinh lỗi */}
                    {errorStudents && errorStudents.length > 0 && !loadingImport && (
                        <button
                            onClick={() => setShowErrorPopup(true)}
                            className={styles.errorButton}
                            title="Xem danh sách học sinh lỗi"
                        >
                                    <span className={styles.warningIcon}>
                                        ⚠️
                                    </span>
                            Học sinh lỗi ({errorStudents.length})
                        </button>
                    )}
                    <div className={styles.importFileContainer}>
                        <label
                            htmlFor="importFile"
                            className={styles.importFileButton}
                        >
                            {loadingImport ? (
                                <div className={styles.loadingInline}>
                                    <Loader2 size={10} className="spinner" />
                                    Đang tải...
                                </div>
                            ) : (
                                'Thêm danh sách'
                            )}
                        </label>

                        <input
                            type="file"
                            id="importFile"
                            accept=".csv, .xlsx"
                            className={styles.fileInput}
                            onChange={handleFileUpload}
                        />
                        <a
                            href="/mau_import_student.xlsx"
                            download="mau_import_hocsinh.xlsx"
                            className={styles.downloadSampleButton}
                        >
                            Tải tệp mẫu
                        </a>
                    </div>
                </div>
                <div className={styles.searchForm}>
                    <input
                        type="text"
                        placeholder="Nhập tên hoặc email học sinh"
                        value={searchId}
                        onChange={handleSearchInputChange}
                        className={styles.searchInput}
                    />
                    <button
                        onClick={() => {
                            setCurrentPage(1)
                            handleSearch(searchId, 1)
                        }}
                        className={styles.searchButton}
                        disabled={searching}
                    >
                        {searching ? 'Đang tìm...' : 'Tìm kiếm'}
                    </button>
                    {searchId && (
                        <button
                            onClick={clearSearch}
                            className={styles.clearSearchButton}
                        >
                            Hủy
                        </button>
                    )}
                </div>

                {/* Search Result with Pagination */}
                {searchResult.length > 0 && (
                    <div className={styles.searchResultContainer}>
                        <div className={styles.searchResult}>
                            <div className={styles.studentCardHeader}>
                                <h4>
                                    Kết quả tìm kiếm ({totalResults} học sinh)
                                </h4>
                                <div className={styles.searchResultInfo}>
                                    <span>
                                        Trang {currentPage}/{totalPages}
                                    </span>
                                    <button
                                        onClick={clearSearch}
                                        className={styles.cancelSearchButton}
                                    >
                                        Đóng
                                    </button>
                                </div>
                            </div>

                            {/* Students Cards */}
                            {searchResult.map((student) => (
                                <div
                                    key={student._id}
                                    className={styles.studentCard}
                                >
                                    <div className={styles.avatarContainer}>
                                        <img
                                            src={
                                                student.avatar &&
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
                                            {student.phoneNumber && (
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
                                                        {student.phoneNumber ||
                                                            'Chưa cập nhật số điện thoại'}
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

                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <div className={styles.pagination}>
                                    <button
                                        className={`${styles.pageButton} ${currentPage === 1 ? styles.disabled : ''}`}
                                        onClick={() =>
                                            changePage(currentPage - 1)
                                        }
                                        disabled={currentPage === 1}
                                    >
                                        &laquo; Trước
                                    </button>

                                    {getPaginationRange().map((page, index) =>
                                        page === '...' ? (
                                            <span
                                                key={`ellipsis-${index}`}
                                                className={styles.ellipsis}
                                            >
                                                ...
                                            </span>
                                        ) : (
                                            <button
                                                key={`page-${page}`}
                                                className={`${styles.pageButton} ${currentPage === page ? styles.activePage : ''}`}
                                                onClick={() =>
                                                    changePage(Number(page))
                                                }
                                            >
                                                {page}
                                            </button>
                                        )
                                    )}

                                    <button
                                        className={`${styles.pageButton} ${currentPage === totalPages ? styles.disabled : ''}`}
                                        onClick={() =>
                                            changePage(currentPage + 1)
                                        }
                                        disabled={currentPage === totalPages}
                                    >
                                        Sau &raquo;
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Pending Students - Improved UI */}
                {pendingStudents.length > 0 && (
                    <div className={styles.pendingSection}>
                        <h3>
                            Học sinh đang chờ thêm ({pendingStudents.length})
                        </h3>
                        <div className={styles.pendingList}>
                            {pendingStudents.map((student) => (
                                <div
                                    key={student._id}
                                    className={styles.pendingItem}
                                >
                                    <div className={styles.pendingInfo}>
                                        <img
                                            src={
                                                student.avatar &&
                                                student.avatar.length != 0
                                                    ? student.avatar[0]
                                                    : 'https://i.pinimg.com/474x/0b/10/23/0b10236ae55b58dceaef6a1d392e1d15.jpg'
                                            }
                                            className={styles.smallAvatar}
                                            alt={
                                                student.username ||
                                                student.email
                                            }
                                        />
                                        <div className={styles.pendingDetails}>
                                            <span
                                                className={styles.pendingName}
                                            >
                                                {student.username ||
                                                    student.email}
                                            </span>
                                            <span
                                                className={styles.pendingEmail}
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
                        <div className={styles.buttonGroup}>
                            <button
                                onClick={handleAddStudents}
                                className={styles.addAllButton}
                                disabled={addingStudents}
                            >
                                {addingStudents ? (
                                    <>
                                        <span className={styles.loadingIcon}>
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


                        </div>
                    </div>
                )}

                {/* Popup hiển thị học sinh lỗi */}
                {showErrorPopup &&
                    errorStudents &&
                    errorStudents.length > 0 && (
                        <div className={styles.popupOverlay}>
                            <div className={styles.errorPopup}>
                                <div className={styles.popupHeader}>
                                    <h3>
                                        Danh sách học sinh lỗi (
                                        {errorStudents.length})
                                    </h3>
                                    <button
                                        onClick={() => setShowErrorPopup(false)}
                                        className={styles.closePopupButton}
                                    >
                                        ×
                                    </button>
                                </div>
                                <div className={styles.errorTableContainer}>
                                    <table className={styles.errorTable}>
                                        <thead>
                                            <tr>
                                                <th>Tên học sinh</th>
                                                <th>Email</th>
                                                <th>Lỗi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {errorStudents.map(
                                                (student, index) => (
                                                    <tr
                                                        key={index}
                                                        className={
                                                            styles.errorRow
                                                        }
                                                    >
                                                        <td>
                                                            {student.username ||
                                                                '(Không có tên)'}
                                                        </td>
                                                        <td>{student.email}</td>
                                                        <td
                                                            className={
                                                                styles.errorMessage
                                                            }
                                                        >
                                                            {student.message}
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                <div className={styles.popupFooter}>
                                    <button
                                        onClick={() => setShowErrorPopup(false)}
                                        className={styles.closeButton}
                                    >
                                        Đóng
                                    </button>
                                </div>
                            </div>
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
                            {studentFilter && (
                                <button
                                    className={styles.clearFilterButton}
                                    onClick={() => setStudentFilter('')}
                                >
                                    ×
                                </button>
                            )}
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
                        <button
                            className={styles.clearFilterButton}
                            onClick={() => setStudentFilter('')}
                        >
                            Xóa bộ lọc
                        </button>
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
                                                    student.avatar &&
                                                    student.avatar.length != 0
                                                        ? student.avatar[0]
                                                        : 'https://i.pinimg.com/474x/0b/10/23/0b10236ae55b58dceaef6a1d392e1d15.jpg'
                                                }
                                                alt={student.username}
                                                className={styles.tableAvatar}
                                            />
                                            <span>{student.username}</span>
                                        </td>
                                        <td>{student.email}</td>
                                        <td>
                                            {student.phoneNumber ||
                                                'Chưa cập nhật số điện thoại'}
                                        </td>
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
                                        studentManagement.student.avatar &&
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
                                        {studentManagement.student
                                            .phoneNumber || 'N/A'}
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
                                        studentManagement.student?._id || ''
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
            {loading && <DinoLoading message="Đang tải" />}
        </div>
    )
}

export default CourseStudents
