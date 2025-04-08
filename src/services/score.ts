import { EXERCISE_API, SCORE_API } from '../constants/api.ts'
import http from './http/http.ts'

export const createScore = async (body: any) => {
    return (await http.post(SCORE_API.CREATE_SCORE, body)).data
}