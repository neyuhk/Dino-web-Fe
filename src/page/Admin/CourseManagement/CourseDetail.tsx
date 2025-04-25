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
    Select,
    Upload,
    Tooltip,
} from 'antd'
import { useParams } from 'react-router-dom'
import moment from 'moment'
import { getCourseById } from '../../../services/course.ts'
import { Course } from '../../../model/model.ts'
import { getLessonByCourseId, addLesson } from '../../../services/lesson.ts'
import { PROJECT_TYPE } from '../../../enum/projectType.ts'
import { AlignLeftOutlined, DeleteOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons'
// @ts-ignore
import { debounce } from 'lodash'
import { Lesson } from '../../../model/classroom.ts'
import DinoLoading from '../../../components/commons/DinoLoading/DinoLoading.tsx'
import { GraduationCap } from 'lucide-react'

const { Title, Paragraph, Text } = Typography
const { Search } = Input

const CourseDetailPage: React.FC = () => {
    const { courseId } = useParams<{ courseId: string }>()
    const [courseData, setCourseData] = useState<Course | null>(null)
    const [lessons, setLessons] = useState<Lesson[]>([])
    const [originalLessons, setOriginalLessons] = useState<Lesson[]>([])
    const [isLoading, setLoading] = useState(true)
    const [isAddLessonModalVisible, setIsAddLessonModalVisible] = useState(false)
    const [form] = Form.useForm()
    const [selectedImage, setSelectedImage] = useState(null)

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                const courseResponse = await getCourseById(courseId ? courseId : '')
                setCourseData(courseResponse.data)
                const lessonsResponse = await getLessonByCourseId(courseId ? courseId : '')
                setLessons(lessonsResponse.data)
                setOriginalLessons(lessonsResponse.data)
                setLoading(false)
            } catch (error) {
                console.error('Failed to fetch course data:', error)
                setLoading(false)
            }
        }

        fetchCourseData()
    }, [courseId])

    const handleSearch = debounce((value: string) => {
        if (value.trim() === '') {
            setLessons(originalLessons)
        } else {
            const filteredLessons = originalLessons.filter(lesson =>
                lesson.title.toLowerCase().includes(value.trim().toLowerCase()) ||
                lesson.description.toLowerCase().includes(value.trim().toLowerCase()),
            )
            setLessons(filteredLessons)
        }
    }, 300)

    const showAddLessonModal = () => {
        setIsAddLessonModalVisible(true)
    }

    const handleAddLesson = async (values: any) => {
        const formData = new FormData()
        formData.append('title', values.title)
        formData.append('description', values.description)
        formData.append('video_url', values.video_url)
        formData.append('body', values.body)
        formData.append('status', values.status)
        if (selectedImage) {
            // @ts-ignore
            formData.append('images', selectedImage.originFileObj)
        }

        try {
            await addLesson(courseId ? courseId : '', formData)
            message.success('Lesson added successfully')
            const lessonsResponse = await getLessonByCourseId(courseId ? courseId : '')
            setLessons(lessonsResponse.data)
            setOriginalLessons(lessonsResponse.data)
            setIsAddLessonModalVisible(false)
            form.resetFields()
        } catch (error) {
            message.error('Failed to add lesson')
            console.error('Failed to add lesson:', error)
        }
    }

    const handleCancel = () => {
        setIsAddLessonModalVisible(false)
        form.resetFields()
    }

    // @ts-ignore
    const handleImageChange = ({ fileList }) => {
        setSelectedImage(fileList[0])
    }
    if (isLoading) {
        return (
            <div className={"loadingContainer"}>
                <div className={"loadingSpinner"}>
                    <GraduationCap size={32} className={"loadingIcon"} />
                </div>
                <p>Đang tải khoá học...</p>
            </div>
            // <DinoLoading
            //     message="Đang tải lớp học của bạn...">
            // </DinoLoading>
        )
    }
    if (!courseData) {
        return (
            <Card>
                <div className="text-center">No course data available</div>
            </Card>
        )
    }

    const columns = [
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
            title: 'Video URL',
            dataIndex: 'video_url',
            key: 'video_url',
            render: (text: string) => <a href={text} target="_blank" rel="noopener noreferrer">Watch Video</a>,
        },
        {
            title: 'Video Image',
            render: () => <img src={'/MockData/flapybird.jpg'} alt="video_image"
                               style={{ width: '100px', maxHeight: '100px' }} />,
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (text: string) => moment(text).format('DD/MM/YYYY'),
        },
        {
            title: 'Action',
            key: 'action',
            render: (record: Lesson) => (
                <Space size="middle">
                    <Tooltip title="View">
                        <AlignLeftOutlined onClick={() => handleView(record)} />
                    </Tooltip>
                    <Tooltip title="Edit">
                        <EditOutlined onClick={() => handleEdit(record)} />
                    </Tooltip>
                    <Tooltip title="Delete">
                        <DeleteOutlined onClick={() => handleDelete(record)} />
                    </Tooltip>
                </Space>
            ),
        },
    ]

    const handleView = (record: Lesson) => {
        console.log('View', record)
    }

    const handleEdit = (record: Lesson) => {
        console.log('Edit', record)
    }

    const handleDelete = (record: Lesson) => {
        console.log('Delete', record)
    }

    const {
        title = 'Unknown',
        description = 'Unknown',
        images = [],
        start_date = 'Unknown',
        end_date = 'Unknown',
        createdAt = 'Unknown',
    } = courseData

    return (
        <Card className="max-w-4xl mx-auto">
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Title level={2}>{title}</Title>
                </Col>
            </Row>
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={16}>
                    {images[0] ? (
                        <Image
                            width="100%"
                            height={400}
                            src={images[0]}
                            alt={title}
                            preview={false}
                            style={{ objectFit: 'cover', borderRadius: '8px' }}
                        />
                    ) : (
                        <Image
                            width="100%"
                            height={400}
                            src={'/MockData/default-course.jpg'}
                            alt={'default'}
                            preview={false}
                            style={{ objectFit: 'cover', borderRadius: '8px' }}
                        />
                    )}
                </Col>
                <Col xs={24} sm={8}>
                    <Space direction="vertical" size="large" style={{ width: '100%' }}>
                        <Card>
                            <Text strong>Start Date: </Text>
                            <Text>{moment(start_date).format('DD/MM/YYYY')}</Text>
                            <br />
                            <Text strong>End Date: </Text>
                            <Text>{moment(end_date).format('DD/MM/YYYY')}</Text>
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
                        <Title level={4}>Course Description</Title>
                        <Paragraph>{description}</Paragraph>
                    </Card>
                </Col>
            </Row>
            <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
                <Col span={24}>
                    <Card>
                        <Title level={3}>Lessons</Title>
                        <Space style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between' }}>
                            <Search
                                placeholder="Search lessons"
                                onChange={(e) => handleSearch(e.target.value)}
                                enterButton
                            />
                            <Button type="primary" onClick={showAddLessonModal}>
                                Add Lesson
                            </Button>
                        </Space>
                        <Table
                            columns={columns}
                            dataSource={lessons}
                            loading={isLoading}
                            rowKey="_id"
                            pagination={{ pageSize: 5 }}
                        />
                    </Card>
                </Col>
            </Row>
            <Modal
                title="Add New Lesson"
                visible={isAddLessonModalVisible}
                onOk={() => form.submit()}
                onCancel={handleCancel}
                okText="Add Lesson"
                cancelText="Cancel"
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleAddLesson}
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
                        name="video_url"
                        label="Video URL"
                        rules={[{ required: true, message: 'Please input the video URL!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="body"
                        label="Body"
                        rules={[{ required: true, message: 'Please input the body!' }]}
                    >
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item
                        name="status"
                        label="Status"
                        rules={[{ required: true, message: 'Please select the status!' }]}
                    >
                        <Select>
                            {Object.values(PROJECT_TYPE).map(type => (
                                <Select.Option key={type} value={type}>{type}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="images"
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
        </Card>
    )
}

export default CourseDetailPage
