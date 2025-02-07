import { COURSE_API } from '../constants/api.ts'
import http from '@/services/http/http'
import httpFile from '@/services/http/httpFile'
import axios from 'axios'

export const getCourses = async () => {
    return (await http.get(COURSE_API.GET_COURSES)).data
}

export const getCourseById = async (id: string) => {
    return (await http.get(COURSE_API.GET_COURSE_BY_ID + id)).data
}

export const addCourse = async (data: any) => {
    // return await axios.post('http://localhost:8000/api/course', data, {
    //     headers: {
    //         'Content-Type': 'multipart/form-data'
    //     }
    // });
    return (await httpFile.post(COURSE_API.CREATE_COURSE, data)).data;
}

export const deleteCourse = async (id: string) => {
    return await http.delete(COURSE_API.DELETE_COURSE + id);
}

export const editCourse = async (courseId: string ,data: any) => {
    return (await httpFile.put(COURSE_API.UPDATE_COURSE + courseId, data)).data;
}
