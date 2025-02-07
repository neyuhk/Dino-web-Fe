import React, { useEffect, useState } from 'react'
import { Space, Table, Input, Button, Modal, Form, Upload, DatePicker, message, Row, Tooltip } from 'antd'
import type { TableProps } from 'antd'
import { getCourses, addCourse, deleteCourse, editCourse } from '../../../services/course.ts'
import { Course } from '../../../model/model.ts'
import moment from 'moment'
import { Link } from 'react-router-dom'
import { AlignLeftOutlined, DeleteOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons'

const { Search } = Input

const ListCourseManagement: React.FC = () => {
    const [data, setData] = useState<Course[]>([])
    const [isLoading, setLoading] = useState(true)
    const [filteredData, setFilteredData] = useState<Course[]>([])
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false)
    const [form] = Form.useForm()
    const [selectedImage, setSelectedImage] = useState(null)
    const [editingCourse, setEditingCourse] = useState<Course | null>(null)
    const [courseToDelete, setCourseToDelete] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            const courses = await getCourses()
            setLoading(false)
            setData(courses.data)
            setFilteredData(courses.data)
        }

        fetchData()
    }, [])

    const handleSearch = (value: string) => {
        const filtered = data.filter(course =>
            course.title.toLowerCase().includes(value.toLowerCase()) ||
            course.description.toLowerCase().includes(value.toLowerCase()),
        )
        setFilteredData(filtered)
    }

    const showModal = () => {
        setIsModalVisible(true)
    }

    const handleCancel = () => {
        setIsModalVisible(false)
        setEditingCourse(null)
        form.resetFields()
    }

    const showDeleteModal = (id: string) => {
        setCourseToDelete(id)
        setIsDeleteModalVisible(true)
    }

    const handleDeleteCancel = () => {
        setIsDeleteModalVisible(false)
        setCourseToDelete(null)
    }

    const handleDeleteCourse = async () => {
        if (!courseToDelete) return
        try {
            await deleteCourse(courseToDelete)
            message.success('Course deleted successfully')
            const courses = await getCourses()
            setData(courses.data)
            setFilteredData(courses.data)
            setIsDeleteModalVisible(false)
            setCourseToDelete(null)
        } catch (error) {
            message.error('Failed to delete course')
            console.error('Failed to delete course:', error)
        }
    }

    const handleAddOrUpdateCourse = async (values: any) => {
        console.log(values)
        const formData = new FormData()
        formData.append('title', values.title)
        formData.append('description', values.description)
        formData.append('startDate', values.startDate.format('YYYY-MM-DD'))
        formData.append('endDate', values.endDate.format('YYYY-MM-DD'))
        formData.append('certification', values.certification)

        if (selectedImage) {
            formData.append('file', selectedImage.originFileObj)
        }
        try {
            if (editingCourse) {
                await editCourse(editingCourse._id, formData)
            } else {
                await addCourse(formData)
            }
            const courses = await getCourses()
            setData(courses.data)
            setFilteredData(courses.data)
            setIsModalVisible(false)
            form.resetFields()
        } catch (error) {
            console.error('Failed to add course:', error)
        }
    }

    const handleEditCourse = (course: Course) => {
        setEditingCourse(course)
        form.setFieldsValue({
            title: course.title,
            description: course.description,
            startDate: moment(course.start_date),
            endDate: moment(course.end_date),
            certification: course.certification,
        })
        setIsModalVisible(true)
    }

    const handleImageChange = ({ fileList }) => {
        setSelectedImage(fileList[0])
    }

    const columns: TableProps<Course>['columns'] = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            render: (text) => text ? <a>{text}</a> : 'Unknown',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            render: (text) => text ? text : 'Unknown',
        },
        {
            title: 'Image',
            key: 'images',
            render: (record) => record.images ?
                <img src={record.images[0]} alt={record.title} style={{ width: '100px', maxHeight: '100px' }} />
                : <img src={'/MockData/default-course.jpg'} alt={record.title}
                       style={{ width: '100px', maxHeight: '100px' }} />,
        },
        {
            title: 'Start Date',
            dataIndex: 'start_date',
            key: 'start_date',
            render: (text) => moment(text).format('DD/MM/YYYY'),
        },
        {
            title: 'End Date',
            dataIndex: 'end_date',
            key: 'end_date',
            render: (text) => moment(text).format('DD/MM/YYYY'),
        },
        {
            title: 'Action',
            key: 'action',
            render: (record) => (
                <Space size="middle">
                    <Tooltip title="View">
                        <Link style={{color: 'black'}} to={`/admin/course/detail/${record._id}`}><AlignLeftOutlined /></Link>
                    </Tooltip>
                    <Tooltip title="Edit">
                        <EditOutlined onClick={() => handleEditCourse(record)} />
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
                    placeholder="Search courses"
                    onSearch={handleSearch}
                    enterButton
                />
                <Button type="primary" onClick={showModal}>
                    Add Course
                </Button>
            </Space>
            <div style={{ overflow: 'auto' }}>
                <Table
                    <Course>
                    columns={columns}
                    dataSource={filteredData}
                    loading={isLoading}
                    onRow={(record) => {
                        return {
                            onClick: () => {

                            },
                        }
                    }}
                />
            </div>
            <Modal
                title={editingCourse ? 'Edit Course' : 'Add New Course'}
                open={isModalVisible}
                onCancel={handleCancel}
                onOk={() => form.submit()}
                okText={editingCourse ? 'Update' : 'Add Course'}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleAddOrUpdateCourse}
                >
                    <Form.Item
                        name="title"
                        label="Title"
                        rules={[{ required: true, message: 'Please input the title!' }]}
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

                    <Form.Item
                        name="startDate"
                        label="Start Date"
                        rules={[{ required: true, message: 'Please select the start date!' }]}
                    >
                        <DatePicker />
                    </Form.Item>
                    <Form.Item
                        name="endDate"
                        label="End Date"
                        rules={[{ required: true, message: 'Please select the end date!' }]}
                    >
                        <DatePicker />
                    </Form.Item>

                    <Form.Item
                        name="certification"
                        label="Certification"
                        rules={[{ required: true, message: 'Please input the certification!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="file"
                        label="Images"
                        valuePropName="fileList"
                        getValueFromEvent={(e) => e && e.fileList}
                    >
                        <Upload
                            listType="picture"
                            beforeUpload={() => false}
                            onChange={handleImageChange}
                            maxCount={1}
                        >
                            <Button icon={<UploadOutlined />}>Upload</Button>
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                title="Confirm Delete"
                open={isDeleteModalVisible}
                onOk={handleDeleteCourse}
                onCancel={handleDeleteCancel}
                okText="Delete"
                cancelText="Cancel"
            >
                <p>Are you sure you want to delete this course?</p>
            </Modal>
        </div>
    )
}

export default ListCourseManagement
