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
    UPDATE_USERS: '/user/edit',
    FIND_USER: '/user/find',
    DELETE_USERS: '/user/',
    CHANGE_PASSWORD: '/user/change-password',
    CHANGE_ROLE: '/user/change-role',
}

export const PROJECT_API = {
    GET_PROJECTS: '/project',
    SEARCH_PROJECTS: '/project/search-type',
    GET_PROJECT_BY_ID: '/project/',
    GET_FAVORITE_PROJECTS: '/project/favorite/',
    CREATE_PROJECT: '/project',
    UPDATE_PROJECT: '/project/',
    DELETE_PROJECT: '/project/',
    LIKE_PROJECT: '/project/like',
    LIKE_PROJECT_CHECK: '/project/like/check',
    GET_PROJECT_BY_USER_ID: '/project/user/',
    GET_PROJECT_BY_TYPE: '/project/type/',
    CHANGE_PROJECT_TYPE: '/project/change-type',
    SET_FAVORITE_PROJECT: '/project/favorite',
    CLONE_PROJECT: '/project/clone',
}

export const COURSE_API = {
    GET_COURSES: '/course',
    GET_COURSE_BY_ID: '/course/',
    GET_COUESE_BY_STUDENT_ID: '/course/member/',
    GET_COUESE_BY_TEACHER_ID: '/course/teacher/',
    CREATE_COURSE: '/course',
    CLONE_COURSE: '/course/clone-course',
    UPDATE_COURSE: '/course/',
    DELETE_COURSE: '/course/',
    GET_STUDENT_BY_COURSE_ID: '/course/member/list-member/',
    ADD_STUDENT: '/course/add-student'
}

export const LESSON_API = {
    GET_LESSONS: '/lesson',
    GET_LESSONS_COURSE_ID: '/lesson/course/',
    GET_LESSONS_COURSE_ID_STUDENT: '/lesson/lesson-student/',
    GET_LESSON_BY_ID: '/lesson/',
    CREATE_LESSON: '/lesson/course/',
    UPDATE_LESSON: '/lesson/',
    DELETE_LESSON: '/lesson/',
}

export const SCORE_API = {
    GET_SCORES: '/score',
    GET_SCORE_BY_USER_ID: '/score/user/',
    GET_SCORE_BY_COURSE_ID: '/score/course/',
    GET_SCORE_BY_EXERCISE_ID: '/score/exercise/',
    GET_SUBMITTED_SCORE: '/quiz/get-submitted-quiz',
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
    GET_EXERCISE_DETAIL_FOR_TEACHER: 'quiz/exercise/teacher/',
    GET_EXERCISE_FOR_TEACHER: '/exercise/teacher/',
    GET_EXERCISE_FOR_STUDENT: 'exercise/lesson/', // +:lessonid/user/:userId
    EDIT_EXERCISE: '/exercise/',
    POST_QUIZ_FILE: '/quiz/import'
}

export const COMMENT_API = {
    GET_COMMENTS: '/comment/nguyen-comment/',
    GET_SUB_COMMENT: 'comment/nguyen-sub-comment',
    GET_COMMENT_BY_ID: '/comment/',
    CREATE_COMMENT: '/comment',
    UPDATE_COMMENT: '/comment/:id',
    DELETE_COMMENT: '/comment/',
    LIKE_COMMENT: '/comment/like/',
}

export const FORUM_API = {
    GET_MY_FORUMS: '/forum/user/',
    GET_FORUMS: '/forum/userId/',
    GET_FORUMS_ADMIN: '/forum',
    GET_FORUM_BY_ID: '/forum/',
    GET_LIKE_FORUM_BY_ID: '/forum/like/user/',
    GET_REPOST_FORUM_BY_ID: '/forum/repost/',
    GET_USER_LIKE_FORUM: '/forum/user-liked/',
    LIKE: '/forum/like',
    REPOST: '/forum/repost',
    CREATE_FORUM: '/forum',
    UPDATE_FORUM: '/forum/',
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

