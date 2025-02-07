import React from 'react';
import { User } from 'lucide-react';
import './Section2.css';

interface CourseCardProps {
    title: string;
    participants: number;
    onClick: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ title, participants, onClick }) => {
    return (
        <div className="course-card" onClick={() => {
            console.log(`Clicked on course: ${title}`);
            onClick();
        }}>
            <div className="star-rating">
                ⭐⭐⭐⭐⭐
            </div>
            <h3 className="course-title">{title}</h3>
            <div className="participants-container">
                <User className="user-icon" size={16} />
                <span className="participants-count">{participants}</span>
            </div>
        </div>
    );
};

const Section2: React.FC = () => {
    const courses = [
        { id: 1, title: "Khóa học Arduino cơ bản", participants: 1234 },
        { id: 2, title: "Lập trình Arduino nâng cao", participants: 856 },
        { id: 3, title: "Arduino IoT Projects", participants: 677 },
        { id: 4, title: "Robot với Arduino", participants: 945 }
    ];

    const handleCourseClick = (courseId: number) => {
        // Xử lý routing ở đây
        console.log(`Navigating to course ${courseId}`);
    };

    return (
        <section className="section2">
            <h2 className="section2-title .title-gradian">Mọi người cũng tham gia</h2>
            <div className="course-grid">
                {courses.map(course => (
                    <CourseCard
                        key={course.id}
                        title={course.title}
                        participants={course.participants}
                        onClick={() => handleCourseClick(course.id)}
                    />
                ))}
            </div>
        </section>
    );
};

export default Section2;