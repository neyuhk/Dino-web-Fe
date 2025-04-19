import React, { useEffect, useRef, useState } from 'react'
import {
    PlusCircle,
    Home,
    BookOpen,
    ThumbsUp,
    MessageSquare,
    Repeat,
    User,
    ChevronDown,
    Loader,
    LucideIcon,
} from 'lucide-react'
import styles from './Forum.module.css';
import Post from './Post/Post.tsx'
import { Forum } from '../../model/model.ts';
import { useSelector } from 'react-redux';
import { getForums, getLikeForum, getMyForums, getRepostForum } from '../../services/forum.ts'
import { message, Drawer } from 'antd';
import EmptyState from './EmptyState/EmptyState.tsx'
import CreatePostModal from './CreatePost/CreatePostModal.tsx'

interface MenuItem {
    id: string;
    icon: LucideIcon;
    label: string;
}

interface ClassItem {
    id: string;
    name: string;
    image: string;
}

const ForumPage: React.FC = () => {
    const { user } = useSelector((state: any) => state.auth);
    const [selectedMenu, setSelectedMenu] = useState('home');
    const [forumList, setForumList] = useState<Forum[]>([]);
    const [isLoading, setLoading] = useState(true);
    const [isLoadingMore, setLoadingMore] = useState(false);
    const [hasError, fetchDataForumError] = useState(false);
    const [hasMorePosts, setHasMorePosts] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const perPage = 5;

    const [selectedClass, setSelectedClass] = useState<string | null>(null);
    const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [isClassExpanded, setIsClassExpanded] = useState(false);

    const postsContainerRef = useRef<HTMLDivElement>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const loadMoreTriggerRef = useRef<HTMLDivElement>(null);

    const myClasses: ClassItem[] = [
        { id: 'class1', name: 'Lớp Toán', image: 'https://i.pinimg.com/474x/f0/97/91/f097913bdf5b919f5d336036f06ebc15.jpg' },
        { id: 'class2', name: 'Lớp Văn', image: 'https://i.pinimg.com/474x/f0/97/91/f097913bdf5b919f5d336036f06ebc15.jpg' },
        { id: 'class3', name: 'Lớp Anh', image: 'https://i.pinimg.com/474x/f0/97/91/f097913bdf5b919f5d336036f06ebc15.jpg' },
    ];
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const postRefs = useRef<Record<string, HTMLDivElement | null>>({});
    const scrollToPost = (postId: string) => {
        const postEl = postRefs.current[postId];
        if (postEl) {
            postEl.scrollIntoView({ behavior: 'smooth', block: 'center' }); // 👈 scroll ra giữa
        }
    };

    const fetchData = async (page: number, reset: boolean = false) => {
        try {
            let endpoint;
            let loadingState = page === 1 ? setLoading : setLoadingMore;

            loadingState(true);

            switch (selectedMenu) {
                case 'home':
                    endpoint = getForums;
                    break;
                case 'reposted':
                    endpoint = getRepostForum;
                    break;
                case 'liked':
                    endpoint = getLikeForum;
                    break;
                case 'me':
                    endpoint = getMyForums;
                    break;
                default:
                    endpoint = getForums;
                    break;
            }

            const response = await endpoint(user._id, page, perPage);

            if (reset) {
                setForumList(response.data);
            } else {
                setForumList(prev => [...prev, ...response.data]);
            }

            // Kiểm tra xem còn bài viết để tải không
            setHasMorePosts(response.data.length === perPage);

            loadingState(false);
            fetchDataForumError(false);
        } catch (error) {
            message.error('Không thể tải bài viết. Vui lòng thử lại sau.');
            fetchDataForumError(true);
            setLoading(false);
            setLoadingMore(false);
        }
    };

    // Khởi tạo và thiết lập Intersection Observer
    useEffect(() => {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5,
        };

        const observer = new IntersectionObserver((entries) => {
            const [entry] = entries;
            if (entry.isIntersecting && hasMorePosts && !isLoadingMore && !isLoading) {
                loadMorePosts();
            }
        }, options);

        observerRef.current = observer;

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [hasMorePosts, isLoadingMore, isLoading]);

    // Quan sát element trigger
    useEffect(() => {
        if (loadMoreTriggerRef.current && observerRef.current) {
            observerRef.current.disconnect();
            observerRef.current.observe(loadMoreTriggerRef.current);
        }
    }, [forumList]);

    // Gọi API ban đầu khi component mount hoặc khi selectedMenu thay đổi
    useEffect(() => {
        setCurrentPage(1);
        setForumList([]);
        setHasMorePosts(true);
        fetchData(1, true);
    }, [selectedMenu]);

    const loadMorePosts = () => {
        if (!isLoadingMore && hasMorePosts) {
            const nextPage = currentPage + 1;
            setCurrentPage(nextPage);
            fetchData(nextPage);
        }
    };

    const handleMenuClick = (menuId: string) => {
        console.log("menuId", menuId);
        if (menuId === 'class') {
            setIsClassExpanded(!isClassExpanded);
            if (window.innerWidth < 768) {
                setIsMobileDrawerOpen(true);
            }
        } else {
            setSelectedMenu(menuId);
            setIsClassExpanded(false);
            setSelectedClass(null);
        }
    };

    const handleClassSelect = (classId: string) => {
        setSelectedClass(classId);
        setSelectedMenu('class');
        setIsMobileDrawerOpen(false);
    };

    const handleLikeStatusChange = (postId: string, isLikedNew: boolean) => {
        if (selectedMenu === 'liked' && !isLikedNew) {
            setForumList(prev => {
                const newList = prev.filter(post => post._id !== postId);
                return newList;
            });
        }
    };

    const handleRepostStatusChange = (postId: string, isRepostedNew: boolean) => {
        if (selectedMenu === 'reposted' && !isRepostedNew) {
            setForumList(prev => prev.filter(post => post._id !== postId));
        }
    };

    const handleUpdatePost = (postId: string, updatedPost: any) => {
        setForumList(prev => prev.map(post => {
            if (post._id === postId) {
                // Thay thế hoàn toàn post cũ bằng post mới từ API response
                return {
                    ...post,         // Giữ lại các thuộc tính không thay đổi từ post ban đầu
                    ...updatedPost,  // Cập nhật với tất cả dữ liệu mới
                    _id: postId      // Đảm bảo _id không bị thay đổi
                };
            }
            return post;
        }));
    };

    const handleDeletePost = (postId: string) => {
        // Loại bỏ bài đăng đã xóa khỏi danh sách
        setForumList(prev => prev.filter(post => post._id !== postId));
    };

    // @ts-ignore
    const menuItems: MenuItem[] = [
        { id: 'home', icon: Home, label: 'Trang chủ' },
        { id: 'class', icon: BookOpen, label: 'Lớp học' },
        { id: 'liked', icon: ThumbsUp, label: 'Bài đăng đã thích' },
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
                    // Refresh lại danh sách bài post sau khi tạo mới
                    setCurrentPage(1);
                    fetchData(1, true);
                }}
            />

            <div className={styles.navContainer}>
                <nav className={styles.desktopNav}>
                    <div className={styles.avatarContainer}>
                        <img
                            src={user.avatar[0]? user.avatar :"https://i.pinimg.com/474x/0b/10/23/0b10236ae55b58dceaef6a1d392e1d15.jpg"}
                            alt="User Avatar"
                            className={styles.userAvatar}
                        />
                    </div>

                    <div className={styles.userName}>
                        <h2 className={styles.userNameText}>{user.username}</h2>
                    </div>

                    <button
                        className={styles.createPostButton}
                        onClick={() => setIsCreateModalOpen(true)}
                    >
                        <PlusCircle size={20} />
                        Tạo bài viết mới
                    </button>

                    <div className={styles.menuContainer}>
                        {menuItems.map((item) => (
                            <div key={item.id} className={styles.menuWrapper}>
                                <button
                                    onClick={() => handleMenuClick(item.id)}
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
                                    {item.id === 'class' && (
                                        <ChevronDown
                                            size={20}
                                            className={`${styles.chevron} ${
                                                isClassExpanded
                                                    ? styles.chevronRotated
                                                    : ''
                                            }`}
                                        />
                                    )}
                                </button>
                                {item.id === 'class' && isClassExpanded && (
                                    <div
                                        className={`${styles.classSubmenu} ${
                                            isClassExpanded
                                                ? styles.classSubmenuActive
                                                : !isClassExpanded
                                                    ? styles.classSubmenuClosing
                                                    : ''
                                        }`}
                                    >
                                        {myClasses.map((classItem) => (
                                            <button
                                                key={classItem.id}
                                                onClick={() =>
                                                    handleClassSelect(
                                                        classItem.id
                                                    )
                                                }
                                                className={`${styles.classMenuItem} ${
                                                    selectedClass ===
                                                    classItem.id
                                                        ? styles.classMenuItemActive
                                                        : ''
                                                }`}
                                            >
                                                <img
                                                    src={classItem.image}
                                                    alt={classItem.name}
                                                    className={
                                                        styles.classImage
                                                    }
                                                />
                                                <span
                                                    className={styles.className}
                                                >
                                                    {classItem.name}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </nav>
            </div>

            <div className={styles.mainContent}>
                <div className={styles.mobileHeader}>
                    <img
                        src={user.avatar[0]? user.avatar :"https://i.pinimg.com/474x/0b/10/23/0b10236ae55b58dceaef6a1d392e1d15.jpg"}
                        alt="User Avatar"
                        className={styles.avatar}
                    />
                    <button className={styles.mobileCreateButton} onClick={() => setIsCreateModalOpen(true)}>
                        <PlusCircle size={24} />
                    </button>
                </div>
                <div className={styles.postsContainer} ref={postsContainerRef}>
                    {/* Hiển thị loading state cho lần load đầu tiên */}
                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <Loader size={24} className={styles.loadingIcon} />
                            <p className="ml-2">Đang tải...</p>
                        </div>
                    ) : hasError ? (
                        <EmptyState
                            selectedMenu={selectedMenu}
                            isError={true}
                            errorMessage="Không thể tải dữ liệu. Vui lòng thử lại."
                        />
                    ) : forumList.length > 0 ? (
                        <>
                            {forumList.map((post) => (
                                <Post
                                    key={post._id}
                                    {...post}
                                    postRef={(el) => (postRefs.current[post._id] = el)}
                                    scrollToPost={() => scrollToPost(post._id)}
                                    onLikeStatusChange={handleLikeStatusChange}
                                    onRepostStatusChange={handleRepostStatusChange}
                                    onDeletePost={handleDeletePost}
                                    onUpdatePost={handleUpdatePost}
                                    selectedMenu={selectedMenu}
                                />
                            ))}

                            {/* Load more trigger div - quan sát khi người dùng cuộn đến đây */}
                            <div
                                ref={loadMoreTriggerRef}
                                className={styles.loadMoreTrigger}
                                style={{ height: '20px', margin: '20px 0' }}
                            >
                                {isLoadingMore && (
                                    <div className={styles.loadingContainer}>
                                        <Loader size={24} className={styles.loadingIcon} />
                                        <p className="ml-2">Đang tải thêm...</p>
                                    </div>
                                )}

                                {!hasMorePosts && !isLoadingMore && forumList.length > 0 && (
                                    <div  className={styles.textPrimary}>
                                        Đã hiển thị tất cả bài viết
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <EmptyState
                            selectedMenu={selectedMenu}
                            isError={false}
                        />
                    )}
                </div>
            </div>

            <div className={styles.mobileNav}>
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => handleMenuClick(item.id)}
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

            <Drawer
                title="Chọn lớp học"
                placement="left"
                onClose={() => setIsMobileDrawerOpen(false)}
                open={isMobileDrawerOpen}
                className={styles.mobileClassDrawer}
            >
                {myClasses.map((classItem) => (
                    <button
                        key={classItem.id}
                        onClick={() => handleClassSelect(classItem.id)}
                        className={`${styles.mobileClassMenuItem} ${
                            selectedClass === classItem.id
                                ? styles.mobileClassMenuItemActive
                                : ''
                        }`}
                    >
                        <img
                            src={classItem.image}
                            alt={classItem.name}
                            className={styles.mobileClassImage}
                        />
                        <span className={styles.mobileClassName}>
                            {classItem.name}
                        </span>
                    </button>
                ))}
            </Drawer>
        </div>
    )
};

export default ForumPage;
