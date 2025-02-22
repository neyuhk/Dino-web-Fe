import React, { useEffect, useState } from 'react'
import { Space, Table, Input, Button, Modal, Form, message, Tooltip } from 'antd'
import type { TableProps } from 'antd'
import { getClassroomList, addClassroom, deleteClassroom, editClassroom } from '../../../services/classroom.ts'
// import { Classroom } from '../../../model/model.ts'
import moment from 'moment'
import { Link } from 'react-router-dom'
import { AlignLeftOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { Classroom } from '../../../model/classroom.ts'

const { Search } = Input

const ListClassroomManagement: React.FC = () => {
    const [data, setData] = useState<Classroom[]>([])
    const [isLoading, setLoading] = useState(true)
    const [filteredData, setFilteredData] = useState<Classroom[]>([])
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false)
    const [form] = Form.useForm()
    const [editingClassroom, setEditingClassroom] = useState<Classroom | null>(null)
    const [classroomToDelete, setClassroomToDelete] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            const classrooms = await getClassroomList()
            setLoading(false)
            setData(classrooms.data)
            setFilteredData(classrooms.data)
        }

        fetchData()
    }, [])

    const handleSearch = (value: string) => {
        const filtered = data.filter(classroom =>
            classroom.name.toLowerCase().includes(value.toLowerCase()) ||
            classroom.description.toLowerCase().includes(value.toLowerCase()),
        )
        setFilteredData(filtered)
    }

    const showModal = () => {
        setIsModalVisible(true)
    }

    const handleCancel = () => {
        setIsModalVisible(false)
        setEditingClassroom(null)
        form.resetFields()
    }

    const showDeleteModal = (id: string) => {
        setClassroomToDelete(id)
        setIsDeleteModalVisible(true)
    }

    const handleDeleteCancel = () => {
        setIsDeleteModalVisible(false)
        setClassroomToDelete(null)
    }

    const handleDeleteClassroom = async () => {
        if (!classroomToDelete) return
        try {
            await deleteClassroom(classroomToDelete)
            message.success('Classroom deleted successfully')
            const classrooms = await getClassroomList()
            setData(classrooms.data)
            setFilteredData(classrooms.data)
            setIsDeleteModalVisible(false)
            setClassroomToDelete(null)
        } catch (error) {
            message.error('Failed to delete classroom')
            console.error('Failed to delete classroom:', error)
        }
    }

    const handleAddOrUpdateClassroom = async (values: any) => {
        try {
            if (editingClassroom) {
                await editClassroom(editingClassroom._id, values)
            } else {
                await addClassroom(values)
            }
            const classrooms = await getClassroomList()
            setData(classrooms.data)
            setFilteredData(classrooms.data)
            setIsModalVisible(false)
            form.resetFields()
        } catch (error) {
            console.error('Failed to add classroom:', error)
        }
    }

    const handleEditClassroom = (classroom: Classroom) => {
        setEditingClassroom(classroom)
        form.setFieldsValue({
            name: classroom.name,
            description: classroom.description,
        })
        setIsModalVisible(true)
    }

    const columns: TableProps<Classroom>['columns'] = [
        {
            title: 'STT',
            key: 'index',
            render: (_text, _record, index) => index + 1,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text) => text ? <a>{text}</a> : 'Unknown',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            render: (text) => text ? text : 'Unknown',
        },
        {
            title: 'Teacher',
            key: 'teacher',
            render: (record) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img src={record.teacher_id.avatar[0]} alt={record.teacher_id.username}
                         style={{ width: '50px', borderRadius: '50%', marginRight: '10px' }} />
                    <span>{record.teacher_id.username}</span>
                </div>
            ),
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (text) => moment(text).format('DD/MM/YYYY'),
        },
        {
            title: 'Action',
            key: 'action',
            render: (record) => (
                <Space size="middle">
                    <Tooltip title="View">
                        <Link style={{ color: 'black' }}
                              to={`/admin/classroom/detail/${record._id}`}><AlignLeftOutlined /></Link>
                    </Tooltip>
                    <Tooltip title="Edit">
                        <EditOutlined onClick={() => handleEditClassroom(record)} />
                    </Tooltip>
                    <Tooltip title="Delete">
                        <DeleteOutlined onClick={() => showDeleteModal(record._id)} />
                    </Tooltip>
                </Space>
            ),
        },
    ]

    return (
        <div>
            <Space style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between' }}>
                <Search
                    placeholder="Search classrooms"
                    onSearch={handleSearch}
                    enterButton
                />
                <Button type="primary" onClick={showModal}>
                    Add Classroom
                </Button>
            </Space>
            <div style={{ overflow: 'auto' }}>
                <Table
                    columns={columns}
                    dataSource={filteredData}
                    loading={isLoading}
                    rowKey="_id"
                    onRow={(record) => ({
                        onClick: () => {
                            window.location.href = `/admin/classroom/detail/${record._id}`
                        },
                    })}
                />
            </div>
            <Modal
                title={editingClassroom ? 'Edit Classroom' : 'Add New Classroom'}
                open={isModalVisible}
                onCancel={handleCancel}
                onOk={() => form.submit()}
                okText={editingClassroom ? 'Update' : 'Add Classroom'}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleAddOrUpdateClassroom}
                >
                    <Form.Item
                        name="name"
                        label="Name"
                        rules={[{ required: true, message: 'Please input the name!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="Description"
                        rules={[{ required: true, message: 'Please input the description!' }]}
                    >
                        <Input.TextArea />
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                title="Confirm Delete"
                open={isDeleteModalVisible}
                onOk={handleDeleteClassroom}
                onCancel={handleDeleteCancel}
                okText="Delete"
                cancelText="Cancel"
            >
                <p>Are you sure you want to delete this classroom?</p>
            </Modal>
        </div>
    )
}

export default ListClassroomManagement
