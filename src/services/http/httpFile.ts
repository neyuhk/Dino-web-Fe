import axios from 'axios'

const httpFile = axios.create({
    withCredentials: true,
    // @ts-ignore
    baseURL: import.meta.env.VITE_APP_ROOT_API,
    headers: {
        'Content-Type': 'multipart/form-data',
    },
})

httpFile.interceptors.response.use(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    null,
    (error: any) => {
        if ([401, 403].includes(error.response.status)) {
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            // logout().then((r) => {console.log(r)})
        }
        return Promise.reject(error)
    },
)

export default httpFile
