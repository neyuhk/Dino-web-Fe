import React, { useEffect, useState } from 'react';
import { Space, Table, Input, Button, Modal, Form, Upload, DatePicker, message, Tooltip, Card, Select, Typography, Row, Col } from 'antd';
import type { TableProps } from 'antd';
import { getCourses, addCourse, deleteCourse, editCourse } from '../../../services/course.ts';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { AlignLeftOutlined, DeleteOutlined, EditOutlined, UploadOutlined, FilterOutlined, ReloadOutlined } from '@ant-design/icons';
import { GraduationCap, Loader2 } from 'lucide-react'
import { User } from '../../../model/model.ts'

const { Search } = Input;
const { Title } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
export interface Teacher{
    _id: string;
    username: string;
    avatar: string[];
}
export interface Course {
    _id: string;
    title: string;
    description: string;
    imageUrl: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced';
    startDate: string;
    certification: string
    end_date: string;
    start_date: string;
    createdAt: string;
    images: string[];
    user_id: User;
    teacher_id: Teacher;
}
const ListCourseManagement: React.FC = () => {
    const [data, setData] = useState<Course[]>([]);
    const [originalData, setOriginalData] = useState<Course[]>([]);
    const [isLoading, setLoading] = useState(true);
    const [isActionLoading, setActionLoading] = useState(false);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
    const [searchTitle, setSearchTitle] = useState<string>('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [filterForm] = Form.useForm();
    const [selectedImage, setSelectedImage] = useState(null);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);
    const [courseToDelete, setCourseToDelete] = useState<string | null>(null);
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [uniqueTeachers, setUniqueTeachers] = useState<{id: string, name: string}[]>([]);
    const [filters, setFilters] = useState({
        title: '',
        teacher_id: null,
        dateRange: null,
    });

    const fetchData = async (page: number, perPage: number, title: string) => {
        setLoading(true);
        try {
            const courses = await getCourses(page, perPage, title);
            setOriginalData(courses.data);
            setData(courses.data);
            setPagination({ current: page, pageSize: perPage, total: courses.totalCourses });

            // Extract unique teachers from the courses data
            const teachersList: {id: string, name: string}[] = [];
            const teachersMap = new Map();

            if (Array.isArray(courses.data) && courses.data.length > 0) {
                courses.data.forEach((course: Course) => {
                    if (course.teacher_id && typeof course.teacher_id === 'object' && course.teacher_id._id) {
                        const teacherId = course.teacher_id._id;
                        const teacherName = course.teacher_id.username;

                        if (!teachersMap.has(teacherId)) {
                            teachersMap.set(teacherId, true);
                            teachersList.push({
                                id: teacherId,
                                name: teacherName
                            });
                        }
                    }
                });
            }

            setUniqueTeachers(teachersList);
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
        setActionLoading(true);
        try {
            await deleteCourse(courseToDelete);
            message.success('Xóa khóa học thành công');
            fetchData(pagination.current, pagination.pageSize, searchTitle);
            setIsDeleteModalVisible(false);
            setCourseToDelete(null);
        } catch (error) {
            message.error('Không thể xóa khóa học');
            console.error('Lỗi khi xóa khóa học:', error);
        } finally {
            setActionLoading(false);
        }
    };

    const handleAddOrUpdateCourse = async (values: any) => {
        setActionLoading(true);
        const formData = new FormData();
        formData.append('title', values.title);
        formData.append('description', values.description);
        formData.append('startDate', values.startDate.format('YYYY-MM-DD'));
        formData.append('endDate', values.endDate.format('YYYY-MM-DD'));
        formData.append('certification', values.certification || '');
        formData.append('teacher_id', values.teacher_id || '');

        if (selectedImage) {
            // @ts-ignore
            formData.append('file', selectedImage.originFileObj);
        }
        try {
            if (editingCourse) {
                await editCourse(editingCourse._id, formData);
                message.success('Cập nhật khóa học thành công');
            } else {
                await addCourse(formData);
                message.success('Thêm khóa học thành công');
            }

            fetchData(pagination.current, pagination.pageSize, searchTitle);
            setIsModalVisible(false);
            form.resetFields();
        } catch (error) {
            message.error('Không thể thêm hoặc cập nhật khóa học');
            console.error('Không thể thêm hoặc cập nhật khóa học:', error);
        } finally {
            setActionLoading(false);
        }
    };

    const handleEditCourse = (course: Course) => {
        setEditingCourse(course);

        let teacherId = '';
        if (course.teacher_id) {
            teacherId = typeof course.teacher_id === 'object' ? course.teacher_id._id : course.teacher_id;
        }

        form.setFieldsValue({
            title: course.title,
            description: course.description,
            startDate: moment(course.start_date),
            endDate: moment(course.end_date),
            certification: course.certification,
            teacher_id: teacherId,
        });
        setIsModalVisible(true);
    };

    // @ts-ignore
    const handleImageChange = ({ fileList }) => {
        setSelectedImage(fileList[0]);
    };

    const toggleFilter = () => {
        setIsFilterVisible(!isFilterVisible);
    };

    const applyFilters = (filterValues: any) => {
        if (!Array.isArray(originalData) || originalData.length === 0) {
            return;
        }

        let filteredData = [...originalData];

        // Lọc theo tên khóa học
        if (filterValues.title) {
            const searchTerm = filterValues.title.toLowerCase();
            filteredData = filteredData.filter(course =>
                course && course.title && course.title.toLowerCase().includes(searchTerm)
            );
        }

        // Lọc theo tên giáo viên
        if (filterValues.teacher_id) {
            filteredData = filteredData.filter(course => {
                if (course && course.teacher_id) {
                    if (typeof course.teacher_id === 'object') {
                        return course.teacher_id._id === filterValues.teacher_id;
                    }
                    return course.teacher_id === filterValues.teacher_id;
                }
                return false;
            });
        }

        // Lọc theo khoảng thời gian
        if (filterValues.dateRange && filterValues.dateRange[0] && filterValues.dateRange[1]) {
            const startDate = filterValues.dateRange[0].startOf('day');
            const endDate = filterValues.dateRange[1].endOf('day');

            filteredData = filteredData.filter(course => {
                if (!course || !course.start_date || !course.end_date) {
                    return false;
                }

                const courseStartDate = moment(course.start_date);
                const courseEndDate = moment(course.end_date);

                // Kiểm tra nếu khoảng thời gian của khóa học có giao với khoảng thời gian đã chọn
                return (
                    (courseStartDate.isSameOrAfter(startDate) && courseStartDate.isSameOrBefore(endDate)) ||
                    (courseEndDate.isSameOrAfter(startDate) && courseEndDate.isSameOrBefore(endDate)) ||
                    (courseStartDate.isBefore(startDate) && courseEndDate.isAfter(endDate))
                );
            });
        }

        setData(filteredData);
        setPagination(prev => ({ ...prev, total: filteredData.length }));
    };

    const handleFilterSubmit = (values: any) => {
        setFilters(values);
        applyFilters(values);
    };

    const resetFilters = () => {
        filterForm.resetFields();
        const emptyFilters = {
            title: '',
            teacher_id: null,
            dateRange: null,
        };
        setFilters(emptyFilters);
        setData(originalData);
        setPagination(prev => ({ ...prev, total: originalData.length }));
    };

    const reloadData = () => {
        fetchData(pagination.current, pagination.pageSize, searchTitle);
    };

    const columns: TableProps<Course>['columns'] = [
        {
            title: 'Tên khóa học',
            dataIndex: 'title',
            key: 'title',
            render: (text) => (text ? <a>{text}</a> : 'Không xác định'),
        },
        {
            title: 'Giáo viên',
            key: 'teacher_id',
            render: (record) => {
                if (record && record.teacher_id) {
                    if (typeof record.teacher_id === 'object' && record.teacher_id.username) {
                        return record.teacher_id.username;
                    }
                    return 'Không xác định';
                }
                return 'Không xác định';
            },
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

    const renderLoading = () => (
        <div className={"loadingContainer"} style={{ justifyContent: "flex-start" }}>
            <div className={"loadingSpinner"}>
                <GraduationCap size={32} className={"loadingIcon"} />
            </div>
            <p>Đang tải...</p>
        </div>
    );

    return (
        <div>
            <Card>
                <Row justify="space-between" align="middle" style={{ marginBottom: 20 }}>
                    <Col>
                        <Title level={3}>Quản lý khóa học</Title>
                    </Col>
                    <Col>
                        <Space>
                            <Button
                                icon={<FilterOutlined />}
                                onClick={toggleFilter}
                                type={isFilterVisible ? "primary" : "default"}
                            >
                                {isFilterVisible ? "Ẩn bộ lọc" : "Hiển thị bộ lọc"}
                            </Button>
                            <Button icon={<ReloadOutlined />} onClick={reloadData}>
                                Tải lại dữ liệu
                            </Button>
                        </Space>
                    </Col>
                </Row>

                <Space style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between' }}>
                    <Search
                        placeholder="Tìm kiếm khóa học"
                        onSearch={handleSearch}
                        enterButton
                        style={{ maxWidth: 400 }}
                    />
                    <Button type="primary" onClick={showModal}>
                        Thêm khóa học
                    </Button>
                </Space>

                {isFilterVisible && (
                    <Card
                        size="small"
                        style={{ marginBottom: 16, backgroundColor: '#f9f9f9' }}
                        bodyStyle={{ padding: '16px' }}
                    >
                        <Form
                            form={filterForm}
                            layout="inline"
                            onFinish={handleFilterSubmit}
                            style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}
                        >
                            <Form.Item name="title" label="Tên khóa học" style={{ marginBottom: 8, minWidth: '200px' }}>
                                <Input placeholder="Nhập tên khóa học" />
                            </Form.Item>

                            <Form.Item name="teacher_id" label="Giáo viên" style={{ marginBottom: 8, minWidth: '200px' }}>
                                <Select allowClear placeholder="Chọn giáo viên" style={{ width: '100%' }}>
                                    {Array.isArray(uniqueTeachers) && uniqueTeachers.length > 0 ? (
                                        uniqueTeachers.map(teacher => (
                                            <Option key={teacher.id} value={teacher.id}>{teacher.name}</Option>
                                        ))
                                    ) : (
                                        <Option value="" disabled>Không có giáo viên nào</Option>
                                    )}
                                </Select>
                            </Form.Item>

                            <Form.Item name="dateRange" label="Khoảng thời gian" style={{ marginBottom: 8, minWidth: '300px' }}>
                                <RangePicker
                                    format="DD/MM/YYYY"
                                    placeholder={['Từ ngày', 'Đến ngày']}
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>

                            <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto', marginBottom: 8 }}>
                                <Button htmlType="button" onClick={resetFilters}>
                                    Đặt lại
                                </Button>
                                <Button type="primary" htmlType="submit">
                                    Áp dụng
                                </Button>
                            </div>
                        </Form>
                    </Card>
                )}

                {isLoading ? (
                    renderLoading()
                ) : (
                    <div style={{ overflow: 'auto' }}>
                        <Table<Course>
                            columns={columns}
                            dataSource={data}
                            pagination={{
                                current: pagination.current,
                                pageSize: pagination.pageSize,
                                total: pagination.total,
                                onChange: (page, pageSize) => handleTableChange({ current: page, pageSize }),
                            }}
                        />
                    </div>
                )}
            </Card>

            <Modal
                title={editingCourse ? 'Chỉnh sửa khóa học' : 'Thêm khóa học mới'}
                open={isModalVisible}
                onCancel={handleCancel}
                onOk={() => form.submit()}
                okText={editingCourse ? 'Cập nhật' : 'Thêm'}
                cancelText="Hủy"
                confirmLoading={isActionLoading}
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
                        name="teacher_id"
                        label="Giáo viên"
                        rules={[{ required: true, message: 'Vui lòng chọn giáo viên!' }]}
                    >
                        <Select placeholder="Chọn giáo viên">
                            {Array.isArray(uniqueTeachers) && uniqueTeachers.length > 0 ? (
                                uniqueTeachers.map(teacher => (
                                    <Option key={teacher.id} value={teacher.id}>{teacher.name}</Option>
                                ))
                            ) : (
                                <Option value="" disabled>Không có giáo viên nào</Option>
                            )}
                        </Select>
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
                confirmLoading={isActionLoading}
                okButtonProps={{
                    icon: isActionLoading ? <Loader2 size={20} className="dark-spinner" /> : null
                }}
            >
                <p>Bạn có chắc chắn muốn xóa khóa học này không?</p>
            </Modal>
        </div>
    );
};

export default ListCourseManagement;