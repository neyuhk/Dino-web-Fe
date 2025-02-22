import { Assignment, Lesson, Submission, User } from '../model/classroom.ts'
import { CLASSROOM_API, COURSE_API } from '../constants/api.ts'
import http from './http/http.ts'
// import { Course } from '../model/model.ts'

export const getClassroomList = async () => {
    return (await http.get(CLASSROOM_API.GET_CLASSROOMS)).data
}

export const getClassroomById = async (id: string) => {
    return (await http.get(CLASSROOM_API.GET_CLASSROOM_BY_ID + id)).data
}

export const addClassroom = async (data: any) => {}

export const deleteClassroom = async (id: string) => {}

export const editClassroom = async (classroomId: string, data: any) => {}

export const mockUsers: User[] = [
    {
        id: '1',
        name: 'Nguyễn Văn A',
        email: 'nguyenvana@example.com',
        role: 'student',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
    },
    {
        id: '2',
        name: 'Trần Thị B',
        email: 'tranthib@example.com',
        role: 'teacher',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
    },
];

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

