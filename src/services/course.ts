import { COURSE_API } from '../constants/api.ts'
// @ts-ignore
import http from '@/services/http/http'
import { httpAuth, httpFile } from './http/httpAuth.ts'

export const getCourses = async (page: number, perPage: number, title: string) => {
    return (await http.get(COURSE_API.GET_COURSES, {
        params: { page, perPage, title },
    })).data
}

export const getCourseById = async (id: string) => {
    return (await http.get(COURSE_API.GET_COURSE_BY_ID + id)).data
}

export const addCourse = async (data: any) => {
    return (await httpFile.post(COURSE_API.CREATE_COURSE, data)).data
}
export const cloneCourse = async (formData: any) => {
    return (await httpFile.post(COURSE_API.CLONE_COURSE, formData)).data
}

export const deleteCourse = async (id: string) => {
    return await httpAuth.delete(COURSE_API.DELETE_COURSE + id)
}

export const editCourse = async (courseId: string, data: any) => {
    return (await httpFile.put(COURSE_API.UPDATE_COURSE + courseId, data)).data
}

export const getStudentByCourseId = async (id: string) => {
    return (await http.get(COURSE_API.GET_STUDENT_BY_COURSE_ID + id)).data
}

export const addStudent = async (data: any) => {
    return (await httpAuth.post(COURSE_API.ADD_STUDENT, data)).data
}

export const getCourseByUserId = async (userId: string) => {
    return (await httpAuth.get(COURSE_API.GET_COUESE_BY_STUDENT_ID + userId)).data
}

export const getCourseByTeacherId = async (userId: string) => {
    return (await httpAuth.get(COURSE_API.GET_COUESE_BY_TEACHER_ID + userId)).data
}
