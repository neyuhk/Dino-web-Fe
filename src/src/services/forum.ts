import http from '@/services/http/http'
import httpFile from './http/httpFile.ts'
import { COURSE_API, FORUM_API } from '../constants/api.ts'

export const getForums = async (id:string) => {
    return (await http.get(FORUM_API.GET_FORUMS + id)).data
}

export const deleteForum = async (id: string) => {
    return await http.delete(FORUM_API.DELETE_FORUM + id);
}

export const getForumById = async (id: string) => {
    return (await http.get(FORUM_API.GET_FORUM_BY_ID + id)).data
}

export const likePost = async (forumId: string, userId: string) => {
    return (await http.post(FORUM_API.LIKE , {forumId, userId})).data
}

export const repost = async (forumId: string, userId: string) => {
    return (await http.post(FORUM_API.REPOST , {forumId, userId})).data
}

export const newForum = async (payload : any) => {
    console.log('payload nekk',payload)
    return (await httpFile.post(FORUM_API.CREATE_FORUM, payload)).data
}

