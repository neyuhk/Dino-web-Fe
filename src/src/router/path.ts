export const PATHS = {
    HOME: '/',

    //athentication
    LOGIN: '/login',
    REGISTER: '/register',
    AUTH: '/auth',
    REFRESH_TOKEN: '/refresh-token',

    //projects
    PROJECTS: '/projects',
    PROJECT_DETAIL: '/projects/project-detail/:projectId',

    //courses
    COURSES: '/courses',

    //forum
    FORUM: '/forum',

    //profile
    PROFILE: '/profile',

    //blockly
    BLOCKLY: '/blockly',
    BLOCKLY_PROJECT_ID: '/blockly/:projectId',

    // //classroom
    // PROJECTS: '/classroom',
    // PROJECT_DETAIL: '/projects/project-detail/:projectId',

}

export const PATHS_ADMIN = {
    HOME: '/admin',
    // LOGIN: '/admin/login',
    // REGISTER: '/admin/register',
    PROJECTS: '/admin/projects',
    PROJECT_DETAIL: '/admin/project/detail/:projectId',

    USERS: '/admin/users',
    USER_DETAIL: '/admin/user/detail/:userId',

    COURSES: '/admin/courses',
    COURSES_DETAIL: '/admin/course/detail/:courseId',

    FORUM: '/admin/forum',
    FORUM_DETAIL: '/admin/forum/detail/:forumId',

    CLASSROOM: '/admin/classroom',
    CLASSROOM_DETAIL: '/admin/classroom/detail/:classroomId',
}
