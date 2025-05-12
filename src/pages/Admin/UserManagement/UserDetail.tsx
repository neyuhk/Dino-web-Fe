import React, { useEffect, useState } from 'react';
import {
    Typography,
    Row,
    Col,
    Avatar,
    Space,
    Modal,
    Button,
    Form,
    Input,
    message,
    Select,
    Upload,
    Descriptions,
    Tag,
    Tabs,
    Card,
    Divider,
    Skeleton,
    Tooltip,
    Timeline
} from 'antd';
import moment from 'moment';
import { getUserById } from '../../../services/user.ts';
import { User } from '../../../model/model.ts';
import {
    UploadOutlined,
    UserOutlined,
    MailOutlined,
    CalendarOutlined,
    EditOutlined,
    KeyOutlined,
    InfoCircleOutlined,
    HistoryOutlined,
    LockOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
import './UserDetail.css';
import { resetPassword } from '../../../services/auth.ts'

interface UserDetailProps {
    userId: string;
    inDrawer?: boolean;
}

const UserDetailComponent: React.FC<UserDetailProps> = ({ userId, inDrawer = false }) => {
    const [userData, setUserData] = useState<User | null>(null);
    const [isLoading, setLoading] = useState(true);
    const [isEditUserModalVisible, setIsEditUserModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [selectedImage, setSelectedImage] = useState(null);
    const [isResetPasswordModalVisible, setIsResetPasswordModalVisible] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userResponse = await getUserById(userId);
                setUserData(userResponse.data);
                setLoading(false);

                // Initialize form with user data
                form.setFieldsValue({
                    name: userResponse.data.name,
                    email: userResponse.data.email,
                    role: userResponse.data.role,
                });
            } catch (error) {
                console.error('Failed to fetch user data:', error);
                setLoading(false);
                message.error('Không thể tải thông tin người dùng');
            }
        };

        fetchUserData();
    }, [userId, form]);

    const showEditUserModal = () => {
        setIsEditUserModalVisible(true);
    };

    const handleEditUser = async (values: any) => {
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('email', values.email);
        formData.append('role', values.role);
        if (selectedImage) {
            // @ts-ignore
            formData.append('avatar', selectedImage.originFileObj);
        }

        try {
            // Call the edit user API here
            message.success('Cập nhật thông tin người dùng thành công');
            setIsEditUserModalVisible(false);
            form.resetFields();

            // Reload user data
            const userResponse = await getUserById(userId);
            setUserData(userResponse.data);
        } catch (error) {
            message.error('Không thể cập nhật thông tin người dùng');
            console.error('Failed to update user:', error);
        }
    };

    const handleResetPassword = async () => {
        // message.success('Đã gửi email đặt lại mật khẩu đến người dùng');
        // setIsResetPasswordModalVisible(false);
        try {
            await resetPassword(userId);
            message.success('Đã gửi email đặt lại mật khẩu đến người dùng');
        } catch (error) {
            message.error('Không thể gửi email đặt lại mật khẩu');
            console.error('Failed to reset password:', error);
        } finally {
            setIsResetPasswordModalVisible(false);
        }
    };

    const handleCancel = () => {
        setIsEditUserModalVisible(false);
        form.resetFields();
    };

    // @ts-ignore
    const handleImageChange = ({ fileList }) => {
        setSelectedImage(fileList[0]);
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

    if (isLoading) {
        return (
            <div className="user-detail-loading">
                <Skeleton avatar paragraph={{ rows: 4 }} active />
            </div>
        );
    }

    if (!userData) {
        return (
            <div className="user-detail-error">
                <InfoCircleOutlined style={{ fontSize: 48, color: '#ff4d4f' }} />
                <Text style={{ marginTop: 16 }}>Không thể tải thông tin người dùng</Text>
                <Button type="primary" onClick={() => window.location.reload()}>
                    Thử lại
                </Button>
            </div>
        );
    }

    const {
        name = 'Chưa cập nhật',
        username = 'Chưa cập nhật',
        email = 'Chưa cập nhật',
        avatar = '',
        role = 'user',
        createdAt = '',
        updatedAt = '',
    } = userData;

    return (
        <div className={`user-detail-container ${inDrawer ? 'in-drawer' : ''}`}>
            <div className="user-detail-header">
                <div className="user-avatar-container">
                    <Avatar
                        src={avatar[0] || "https://i.pinimg.com/474x/0b/10/23/0b10236ae55b58dceaef6a1d392e1d15.jpg"}
                        icon={!avatar && <UserOutlined />}
                        size={inDrawer ? 80 : 120}
                        className="user-avatar"
                    />
                    <Tag color={getRoleTagColor(role)} className="user-role-tag">
                        {role?.toUpperCase()}
                    </Tag>
                </div>
                <div className="user-basic-info">
                    <Title level={inDrawer ? 4 : 3} className="user-name">
                        {username}
                    </Title>
                    <div className="user-meta">
                        <div className="user-meta-item">
                            <MailOutlined /> {email}
                        </div>
                        <div className="user-meta-item">
                            <CalendarOutlined /> Tham gia: {moment(createdAt).format('DD/MM/YYYY')}
                        </div>
                    </div>
                </div>
            </div>

            <div className="user-detail-actions">
                <Button type="primary" icon={<EditOutlined />} onClick={showEditUserModal}>
                    Chỉnh sửa
                </Button>
                <Button
                    icon={<KeyOutlined />}
                    onClick={() => setIsResetPasswordModalVisible(true)}
                >
                    Đặt lại mật khẩu
                </Button>
            </div>

            <Divider />

            <Tabs defaultActiveKey="info" className="user-detail-tabs">
                <TabPane tab={<span><InfoCircleOutlined /> Thông tin</span>} key="info">
                    <Card bordered={false} className="user-info-card">
                        <Descriptions
                            title="Thông tin chi tiết"
                            layout={inDrawer ? "vertical" : "horizontal"}
                            column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
                        >
                            <Descriptions.Item label="Tên đăng nhập">
                                {username || 'Chưa cập nhật'}
                            </Descriptions.Item>
                            <Descriptions.Item label="Tên hiển thị">
                                {name || 'Chưa cập nhật'}
                            </Descriptions.Item>
                            <Descriptions.Item label="Email">
                                {email}
                            </Descriptions.Item>
                            <Descriptions.Item label="Vai trò">
                                <Tag color={getRoleTagColor(role)}>
                                    {role?.toUpperCase()}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Ngày tham gia">
                                {moment(createdAt).format('DD/MM/YYYY HH:mm')}
                            </Descriptions.Item>
                            <Descriptions.Item label="Cập nhật gần nhất">
                                {updatedAt ? moment(updatedAt).format('DD/MM/YYYY HH:mm') : 'Chưa cập nhật'}
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>

                    {!inDrawer && (
                        <Card
                            title="Thông tin bổ sung"
                            className="user-extra-card"
                            style={{ marginTop: 16 }}
                        >
                            <Row gutter={[16, 16]}>
                                <Col span={12}>
                                    <Descriptions column={1} layout="vertical">
                                        <Descriptions.Item label="Số điện thoại">
                                            {userData.phoneNumber || 'Chưa cập nhật'}
                                        </Descriptions.Item>
                                    </Descriptions>
                                </Col>
                                <Col span={12}>
                                    <Descriptions column={1} layout="vertical">
                                        <Descriptions.Item label="Ngày sinh">
                                            {userData.birthday ? moment(userData.birthday).format('DD/MM/YYYY') : 'Chưa cập nhật'}
                                        </Descriptions.Item>
                                    </Descriptions>
                                </Col>
                            </Row>
                        </Card>
                    )}
                </TabPane>
                <TabPane tab={<span><HistoryOutlined /> Lịch sử hoạt động</span>} key="activities">
                    <p>Chưa cập nhật</p>
                </TabPane>
            </Tabs>

            <Modal
                title="Chỉnh sửa thông tin người dùng"
                visible={isEditUserModalVisible}
                onCancel={handleCancel}
                footer={null}
                width={600}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleEditUser}
                    initialValues={{
                        name: name,
                        email: email,
                        role: role,
                    }}
                >
                    <div className="edit-user-avatar">
                        <Avatar
                            src={avatar[0] || "https://i.pinimg.com/474x/0b/10/23/0b10236ae55b58dceaef6a1d392e1d15.jpg"}
                            icon={!avatar && <UserOutlined />}
                            size={64}
                        />
                        <Form.Item
                            name="avatar"
                            label="Ảnh đại diện"
                            valuePropName="fileList"
                            getValueFromEvent={(e) => e && e.fileList}
                        >
                            <Upload
                                listType="picture"
                                beforeUpload={() => false}
                                onChange={handleImageChange}
                                maxCount={1}
                                showUploadList={false}
                            >
                                <Button icon={<UploadOutlined />}>
                                    Tải lên ảnh mới
                                </Button>
                            </Upload>
                        </Form.Item>
                    </div>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="name"
                                label="Tên hiển thị"
                                rules={[{ required: true, message: 'Vui lòng nhập tên hiển thị!' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="email"
                                label="Email"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập email!' },
                                    { type: 'email', message: 'Email không đúng định dạng!' }
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        name="role"
                        label="Vai trò"
                        rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
                    >
                        <Select>
                            <Select.Option value="admin">Admin</Select.Option>
                            <Select.Option value="teacher">Giáo viên</Select.Option>
                            <Select.Option value="user">Người dùng</Select.Option>
                        </Select>
                    </Form.Item>

                    {!inDrawer && (
                        <>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="phone"
                                        label="Số điện thoại"
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="birthdate"
                                        label="Ngày sinh"
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item
                                name="address"
                                label="Địa chỉ"
                            >
                                <Input />
                            </Form.Item>
                        </>
                    )}

                    <Form.Item>
                        <div className="form-actions">
                            <Button type="primary" htmlType="submit">
                                Lưu thay đổi
                            </Button>
                            <Button onClick={handleCancel}>
                                Hủy bỏ
                            </Button>
                        </div>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title={
                    <div className="reset-password-modal-title">
                        <LockOutlined className="reset-icon" />
                        Đặt lại mật khẩu
                    </div>
                }
                visible={isResetPasswordModalVisible}
                onCancel={() => setIsResetPasswordModalVisible(false)}
                footer={[
                    <Button key="cancel" onClick={() => setIsResetPasswordModalVisible(false)}>
                        Hủy bỏ
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleResetPassword}>
                        Đặt lại mật khẩu
                    </Button>,
                ]}
            >
                <div className="reset-password-content">
                    <div className="reset-warning">
                        <ExclamationCircleOutlined className="warning-icon" />
                        <Text>
                            Đặt lại mật khẩu cho tài khoản này về mặc định
                        </Text>
                    </div>

                    {/*<div className="reset-user-info">*/}
                    {/*    <Text strong>Gửi email đặt lại mật khẩu tới:</Text>*/}
                    {/*    <div className="user-email-info">*/}
                    {/*        <Text>{email}</Text>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                </div>
            </Modal>
        </div>
    );
};

export default UserDetailComponent;
