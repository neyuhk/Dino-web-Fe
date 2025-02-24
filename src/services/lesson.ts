import { COURSE_API, LESSON_API } from '../constants/api.ts'
import http from '@/services/http/http'
import httpFile from '@/services/http/httpFile'
import { Lesson, Quiz } from '../model/classroom.ts'

// export const getLessonByCourseId = async (id: string) => {
//     return (await http.get(LESSON_API.GET_LESSONS_COURSE_ID+id)).data
// }

export const getLessonByCourseId = async (courseId: string): Promise<Lesson[]> => {
    return [
        {
            id: 'lesson-1',
            title: 'Introduction to Arduino',
            description: 'Learn the basics of Arduino and how it works.',
            video_url: 'https://example.com/arduino-intro.mp4',
            images: ['https://example.com/lesson1-img1.jpg'],
            body: 'Detailed content about Arduino basics...',
            course_id: { id: courseId, title: 'Arduino Basics' },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            exercises: [
                {
                    id: 'exercise-1',
                    type: 'quiz',
                    title: 'Blink LED',
                    description: 'Write a program to blink an LED on Arduino.',
                    isCompleted: false,
                    time: 60, // Thời gian làm bài 60 giây cho từng câu quiz
                },
                {
                    id: 'exercise-2',
                    type: 'quiz',
                    title: 'Basic Circuit',
                    description: 'Identify the components in a basic circuit.',
                    isCompleted: false,
                    time: 90, // 90 giây cho bài quiz này
                },
            ],
            order: 1,
            duration: 30,
            isCompleted: false,
            progress: 0,
            averageScore: undefined,
            lastAccessedAt: undefined,
        },
        {
            id: 'lesson-2',
            title: 'Working with Sensors',
            description: 'Understand how to use sensors with Arduino.',
            video_url: 'https://example.com/arduino-sensors.mp4',
            images: ['https://example.com/lesson2-img1.jpg'],
            body: 'Guide on how to connect and use different sensors...',
            course_id: { id: courseId, title: 'Arduino Basics' },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            exercises: [
                {
                    id: 'exercise-3',
                    type: 'test',
                    title: 'Read Temperature',
                    description: 'Read and display temperature from a sensor.',
                    score: 10,
                    isCompleted: true,
                    submittedAt: new Date().toISOString(),
                    time: 300, // Thời gian 300 giây cho toàn bộ bài test
                },
            ],
            order: 2,
            duration: 45,
            isCompleted: true,
            progress: 100,
            averageScore: 10,
            lastAccessedAt: new Date().toISOString(),
        },
    ];
};


export const addLesson = async (courseId: string, lesson: any) => {
    console.log(courseId)
    console.log(lesson.entries())
    return await httpFile.post(LESSON_API.CREATE_LESSON+courseId, lesson);
}

export const getQuizByExerciseId = async (exerciseId: string) => {
    return [
        {
            id: 'quiz1',
            typeAnswer: 'one_choice' as "multiple_choice" | "one_choice",
            question: '2 + 3 bằng bao nhiêu?',
            answer: ["4", "Ba", "Năm", "Sáu"],
            image: '',
            index: 0,
        },
        {
            id: 'quiz2',
            typeAnswer: 'one_choice' as "multiple_choice" | "one_choice",
            question: 'Hành tinh nào được gọi là Hành tinh Đỏ?',
            answer: ["Trái Đất", "Sao Hỏa", "Sao Mộc", "Sao Kim"],
            image: '',
            index: 1,
        },
        {
            id: 'quiz3',
            typeAnswer: 'multiple_choice' as "multiple_choice" | "one_choice",
            question: 'Những loài động vật nào có thể bay?',
            answer: ["Đại bàng", "Chim cánh cụt", "Dơi", "Cá heo"],
            image: '',
            index: 2,
        },
        {
            id: 'quiz4',
            typeAnswer: 'one_choice' as "multiple_choice" | "one_choice",
            question: 'Trên Trái Đất có bao nhiêu châu lục?',
            answer: ["5", "6", "7", "8"],
            image: '',
            index: 3,
        },
        {
            id: 'quiz5',
            typeAnswer: 'one_choice' as "multiple_choice" | "one_choice",
            question: 'Ai là tác giả của vở kịch "Romeo và Juliet"?',
            answer: ["Shakespeare", "Hemingway", "Tolstoy", "Dickens"],
            image: '',
            index: 4,
        },
        {
            id: 'quiz6',
            typeAnswer: 'multiple_choice' as "multiple_choice" | "one_choice",
            question: 'Những ngôn ngữ lập trình nào dưới đây là đúng?',
            answer: ["Python", "Java", "HTML", "CSS"],
            image: '',
            index: 5,
        },
        {
            id: 'quiz7',
            typeAnswer: 'one_choice' as "multiple_choice" | "one_choice",
            question: 'Thủ đô của Nhật Bản là gì?',
            answer: ["Seoul", "Bắc Kinh", "Tokyo", "Bangkok"],
            image: '',
            index: 6,
        },
        {
            id: 'quiz8',
            typeAnswer: 'one_choice' as "multiple_choice" | "one_choice",
            question: 'Đại dương nào lớn nhất trên Trái Đất?',
            answer: ["Đại Tây Dương", "Ấn Độ Dương", "Thái Bình Dương", "Bắc Băng Dương"],
            image: '',
            index: 7,
        }
    ];

}

export const getNextQuiz = async (index: number) => {
    return [
        {
            id: 'quiz1',
            typeAnswer: 'one_choice' as "multiple_choice" | "one_choice",
            question: '2 + 3 bằng bao nhiêu?',
            answer: ["4", "Ba", "Năm", "Sáu"],
            image: '',
            index: 0,
        },
        {
            id: 'quiz2',
            typeAnswer: 'one_choice' as "multiple_choice" | "one_choice",
            question: 'Hành tinh nào được gọi là Hành tinh Đỏ?',
            answer: ["Trái Đất", "Sao Hỏa", "Sao Mộc", "Sao Kim"],
            image: '',
            index: 1,
        },
        {
            id: 'quiz3',
            typeAnswer: 'multiple_choice' as "multiple_choice" | "one_choice",
            question: 'Những loài động vật nào có thể bay?',
            answer: ["Đại bàng", "Chim cánh cụt", "Dơi", "Cá heo"],
            image: '',
            index: 2,
        },
        {
            id: 'quiz4',
            typeAnswer: 'one_choice' as "multiple_choice" | "one_choice",
            question: 'Trên Trái Đất có bao nhiêu châu lục?',
            answer: ["5", "6", "7", "8"],
            image: '',
            index: 3,
        },
        {
            id: 'quiz5',
            typeAnswer: 'one_choice' as "multiple_choice" | "one_choice",
            question: 'Ai là tác giả của vở kịch "Romeo và Juliet"?',
            answer: ["Shakespeare", "Hemingway", "Tolstoy", "Dickens"],
            image: '',
            index: 4,
        },
        {
            id: 'quiz6',
            typeAnswer: 'multiple_choice' as "multiple_choice" | "one_choice",
            question: 'Những ngôn ngữ lập trình nào dưới đây là đúng?',
            answer: ["Python", "Java", "HTML", "CSS"],
            image: '',
            index: 5,
        },
        {
            id: 'quiz7',
            typeAnswer: 'one_choice' as "multiple_choice" | "one_choice",
            question: 'Thủ đô của Nhật Bản là gì?',
            answer: ["Seoul", "Bắc Kinh", "Tokyo", "Bangkok"],
            image: '',
            index: 6,
        },
        {
            id: 'quiz8',
            typeAnswer: 'one_choice' as "multiple_choice" | "one_choice",
            question: 'Đại dương nào lớn nhất trên Trái Đất?',
            answer: ["Đại Tây Dương", "Ấn Độ Dương", "Thái Bình Dương", "Bắc Băng Dương"],
            image: '',
            index: 7,
        }
    ];


    // return quizzes;
};

export const getAnsweredQuiz = async (quizId: string) => {
    return "1000"
}
