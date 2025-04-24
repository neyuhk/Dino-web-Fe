import React, { useEffect, useState } from 'react'
import { Space, Table, Input, Button, message, Tooltip, Pagination } from 'antd'
import type { TableProps } from 'antd'
import { deleteForum, getForumAdmin } from '../../../services/forum.ts'
import { Forum } from '../../../model/model.ts'
import { Link } from 'react-router-dom'
import moment from 'moment'
import { AlignLeftOutlined, DeleteOutlined } from '@ant-design/icons'

const { Search } = Input

const ListForumManagement: React.FC = () => {
    const [data, setData] = useState<Forum[]>([])
    const [isLoading, setLoading] = useState(true)
    const [filteredData, setFilteredData] = useState<Forum[]>([])
    const [page, setPage] = useState(1)
    const [perPage, setPerPage] = useState(10)
    const [total, setTotal] = useState(0)
    const [searchName, setSearchName] = useState('')

    useEffect(() => {
        fetchData(page, perPage, searchName)
    }, [page, perPage, searchName])

    const fetchData = async (page: number, perPage: number, name: string) => {
        setLoading(true)
        try {
            const forums = await getForumAdmin(page, perPage, name)
            setData(forums.data)
            setFilteredData(forums.data)
            setTotal(forums.total) // Assuming the API returns the total count
        } catch (error) {
            message.error('Failed to fetch forums')
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
            message.success('Forum deleted successfully')
            fetchData(page, perPage, searchName)
        } catch (error) {
            message.error('Failed to delete forum')
            console.error('Failed to delete forum:', error)
        }
    }

    const columns: TableProps<Forum>['columns'] = [
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
            dataIndex: 'images',
            key: 'images',
            render: (record) => record ? <img src={record[0]} alt="forum" style={{ width: '100px' }} /> : 'Unknown',
        },
        {
            title: 'User',
            dataIndex: ['user_id', 'username'],
            key: 'user',
            render: (text) => text ? <a>{text}</a> : 'Unknown',
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (text) => moment(text).format('DD/MM/YYYY'),
        },
        {
            title: 'Action',
            key: 'action',
            render: (record) => (
                <Space size="middle">
                    <Tooltip title="View">
                        <Link style={{ color: 'black' }} to={`/admin/forum/detail/${record._id}`}><AlignLeftOutlined /></Link>
                    </Tooltip>
                    <Tooltip title="Delete">
                        <DeleteOutlined onClick={() => handleDeleteForum(record._id)} />
                    </Tooltip>
                </Space>
            ),
        },
    ]

    return (
        <div>
            <Space style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between' }}>
                <Search
                    placeholder="Search forums by name"
                    onSearch={handleSearch}
                    enterButton
                />
                <Button type="primary" onClick={() => { /* Add forum logic here */
                }}>
                    Add Forum
                </Button>
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
            />
        </div>
    )
}

export default ListForumManagement
