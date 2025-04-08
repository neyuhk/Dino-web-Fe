// Post.tsx
import React, { useEffect, useState } from 'react'
import { Heart, MessageCircle, Repeat2, Share2 } from 'lucide-react'
import styles from './post.module.css';
import { Forum } from '../../../model/model.ts'
import CommentComponent from '../../Comment/Comment.tsx'
import { convertDateTimeToDate } from '../../../helpers/convertDateTime.ts'
import { likePost, repost } from '../../../services/forum.ts'
import { useSelector } from 'react-redux'
import { COMMENT_TYPE } from '../../../enum/commentTableType.ts'

interface ExtendedPostProps extends Forum {
    // commentableType: string;
    // onComment: (id: string) => void;
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
                                               // commentableType,
                                               is_liked,
                                               is_reposted,
                                               // onComment,
                                           }) => {
    const { user } = useSelector((state: any) => state.auth)

    const [showComments, setShowComments] = useState(false);
    const [isLiked, setIsLiked] = useState(is_liked)
    const [isReposted, setIsReposted] = useState(is_reposted)
    const [likeCount, setLikeCount] = useState(like_count)
    const [repostCount, setRepostCount] = useState(repost_count)
    const handleCommentClick = (postId: string) => {
        setShowComments(!showComments);
        // onComment(postId);
    };

    useEffect(() => {
        const fetchPostData = async () => {

        }
    }, [])

   const onLike = async (id : string) => {
        setIsLiked(!isLiked)
       setLikeCount(isLiked ? likeCount - 1 : likeCount + 1)
       await likePost(id, user._id)
    }

    const onRepost = async (id : string) => {
        setIsReposted(!isReposted)
        setRepostCount(isReposted ? repostCount - 1 : repostCount + 1)
        await repost(id, user._id)
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <img
                    src={user_id.avatar || "https://i.pinimg.com/474x/9f/07/27/9f072737e28d2e21dc7adbd35db8aede.jpg"}
                    alt={`${user_id.username}'s avatar`}
                    className={styles.avatar}
                />
                <div className={styles.authorInfo}>
                    <h3 className={styles.authorName}>{user_id.username}</h3>
                    <p className={styles.time}>{convertDateTimeToDate(createdAt)}</p>
                </div>
            </div>

            <div className={styles.content}>
                {title && <h2 className={styles.title}>{title}</h2> }
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
                    onClick={() => handleCommentClick(_id)}
                    className={styles.actionButton}
                >
                    <MessageCircle
                        size={20}
                        className={showComments ? styles.commentActive : styles.actionIcon}
                    />
                    <span className={styles.actionCount}>{comment_count}</span>
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

            <div className={`${styles.commentSection} ${showComments ? styles.commentSectionExpanded : ''}`}>
                {showComments && (
                    <CommentComponent
                        commentableId={_id}
                        commentableType = {COMMENT_TYPE.FORUM}
                    />
                )}
            </div>
        </div>
    );
};

export default Post;