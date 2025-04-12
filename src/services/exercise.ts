import http from '@/services/http/http'
import httpFile from './http/httpFile.ts'
import {COURSE_API, EXERCISE_API, FORUM_API} from '../constants/api.ts'

export const getExerciseForTeacher = async (lessonId: string) => {
    return (await http.get(EXERCISE_API.GET_EXERCISE_FOR_TEACHER + lessonId)).data
}

export const getExerciseForStudent = async (lessonId: string, userId: string) => {
    return (await http.get(EXERCISE_API.GET_EXERCISE_FOR_STUDENT + lessonId + '/user/' + userId)).data
}
