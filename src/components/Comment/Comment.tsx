import React, { useEffect, useState, useRef } from 'react';
import { List, Typography, message, Button, Form, Input, Space, Popconfirm } from 'antd';
import { LikeOutlined, MessageOutlined, DownOutlined, UpOutlined, DeleteOutlined } from '@ant-design/icons';
import { Comment as CommentInterface, SubComment, CommentReq } from '../../model/model.ts';
import { addComment, getCommentsByCommentableId, likeComment, deleteComment } from '../../services/comment.ts';
import { useSelector } from 'react-redux';
import styles from './Comment.module.css';

const { Text } = Typography;
const { TextArea } = Input;

interface CommentProps {
    commentableId: string;
    commentableType: string;
    onCommentCountChange?: (count: number) => void;
}

const CommentComponent: React.FC<CommentProps> = ({ commentableId, commentableType, onCommentCountChange }) => {
    const [comments, setComments] = useState<CommentInterface[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [form] = Form.useForm();
    const { user } = useSelector((state: any) => state.auth);
    const [activeCommentId, setActiveCommentId] = useState<string | null>(null);
    const [textareaValue, setTextareaValue] = useState<string>('');
    const commentRefs = useRef<{[key: string]: HTMLDivElement | null}>({});
    const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
    const replyFormRef = useRef<HTMLDivElement | null>(null);
    const commentsContainerRef = useRef<HTMLDivElement | null>(null);
    const mainFormRef = useRef<HTMLDivElement | null>(null);

    // Initial number of main comments to show
    const INITIAL_MAIN_COMMENTS = 3;
    const MAX_VISIBLE_REPLIES = 3; // Number of replies to show initially

    const [visibleMainComments, setVisibleMainComments] = useState<number>(INITIAL_MAIN_COMMENTS);
    const [visibleRepliesMap, setVisibleRepliesMap] = useState<{[key: string]: number}>({});
    const [collapsedComments, setCollapsedComments] = useState<Set<string>>(new Set());
    const [lastClosedCommentId, setLastClosedCommentId] = useState<string | null>(null);

    const getTotalCommentCount = (comments: CommentInterface[]) => {
        let count = comments.length;
        comments.forEach(comment => {
            if (comment.sub_comments) {
                count += comment.sub_comments.length;
            }
        });
        return count;
    };

    const fetchComments = async () => {
        try {
            setIsLoading(true);
            const response = await getCommentsByCommentableId(commentableId);

            // Sort comments to show newest first
            const sortedComments = [...response.data].sort((a, b) => {
                // You can replace this with actual timestamp comparison if available
                return new Date(b.createdAt || Date.now()).getTime() -
                    new Date(a.createdAt || Date.now()).getTime();
            });

            setComments(sortedComments);

            // Notify parent component about comment count
            if (onCommentCountChange) {
                onCommentCountChange(getTotalCommentCount(sortedComments));
            }

            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching comments:", error);
            message.error('Failed to fetch comments');
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [commentableId]);

    // Helper function to find parent comment ID
    const findParentCommentId = (commentId: string): string | null => {
        // If it's a main comment, return itself
        const isMainComment = comments.some(comment => comment._id === commentId);
        if (isMainComment) {
            return commentId;
        }

        // Find the parent comment
        for (const comment of comments) {
            if (comment.sub_comments?.some(sub => sub._id === commentId)) {
                return comment._id;
            }
        }

        return null;
    };

    // Improved scrolling with better positioning
    const scrollToComment = (commentId: string, position: ScrollLogicalPosition = 'center') => {
        if (commentRefs.current[commentId]) {
            commentRefs.current[commentId]?.scrollIntoView({
                behavior: 'smooth',
                block: position
            });
        }
    };

    const handleAddComment = async (values: { content: string }) => {
        try {
            if (!values.content.trim()) {
                message.error('Comment content cannot be empty');
                return;
            }

            // Get the parent id
            let parentCommentId = activeCommentId ? findParentCommentId(activeCommentId) : null;

            const comment: CommentReq = {
                content: values.content,
                commentableId: commentableId,
                commentableType: commentableType,
                userId: user._id,
                parentId: parentCommentId,
            };

            const response = await addComment(comment);

            // Reset form and active comment state first to maintain better UX
            form.resetFields();
            setTextareaValue('');
            setActiveCommentId(null);

            if (!parentCommentId) {
                // For main comments, we'll add it at the top temporarily to show immediate feedback
                // The next fetchComments will replace it with the properly formatted version
                const tempComment: CommentInterface = {
                    _id: 'temp_' + Date.now(),
                    content: values.content,
                    commentableId,
                    commentableType,
                    user_id: {
                        _id: user._id,
                        username: user.username,
                        avatar: user.avatar || []
                    },
                    like_count: 0,
                    is_liked: false,
                    sub_comments: [],
                    createdAt: new Date().toISOString()
                };

                // Add to top of comments list
                setComments(prev => [tempComment, ...prev]);

                // Ensure it's visible
                setVisibleMainComments(prev => Math.max(prev, 1));

                // Scroll to the new comment after a short delay
                setTimeout(() => {
                    if (mainFormRef.current) {
                        mainFormRef.current.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }, 100);
            } else {
                // For replies, make sure parent comment is expanded
                setExpandedComments(prev => new Set([...prev, parentCommentId]));

                // Update the visibleRepliesMap to show the new reply
                const parentComment = comments.find(c => c._id === parentCommentId);
                if (parentComment) {
                    const currentSubComments = parentComment.sub_comments?.length || 0;
                    setVisibleRepliesMap(prev => ({
                        ...prev,
                        [parentCommentId]: Math.max(prev[parentCommentId] || MAX_VISIBLE_REPLIES, currentSubComments + 1)
                    }));
                }

                // Scroll to parent comment after a delay
                setTimeout(() => {
                    scrollToComment(parentCommentId);
                }, 100);
            }

            // Refresh all comments after a slight delay to let animations complete
            setTimeout(() => {
                fetchComments();
            }, 300);

            message.success('Bình luận thành công');
        } catch (error) {
            console.error("Error adding comment:", error);
            message.error('Có lỗi khi tải lên bình luận');
        }
    };

    const handleLikeComment = async (commentId: string, userId: string) => {
        try {
            await likeComment(commentId, userId);

            setComments(prevComments =>
                prevComments.map(comment =>
                    comment._id === commentId
                        ? { ...comment, like_count: comment.like_count + 1, is_liked: true }
                        : {
                            ...comment,
                            sub_comments: comment.sub_comments?.map(subComment =>
                                subComment._id === commentId
                                    ? { ...subComment, like_count: subComment.like_count + 1, is_liked: true }
                                    : subComment
                            )
                        }
                )
            );
        } catch (error) {
            console.error("Có lỗi khi thích bình luận:", error);
            message.error('Có lỗi khi thích bình luận');
        }
    };

    // Add delete comment handler
    const handleDeleteComment = async (commentId: string) => {
        try {
            await deleteComment(commentId);

            // Remember where we were before deletion
            const parentCommentId = findParentCommentId(commentId);
            const isMainComment = parentCommentId === commentId;

            if (!isMainComment && parentCommentId) {
                // For subcomments, we'll want to stay at the parent
                setLastClosedCommentId(parentCommentId);
            } else {
                // For main comments, we'll scroll to the next comment or back to post
                const commentIndex = comments.findIndex(c => c._id === commentId);
                if (commentIndex > 0) {
                    setLastClosedCommentId(comments[commentIndex - 1]._id);
                } else if (commentIndex < comments.length - 1) {
                    setLastClosedCommentId(comments[commentIndex + 1]._id);
                } else {
                    setLastClosedCommentId(null);
                }
            }

            // Update local state after successful deletion
            setComments(prevComments => {
                let updatedComments;
                // Check if it's a main comment
                updatedComments = prevComments.filter(comment => comment._id !== commentId);

                // If comment count didn't change, it must be a sub-comment
                if (updatedComments.length === prevComments.length) {
                    updatedComments = prevComments.map(comment => ({
                        ...comment,
                        sub_comments: comment.sub_comments?.filter(sub => sub._id !== commentId)
                    }));
                }

                // Update the comment count in parent component
                if (onCommentCountChange) {
                    onCommentCountChange(getTotalCommentCount(updatedComments));
                }

                return updatedComments;
            });

            // After deletion, scroll to the appropriate place
            setTimeout(() => {
                if (lastClosedCommentId && commentRefs.current[lastClosedCommentId]) {
                    scrollToComment(lastClosedCommentId);
                } else {
                    scrollToPost();
                }
            }, 100);

            message.success('Xoá bình luận thành công');
        } catch (error) {
            console.error("Có lỗi khi xoá bình luận:", error);
            message.error('Có lỗi khi xoá bình luận');
        }
    };

    // Check if user is the owner of the comment
    const isCommentOwner = (comment: CommentInterface | SubComment) => {
        return comment.user_id._id === user._id;
    };

    const replyComment = (commentId: string, username: string) => {
        // Important: Find the parent comment ID first
        const parentCommentId = findParentCommentId(commentId);

        // Set active comment to the one being replied to
        setActiveCommentId(commentId);

        // Expand parent comment replies
        if (parentCommentId) {
            setExpandedComments(prev => new Set([...prev, parentCommentId]));
        }

        // Make sure the comment is visible if it's a main comment
        const commentIndex = comments.findIndex(c => c._id === commentId);
        if (commentIndex >= 0 && commentIndex >= visibleMainComments) {
            setVisibleMainComments(commentIndex + 1);
        }

        // Set initial value with @mention
        const initialValue = `@${username} `;
        form.setFieldsValue({ content: initialValue });
        setTextareaValue(initialValue);

        // Scroll to the reply area with a smooth transition
        setTimeout(() => {
            scrollToComment(commentId, 'start');
            if (replyFormRef.current) {
                const textarea = replyFormRef.current.querySelector('textarea');
                if (textarea) {
                    textarea.focus();
                }
            }
        }, 100);
    };

    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTextareaValue(e.target.value);
    };

    const toggleReplies = (commentId: string) => {
        setExpandedComments(prev => {
            const newSet = new Set(prev);
            const wasExpanded = newSet.has(commentId);

            if (wasExpanded) {
                // Before closing, remember this comment for better navigation
                setLastClosedCommentId(commentId);
                newSet.delete(commentId);
            } else {
                newSet.add(commentId);
                // When expanding replies, scroll to the comment with a delay
                setTimeout(() => {
                    scrollToComment(commentId, 'start');
                }, 100);
            }
            return newSet;
        });
    };

    // Effect to handle scroll behavior after closing comments
    useEffect(() => {
        if (lastClosedCommentId && commentRefs.current[lastClosedCommentId]) {
            // Scroll to the comment that was just closed
            setTimeout(() => {
                if (commentRefs.current[lastClosedCommentId]) {
                    scrollToComment(lastClosedCommentId, 'center');
                }
            }, 100);
        }
    }, [expandedComments]);

    const toggleCollapseComment = (commentId: string) => {
        setCollapsedComments(prev => {
            const newSet = new Set(prev);
            if (newSet.has(commentId)) {
                newSet.delete(commentId);
            } else {
                newSet.add(commentId);
            }
            return newSet;
        });
    };

    const showMoreReplies = (commentId: string, totalReplies: number) => {
        setVisibleRepliesMap(prev => ({
            ...prev,
            [commentId]: Math.min(totalReplies, (prev[commentId] || MAX_VISIBLE_REPLIES) + 3)
        }));

        // After loading more replies, scroll down a bit to show them
        setTimeout(() => {
            if (commentRefs.current[commentId]) {
                window.scrollBy({ top: 100, behavior: 'smooth' });
            }
        }, 100);
    };

    // Load more main comments
    const loadMoreComments = () => {
        const prevVisible = visibleMainComments;
        const newVisible = Math.min(comments.length, prevVisible + 3);
        setVisibleMainComments(newVisible);

        // After a small delay, scroll to the newly visible comments
        setTimeout(() => {
            if (comments[prevVisible] && commentRefs.current[comments[prevVisible]._id]) {
                scrollToComment(comments[prevVisible]._id, 'start');
            }
        }, 100);
    };

    // Close all expanded comments and scroll back to post
    const closeAllComments = () => {
        if (expandedComments.size > 0) {
            setExpandedComments(new Set());
            setTimeout(() => {
            }, 100);
        }
    };

    // Render reply form
    const renderReplyForm = () => (
        <div ref={replyFormRef}>
            <Form
                form={form}
                onFinish={handleAddComment}
                layout="inline"
                className={styles.replyForm}
            >
                <Form.Item
                    name="content"
                    rules={[{ required: true, message: 'Please enter your reply' }]}
                    className={styles.replyInput}
                >
                    <TextArea
                        className={styles.autoExpandTextarea}
                        value={textareaValue}
                        onChange={handleTextareaChange}
                        autoSize={{ minRows: 1, maxRows: 6 }}
                        placeholder="Reply to comment..."
                    />
                </Form.Item>
                <Space>
                    <Button type="primary" htmlType="submit" size="small">
                        Reply
                    </Button>
                    <Button
                        size="small"
                        onClick={() => {
                            setActiveCommentId(null);
                            form.resetFields();
                            setTextareaValue('');
                        }}
                    >
                        Cancel
                    </Button>
                </Space>
            </Form>
        </div>
    );

    // Render comment action buttons
    const renderActionButtons = (comment: CommentInterface | SubComment) => (
        <Space key="actions" className={styles.actionButtons}>
            <Button
                type="text"
                className={styles.actionButton}
                icon={<LikeOutlined />}
                onClick={() => handleLikeComment(comment._id, user._id)}
            >
                <Text>{comment.like_count}</Text>
            </Button>
            <Button
                type="text"
                icon={<MessageOutlined />}
                onClick={() => replyComment(comment._id, comment.user_id.username)}
                className={`${styles.actionButton} ${activeCommentId === comment._id ? styles.activeButton : ''}`}
            >
                Reply
            </Button>

            {/* Delete comment button - only shown for comment owner */}
            {isCommentOwner(comment) && (
                <Popconfirm
                    title="Delete Comment"
                    description="Are you sure you want to delete this comment?"
                    onConfirm={() => handleDeleteComment(comment._id)}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        className={styles.actionButton}
                    >
                        Delete
                    </Button>
                </Popconfirm>
            )}
        </Space>
    );

    // Render a single comment (works for both main and sub comments)
    const renderComment = (comment: CommentInterface | SubComment, level: number) => (
        <div
            key={comment._id}
            ref={el => commentRefs.current[comment._id] = el}
            className={`${level === 1 ? styles.subCommentContainer : ''} ${styles.commentTransition}`}
            id={`comment-${comment._id}`}
        >
            <List.Item
                className={styles.commentItem}
                actions={[renderActionButtons(comment)]}
            >
                <List.Item.Meta
                    avatar={
                        <img
                            src={comment.user_id.avatar[0] || 'https://i.pinimg.com/474x/c2/7e/b7/c27eb77c278f37d9a204bff5a661b83b.jpg'}
                            alt="avatar"
                            className={level === 0 ? styles.avatarMain : styles.avatarSub}
                        />
                    }
                    title={<Text strong className={level === 1 ? styles.subCommentName : ''}>{comment.user_id.username}</Text>}
                    description={
                        <>
                            <Text
                                className={level === 1 ? styles.subCommentContent : ''}
                                ellipsis={collapsedComments.has(comment._id) ? { rows: 2, expandable: false } : false}
                            >
                                {comment.content}
                            </Text>
                            {comment.content.length > 150 && (
                                <Button
                                    type="link"
                                    onClick={() => toggleCollapseComment(comment._id)}
                                    size="small"
                                >
                                    {collapsedComments.has(comment._id) ? "Show more" : "Show less"}
                                </Button>
                            )}
                        </>
                    }
                />
            </List.Item>

            {/* Show reply form if this comment is active */}
            {activeCommentId === comment._id && (
                <div className={styles.inlineReplyForm}>
                    {renderReplyForm()}
                </div>
            )}
        </div>
    );

    // Render main comments and their replies
    const renderMainComments = () => (
        <List
            loading={isLoading}
            itemLayout="vertical"
            dataSource={comments.slice(0, visibleMainComments)}
            className={styles.commentList}
            renderItem={comment => {
                const hasReplies = comment.sub_comments && comment.sub_comments.length > 0;
                const isExpanded = expandedComments.has(comment._id);

                return (
                    <div key={comment._id} className={styles.mainCommentWrapper}>
                        {/* Main comment */}
                        {renderComment(comment, 0)}

                        {/* Toggle button for replies */}
                        {hasReplies && (
                            <Button
                                type="text"
                                className={styles.viewRepliesButton}
                                onClick={() => toggleReplies(comment._id)}
                                icon={isExpanded ? <UpOutlined /> : <DownOutlined />}
                            >
                                {isExpanded ? 'Ẩn' : 'Hiển thị'} {comment.sub_comments.length} {comment.sub_comments.length === 1 ? 'reply' : 'replies'}
                            </Button>
                        )}

                        {/* Replies section - only show if expanded */}
                        {(hasReplies && isExpanded) && (
                            <div className={`${styles.repliesContainer} ${styles.animateReplies}`}>
                                <List
                                    itemLayout="vertical"
                                    dataSource={comment.sub_comments.slice(0, visibleRepliesMap[comment._id] || MAX_VISIBLE_REPLIES)}
                                    renderItem={subComment => renderComment(subComment, 1)}
                                />
                                {comment.sub_comments.length > (visibleRepliesMap[comment._id] || MAX_VISIBLE_REPLIES) && (
                                    <Button
                                        type="link"
                                        onClick={() => showMoreReplies(comment._id, comment.sub_comments.length)}
                                        className={styles.loadMoreRepliesButton}
                                    >
                                        Show more replies ({comment.sub_comments.length - (visibleRepliesMap[comment._id] || MAX_VISIBLE_REPLIES)} remaining)
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                );
            }}
        />
    );

    return (
        <div className={styles.container} ref={commentsContainerRef}>
            <div className={styles.commentsWrapper}>
                {/* Close all button if there are expanded comments */}
                {/*{expandedComments.size > 0 && (*/}
                {/*    <Button*/}
                {/*        onClick={closeAllComments}*/}
                {/*        className={styles.closeAllButton}*/}
                {/*        icon={<UpOutlined />}*/}
                {/*    >*/}
                {/*        Close all comments*/}
                {/*    </Button>*/}
                {/*)}*/}

                {renderMainComments()}

                {/* Load more main comments button */}
                {comments.length > visibleMainComments && (
                    <Button
                        type="primary"
                        onClick={loadMoreComments}
                        className={styles.loadMoreButton}
                    >
                        Xem thêm ({comments.length - visibleMainComments} bình luận)
                    </Button>
                )}
            </div>

            {/* Main comment form - only show when no comment is being replied to */}
            {!activeCommentId && (
                <div className={styles.mainCommentForm} ref={mainFormRef}>
                    <Form form={form} onFinish={handleAddComment}>
                        <Form.Item name="content" rules={[{ required: true, message: 'Please enter your comment' }]}>
                            <TextArea
                                className={styles.autoExpandTextarea}
                                value={textareaValue}
                                onChange={handleTextareaChange}
                                autoSize={{ minRows: 2, maxRows: 6 }}
                                placeholder="Thêm bình luận"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Add Comment
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            )}
        </div>
    );
};

export default CommentComponent;