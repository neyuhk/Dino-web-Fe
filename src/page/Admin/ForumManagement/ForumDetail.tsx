import React, { useEffect, useState } from 'react';
import { Card, Typography, Row, Col, Image, Space } from 'antd';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import { getForumById } from '../../../services/forum.ts';
import { Forum } from '../../../model/model.ts';
import CommentComponent from '../../../components/Comment/Comment.tsx'
import { addComment } from '../../../services/comment.ts'

const { Title, Paragraph, Text } = Typography;

const ForumDetailPage: React.FC = () => {
    const { forumId } = useParams<{ forumId: string }>();
    const [forumData, setForumData] = useState<Forum | null>(null);
    const [isLoading, setLoading] = useState(true);
    const userId = '6716836ed25d75774c39730d'; // Replace with actual userId from local storage

    useEffect(() => {
        const fetchForumData = async () => {
            try {
                const forumResponse = await getForumById(forumId ? forumId : '');
                setForumData(forumResponse.data);
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch forum data:', error);
                setLoading(false);
            }
        };

        fetchForumData();
    }, [forumId]);

    if (!forumData) {
        return (
            <Card>
                <div className="text-center">No forum data available</div>
            </Card>
        );
    }

    const handleAddComment = async (values: { content: string }) => {
        try {
            const comment = {
                content: values.content,
                commentableId: forumId,
                commentableType: 'FORUM',
                userId: userId, // Replace with actual userId from local storage
                parentId: null, // Adjust as needed
            };
            await addComment(comment);
        } catch (error) {
            console.error('Failed to add comment:', error);
        }
    };

    const {
        title = 'Unknown',
        description = 'Unknown',
        images = [],
        user_id = { username: 'Unknown' },
        createdAt = 'Unknown',
    } = forumData;

    return (
        <Card className="max-w-4xl mx-auto">
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Title level={2}>{title}</Title>
                </Col>
            </Row>
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={16}>
                    {images[0] ? (
                        <Image
                            width="100%"
                            height={400}
                            src={images[0]}
                            alt={title}
                            preview={false}
                            style={{ objectFit: 'cover', borderRadius: '8px' }}
                        />
                    ) : (
                        <Image
                            width="100%"
                            height={400}
                            preview={false}
                            src={'/MockData/default-forum.jpg'}
                            alt={'default'}
                            style={{ objectFit: 'cover', borderRadius: '8px' }}
                        />
                    )}
                </Col>
                <Col xs={24} sm={8}>
                    <Space direction="vertical" size="large" style={{ width: '100%' }}>
                        <Card>
                            <Text strong>Author: </Text>
                            <Text>{user_id.username}</Text>
                            <br />
                            <Text strong>Created At: </Text>
                            <Text>{moment(createdAt).format('DD/MM/YYYY')}</Text>
                        </Card>
                    </Space>
                </Col>
            </Row>
            <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
                <Col span={24}>
                    <Card>
                        <Title level={4}>Forum Description</Title>
                        <Paragraph>{description}</Paragraph>
                    </Card>
                </Col>
            </Row>
            <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
                <Col span={24}>
                    <Card>
                        <Title level={2}>Bình luận</Title>
                        <CommentComponent commentableId={forumId ? forumId : ''} commentableType={"FORUM"}/>
                    </Card>
                </Col>
            </Row>
        </Card>
    );
};

export default ForumDetailPage;
