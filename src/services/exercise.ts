// @ts-ignore
import http from '@/services/http/http'
import {COURSE_API, EXERCISE_API, FORUM_API} from '../constants/api.ts'
import { httpAuth, httpFile } from './http/httpAuth.ts'

export const getExerciseForTeacher = async (lessonId: string) => {
    return (await http.get(EXERCISE_API.GET_EXERCISE_FOR_TEACHER + lessonId)).data
}

export const editExercise = async (exerciseId: string, data: any) => {
    return (await httpAuth.put(EXERCISE_API.EDIT_EXERCISE + exerciseId, data)).data
}

export const getExerciseForStudent = async (lessonId: string, userId: string) => {
    return (await http.get(EXERCISE_API.GET_EXERCISE_FOR_STUDENT + lessonId + '/user/' + userId)).data
}

export const importQuizExcel = async (data: any) => {
    return (await httpFile.post(EXERCISE_API.POST_QUIZ_FILE, data)).data
}
