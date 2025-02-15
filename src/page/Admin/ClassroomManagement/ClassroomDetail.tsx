import React, { useEffect, useState } from 'react'
import {
    Card,
    Typography,
    Row,
    Col,
    Image,
    Space,
    Table,
    Modal,
    Button,
    Form,
    Input,
    message,
    Tooltip,
    Avatar,
} from 'antd'
import { useParams } from 'react-router-dom'
import moment from 'moment'
import { getClassroomById } from '../../../services/classroom.ts'
import { Classroom, Course } from '../../../model/model.ts'
import { AlignLeftOutlined, DeleteOutlined, EditOutlined, UserOutlined } from '@ant-design/icons'

const { Title, Paragraph, Text } = Typography
const { Search } = Input

const ClassroomDetailPage: React.FC = () => {
    const { classroomId } = useParams<{ classroomId: string }>()
    const [classroomData, setClassroomData] = useState<Classroom | null>(null)
    const [isLoading, setLoading] = useState(true)

    useEffect(() => {
        const fetchClassroomData = async () => {
            try {
                const classroomResponse = await getClassroomById(classroomId ? classroomId : '')
                setClassroomData(classroomResponse.data)
                console.log('Classroom data:', classroomResponse.data)
                setLoading(false)
            } catch (error) {
                console.error('Failed to fetch classroom data:', error)
                setLoading(false)
            }
        }

        fetchClassroomData()
    }, [classroomId])

    if (!classroomData) {
        return (
            <Card>
                <div className="text-center">No classroom data available</div>
            </Card>
        )
    }

    const courseColumns = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Start Date',
            dataIndex: 'start_date',
            key: 'start_date',
            render: (text: string) => moment(text).format('DD/MM/YYYY'),
        },
        {
            title: 'End Date',
            dataIndex: 'end_date',
            key: 'end_date',
            render: (text: string) => moment(text).format('DD/MM/YYYY'),
        },
        {
            title: 'Action',
            key: 'action',
            render: (record: Course) => (
                <Space size="middle">
                    <Tooltip title="View">
                        <AlignLeftOutlined onClick={() => console.log('View', record)} />
                    </Tooltip>
                    <Tooltip title="Edit">
                        <EditOutlined onClick={() => console.log('Edit', record)} />
                    </Tooltip>
                    <Tooltip title="Delete">
                        <DeleteOutlined onClick={() => console.log('Delete', record)} />
                    </Tooltip>
                </Space>
            ),
        },
    ]

    const studentColumns = [
        {
            title: 'STT',
            key: 'index',
            render: (_text, _record, index) => index + 1,
        },
        {
            title: 'User',
            key: 'user',
            render: (record) => (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {record.avatar.length > 0 ? (
                        <img src={record.avatar[0]} alt="avatar" style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '10px', objectFit: 'cover' }} />
                    ) : (
                        <Avatar icon={<UserOutlined />} style={{ marginRight: '10px' }} />
                    )}
                    <span>{record.username}</span>
                </div>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (record) => (
                <Space size="middle">
                    <Tooltip title="Delete">
                        <DeleteOutlined onClick={() => console.log('Delete', record)} />
                    </Tooltip>
                </Space>
            ),
        },
    ]

    const {
        name = 'Unknown',
        description = 'Unknown',
        teacher_id: { username: teacherName, avatar: teacherAvatar } = { username: 'Unknown', avatar: [] },
        createdAt = 'Unknown',
        courses = [],
        students = [],
    } = classroomData

    return (
        <Card className="max-w-4xl mx-auto">
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Title level={2}>{name}</Title>
                </Col>
            </Row>
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={16}>
                    <Image
                        width="100%"
                        height={400}
                        src={teacherAvatar[0] || '/MockData/default-avatar.jpg'}
                        alt={teacherName}
                        preview={false}
                        style={{ objectFit: 'cover', borderRadius: '8px' }}
                    />
                </Col>
                <Col xs={24} sm={8}>
                    <Space direction="vertical" size="large" style={{ width: '100%' }}>
                        <Card>
                            <Text strong>Teacher: </Text>
                            <Text>{teacherName}</Text>
                            <br />
                            <Text strong>Created At: </Text>
                            <Text>{moment(createdAt).format('DD/MM/YYYY')}</Text>
                        </Card>
                    </Space>
                </Col>
            </Row>
            <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
                <Col span={24}>
                    <Card>
                        <Title level={4}>Classroom Description</Title>
                        <Paragraph>{description}</Paragraph>
                    </Card>
                </Col>
            </Row>
            <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
                <Col span={24}>
                    <Card>
                        <Title level={3}>Courses</Title>
                        <Table
                            columns={courseColumns}
                            dataSource={courses}
                            loading={isLoading}
                            rowKey="_id"
                            pagination={{ pageSize: 5 }}
                        />
                    </Card>
                </Col>
            </Row>
            <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
                <Col span={24}>
                    <Card>
                        <Space style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between' }}>
                            <Title level={3}>Students</Title>
                            <Button type="primary" onClick={() => console.log('Add Student')}>
                                Add Student
                            </Button>
                        </Space>
                        <Table
                            columns={studentColumns}
                            dataSource={students}
                            loading={isLoading}
                            rowKey="_id"
                            pagination={{ pageSize: 5 }}
                            onRow={(record) => ({
                                onClick: () => console.log('Row clicked:', record),
                            })}
                        />
                    </Card>
                </Col>
            </Row>
        </Card>
    )
}

export default ClassroomDetailPage
