import React, { useEffect, useState } from 'react'
import {
    Card,
    Typography,
    Row,
    Col,
    Image,
    Space,
    Modal,
    Button,
    Form,
    Input,
    message,
    Select,
    Upload,
} from 'antd'
import { useParams } from 'react-router-dom'
import moment from 'moment'
import { getUserById } from '../../../services/user.ts'
import { User } from '../../../model/model.ts'
import { UploadOutlined } from '@ant-design/icons'

const { Title, Paragraph, Text } = Typography
const { Search } = Input

const UserDetailPage: React.FC = () => {
    const { userId } = useParams<{ userId: string }>()
    const [userData, setUserData] = useState<User | null>(null)
    const [isLoading, setLoading] = useState(true)
    const [isEditUserModalVisible, setIsEditUserModalVisible] = useState(false)
    const [form] = Form.useForm()
    const [selectedImage, setSelectedImage] = useState(null)

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userResponse = await getUserById(userId ? userId : '')
                setUserData(userResponse.data)
                setLoading(false)
            } catch (error) {
                console.error('Failed to fetch user data:', error)
                setLoading(false)
            }
        }

        fetchUserData()
    }, [userId])

    const showEditUserModal = () => {
        setIsEditUserModalVisible(true)
    }

    const handleEditUser = async (values: any) => {
        const formData = new FormData()
        formData.append('name', values.name)
        formData.append('email', values.email)
        formData.append('role', values.role)
        if (selectedImage) {
            // @ts-ignore
            formData.append('avatar', selectedImage.originFileObj)
        }

        try {
            // Call the edit user API here
            message.success('User updated successfully')
            setIsEditUserModalVisible(false)
            form.resetFields()
        } catch (error) {
            message.error('Failed to update user')
            console.error('Failed to update user:', error)
        }
    }

    const handleCancel = () => {
        setIsEditUserModalVisible(false)
        form.resetFields()
    }

    // @ts-ignore
    const handleImageChange = ({ fileList }) => {
        setSelectedImage(fileList[0])
    }

    if (!userData) {
        return (
            <Card>
                <div className="text-center">No user data available</div>
            </Card>
        )
    }

    const {
        name = 'Unknown',
        email = 'Unknown',
        avatar = '',
        role = 'Unknown',
        createdAt = 'Unknown',
    } = userData

    return (
        <Card className="max-w-4xl mx-auto">
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Title level={2}>{name}</Title>
                </Col>
            </Row>
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={16}>
                    {avatar ? (
                        <Image
                            width="100%"
                            height={400}
                            src={avatar}
                            alt={name}
                            preview={false}
                            style={{ objectFit: 'cover', borderRadius: '8px' }}
                        />
                    ) : (
                        <Image
                            width="100%"
                            height={400}
                            src={'/MockData/default-avatar.jpg'}
                            alt={'default'}
                            preview={false}
                            style={{ objectFit: 'cover', borderRadius: '8px' }}
                        />
                    )}
                </Col>
                <Col xs={24} sm={8}>
                    <Space direction="vertical" size="large" style={{ width: '100%' }}>
                        <Card>
                            <Text strong>Email: </Text>
                            <Text>{email}</Text>
                            <br />
                            <Text strong>Role: </Text>
                            <Text>{role}</Text>
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
                        <Title level={3}>Actions</Title>
                        <Space style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between' }}>
                            <Button type="primary" onClick={showEditUserModal}>
                                Edit User
                            </Button>
                        </Space>
                    </Card>
                </Col>
            </Row>
            <Modal
                title="Edit User"
                visible={isEditUserModalVisible}
                onOk={() => form.submit()}
                onCancel={handleCancel}
                okText="Save"
                cancelText="Cancel"
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleEditUser}
                >
                    <Form.Item
                        name="name"
                        label="Name"
                        rules={[{ required: true, message: 'Please input the name!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[{ required: true, message: 'Please input the email!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="role"
                        label="Role"
                        rules={[{ required: true, message: 'Please select the role!' }]}
                    >
                        <Select>
                            <Select.Option value="admin">Admin</Select.Option>
                            <Select.Option value="user">User</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="avatar"
                        label="Avatar"
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

export default UserDetailPage
