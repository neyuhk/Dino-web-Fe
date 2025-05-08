// ClassroomPage.tsx
import React, { useEffect, useState } from 'react';
import { Search, GraduationCap, Users, BookOpen, Award, Calendar } from 'lucide-react';
import styles from './ClassroomPage.module.css';
import { getCourseByUserId } from '../../services/course.ts';
import EmptyState from './EmptyState/EmptyState.tsx';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '../../router/path.ts';
import { Course } from '../../model/classroom.ts';
import DinoLoading from '../commons/DinoLoading/DinoLoading.tsx'

const ClassroomList: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>([])
    const [filteredCourses, setFilteredCourses] = useState<Course[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const { user } = useSelector((state: any) => state.auth)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                if (!user?._id) return
                const data = await getCourseByUserId(user._id)
                setCourses(data.data)
                setFilteredCourses(data.data)
            } catch (error) {
                console.error('Error fetching courses:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchCourses()
    }, [user])

    const handleCardClick = (course: Course) => {
        navigate(`${PATHS.CLASSROOM_DETAIL}`, { state: { classroom: course } })
    }
    const handleActive = (startDate: string, endDate: string) => {
        const start = new Date(startDate)
        const end = new Date(endDate)
        const now = new Date()
        return now >= start && now <= end
    }

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value.toLowerCase()
        setSearchQuery(query)
        const filtered = courses.filter((course) =>
            course.title.toLowerCase().includes(query.trim())
        )
        setFilteredCourses(filtered)
    }

    const formatDateRange = (startDate: string, endDate: string) => {
        const start = new Date(startDate)
        const end = new Date(endDate)
        return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`
    }

    if (isLoading) {
        return (
            // <div className={styles.loadingContainer}>
            //     <div className={styles.loadingSpinner}>
            //         <GraduationCap size={32} className={styles.loadingIcon} />
            //     </div>
            //     <p>Đang tải lớp học của bạn...</p>
            // </div>
            <DinoLoading
                message="Đang tải lớp học của bạn">
            </DinoLoading>
        )
    }

    if (!courses.length) {
        return <EmptyState />
    }

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.container}>
                <div className={styles.headerSection}>
                    <div className={styles.headerContent}>
                        <h1 className={styles.title}>Khóa học của bạn</h1>
                        <p className={styles.subtitle}>
                            Khám phá và tham gia các khóa học trực tuyến để nâng
                            cao kỹ năng của bạn.
                        </p>
                    </div>
                    <div className={styles.searchContainer}>
                        <Search className={styles.searchIcon} size={20} />
                        <input
                            type="text"
                            placeholder="Tìm kiếm khóa học..."
                            value={searchQuery}
                            onChange={handleSearch}
                            className={styles.searchInput}
                        />
                    </div>
                </div>

                <div className={styles.grid}>
                    {filteredCourses.map((course) => (
                        <div
                            key={course._id}
                            className={styles.card}
                            onClick={() => {
                                if (handleActive(course.start_date, course.end_date)) {
                                    handleCardClick(course);
                                }
                            }}
                        >
                            <div className={styles.ribbon}>
                                {course.course_type === 'DEFAULT'
                                    ? 'Tiêu chuẩn'
                                    : 'Đặc biệt'}
                            </div>

                            <div className={styles.cardHeader}>
                                <div className={styles.imageWrapper}>
                                    <img
                                        src={
                                            course.images &&
                                            course.images.length > 0
                                                ? course.images[0]
                                                : 'https://i.pinimg.com/736x/95/6f/0f/956f0fef63faac5be7b95715f6207fea.jpg'
                                        }
                                        alt={course.title}
                                        className={styles.image}
                                    />
                                    <div className={styles.imageOverlay} />
                                </div>
                            </div>

                            <div className={styles.content}>
                                <h2 className={styles.classroomName}>
                                    {course.title}
                                </h2>

                                <p className={styles.description}>
                                    {course.description}
                                </p>

                                <div className={styles.infoSection}>
                                    <div className={styles.infoItem}>
                                        <Calendar
                                            size={16}
                                            className={styles.infoIcon}
                                        />
                                        <span>
                                            {formatDateRange(
                                                course.start_date,
                                                course.end_date
                                            )}
                                        </span>
                                    </div>
                                    <div className={styles.infoItem}>
                                        <BookOpen size={16} />
                                        <span
                                            className={
                                                handleActive(
                                                    course.start_date,
                                                    course.end_date
                                                )
                                                    ? styles.activeStatus
                                                    : styles.inactiveStatus
                                            }
                                        >
                                                {handleActive(
                                                    course.start_date,
                                                    course.end_date
                                                )
                                                    ? 'Đang hoạt động'
                                                    : 'Không hoạt động'}
                                            </span>
                                    </div>
                                </div>

                                {/*<div className={styles.cardFooter}>*/}
                                {/*    <div className={styles.stats}>*/}

                                {/*    </div>*/}
                                {/*</div>*/}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ClassroomList
