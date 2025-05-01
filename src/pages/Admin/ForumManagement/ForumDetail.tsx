import React, { useEffect, useState } from 'react'
import { Card, Typography, Row, Col, Image, Space, Skeleton, Divider, Avatar, Tag } from 'antd'
import moment from 'moment'
import { getForumById } from '../../../services/forum.ts'
import { Forum, User } from '../../../model/model.ts'
import CommentComponent from '../../../components/Comment/Comment.tsx'
import { UserOutlined, CalendarOutlined } from '@ant-design/icons'
import { getUserById } from '../../../services/user.ts'

const { Title, Paragraph, Text } = Typography

interface ForumDetailProps {
    forumId: string;
}

const ForumDetail: React.FC<ForumDetailProps> = ({ forumId }) => {
    const [forumData, setForumData] = useState<Forum | null>(null)
    const [isLoading, setLoading] = useState(true)
    const [user, setUser] = useState<User>()

    useEffect(() => {
        const fetchForumData = async () => {
            if (!forumId) return;

            setLoading(true);
            try {
                const forumResponse = await getForumById(forumId)
                setForumData(forumResponse.data)
                const userData = await getUserById(forumResponse.data.user_id)
                setUser(userData.data)
                setLoading(false)
            } catch (error) {
                console.error('Không thể tải dữ liệu diễn đàn:', error)
                setLoading(false)
            }
        }

        fetchForumData()
    }, [forumId])

    if (isLoading) {
        return <Skeleton active paragraph={{ rows: 10 }} />
    }

    if (!forumData) {
        return (
            <Card>
                <div style={{ textAlign: 'center' }}>Không có dữ liệu diễn đàn</div>
            </Card>
        )
    }

    const {
        title = 'Không xác định',
        description = 'Không xác định',
        images = [],
        user_id = { username: 'Không xác định' },
        createdAt = 'Không xác định',
    } = forumData

    return (
        <div>
            <Row gutter={[0, 16]}>
                <Col span={24}>
                    <Space>
                        {user ? (
                            <Avatar
                                src={user.avatar?.[0]}
                                icon={!user.avatar?.[0] && <UserOutlined />}
                            />
                        ) : (
                            <Avatar icon={<UserOutlined />} />
                        )}
                        {user && user.username &&(
                            <Text strong>{user.username}</Text>
                            )}
                        <Divider type="vertical" />
                        <Space>
                            <CalendarOutlined />
                            <Text>
                                {moment(createdAt).format('DD/MM/YYYY HH:mm')}
                            </Text>
                        </Space>
                    </Space>
                </Col>
            </Row>

            <Divider />

            <Row gutter={[0, 16]}>
                <Col span={24}>
                    <Title level={3}>{title}</Title>
                    {images && images.length > 0 && (
                        <Image
                            width="100%"
                            src={images[0]}
                            alt={title}
                            style={{
                                maxHeight: '300px',
                                objectFit: 'cover',
                                borderRadius: '8px',
                            }}
                        />
                    )}
                </Col>
            </Row>

            <Row style={{ marginTop: '16px' }}>
                <Col span={24}>
                    <Card title="Nội dung" bordered={false}>
                        <Paragraph>{description}</Paragraph>
                    </Card>
                </Col>
            </Row>

            <Divider />

            <Row>
                <Col span={24}>
                    <Title level={4}>Bình luận</Title>
                    <CommentComponent
                        commentableId={forumId}
                        commentableType={'FORUM'}
                    />
                </Col>
            </Row>
        </div>
    )
}

export default ForumDetail