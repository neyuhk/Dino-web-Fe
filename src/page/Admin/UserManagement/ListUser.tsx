import React, { useEffect, useState } from 'react';
import { Space, Table, Input, Tooltip, Modal, Select, Button } from 'antd';
import type { TableProps } from 'antd';
import { getUsers, changeRole } from '../../../services/user.ts';
import { User } from '../../../model/model.ts';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { AlignLeftOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import './ListUser.css';

const { Search } = Input;
const { Option } = Select;

const ListUserManagement: React.FC = () => {
    const [data, setData] = useState<User[]>([]);
    const [isLoading, setLoading] = useState(true);
    const [filteredData, setFilteredData] = useState<User[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [selectedRole, setSelectedRole] = useState<string | null>(null);
    const [isConfirmVisible, setIsConfirmVisible] = useState(false);
    const [roleFilter, setRoleFilter] = useState<string>('all');

    useEffect(() => {
        const fetchData = async () => {
            const users = await getUsers();
            setLoading(false);
            setData(users);
            setFilteredData(users);
        };

        fetchData();
    }, []);

    const handleSearch = (value: string) => {
        const filtered = data.filter(user =>
            user.username.toLowerCase().includes(value.toLowerCase()) ||
            user.email.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredData(filtered);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleSearch(e.target.value);
    };

    const handleRoleFilterChange = (value: string) => {
        setRoleFilter(value);
        if (value === 'all') {
            setFilteredData(data);
        } else {
            const filtered = data.filter(user => user.role === value);
            setFilteredData(filtered);
        }
    };

    const handleEditClick = (record: User) => {
        setSelectedUser(record);
        setSelectedRole(null);
        setIsModalVisible(true);
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
            } catch (error) {
                console.error('Error changing role:', error);
            }
        }
    };

    const columns: TableProps<User>['columns'] = [
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
            className: 'center-column',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            className: 'center-column',
        },
        {
            title: 'Avatar',
            dataIndex: 'avatar',
            key: 'avatar',
            className: 'center-column',
            render: (text) =>
                text ? (
                    <img
                        className={'avt-column'}
                        src={text}
                        alt="avatar"
                        style={{ width: '40px', height: '40px' }}
                    />
                ) : (
                    <img
                        src={'/MockData/avt-def.jpg'}
                        alt="avatar-default"
                        style={{ width: '40px', height: '40px' }}
                    />
                ),
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            className: 'center-column',
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            className: 'center-column',
            render: (text) => moment(text).format('DD/MM/YYYY'),
        },
        {
            title: 'Updated At',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            className: 'center-column',
            render: (text) => moment(text).format('DD/MM/YYYY'),
        },
        {
            title: 'Action',
            key: 'action',
            className: 'center-column',
            render: (record) => (
                <Space size="middle">
                    <Tooltip title="View">
                        <Link style={{ color: 'black' }} to={`/admin/user/detail/${record._id}`}>
                            <AlignLeftOutlined />
                        </Link>
                    </Tooltip>
                    <Tooltip title="Edit role">
                        <EditOutlined onClick={() => handleEditClick(record)} />
                    </Tooltip>
                    <Tooltip title="Delete">
                        <DeleteOutlined />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Space style={{ marginBottom: 16 }}>
                <Search placeholder="Search users" onChange={handleInputChange} />
                <Select
    style={{ width: 200 }}
    value={roleFilter === 'all' ? undefined : roleFilter}
    onChange={handleRoleFilterChange}
    placeholder="Filter by role"
>
    <Option value="all">All</Option>
    <Option value="admin">Admin</Option>
    <Option value="user">User</Option>
    <Option value="teacher">Teacher</Option>
</Select>
            </Space>
            <div style={{ overflow: 'auto' }}>
                <Table<User>
                    columns={columns}
                    dataSource={filteredData}
                    loading={isLoading}
                    rowKey={(record) => record._id}
                />
            </div>
            <Modal
                title="Edit Role"
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
            >
                <Select
                    style={{ width: '100%' }}
                    placeholder="Select a role"
                    onChange={handleRoleChange}
                >
                    <Select.Option value="admin">Admin</Select.Option>
                    <Select.Option value="user">User</Select.Option>
                    <Select.Option value="teacher">Teacher</Select.Option>
                </Select>
                <div style={{ marginTop: 16, textAlign: 'right' }}>
                    <Button
                        type="primary"
                        onClick={() => setIsConfirmVisible(true)}
                        disabled={!selectedRole}
                    >
                        Confirm
                    </Button>
                </div>
            </Modal>
            <Modal
                title="Confirm Role Change"
                visible={isConfirmVisible}
                onOk={handleConfirm}
                onCancel={() => setIsConfirmVisible(false)}
                okText="Yes"
                cancelText="No"
            >
                <p>Are you sure you want to change the role to "{selectedRole}"?</p>
            </Modal>
        </div>
    );
};

export default ListUserManagement;
