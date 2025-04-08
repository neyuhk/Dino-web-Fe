//import http from '@/services/http/http'
import http from './http/http'
import httpAuth from './http/httpAuth'
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

export const findUser = async (query: string) => {
    return (await httpAuth.get(USER_API.FIND_USER, {
        params: { search: query }
    })).data;
};

