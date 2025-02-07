import { createAsyncThunk } from '@reduxjs/toolkit'
import { AUTH_API, USER_API } from '@/constants/api'
import { getCurrentUser } from '@/services/user'
import { login, refreshToken } from '../services/auth.ts'
import { string } from 'blockly/core/utils'

export const loginAction = createAsyncThunk(
    AUTH_API.LOGIN,
    async (credentials: { email: string, password: string }, { rejectWithValue }) => {
        try {
            const res = await login(credentials)
            console.log(res)
            const accessToken = res.headers['Authorization'] || res.headers['authorization']
            return { data: res, accessToken }
        } catch (error) {
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
            return rejectWithValue(error.response.data)
        }
    },
)
