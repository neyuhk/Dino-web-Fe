import React, { useState, useEffect } from 'react';
import { Card, Modal, Typography, Space, Empty, Input, Button } from 'antd';
import { BookOutlined, ClockCircleOutlined, SaveOutlined, SearchOutlined } from '@ant-design/icons'
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import styles from './SavedProjects.module.css';
import { Project } from '../../../model/model.ts';
import Toast from '../../commons/Toast/Toast.tsx'
import { Bookmark, GraduationCap } from 'lucide-react'
import { searchProject, setFavoriteProject } from '../../../services/project.ts'
import { useSelector } from 'react-redux'

const { Title, Text, Paragraph } = Typography;
const { Meta } = Card;
const { Search } = Input;

// Import these APIs in your actual code
// import { searchProject, setFavoriteProject } from '../../../api/projectApi';

interface ToastMessage {
    show: boolean;
    type: 'success' | 'error' | 'info';
    title: string;
    message: string;
    image?: string;
}

interface SavedProjectsProps {
    projects: Project[];
    onSaveToggle: (projectId: string) => void;
}

const SavedProjects: React.FC<SavedProjectsProps> = ({ projects: initialProjects, onSaveToggle }) => {
    const { user } = useSelector((state: any) => state.auth);
    const [projects, setProjects] = useState<Project[]>(initialProjects);
    const [unsaveProjectId, setUnsaveProjectId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [toast, setToast] = useState<ToastMessage>({
        show: false,
        type: 'info',
        title: '',
        message: '',
    });
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        setProjects(initialProjects);
        setLoading(false);
    }, [initialProjects]);

    const showToast = (
        type: 'success' | 'error' | 'info',
        title: string,
        message: string
    ) => {
        setToast({
            show: true,
            type,
            title,
            message,
        });
    };

    const hideToast = () => {
        setToast((prev) => ({ ...prev, show: false }));
    };

    const handleSearch = async (value: string) => {
        setLoading(true);
        try {
            // In the actual implementation, you would use the imported searchProject
            const response = await searchProject(1, 1000, value, 'false', user._id);
            setProjects(response.data);

            // For now, we'll just filter the current projects
            if (value.trim() === '') {
                setProjects(initialProjects);
            } else {
                const filtered = initialProjects.filter(project =>
                    project.name.toLowerCase().includes(value.toLowerCase())
                );
                setProjects(filtered);
            }
        } catch (error) {
            showToast('error', 'Lỗi tìm kiếm', 'Không thể tìm kiếm dự án');
            console.error('Search error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUnsaveConfirm = async () => {
        if (unsaveProjectId) {
            setLoading(true);
            try {
                // In the actual implementation, you would use the imported setFavoriteProject
                await setFavoriteProject(unsaveProjectId, user._id);

                // Remove the project from the displayed list
                setProjects(prevProjects =>
                    prevProjects.filter(project => project._id !== unsaveProjectId)
                );

                // Call the original onSaveToggle callback
                onSaveToggle(unsaveProjectId);
                showToast('success', 'Thành công', 'Đã bỏ lưu dự án');
                setLoading(false);
            } catch (error) {
                showToast('error', 'Lỗi', 'Không thể bỏ lưu dự án');
                console.error('Unsave error:', error);
            } finally {

                setUnsaveProjectId(null);
            }
        }
    };

    const handleProjectClick = (projectId: string) => {
        navigate(`/projects/project-detail/${projectId}`);
    };

    const truncateText = (text: string, maxLength: number = 100) =>
        text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;

    const getProjectImage = (images: string[]) =>
        images.length > 0 ? images[0] : '/placeholder-image.png';

    if (loading)
        return (
            <div className={"loadingContainer"} style={{ justifyContent: "flex-start" }}>
                <div className={"loadingSpinner"}>
                    <GraduationCap size={32} className={"loadingIcon"} />
                </div>
                <p>Đang tải dự án đã lưu...</p>
            </div>
        );

    return (
        <div className={styles.container}>
            <Title level={2} className={styles.title}>Các dự án đã lưu</Title>

            <div className={styles.searchContainer}>
                <Search
                    placeholder="Tìm kiếm dự án theo tên"
                    allowClear
                    enterButton={<SearchOutlined />}
                    size="large"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onSearch={handleSearch}
                    loading={loading}
                    className={styles.searchInput}
                />
            </div>

            {!loading && projects.length === 0? (
                <Empty description="Không tìm thấy dự án nào" />
            ) : (
                <div className={styles.grid}>
                    {projects.map((project) => (
                        <Card
                            key={project._id}
                            hoverable
                            cover={
                                <div className={styles.cardCover}>
                                    <img
                                        alt={project.name}
                                        src={getProjectImage(project.images)}
                                        className={styles.cardImage}
                                        onClick={() => handleProjectClick(project._id)}
                                    />
                                </div>
                            }
                            onClick={() => handleProjectClick(project._id)}
                        >
                            <Meta
                                title={project.name}
                                description={
                                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                                        <Paragraph ellipsis={{ rows: 2 }}>
                                            {truncateText(project.description)}
                                        </Paragraph>
                                        <div className={styles.actionButton}>
                                            <Space>
                                                <ClockCircleOutlined />
                                                <Text type="secondary">
                                                    {format(new Date(project.createdAt), 'dd/MM/yyyy')}
                                                </Text>
                                            </Space>
                                            <Button
                                                type="primary"
                                                icon={<Bookmark size={16} />} // hoặc size={20} tùy ý
                                                className={styles.saveButton}
                                                style={{ backgroundColor: '#52c41a', borderColor: '#52c41a', color: 'white' }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setUnsaveProjectId(project._id);
                                                }}
                                            />
                                        </div>

                                    </Space>
                                }
                            />
                        </Card>
                    ))}
                </div>
            )}

            <Modal
                open={!!unsaveProjectId}
                onCancel={() => setUnsaveProjectId(null)}
                className={styles.confirmModal}
                width={400}
                centered
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                        <Button onClick={() => setUnsaveProjectId(null)}>Hủy</Button>
                        <Button type="primary" danger onClick={handleUnsaveConfirm}>
                            Đồng ý
                        </Button>
                    </div>
                }
            >
                <div className={styles.modalContent}>
                    <img
                        src={'https://i.pinimg.com/originals/36/19/fb/3619fb76f3f45f0a041e561fe80a5010.gif'}
                        className={styles.modalImage}
                        alt="Bỏ lưu dự án"
                    />
                    <Title level={3} className={styles.modalTitle}>Bỏ lưu dự án</Title>
                    <Paragraph className={styles.modalText}>
                        Bạn có chắc chắn muốn bỏ lưu dự án này? Dự án sẽ không còn xuất hiện trong danh sách các dự án đã lưu của bạn.
                    </Paragraph>
                </div>
            </Modal>

            {toast.show && <Toast toast={toast} onClose={hideToast} type={''} />}
        </div>
    );
};

export default SavedProjects;
