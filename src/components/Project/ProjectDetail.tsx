import React, { useEffect, useState, useRef } from 'react'
import {
    Typography,
    Avatar,
    Space,
    Button,
    Input,
    Form,
    message,
    Upload,
    Modal
} from 'antd'
import {
    UserOutlined,
    BlockOutlined,
    EditOutlined,
    SaveOutlined,
    CloseOutlined,
    UploadOutlined
} from '@ant-design/icons'
import { Heart, Eye, MessageSquare, ArrowLeft, Loader2 } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import moment from 'moment/moment'
import { useSelector } from 'react-redux'
import { Project } from '../../model/model.ts'
import CommentComponent from '../Comment/Comment.tsx'
import { getProjectById, isLikedProject, likeProject, updateProject } from '../../services/project.ts'
import styles from './ProjectDetail.module.css'
// Import Toast component
import Toast from '../commons/Toast/Toast.tsx'

const { Title, Paragraph, Text } = Typography
const { TextArea: AntTextArea } = Input;

// Define Toast message interface
interface ToastMessage {
    show: boolean
    type: 'success' | 'error' | 'info' | 'warning'
    title: string
    message: string
    image?: string
}

const ProjectDetail: React.FC = () => {
    const { user } = useSelector((state: any) => state.auth)
    const { projectId } = useParams<{ projectId: string }>()
    const [projectData, setProjectData] = useState<Project | null>(null)
    const [isLiked, setIsLiked] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [showComments, setShowComments] = useState(false)
    const [editFormData, setEditFormData] = useState({
        name: '',
        description: '',
        image: null as File | null
    })
    const [previewImage, setPreviewImage] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const userId = user?._id || ''
    const navigate = useNavigate()
    const [form] = Form.useForm()
    // Add toast state
    const [toast, setToast] = useState<ToastMessage>({
        show: false,
        type: 'info',
        title: '',
        message: '',
    })

    useEffect(() => {
        const fetchProjectData = async () => {
            setIsLoading(true)
            try {
                const response = await getProjectById(
                    projectId ? projectId : ''
                )
                setProjectData(response.data)
                setEditFormData({
                    name: response.data.name,
                    description: response.data.description || '',
                    image: null
                })

                // Check if user is logged in before checking if project is liked
                if (userId) {
                    const liked = await isLikedProject(
                        projectId ? projectId : '',
                        userId
                    )
                    setIsLiked(liked.data)
                }

                setIsLoading(false)
            } catch (error) {
                setIsLoading(false)
                console.error('Failed to fetch project data:', error)
            }
        }

        fetchProjectData()
    }, [projectId, userId])

    const handleViewInBlockly = () => {
        navigate(`/blockly/${projectId}`)
    }

    const isOwner = userId && projectData?.user_id?._id === userId

    // Show toast function
    const showToast = (
        type: 'success' | 'error' | 'info' | 'warning',
        title: string,
        message: string,
        image?: string
    ) => {
        setToast({
            show: true,
            type,
            title,
            message,
            image
        })

        // Hide toast after 3 seconds
        setTimeout(() => {
            setToast((prev) => ({ ...prev, show: false }))
        }, 3000)
    }

    // Close toast function
    const hideToast = () => {
        setToast((prev) => ({ ...prev, show: false }))
    }

    const handleCommentsVisibility = () => {
        if (!userId) {
            // Show login required toast
            showToast(
                'error',
                'Cần đăng nhập',
                'Bạn cần đăng nhập để xem bình luận',
                '/images/error.png'
            )
            return
        }
        setShowComments(!showComments)
    }
    if (isLoading) {
        return <div className={styles.noDataContainer}>
            <Loader2 size={20} className="dark-spinner" />
            <Title level={3}>Đang tải dữ liệu...</Title>
        </div>;
    }

    if (!projectData) {
        return (
            <div className={styles.noDataContainer}>
                <Title level={3}>Chưa có dữ liệu</Title>
            </div>
        )
    }

    const {
        name = 'Unknown',
        description = 'Không có mô ',
        images = [],
        like_count = 0,
        view_count = 0,
        user_id: projectUserId = { username: 'tảown' },
        createdAt = 'Unknown',
    } = projectData

    const username = projectUserId ? projectUserId.username : 'Unknown'

    const handleLikeProject = async () => {
        // Check if user is logged in
        if (!userId) {
            showToast(
                'error',
                'Cần đăng nhập',
                'Bạn cần đăng nhập để thích dự án này',
                '/images/error.png'
            )
            return
        }

        try {
            if (isLiked) {
                setProjectData((prevData) =>
                    prevData
                        ? { ...prevData, like_count: prevData.like_count - 1 }
                        : null
                )
            } else {
                setProjectData((prevData) =>
                    prevData
                        ? { ...prevData, like_count: prevData.like_count + 1 }
                        : null
                )
            }
            setIsLiked(!isLiked)
            await likeProject(projectId ? projectId : '', userId)
        } catch (error) {
            console.error('Failed to like project:', error)
            showToast(
                'error',
                'Lỗi',
                'Không thể thích dự án này',
                '/images/error.png'
            )
        }
    }

    const handleEditClick = () => {
        // Check if user is logged in
        if (!userId) {
            showToast(
                'error',
                'Cần đăng nhập',
                'Bạn cần đăng nhập để chỉnh sửa dự án',
                '/images/error.png'
            )
            return
        }

        setIsEditing(true)
        form.setFieldsValue({
            name: projectData.name,
            description: projectData.description || ''
        })
    }

    const handleCancelEdit = () => {
        setIsEditing(false)
        setPreviewImage(null)
        setEditFormData({
            name: projectData.name,
            description: projectData.description || '',
            image: null
        })
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setEditFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setEditFormData(prev => ({
                ...prev,
                image: file
            }))

            // Create preview URL
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreviewImage(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSaveChanges = async () => {
        // Check if user is logged in
        if (!userId) {
            showToast(
                'error',
                'Cần đăng nhập',
                'Bạn cần đăng nhập để lưu thay đổi',
                '/images/error.png'
            )
            return
        }

        try {
            setIsLoading(true)

            // Validate form data
            if (!editFormData.name.trim()) {
                message.error('Project name cannot be empty')
                setIsLoading(false)
                return
            }

            // Create FormData for image upload
            const formData = new FormData()
            formData.append('name', editFormData.name)
            formData.append('description', editFormData.description)

            if (editFormData.image) {
                formData.append('images', editFormData.image)
            }

            // Send update request
            await updateProject(formData, projectId || '')

            // Update local state with new data
            const updatedProject = await getProjectById(projectId || '')
            setProjectData(updatedProject.data)

            showToast(
                'success',
                'Thành công',
                'Dự án đã được cập nhật thành công',
                '/images/success.png'
            )
            setIsEditing(false)
            setPreviewImage(null)
        } catch (error) {
            console.error('Failed to update project:', error)
            showToast(
                'error',
                'Lỗi',
                'Không thể cập nhật dự án',
                '/images/error.png'
            )
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className={styles.container}>
            <button onClick={() => navigate(-1)} className={styles.backButton}>
                <ArrowLeft size={18} className={styles.backIcon} />
                <span>Quay lại</span>
            </button>

            <div className={styles.projectHeader}>
                <div className={styles.imageSection}>
                    {isEditing ? (
                        <div className={styles.editImageContainer}>
                            <img
                                src={
                                    previewImage ||
                                    images[0] ||
                                    'https://i.pinimg.com/736x/95/6f/0f/956f0fef63faac5be7b95715f6207fea.jpg'
                                }
                                alt={name}
                                className={styles.projectImage}
                            />
                            <div className={styles.imageOverlay}>
                                <Button
                                    icon={<UploadOutlined />}
                                    onClick={() =>
                                        fileInputRef.current?.click()
                                    }
                                    className={styles.uploadButton}
                                >
                                    Change Image
                                </Button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                />
                            </div>
                        </div>
                    ) : (
                        <img
                            src={
                                images[0] ||
                                'https://i.pinimg.com/736x/95/6f/0f/956f0fef63faac5be7b95715f6207fea.jpg'
                            }
                            alt={name}
                            className={styles.projectImage}
                        />
                    )}
                </div>

                <div className={styles.infoSection}>
                    <div className={styles.profileSection}>
                        <Space className={styles.userInfo}>
                            <Avatar
                                icon={<UserOutlined />}
                                className={styles.avatar}
                            />
                            <div className={styles.titleSection}>
                                {isEditing ? (
                                    <Form
                                        form={form}
                                        layout="vertical"
                                        className={styles.editForm}
                                    >
                                        <Form.Item
                                            name="name"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        'Please enter project name',
                                                },
                                            ]}
                                            className={styles.formItem}
                                        >
                                            <Input
                                                name="name"
                                                value={editFormData.name}
                                                onChange={handleInputChange}
                                                placeholder="Project Name"
                                                className={styles.titleInput}
                                            />
                                        </Form.Item>
                                    </Form>
                                ) : (
                                    <Title
                                        level={2}
                                        className={styles.projectTitle}
                                    >
                                        {name}
                                    </Title>
                                )}
                                <Text strong className={styles.authorName}>
                                    Tác giả: {username}
                                </Text>
                                <div>
                                    <Text
                                        type="secondary"
                                        className={styles.dateText}
                                    >
                                        Thời gian: {' '}
                                        {createdAt !== 'Chưa cập nhật'
                                            ? moment(createdAt).format(
                                                  'DD/MM/YYYY'
                                              )
                                            : 'Chưa cập nhật'}
                                    </Text>
                                </div>
                            </div>
                        </Space>

                        <div className={styles.buttonGroup}>
                            {isOwner && !isEditing && (
                                <Button
                                    type="default"
                                    icon={<EditOutlined />}
                                    onClick={handleEditClick}
                                    className={styles.editButton}
                                >
                                    Edit Project
                                </Button>
                            )}

                            {isEditing ? (
                                <div className={styles.editActions}>
                                    <Button
                                        type="primary"
                                        icon={<SaveOutlined />}
                                        onClick={handleSaveChanges}
                                        loading={isLoading}
                                        className={styles.saveButton}
                                    >
                                        Save
                                    </Button>
                                    <Button
                                        type="default"
                                        icon={<CloseOutlined />}
                                        onClick={handleCancelEdit}
                                        className={styles.cancelButton}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            ) : (
                                <Button
                                    type="primary"
                                    icon={<BlockOutlined />}
                                    onClick={handleViewInBlockly}
                                    className={styles.blocklyButton}
                                >
                                    Mở trong Dino Blocks
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.actionsBar}>
                <button
                    onClick={handleLikeProject}
                    className={styles.actionButton}
                >
                    <Heart
                        size={20}
                        className={
                            isLiked ? styles.likeActive : styles.likeInactive
                        }
                    />
                    <span className={styles.actionCount}>{like_count}</span>
                </button>

                <div
                    className={`${styles.actionButton} ${styles.disabledAction}`}
                >
                    <Eye size={20} className={styles.viewIcon} />
                    <span className={styles.actionCount}>{view_count}</span>
                </div>

                <div
                    className={styles.actionButton}
                    onClick={handleCommentsVisibility}
                >
                    <MessageSquare size={20} className={styles.commentIcon} />
                    <span className={styles.actionCount}>0</span>
                </div>
            </div>

            <div className={styles.descriptionContainer}>
                <Title level={4} className={styles.sectionTitle}>
                    Mô tả dự án
                </Title>

                {isEditing ? (
                    <Form form={form} layout="vertical">
                        <Form.Item
                            name="description"
                            className={styles.formItem}
                        >
                            <AntTextArea
                                name="description"
                                value={editFormData.description}
                                onChange={handleInputChange}
                                placeholder="Enter project description"
                                autoSize={{ minRows: 4, maxRows: 8 }}
                                className={styles.descriptionInput}
                            />
                        </Form.Item>
                    </Form>
                ) : (
                    <Paragraph className={styles.descriptionText}>
                        {description}
                    </Paragraph>
                )}
            </div>

            {showComments && userId && (
                <div className={styles.commentsContainer}>
                    <Title level={2} className={styles.sectionTitle}>Bình luận</Title>
                    <CommentComponent
                        commentableId={projectId ? projectId : ''}
                        commentableType={'PROJECT'}
                    />
                </div>
            )}

            {/* Toast notification */}
            {toast.show && (
                <Toast toast={toast} onClose={hideToast} type={toast.type} />
            )}
        </div>
    )
}

export default ProjectDetail