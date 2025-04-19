import { createAsyncThunk } from '@reduxjs/toolkit'
// @ts-ignore
import { AUTH_API, USER_API } from '@/constants/api'
// @ts-ignore
import { getCurrentUser } from '@/services/user'
import { login, refreshToken } from '../services/auth.ts'
import { User } from '../model/model.ts'
export const UPDATE_USER = 'UPDATE_USER';
export const loginAction = createAsyncThunk(
    AUTH_API.LOGIN,
    async (credentials: { email: string, password: string }, { rejectWithValue }) => {
        try {
            const res = await login(credentials)
            console.log(res)
            const accessToken = res.headers['Authorization'] || res.headers['authorization']
            return { data: res, accessToken }
        } catch (error) {
            // @ts-ignore
            return rejectWithValue(error.response.data)
        }
    },
)

export const getCurrentUserAction = createAsyncThunk(
    USER_API.GET_CURRENT_USER,
    async (credentials, { rejectWithValue }) => {
        try {
            const res = await getCurrentUser()
            console.log(res)
            return res.data
        } catch (error) {
            // @ts-ignore
            return rejectWithValue(error.response.data)
        }
    },
)

export const refreshTokenAction = createAsyncThunk(
    AUTH_API.REFRESH_TOKEN,
    async (credentials, { rejectWithValue }) => {
        try {
            const res = await refreshToken()
            return res.data
        } catch (error) {
            // @ts-ignore
            return rejectWithValue(error.response.data)
        }
    },
)

// Action Creators
export const updateUser = (user: User) => {
    return {
        type: UPDATE_USER,
        payload: user
    };
};
