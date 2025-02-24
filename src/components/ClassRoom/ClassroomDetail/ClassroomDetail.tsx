import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { Calendar, Users, BookOpen, ArrowLeft, GraduationCap } from 'lucide-react'
import styles from './ClassroomDetail.module.css';
import { Classroom } from '../../../model/classroom.ts'
import { getClassroomById } from '../../../services/classroom.ts'
import { useSelector } from 'react-redux'
import { PATHS } from '../../../router/path.ts'
import RequireAuth from '../../RequireAuth/RequireAuth.tsx'

const ClassroomDetailPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { classroomId } = location.state as { classroomId: string};
    const [classroom, setClassroom] = useState<Classroom>();
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useSelector((state: any) => state.auth);

    useEffect(() => {
        const fetchData = async () => {
            try{
                console.log( 'classroomId',classroomId);
                const newClassroom = await getClassroomById(classroomId.toString())
                setClassroom(newClassroom.data)
                // setClassroom('') //test null data
            } catch (error){
                console.log('Error fetching courses',error)
            } finally {
                setIsLoading(false);
            }

        }
        if(user)
            fetchData()
    }, [])
    const handleBack = () => {
        navigate(-1);
    };

    const handleCardClick = (coursesId: string) => {
        console.log('class room',coursesId);
        navigate(`${PATHS.CLASSROOM_LESSON}`, { state: { coursesId } });
    };

    if(!user){
        return (
            <RequireAuth></RequireAuth>
        );
    }

    if (isLoading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loadingSpinner}>
                    <GraduationCap size={32} className={styles.loadingIcon} />
                </div>
                <p>Chờ xíuuuu... Hông ai iu anh bằng tôi iu anh..</p>
            </div>
        );
    }
    if (!classroom) {
        return (
            <div className={styles.notificationContainer}>
                <img src="https://i.pinimg.com/originals/62/c3/79/62c379ae3baad2a6f3810a8ad1a19d47.gif" alt="Thông báo" className={styles.image} />
                <h2 className={styles.title}>Không có dữ liệu</h2>
                <p className={styles.description}>
                    Hiện tại chưa có khóa học nào trong lớp này. Hãy quay lại sau hoặc kiểm tra lại thông tin!
                </p>
                <button onClick={handleBack} className={styles.button}>Quay lại</button>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {/* Back Button */}
            <button onClick={handleBack} className={styles.backButton}>
                <ArrowLeft size={20} />
                <span>Quay lại</span>
            </button>

            {/* Header Section */}
            <div
                className={styles.header}
                style={{
                    backgroundImage: `url(${
                        classroom.images && classroom.images.length > 0
                            ? classroom.images[0]
                            : '/default-classroom.jpg'
                    })`,
                }}
            >
                <div className={styles.headerOverlay}>
                    <h1>{classroom.name}</h1>
                    <p>{classroom.description}</p>
                </div>
            </div>

            {/* Teacher Section */}
            <div className={styles.teacherSection}>
                <h2>Giảng viên</h2>
                <div className={styles.teacherCard}>
                    <img
                        src={
                            Array.isArray(classroom.teacher_id?.avatar) &&
                            classroom.teacher_id.avatar.length > 0
                                ? classroom.teacher_id.avatar[0]
                                : '/default-avatar.jpg'
                        }
                        alt={
                            classroom.teacher_id?.username ||
                            'Chưa cập nhật tên'
                        }
                    />

                    <div className={styles.teacherInfo}>
                        <p>
                            Giáo viên: {' '}
                            { classroom.teacher_id?.username ||
                                'Chưa cập nhật tên giáo viên'}
                        </p>
                        <p>
                            Email:{' '}
                            {classroom.teacher_id?.email?.trim() ||
                                'Chưa cập nhật email'}
                        </p>
                        <p>
                            Số điện thoại:{' '}
                            {classroom.teacher_id?.phonenumber?.trim() ||
                                'Chưa cập nhật số điện thoại'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Courses Section */}
            <div className={styles.coursesSection}>
                <h2>Khóa học</h2>
                <div className={styles.courseGrid}>
                    {classroom.courses?.map((course) => (
                        <div key={course._id} className={styles.courseCard}
                        onClick={() => handleCardClick(course._id)}
                        >
                            <div className={styles.courseImage}>
                                <img
                                    src={
                                        Array.isArray(course.images) &&
                                        course.images.length > 0
                                            ? course.images[0]
                                            : '/default-course.jpg'
                                    }
                                    alt={
                                        course.title ||
                                        'Chưa cập nhật tên khóa học'
                                    }
                                />
                            </div>
                            <div className={styles.courseContent}>
                                <h3>{course.title}</h3>
                                <p>{course.description}</p>
                                <div className={styles.courseInfo}>
                                    <div>
                                        <Calendar size={16} />
                                        <span>
                                            {new Date(
                                                course.start_date
                                            ).toLocaleDateString('vi-VN')}{' '}
                                            -
                                            {new Date(
                                                course.end_date
                                            ).toLocaleDateString('vi-VN')}
                                        </span>
                                    </div>
                                    <div className={styles.progressBar}>
                                        <div
                                            className={styles.progressFill}
                                            style={{
                                                width: `${course.progress}%`,
                                            }}
                                        />
                                        <span>
                                            {course.progress}% Hoàn
                                            thành
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Students Section */}
            <div className={styles.studentsSection}>
                <h2>Học viên ({classroom.students?.length || 0})</h2>
                <div className={styles.studentGrid}>
                    {classroom.students?.map((student) => (
                        <div key={student._id} className={styles.studentCard}>
                            <img src={student.avatar} alt={student.name} />
                            <h4>{student.username}</h4>
                            <p>{student.email}</p>
                            <p className={styles.phoneNumber}>
                                {student.phonenumber}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
};

export default ClassroomDetailPage;