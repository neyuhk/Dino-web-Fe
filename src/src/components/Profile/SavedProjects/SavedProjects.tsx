import React, { useState } from 'react';
import { Card, Modal, Typography, Space, Avatar, Tag, Empty } from 'antd';
import { HeartFilled, ClockCircleOutlined, UserOutlined } from '@ant-design/icons';

import { format } from 'date-fns';
import styles from './SavedProjects.module.css';
import { Project } from '../../../model/model.ts'
// import { format } from 'node:url'

const { Title, Text, Paragraph } = Typography;
const { Meta } = Card;


interface SavedProjectsProps {
    projects: Project[];
    onSaveToggle: (projectId: string) => void;
}

const SavedProjects: React.FC<SavedProjectsProps> = ({ projects, onSaveToggle }) => {
    const [unsaveProjectId, setUnsaveProjectId] = useState<string | null>(null);

    const handleUnsaveConfirm = () => {
        if (unsaveProjectId) {
            onSaveToggle(unsaveProjectId);
            setUnsaveProjectId(null);
        }
    };

    const truncateText = (text: string, maxLength: number = 100) =>
        text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;

    const getProjectImage = (images: string[]) =>
        images.length > 0 ? images[0] : '/placeholder-image.png';

    return (
        <div className={styles.container}>
            <Title level={2} className={styles.title}>Các dự án đã lưu</Title>

            {projects.length === 0 ? (
                <Empty description="Bạn chưa lưu dự án nào" />
            ) : (
                <div className={styles.grid}>
                    {projects.map((project) => (
                        <Card
                            key={project._id}
                            cover={
                                <div className={styles.cardCover}>
                                    <img
                                        alt={project.name}
                                        src={getProjectImage(project.images)}
                                        className={styles.cardImage}
                                    />
                                    <HeartFilled
                                        className={styles.heartIcon}
                                        onClick={() => setUnsaveProjectId(project._id)}
                                    />
                                </div>
                            }
                        >
                            <Meta
                                title={project.name}
                                description={
                                    <Space direction="vertical" size="small">
                                        <Paragraph ellipsis={{ rows: 2 }}>
                                            {truncateText(project.description)}
                                        </Paragraph>

                                        <Space>
                                            <Avatar
                                                src={project.user_id.avatar}
                                                icon={<UserOutlined />}
                                            />
                                            <Space direction="vertical" size="small">
                                                <Text strong>{project.user_id.name}</Text>
                                                <Tag color="blue">{project.project_type}</Tag>
                                            </Space>
                                        </Space>

                                        <Space>
                                            <ClockCircleOutlined />
                                            <Text type="secondary">
                                                {format(new Date(project.createdAt), 'dd/MM/yyyy')}
                                            </Text>
                                        </Space>
                                    </Space>
                                }
                            />
                        </Card>
                    ))}
                </div>
            )}

            <Modal

                open={!!unsaveProjectId}
                onOk={handleUnsaveConfirm}
                onCancel={() => setUnsaveProjectId(null)}
                okText="Đồng ý"
                cancelText="Hủy"
                okButtonProps={{ danger: true }}
            >
                <img
                    src={'https://i.pinimg.com/originals/36/19/fb/3619fb76f3f45f0a041e561fe80a5010.gif'}
                    className={styles.imagePopup}
                />
                <h2>Bỏ lưu dự án</h2>
                <p>Bạn có chắc chắn muốn bỏ lưu dự án này không?</p>
            </Modal>
        </div>
    );
};

export default SavedProjects;
