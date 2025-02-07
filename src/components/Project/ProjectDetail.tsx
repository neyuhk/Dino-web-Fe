// src/components/Homepage/ProjectDetail/ProjectDetail.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Typography, Spin, Row, Col, Avatar } from 'antd';
import { Project } from '../../model/model.ts';
import { getProjectById } from '../../services/project.ts';
import { convertDateTime, convertDateTimeToDate } from '../../helpers/convertDateTime.ts'

const { Title, Paragraph, Text } = Typography;

const ProjectDetail: React.FC = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const getProject = async (id: string) => {
        try {
            const response = await getProjectById(id);
            setProject(response.data);
        } catch (error) {
            console.error('Error fetching project:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (projectId) {
            getProject(projectId);
        }
    }, [projectId]);

    if (loading) {
        return <Spin />;
    }

    if (!project) {
        return <div>Project not found</div>;
    }

    return (
        <Card
            cover={<img alt={project.name} src={project.images[0]} />}
            hoverable={true}
        >
            <Title level={2}>{project.name}</Title>
            <Paragraph>{project.description}</Paragraph>
            <Row>
                <Col span={12}>
                    <Text><strong>Direction:</strong> {project.direction}</Text>
                </Col>
                <Col span={12}>
                    <Text><strong>Type:</strong> {project.project_type}</Text>
                </Col>
            </Row>
            <Row>
                <Col span={12}>
                    <Text><strong>Likes:</strong> {project.like_count}</Text>
                </Col>
                <Col span={12}>
                    <Text><strong>Views:</strong> {project.view_count}</Text>
                </Col>
            </Row>
            <Row>
                <Col span={12}>
                    <Text><strong>Created At:</strong> {convertDateTimeToDate(project.createdAt)} </Text>
                </Col>
                <Col span={12}>
                    <Text><strong>Updated At:</strong> {convertDateTimeToDate(project.updatedAt)}</Text>
                </Col>
            </Row>
            <Row align="middle">
                <Col>
                    <Avatar src={project.user_id.avatar} />
                </Col>
                <Col>
                    <Text><strong>Created by:</strong> {project.user_id.username}</Text>
                </Col>
            </Row>
        </Card>
    );
};

export default ProjectDetail;
