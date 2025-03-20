import React, { useEffect, useState } from 'react';
import { PlusCircle, Home, BookOpen, ThumbsUp, MessageSquare, Repeat, User, ChevronDown } from 'lucide-react';
import styles from './Forum.module.css';
import Post from './Post/Post.tsx'
import { Forum } from '../../model/model.ts';
import { useSelector } from 'react-redux';
import { getForums } from '../../services/forum.ts';
import { message, Drawer } from 'antd';
import EmptyState from './EmptyState/EmptyState.tsx'
import CreatePostModal from './CreatePost/CreatePostModal.tsx'

interface MenuItem {
    id: string;
    icon: React.FC<{ size?: number; className?: string }>;
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
    const [hasError, fetchDataForumError] = useState(false);

    const [selectedClass, setSelectedClass] = useState<string | null>(null);
    const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [isClassExpanded, setIsClassExpanded] = useState(false);

    const myClasses: ClassItem[] = [
        { id: 'class1', name: 'Lớp Toán', image: 'https://i.pinimg.com/474x/f0/97/91/f097913bdf5b919f5d336036f06ebc15.jpg' },
        { id: 'class2', name: 'Lớp Văn', image: 'https://i.pinimg.com/474x/f0/97/91/f097913bdf5b919f5d336036f06ebc15.jpg' },
        { id: 'class3', name: 'Lớp Anh', image: 'https://i.pinimg.com/474x/f0/97/91/f097913bdf5b919f5d336036f06ebc15.jpg' },
    ];
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
                fetchDataForumError(true);
                setLoading(false)
            }
        };

        fetchData();
    }, [selectedMenu]);

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
                    window.location.reload()
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
                    ) : hasError ? ( // Kiểm tra lỗi trước tiên
                        <EmptyState
                            selectedMenu={selectedMenu}
                            isError={false} // Đặt cờ lỗi true nhows suwra laij
                            errorMessage="Không thể tải dữ liệu. Vui lòng thử lại." // Thông báo lỗi tùy chỉnh
                        />
                    ) : forumList.length > 0 ? ( // Hiển thị danh sách bài viết nếu có dữ liệu
                        forumList.map((post) => (
                            <Post key={post._id} {...post} />
                        ))
                    ) : (
                        // Trường hợp không có dữ liệu nhưng không lỗi
                        <EmptyState
                            selectedMenu={selectedMenu}
                            isError={false} // Không phải trạng thái lỗi
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