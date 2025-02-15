import React, { useEffect, useState } from 'react'
import { Card, Typography, Row, Col, Image, Statistic, Avatar, Space } from 'antd'
import { HeartOutlined, HeartFilled, EyeOutlined, MessageOutlined, UserOutlined, StarOutlined } from '@ant-design/icons'
import { Project } from '../../../model/model.ts'
import { getProjectById, isLikedProject, likeProject } from '../../../services/project.ts'
import { useParams } from 'react-router-dom'
import moment from 'moment/moment'
import CommentComponent from '../../../components/Comment/Comment.tsx'
import { useSelector } from 'react-redux'

const { Title, Paragraph, Text } = Typography

const ProjectDetailPage: React.FC = () => {
    const { user } = useSelector((state: any) => state.auth)
    const { projectId } = useParams<{ projectId: string }>()
    const [projectData, setProjectData] = useState<Project | null>(null)
    const [isLiked, setIsLiked] = useState(false)
    const userId = user._id // Replace with actual userId from local storage

    useEffect(() => {
        const fetchProjectData = async () => {
            try {
                const response = await getProjectById(projectId ? projectId : '')
                setProjectData(response.data)
                console.log(projectId, userId)
                const liked = await isLikedProject(projectId ? projectId : '', userId);
                setIsLiked(liked.data);
                console.log(liked.data);
            } catch (error) {
                console.error('Failed to fetch project data:', error)
            }
        }

        fetchProjectData()
    }, [projectId])


    if (!projectData) {
        return (
            <Card>
                <div className="text-center">No project data available</div>
            </Card>
        )
    }

    const {
        name = 'Unknown',
        description = 'Unknown',
        images = [],
        like_count = 0,
        view_count = 0,
        user_id = { username: 'Unknown' },
        createdAt = 'Unknown',
    } = projectData

    const username = user_id ? user_id.username : 'Unknown'

    const handleLikeProject = async () => {
        try {
            if (isLiked) {
                setProjectData(prevData => prevData ? { ...prevData, like_count: prevData.like_count - 1 } : null);
            } else {
                setProjectData(prevData => prevData ? { ...prevData, like_count: prevData.like_count + 1 } : null);
            }
            setIsLiked(!isLiked);
            console.log(isLiked)
            await likeProject(projectId ? projectId : '', userId)
        } catch (error) {
            console.error('Failed to like project:', error)
        }
    }
    return (
        <Card className="max-w-xl mx-auto">
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={16}>
                    {images[0] ? (
                        <Image
                            width="100%"
                            height={400}
                            src={images[0]}
                            alt={name}
                            preview={false}
                            style={{ objectFit: 'cover', borderRadius: '8px' }}
                        />
                    ) : (
                        <Image
                            width="100%"
                            height={400}
                            src={'/MockData/flapybird.jpg'}
                            alt={'default'}
                            preview={false}
                            style={{ objectFit: 'cover', borderRadius: '8px' }}
                        />
                    )}
                </Col>
                <Col xs={24} sm={8}>
                    <Card>
                        <Space>
                            <Avatar icon={<UserOutlined />} />
                            <div>
                                <Title style={{ margin: '0' }} level={2}>{name}</Title>
                                <Text strong>by {username}</Text>
                                <br />
                                <Text type="secondary">Created on {createdAt !== 'Unknown' ? moment(createdAt).format('DD/MM/YYYY') : 'Unknown'}</Text>
                            </div>
                        </Space>
                    </Card>
                </Col>
            </Row>
            <Col xs={24} sm={16}>
                <Row style={{ marginTop: '16px' }} gutter={[16, 16]} justify={'center'}>
                    <Col xs={24} sm={4}>
                        <Statistic
                            title="Likes"
                            value={like_count}
                            prefix={isLiked ? <HeartFilled style={{ color: 'red' }} onClick={handleLikeProject} /> : <HeartOutlined style={{ color: 'red' }} onClick={handleLikeProject} />}
                        />
                    </Col>
                    <Col xs={24} sm={4}>
                        <Statistic
                            title="Views"
                            value={view_count}
                            prefix={<EyeOutlined style={{ color: 'blue' }} />}
                        />
                    </Col>
                    <Col xs={24} sm={4}>
                        <Statistic
                            title="Favourites"
                            value={0}
                            prefix={<StarOutlined style={{ color: 'yellow' }} />}
                        />
                    </Col>
                    <Col xs={24} sm={4}>
                        <Statistic
                            title="Comments"
                            value={0}
                            prefix={<MessageOutlined style={{ color: 'green' }} />}
                        />
                    </Col>
                </Row>
            </Col>
            <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
                <Col span={24}>
                    <Card>
                        <Title level={4}>Project Description</Title>
                        <Paragraph>{description}</Paragraph>
                    </Card>
                </Col>
            </Row>
            <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
                <Col span={24}>
                    <Card>
                        <Title level={2}>Bình luận</Title>
                        <CommentComponent commentableId={projectId ? projectId : ''} commentableType={"PROJECT"} />
                    </Card>
                </Col>
            </Row>
        </Card>
    )
}

export default ProjectDetailPage
