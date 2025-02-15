import axios from 'axios'
import { LOCAL_STORAGE_KEYS } from '../../constants/localStorageKey.ts'
import { refreshTokenAction } from '../../stores/authAction.ts'
import { logout } from '../../stores/authSlice.ts'
import store from '../../stores'


const httpAuth = axios.create({
    withCredentials: true,
    // @ts-ignore
    baseURL: import.meta.env.VITE_APP_ROOT_API,
    transformRequest: [
        // @ts-ignore
        function(data: any, headers: any) {
            return JSON.stringify(data)
        },
    ],
    headers: {
        'Content-Type': 'application/json',
    },
})

httpAuth.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(LOCAL_STORAGE_KEYS.AUTHENTICATION_TOKEN)
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    },
)

httpAuth.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true
            try {
                console.log('bd tim')
                await store.dispatch(refreshTokenAction())
                return httpAuth(originalRequest)
            } catch (err) {
                await store.dispatch(logout())
                return Promise.reject(err)
            }
        }
        return Promise
    }
)

// httpAuth.interceptors.response.use(
//     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//     // @ts-ignore
//     null,
//     (error: any) => {
//         if ([401, 403].includes(error.response.status)) {
//             // eslint-disable-next-line @typescript-eslint/no-empty-function
//             logout().then((r) => {console.log(r)})
//         }
//         return Promise.reject(error)
//     },
// )

export default httpAuth
