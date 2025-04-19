//import http from '@/services/http/http'
import http from './http/http'
import { httpAuth, httpFile } from './http/httpAuth'
import { USER_API } from '../constants/api'

export const getCurrentUser = async () => {
    return (await httpAuth.get(USER_API.GET_CURRENT_USER)).data
}

export const getUsers = async () => {
    return (await http.get(USER_API.GET_USERS)).data.data
}

export const getUserById = async (id: string) => {
    return (await httpAuth.get(USER_API.GET_USER_BY_ID + id)).data
}

export const editUser = async (data: any) => {
    return await httpFile.put(USER_API.UPDATE_USERS, data)
}
export const findUser = async (query: string, page: number, perPage: number) => {
    return (
        await httpAuth.get(USER_API.FIND_USER, {
            params: {
                search: query,
                page,
                perPage
            }
        })
    ).data;
};

export const deleteUser = async (id: string) => {
    return await httpAuth.delete(USER_API.DELETE_USERS + id)
}

export const changePassword = async (data: any) => {
    return await httpAuth.post(USER_API.CHANGE_PASSWORD, data)
}

export const changeRole = async (userId: string, role: string) => {
    return await httpAuth.put(USER_API.CHANGE_ROLE, { userId, role })
}
