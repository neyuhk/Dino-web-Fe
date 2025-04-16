import { EXERCISE_API, SCORE_API } from '../constants/api.ts'
import http from './http/http.ts'

export const createScore = async (body: any) => {
    return (await http.post(SCORE_API.CREATE_SCORE, body)).data
}

export const getScoreForCourse = async (exerciseId: string) => {
    return (await http.get(SCORE_API.GET_SCORE_BY_COURSE_ID + exerciseId)).data
}

export const getScoreForExercise = async (exerciseId: string) => {
    return (await http.get(SCORE_API.GET_SCORE_BY_EXERCISE_ID + exerciseId)).data
}
