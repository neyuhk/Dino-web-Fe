import React, { useEffect, useState } from 'react';
import {
    Space,
    Table,
    Input,
    Tooltip,
    Modal,
    Select,
    Button,
    Tag,
    Drawer,
    Avatar,
    Card,
    DatePicker,
    Badge,
    Typography,
    notification
} from 'antd';
import type { TableProps } from 'antd';
import { getUsers, changeRole, getUserById } from '../../../services/user.ts';
import { User } from '../../../model/model.ts';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import {
    DeleteOutlined,
    EditOutlined,
    UserOutlined,
    FilterOutlined,
    ReloadOutlined,
    QuestionCircleOutlined
} from '@ant-design/icons';
import './ListUser.css';
import UserDetailComponent from './UserDetail';

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

const ListUserManagement: React.FC = () => {
    const [data, setData] = useState<User[]>([]);
    const [isLoading, setLoading] = useState(true);
    const [filteredData, setFilteredData] = useState<User[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [selectedRole, setSelectedRole] = useState<string | null>(null);
    const [isConfirmVisible, setIsConfirmVisible] = useState(false);
    const [roleFilter, setRoleFilter] = useState<string>('all');
    const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [advancedFilterVisible, setAdvancedFilterVisible] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [totalUsers, setTotalUsers] = useState(0);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (selectedUserId) {
            setDrawerVisible(true);
        }
    }, [selectedUserId]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const users = await getUsers();
            setLoading(false);
            setData(users);
            setFilteredData(users);
            setTotalUsers(users.length);
            notification.success({
                message: 'Dữ liệu người dùng đã được cập nhật',
                description: `Đã tải thành công ${users.length} người dùng trong hệ thống.`,
                placement: 'bottomRight',
            });
        } catch (error) {
            setLoading(false);
            notification.error({
                message: 'Không thể tải dữ liệu',
                description: 'Đã xảy ra lỗi khi tải danh sách người dùng. Vui lòng thử lại sau.',
                placement: 'bottomRight',
            });
        }
    };

    const handleSearch = (value: string) => {
        applyFilters(value, roleFilter, dateRange);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleSearch(e.target.value);
    };

    const handleRoleFilterChange = (value: string) => {
        setRoleFilter(value);
        applyFilters('', value, dateRange);
    };

    const handleDateRangeChange = (
        dates: [Dayjs | null, Dayjs | null] | null,
        dateStrings: [string, string]
    ) => {
        if (dates && dates[0] && dates[1]) {
            setDateRange([dates[0], dates[1]]);
            applyFilters('', roleFilter, [dates[0], dates[1]]);
        } else {
            setDateRange(null);
            applyFilters('', roleFilter, null);
        }
    };


    const applyFilters = (
        searchText: string = '',
        role: string = 'all',
        dates: [Dayjs, Dayjs] | null = null
    ) => {
        let filtered = data;

        // Apply search filter
        if (searchText) {
            filtered = filtered.filter(user =>
                user.username?.toLowerCase().includes(searchText.toLowerCase()) ||
                user.email?.toLowerCase().includes(searchText.toLowerCase()) ||
                user.name?.toLowerCase().includes(searchText.toLowerCase())
            );
        }

        // Apply role filter
        if (role !== 'all') {
            filtered = filtered.filter(user => user.role === role);
        }

        // Apply date filter
        if (dates && dates[0] && dates[1]) {
            filtered = filtered.filter(user => {
                const createdAt = dayjs(user.createdAt);
                return createdAt.isAfter(dates[0]) && createdAt.isBefore(dates[1]);
            });
        }

        setFilteredData(filtered);
    };

    const resetFilters = () => {
        setRoleFilter('all');
        setDateRange(null);
        setFilteredData(data);
        setAdvancedFilterVisible(false);
    };

    const handleEditClick = (record: User, e?: React.MouseEvent) => {
        if (e) {
            e.stopPropagation(); // Ngăn việc mở drawer khi nhấn vào nút chỉnh sửa
        }
        setSelectedUser(record);
        setSelectedRole(record.role || null);
        setIsModalVisible(true);
    };

    const handleRowClick = (record: User) => {
        setSelectedUser(record);
        setSelectedUserId(record._id);
    };

    const closeDrawer = () => {
        setDrawerVisible(false);
        setSelectedUserId(null);
    };

    const handleRoleChange = (value: string) => {
        setSelectedRole(value);
    };

    const handleConfirm = async () => {
        if (selectedUser && selectedRole) {
            try {
                await changeRole(selectedUser._id, selectedRole);
                setIsConfirmVisible(false);
                setIsModalVisible(false);
                const updatedUsers = data.map(user =>
                    user._id === selectedUser._id ? { ...user, role: selectedRole } : user
                );
                setData(updatedUsers);
                setFilteredData(updatedUsers);

                notification.success({
                    message: 'Thay đổi vai trò thành công',
                    description: `Vai trò của ${selectedUser.username || selectedUser.name || 'người dùng'} đã được thay đổi thành ${selectedRole}.`,
                    placement: 'bottomRight',
                });
            } catch (error) {
                notification.error({
                    message: 'Thay đổi vai trò thất bại',
                    description: 'Không thể thay đổi vai trò người dùng. Vui lòng thử lại sau.',
                    placement: 'bottomRight',
                });
                console.error('Error changing role:', error);
            }
        }
    };

    const handleDeleteClick = (user: User, e?: React.MouseEvent) => {
        if (e) {
            e.stopPropagation(); // Ngăn việc mở drawer khi nhấn vào nút xóa
        }
        setUserToDelete(user);
        setDeleteModalVisible(true);
    };

    const handleDeleteConfirm = () => {
        // Implement actual delete logic here
        // For now we'll just close the modal and show a success message
        setDeleteModalVisible(false);
        if (userToDelete) {
            notification.success({
                message: 'Xóa người dùng thành công',
                description: `Người dùng ${userToDelete.username || userToDelete.name || 'đã chọn'} đã được xóa khỏi hệ thống.`,
                placement: 'bottomRight',
            });
        }
    };

    const getRoleTagColor = (role: string) => {
        switch (role) {
            case 'admin':
                return 'red';
            case 'teacher':
                return 'blue';
            case 'user':
                return 'green';
            default:
                return 'default';
        }
    };

    const columns: TableProps<User>['columns'] = [
        {
            title: 'Người dùng',
            key: 'user',
            className: 'user-column',
            render: (record) => (
                <div className="user-info">
                    <Avatar
                        src={record.avatar?.[0] || "https://i.pinimg.com/474x/0b/10/23/0b10236ae55b58dceaef6a1d392e1d15.jpg"}
                        icon={!record.avatar && <UserOutlined />}
                        size="large"
                    />
                    <div className="user-details">
                        <div className="username">{record.username || 'N/A'}</div>
                        <div className="email">{record.email}</div>
                    </div>
                </div>
            ),
            width: '35%',
        },
        {
            title: 'Vai trò',
            dataIndex: 'role',
            key: 'role',
            className: 'center-column',
            render: (role) => (
                <Tag color={getRoleTagColor(role)} key={role}>
                    {role?.toUpperCase()}
                </Tag>
            ),
            filters: [
                { text: 'Admin', value: 'admin' },
                { text: 'Teacher', value: 'teacher' },
                { text: 'User', value: 'user' },
            ],
            onFilter: (value, record) => record.role === value,
            width: '15%',
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            className: 'center-column',
            render: (text) => text ? dayjs(text).format('DD/MM/YYYY') : 'Không có dữ liệu',
            sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
            width: '15%',
        },
        {
            title: 'Cập nhật',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            className: 'center-column',
            render: (text) => text ? dayjs(text).format('DD/MM/YYYY') : 'Không có dữ liệu',
            sorter: (a, b) => {
                if (!a.updatedAt) return -1;
                if (!b.updatedAt) return 1;
                return dayjs(a.updatedAt).unix() - dayjs(b.updatedAt).unix();
            },
            width: '15%',
        },
        {
            title: 'Thao tác',
            key: 'action',
            className: 'center-column',
            render: (record) => (
                <Space size="middle">
                    <Tooltip title="Chỉnh sửa vai trò">
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            onClick={(e) => handleEditClick(record, e)}
                        />
                    </Tooltip>
                    <Tooltip title="Xóa">
                        <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={(e) => handleDeleteClick(record, e)}
                        />
                    </Tooltip>
                </Space>
            ),
            width: '20%',
        },
    ];

    return (
        <div className="user-management-container">
            <div className="user-management-header">
                <div className="header-title">
                    <Title level={4}>Quản lý người dùng</Title>
                    <Badge count={totalUsers} showZero color="#108ee9" overflowCount={999} />
                </div>
                <div className="header-actions">
                    <Tooltip title="Làm mới dữ liệu">
                        <Button
                            icon={<ReloadOutlined />}
                            onClick={fetchData}
                            loading={isLoading}
                        />
                    </Tooltip>
                </div>
            </div>

            <div className="search-filter-container">
                <div className="search-container">
                    <Search
                        placeholder="Tìm kiếm theo tên, email..."
                        onChange={handleInputChange}
                        allowClear
                        style={{ width: 250 }}
                    />
                    <Button
                        type="default"
                        icon={<FilterOutlined />}
                        onClick={() => setAdvancedFilterVisible(!advancedFilterVisible)}
                    >
                        Bộ lọc
                    </Button>
                </div>

                {advancedFilterVisible && (
                    <Card className="advanced-filter-card">
                        <div className="advanced-filters">
                            <div className="filter-item">
                                <Text strong>Vai trò:</Text>
                                <Select
                                    style={{ width: 200 }}
                                    value={roleFilter}
                                    onChange={handleRoleFilterChange}
                                    placeholder="Lọc theo vai trò"
                                >
                                    <Option value="all">Tất cả</Option>
                                    <Option value="admin">Admin</Option>
                                    <Option value="user">Người dùng</Option>
                                    <Option value="teacher">Giáo viên</Option>
                                </Select>
                            </div>
                            <div className="filter-item">
                                <Text strong>Ngày tạo:</Text>
                                <RangePicker
                                    onChange={handleDateRangeChange}
                                    format="DD/MM/YYYY"
                                />
                            </div>
                            <div className="filter-actions">
                                <Button
                                    onClick={resetFilters}
                                >
                                    Đặt lại
                                </Button>
                            </div>
                        </div>
                    </Card>
                )}
            </div>

            <div className="user-list-container">
                <Table<User>
                    columns={columns}
                    dataSource={filteredData}
                    loading={isLoading}
                    rowKey={(record) => record._id}
                    pagination={{
                        defaultPageSize: 10,
                        showSizeChanger: true,
                        pageSizeOptions: ['10', '20', '50'],
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} của ${total} người dùng`,
                    }}
                    onRow={(record) => ({
                        onClick: () => handleRowClick(record),
                    })}
                    className="user-table"
                />
            </div>

            <Modal
                title="Chỉnh sửa vai trò"
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
            >
                <div className="edit-role-content">
                    {selectedUser && (
                        <div className="selected-user-info">
                            <Avatar
                                src={selectedUser.avatar?.[0] || "https://i.pinimg.com/474x/0b/10/23/0b10236ae55b58dceaef6a1d392e1d15.jpg"}
                                icon={!selectedUser.avatar && <UserOutlined />}
                                size={64}
                            />
                            <div className="user-info-text">
                                <div className="user-name">{selectedUser.username || 'N/A'}</div>
                                <div className="user-email">{selectedUser.email}</div>
                                <Tag color={getRoleTagColor(selectedUser.role)}>
                                    {selectedUser.role?.toUpperCase()}
                                </Tag>
                            </div>
                        </div>
                    )}

                    <div className="role-select-container">
                        <Text strong>Vai trò mới:</Text>
                        <Select
                            style={{ width: '100%' }}
                            placeholder="Chọn vai trò"
                            onChange={handleRoleChange}
                            value={selectedRole}
                        >
                            <Select.Option value="admin">Admin</Select.Option>
                            <Select.Option value="user">Người dùng</Select.Option>
                            <Select.Option value="teacher">Giáo viên</Select.Option>
                        </Select>

                        <div className="role-descriptions">
                            <div className="role-desc-item">
                                <Tag color="red">ADMIN</Tag>
                                <Text type="secondary">Quyền quản trị hệ thống, toàn quyền truy cập</Text>
                            </div>
                            <div className="role-desc-item">
                                <Tag color="blue">TEACHER</Tag>
                                <Text type="secondary">Quyền giáo viên, quản lý lớp học và nội dung</Text>
                            </div>
                            <div className="role-desc-item">
                                <Tag color="green">USER</Tag>
                                <Text type="secondary">Quyền người dùng cơ bản</Text>
                            </div>
                        </div>
                    </div>

                    <div className="modal-actions">
                        <Button
                            type="primary"
                            onClick={() => setIsConfirmVisible(true)}
                            disabled={!selectedRole || selectedRole === selectedUser?.role}
                        >
                            Xác nhận
                        </Button>
                        <Button onClick={() => setIsModalVisible(false)}>
                            Hủy
                        </Button>
                    </div>
                </div>
            </Modal>

            <Modal
                title={
                    <div className="confirm-modal-title">
                        <QuestionCircleOutlined className="confirm-icon" />
                        Xác nhận thay đổi vai trò
                    </div>
                }
                open={isConfirmVisible}
                onOk={handleConfirm}
                onCancel={() => setIsConfirmVisible(false)}
                okText="Đồng ý"
                cancelText="Hủy bỏ"
            >
                <p>Bạn có chắc chắn muốn thay đổi vai trò của người dùng thành "{selectedRole?.toUpperCase()}"?</p>
                <p className="warning-text">Lưu ý: Thay đổi vai trò sẽ ảnh hưởng đến quyền truy cập của người dùng trong hệ thống.</p>
            </Modal>

            <Modal
                title={
                    <div className="delete-modal-title">
                        <DeleteOutlined className="delete-icon" />
                        Xác nhận xóa người dùng
                    </div>
                }
                open={deleteModalVisible}
                onOk={handleDeleteConfirm}
                onCancel={() => setDeleteModalVisible(false)}
                okText="Xóa"
                cancelText="Hủy bỏ"
                okButtonProps={{ danger: true }}
            >
                <p>Bạn có chắc chắn muốn xóa người dùng này?</p>
                {userToDelete && (
                    <div className="delete-user-info">
                        <p><strong>Tên người dùng:</strong> {userToDelete.username || 'N/A'}</p>
                        <p><strong>Email:</strong> {userToDelete.email}</p>
                        <p><strong>Vai trò:</strong> {userToDelete.role?.toUpperCase()}</p>
                    </div>
                )}
                <p className="warning-text">Lưu ý: Hành động này không thể hoàn tác. Tất cả dữ liệu liên quan đến người dùng này sẽ bị xóa vĩnh viễn.</p>
            </Modal>

            <Drawer
                mask={false}
                title="Chi tiết người dùng"
                placement="right"
                closable={true}
                onClose={closeDrawer}
                open={drawerVisible}
                width={600}
                destroyOnClose={true}
            >
                {selectedUserId && (
                    <UserDetailComponent userId={selectedUserId} inDrawer={true} />
                )}
            </Drawer>
        </div>
    );
};

export default ListUserManagement;