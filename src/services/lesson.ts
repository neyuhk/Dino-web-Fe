import { COURSE_API, EXERCISE_API, FORUM_API, LESSON_API } from '../constants/api.ts'
import http from '@/services/http/http'
import httpFile from '@/services/http/httpFile'
import { Lesson, Quiz, Student, SubmitAnswerReq } from '../model/classroom.ts'
import httpAuth from './http/httpAuth.ts'

export const getLessonByCourseId = async (id:string) => {
    return (await http.get(LESSON_API.GET_LESSONS_COURSE_ID + id)).data
}
export const addLesson = async (courseId: string, lessonData: FormData) => {
    try {
        const response = await httpAuth.post(
            `${LESSON_API.CREATE_LESSON}${courseId}`,
            lessonData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                transformRequest: (data) => data, // Don't transform the FormData
            }
        );
        return response;
    } catch (error) {
        console.error('Error in addLesson service:', error);
        throw error;
    }
};

export const editLesson = async (lessonId: string ,data: any) => {
    return (await httpFile.put(LESSON_API.UPDATE_LESSON + lessonId, data)).data;
}

export const addQuiz = async (payload: any) => {
    return (await httpFile.post(EXERCISE_API.ADD_QUIZ, payload)).data
}

export const deleteQuiz = async (id: string) => {
    return (await http.delete(EXERCISE_API.DELETE_QUIZ + id)).data
}

export const newExercise = async (body: any) => {
    return (await http.post(EXERCISE_API.NEW_EXERCISE, body)).data
}

export const deleteExercise = async (id: string) => {
    return (await http.delete(EXERCISE_API.DELETE_EXERCISE + id)).data
}

export const deleteLesson = async (id: string) => {
    return (await httpAuth.delete(LESSON_API.DELETE_LESSON + id)).data
}


export  const getQuiz = async (id: string) => {
    return (await http.get(EXERCISE_API.GET_QUIZ_BY_EXERCISE_ID + id)).data
}

export const getQuizByExerciseId = async (exerciseId: string) => {
    return (await http.get(EXERCISE_API.GET_QUIZ_BY_EXERCISE_ID + exerciseId)).data
}

export const getQuizForTeacher = async (exerciseId: string) => {
    return (await http.get(EXERCISE_API.GET_EXERCISE_DETAIL_FOR_TEACHER + exerciseId)).data
}

export const getAnsweredQuiz = async (submitAnswerReq : SubmitAnswerReq) => {
    return (await http.post(EXERCISE_API.GET_ANSWER_QUIZ, submitAnswerReq)).data
}

export const addStudentToCourse = async (courseId: string, studentData: Partial<Student>) => {
    // Simulate API call
    return new Promise((resolve) => {
        setTimeout(() => {
            // In a real API, this would add the student to the database
            resolve({
                data: {
                    ...studentData,
                    _id: `s${Math.floor(1000 + Math.random() * 9000)}`,
                    courses: [courseId],
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                },
                status: 201,
                statusText: 'Created'
            });
        }, 800);
    });
};

export const removeStudentFromCourse = async (courseId: string, studentId: string) => {
    // Simulate API call
    return new Promise((resolve) => {
        setTimeout(() => {
            // In a real API, this would remove the student from the course
            resolve({
                data: { message: 'Student removed successfully' },
                status: 200,
                statusText: 'OK'
            });
        }, 800);
    });
};

export const getStudentRankings = async (courseId: string) => {
    // Simulate API call with mock data
    return new Promise((resolve) => {
        setTimeout(() => {
            const rankedStudents = [...mockStudents]
                .filter(student => student.courses.includes(courseId))
                .sort((a, b) => (b.averageScore || 0) - (a.averageScore || 0))
                .map((student, index) => ({
                    ...student,
                    rank: index + 1
                }));

            resolve({
                data: rankedStudents,
                status: 200,
                statusText: 'OK'
            });
        }, 800);
    });
};

export const mockStudents: Student[] = [
    {
        _id: 's1001',
        email: 'nguyen.minh@example.com',
        username: 'minhng',
        name: 'Nguyễn Văn Minh',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
        role: 'student',
        createdAt: '2023-10-15T08:30:00.000Z',
        updatedAt: '2024-02-28T14:20:00.000Z',
        birthday: new Date('2002-05-12'),
        phonenumber: '0912345678',
        studentId: 'ST2023001',
        enrollmentDate: '2023-09-01',
        courses: ['course001', 'course002'],
        progress: [
            {
                courseId: 'course001',
                completedLessons: ['l001', 'l002', 'l003'],
                completionPercentage: 75,
                lastAccessDate: '2024-03-07T10:15:00.000Z'
            }
        ],
        grades: [
            {
                courseId: 'course001',
                lessonId: 'l001',
                exerciseId: 'ex001',
                score: 9.5,
                maxScore: 10,
                submittedAt: '2024-02-20T09:30:00.000Z'
            }
        ],
        attendance: [
            {
                date: '2024-03-06',
                status: 'present'
            },
            {
                date: '2024-03-07',
                status: 'present'
            }
        ],
        rank: 1,
        averageScore: 9.2
    },
    {
        _id: 's1002',
        email: 'le.thuy@example.com',
        username: 'thuyle',
        name: 'Lê Thị Thúy',
        avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
        role: 'student',
        createdAt: '2023-10-16T09:45:00.000Z',
        updatedAt: '2024-02-27T15:30:00.000Z',
        birthday: new Date('2003-08-23'),
        phonenumber: '0923456789',
        studentId: 'ST2023002',
        enrollmentDate: '2023-09-01',
        courses: ['course001'],
        progress: [
            {
                courseId: 'course001',
                completedLessons: ['l001', 'l002'],
                completionPercentage: 50,
                lastAccessDate: '2024-03-06T14:20:00.000Z'
            }
        ],
        grades: [
            {
                courseId: 'course001',
                lessonId: 'l001',
                exerciseId: 'ex001',
                score: 8.5,
                maxScore: 10,
                submittedAt: '2024-02-21T10:15:00.000Z'
            }
        ],
        attendance: [
            {
                date: '2024-03-06',
                status: 'present'
            },
            {
                date: '2024-03-07',
                status: 'late'
            }
        ],
        rank: 3,
        averageScore: 8.5
    },
    {
        _id: 's1003',
        email: 'tran.duc@example.com',
        username: 'ductran',
        name: 'Trần Văn Đức',
        avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
        role: 'student',
        createdAt: '2023-10-14T11:20:00.000Z',
        updatedAt: '2024-02-26T16:45:00.000Z',
        birthday: new Date('2002-11-05'),
        phonenumber: '0934567890',
        studentId: 'ST2023003',
        enrollmentDate: '2023-09-01',
        courses: ['course001', 'course002'],
        progress: [
            {
                courseId: 'course001',
                completedLessons: ['l001', 'l002', 'l003', 'l004'],
                completionPercentage: 90,
                lastAccessDate: '2024-03-07T09:40:00.000Z'
            }
        ],
        grades: [
            {
                courseId: 'course001',
                lessonId: 'l001',
                exerciseId: 'ex001',
                score: 9.0,
                maxScore: 10,
                submittedAt: '2024-02-22T11:00:00.000Z'
            }
        ],
        attendance: [
            {
                date: '2024-03-06',
                status: 'present'
            },
            {
                date: '2024-03-07',
                status: 'present'
            }
        ],
        rank: 2,
        averageScore: 9.0
    },
    {
        _id: 's1004',
        email: 'pham.anh@example.com',
        username: 'anhpham',
        name: 'Phạm Thị Anh',
        avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
        role: 'student',
        createdAt: '2023-10-18T10:30:00.000Z',
        updatedAt: '2024-02-25T14:15:00.000Z',
        birthday: new Date('2003-02-15'),
        phonenumber: '0945678901',
        studentId: 'ST2023004',
        enrollmentDate: '2023-09-02',
        courses: ['course001'],
        progress: [
            {
                courseId: 'course001',
                completedLessons: ['l001'],
                completionPercentage: 30,
                lastAccessDate: '2024-03-05T16:25:00.000Z'
            }
        ],
        grades: [
            {
                courseId: 'course001',
                lessonId: 'l001',
                exerciseId: 'ex001',
                score: 7.5,
                maxScore: 10,
                submittedAt: '2024-02-23T13:45:00.000Z'
            }
        ],
        attendance: [
            {
                date: '2024-03-06',
                status: 'absent'
            },
            {
                date: '2024-03-07',
                status: 'present'
            }
        ],
        rank: 4,
        averageScore: 7.5
    },
    {
        _id: 's1005',
        email: 'hoang.nam@example.com',
        username: 'namhoang',
        name: 'Hoàng Đức Nam',
        avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
        role: 'student',
        createdAt: '2023-10-17T12:40:00.000Z',
        updatedAt: '2024-02-24T17:30:00.000Z',
        birthday: new Date('2002-07-28'),
        phonenumber: '0956789012',
        studentId: 'ST2023005',
        enrollmentDate: '2023-09-02',
        courses: ['course001', 'course002'],
        progress: [
            {
                courseId: 'course001',
                completedLessons: ['l001', 'l002'],
                completionPercentage: 60,
                lastAccessDate: '2024-03-06T11:35:00.000Z'
            }
        ],
        grades: [
            {
                courseId: 'course001',
                lessonId: 'l001',
                exerciseId: 'ex001',
                score: 8.0,
                maxScore: 10,
                submittedAt: '2024-02-24T15:20:00.000Z'
            }
        ],
        attendance: [
            {
                date: '2024-03-06',
                status: 'late'
            },
            {
                date: '2024-03-07',
                status: 'present'
            }
        ],
        rank: 5,
        averageScore: 8.0
    }
];