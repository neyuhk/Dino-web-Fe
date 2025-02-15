// src/components/ForumUserDetail/ForumUserDetail.tsx
import React from 'react';
import { Card, Avatar, Typography, Row, Col } from 'antd';
import { LikeOutlined, CommentOutlined, ShareAltOutlined } from '@ant-design/icons';
import styles from './ForumUserDetail.module.css';
import { Forum } from '../../model/model.ts'

const { Title, Paragraph, Text } = Typography;

const ForumUserDetail: React.FC<Forum> = ({ user_id, createdAt, title, description, images }) => {
    return (
        <Card className={styles.card}>
            <Row align="middle">
                <Col>
                    <Avatar src={user_id.avatar} />
                </Col>
                <Col>
                    <Text className={styles.username}>{user_id.username}</Text>
                    <Text className={styles.createdAt}>{new Date(createdAt).toLocaleDateString()}</Text>
                </Col>
            </Row>
            <Title level={3} className={styles.title}>{title}</Title>
            <Paragraph className={styles.description}>{description}</Paragraph>
            {images && <img src={images[0]} alt="Post" className={styles.image} />}
            <div className={styles.dashBar}>
                <LikeOutlined className={styles.icon} />
                <CommentOutlined className={styles.icon} />
                <ShareAltOutlined className={styles.icon} />
            </div>
        </Card>
    );
};

export default ForumUserDetail;
