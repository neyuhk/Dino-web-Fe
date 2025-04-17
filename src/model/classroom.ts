
import { User } from './model.ts'

export interface Exercise {
    _id: string;
    type: "quiz" | "test" | "file";
    lesson_id: string;
    time: number;
    title: string;
    description: string;
    score?: number;
    isCompleted: boolean;
    submittedAt?: string;
    end_date: Date;
    userSubmited: number;
    userInCourse: number;
}

export interface Quiz{
    _id: string;
    type_answer: 'multiple_choice' | 'one_choice';
    question: string;
    answers: string[];
    correct_answer: string[];
    image: string;
    index: number;
}

export interface Lesson {
    _id: string;
    title: string;
    description: string;
    video_url: string;
    status: string;
    images: string[];
    body: string;
    course_id: string;
    createdAt: string;
    updatedAt: string;
    unFinished: number;
    exercises: Exercise[];
    order: number;
    duration: number;
    isCompleted: boolean;
    progress: number;
    averageScore?: number;
    lastAccessedAt?: string;
}

export interface Assignment {
    id: string;
    courseId: string;
    lessonId: string;
    title: string;
    description: string;
    type: 'multiple_choice' | 'coding' | 'theory';
    dueDate: Date;
    totalPoints: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface Submission {
    id: string;
    assignmentId: string;
    studentId: string;
    content: string;
    status: 'submitted' | 'graded' | 'returned';
    score?: number;
    feedback?: string;
    submittedAt: Date;
    gradedAt?: Date;
}

export interface Teacher {
    _id: string;
    username: string;
    email: string;
    phonenumber: string;
    role: string;
    avatar: string[];
    birthday: Date;
}

export interface Course {
    _id: string;
    course_type: string;
    teacher_id: string;
    title: string;
    description: string;
    images: string[];
    start_date: string;
    end_date: string;
    certification: string;
    createdAt: string;
    updatedAt: string;
    progress: number;
    students: User[];
}

export interface Classroom {
    _id: string;
    name: string;
    images: string[];
    description: string;
    teacher_id: User;
    courses: Course[];
    createdAt: Date;
    updatedAt: Date;
    students: User[];
}

export interface Student extends User {
    studentId: string;
    enrollmentDate: string;
    courses: string[];
    progress: {
        courseId: string;
        completedLessons: string[];
        completionPercentage: number;
        lastAccessDate: string;
    }[];
    grades: {
        courseId: string;
        lessonId: string;
        exerciseId: string;
        score: number;
        maxScore: number;
        submittedAt: string;
    }[];
    attendance: {
        date: string;
        status: 'present' | 'absent' | 'late';
    }[];
    rank?: number;
    averageScore?: number;
}

export interface SubmitAnswerReq{
    questionId: string;
    exerciseId: string;
    lessonId: string;
    userId: string;
    answer: string[]
}

// Mock data for students

