import { Course } from '../model/course.ts'
export const mockCourses: Course[] = [
    {
        id: '1',
        title: 'Khóa Học Lập Trình Arduino Cơ Bản',
        description: 'Học lập trình Arduino từ con số 0 với phương pháp kéo thả trực quan.',
        imageUrl: '/arduino-basic.jpg',
        level: 'Beginner',
        startDate: '2025-02-01'
    },
    {
        id: '2',
        title: 'Arduino Nâng Cao - IoT Projects',
        description: 'Xây dựng các dự án IoT phức tạp với Arduino và sensors.',
        imageUrl: '/arduino-advanced.jpg',
        level: 'Advanced',
        startDate: '2025-02-15'
    },
    {
        id: '3',
        title: 'Lập Trình Robot với Arduino',
        description: 'Học cách tạo và điều khiển robot using Arduino.',
        imageUrl: '/arduino-robot.jpg',
        level: 'Intermediate',
        startDate: '2025-03-01'
    }
];

export const searchCourses = (query: string): Course[] => {
    const lowercaseQuery = query.toLowerCase();
    return mockCourses.filter(course =>
        course.title.toLowerCase().includes(lowercaseQuery) ||
        course.description.toLowerCase().includes(lowercaseQuery)
    );
};