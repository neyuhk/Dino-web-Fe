import { COURSE_API, LESSON_API } from '../constants/api.ts'
import http from '@/services/http/http'
import httpFile from '@/services/http/httpFile'

export const getLessonByCourseId = async (id: string) => {
    return (await http.get(LESSON_API.GET_LESSONS_COURSE_ID+id)).data
}

export const addLesson = async (courseId: string, lesson: any) => {
    console.log(courseId)
    console.log(lesson.entries())
    return await httpFile.post(LESSON_API.CREATE_LESSON+courseId, lesson);
}
