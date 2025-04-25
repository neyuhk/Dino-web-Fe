import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { Calendar, Users, BookOpen, ArrowLeft, GraduationCap } from 'lucide-react'
import styles from './ClassroomDetail.module.css';
import { Classroom, Course } from '../../../model/classroom.ts'
import { getClassroomById } from '../../../services/classroom.ts'
import { useSelector } from 'react-redux'
import { PATHS } from '../../../router/path.ts'
import RequireAuth from '../../commons/RequireAuth/RequireAuth.tsx'
import { User } from '../../../model/model.ts'
import { getUserById } from '../../../services/user.ts'
import LessonList from '../LessonList/LessonList.tsx'
import DinoLoading from '../../commons/DinoLoading/DinoLoading.tsx'

const ClassroomDetailPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { classroom } = location.state as { classroom: Course};
    const [teacher, setTeacher] = useState<User>();
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useSelector((state: any) => state.auth);

    useEffect(() => {
        const fetchData = async () => {
            try{
                console.log( 'classroomId', classroom ,classroom.teacher_id);
                const data = await getUserById(classroom.teacher_id)
                setTeacher(data.data)
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
            // <div className={styles.loadingContainer}>
            //     <div className={styles.loadingSpinner}>
            //         <GraduationCap size={32} className={styles.loadingIcon} />
            //     </div>
            //     <p>Chờ xíuuuu... </p>
            // </div>
            <DinoLoading
                message="Chờ xíuuu..."
            />
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
                            : 'https://i.pinimg.com/736x/95/6f/0f/956f0fef63faac5be7b95715f6207fea.jpg'
                    })`,
                }}
            >
                <div className={styles.headerOverlay}>
                    <h1>{classroom.title}</h1>
                    <p>{classroom.description}</p>
                </div>
            </div>

            {/* Teacher Section */}
            <div className={styles.teacherSection}>
                <h2>Giảng viên</h2>
                <div className={styles.teacherCard}>
                    <img
                        src={
                            Array.isArray(teacher?.avatar) &&
                            teacher.avatar.length > 0
                                ? teacher.avatar[0]
                                : 'https://i.pinimg.com/474x/0b/10/23/0b10236ae55b58dceaef6a1d392e1d15.jpg'
                        }
                        alt={
                        teacher?.username ||
                            'Chưa cập nhật tên'
                        }
                    />

                    <div className={styles.teacherInfo}>
                        <p>
                            Giáo viên: {' '}
                            { teacher?.username ||
                                'Chưa cập nhật tên giáo viên'}
                        </p>
                        <p>
                            Email:{' '}
                            {teacher?.email?.trim() ||
                                'Chưa cập nhật email'}
                        </p>
                        <p>
                            Số điện thoại:{' '}
                            {teacher?.phoneNumber?.trim() ||
                                'Chưa cập nhật số điện thoại'}
                        </p>
                    </div>
                </div>
            </div>

             Courses Section
            <div className={styles.coursesSection}>
                <h2>Khóa học</h2>
                <LessonList courseId={classroom._id} />
            </div>
        </div>
    )
};

export default ClassroomDetailPage;
