import { PROJECT_API } from '../constants/api.ts'
import http from '@/services/http/http'

export const getProjects = async (page: number, perPage: number) => {
    return (await http.get(PROJECT_API.GET_PROJECTS, {
        params: { page, perPage }
    })).data;
};

export const getProjectById = async (id: string) => {
    return (await http.get(PROJECT_API.GET_PROJECT_BY_ID + id)).data
}

export const getListProjectsByUser = async (userId: string) => {
    return (await http.get(PROJECT_API.GET_PROJECT_BY_USER_ID + userId)).data
}

export const likeProject = async (projectId: string, userId: string) => {
    return await http.post(PROJECT_API.LIKE_PROJECT, {projectId, userId })
}

export const isLikedProject = async (projectId: string, userId: string) => {
    return (await http.post(PROJECT_API.LIKE_PROJECT_CHECK, {projectId, userId })).data
}

export const createProject = async (project: any) => {
    console.log(project)
    return await http.post(PROJECT_API.CREATE_PROJECT, project)
}

export const updateProject = async (project: any, projectId: string) => {
    return await http.put(PROJECT_API.UPDATE_PROJECT + projectId, project)
}

export const deleteProjectById = async (id: string) => {
    return await http.delete(PROJECT_API.DELETE_PROJECT + id)
}

export const getProjectByUserId = async (userId: string) => {
    return (await http.get(PROJECT_API.GET_PROJECT_BY_USER_ID + userId)).data
}

export const getProjectByType = async (type: string) => {
    return (await http.get(PROJECT_API.GET_PROJECT_BY_TYPE + type)).data
}

export const changeProjectType = async (projectId: string, type: string) => {
    return await http.post(PROJECT_API.CHANGE_PROJECT_TYPE, {projectId, type})
}
