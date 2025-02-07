export const AUTH_API = {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REGISTER: '/auth/register',
    REFRESH_TOKEN: '/auth/refresh-token',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESEND_CONFIRMATION: '/auth/resend-confirmation',
    CONFIRM_REGISTRATION: '/auth/confirm-registration',
}

export const USER_API = {
    GET_CURRENT_USER: '/user/me',
    GET_USERS: '/user',
    GET_USER_BY_ID: '/user/',
}

export const PROJECT_API = {
    GET_PROJECTS: '/project',
    GET_PROJECT_BY_ID: '/project/',
    CREATE_PROJECT: '/project',
    UPDATE_PROJECT: '/project/',
    DELETE_PROJECT: '/project/',
    LIKE_PROJECT: '/project/like',
    LIKE_PROJECT_CHECK: '/project/like/check',
    GET_PROJECT_BY_USER_ID: '/project/user/',
    GET_PROJECT_BY_TYPE: '/project/type/',
    CHANGE_PROJECT_TYPE: '/project/change-type',
}

export const COURSE_API = {
    GET_COURSES: '/course',
    GET_COURSE_BY_ID: '/course/',
    CREATE_COURSE: '/course',
    UPDATE_COURSE: '/course/',
    DELETE_COURSE: '/course/',
}

export const LESSON_API = {
    GET_LESSONS: '/lesson',
    GET_LESSONS_COURSE_ID: '/lesson/course/',
    GET_LESSON_BY_ID: '/lesson/:id',
    CREATE_LESSON: '/lesson/course/',
    UPDATE_LESSON: '/lesson/:id',
    DELETE_LESSON: '/lesson/:id',
}

export const COMMENT_API = {
    GET_COMMENTS: '/comment/all-comments/',

    GET_COMMENT_BY_ID: '/comment/',
    CREATE_COMMENT: '/comment',
    UPDATE_COMMENT: '/comment/:id',
    DELETE_COMMENT: '/comment/:id',
    LIKE_COMMENT: '/comment/like/',
}

export const FORUM_API = {
    GET_FORUMS: '/forum',
    GET_FORUM_BY_ID: '/forum/',
    CREATE_FORUM: '/forum',
    UPDATE_FORUM: '/forum/:id',
    DELETE_FORUM: '/forum/',
}
