// Post.tsx - Cập nhật component
import React, { useEffect, useState, useRef } from 'react'
import { Heart, MessageCircle, Repeat2, Share2, Trash2, ChevronUp, ChevronDown } from 'lucide-react'
import styles from './post.module.css';
import { Forum } from '../../../model/model.ts'
import CommentComponent from '../../Comment/Comment.tsx'
import { convertDateTimeToDate } from '../../../helpers/convertDateTime.ts'
import { likePost, repost, deleteForum } from '../../../services/forum.ts'
import { useSelector } from 'react-redux'
import { COMMENT_TYPE } from '../../../enum/commentTableType.ts'
import { Popconfirm, message } from 'antd'

interface ExtendedPostProps extends Forum {
    onLikeStatusChange?: (postId: string, isLikedNew: boolean) => void;
    onRepostStatusChange?: (postId: string, isRepostedNew: boolean) => void;
    onDeletePost?: (postId: string) => void;
    scrollToPost: () => void;
    postRef: (el: HTMLDivElement | null) => void;
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
                                               scrollToPost,
                                               postRef,
                                           }) => {
    const { user } = useSelector((state: any) => state.auth)
    const commentSectionRef = useRef<HTMLDivElement>(null);
    const postElementRef = useRef<HTMLDivElement>(null);

    const [showComments, setShowComments] = useState(false);
    const [isLiked, setIsLiked] = useState(is_liked)
    const [isReposted, setIsReposted] = useState(is_reposted)
    const [likeCount, setLikeCount] = useState(like_count)
    const [repostCount, setRepostCount] = useState(repost_count)
    const [localCommentCount, setLocalCommentCount] = useState(comment_count);

    const isCurrentUserPost = user_id === user._id || user_id._id === user._id;
    const authorInfo = isCurrentUserPost ? {
        _id: user._id,
        username: user.username,
        avatar: user.avatar,
        // Thêm các thông tin khác nếu cần
    } : user_id;

    // Kết nối ref với ref callback từ parent component
    useEffect(() => {
        if (postElementRef.current) {
            postRef(postElementRef.current);
        }

        // Cleanup function
        return () => {
            postRef(null);
        };
    }, [postRef]);

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

    return (
        <div className={styles.container} ref={postElementRef}>
            <div className={styles.header}>
                <img
                    src={authorInfo.avatar || "/MockData/avt-def.jpg"}
                    alt={`${authorInfo.username}'s avatar`}
                    className={styles.avatar}
                />
                <div className={styles.authorInfo}>
                    <h3 className={styles.authorName}>{authorInfo.username}</h3>
                    <p className={styles.time}>{convertDateTimeToDate(createdAt)}</p>
                </div>

                {/* Nút xóa bài đăng - chỉ hiển thị nếu là người đăng */}
                {isCurrentUserPost && (
                    <Popconfirm
                        title="Xóa bài đăng"
                        description="Bạn có chắc chắn muốn xóa bài đăng này không?"
                        onConfirm={handleDeletePost}
                        okText="Có"
                        cancelText="Không"
                    >
                        <button className={styles.deleteButton}>
                            <Trash2 size={20} className={styles.deleteIcon} />
                        </button>
                    </Popconfirm>
                )}
            </div>

            <div className={styles.content}>
                {title && <h2 className={styles.title}>{title}</h2>}
                {description && <p className={styles.text}>{description}</p>}
                {images && (
                    <img
                        src={images}
                        alt="Post content"
                        className={styles.image}
                    />
                )}
            </div>

            <div className={styles.actions}>
                <button
                    onClick={() => onLike(_id)}
                    className={styles.actionButton}
                >
                    <Heart
                        size={20}
                        className={isLiked ? styles.likeActive : styles.actionIcon}
                    />
                    <span className={styles.actionCount}>{likeCount}</span>
                </button>

                <button
                    onClick={handleCommentClick}
                    className={styles.actionButton}
                >
                    <MessageCircle
                        size={20}
                        className={showComments ? styles.commentActive : styles.actionIcon}
                    />
                    <span className={styles.actionCount}>{localCommentCount}</span>
                </button>

                <button
                    onClick={() => onRepost(_id)}
                    className={styles.actionButton}
                >
                    <Repeat2
                        size={20}
                        className={isReposted ? styles.repostActive : styles.actionIcon}
                    />
                    <span className={styles.actionCount}>{repostCount}</span>
                </button>
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
        </div>
    );
};

export default Post;