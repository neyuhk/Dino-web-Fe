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
    FIND_USER: '/user/find',
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
    GET_COUESE_BY_STUDENT_ID: '/course/member/',
    GET_COUESE_BY_TEACHER_ID: '/course/teacher/',
    CREATE_COURSE: '/course',
    UPDATE_COURSE: '/course/',
    DELETE_COURSE: '/course/',
    GET_STUDENT_BY_COURSE_ID: '/course/member/list-member/',
    ADD_STUDENT: '/course/add-student'
}

export const LESSON_API = {
    GET_LESSONS: '/lesson',
    GET_LESSONS_COURSE_ID: '/lesson/course/',
    GET_LESSON_BY_ID: '/lesson/:id',
    CREATE_LESSON: '/lesson/course/',
    UPDATE_LESSON: '/lesson/',
    DELETE_LESSON: '/lesson/',
}

export const SCORE_API = {
    GET_SCORES: '/score',
    GET_SCORE_BY_USER_ID: '/score/user/',
    GET_SCORE_BY_LESSON_ID: '/score/lesson/',
    GET_SCORE_BY_EXERCISE_ID: '/score/exercise/',
    CREATE_SCORE: '/score',
    UPDATE_SCORE: '/score/',
    DELETE_SCORE: '/score/',
}

export const EXERCISE_API = {
    NEW_EXERCISE: '/exercise',
    GET_QUIZ: '/quiz',
    ADD_QUIZ: '/quiz',
    DELETE_QUIZ: '/quiz/delete/',
    DELETE_EXERCISE: '/exercise/',
    GET_QUIZ_BY_EXERCISE_ID: '/quiz/exercise/',
    GET_ANSWER_QUIZ: '/quiz/answer',
    GET_EXERCISE_FOR_TEACHER: 'quiz/exercise/teacher/',
}

export const COMMENT_API = {
    GET_COMMENTS: '/comment/all-comments/',

    GET_COMMENT_BY_ID: '/comment/',
    CREATE_COMMENT: '/comment',
    UPDATE_COMMENT: '/comment/:id',
    DELETE_COMMENT: '/comment/',
    LIKE_COMMENT: '/comment/like/',
}

export const FORUM_API = {
    GET_FORUMS: '/forum/userId/',
    GET_FORUM_BY_ID: '/forum/',
    GET_LIKE_FORUM_BY_ID: '/forum/like/user/',
    GET_REPOST_FORUM_BY_ID: '/forum/repost/',
    LIKE: '/forum/like',
    REPOST: '/forum/repost',
    CREATE_FORUM: '/forum',
    UPDATE_FORUM: '/forum/:id',
    DELETE_FORUM: '/forum/',
}

export const CLASSROOM_API = {
    GET_CLASSROOMS: '/classroom',
    GET_CLASSROOM_BY_ID: '/classroom/',
    CREATE_CLASSROOM: '/classroom',
    UPDATE_CLASSROOM: '/classroom/:id',
    DELETE_CLASSROOM: '/classroom/',
    JOIN_CLASSROOM: '/classroom/join',
    LEAVE_CLASSROOM: '/classroom/leave',
    GET_CLASSROOM_BY_USER_ID: '/classroom/user/',
    GET_CLASSROOM_BY_TEACHER_ID: '/classroom/teacher/',
    GET_CLASSROOM_BY_COURSE_ID: '/classroom/course/',
}

