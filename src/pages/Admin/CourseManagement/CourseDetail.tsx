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
    Tabs,
    Spin
} from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import moment from 'moment'
import { getCourseById } from '../../../services/course.ts'
import { Course } from '../../../model/model.ts'
import { getLessonByCourseId, addLesson } from '../../../services/lesson.ts'
import { PROJECT_TYPE } from '../../../enum/projectType.ts'
import { AlignLeftOutlined, DeleteOutlined, EditOutlined, UploadOutlined, BookOutlined, TeamOutlined, TrophyOutlined, ArrowLeftOutlined } from '@ant-design/icons'
// @ts-ignore
import { debounce } from 'lodash'
import { Lesson } from '../../../model/classroom.ts'
import { GraduationCap } from 'lucide-react'
import styles from './CourseDetail.module.css'
import CourseStudents from '../../../components/ClassRoom/Teacher/CourseLessons/CourseStudents.tsx'
import CourseScore from '../../../components/ClassRoom/Teacher/CourseLessons/CourseScore.tsx'

const { Title, Paragraph, Text } = Typography
const { TabPane } = Tabs
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
    const [activeTab, setActiveTab] = useState('lessons')
    const [isLoadingTab, setIsLoadingTab] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                const courseResponse = await getCourseById(courseId ? courseId : '')
                setCourseData(courseResponse.data)

                if (activeTab === 'lessons') {
                    setIsLoadingTab(true)
                    const lessonsResponse = await getLessonByCourseId(courseId ? courseId : '')
                    setLessons(lessonsResponse.data)
                    setOriginalLessons(lessonsResponse.data)
                    setIsLoadingTab(false)
                }

                setLoading(false)
            } catch (error) {
                console.error('Không thể tải dữ liệu khóa học:', error)
                setLoading(false)
                setIsLoadingTab(false)
            }
        }

        fetchCourseData()
    }, [courseId])

    useEffect(() => {
        const loadTabData = async () => {
            if (activeTab === 'lessons' && originalLessons.length === 0) {
                setIsLoadingTab(true)
                try {
                    const lessonsResponse = await getLessonByCourseId(courseId ? courseId : '')
                    setLessons(lessonsResponse.data)
                    setOriginalLessons(lessonsResponse.data)
                } catch (error) {
                    console.error('Không thể tải danh sách bài học:', error)
                    message.error('Không thể tải danh sách bài học')
                } finally {
                    setIsLoadingTab(false)
                }
            }
        }

        loadTabData()
    }, [activeTab, courseId, originalLessons.length])

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
            message.success('Thêm bài học thành công')
            const lessonsResponse = await getLessonByCourseId(courseId ? courseId : '')
            setLessons(lessonsResponse.data)
            setOriginalLessons(lessonsResponse.data)
            setIsAddLessonModalVisible(false)
            form.resetFields()
        } catch (error) {
            message.error('Không thể thêm bài học')
            console.error('Không thể thêm bài học:', error)
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

    const handleTabChange = (key: string) => {
        setActiveTab(key)
    }

    if (isLoading) {
        return (
            <div className={"loadingContainer"}>
                <div className={"loadingSpinner"}>
                    <GraduationCap size={32} className={"loadingIcon"} />
                </div>
                <p>Đang tải...</p>
            </div>
        )
    }

    if (!courseData) {
        return (
            <Card>
                <div className="text-center">Không có dữ liệu khóa học</div>
            </Card>
        )
    }

    const columns = [
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
        },
        {
            title: 'Đường dẫn video',
            dataIndex: 'video_url',
            key: 'video_url',
            render: (text: string) => <a href={text} target="_blank" rel="noopener noreferrer">Xem video</a>,
        },
        {
            title: 'Hình ảnh',
            render: () => <img src={'/MockData/flapybird.jpg'} alt="video_image"
                               style={{ width: '100px', maxHeight: '100px', objectFit: 'cover', borderRadius: '4px' }} />,
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (text: string) => moment(text).format('DD/MM/YYYY'),
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (record: Lesson) => (
                <Space size="middle">
                    <Tooltip title="Xem chi tiết">
                        <Button type="text" icon={<AlignLeftOutlined />} onClick={() => handleView(record)} />
                    </Tooltip>
                    <Tooltip title="Chỉnh sửa">
                        <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
                    </Tooltip>
                    <Tooltip title="Xóa">
                        <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)} />
                    </Tooltip>
                </Space>
            ),
        },
    ]

    const handleView = (record: Lesson) => {
        const lessonId = record._id
        navigate(`${lessonId}`)
    }

    const handleEdit = (record: Lesson) => {
        message.info('Tính năng chỉnh sửa bài học đang được phát triển')
    }

    const handleDelete = (record: Lesson) => {
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: `Bạn có chắc chắn muốn xóa bài học "${record.title}" không?`,
            okText: 'Xóa',
            cancelText: 'Hủy',
            okButtonProps: { danger: true },
            onOk: () => {
                message.info('Tính năng xóa bài học đang được phát triển')
            }
        })
    }

    const {
        title = 'Chưa có tên',
        description = 'Chưa có mô tả',
        images = [],
        start_date = 'Chưa có',
        end_date = 'Chưa có',
        createdAt = 'Chưa có',
    } = courseData

    const renderLessonsTab = () => (
        <>
            <div className={styles.tableActions}>
                <Search
                    placeholder="Tìm kiếm bài học"
                    onChange={(e) => handleSearch(e.target.value)}
                    enterButton
                    className={styles.searchBar}
                />
                <Button type="primary" onClick={showAddLessonModal} icon={<BookOutlined />}>
                    Thêm bài học mới
                </Button>
            </div>
            {isLoadingTab ? (
                <div className={styles.tabLoadingContainer}>
                    <Spin tip="Đang tải..." />
                </div>
            ) : (
                <Table
                    columns={columns}
                    dataSource={lessons}
                    rowKey="_id"
                    pagination={{ pageSize: 5 }}
                    locale={{ emptyText: 'Không có bài học nào' }}
                />
            )}
        </>
    )

    const renderStudentsTab = () => (
        <div className={styles.tabContent}>
            {isLoadingTab ? (
                <div className={styles.tabLoadingContainer}>
                    <Spin tip="Đang tải..." />
                </div>
            ) : (
                <CourseStudents courseId={courseId ? courseId : ''} />
            )}
        </div>
    )

    const renderScoresTab = () => (
        <div className={styles.tabContent}>
            {isLoadingTab ? (
                <div className={styles.tabLoadingContainer}>
                    <Spin tip="Đang tải..." />
                </div>
            ) : (
                <CourseScore courseId={courseId ? courseId : ''} />
            )}
        </div>
    )

    return (
        <Card className="max-w-4xl mx-auto">
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <div className={styles.courseHeader}>
                        <Button
                            type="default"
                            icon={<ArrowLeftOutlined />}
                            onClick={() => navigate(-1)}
                            style={{ marginRight: '16px' }}
                        >
                            Quay lại
                        </Button>
                        <Title level={2} style={{ margin: 0 }}>{title}</Title>
                    </div>
                </Col>
            </Row>
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={16}>
                    {images[0] ? (
                        <Image
                            className={styles.courseImage}
                            width="100%"
                            height={400}
                            src={images[0]}
                            alt={title}
                            preview={false}
                        />
                    ) : (
                        <Image
                            className={styles.courseImage}
                            width="100%"
                            height={400}
                            src={'/MockData/default-course.jpg'}
                            alt={'ảnh mặc định'}
                            preview={false}
                        />
                    )}
                </Col>
                <Col xs={24} sm={8}>
                    <Space direction="vertical" size="large" className={styles.infoCard}>
                        <Card title="Thông tin khóa học">
                            <div className={styles.infoItem}>
                                <Text strong>Ngày bắt đầu: </Text>
                                <Text>{moment(start_date).format('DD/MM/YYYY')}</Text>
                            </div>
                            <div className={styles.infoItem}>
                                <Text strong>Ngày kết thúc: </Text>
                                <Text>{moment(end_date).format('DD/MM/YYYY')}</Text>
                            </div>
                            <div>
                                <Text strong>Ngày tạo: </Text>
                                <Text>{moment(createdAt).format('DD/MM/YYYY')}</Text>
                            </div>
                        </Card>
                    </Space>
                </Col>
            </Row>
            <Row gutter={[16, 16]} className={styles.descriptionSection}>
                <Col span={24}>
                    <Card>
                        <Title level={4}>Mô tả khóa học</Title>
                        <Paragraph>{description}</Paragraph>
                    </Card>
                </Col>
            </Row>
            <Row gutter={[16, 16]} className={styles.tabsSection}>
                <Col span={24}>
                    <Card>
                        <Tabs activeKey={activeTab} onChange={handleTabChange}>
                            <TabPane
                                tab={
                                    <span>
                                        <BookOutlined /> Danh sách bài học
                                    </span>
                                }
                                key="lessons"
                            >
                                {renderLessonsTab()}
                            </TabPane>
                            <TabPane
                                tab={
                                    <span>
                                        <TeamOutlined /> Danh sách học sinh
                                    </span>
                                }
                                key="students"
                            >
                                {renderStudentsTab()}
                            </TabPane>
                            <TabPane
                                tab={
                                    <span>
                                        <TrophyOutlined /> Bảng điểm
                                    </span>
                                }
                                key="scores"
                            >
                                {renderScoresTab()}
                            </TabPane>
                        </Tabs>
                    </Card>
                </Col>
            </Row>
            <Modal
                title="Thêm bài học mới"
                visible={isAddLessonModalVisible}
                onOk={() => form.submit()}
                onCancel={handleCancel}
                okText="Thêm bài học"
                cancelText="Hủy"
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleAddLesson}
                >
                    <Form.Item
                        name="title"
                        label="Tiêu đề"
                        rules={[{ required: true, message: 'Vui lòng nhập tiêu đề bài học!' }]}
                    >
                        <Input placeholder="Nhập tiêu đề bài học" />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="Mô tả"
                        rules={[{ required: true, message: 'Vui lòng nhập mô tả bài học!' }]}
                    >
                        <Input.TextArea placeholder="Nhập mô tả ngắn về bài học" rows={3} />
                    </Form.Item>
                    <Form.Item
                        name="video_url"
                        label="Đường dẫn video"
                        rules={[{ required: true, message: 'Vui lòng nhập đường dẫn video!' }]}
                    >
                        <Input placeholder="Nhập đường dẫn video bài học" />
                    </Form.Item>
                    <Form.Item
                        name="body"
                        label="Nội dung"
                        rules={[{ required: true, message: 'Vui lòng nhập nội dung bài học!' }]}
                    >
                        <Input.TextArea placeholder="Nhập nội dung chi tiết của bài học" rows={5} />
                    </Form.Item>
                    <Form.Item
                        name="status"
                        label="Trạng thái"
                        rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
                    >
                        <Select placeholder="Chọn trạng thái bài học">
                            {Object.values(PROJECT_TYPE).map(type => (
                                <Select.Option key={type} value={type}>{type}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="images"
                        label="Hình ảnh"
                        valuePropName="fileList"
                        getValueFromEvent={(e) => e && e.fileList}
                    >
                        <Upload
                            listType="picture"
                            beforeUpload={() => false}
                            onChange={handleImageChange}
                            maxCount={1}
                        >
                            <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    )
}

export default CourseDetailPage