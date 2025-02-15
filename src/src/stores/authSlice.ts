import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { getLocalStorage, putLocalStorage, removeLocalStorage } from '@/helpers/localStorageHelper'
import { LOCAL_STORAGE_KEYS } from '@/constants/localStorageKey'
import { getCurrentUserAction, loginAction, refreshTokenAction } from './authAction'

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        isAuthenticated: getLocalStorage(LOCAL_STORAGE_KEYS.IS_LOGIN) || false,
        user: JSON.parse(getLocalStorage(LOCAL_STORAGE_KEYS.INFO)) || null,
    },
    reducers: {
        logout: (state) => {
            state.isAuthenticated = false
            state.user = null
            removeLocalStorage(LOCAL_STORAGE_KEYS.INFO)
            removeLocalStorage(LOCAL_STORAGE_KEYS.IS_LOGIN)
            removeLocalStorage(LOCAL_STORAGE_KEYS.AUTHENTICATION_TOKEN)
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginAction.fulfilled, (state, action) => {
                // @ts-ignore
                //putLocalStorage(LOCAL_STORAGE_KEYS.AUTHENTICATION_TOKEN, action.payload.accessToken)
                console.log(action.payload)
                putLocalStorage(LOCAL_STORAGE_KEYS.AUTHENTICATION_TOKEN, action.payload.data.data.accessToken)
            })
            .addCase(getCurrentUserAction.fulfilled, (state, action) => {
                state.isAuthenticated = true
                putLocalStorage(LOCAL_STORAGE_KEYS.INFO, JSON.stringify(action.payload))
                putLocalStorage(LOCAL_STORAGE_KEYS.IS_LOGIN, true)
                state.user = action.payload
            })
            .addCase(refreshTokenAction.fulfilled, (state, action) => {
                putLocalStorage(LOCAL_STORAGE_KEYS.AUTHENTICATION_TOKEN, action.payload.data.accessToken)
            })
            .addCase(getCurrentUserAction.rejected, (state, action) => {
                // @ts-ignore
                // state.isAuthenticated = false
                // state.user = null
            })
    },
})

export const { logout } = authSlice.actions
export default authSlice.reducer
