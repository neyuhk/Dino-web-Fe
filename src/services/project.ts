import { PROJECT_API } from '../constants/api.ts'
import http from '../services/http/http'
import { httpAuth, httpFile } from './http/httpAuth.ts'

export const getProjects = async (page: number, perPage: number, name: string, type: string) => {
    return (await http.get(PROJECT_API.GET_PROJECTS, {
        params: { page, perPage, name, type }
    })).data;
};
export const searchProject = async (page: number, perPage: number, name: string, is_mine: string, user_id: string) => {
    return (await http.get(PROJECT_API.SEARCH_PROJECTS, {
        params: { page, perPage, name, is_mine, user_id },
    })).data;
};
export const getFavoriteProjects = async (userId: string, page: number, perPage: number) => {
    return (
        await http.get(PROJECT_API.GET_FAVORITE_PROJECTS, {
            params: {
                userId,
                page,
                perPage
            }
        })
    ).data;
};

export const getProjectById = async (id: string) => {
    return (await http.get(PROJECT_API.GET_PROJECT_BY_ID + id)).data
}

export const getListProjectsByUser = async (userId: string, page: number = 1, perPage: number = 10) => {
    return (await http.get(`${PROJECT_API.GET_PROJECT_BY_USER_ID}${userId}`, {
        params: { page, perPage }
    })).data;
};


export const likeProject = async (projectId: string, userId: string) => {
    return await httpAuth.post(PROJECT_API.LIKE_PROJECT, {projectId, userId })
}

export const isLikedProject = async (projectId: string, userId: string) => {
    return (await httpAuth.post(PROJECT_API.LIKE_PROJECT_CHECK, {projectId, userId })).data
}

export const createProject = async (project: any) => {
    console.log(project)
    return await httpFile.post(PROJECT_API.CREATE_PROJECT, project)
}

export const updateProject = async (project: any, projectId: string) => {
    return await httpFile.put(PROJECT_API.UPDATE_PROJECT + projectId, project)
}

export const deleteProjectById = async (id: string) => {
    return await httpAuth.delete(PROJECT_API.DELETE_PROJECT + id)
}

export const getProjectByUserId = async (userId: string) => {
    return (await http.get(PROJECT_API.GET_PROJECT_BY_USER_ID + userId)).data
}

export const getProjectByType = async (type: string) => {
    return (await http.get(PROJECT_API.GET_PROJECT_BY_TYPE + type)).data
}

export const changeProjectType = async (projectId: string, type: string) => {
    return await httpAuth.post(PROJECT_API.CHANGE_PROJECT_TYPE, {projectId, type})
}

export const setFavoriteProject = async (projectId: string, userId: string) => {
    return await http.post(PROJECT_API.SET_FAVORITE_PROJECT, {userId, projectId})
}

export const cloneProject = async (projectId: string, userId: string) => {
    return await http.post(PROJECT_API.CLONE_PROJECT, {userId, projectId})
}
