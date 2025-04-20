import React, { useEffect, useState } from 'react';
import { Space, Table, Input, Button, Modal, Form, Upload, DatePicker, message, Tooltip } from 'antd';
import type { TableProps } from 'antd';
import { getCourses, addCourse, deleteCourse, editCourse } from '../../../services/course.ts';
import { Course } from '../../../model/model.ts';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { AlignLeftOutlined, DeleteOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons';

const { Search } = Input;

const ListCourseManagement: React.FC = () => {
    const [data, setData] = useState<Course[]>([]);
    const [isLoading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
    const [searchTitle, setSearchTitle] = useState<string>('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [selectedImage, setSelectedImage] = useState(null);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);
    const [courseToDelete, setCourseToDelete] = useState<string | null>(null);

    const fetchData = async (page: number, perPage: number, title: string) => {
        setLoading(true);
        try {
            const courses = await getCourses(page, perPage, title);
            setData(courses.data);
            setPagination({ current: page, pageSize: perPage, total: courses.totalCourses });
        } catch (error) {
            console.error('Không thể tải danh sách khóa học:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(pagination.current, pagination.pageSize, searchTitle);
    }, []);

    const handleSearch = (value: string) => {
        setSearchTitle(value);
        fetchData(1, pagination.pageSize, value);
    };

    const handleTableChange = (pagination: any) => {
        fetchData(pagination.current, pagination.pageSize, searchTitle);
    };

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setEditingCourse(null);
        form.resetFields();
    };

    const showDeleteModal = (id: string) => {
        setCourseToDelete(id);
        setIsDeleteModalVisible(true);
    };

    const handleDeleteCancel = () => {
        setIsDeleteModalVisible(false);
        setCourseToDelete(null);
    };

    const handleDeleteCourse = async () => {
        if (!courseToDelete) return;
        try {
            await deleteCourse(courseToDelete);
            message.success('Xóa khóa học thành công');
            fetchData(pagination.current, pagination.pageSize, searchTitle);
            setIsDeleteModalVisible(false);
            setCourseToDelete(null);
        } catch (error) {
            message.error('Không thể xóa khóa học');
            console.error('Lỗi khi xóa khóa học:', error);
        }
    };

    const handleAddOrUpdateCourse = async (values: any) => {
        const formData = new FormData();
        formData.append('title', values.title);
        formData.append('description', values.description);
        formData.append('startDate', values.startDate.format('YYYY-MM-DD'));
        formData.append('endDate', values.endDate.format('YYYY-MM-DD'));
        formData.append('certification', values.certification);

        if (selectedImage) {
            // @ts-ignore
            formData.append('file', selectedImage.originFileObj);
        }
        try {
            if (editingCourse) {
                await editCourse(editingCourse._id, formData);
            } else {
                await addCourse(formData);
            }

            fetchData(pagination.current, pagination.pageSize, searchTitle);
            setIsModalVisible(false);
            form.resetFields();
        } catch (error) {
            console.error('Không thể thêm hoặc cập nhật khóa học:', error);
        }
    };

    const handleEditCourse = (course: Course) => {
        setEditingCourse(course);
        form.setFieldsValue({
            title: course.title,
            description: course.description,
            startDate: moment(course.start_date),
            endDate: moment(course.end_date),
            certification: course.certification,
        });
        setIsModalVisible(true);
    };

    // @ts-ignore
    const handleImageChange = ({ fileList }) => {
        setSelectedImage(fileList[0]);
    };

    const columns: TableProps<Course>['columns'] = [
        {
            title: 'Tên khóa học',
            dataIndex: 'title',
            key: 'title',
            render: (text) => (text ? <a>{text}</a> : 'Không xác định'),
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
            render: (text) => (text ? text : 'Không xác định'),
        },
        {
            title: 'Hình ảnh',
            key: 'images',
            render: (record) =>
                record.images ? (
                    <img
                        src={record.images[0]}
                        alt={record.title}
                        style={{ width: '100px', maxHeight: '100px' }}
                    />
                ) : (
                    <img
                        src={'/MockData/default-course.jpg'}
                        alt={record.title}
                        style={{ width: '100px', maxHeight: '100px' }}
                    />
                ),
        },
        {
            title: 'Ngày bắt đầu',
            dataIndex: 'start_date',
            key: 'start_date',
            render: (text) => moment(text).format('DD/MM/YYYY'),
        },
        {
            title: 'Ngày kết thúc',
            dataIndex: 'end_date',
            key: 'end_date',
            render: (text) => moment(text).format('DD/MM/YYYY'),
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (record) => (
                <Space size="middle">
                    <Tooltip title="Xem chi tiết">
                        <Link style={{ color: 'black' }} to={`/admin/course/detail/${record._id}`}>
                            <AlignLeftOutlined />
                        </Link>
                    </Tooltip>
                    <Tooltip title="Chỉnh sửa">
                        <EditOutlined onClick={() => handleEditCourse(record)} />
                    </Tooltip>
                    <Tooltip title="Xóa">
                        <DeleteOutlined onClick={() => showDeleteModal(record._id)} />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Space style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between' }}>
                <Search placeholder="Tìm kiếm khóa học" onSearch={handleSearch} enterButton />
                <Button type="primary" onClick={showModal}>
                    Thêm khóa học
                </Button>
            </Space>
            <div style={{ overflow: 'auto' }}>
                <Table<Course>
                    columns={columns}
                    dataSource={data}
                    loading={isLoading}
                    pagination={{
                        current: pagination.current,
                        pageSize: pagination.pageSize,
                        total: pagination.total,
                        onChange: (page, pageSize) => handleTableChange({ current: page, pageSize }),
                    }}
                />
            </div>
            <Modal
                title={editingCourse ? 'Chỉnh sửa khóa học' : 'Thêm khóa học mới'}
                open={isModalVisible}
                onCancel={handleCancel}
                onOk={() => form.submit()}
                okText={editingCourse ? 'Cập nhật' : 'Thêm'}
            >
                <Form form={form} layout="vertical" onFinish={handleAddOrUpdateCourse}>
                    <Form.Item
                        name="title"
                        label="Tên khóa học"
                        rules={[{ required: true, message: 'Vui lòng nhập tên khóa học!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="Mô tả"
                        rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
                    >
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item
                        name="startDate"
                        label="Ngày bắt đầu"
                        rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu!' }]}
                    >
                        <DatePicker />
                    </Form.Item>
                    <Form.Item
                        name="endDate"
                        label="Ngày kết thúc"
                        rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc!' }]}
                    >
                        <DatePicker />
                    </Form.Item>
                    <Form.Item
                        name="certification"
                        label="Chứng nhận"
                        rules={[{ required: true, message: 'Vui lòng nhập thông tin chứng nhận!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="file"
                        label="Hình ảnh minh họa"
                        valuePropName="fileList"
                        getValueFromEvent={(e) => e && e.fileList}
                    >
                        <Upload
                            listType="picture"
                            beforeUpload={() => false}
                            onChange={handleImageChange}
                            maxCount={1}
                        >
                            <Button icon={<UploadOutlined />}>Tải lên</Button>
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                title="Xác nhận xóa"
                open={isDeleteModalVisible}
                onOk={handleDeleteCourse}
                onCancel={handleDeleteCancel}
                okText="Xóa"
                cancelText="Hủy"
            >
                <p>Bạn có chắc chắn muốn xóa khóa học này không?</p>
            </Modal>
        </div>
    );
};

export default ListCourseManagement;
