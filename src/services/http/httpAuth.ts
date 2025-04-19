import axios, { AxiosInstance } from 'axios'
import { LOCAL_STORAGE_KEYS } from '../../constants/localStorageKey.ts'
import store from '../../stores'
import { refreshTokenAction } from '../../stores/authAction.ts'
import { logout } from '../../stores/authSlice.ts'
import { getLocalStorage } from '../../helpers/localStorageHelper.ts'

// Tạo instance httpAuth
const httpAuth: AxiosInstance = axios.create({
    withCredentials: true, // de gui cookie di
    baseURL: import.meta.env.VITE_APP_ROOT_API,
    // transformRequest: [
    //     // @ts-ignore
    //     function(data: any, headers: any) {
    //         return JSON.stringify(data)
    //     },
    // ],
    headers: {
        'Content-Type': 'application/json',
    },
})

// Tạo instance httpFile
const httpFile: AxiosInstance = axios.create({
    withCredentials: true,
    baseURL: import.meta.env.VITE_APP_ROOT_API,
    headers: {
        'Content-Type': 'multipart/form-data', // Dành cho upload file
    },
})

// luc nao bo di sau cung duoc
let refreshRetryCount = 0
const MAX_REFRESH_RETRY = 15 // Giới hạn 3 lần thử lại

// Hàm interceptor chung để thêm token
const addTokenInterceptor = (instance: AxiosInstance) => {
    instance.interceptors.request.use(
        (config) => {
            const token = getLocalStorage(LOCAL_STORAGE_KEYS.AUTHENTICATION_TOKEN)
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`
            }
            return config
        },
        (error) => Promise.reject(error),
    )

    // Xử lý response để refresh token nếu cần
    instance.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config
            if (originalRequest.url.includes('/refresh')) {
                store.dispatch(logout());
                console.error('Refresh token request failed, logging out');
                return Promise.reject(error);
            }
            if (
                error.response.status === 401 &&
                !originalRequest._retry &&
                refreshRetryCount < MAX_REFRESH_RETRY
            ) {
                originalRequest._retry = true
                refreshRetryCount += 1 // Tăng số lần retry
                try {
                    console.log('bd tim')
                    await store.dispatch(refreshTokenAction())
                    refreshRetryCount = 0
                    return instance(originalRequest)
                } catch (refreshError) {
                    console.error('Refresh token failed:', refreshError)
                    if (refreshRetryCount >= MAX_REFRESH_RETRY) {
                        // Đăng xuất nếu vượt quá số lần retry
                        store.dispatch(logout())
                        console.error('Max refresh retries reached, logging out')
                    }
                    store.dispatch(logout()) // Đăng xuất nếu refresh token thất bại
                    return Promise.reject(refreshError)
                }
            }
            refreshRetryCount = 0
            return Promise.reject(error)
        },
    )
}

// Áp dụng interceptor cho cả hai instance
addTokenInterceptor(httpAuth)
addTokenInterceptor(httpFile)

export { httpAuth, httpFile }
