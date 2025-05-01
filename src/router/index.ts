import { PATHS, PATHS_ADMIN } from './path.ts'
// import HomePage from '@/pages/commons/HomePage.tsx'
// import LoginPage from '@/pages/commons/LoginPage.tsx'
// import RegisterPage from '@/pages/commons/RegisterPage.tsx'
// import DefaultLayout from '@/layouts/DefaultLayout.tsx'
// import NotAuthenticatedLayout from '@/layouts/NotAuthenticatedLayout.tsx'
import CoursePage from '../pages/commons/CoursePage.tsx'
import ProjectList from '../components/Admin/ProjectList/ProjectList.tsx'
import ProjectDetail from '../components/Project/ProjectDetail.tsx'
import AdminLayout from '../layouts/AdminLayout.tsx'
import ListProjectManagement from '../pages/Admin/ProjectManagement/ListProject.tsx'
import ListUserManagement from '../pages/Admin/UserManagement/ListUser.tsx'
import ProjectDetailPage from '../pages/Admin/ProjectManagement/ProjectDetail.tsx'
import ListCourseManagement from '../pages/Admin/CourseManagement/ListCourse.tsx'
import CourseDetailPage from '../pages/Admin/CourseManagement/CourseDetail.tsx'
import ListForumManagement from '../pages/Admin/ForumManagement/ListForum.tsx'
import ForumDetail from '../pages/Admin/ForumManagement/ForumDetail.tsx'
import AuthPage from '../pages/commons/AuthPage.tsx'
import UserDetail from '../pages/Admin/UserManagement/UserDetail.tsx'
import BlocklyPage from '../pages/BlocklyDemo/BlocklyPage.tsx'
import ProjectPage from '../pages/commons/ProjectPage.tsx'
import NotAuthenticatedLayout from '../layouts/NotAuthenticatedLayout.tsx'
import DefaultLayout from '../layouts/DefaultLayout.tsx'
import HomePage from '../pages/commons/HomePage.tsx'
import ClassRoom from '../pages/commons/ClassRoom.tsx'
import ProfilePage from '../pages/commons/ProfilePage.tsx'
import ForumPage from '../pages/commons/ForumPage.tsx'
import ClassroomDetail from '../components/ClassRoom/ClassroomDetail/ClassroomDetail.tsx'
import LessonList from '../components/ClassRoom/LessonList/LessonList.tsx'
import HeaderOnlyLayout from '../layouts/HeaderOnlyLayout.tsx'
import LearningChallenge from '../components/ClassRoom/LessonList/LessonDetail/LearningChallenge/LearningChallenge.tsx'
import CourseDetail from '../components/ClassRoom/Teacher/CourseLessons/CourseDetail.tsx'
import LessonDetail from '../components/ClassRoom/Teacher/LessonDetail/LessonDetail.tsx'
import ExamplePage from '../components/ClassRoom/Teacher/LessonDetail/ExerciseForm/ExampleUsage.tsx'
import ExerciseDetail from '../components/ClassRoom/Teacher/LessonDetail/ExerciseDetail/ExerciseDetail.tsx'
import LessonStudentDetail from '../components/ClassRoom/LessonList/LessonDetail/LessonStudentDetail.tsx'
import AboutUsPage from '../pages/commons/AboutUsPage.tsx'
import HomePage2 from '../components/Homepage/HomePage2.tsx'
import OurProduct from '../components/OurProduct/OurProduct.tsx'
import AdminDashboard from '../pages/Admin/AdminDashboard.tsx'


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
        path: PATHS.HOME2,
        component: HomePage2,
        layout: DefaultLayout,
        meta: {
            requiresAuth: false,
        },
    },
    {
        path: PATHS.ABOUT_US,
        component: AboutUsPage,
        layout: DefaultLayout,
        meta: {
            requiresAuth: false,
        },
    },
    {
        path: PATHS.OUR_PRODUCT,
        component: OurProduct,
        layout: DefaultLayout,
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
        path: PATHS.CLASSROOM_LESSON_DETAIL,
        component: LessonStudentDetail,
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
        component: ProjectDetail,
        layout: DefaultLayout,
        meta: {
            requiresAuth: false,
        },
    },
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
        layout: HeaderOnlyLayout,
        meta: {
            requiresAuth: false,
        },
    },
    //teacher
    {
        path: PATHS.TEACHER_COURSES,
        component: CourseDetail,
        layout: HeaderOnlyLayout,
        meta: {
            requiresAuth: false,
        }
    },
    {
        path: PATHS.TEACHER_LESSON,
        component: LessonDetail,
        layout: HeaderOnlyLayout,
        meta: {
            requiresAuth: false,
        }
    },
    {
        path: PATHS.TEACHER_NEW_EXERCISE,
        component: ExamplePage,
        layout: HeaderOnlyLayout,
        meta: {
            requiresAuth: false,
        }
    },
    {
        path: PATHS.TEACHER_EXERCISE_DETAIL,
        component: ExerciseDetail,
        layout: HeaderOnlyLayout,
        meta: {
            requiresAuth: false,
        }
    },

    //admin
    {
        path: PATHS_ADMIN.HOME,
        component: AdminDashboard,
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
        path: PATHS_ADMIN.LESSON_DETAIL,
        component: LessonDetail,
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
]
