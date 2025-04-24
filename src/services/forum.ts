// @ts-ignore
import http from '@/services/http/http'
import { FORUM_API } from '../constants/api.ts'
import { httpAuth, httpFile } from './http/httpAuth.ts'

export const getForums = async (id: string, page: number, perPage: number) => {
    return (await http.get(`${FORUM_API.GET_FORUMS}${id}`, {
        params: {
            page,
            perPage,
        },
    })).data
}

export const getMyForums = async (_id: string, page: number, perPage: number) => {
    return (await http.get(`${FORUM_API.GET_MY_FORUMS}${_id}`, {
        params: {
            page,
            perPage,
        },
    })).data
}


export const deleteForum = async (id: string) => {
    return await httpAuth.delete(FORUM_API.DELETE_FORUM + id)
}

export const getForumById = async (id: string) => {
    return (await http.get(FORUM_API.GET_FORUM_BY_ID + id)).data
}

export const getForumAdmin = async (page: number, perPage: number, name: string) => {
    return (await http.get(FORUM_API.GET_FORUMS_ADMIN, {
        params: {
            page,
            perPage,
            name
        },
    })).data
}

export const getLikeForum = async (id: string, page: number, perPage: number) => {
    return (await http.get(`${FORUM_API.GET_LIKE_FORUM_BY_ID}${id}`, {
        params: {
            page,
            perPage,
        },
    })).data
}
export const getRepostForum = async (id: string, page: number, perPage: number) => {
    return (await http.get(`${FORUM_API.GET_REPOST_FORUM_BY_ID}${id}`, {
        params: {
            page,
            perPage,
        },
    })).data
}


export const likePost = async (forumId: string, userId: string) => {
    return (await httpAuth.post(FORUM_API.LIKE, { forumId, userId })).data
}

export const repost = async (forumId: string, userId: string) => {
    return (await httpAuth.post(FORUM_API.REPOST, { forumId, userId })).data
}

export const newForum = async (payload: any) => {
    return (await httpFile.post(FORUM_API.CREATE_FORUM, payload)).data
}

export const updateForum = async (id: string, payload: any) => {
    return (await httpFile.put(FORUM_API.UPDATE_FORUM + id, payload)).data
}

export const getUserLikeForum = async (forumId: string) => {
    return (await http.get(FORUM_API.GET_USER_LIKE_FORUM + forumId)).data
}
