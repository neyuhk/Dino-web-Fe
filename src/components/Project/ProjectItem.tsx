// src/components/Homepage/ProjectItem/ProjectItem.tsx
import React from 'react'
import { Card, Typography, Row, Col } from 'antd'
import { CommentOutlined, EditOutlined, LikeOutlined, MoreOutlined, UserOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import { Project } from '../../model/model.ts'
import styles from './ProjectItem.module.css'

const { Title, Paragraph, Text } = Typography

interface ProjectProps {
    item: Project
}
const bodyStyle: React.CSSProperties = {
    padding: 0,
    height: '80px',
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical'
}
const ProjectItem: React.FC<ProjectProps> = ({ item }) => {
    const navigate = useNavigate()

    const projectDetail = () => {
        navigate(`project-detail/${item._id}`)
    }

    return (
        <Card
            cover={<img alt={item.name} src={item.images[0]} className={styles.projectImage} />}
            hoverable={true}
            actions={[
                <LikeOutlined />,
                <CommentOutlined />,
                <Link to={`/blockly/${item._id}`}><EditOutlined /></Link>,
                <MoreOutlined onClick={projectDetail} />,
            ]}
            bodyStyle={bodyStyle} // Apply CSS class
        >
            <div style={{ padding: '0 20px' }}>
                <Row justify="space-between">
                    <Col>
                        <Title level={5}>{item.name}</Title>
                    </Col>
                    <Col style={{ display: 'flex', alignItems: 'center' }}>
                        <Text><UserOutlined /> {item.user_id.username}</Text>
                    </Col>
                </Row>
                <Paragraph className={styles.projectDescription}>{item.description}</Paragraph>
            </div>
        </Card>
    )
}

export default ProjectItem
