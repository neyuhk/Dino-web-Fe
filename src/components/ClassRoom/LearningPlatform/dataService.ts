// dataService.ts
export const fetchData = async (section: string) => {
    // Giả lập dữ liệu có sẵn
    const mockData = {
        courses: [
            {
                id: 1,
                title: 'Lập trình Python cơ bản',
                description: 'Học lập trình Python từ cơ bản đến nâng cao với các bài tập thực hành.',
                imageUrl: 'src/assets/homepage/dino.png',
                lessons: 10,
            },
        ],
        assignments: [
            {
                id: 1,
                title: 'Bài tập 1: Cấu trúc điều kiện',
                dueDate: '20/01/2025',
                status: 'Chưa nộp',
            },
        ],
        grades: [
            {
                id: 1,
                assignment: 'Bài tập 1',
                grade: '9.5/10',
                comments: 'Bài làm tốt, cần cải thiện phần định dạng code',
            },
        ],
        profile: {
            fullName: 'Nguyễn Văn A',
            email: 'nguyenvana@example.com',
        },
    };

    // Trả về dữ liệu dựa trên section được yêu cầu
    return mockData[section] || [];
};
