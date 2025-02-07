import React, { useState, useEffect } from 'react';
import './CourseListPage.css';
import { Course } from '../../../model/course.ts'
import { searchCourses } from '../../../services/courseService.ts'
import Search from '../../Search/Search.tsx'

const CourseCard: React.FC<{ course: Course }> = ({ course }) => (
    <div className="course-card">
        <img src={course.imageUrl} alt={course.title} className="course-image" />
        <div className="course-content">
            <h3 className="course-title">{course.title}</h3>
            <p className="course-description">{course.description}</p>
            <div className="course-meta">
                <span className="course-level">{course.level}</span>
                <span className="course-date">Bắt đầu: {new Date(course.startDate).toLocaleDateString('vi-VN')}</span>
            </div>
        </div>
    </div>
);

const CourseListPage: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const filteredCourses = searchCourses(searchQuery);
        setCourses(filteredCourses);
    }, [searchQuery]);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    return (
        <div className="course-list-page">
            <div className="search-section">
                <h2>Tìm Kiếm Khóa Học</h2>
                <Search onSearch={handleSearch} placeholder="Nhập tên khóa học..." />
            </div>
            <div className="courses-grid">
                {courses.map(course => (
                    <CourseCard key={course.id} course={course} />
                ))}
            </div>
        </div>
    );
};

export default CourseListPage;