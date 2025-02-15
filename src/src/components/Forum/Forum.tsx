// ForumPage.tsx
import React, { useEffect, useState } from 'react'
import { PlusCircle, Home, BookOpen, ThumbsUp, MessageSquare, Repeat, User } from 'lucide-react';
import styles from './Forum.module.css';
import Post from './Post/Post.tsx'
import { Forum, PostProps } from '../../model/model.ts'
import { useSelector } from 'react-redux'
import { getForums } from '../../services/forum.ts'
import { message } from 'antd'
import EmptyState from './EmptyState/EmptyState.tsx'
import CreatePostModal from './CreatePost/CreatePostModal.tsx'

interface MenuItem {
    id: string;
    icon: React.FC<{ size?: number; className?: string }>;
    label: string;
}

const ForumPage: React.FC = () => {
    const { user } = useSelector((state: any) => state.auth)
    const [selectedMenu, setSelectedMenu] = useState('home');
    const [forumList, setForumList] = useState<Forum[]>([])
    const [isLoading, setLoading] = useState(true)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let postList;
                if(selectedMenu == 'home'){
                    postList = await getForums(user._id)
                }
                setLoading(false)
                setForumList(postList.data)
                // setFilteredData(forums.data)
            } catch (error) {
                message.error('Failed to fetch forums')
                setLoading(false)
            }
        }
        console.log(selectedMenu)

        fetchData()
    }, [selectedMenu])


    const menuItems: MenuItem[] = [
        { id: 'home', icon: Home, label: 'Trang chủ' },
        { id: 'class', icon: BookOpen, label: 'Lớp học' },
        { id: 'liked', icon: ThumbsUp, label: 'Bài đăng đã thích' },
        { id: 'commented', icon: MessageSquare, label: 'Bài đăng đã bình luận' },
        { id: 'reposted', icon: Repeat, label: 'Bài đăng lại' },
        { id: 'me', icon: User, label: 'Nhà của tôi' },
    ];

    return (
        <div className={styles.container}>
            <CreatePostModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                userId={user._id}
                onSuccess={() => {
                        window.location.reload();
                }}
            />

            <div className={styles.navContainer}>
                <nav className={styles.desktopNav}>
                    <div className={styles.avatarContainer}>
                        <img
                            src={user.avatar}
                            alt="User Avatar"
                            className={styles.userAvatar}
                        />
                    </div>

                    <div className={styles.userName}>
                        <h2 className={styles.userNameText}>{user.name}</h2>
                    </div>

                    <button className={styles.createPostButton}
                            onClick={() => setIsCreateModalOpen(true)}>
                        <PlusCircle size={20} />
                        Tạo bài viết mới
                    </button>

                    <div className={styles.menuContainer}>
                        {menuItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setSelectedMenu(item.id)}
                                className={`${styles.menuItem} ${
                                    selectedMenu === item.id
                                        ? styles.menuItemActive
                                        : styles.menuItemInactive
                                }`}
                            >
                                <item.icon
                                    size={24}
                                    className={
                                        selectedMenu === item.id
                                            ? styles.menuIconActive
                                            : styles.menuIcon
                                    }
                                />
                                <span
                                    className={
                                        selectedMenu === item.id
                                            ? styles.menuTextActive
                                            : styles.menuText
                                    }
                                >
                                    {item.label}
                                </span>
                            </button>
                        ))}
                    </div>
                </nav>
            </div>

            <div className={styles.mainContent}>
                <div className={styles.mobileHeader}>
                    <img
                        src={user.avatar}
                        alt="User Avatar"
                        className={styles.avatar}
                    />
                    <button className={styles.mobileCreateButton}>
                        <PlusCircle size={24} />
                    </button>
                </div>

                <div className={styles.postsContainer}>
                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <p>Đang tải...</p>
                        </div>
                    ) : forumList.length > 0 ? (
                        forumList.map((post) => (
                            <Post key={post._id} {...post} />
                        ))
                    ) : (
                        <EmptyState selectedMenu={selectedMenu} />
                    )}
                </div>
            </div>

            <div className={styles.mobileNav}>
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setSelectedMenu(item.id)}
                        className={styles.menuItem}
                    >
                        <item.icon
                            size={24}
                            className={
                                selectedMenu === item.id
                                    ? styles.menuIconActive
                                    : styles.menuIcon
                            }
                        />
                    </button>
                ))}
            </div>
        </div>
    )
};

export default ForumPage;