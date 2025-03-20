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

    //classroom
    CLASSROOM: '/classroom',
    CLASSROOM_DETAIL: '/classroom/detail',
    CLASSROOM_LESSON: '/classroom/courses',
    CLASSROOM_LESSON_DETAIL: '/classroom/courses/lesson/:id',
    CLASSROOM_LEARNING: '/classroom/courses/learning',

    //teacher
    TEACHER_COURSES: '/classroom/courses/:courseId',
    TEACHER_LESSON: '/classroom/courses/:courseId/lesson/:lessonId',
    TEACHER_NEW_EXERCISE: '/classroom/courses/:courseId/lesson/:lessonId/new_exercise',
    TEACHER_EXERCISE_DETAIL: '/classroom/courses/:courseId/lesson/:lessonId/:exerciseId'

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
