import React from 'react';
import {
    Typography,
    Avatar,
    Space,
    Button,
    Card,
    Row,
    Col,
    Statistic,
    Tag,
    Image,
    Divider
} from 'antd';
import {
    HeartOutlined,
    HeartFilled,
    EyeOutlined,
    UserOutlined,
    BlockOutlined,
    MessageOutlined,
    StarOutlined
} from '@ant-design/icons';
import { Project } from '../../../model/model.ts';
import CommentComponent from '../../../components/Comment/Comment.tsx';
import moment from 'moment';
import './ProjectDetail.css';

const { Title, Paragraph, Text } = Typography;

interface ProjectDetailComponentProps {
    project: Project;
    isLiked: boolean;
    onLike: () => void;
    relatedProjects: Project[];
    onNavigateToProject: (project: Project) => void;
}

const ProjectDetailComponent: React.FC<ProjectDetailComponentProps> = ({
                                                                           project,
                                                                           isLiked,
                                                                           onLike,
                                                                           relatedProjects,
                                                                           onNavigateToProject
                                                                       }) => {
    const getProjectTypeTag = (type: string) => {
        let color = 'default';
        switch(type) {
            case 'DEFAULT':
                color = 'green';
                break;
            case 'RECOMMENT':
                color = 'blue';
                break;
            case 'PUBLIC':
                color = 'purple';
                break;
            case 'EXAMPLE':
                color = 'orange';
                break;
            default:
                color = 'default';
        }

        return <Tag color={color}>{type}</Tag>;
    };

    return (
        <div className="project-detail-content">
            <div className="project-detail-hero">
                <div className="project-detail-image">
                    {project.images && project.images[0] ? (
                        <Image
                            src={project.images[0]}
                            alt={project.name}
                            preview={false}
                            className="main-image"
                        />
                    ) : (
                        <Image
                            src={'/MockData/flapybird.jpg'}
                            alt="Default project image"
                            preview={false}
                            className="main-image"
                        />
                    )}
                </div>

                <Card className="project-detail-header">
                    <div className="project-meta">
                        <div className="project-title-wrapper">
                            <Title level={3} className="project-title">{project.name || 'Không tên'}</Title>
                            <div className="project-creator">
                                <Avatar icon={<UserOutlined />} size="small" />
                                <Text>{project.user_id ? project.user_id.username : 'Không xác định'}</Text>
                            </div>
                        </div>
                        <div className="project-actions">
                            <Button
                                type="primary"
                                icon={<BlockOutlined />}
                                href={`/blockly/${project._id}`}
                                className="blockly-button"
                            >
                                Mở trong Blockly
                            </Button>
                        </div>
                    </div>
                    <div className="project-info">
                        {getProjectTypeTag(project.project_type || 'Không xác định')}
                        <Text type="secondary" className="created-date">
                            Ngày tạo: {project.createdAt ? moment(project.createdAt).format('DD/MM/YYYY') : 'Không xác định'}
                        </Text>
                    </div>
                </Card>

                <Card className="project-stats">
                    <Row gutter={16} justify="space-around">
                        <Col span={6}>
                            <Statistic
                                title="Lượt thích"
                                value={project.like_count || 0}
                                prefix={
                                    isLiked ? (
                                        <HeartFilled
                                            className="stat-icon like-icon"
                                            onClick={onLike}
                                        />
                                    ) : (
                                        <HeartOutlined
                                            className="stat-icon like-icon"
                                            onClick={onLike}
                                        />
                                    )
                                }
                            />
                        </Col>
                        <Col span={6}>
                            <Statistic
                                title="Lượt xem"
                                value={project.view_count || 0}
                                prefix={<EyeOutlined className="stat-icon view-icon" />}
                            />
                        </Col>
                        <Col span={6}>
                            <Statistic
                                title="Yêu thích"
                                value={0}
                                prefix={<StarOutlined className="stat-icon star-icon" />}
                            />
                        </Col>
                        <Col span={6}>
                            <Statistic
                                title="Bình luận"
                                value={0}
                                prefix={<MessageOutlined className="stat-icon comment-icon" />}
                            />
                        </Col>
                    </Row>
                </Card>

                <Card className="project-description">
                    <Title level={4}>Mô tả dự án</Title>
                    <Paragraph className="description-text">
                        {project.description || 'Không có mô tả cho dự án này.'}
                    </Paragraph>
                </Card>

                <Card className="project-comments">
                    <Title level={4}>Bình luận</Title>
                    <CommentComponent
                        commentableId={project._id}
                        commentableType={'PROJECT'}
                    />
                </Card>

                {relatedProjects.length > 0 && (
                    <Card className="related-projects">
                        <Title level={4}>Các dự án khác</Title>
                        <Row gutter={[16, 16]} className="related-projects-grid">
                            {relatedProjects.map(relatedProject => (
                                <Col span={12} key={relatedProject._id}>
                                    <div
                                        className="related-project-item"
                                        onClick={() => onNavigateToProject(relatedProject)}
                                    >
                                        <div className="related-project-image">
                                            {relatedProject.images && relatedProject.images[0] ? (
                                                <img
                                                    src={relatedProject.images[0]}
                                                    alt={relatedProject.name}
                                                />
                                            ) : (
                                                <img
                                                    src={'/MockData/flapybird.jpg'}
                                                    alt="Default"
                                                />
                                            )}
                                        </div>
                                        <div className="related-project-details">
                                            <Text strong className="related-title">{relatedProject.name || 'Không tên'}</Text>
                                            <div className="related-meta">
                                                {getProjectTypeTag(relatedProject.project_type || 'Không xác định')}
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default ProjectDetailComponent;