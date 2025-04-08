import React, { useState, useEffect } from 'react';
import styles from './TeacherClassroom.module.css';
import Toast from '../../commons/Toast/Toast.tsx'
import { Course } from '../../../model/classroom.ts'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import RequireAuth from '../../commons/RequireAuth/RequireAuth.tsx'
import { getCourseByTeacherId } from '../../../services/course.ts'

interface ClassTeacher {
    teacherId: string;
    classId: string;
    className: string;
}

interface ToastMessage {
    show: boolean;
    type: 'success' | 'error' | 'info';
    title: string;
    message: string;
    image?: string;
}

interface NotificationProps {
    title: string;
    message: string;
    image: string;
}

// Empty state notification component
const EmptyStateNotification: React.FC<NotificationProps> = ({ title, message, image }) => {
    return (
        <div className={styles.emptyStateContainer}>
            <div className={styles.emptyStateContent}>
                <img src={image} alt={title} className={styles.emptyStateImage} />
                <h2 className={styles.emptyStateTitle}>{title}</h2>
                <p className={styles.emptyStateMessage}>{message}</p>
            </div>
        </div>
    );
};

const TeacherClassroom: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [classTeacherInfo, setClassTeacherInfo] = useState<ClassTeacher | null>(null);
    const [activeTab, setActiveTab] = useState<'courses' | 'classTeacher'>('courses');
    const navigate = useNavigate();
    const [toast, setToast] = useState<ToastMessage>({
        show: false,
        type: 'info',
        title: '',
        message: ''
    });

    const { user } = useSelector((state: any) => state.auth);

    if(!user){
        return (
            <RequireAuth></RequireAuth>
        );
    }

    // Get teacher ID from user object
    const teacherId = user._id || "";

    // Fetch courses data from API
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Use the service function to get courses by teacher ID
                const coursesData = await getCourseByTeacherId(teacherId);
                setCourses(coursesData.data);

                // Show success toast
                setToast({
                    show: true,
                    type: 'success',
                    title: 'Thành công',
                    message: 'Đã tải danh sách lớp học',
                    image: '/images/success.png'
                });

                // Hide toast after 3 seconds
                setTimeout(() => {
                    setToast(prev => ({ ...prev, show: false }));
                }, 3000);

            } catch (error) {
                console.error('Error fetching courses:', error);
                setToast({
                    show: true,
                    type: 'error',
                    title: 'Lỗi',
                    message: 'Không thể tải danh sách lớp học',
                    image: '/images/error.png'
                });
            }
        };

        fetchData();
    }, [teacherId]);

    const showToast = (type, title, message) => {
        setToast({
            show: true,
            type,
            title,
            message
        });
    };

    // Close toast
    const hideToast = () => {
        setToast(prev => ({ ...prev, show: false }));
    };

    // Handle course click
    const handleCourseClick = (courseId: string, course: Course) => {
        setToast({
            show: true,
            type: 'info',
            title: 'Đã chọn lớp học',
            message: `Bạn đã chọn lớp học có ID: ${courseId}`,
            image: '/images/info.png'
        });

        // Hide toast after 3 seconds
        setTimeout(() => {
            setToast(prev => ({ ...prev, show: false }));
        }, 3000);

        // Handle navigation with course ID
        console.log('Selected course ID:', courseId);
        navigate(`/classroom/courses/${courseId}`, { state: { course } });
    };

    // Format date function
    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        if (dateString === 'unlimited') return 'Không giới hạn';

        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Quản lý lớp học</h1>

            {/* Tab navigation */}
            <div className={styles.tabs}>
                <button
                    className={`${styles.tabButton} ${activeTab === 'courses' ? styles.active : ''}`}
                    onClick={() => setActiveTab('courses')}
                >
                    Lớp bộ môn
                </button>
                <button
                    className={`${styles.tabButton} ${activeTab === 'classTeacher' ? styles.active : ''}`}
                    onClick={() => setActiveTab('classTeacher')}
                >
                    Lớp chủ nhiệm
                </button>
            </div>

            {/* Content based on active tab */}
            {activeTab === 'courses' ? (
                // Courses Tab Content
                courses.length > 0 ? (
                    <div className={styles.coursesGrid}>
                        {courses.map(course => (
                            <div
                                key={course._id}
                                className={styles.courseCard}
                                onClick={() => handleCourseClick(course._id, course)}
                            >
                                <div className={styles.courseImageContainer}>
                                    <img
                                        src={course.images && course.images.length > 0 ? course.images[0] : 'https://i.pinimg.com/474x/cd/4b/d9/cd4bd9b0ea2807611ba3a67c331bff0b.jpg'}
                                        alt={course.title}
                                        className={styles.courseImage}
                                    />
                                </div>
                                <div className={styles.courseContent}>
                                    <h3 className={styles.courseTitle}>{course.title}</h3>
                                    <p className={styles.courseDescription}>{course.description}</p>
                                    <div className={styles.courseStats}>
                                        {course.students && (
                                            <div className={styles.statsItem}>
                                                <span className={styles.statsLabel}>Học sinh:</span>
                                                <span className={styles.statsValue}>{course.students.length}</span>
                                            </div>
                                        )}
                                        <div className={styles.statsItem}>
                                            <span className={styles.statsLabel}>Thời gian:</span>
                                            <span className={styles.statsValue}>
                                                {formatDate(course.start_date)} - {course.end_date === 'unlimited' ? 'Không giới hạn' : formatDate(course.end_date)}
                                            </span>
                                        </div>
                                    </div>
                                    {course.progress !== undefined && (
                                        <div className={styles.progressContainer}>
                                            <div className={styles.progressLabel}>
                                                Tiến độ: {course.progress}%
                                            </div>
                                            <div className={styles.progressBar}>
                                                <div
                                                    className={styles.progressFill}
                                                    style={{ width: `${course.progress}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <EmptyStateNotification
                        title="Không có lớp học nào được phân công"
                        message="Hiện tại bạn chưa được phân công dạy lớp bộ môn nào. Vui lòng liên hệ với quản trị viên để biết thêm chi tiết."
                        image="https://i.pinimg.com/originals/d4/4c/38/d44c389f5c025d038a250e6219a2c195.gif"
                    />
                )
            ) : (
                // Class Teacher Tab Content
                classTeacherInfo ? (
                    <div className={styles.classTeacherContainer}>
                        <div className={styles.classTeacherHeader}>
                            <h2 className={styles.classTeacherTitle}>Lớp chủ nhiệm: {classTeacherInfo.className}</h2>
                            <p className={styles.classTeacherDesc}>Quản lý học sinh và các hoạt động của lớp chủ nhiệm</p>
                        </div>

                        {/* Đây là phần để hiển thị danh sách học sinh và các chức năng quản lý lớp chủ nhiệm */}
                        {/* Bạn có thể thêm các component cho quản lý học sinh ở đây */}
                        <div className={styles.studentManagementSection}>
                            {/* Student list, attendance, etc. would go here */}
                            <p className={styles.sectionPlaceholder}>Nội dung quản lý học sinh sẽ được hiển thị ở đây</p>
                        </div>
                    </div>
                ) : (
                    <EmptyStateNotification
                        title="Bạn không phải giáo viên chủ nhiệm"
                        message="Hiện tại bạn chưa được phân công làm giáo viên chủ nhiệm của lớp nào. Vui lòng liên hệ với quản trị viên để biết thêm chi tiết."
                        image="https://i.pinimg.com/originals/8a/8f/e2/8a8fe290fff96664a28577bb0758cb20.gif"
                    />
                )
            )}

            {/* Toast notification */}
            {toast.show && (
                <Toast toast={toast} onClose={hideToast} />
            )}
        </div>
    );
};

export default TeacherClassroom;