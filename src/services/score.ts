import { EXERCISE_API, SCORE_API } from '../constants/api.ts'
import http from './http/http.ts'
import httpAuth from './http/httpAuth.ts'

export const createScore = async (body: any) => {
    return (await http.post(SCORE_API.CREATE_SCORE, body)).data
}

export const getScoreForCourse = async (exerciseId: string) => {
    return (await http.get(SCORE_API.GET_SCORE_BY_COURSE_ID + exerciseId)).data
}

export const getScoreForExercise = async (exerciseId: string) => {
    return (await http.get(SCORE_API.GET_SCORE_BY_EXERCISE_ID + exerciseId)).data
}

export const editScore = async (scoreId: string, score: number) => {
    return (await httpAuth.put(SCORE_API.UPDATE_SCORE + scoreId, { score }))
        .data
}

export const deleteScore = async (scoreId: string) => {
    return (await httpAuth.delete(SCORE_API.DELETE_SCORE + scoreId)).data
}

export const getAnswerResultByExerciseAndUser = async (
    exerciseId: string,
    userId: string
) => {
    return (
        await http.post(SCORE_API.GET_SUBMITTED_SCORE, {
            exerciseId,
            userId,
        })
    ).data;
};

