import { COURSE_API, EXERCISE_API, FORUM_API, LESSON_API } from '../constants/api.ts'
// @ts-ignore
import http from '@/services/http/http'
import { Lesson, Quiz, Student, SubmitAnswerReq } from '../model/classroom.ts'
import { httpAuth, httpFile } from './http/httpAuth.ts'

export const getLessonByCourseId = async (id:string) => {
    return (await http.get(LESSON_API.GET_LESSONS_COURSE_ID + id)).data
}

export const getLessonById = async (id:string) => {
    return (await http.get(LESSON_API.GET_LESSON_BY_ID + id)).data
}

export const getLessonByCourseIdStudent = async (courseId: string, userId: string) => {
    return (
        await http.post(LESSON_API.GET_LESSONS_COURSE_ID_STUDENT, {
            courseId,
            userId,
        })
    ).data;
};
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
    return (await httpAuth.get(EXERCISE_API.GET_EXERCISE_DETAIL_FOR_TEACHER + exerciseId)).data
}

export const getAnsweredQuiz = async (submitAnswerReq : SubmitAnswerReq) => {
    return (await httpAuth.post(EXERCISE_API.GET_ANSWER_QUIZ, submitAnswerReq)).data
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
