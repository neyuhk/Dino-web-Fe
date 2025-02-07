import React from 'react';
import { Course } from '../../../model/classroom.ts'

interface CourseCardProps {
    course: Course;
    onSelect: (courseId: string) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onSelect }) => {
    return (
        <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
            <div
                className="aspect-video bg-gray-100 bg-cover bg-center"
                style={{ backgroundImage: `url(${course.thumbnail})` }}
            />
            <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{course.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{course.description}</p>
                <div className="flex justify-between items-center">
                    <span className="text-green-600 font-medium">{course.totalLessons} bài học</span>
                    <button
                        onClick={() => onSelect(course.id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                        Tiếp tục học
                    </button>
                </div>
            </div>
        </div>
    );
};