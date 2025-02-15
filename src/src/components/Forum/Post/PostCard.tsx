import React from 'react';
import { Card, Space, Avatar, Typography, Tag } from 'antd';
import { UserOutlined, EyeOutlined, LikeOutlined } from '@ant-design/icons';
import { Forum } from '../../../model/model.ts'

const { Title, Text } = Typography;

const PostCard: React.FC<{ post: Forum }> = ({ post }) => (
    <Card className="mb-4 hover:shadow-lg transition-shadow">
        <Space direction="vertical" className="w-full">
            {post.images[0] && (
                <img
                    src={post.images[0]}
                    alt={post.title}
                    className="w-full h-48 object-cover rounded"
                />
            )}
            <Space className="w-full justify-between">
                <Space>
                    <Avatar icon={<UserOutlined />} />
                    <div>
                        <Text strong>{post.user_id.username}</Text>
                        <Tag color={post.user_id.role === 'teacher' ? 'blue' : 'green'}>
                            {post.user_id.role}
                        </Tag>
                    </div>
                </Space>
                <Text type="secondary">{new Date(post.createdAt).toLocaleDateString()}</Text>
            </Space>
            <Title level={4}>{post.title}</Title>
            <Text>{post.description}</Text>
            <Space className="w-full justify-between">
                <Space>
                    <Space>
                        <LikeOutlined />
                        <Text>{post.like_count}</Text>
                    </Space>
                    <Space>
                        <EyeOutlined />
                        <Text>{post.view_count}</Text>
                    </Space>
                </Space>
            </Space>
        </Space>
    </Card>
);

export default PostCard;
