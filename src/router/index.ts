import { PATHS, PATHS_ADMIN } from './path.ts'
// import HomePage from '@/pages/commons/HomePage.tsx'
// import LoginPage from '@/pages/commons/LoginPage.tsx'
// import RegisterPage from '@/pages/commons/RegisterPage.tsx'
// import DefaultLayout from '@/layouts/DefaultLayout.tsx'
// import NotAuthenticatedLayout from '@/layouts/NotAuthenticatedLayout.tsx'
import CoursePage from '../pages/commons/CoursePage.tsx'
import ProjectList from '../components/Project/ProjectList.tsx'
import ProjectDetail from '../components/Project/ProjectDetail.tsx'
import AdminLayout from '../layouts/AdminLayout.tsx'
import ListProjectManagement from '../page/Admin/ProjectManagement/ListProject.tsx'
import ListUserManagement from '../page/Admin/UserManagement/ListUser.tsx'
import ProjectDetailPage from '../page/Admin/ProjectManagement/ProjectDetail.tsx'
import ListCourseManagement from '../page/Admin/CourseManagement/ListCourse.tsx'
import CourseDetailPage from '../page/Admin/CourseManagement/CourseDetail.tsx'
import ListForumManagement from '../page/Admin/ForumManagement/ListForum.tsx'
import ForumDetail from '../page/Admin/ForumManagement/ForumDetail.tsx'
import AuthPage from '../pages/commons/AuthPage.tsx'
import BlocklyDemo from '../pages/BlocklyDemo/BlocklyDemo.tsx'
import BlocklyLayout from '../layouts/BlocklyLayout.tsx'
import UserDetail from '../page/Admin/UserManagement/UserDetail.tsx'
import BlocklyPage from '../pages/BlocklyDemo/BlocklyPage.tsx'
import ProjectPage from '../pages/commons/ProjectPage.tsx'
import NotAuthenticatedLayout from '../layouts/NotAuthenticatedLayout.tsx'
import DefaultLayout from '../layouts/DefaultLayout.tsx'
import HomePage from '../pages/commons/HomePage.tsx'
import LoginPage from '../pages/commons/LoginPage.tsx'
import RegisterPage from '../pages/commons/RegisterPage.tsx'
import ClassRoom from '../pages/commons/ClassRoom.tsx'
import ProfilePage from '../pages/commons/ProfilePage.tsx'
import ForumPage from '../pages/commons/ForumPage.tsx'
import ListClassroomManagement from '../page/Admin/ClassroomManagement/ListClassroom.tsx'
import ClassroomDetailPage from '../page/Admin/ClassroomManagement/ClassroomDetail.tsx'
import ClassroomDetail from '../components/ClassRoom/ClassroomDetail/ClassroomDetail.tsx'
import LessonList from '../components/ClassRoom/LessonList/LessonList.tsx'
import HeaderOnlyLayout from '../layouts/HeaderOnlyLayout.tsx'
import LearningChallengePage from '../pages/commons/LearningChallengePage.tsx'
import LearningChallenge from '../components/ClassRoom/LearningChallenge/LearningChallenge.tsx'

export const router = [
    {
        path: PATHS.HOME,
        component: HomePage,
        layout: DefaultLayout,
        meta: {
            requiresAuth: false,
        },
    },
    {
        path: PATHS.LOGIN,
        component: LoginPage,
        layout: NotAuthenticatedLayout,
        meta: {
            requiresAuth: false,
        },
    },
    {
        path: PATHS.AUTH,
        component: AuthPage,
        layout: NotAuthenticatedLayout,
        meta: {
            requiresAuth: false,
        },
    },
    {
        path: PATHS.REGISTER,
        component: RegisterPage,
        layout: NotAuthenticatedLayout,
        meta: {
            requiresAuth: false,
        },
    },
    {
        path: PATHS.COURSES,
        component: CoursePage,
        layout: DefaultLayout,
        meta: {
            requiresAuth: false,
        },
    },
    {
        path: PATHS.PROJECTS,
        component: ProjectPage,
        layout: DefaultLayout,
        meta: {
            requiresAuth: false,
        },
    },
    {
        path: PATHS.PROFILE,
        component: ProfilePage,
        layout: DefaultLayout,
        meta: {
            requiresAuth: false,
        },
    },
    {
        path: '/projectss',
        component: ProjectList,
        layout: DefaultLayout,
        meta: {
            requiresAuth: false,
        },
    },
    {
        path: PATHS.CLASSROOM,
        component: ClassRoom,
        layout: HeaderOnlyLayout,
        meta: {
            requiresAuth: false,
        },
    },
    {
        path: PATHS.CLASSROOM_DETAIL,
        component: ClassroomDetail,
        layout: HeaderOnlyLayout,
        meta: {
            requiresAuth: false,
        },
    },
    {
        path: PATHS.CLASSROOM_LESSON,
        component: LessonList,
        layout: HeaderOnlyLayout,
        meta: {
            requiresAuth: false,
        },
    },
    {
        path: PATHS.CLASSROOM_LEARNING,
        component: LearningChallenge,
        layout: HeaderOnlyLayout,
        meta: {
            requiresAuth: false,
        },
    },
    {
        path: PATHS.PROJECT_DETAIL,
        component: ProjectDetailPage, //ProjectDetail
        layout: DefaultLayout,
        meta: {
            requiresAuth: false,
        },
    },
    // {
    //     path: PATHS.BLOCKLY,
    //     component: BlocklyDemo,
    //     layout: BlocklyLayout,
    //     meta: {
    //         requiresAuth: false,
    //     },
    // },
    {
        path: PATHS.BLOCKLY,
        component: BlocklyPage,
        layout: NotAuthenticatedLayout,
        meta: {
            requiresAuth: false,
        },
    },
    {
        path: PATHS.BLOCKLY_PROJECT_ID,
        component: BlocklyPage,
        layout: NotAuthenticatedLayout,
        meta: {
            requiresAuth: false,
        },
    },
    {
        path: PATHS.FORUM,
        component: ForumPage,
        layout: DefaultLayout,
        meta: {
            requiresAuth: false,
        },
    },


    //admin
    {
        path: PATHS_ADMIN.HOME,
        component: ProjectList,
        layout: AdminLayout,
        meta: {
            requiresAuth: false,
        },
    },
    {
        path: PATHS_ADMIN.PROJECTS,
        component: ListProjectManagement,
        layout: AdminLayout,
        meta: {
            requiresAuth: false,
        },
    },
    {
        path: PATHS_ADMIN.PROJECT_DETAIL,
        component: ProjectDetailPage,
        layout: AdminLayout,
        meta: {
            requiresAuth: false,
        },
    },
    {
        path: PATHS_ADMIN.USERS,
        component: ListUserManagement,
        layout: AdminLayout,
        meta: {
            requiresAuth: false,
        },
    },
    {
        path: PATHS_ADMIN.USER_DETAIL,
        component: UserDetail,
        layout: AdminLayout,
        meta: {
            requiresAuth: false,
        },
    },
    {
        path: PATHS_ADMIN.COURSES,
        component: ListCourseManagement,
        layout: AdminLayout,
        meta: {
            requiresAuth: false,
        },
    },
    {
        path: PATHS_ADMIN.COURSES_DETAIL,
        component: CourseDetailPage,
        layout: AdminLayout,
        meta: {
            requiresAuth: false,
        },
    },

    {
        path: PATHS_ADMIN.FORUM,
        component: ListForumManagement,
        layout: AdminLayout,
        meta: {
            requiresAuth: false,
        },
    },
    {
        path: PATHS_ADMIN.FORUM_DETAIL,
        component: ForumDetail,
        layout: AdminLayout,
        meta: {
            requiresAuth: false,
        },
    },
    {
        path: PATHS_ADMIN.CLASSROOM,
        component: ListClassroomManagement,
        layout: AdminLayout,
        meta: {
            requiresAuth: false,
        },
    },
    {
        path: PATHS_ADMIN.CLASSROOM_DETAIL,
        component: ClassroomDetailPage,
        layout: AdminLayout,
        meta: {
            requiresAuth: false,
        },
    },

]
