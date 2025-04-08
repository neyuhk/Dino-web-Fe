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
}

const CommentComponent: React.FC<CommentProps> = ({ commentableId, commentableType }) => {
    const [comments, setComments] = useState<CommentInterface[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [form] = Form.useForm();
    const { user } = useSelector((state: any) => state.auth);
    const [activeCommentId, setActiveCommentId] = useState<string | null>(null);
    const [textareaValue, setTextareaValue] = useState<string>('');
    const commentRefs = useRef<{[key: string]: HTMLDivElement | null}>({});
    const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
    const replyFormRef = useRef<HTMLDivElement | null>(null);

    const fetchComments = async () => {
        try {
            setIsLoading(true);
            const response = await getCommentsByCommentableId(commentableId);
            setComments(response.data);
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

            console.log("Sending comment:", comment);
            const response = await addComment(comment);
            console.log("Response:", response);

            // Refresh comments to show the new one
            await fetchComments();

            // Keep expanded the parent comment
            if (parentCommentId) {
                setExpandedComments(prev => new Set([...prev, parentCommentId]));
            }

            // Reset form and active comment state
            form.resetFields();
            setTextareaValue('');
            setActiveCommentId(null);

            message.success('Comment added successfully');
        } catch (error) {
            console.error("Error adding comment:", error);
            message.error('Failed to add comment');
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
            console.error("Error liking comment:", error);
            message.error('Failed to like comment');
        }
    };

    // Add delete comment handler
    const handleDeleteComment = async (commentId: string) => {
        try {
            await deleteComment(commentId);

            // Update local state after successful deletion
            setComments(prevComments => {
                // Check if it's a main comment
                const updatedComments = prevComments.filter(comment => comment._id !== commentId);

                // If comment count didn't change, it must be a sub-comment
                if (updatedComments.length === prevComments.length) {
                    return prevComments.map(comment => ({
                        ...comment,
                        sub_comments: comment.sub_comments?.filter(sub => sub._id !== commentId)
                    }));
                }

                return updatedComments;
            });

            message.success('Comment deleted successfully');
        } catch (error) {
            console.error("Error deleting comment:", error);
            message.error('Failed to delete comment');
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

        // Set initial value with @mention
        const initialValue = `@${username} `;
        form.setFieldsValue({ content: initialValue });
        setTextareaValue(initialValue);

        // Focus on textarea after a short delay
        setTimeout(() => {
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
            if (newSet.has(commentId)) {
                newSet.delete(commentId);
            } else {
                newSet.add(commentId);
            }
            return newSet;
        });
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
            className={level === 1 ? styles.subCommentContainer : ''}
            id={`comment-${comment._id}`}
        >
            <List.Item
                className={styles.commentItem}
                actions={[renderActionButtons(comment)]}
            >
                <List.Item.Meta
                    avatar={
                        <img
                            src={comment.user_id.avatar || '/MockData/avt-def.jpg'}
                            alt="avatar"
                            className={level === 0 ? styles.avatarMain : styles.avatarSub}
                        />
                    }
                    title={<Text strong className={level === 1 ? styles.subCommentName : ''}>{comment.user_id.username}</Text>}
                    description={<Text className={level === 1 ? styles.subCommentContent : ''}>{comment.content}</Text>}
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
            dataSource={comments}
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
                                {isExpanded ? 'Hide' : 'View'} {comment.sub_comments.length} {comment.sub_comments.length === 1 ? 'reply' : 'replies'}
                            </Button>
                        )}

                        {/* Replies section - only show if expanded */}
                        {(hasReplies && isExpanded) && (
                            <div className={styles.repliesContainer}>
                                <List
                                    itemLayout="vertical"
                                    dataSource={comment.sub_comments}
                                    renderItem={subComment => renderComment(subComment, 1)}
                                />
                            </div>
                        )}
                    </div>
                );
            }}
        />
    );

    return (
        <div className={styles.container}>
            {renderMainComments()}

            {/* Main comment form - only show when no comment is being replied to */}
            {!activeCommentId && (
                <div className={styles.mainCommentForm}>
                    <Form form={form} onFinish={handleAddComment}>
                        <Form.Item name="content" rules={[{ required: true, message: 'Please enter your comment' }]}>
                            <TextArea
                                className={styles.autoExpandTextarea}
                                value={textareaValue}
                                onChange={handleTextareaChange}
                                autoSize={{ minRows: 2, maxRows: 6 }}
                                placeholder="Add a comment"
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