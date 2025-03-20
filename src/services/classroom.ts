import { Assignment, Lesson, Student, Submission, User } from '../model/classroom.ts'
import { CLASSROOM_API, COURSE_API } from '../constants/api.ts'
import http from './http/http.ts'
import httpAuth from './http/httpAuth.ts'
// import { Course } from '../model/model.ts'

export const getClassroomList = async () => {
    return (await http.get(CLASSROOM_API.GET_CLASSROOMS)).data
}

export const getClassroomById = async (id: string) => {
    return (await http.get(CLASSROOM_API.GET_CLASSROOM_BY_ID + id)).data
}

export const getClassroomByTeacherId = async (id: string) => {
    return (await httpAuth.get(CLASSROOM_API.GET_CLASSROOM_BY_TEACHER_ID + id)).data
}

export const addClassroom = async (data: any) => {}

export const deleteClassroom = async (id: string) => {}

export const editClassroom = async (classroomId: string, data: any) => {}



