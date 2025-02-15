import axios from 'axios'

const http = axios.create({
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

http.interceptors.response.use(
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

export default http
