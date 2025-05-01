import React, { useEffect, useState } from 'react'
import { Space, Table, Input, Button, message, Tooltip, Pagination, Drawer } from 'antd'
import type { TableProps } from 'antd'
import { deleteForum, getForumAdmin, getForumById } from '../../../services/forum.ts'
import { Forum } from '../../../model/model.ts'
import moment from 'moment'
import { AlignLeftOutlined, DeleteOutlined } from '@ant-design/icons'
import ForumDetail from './ForumDetail.tsx'

const { Search } = Input

const ListForumManagement: React.FC = () => {
    const [data, setData] = useState<Forum[]>([])
    const [isLoading, setLoading] = useState(true)
    const [filteredData, setFilteredData] = useState<Forum[]>([])
    const [page, setPage] = useState(1)
    const [perPage, setPerPage] = useState(10)
    const [total, setTotal] = useState(0)
    const [searchName, setSearchName] = useState('')
    const [drawerVisible, setDrawerVisible] = useState(false)
    const [selectedForumId, setSelectedForumId] = useState<string | null>(null)

    useEffect(() => {
        fetchData(page, perPage, searchName)
    }, [page, perPage, searchName])

    const fetchData = async (page: number, perPage: number, name: string) => {
        setLoading(true)
        try {
            const forums = await getForumAdmin(page, perPage, name)
            setData(forums.data)
            setFilteredData(forums.data)
            setTotal(forums.total)
        } catch (error) {
            message.error('Không thể tải dữ liệu diễn đàn')
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = (value: string) => {
        setSearchName(value)
    }

    const handleDeleteForum = async (id: string) => {
        try {
            await deleteForum(id)
            message.success('Đã xóa diễn đàn thành công')
            fetchData(page, perPage, searchName)
        } catch (error) {
            message.error('Không thể xóa diễn đàn')
            console.error('Không thể xóa diễn đàn:', error)
        }
    }

    const showDrawer = (id: string) => {
        setSelectedForumId(id)
        setDrawerVisible(true)
    }

    const closeDrawer = () => {
        setDrawerVisible(false)
        setSelectedForumId(null)
    }

    const columns: TableProps<Forum>['columns'] = [
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            key: 'title',
            render: (text) => text ? <a>{text}</a> : 'Không xác định',
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
            render: (text) => text ? text : 'Không xác định',
            ellipsis: true,
        },
        {
            title: 'Hình ảnh',
            dataIndex: 'images',
            key: 'images',
            render: (record) => record ? <img src={record[0]} alt="forum" style={{ width: '100px', height: '60px', objectFit: 'cover' }} /> : 'Không có',
        },
        {
            title: 'Người tạo',
            dataIndex: ['user_id', 'username'],
            key: 'user',
            render: (text) => text ? <a>{text}</a> : 'Không xác định',
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (text) => moment(text).format('DD/MM/YYYY'),
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (record) => (
                <Space size="middle">
                    <Tooltip title="Xem chi tiết">
                        <AlignLeftOutlined onClick={() => showDrawer(record._id)} style={{ cursor: 'pointer' }} />
                    </Tooltip>
                    <Tooltip title="Xóa">
                        <DeleteOutlined onClick={() => handleDeleteForum(record._id)} style={{ cursor: 'pointer' }} />
                    </Tooltip>
                </Space>
            ),
        },
    ]

    return (
        <div>
            <Space style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between' }}>
                <Search
                    placeholder="Tìm kiếm diễn đàn theo tên"
                    onSearch={handleSearch}
                    enterButton
                />
            </Space>
            <div style={{ overflow: 'auto' }}>
                <Table<Forum>
                    columns={columns}
                    dataSource={filteredData}
                    loading={isLoading}
                    rowKey="_id"
                    pagination={false}
                />
            </div>
            <Pagination
                current={page}
                pageSize={perPage}
                total={total}
                onChange={(page, pageSize) => {
                    setPage(page)
                    setPerPage(pageSize)
                }}
                style={{ marginTop: 16, textAlign: 'right' }}
                showSizeChanger
                showQuickJumper
                showTotal={(total) => `Tổng cộng ${total} mục`}
            />

            <Drawer
                title="Chi tiết diễn đàn"
                placement="right"
                width={720}
                onClose={closeDrawer}
                open={drawerVisible}
                bodyStyle={{ paddingBottom: 80 }}
            >
                {selectedForumId && <ForumDetail forumId={selectedForumId} />}
            </Drawer>
        </div>
    )
}

export default ListForumManagement