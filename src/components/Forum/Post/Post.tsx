// Post.tsx - Cập nhật component
import React, { useEffect, useState, useRef } from 'react'
import { Heart, MessageCircle, Repeat2, ChevronUp, ChevronDown, MoreHorizontal, Edit, Trash2 } from 'lucide-react'
import styles from './post.module.css';
import { Forum, User } from '../../../model/model.ts'
import CommentComponent from '../../Comment/Comment.tsx'
import { convertDateTimeToDate } from '../../../helpers/convertDateTime.ts'
import { likePost, repost, deleteForum, updateForum, getUserLikeForum } from '../../../services/forum.ts'
import { useSelector } from 'react-redux'
import { COMMENT_TYPE } from '../../../enum/commentTableType.ts'
import { Popconfirm, message, Modal, Input, Form } from 'antd'

interface ExtendedPostProps extends Forum {
    onLikeStatusChange?: (postId: string, isLikedNew: boolean) => void;
    onRepostStatusChange?: (postId: string, isRepostedNew: boolean) => void;
    onDeletePost?: (postId: string) => void;
    onUpdatePost?: (postId: string, updatedPost: any) => void;
    scrollToPost: () => void;
    postRef: (el: HTMLDivElement | null) => void;
    selectedMenu?: string;
}

const Post: React.FC<ExtendedPostProps> = ({
                                               _id,
                                               title,
                                               description,
                                               user_id,
                                               images,
                                               like_count,
                                               view_count,
                                               comment_count,
                                               repost_count,
                                               createdAt,
                                               is_liked,
                                               is_reposted,
                                               onLikeStatusChange,
                                               onRepostStatusChange,
                                               onDeletePost,
                                               onUpdatePost,
                                               scrollToPost,
                                               postRef,
    selectedMenu,
                                           }) => {
    const { user } = useSelector((state: any) => state.auth)
    const commentSectionRef = useRef<HTMLDivElement>(null);
    const postElementRef = useRef<HTMLDivElement>(null);
    const [form] = Form.useForm();

    const [showComments, setShowComments] = useState(false);
    const [isLiked, setIsLiked] = useState(is_liked)
    const [isReposted, setIsReposted] = useState(is_reposted)
    const [likeCount, setLikeCount] = useState(like_count)
    const [repostCount, setRepostCount] = useState(repost_count)
    const [localCommentCount, setLocalCommentCount] = useState(comment_count);

    const [likedUsers, setLikedUsers] = useState<User[]>([]);
    const [isLikedUsersBoxVisible, setIsLikedUsersBoxVisible] = useState(false);
    const [showOptionsMenu, setShowOptionsMenu] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editFormData, setEditFormData] = useState({
        title: title || '',
        description: description || '',
    });

    const isCurrentUserPost = user_id === user._id || user_id._id === user._id;
    const authorInfo = isCurrentUserPost ? {
        _id: user._id,
        username: user.username,
        avatar: user.avatar,
    } : user_id;

    useEffect(() => {
        setIsReposted(selectedMenu === "reposted"? true : isReposted)
        setIsLiked(selectedMenu === "liked"? true : isLiked)
        if (postElementRef.current) {
            postRef(postElementRef.current);
        }

        // Cleanup function
        return () => {
            postRef(null);
        };
    }, [postRef]);

    // Click event handler to close the options menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            if (showOptionsMenu && postElementRef.current && !postElementRef.current.contains(target)) {
                setShowOptionsMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showOptionsMenu]);

    const handleLikeCountClick = async (forumId: string) => {
        try {
            const response = await getUserLikeForum(forumId);
            setLikedUsers(response.data);
            setIsLikedUsersBoxVisible(true);
        } catch (error) {
            console.error('Error fetching liked users:', error);
        }
    };

    const closeLikedUsersBox = () => {
        setIsLikedUsersBoxVisible(false);
    };

    const handleCommentClick = () => {
        const nextState = !showComments;
        setShowComments(nextState);

        setTimeout(() => {
            if (nextState) {
                // Nếu sắp hiển thị comment → scroll tới comment section
                if (commentSectionRef.current) {
                    commentSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            } else {
                scrollToPost();
            }
        }, 100);
    };

    const onLike = async (id: string) => {
        const newLikeStatus = !isLiked;
        setIsLiked(newLikeStatus);
        setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
        await likePost(id, user._id);

        // Thông báo cho component cha về sự thay đổi
        if (onLikeStatusChange) {
            onLikeStatusChange(id, newLikeStatus);
        }
    }

    const onRepost = async (id: string) => {
        const newRepostStatus = !isReposted;
        setIsReposted(newRepostStatus);
        setRepostCount(isReposted ? repostCount - 1 : repostCount + 1);
        await repost(id, user._id);

        // Thông báo cho component cha về sự thay đổi
        if (onRepostStatusChange) {
            onRepostStatusChange(id, newRepostStatus);
        }
    }

    // Callback to update comment count when a comment is added or deleted
    const handleCommentCountChange = (count: number) => {
        setLocalCommentCount(count);
    };

    const handleDeletePost = async () => {
        try {
            await deleteForum(_id);
            message.success('Xóa bài đăng thành công');

            // Thông báo cho component cha để cập nhật UI
            if (onDeletePost) {
                onDeletePost(_id);
            }
        } catch (error) {
            console.error('Lỗi khi xóa bài đăng:', error);
            message.error('Không thể xóa bài đăng. Vui lòng thử lại sau.');
        }
    };

    const toggleOptionsMenu = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowOptionsMenu(!showOptionsMenu);
    };

    const handleEditClick = () => {
        setShowOptionsMenu(false);
        setIsEditModalVisible(true);
        form.setFieldsValue({
            title: title || '',
            description: description || '',
        });
    };
    const handleEditSubmit = async (values: { title: string, description: string }) => {
        try {
            const response = await updateForum(_id.toString(), values);

            const updatedPost = response.data;
            setEditFormData({
                title: updatedPost.title || '',
                description: updatedPost.description || '',
            });
            if (onUpdatePost) {
                onUpdatePost(_id, updatedPost);
            }

            message.success('Cập nhật bài đăng thành công');
            setIsEditModalVisible(false);
        } catch (error) {
            console.error('Lỗi khi cập nhật bài đăng:', error);
            message.error('Không thể cập nhật bài đăng. Vui lòng thử lại sau.');
        }
    };

    return (
        <div className={styles.container} ref={postElementRef}>
            <div className={styles.header}>
                <img
                    src={authorInfo.avatar[0] || "https://i.pinimg.com/474x/0b/10/23/0b10236ae55b58dceaef6a1d392e1d15.jpg"}
                    alt={`${authorInfo.username}'s avatar`}
                    className={styles.avatar}
                />
                <div className={styles.authorInfo}>
                    <h3 className={styles.authorName}>{authorInfo.username}</h3>
                    <p className={styles.time}>{convertDateTimeToDate(createdAt)}</p>
                </div>

                {/* Nút menu tùy chọn - chỉ hiển thị nếu là người đăng */}
                {isCurrentUserPost && (
                    <div className={styles.optionsContainer}>
                        <button className={styles.optionsButton} onClick={toggleOptionsMenu}>
                            <MoreHorizontal size={20} className={styles.optionsIcon} />
                        </button>

                        {showOptionsMenu && (
                            <div className={styles.optionsMenu}>
                                <button className={styles.optionItem} onClick={handleEditClick}>
                                    <Edit size={16} />
                                    <span>Chỉnh sửa</span>
                                </button>
                                <Popconfirm
                                    title="Xóa bài đăng"
                                    description="Bạn có chắc chắn muốn xóa bài đăng này không?"
                                    onConfirm={handleDeletePost}
                                    okText="Có"
                                    cancelText="Không"
                                    overlayClassName="custom-popconfirm"
                                >
                                    <button className={styles.optionItem}>
                                        <Trash2 size={16} />
                                        <span>Xóa</span>
                                    </button>
                                </Popconfirm>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className={styles.content}>
                {title && <h2 className={styles.title}>{title}</h2>}
                {description && <p className={styles.text}>{description}</p>}
                {images && images[0] && (
                    <img
                        src={images[0]}
                        alt="Post content"
                        className={styles.image}
                    />
                )}
            </div>

            <div className={styles.actions}>
                <div className={styles.actionWrapper}>
                    <button
                        onClick={() => onLike(_id)}
                        className={styles.actionButton}
                    >
                        <Heart
                            size={20}
                            className={isLiked ? styles.likeActive : styles.actionIcon}
                        />
                    </button>
                    <span
                        className={styles.actionCount}
                        onClick={() => handleLikeCountClick(_id)}
                        style={{ cursor: 'pointer' }}
                    >
                        {likeCount}
                    </span>
                </div>

                <div className={styles.actionWrapper}>
                    <button
                        onClick={handleCommentClick}
                        className={styles.actionButton}
                    >
                        <MessageCircle
                            size={20}
                            className={showComments ? styles.commentActive : styles.actionIcon}
                        />
                    </button>
                    <span className={styles.actionCount}>{localCommentCount}</span>
                </div>

                <div className={styles.actionWrapper}>
                    <button
                        onClick={() => onRepost(_id)}
                        className={styles.actionButton}
                    >
                        <Repeat2
                            size={20}
                            className={isReposted ? styles.repostActive : styles.actionIcon}
                        />
                    </button>
                    <span className={styles.actionCount}>{repostCount}</span>
                </div>
            </div>

            <div
                ref={commentSectionRef}
                className={`${styles.commentSection} ${showComments ? styles.commentSectionExpanded : ''}`}
            >
                {showComments && (
                    <CommentComponent
                        commentableId={_id}
                        commentableType={COMMENT_TYPE.FORUM}
                        onCommentCountChange={handleCommentCountChange}
                    />
                )}
            </div>

            {/* Bottom comment toggle button - visible when comments are expanded */}
            {showComments && (
                <button
                    className={`${styles.commentToggleButton} ${styles.bottomToggle}`}
                    onClick={handleCommentClick}
                >
                    <ChevronUp size={16} className={styles.commentToggleIcon} />
                    <span>Ẩn bình luận</span>
                </button>
            )}

            {/* Modal Chỉnh sửa */}
            <Modal
                title="Chỉnh sửa bài đăng"
                open={isEditModalVisible}
                onCancel={() => setIsEditModalVisible(false)}
                footer={null}
                className={styles.editModal}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleEditSubmit}
                    initialValues={{
                        title: title || '',
                        description: description || '',
                    }}
                >
                    <Form.Item
                        name="title"
                        label="Tiêu đề"
                        rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Nội dung"
                        rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}
                    >
                        <Input.TextArea rows={4} />
                    </Form.Item>

                    <div className={styles.editModalFooter}>
                        <button
                            type="button"
                            className={styles.cancelButton}
                            onClick={() => setIsEditModalVisible(false)}
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className={styles.submitButton}
                        >
                            Cập nhật
                        </button>
                    </div>
                </Form>
            </Modal>

            {/* Liked Users Box */}
            {isLikedUsersBoxVisible && (
                <div className={styles.likedUsersOverlay} onClick={closeLikedUsersBox}>
                    <div className={styles.likedUsersBox} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.likedUsersHeader}>
                            <h3>Người đã thích bài viết</h3>
                            <button onClick={closeLikedUsersBox} className={styles.closeButton}>
                                &times;
                            </button>
                        </div>
                        <div className={styles.likedUsersList}>
                            {likedUsers.length > 0 ? (
                                likedUsers.map((user) => (
                                    <div key={user._id} className={styles.likedUser}>
                                        <img
                                            src={user.avatar[0] ? user.avatar[0] : 'https://i.pinimg.com/474x/0b/10/23/0b10236ae55b58dceaef6a1d392e1d15.jpg'}
                                            alt={`${user.username}'s avatar`}
                                            className={styles.likedUserAvatar}
                                        />
                                        <span className={styles.likedUsername}>{user.username}</span>
                                    </div>
                                ))
                            ) : (
                                <div className={styles.noLikesMessage}>
                                    Chưa có người thích bài viết này
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Post;
