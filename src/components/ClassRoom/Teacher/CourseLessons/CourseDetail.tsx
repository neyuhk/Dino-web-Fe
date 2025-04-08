import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import styles from './CourseDetail.module.css';
import CourseLessons from './CourseLessons';
import Toast from '../../../commons/Toast/Toast.tsx'
import CourseStudents from './CourseStudents.tsx'
import { useSelector } from 'react-redux'
import RequireAuth from '../../../commons/RequireAuth/RequireAuth.tsx'
import { User } from '../../../../model/model.ts'
import { getStudentByCourseId } from '../../../../services/course.ts'

interface ToastMessage {
    show: boolean;
    type: 'success' | 'error' | 'info';
    title: string;
    message: string;
    image?: string;
}

const CourseDetail: React.FC = () => {
    const { courseId } = useParams<{ courseId: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const course = location.state?.course || null;
    const [activeTab, setActiveTab] = useState<'lessons' | 'students'>('lessons');
    const [loading, setLoading] = useState<boolean>(true);
    const { user } = useSelector((state: any) => state.auth);
    const [listStudent, setListStudent] = useState<User[]>([]);

    if(!user){
        return (
            <RequireAuth></RequireAuth>
        );
    }

    const [toast, setToast] = useState<ToastMessage>({
        show: false,
        type: 'info',
        title: '',
        message: ''
    });

    useEffect(() => {
        const fetchCourseDetail = async () => {
            try {
                setLoading(true);

                // Fetch students for this course
                if (courseId) {
                    const students = await getStudentByCourseId(courseId);
                    setListStudent(students.data);
                    console.log("lisst student", listStudent)
                }

                if(course) {
                    setLoading(false);
                }

                setToast({
                    show: true,
                    type: 'success',
                    title: 'Thành công',
                    message: 'Đã tải thông tin lớp học',
                    image: '/images/success.png'
                });

                // Hide toast after 3 seconds
                setTimeout(() => {
                    setToast(prev => ({ ...prev, show: false }));
                }, 3000);
            } catch (error) {
                console.error('Error fetching course details:', error);
                setLoading(false);
                setToast({
                    show: true,
                    type: 'error',
                    title: 'Lỗi',
                    message: 'Không thể tải thông tin lớp học',
                    image: '/images/error.png'
                });
            }
        };

        fetchCourseDetail();
    }, [courseId]);

    const handleBack = () => {
        navigate(-1); // Go back to previous page
    };

    const hideToast = () => {
        setToast(prev => ({ ...prev, show: false }));
    };

    if (loading) {
        return <div className={styles.loadingContainer}>Đang tải...</div>;
    }

    // Format date function
    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        if (dateString === 'unlimited') return 'Không giới hạn';

        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <button onClick={handleBack} className={styles.backButton}>
                    ← Quay lại
                </button>
                <h1 className={styles.title}>{course?.title || 'Chi tiết lớp học'}</h1>
            </div>

            {course && (
                <div className={styles.courseInfo}>
                    <div className={styles.courseImageContainer}>
                        <img
                            src={(course.images && course.images[0]) || '/images/default-course.jpg'}
                            alt={course.title}
                            className={styles.courseImage}
                        />
                    </div>
                    <div className={styles.courseDetails}>
                        <p className={styles.courseDescription}>{course.description}</p>
                        <div className={styles.courseStats}>
                            <div className={styles.statsItem}>
                                <span className={styles.statsLabel}>Số học sinh:</span>
                                <span className={styles.statsValue}>{listStudent.length}</span>
                            </div>
                            <div className={styles.statsItem}>
                                <span className={styles.statsLabel}>Thời gian:</span>
                                <span className={styles.statsValue}>
                                    {formatDate(course.start_date)} - {course.end_date === 'unlimited' ? 'Không giới hạn' : formatDate(course.end_date)}
                                </span>
                            </div>
                            {course.certification && (
                                <div className={styles.statsItem}>
                                    <span className={styles.statsLabel}>Chứng chỉ:</span>
                                    <span className={styles.statsValue}>{course.certification}</span>
                                </div>
                            )}
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
            )}

            {/* Tab navigation */}
            <div className={styles.tabs}>
                <button
                    className={`${styles.tabButton} ${activeTab === 'lessons' ? styles.active : ''}`}
                    onClick={() => setActiveTab('lessons')}
                >
                    Quản lý bài học
                </button>
                <button
                    className={`${styles.tabButton} ${activeTab === 'students' ? styles.active : ''}`}
                    onClick={() => setActiveTab('students')}
                >
                    Quản lý học sinh
                </button>
            </div>

            {/* Tab content */}
            <div className={styles.tabContent}>
                {activeTab === 'lessons' ? (
                    <CourseLessons courseId={courseId ? courseId : ''} />
                ) : (
                    <CourseStudents
                        courseId={courseId ? courseId : ''}
                        students={listStudent}
                    />
                )}
            </div>

            {/* Toast notification */}
            {toast.show && (
                <Toast toast={toast} onClose={hideToast} />
            )}
        </div>
    );
};

export default CourseDetail;