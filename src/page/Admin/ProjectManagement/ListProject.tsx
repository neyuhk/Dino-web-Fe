import React, { useEffect, useState } from 'react';
import {
    Space,
    Table,
    Modal,
    Button,
    Form,
    Input,
    message,
    Tooltip,
    Drawer,
    Typography,
    Avatar,
    Row,
    Col,
    Statistic,
    Card,
    Tag,
    Select,
    Badge,
    Image
} from 'antd';
import type { TableProps } from 'antd';
import { getProjects, changeProjectType, deleteProjectById, getProjectById, isLikedProject, likeProject } from '../../../services/project.ts';
import { Project } from '../../../model/model.ts';
import { useSelector } from 'react-redux';
import Search from 'antd/es/input/Search';
import { PROJECT_TYPE } from '../../../enum/projectType.ts';
import './ListProject.css';
import {
    FileTextOutlined,
    DeleteOutlined,
    EditOutlined,
    EyeOutlined,
    HeartOutlined,
    HeartFilled,
    UserOutlined,
    BlockOutlined,
    MessageOutlined,
    StarOutlined,
    CloseOutlined,
    FilterOutlined,
    BarsOutlined, ClearOutlined, ReloadOutlined,
} from '@ant-design/icons'
import moment from 'moment';
import ProjectDetailComponent from './ProjectDetail.tsx'
import RequireAuth from '../../../components/commons/RequireAuth/RequireAuth.tsx'

const { Option } = Select;
const { Title, Text } = Typography;

const ListProjectManagement: React.FC = () => {
    const { user } = useSelector((state: any) => state.auth);
    const [data, setData] = useState<Project[]>([]);
    const [isLoading, setLoading] = useState(true);
    const [filteredData, setFilteredData] = useState<Project[]>([]);
    const [selectedType, setSelectedType] = useState<string | undefined>(undefined);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
    const [form] = Form.useForm();
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
    const [searchName, setSearchName] = useState<string>('');

    // Drawer state
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [detailProject, setDetailProject] = useState<Project | null>(null);
    const [isLiked, setIsLiked] = useState(false);
    const [filterVisible, setFilterVisible] = useState(false);
    const [sortBy, setSortBy] = useState<string>('newest');

    const fetchData = async (page: number, perPage: number, name: string, type?: string) => {
        setLoading(true);
        try {
            const projects = await getProjects(page, perPage, name, type || '');
            setData(projects.data);
            setFilteredData(projects.data);
            setPagination({ current: page, pageSize: perPage, total: projects.total });
        } catch (error) {
            console.error('Failed to fetch projects:', error);
            message.error('Không thể tải danh sách dự án');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(pagination.current, pagination.pageSize, searchName, selectedType);
    }, []);

    const handleSearch = (value: string) => {
        setSearchName(value);
        fetchData(1, pagination.pageSize, value, selectedType);
    };

    const clearFilters = () => {
        setSearchName('');
        setSelectedType(undefined);
        setSortBy('newest');
        fetchData(1, pagination.pageSize, '', undefined);
    };
    const handleSortChange = (value: string) => {
        setSortBy(value);

        // Sắp xếp dữ liệu
        let sortedData = [...filteredData];
        switch(value) {
            case 'name_asc':
                sortedData.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
                break;
            case 'name_desc':
                sortedData.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
                break;
            case 'views_desc':
                sortedData.sort((a, b) => (b.view_count || 0) - (a.view_count || 0));
                break;
            case 'likes_desc':
                sortedData.sort((a, b) => (b.like_count || 0) - (a.like_count || 0));
                break;
            case 'newest':
                sortedData.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
                break;
            case 'oldest':
                sortedData.sort((a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime());
                break;
            default:
                break;
        }

        setFilteredData(sortedData);
    };

    const handleTypeChange = (value: string) => {
        setSelectedType(value);
        fetchData(1, pagination.pageSize, searchName, value);
    };

    const handleTableChange = (pagination: any) => {
        fetchData(pagination.current, pagination.pageSize, searchName, selectedType);
    };

    const showModal = (project: Project, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedProject(project);
        setIsModalVisible(true);
        form.setFieldsValue({ type: project.project_type });
    };

    const changeType = async () => {
        try {
            const values = await form.validateFields();
            await changeProjectType(selectedProject?._id ?? '', values.type);
            setIsModalVisible(false);
            message.success('Thay đổi loại dự án thành công!');
            fetchData(pagination.current, pagination.pageSize, searchName, selectedType);
        } catch (error) {
            console.error('Failed to update project type:', error);
            message.error('Không thể cập nhật loại dự án');
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const showDeleteModal = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setProjectToDelete(id);
        setIsDeleteModalVisible(true);
    };

    const handleDeleteCancel = () => {
        setIsDeleteModalVisible(false);
        setProjectToDelete(null);
    };

    const handleDeleteProject = async () => {
        if (!projectToDelete) return;
        try {
            await deleteProjectById(projectToDelete);
            message.success('Đã xóa dự án thành công');
            fetchData(pagination.current, pagination.pageSize, searchName, selectedType);
            setIsDeleteModalVisible(false);
            setProjectToDelete(null);

            // If the deleted project is currently being viewed in the drawer
            if (detailProject && detailProject._id === projectToDelete) {
                setDrawerVisible(false);
            }
        } catch (error) {
            message.error('Không thể xóa dự án');
            console.error('Failed to delete project:', error);
        }
    };

    // Drawer handling functions
    const showDrawer = async (project: Project) => {
        setLoading(true);
        try {
            const response = await getProjectById(project._id);
            setDetailProject(response.data);
            setDrawerVisible(true);
        } catch (error) {
            console.error('Failed to fetch project details:', error);
            message.error('Không thể tải chi tiết dự án');
        } finally {
            setLoading(false);
        }
    };

    const closeDrawer = () => {
        setDrawerVisible(false);
    };

    const handleLikeProject = async () => {
        if (!detailProject || !user?._id) return;

        try {
            setIsLiked(!isLiked);

            // Optimistic update
            setDetailProject((prevData) => {
                if (!prevData) return null;
                return {
                    ...prevData,
                    like_count: isLiked ? Math.max(0, prevData.like_count - 1) : prevData.like_count + 1
                };
            });

            await likeProject(detailProject._id, user._id);

            // Update the project in the main list as well
            setFilteredData(prevData =>
                prevData.map(p =>
                    p._id === detailProject._id
                        ? {
                            ...p,
                            like_count: isLiked
                                ? Math.max(0, p.like_count - 1)
                                : p.like_count + 1
                        }
                        : p
                )
            );
        } catch (error) {
            console.error('Failed to like project:', error);
            message.error('Không thể cập nhật trạng thái yêu thích');
            // Revert the optimistic update
            setIsLiked(!isLiked);
        }
    };

    const getProjectTypeTag = (type: string) => {
        let color = 'default';
        switch(type) {
            case PROJECT_TYPE.DEFAULT:
                color = 'green';
                break;
            case PROJECT_TYPE.RECOMMEND:
                color = 'blue';
                break;
            case PROJECT_TYPE.PUBLIC:
                color = 'purple';
                break;
            case PROJECT_TYPE.EXAMPLE:
                color = 'orange';
                break;
            default:
                color = 'default';
        }

        return <Tag color={color}>{type}</Tag>;
    };

    if(!user){
        return (
            <RequireAuth></RequireAuth>
        );
    }

    // Function to navigate to another project while drawer is open
    const navigateToProject = async (project: Project) => {
        setLoading(true);
        try {
            const response = await getProjectById(project._id);
            setDetailProject(response.data);

            if (user && user._id) {
                const liked = await isLikedProject(project._id, user._id);
                setIsLiked(liked.data);
            }
        } catch (error) {
            console.error('Failed to fetch project details:', error);
            message.error('Không thể tải chi tiết dự án');
        } finally {
            setLoading(false);
        }
    };

    const columns: TableProps<Project>['columns'] = [
        {
            title: 'Dự án',
            key: 'project',
            render: (record) => (
                <div className="project-card" onClick={() => showDrawer(record)}>
                    <div className="project-image">
                        {record.images && record.images[0] ? (
                            <img
                                src={record.images[0]}
                                alt={record.name}
                                className="project-thumbnail"
                            />
                        ) : (
                            <img
                                src={'/MockData/flapybird.jpg'}
                                alt={record.name}
                                className="project-thumbnail"
                            />
                        )}
                    </div>
                    <div className="project-info">
                        <Text strong className="project-title">{record.name || 'Không tên'}</Text>
                        <Text className="project-description" ellipsis>
                            {record.description?.substring(0, 50) || 'Không có mô tả'}
                            {record.description && record.description.length > 50 ? '...' : ''}
                        </Text>
                    </div>
                </div>
            ),
        },
        {
            title: 'Loại',
            dataIndex: 'project_type',
            key: 'project_type',
            width: '10%',
            render: (text) => getProjectTypeTag(text || 'Không xác định'),
        },
        {
            title: 'Người tạo',
            key: 'user_id',
            width: '15%',
            render: (record) => (
                <div className="user-info">
                    <Avatar icon={<UserOutlined />} size="small" />
                    <span>{record.user_id ? record.user_id.username : 'Không xác định'}</span>
                </div>
            ),
        },
        {
            title: 'Thống kê',
            key: 'stats',
            width: '15%',
            render: (record) => (
                <div className="stats-container">
                    <Tooltip title="Lượt thích">
                        <Badge count={record.like_count || 0} showZero className="stat-badge likes">
                            <HeartOutlined className="stat-icon" />
                        </Badge>
                    </Tooltip>
                    <Tooltip title="Lượt xem">
                        <Badge count={record.view_count || 0} showZero className="stat-badge views">
                            <EyeOutlined className="stat-icon" />
                        </Badge>
                    </Tooltip>
                </div>
            ),
        },
        {
            title: 'Thao tác',
            key: 'action',
            width: '15%',
            render: (record) => (
                <div className="action-buttons">
                    <Tooltip title="Sửa loại dự án">
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            className="action-button edit"
                            onClick={(e) => showModal(record, e)}
                        />
                    </Tooltip>
                    <Tooltip title="Xóa dự án">
                        <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            className="action-button delete"
                            onClick={(e) => showDeleteModal(record._id, e)}
                        />
                    </Tooltip>
                </div>
            ),
        },
    ];

    return (
        <div className="project-dashboard">
            <div className="dashboard-header">
                <Title level={3} className="page-title">Quản lý dự án</Title>
                <div className="filter-controls">
                    <Button
                        type="default"
                        icon={<FilterOutlined />}
                        onClick={() => setFilterVisible(!filterVisible)}
                        className="filter-toggle-button"
                    >
                        {filterVisible ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}
                    </Button>
                    <Tooltip title="Làm mới dữ liệu">
                        <Button
                            type="primary"
                            icon={<ReloadOutlined />}
                            onClick={() => fetchData(1, pagination.pageSize, searchName, selectedType)}
                            className="clear-filter-button"
                        >
                        </Button>
                    </Tooltip>
                </div>
            </div>

            <Card className={`filter-panel ${filterVisible ? 'filter-visible' : ''}`}>
                <div className="filter-header">
                    <div className="filter-title">
                        <FilterOutlined /> Bộ lọc dự án
                    </div>
                    <div className="filter-actions">
                        <Button
                            icon={<ClearOutlined />}
                            onClick={clearFilters}
                            className="clear-filter-button"
                        >
                            Xóa bộ lọc
                        </Button>
                    </div>
                </div>

                <div className="filter-group">
                    <div className="filter-item">
                        <label className="filter-label">Tìm kiếm</label>
                        <Search
                            placeholder="Tìm kiếm theo tên dự án"
                            value={searchName}
                            onChange={(e) => setSearchName(e.target.value)}
                            onSearch={handleSearch}
                            enterButton
                            allowClear
                            className="search-input"
                        />
                    </div>
                    <div className="filter-item">
                        <label className="filter-label">Loại dự án</label>
                        <Select
                            placeholder="Chọn loại dự án"
                            value={selectedType}
                            onChange={handleTypeChange}
                            allowClear
                            className="type-select"
                        >
                            {Object.values(PROJECT_TYPE).map((type) => (
                                <Option key={type} value={type}>
                                    {type}
                                </Option>
                            ))}
                        </Select>
                    </div>
                    <div className="filter-item">
                        <label className="filter-label">Sắp xếp theo</label>
                        <Select
                            placeholder="Sắp xếp theo"
                            value={sortBy}
                            onChange={handleSortChange}
                            className="sort-select"
                        >
                            <Option value="newest">Mới nhất</Option>
                            <Option value="oldest">Cũ nhất</Option>
                            <Option value="name_asc">Tên (A-Z)</Option>
                            <Option value="name_desc">Tên (Z-A)</Option>
                            <Option value="views_desc">Lượt xem (Cao-Thấp)</Option>
                            <Option value="likes_desc">Lượt thích (Cao-Thấp)</Option>
                        </Select>
                    </div>
                </div>
            </Card>
            <Card className="projects-card">
                <div className="table-header">
                    <Text strong>
                        <BarsOutlined /> Danh sách dự án ({pagination.total})
                    </Text>
                </div>
                <Table<Project>
                    columns={columns}
                    dataSource={filteredData}
                    loading={isLoading}
                    className="projects-table"
                    rowKey="_id"
                    pagination={{
                        current: pagination.current,
                        pageSize: pagination.pageSize,
                        total: pagination.total,
                        onChange: (page, pageSize) => handleTableChange({ current: page, pageSize }),
                        showSizeChanger: true,
                        pageSizeOptions: ['10', '20', '50'],
                        showTotal: (total) => `Tổng cộng ${total} dự án`,
                    }}
                    onRow={(record) => ({
                        onClick: () => {
                            showDrawer(record);
                        },
                        className: 'project-row'
                    })}
                />
            </Card>

            {/* Type Change Modal */}
            <Modal
                title="Thay đổi loại dự án"
                open={isModalVisible}
                onOk={changeType}
                onCancel={handleCancel}
                okText="Cập nhật"
                cancelText="Hủy"
                className="type-modal"
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="type"
                        label="Loại dự án"
                        rules={[{ required: true, message: 'Vui lòng chọn loại dự án' }]}
                    >
                        <Select>
                            {Object.values(PROJECT_TYPE).map((type) => (
                                <Option key={type} value={type}>
                                    {type}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                title="Xác nhận xóa"
                open={isDeleteModalVisible}
                onOk={handleDeleteProject}
                onCancel={handleDeleteCancel}
                okText="Xóa"
                cancelText="Hủy"
                okButtonProps={{ danger: true }}
                className="delete-modal"
            >
                <div className="delete-confirmation">
                    <div className="delete-icon">
                        <DeleteOutlined />
                    </div>
                    <div className="delete-message">
                        <p>Bạn có chắc chắn muốn xóa dự án này không?</p>
                        <p>Hành động này không thể khôi phục lại.</p>
                    </div>
                </div>
            </Modal>

            {/* Project Detail Drawer */}
            <Drawer
                title={
                    <div className="drawer-header">
                        <div className="drawer-title">Chi tiết dự án</div>
                        <Button
                            type="text"
                            icon={<CloseOutlined />}
                            onClick={closeDrawer}
                            className="drawer-close"
                        />
                    </div>
                }
                mask={false}
                placement="right"
                closable={false}
                onClose={closeDrawer}
                open={drawerVisible}
                width={700}
                className="project-detail-drawer"
                destroyOnClose={false}
                maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.45)' }}
            >
                {detailProject ? (
                    <ProjectDetailComponent
                        project={detailProject}
                        isLiked={isLiked}
                        onLike={handleLikeProject}
                        relatedProjects={filteredData.filter(p => p._id !== detailProject._id).slice(0, 4)}
                        onNavigateToProject={navigateToProject}
                    />
                ) : (
                    <div className="loading-container">
                        <div className="loading-message">Đang tải thông tin dự án...</div>
                    </div>
                )}
            </Drawer>
        </div>
    );
};

export default ListProjectManagement;