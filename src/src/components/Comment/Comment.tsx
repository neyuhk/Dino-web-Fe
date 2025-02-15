import React, { useEffect, useState, useRef } from 'react'
import { List, Avatar, Space, Typography, message, Button, Form, Input } from 'antd'
import { LikeOutlined, UserOutlined, MessageOutlined } from '@ant-design/icons'
import { Comment as CommentInterface, SubComment, CommentReq } from '../../model/model.ts'
import { addComment, getCommentsByCommentableId, likeComment } from '../../services/comment.ts'
import { useSelector } from 'react-redux'

const { Text, Title } = Typography
const { TextArea } = Input

interface CommentProps {
    commentableId: string;
    commentableType: string;
}

const CommentComponent: React.FC<CommentProps> = ({ commentableId, commentableType }) => {
    const [comments, setComments] = useState<CommentInterface[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [form] = Form.useForm()
    const { user } = useSelector((state: any) => state.auth)
    let parentId: string | null = null
    const formRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await getCommentsByCommentableId(commentableId)
                setComments(response.data)
                setIsLoading(false)
            } catch (error) {
                message.error('Failed to fetch comments')
                setIsLoading(false)
            }
        }
        fetchComments()
    }, [commentableId])

    const handleAddComment = async (values: { content: string }) => {
        try {
            const comment: CommentReq = {
                content: values.content,
                commentableId: commentableId,
                commentableType: commentableType,
                userId: user._id,
                parentId: parentId, // truyen parentId khi reply comment
            }
            const newComment = await addComment(comment)
            setComments([...comments, newComment.data]) // dang bi chua map duoc du lieu
            form.resetFields()
        } catch (error) {
            message.error('Failed to add comment')
        }
    }

    const handleLikeComment = async (commentId: string, userId: string) => {
        try {
            await likeComment(commentId, userId) //like xong chua update duoc
            setComments(comments.map(comment =>
                comment._id === commentId ? { ...comment, like_count: comment.like_count + 1 } : comment,
            ))
        } catch (error) {
            message.error('Failed to like comment')
        }
    }

    const replyComment = (commentId: string) => {
        parentId = commentId
        form.setFieldsValue({ content: `@${comments.find(comment => comment._id === commentId)?.user_id.username} ` })
        formRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    const renderSubComments = (subComments: SubComment[]) => (
        <List
            itemLayout="vertical"
            dataSource={subComments}
            renderItem={subComment => (
                <List.Item
                    key={subComment._id}
                    style={{ paddingLeft: '40px' }}
                    actions={[
                        <Space>
                            <LikeOutlined onClick={() => handleLikeComment(subComment._id, user._id)} />
                            <Text>{subComment.like_count}</Text>
                        </Space>,
                    ]}
                >
                    <List.Item.Meta
                        avatar={<img src={'/MockData/avt-def.jpg'} alt="avatar"
                                     style={{ width: '32px', height: '32px', borderRadius: '50%' }} />}
                        title={<Text strong>{subComment.user_id.username}</Text>}
                        description={subComment.content}
                    />
                </List.Item>
            )}
        />
    )

    return (
        <>
            <List
                loading={isLoading}
                itemLayout="vertical"
                dataSource={comments}
                renderItem={comment => (
                    <>
                        <List.Item
                            key={comment._id}
                            actions={[
                                <Space>
                                    <LikeOutlined onClick={() => handleLikeComment(comment._id, user._id)} />
                                    <Text>{comment.like_count}</Text>
                                    <Button onClick={() => replyComment(comment._id)} type="link"
                                            icon={<MessageOutlined />}>Reply</Button>
                                </Space>,
                            ]}
                        >
                            <List.Item.Meta
                                avatar={<img src={'/MockData/avt-def.jpg'} alt="avatar"
                                             style={{ width: '32px', height: '32px', borderRadius: '50%' }} />}
                                title={<Text strong>{comment.user_id.username}</Text>}
                                description={comment.content}
                            />
                        </List.Item>
                        {comment.sub_comments.length > 0 && renderSubComments(comment.sub_comments)}
                    </>
                )}
            />
            <div ref={formRef}>
                <Form form={form} onFinish={handleAddComment}>
                    <Form.Item name="content" rules={[{ required: true, message: 'Please enter your comment' }]}>
                        <TextArea rows={2} placeholder="Add a comment" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">Add Comment</Button>
                    </Form.Item>
                </Form>
            </div>
        </>
    )
}

export default CommentComponent
