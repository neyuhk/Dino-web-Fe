import React from 'react';
import { Row, Col } from 'antd';
import PostCard from './PostCard';
import { Forum } from '../../../model/model.ts'

interface PostsListProps {
    posts: Forum[];
}

const PostsList: React.FC<PostsListProps> = ({ posts }) => (
    <Row gutter={[16, 16]}>
        {posts.map(post => (
            <Col xs={24} sm={12} lg={8} key={post._id}>
                <PostCard post={post} />
            </Col>
        ))}
    </Row>
);

export default PostsList;
