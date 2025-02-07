import http from '@/services/http/http'
import { AUTH_API } from '../constants/api.ts'
import httpAuth from './http/httpAuth.ts'

export const login = async (payload: any) => {
    return await http.post(AUTH_API.LOGIN, payload)
}

export const logout = async () => {
    return await httpAuth.post(AUTH_API.LOGOUT)
}

export const register = async (payload: any) => {
    return await http.post(AUTH_API.REGISTER, payload)
}

export const refreshToken = async () => {
    return await httpAuth.post(AUTH_API.REFRESH_TOKEN)
}
