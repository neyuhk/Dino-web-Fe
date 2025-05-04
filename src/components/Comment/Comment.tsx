import React, { useEffect, useState, useRef } from 'react';
import { List, Typography, message, Button, Form, Input, Space, Popconfirm } from 'antd';
import { LikeOutlined, LikeFilled, MessageOutlined, DownOutlined, UpOutlined, DeleteOutlined } from '@ant-design/icons';
import { Comment as CommentInterface, CommentReq } from '../../model/model.ts';
import { addComment, getCommentsByCommentableId, likeComment, deleteComment, getSubComment } from '../../services/comment.ts';
import { useSelector } from 'react-redux';
import styles from './Comment.module.css';
import { Loader2 } from 'lucide-react'

const { Text } = Typography;
const { TextArea } = Input;

interface CommentProps {
    commentableId: string;
    commentableType: string;
    onCommentCountChange?: (count: number) => void;
}

const CommentComponent: React.FC<CommentProps> = ({ commentableId, commentableType, onCommentCountChange }) => {
    const [comments, setComments] = useState<CommentInterface[]>([]);
    const [subComments, setSubComments] = useState<{[key: string]: CommentInterface[]}>({});
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isAddComment, setIsAddComment] = useState<boolean>(false);
    const [loadingSubComments, setLoadingSubComments] = useState<{[key: string]: boolean}>({});
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
    const MAX_VISIBLE_REPLIES = 5; // Number of replies to show initially per API call

    const [visibleMainComments, setVisibleMainComments] = useState<number>(INITIAL_MAIN_COMMENTS);
    const [collapsedComments, setCollapsedComments] = useState<Set<string>>(new Set());
    const [lastClosedCommentId, setLastClosedCommentId] = useState<string | null>(null);
    const [subCommentPagination, setSubCommentPagination] = useState<{[key: string]: { page: number; hasMore: boolean }}>({});

    const getTotalCommentCount = (mainComments: CommentInterface[]) => {
        let count = mainComments.length;
        mainComments.forEach(comment => {
            if (comment.countSubComment) {
                count += comment.countSubComment;
            }
        });
        return count;
    };

    const fetchComments = async () => {
        try {
            setIsLoading(true);
            const response = await getCommentsByCommentableId(commentableId, user._id, 1, 5);

            // Sort comments to show newest first
            const sortedComments = [...response.data].sort((a, b) => {
                return new Date(b.createdAt || Date.now()).getTime() -
                    new Date(a.createdAt || Date.now()).getTime();
            });

            setComments(sortedComments);

            // Initialize pagination state for each comment
            const initialPagination : any = {};
            sortedComments.forEach(comment => {
                initialPagination[comment._id] = {
                    page: 1,
                    hasMore: (comment.countSubComment || 0) > MAX_VISIBLE_REPLIES
                };
            });
            setSubCommentPagination(initialPagination);

            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching comments:", error);
            message.error('Failed to fetch comments');
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!commentableId) return;
        console.log("Component 3 mounted or updated");
        fetchComments();
    }, [commentableId]);

    // Fetch subcomments for a specific parent comment
    const fetchSubComments = async (parentId: string, page: number = 1) => {
        try {
            setLoadingSubComments(prev => ({...prev, [parentId]: true}));

            const response = await getSubComment(parentId, user._id, page, MAX_VISIBLE_REPLIES);

            // Update the subcomments map
            setSubComments(prevSubComments => {
                const existingSubComments = prevSubComments[parentId] || [];
                const newSubComments = page === 1
                    ? [...response.data]
                    : [...existingSubComments, ...response.data];

                return {
                    ...prevSubComments,
                    [parentId]: newSubComments
                };
            });

            // Update pagination state
            setSubCommentPagination(prev => ({
                ...prev,
                [parentId]: {
                    page,
                    hasMore: response.data.length === MAX_VISIBLE_REPLIES &&
                        ((page * MAX_VISIBLE_REPLIES) < (comments.find(c => c._id === parentId)?.countSubComment || 0))
                }
            }));

            setLoadingSubComments(prev => ({...prev, [parentId]: false}));
        } catch (error) {
            console.error("Error fetching subcomments:", error);
            message.error('Failed to fetch replies');
            setLoadingSubComments(prev => ({...prev, [parentId]: false}));
        }
    };

    // Improved function that checks if a comment is a main comment
    const isMainComment = (commentId: string): boolean => {
        return comments.some(comment => comment._id === commentId);
    };

    // Simplified function to get parent comment ID
    const getParentCommentId = (comment: CommentInterface): string | null => {
        return comment.parentId || null;
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

    const handleAddComment = async (values: { content: string, parentId: string }) => {
        setIsAddComment(true)
        try {
            if (!values.content.trim()) {
                message.error('Comment content cannot be empty');
                return;
            }

            // Determine if this is a reply to a comment
            const replyingToId = activeCommentId;
            let parentCommentId = values.parentId? values.parentId : null;
            if (replyingToId) {
                // If replying to a main comment, use that as parentId
                if (isMainComment(replyingToId)) {
                    parentCommentId = replyingToId;
                } else {
                    // For replies to subcomments, find the parent comment
                    const parentComment = comments.find(c =>
                        subComments[c._id]?.some(sc => sc._id === replyingToId)
                    );
                    parentCommentId = parentComment?._id || null;
                }
            }

            const comment: CommentReq = {
                content: values.content,
                commentableId: commentableId,
                commentableType: commentableType,
                userId: user._id,
                parentId: parentCommentId || "",
            };

            const response = await addComment(comment);
            const newComment = response.data.data;
            form.resetFields();
            setTextareaValue('');
            setActiveCommentId(null);

            if (!parentCommentId) {
                // For main comments, add it at the top immediately
                const newMainComment: CommentInterface = {
                    _id: newComment._id,
                    content: values.content,
                    commentable_id: commentableId,
                    commentable_type: commentableType,
                    user_id: {
                        _id: user._id,
                        username: user.username,
                        avatar: user.avatar || '',
                        email: '',
                        name: '',
                        role: '',
                        createdAt: '',
                        updatedAt: '',
                        birthday: new Date,
                        phoneNumber: '',
                    },
                    like_count: 0,
                    isLiked: false,
                    countSubComment: 0,
                    parentId: "",
                    createdAt: new Date().toISOString(),
                }

                // Add to top of comments list
                setComments(prev => [newMainComment, ...prev]);

                // Ensure it's visible
                setVisibleMainComments(prev => Math.max(prev, 1));

                // Scroll to the new comment
                setTimeout(() => {
                    if (commentRefs.current[newMainComment._id]) {
                        scrollToComment(newMainComment._id, 'start');
                    } else if (mainFormRef.current) {
                        mainFormRef.current.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }, 100);

                // Notify parent component about comment count change
                if (onCommentCountChange) {
                    onCommentCountChange(getTotalCommentCount([newMainComment, ...comments]));
                }
            } else {
                // For replies, make sure parent comment is expanded
                setExpandedComments(prev => new Set([...prev, parentCommentId]));

                // For subcomments, increment the countSubComment of the parent
                setComments(prevComments =>
                    prevComments.map(comment => {
                        if (comment._id === parentCommentId) {
                            return {
                                ...comment,
                                countSubComment: (comment.countSubComment || 0) + 1
                            };
                        }
                        return comment;
                    })
                );

                // Create new subcomment to display immediately
                const newSubComment: CommentInterface = {
                    _id: newComment._id,
                    content: values.content,
                    commentable_id: commentableId,
                    commentable_type: commentableType,
                    parentId: parentCommentId,
                    user_id: {
                        _id: user._id,
                        username: user.username,
                        avatar: user.avatar || [],
                        email: '',
                        name: '',
                        role: '',
                        createdAt: '',
                        updatedAt: '',
                        birthday: new Date(),
                        phoneNumber: '',
                    },
                    like_count: 0,
                    isLiked: false,
                    countSubComment: 0,
                    createdAt: new Date().toISOString(),
                }

                // Add to existing subcomments and make sure they're visible
                setSubComments(prev => ({
                    ...prev,
                    [parentCommentId]: [newSubComment, ...(prev[parentCommentId] || [])]
                }));

                // Scroll to the newly added comment (after a delay to allow rendering)
                setTimeout(() => {
                    if (commentRefs.current[newSubComment._id]) {
                        scrollToComment(newSubComment._id, 'start');
                    } else if (commentRefs.current[parentCommentId]) {
                        scrollToComment(parentCommentId, 'start');
                    }
                }, 100);

                // Notify parent component about comment count change
                if (onCommentCountChange) {
                    const updatedComments = comments.map(comment => {
                        if (comment._id === parentCommentId) {
                            return {
                                ...comment,
                                countSubComment: (comment.countSubComment || 0) + 1
                            };
                        }
                        return comment;
                    });
                    onCommentCountChange(getTotalCommentCount(updatedComments));
                }
            }
            setIsAddComment(false)
            message.success('Bình luận thành công');
        } catch (error) {
            setIsAddComment(false)
            console.error("Error adding comment:", error);
            message.error('Có lỗi khi tải lên bình luận');
        }
    };

    const handleLikeComment = async (commentId: string, userId: string) => {
        try {
            await likeComment(commentId, userId);

            // Check if this is a main comment or subcomment
            const isMain = isMainComment(commentId);

            if (isMain) {
                // Update main comment like state
                setComments(prevComments =>
                    prevComments.map(comment =>
                        comment._id === commentId
                            ? {
                                ...comment,
                                like_count: comment.isLiked ? comment.like_count - 1 : comment.like_count + 1,
                                isLiked: !comment.isLiked
                            }
                            : comment
                    )
                );
            } else {
                // Find which parent comment contains this subcomment
                for (const parentId in subComments) {
                    const subCommentIndex = subComments[parentId].findIndex(sc => sc._id === commentId);
                    if (subCommentIndex >= 0) {
                        // Update this specific subcomment
                        setSubComments(prev => ({
                            ...prev,
                            [parentId]: prev[parentId].map(subComment =>
                                subComment._id === commentId
                                    ? {
                                        ...subComment,
                                        like_count: subComment.isLiked ? subComment.like_count - 1 : subComment.like_count + 1,
                                        isLiked: !subComment.isLiked
                                    }
                                    : subComment
                            )
                        }));
                        break;
                    }
                }
            }
        } catch (error) {
            console.error("Có lỗi khi thích bình luận:", error);
            message.error('Có lỗi khi thích bình luận');
        }
    };

    // Add delete comment handler
    const handleDeleteComment = async (comment: any) => {
        try {
            const commentId = comment._id;
            await deleteComment(commentId);
            // Remember where we were before deletion
            const isMainCommentBool = isMainComment(commentId);

            // Find parent comment ID for subcomments
            let parentCommentId = null;
            if (!isMainCommentBool) {
                // Find which parent this subcomment belongs to
                for (const parentId in subComments) {
                    if (subComments[parentId].some(sc => sc._id === commentId)) {
                        parentCommentId = parentId;
                        break;
                    }
                }
            }

            if (!isMainCommentBool && parentCommentId) {
                // For subcomments, we'll want to stay at the parent
                setLastClosedCommentId(parentCommentId);

                // Decrement the countSubComment of the parent
                setComments(prevComments =>
                    prevComments.map(comment => {
                        if (comment._id === parentCommentId) {
                            return {
                                ...comment,
                                countSubComment: Math.max(0, (comment.countSubComment || 0) - 1)
                            };
                        }
                        return comment;
                    })
                );

                // Remove the subcomment from our local state
                setSubComments(prev => ({
                    ...prev,
                    [parentCommentId]: (prev[parentCommentId] || []).filter(
                        subComment => subComment._id !== commentId
                    )
                }));
            } else if (isMainCommentBool) {
                // For main comments, we'll scroll to the next comment or back to post
                const commentIndex = comments.findIndex(c => c._id === commentId);
                if (commentIndex > 0) {
                    setLastClosedCommentId(comments[commentIndex - 1]._id);
                } else if (commentIndex < comments.length - 1) {
                    setLastClosedCommentId(comments[commentIndex + 1]._id);
                } else {
                    setLastClosedCommentId(null);
                }

                // Remove the main comment and its subcomments
                setComments(prevComments => prevComments.filter(comment => comment._id !== commentId));

                // Clean up any stored subcomments
                setSubComments(prev => {
                    const newSubComments = {...prev};
                    delete newSubComments[commentId];
                    return newSubComments;
                });
            }

            // Update the comment count in parent component
            if (onCommentCountChange) {
                if (isMainCommentBool) {
                    // For main comment, remove it and all its subcomments
                    const deletedComment = comments.find(c => c._id === commentId);
                    const subCommentCount = deletedComment?.countSubComment || 0;
                    const newCount = getTotalCommentCount(comments.filter(c => c._id !== commentId)) - subCommentCount;
                    onCommentCountChange(newCount);
                } else if (parentCommentId) {
                    // For subcomment, just decrement by 1
                    const newCount = getTotalCommentCount(comments) - 1;
                    onCommentCountChange(newCount);
                }
            }

            // After deletion, scroll to the appropriate place
            setTimeout(() => {
                if (lastClosedCommentId && commentRefs.current[lastClosedCommentId]) {
                    scrollToComment(lastClosedCommentId);
                }
            }, 100);

            message.success('Xoá bình luận thành công');
        } catch (error) {
            console.error("Có lỗi khi xoá bình luận:", error);
            message.error('Có lỗi khi xoá bình luận');
        }
    };

    // Check if user is the owner of the comment
    const isCommentOwner = (comment: CommentInterface) => {
        return comment.user_id._id === user._id || user.role === "admin";
    };

    const replyComment = (commentId: string, username: string) => {
        // Set active comment to the one being replied to
        setActiveCommentId(commentId);

        // If it's a subcomment, make sure the parent comment is expanded
        if (!isMainComment(commentId)) {
            // Find which parent this subcomment belongs to
            for (const parentId in subComments) {
                if (subComments[parentId].some(sc => sc._id === commentId)) {
                    setExpandedComments(prev => new Set([...prev, parentId]));
                    break;
                }
            }
        } else {
            // If it's a main comment, make sure it's expanded
            setExpandedComments(prev => new Set([...prev, commentId]));
        }

        // Make sure the comment is visible if it's a main comment
        if (isMainComment(commentId)) {
            const commentIndex = comments.findIndex(c => c._id === commentId);
            if (commentIndex >= 0 && commentIndex >= visibleMainComments) {
                setVisibleMainComments(commentIndex + 1);
            }
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

                // Important: Don't trigger scrolling when closing replies
                // This fixes the issue where it would scroll to the top
            } else {
                newSet.add(commentId);

                // Load subcomments if not already loaded or if we have fewer than expected
                const comment = comments.find(c => c._id === commentId);
                const currentSubComments = subComments[commentId] || [];
                if (comment &&
                    comment.countSubComment > 0 &&
                    currentSubComments.length < Math.min(MAX_VISIBLE_REPLIES, comment.countSubComment)) {
                    fetchSubComments(commentId);
                }

                // When expanding replies, scroll to the comment with a delay
                setTimeout(() => {
                    scrollToComment(commentId, 'start');
                }, 100);
            }
            return newSet;
        });
    };

    // Effect to handle scroll behavior after closing comments - modified to not scroll when closing
    useEffect(() => {
        if (lastClosedCommentId && commentRefs.current[lastClosedCommentId]) {
            // We only scroll if this was triggered by something other than closing comments
            // This check prevents unnecessary scrolling when closing subcomments
            const wasClosingAction = !expandedComments.has(lastClosedCommentId);
            if (!wasClosingAction) {
                setTimeout(() => {
                    if (commentRefs.current[lastClosedCommentId]) {
                        scrollToComment(lastClosedCommentId, 'center');
                    }
                }, 100);
            }
        }
    }, [expandedComments, lastClosedCommentId]);

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

    const loadMoreSubComments = (commentId: string) => {
        const pagination = subCommentPagination[commentId];
        if (pagination && pagination.hasMore) {
            fetchSubComments(commentId, pagination.page + 1);
        }
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

    // Render reply form
    const renderReplyForm = (parentId: string) => (
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
                <Form.Item
                    name="parentId"
                    initialValue={parentId}
                    style={{ display: 'none' }} // Hide the parentId field
                >
                </Form.Item>
                <Space>
                    <Button type="primary" htmlType="submit" size="small">
                        Thêm bình luận
                    </Button>
                    <Button
                        size="small"
                        onClick={() => {
                            setActiveCommentId(null);
                            form.resetFields();
                            setTextareaValue('');
                        }}
                    >
                        Huỷ
                    </Button>
                </Space>
            </Form>
        </div>
    );

    // Render comment action buttons
    const renderActionButtons = (comment: CommentInterface) => (
        <Space key="actions" className={styles.actionButtons}>
            <Button
                type="text"
                className={`${styles.actionButton} ${comment.isLiked ? styles.likedButton : ''}`}
                icon={comment.isLiked ? <LikeFilled style={{ color: '#1890ff' }} /> : <LikeOutlined />}
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
                Trả lời
            </Button>

            {/* Delete comment button - only shown for comment owner */}
            {isCommentOwner(comment) && (
                <Popconfirm className={styles.confirmButton}
                    title="Xoá bình luận"
                    description="Bạn muốn xoá bình luận?"
                    onConfirm={() => handleDeleteComment(comment)}
                    okText="Xoá"
                    cancelText="Huỷ"
                    overlayClassName="custom-popconfirm"
                >
                    <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        className={styles.actionButton}
                    >
                        Xoá
                    </Button>
                </Popconfirm>
            )}
        </Space>
    );

    // Render a single comment (works for both main and sub comments)
    const renderComment = (comment: CommentInterface, level: number) => (
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
                            src={comment.user_id.avatar?.[0] || 'https://i.pinimg.com/474x/c2/7e/b7/c27eb77c278f37d9a204bff5a661b83b.jpg'}
                            alt="avatar"
                            className={level === 0 ? styles.avatarMain : styles.avatarSub}
                        />
                    }
                    title={<Text strong className={level === 1 ? styles.subCommentName : ''}>{comment.user_id.username}</Text>}
                    description={
                        <>
                            <Text
                                className={level === 1 ? styles.subCommentContent : ''}
                                ellipsis={collapsedComments.has(comment._id)}
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
                    {renderReplyForm(comment.parentId? comment.parentId : comment._id)}
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
                const hasReplies = comment.countSubComment && comment.countSubComment > 0;
                const isExpanded = expandedComments.has(comment._id);
                const isLoadingSubComments = loadingSubComments[comment._id];
                const currentSubComments = subComments[comment._id] || [];

                return (
                    <div key={comment._id} className={styles.mainCommentWrapper}>
                        {/* Main comment */}
                        {renderComment(comment, 0)}

                        {/* Toggle button for replies - only show if there are replies */}
                        {hasReplies !== 0 && (
                            <Button
                                type="text"
                                className={styles.viewRepliesButton}
                                onClick={() => toggleReplies(comment._id)}
                                icon={isExpanded ? <UpOutlined /> : <DownOutlined />}
                                loading={isLoadingSubComments}
                            >
                                {isExpanded ? 'Ẩn' : 'Hiển thị'} {comment.countSubComment} {'câu trả lời'}
                            </Button>
                        )}

                        {/* Replies section - only show if expanded */}
                        {(hasReplies !== 0 && isExpanded) && (
                            <div className={`${styles.repliesContainer} ${styles.animateReplies}`}>
                                <List
                                    loading={isLoadingSubComments}
                                    itemLayout="vertical"
                                    dataSource={currentSubComments}
                                    renderItem={subComment => renderComment(subComment, 1)}
                                />

                                {/* Show load more button if there are more subcomments */}
                                {subCommentPagination[comment._id]?.hasMore && (
                                    <Button
                                        type="link"
                                        onClick={() => loadMoreSubComments(comment._id)}
                                        className={styles.loadMoreRepliesButton}
                                        loading={isLoadingSubComments}
                                    >
                                        Hiển thị thêm (
                                        {comment.countSubComment - currentSubComments.length} câu trả lời)
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
                        <Form.Item name="content" rules={[{ required: true, message: 'Viết bình luận' }]}>
                            <TextArea
                                className={styles.autoExpandTextarea}
                                value={textareaValue}
                                onChange={handleTextareaChange}
                                autoSize={{ minRows: 2, maxRows: 6 }}
                                placeholder="Thêm bình luận"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" disabled={isAddComment}>
                                {isAddComment ? (
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <Loader2 size={20} className="spinner" />
      Đang tải
    </span>
                                ) : (
                                    'Thêm bình luận'
                                )}
                            </Button>

                        </Form.Item>
                    </Form>
                </div>
            )}
        </div>
    );
};

export default CommentComponent;
