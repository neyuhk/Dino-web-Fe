//Classroom


import { User } from './model.ts'


export interface Lesson {
    _id: string;
    title: string;
    description: string;
    video_url: string;
    images: string[];
    body: string;
    course_id: Course;
    createdAt: string;
    updatedAt: string;
}

export interface Assignment {
    id: string;
    courseId: string;
    lessonId: string;
    title: string;
    description: string;
    type: 'multiple_choice' | 'coding' | 'theory';
    dueDate: Date;
    totalPoints: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface Submission {
    id: string;
    assignmentId: string;
    studentId: string;
    content: string;
    status: 'submitted' | 'graded' | 'returned';
    score?: number;
    feedback?: string;
    submittedAt: Date;
    gradedAt?: Date;
}

export interface Teacher {
    _id: string;
    username: string;
    email: string;
    phonenumber: string;
    role: string;
    avatar: string[];
    birthday: Date;
}

export interface Course {
    _id: string;
    title: string;
    description: string;
    images: string[];
    start_date: string;
    end_date: string;
    certification: string;
    createdAt: string;
    updatedAt: string;
    progress: number;
}

export interface Classroom {
    _id: string;
    name: string;
    images: string[];
    description: string;
    teacher_id: User;
    courses: Course[];
    createdAt: Date;
    updatedAt: Date;
    students: User[];
}


// export const mockUsers: User[] = [
//     {
//         id: '1',
//         name: 'Nguyễn Văn A',
//         email: 'nguyenvana@example.com',
//         role: 'student',
//         createdAt: new Date('2024-01-01'),
//         updatedAt: new Date('2024-01-01'),
//     },
//     {
//         id: '2',
//         name: 'Trần Thị B',
//         email: 'tranthib@example.com',
//         role: 'teacher',
//         createdAt: new Date('2024-01-01'),
//         updatedAt: new Date('2024-01-01'),
//     },
// ];

// export const mockCourses: Course[] = [
//     {
//         _id: '1',
//         title: 'Lập trình Python cơ bản',
//         description: 'Khóa học Python từ cơ bản đến nâng cao với nhiều bài tập thực hành',
//         images: ['/images/python-course.jpg'],
//         teacherId: '2',
//         totalLessons: 10,
//         status: 'active',
//         createdAt: new Date('2024-01-01'),
//         updatedAt: new Date('2024-01-01'),
//     },
// ];

// export const mockLessons: Lesson[] = [
//     {
//         id: '1',
//         courseId: '1',
//         title: 'Giới thiệu về Python',
//         description: 'Bài học đầu tiên về ngôn ngữ lập trình Python',
//         videoUrl: 'https://example.com/videos/python-intro',
//         duration: 3600, // seconds
//         order: 1,
//         createdAt: new Date('2024-01-01'),
//         updatedAt: new Date('2024-01-01'),
//     },
// ];

// export const mockAssignments: Assignment[] = [
//     {
//         id: '1',
//         courseId: '1',
//         lessonId: '1',
//         title: 'Bài tập về cấu trúc điều kiện',
//         description: 'Làm các bài tập về if-else trong Python',
//         type: 'coding',
//         dueDate: new Date('2025-01-20'),
//         totalPoints: 10,
//         createdAt: new Date('2024-01-01'),
//         updatedAt: new Date('2024-01-01'),
//     },
// ];

export const mockSubmissions: Submission[] = [
    {
        id: '1',
        assignmentId: '1',
        studentId: '1',
        content: 'def check_number(n):\n    if n > 0:\n        return "Positive"\n    return "Non-positive"',
        status: 'graded',
        score: 9.5,
        feedback: 'Bài làm tốt, cần cải thiện phần định dạng code',
        submittedAt: new Date('2024-01-15'),
        gradedAt: new Date('2024-01-16'),
    },
];
