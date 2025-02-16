// EmptyState.tsx
import React from 'react';
import { PlusCircle } from 'lucide-react';
import styles from './EmptyState.module.css';

interface EmptyStateProps {
    selectedMenu: string;
    isError?: boolean;
    errorMessage?: string;
}

interface StateContent {
    message: string;
    subMessage: string;
    image: string;
}
const EmptyState: React.FC<EmptyStateProps> = ({ selectedMenu, isError = false, errorMessage }) => {
    const getEmptyStateContent = (): StateContent => {
        if (isError) {
            return {
                message: 'Đã xảy ra lỗi',
                subMessage: errorMessage || 'Không thể tải dữ liệu. Vui lòng thử lại sau.',
                image: 'https://i.pinimg.com/originals/88/4f/6b/884f6bbb75ed5e1446d3b6151b53b3cf.gif' // Đường dẫn tới ảnh minh họa lỗi
            };
        }

        switch (selectedMenu) {
            case 'home':
                return {
                    message: 'Chưa có bài đăng nào trong feed của bạn',
                    subMessage: 'Hãy theo dõi thêm bạn bè để xem nhiều bài viết thú vị hơn',
                    image: '/images/empty-home.png'
                };
            case 'class':
                return {
                    message: 'Chưa có bài đăng nào từ lớp học',
                    subMessage: 'Tham gia các lớp học để kết nối với giáo viên và bạn học',
                    image: 'https://i.pinimg.com/originals/d1/e2/54/d1e25483fe75e83eb9ab17746c08b0a3.gif'
                };
            case 'liked':
                return {
                    message: 'Bạn chưa thích bài đăng nào',
                    subMessage: 'Những bài viết bạn thích sẽ xuất hiện ở đây',
                    image: 'https://i.pinimg.com/originals/ba/3b/f2/ba3bf24235bc88b8a1527825552436fd.gif'
                };
            case 'commented':
                return {
                    message: 'Bạn chưa có bình luận nào',
                    subMessage: 'Hãy tham gia thảo luận bằng cách để lại bình luận của bạn',
                    image: '/images/empty-comments.png'
                };
            case 'reposted':
                return {
                    message: 'Bạn chưa đăng lại bài viết nào',
                    subMessage: 'Chia sẻ những bài viết hay tới bạn bè của bạn',
                    image: 'https://i.pinimg.com/originals/77/a2/71/77a2719a5f9ade27941c879ae3c7bca9.gif'
                };
            case 'me':
                return {
                    message: 'Bạn chưa có bài đăng nào',
                    subMessage: 'Hãy chia sẻ những suy nghĩ đầu tiên của bạn',
                    image: 'https://i.pinimg.com/originals/fd/4e/c6/fd4ec63af1732c884583d80ec0957646.gif'
                };
            default:
                return {
                    message: 'Không có bài đăng nào',
                    subMessage: 'Vui lòng thử lại sau',
                    image: '/images/empty-default.png'
                };
        }
    };

    const content = getEmptyStateContent();

    return (
        <div className={styles.container}>
            <div className={styles.imageWrapper}>
                <img
                    src={content.image}
                    alt="Empty state illustration"
                    className={styles.image}
                />
            </div>

            <div className={styles.content}>
                <h3 className={styles.message}>
                    {content.message}
                </h3>
                <p className={styles.subMessage}>
                    {content.subMessage}
                </p>

                {selectedMenu === 'me' && !isError && (
                    <button className={styles.createButton}>
                        <PlusCircle size={18} />
                        Tạo bài viết đầu tiên
                    </button>
                )}
            </div>

            <div className={styles.decorations}>
                <div className={styles.decorationLeft}></div>
                <div className={styles.decorationRight}></div>
            </div>
        </div>
    );
};

export default EmptyState;