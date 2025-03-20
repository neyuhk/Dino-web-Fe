// ClassroomPage.tsx
import React, { useEffect, useState } from 'react';
import { Search, GraduationCap, Users, BookOpen } from 'lucide-react';
import styles from './ClassroomPage.module.css';
import { getClassroomList } from '../../services/classroom.ts'
import EmptyState from './EmptyState/EmptyState.tsx'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { PATHS } from '../../router/path.ts'
import { Classroom, Course } from '../../model/classroom.ts'
import RequireAuth from '../commons/RequireAuth/RequireAuth.tsx'

interface ClassroomListProps {
    classrooms: Classroom;
}

const ClassroomList: React.FC = () => {
    const [classrooms, setClassrooms] = useState<Classroom[]>([]);
    const [filteredClassrooms, setFilteredClassrooms] = useState<Classroom[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const { user } = useSelector((state: any) => state.auth);
    const [auth, checkAuth] = useState(false)
    const navigate = useNavigate();

    useEffect(() => {
        const fetchClassrooms = async () => {
            try {
                const data = await getClassroomList();
                setClassrooms(data.data);
                setFilteredClassrooms(data.data);
            } catch (error) {
                console.error('Error fetching classrooms:', error);
            } finally {
                setIsLoading(false);
            }
        };
        if(user){
            checkAuth(true)
            fetchClassrooms();
        }

    }, []);

    const handleCardClick = (classroomId: string) => {
        console.log('class room',classroomId);
        navigate(`${PATHS.CLASSROOM_DETAIL}`, { state: { classroomId } });
    };

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);
        const filtered = classrooms.filter(classroom =>
            classroom.name.toLowerCase().includes(query.trim())
        );
        setFilteredClassrooms(filtered);
    };

    // if(!user){
    //     return (
    //         <RequireAuth></RequireAuth>
    //     );
    // }

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

    if (!classrooms.length) {
        return <EmptyState />;
    }

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.container}>
                <div className={styles.headerSection}>
                    <div className={styles.headerContent}>
                        <h1 className={styles.title}>Lớp học của bạn</h1>

                        <p className={styles.subtitle}>
                            Khám phá và tham gia các lớp học trực tuyến của bạn.
                        </p>
                    </div>
                    <div className={styles.searchContainer}>
                        <Search className={styles.searchIcon} size={20} />
                        <input
                            type="text"
                            placeholder="Tìm kiếm lớp học của bạn..."
                            value={searchQuery}
                            onChange={handleSearch}
                            className={styles.searchInput}
                        />
                    </div>
                </div>

                <div className={styles.grid}>
                    {filteredClassrooms.map((classroom) => (
                        <div key={classroom._id}
                             className={styles.card}
                             onClick={() => handleCardClick( classroom._id)}
                        >
                            <div className={styles.cardHeader}>
                                <div className={styles.imageWrapper}>
                                    <img
                                        src={
                                            classroom.images && classroom.images.length > 0
                                                ? classroom.images[0]
                                                : '/default-classroom.jpg'
                                        }
                                        alt={classroom.name}
                                        className={styles.image}
                                    />
                                    <div className={styles.imageOverlay} />
                                </div>
                                <div className={styles.subjectBadge}>
                                    {'General'}
                                </div>
                            </div>

                            <div className={styles.content}>
                                <h2 className={styles.classroomName}>
                                    {classroom.name}
                                </h2>
                                <p className={styles.description}>
                                    {classroom.description}
                                </p>

                                <div className={styles.teacherSection}>
                                    <div className={styles.avatarContainer}>
                                        <img
                                            src={classroom.teacher_id.avatar}
                                            alt={classroom.teacher_id.username}
                                            className={styles.avatar}
                                        />
                                    </div>
                                    <div className={styles.teacherDetails}>
                                        <span className={styles.teacherLabel}>Teacher</span>
                                        <span className={styles.teacherName}>
                                         {classroom.teacher_id.username}
            </span>
                                    </div>
                                </div>

                                <div className={styles.cardFooter}>
                                    <div className={styles.stats}>
                                        <div className={styles.statItem}>
                                            <Users size={16} />
                                            <span >
                    { classroom.students && classroom.students.length > 0
                        ? classroom.students.length
                        : '0'} Students
                </span>
                                        </div>
                                        <div className={styles.statItem}>
                                            <BookOpen size={16} />
                                            <span>Active</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
};

export default ClassroomList;

