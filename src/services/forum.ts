import http from '@/services/http/http'
import httpFile from './http/httpFile.ts'
import { COURSE_API, FORUM_API } from '../constants/api.ts'
import httpAuth from './http/httpAuth.ts'

export const getForums = async (id: string, page: number, perPage: number) => {
    return (
        await http.get(`${FORUM_API.GET_FORUMS}${id}`, {
            params: {
                page,
                perPage,
            },
        })
    ).data;
};

export const getMyForums = async (_id: string, page: number, perPage: number) => {
    return (
        await http.get(`${FORUM_API.GET_MY_FORUMS}${_id}`, {
            params: {
                page,
                perPage,
            },
        })
    ).data;
};


export const deleteForum = async (id: string) => {
    return await httpAuth.delete(FORUM_API.DELETE_FORUM + id);
}

export const getForumById = async (id: string) => {
    return (await http.get(FORUM_API.GET_FORUM_BY_ID + id)).data
}

export const getLikeForum = async (id: string, page: number, perPage: number) => {
    return (
        await http.get(`${FORUM_API.GET_LIKE_FORUM_BY_ID}${id}`, {
            params: {
                page,
                perPage,
            },
        })
    ).data;
};
export const getRepostForum = async (id: string, page: number, perPage: number) => {
    return (
        await http.get(`${FORUM_API.GET_REPOST_FORUM_BY_ID}${id}`, {
            params: {
                page,
                perPage,
            },
        })
    ).data;
};


export const likePost = async (forumId: string, userId: string) => {
    return (await http.post(FORUM_API.LIKE , {forumId, userId})).data
}

export const repost = async (forumId: string, userId: string) => {
    return (await http.post(FORUM_API.REPOST , {forumId, userId})).data
}

export const newForum = async (payload : any) => {
    return (await httpFile.post(FORUM_API.CREATE_FORUM, payload)).data
}

