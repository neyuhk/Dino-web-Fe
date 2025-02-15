export interface Course {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced';
    startDate: string;
}

export interface SearchProps {
    onSearch: (query: string) => void;
    placeholder?: string;
}

export interface SectionProps {
    title: string;
    description: string;
    imageUrl: string;
}

export interface CourseCardProps {
    course: Course;
}

