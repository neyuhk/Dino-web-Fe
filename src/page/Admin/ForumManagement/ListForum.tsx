import React, { useEffect, useState } from 'react'
import { Space, Table, Input, Button, message, Tooltip } from 'antd'
import type { TableProps } from 'antd'
import { deleteForum, getForums } from '../../../services/forum.ts'
import { Forum } from '../../../model/model.ts'
import { Link } from 'react-router-dom'
import moment from 'moment'
import { AlignLeftOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons'

const { Search } = Input

const ListForumManagement: React.FC = () => {
    const [data, setData] = useState<Forum[]>([])
    const [isLoading, setLoading] = useState(true)
    const [filteredData, setFilteredData] = useState<Forum[]>([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const forums = await getForums()
                setLoading(false)
                setData(forums.data)
                setFilteredData(forums.data)
            } catch (error) {
                message.error('Failed to fetch forums')
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    const handleSearch = (value: string) => {
        const filtered = data.filter(forum =>
            forum.title.toLowerCase().includes(value.toLowerCase()) ||
            forum.description.toLowerCase().includes(value.toLowerCase()),
        )
        setFilteredData(filtered)
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
                    {/*<Tooltip title="Edit">*/}
                    {/*    <EditOutlined onClick={() => handleEditForum(record)} />*/}
                    {/*</Tooltip>*/}
                    <Tooltip title="Delete">
                        <DeleteOutlined onClick={() => handleDeleteForum(record._id)} />
                    </Tooltip>
                </Space>
            ),
        },
    ]

    const handleDeleteForum = async (id: string) => {
        try {
            await deleteForum(id)
            message.success('Forum deleted successfully')
            const forums = await getForums()
            setData(forums.data)
            setFilteredData(forums.data)
        } catch (error) {
            message.error('Failed to delete forum')
            console.error('Failed to delete forum:', error)
        }
    }

    return (
        <div>
            <Space style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between' }}>
                <Search
                    placeholder="Search forums"
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
                />
            </div>
        </div>
    )
}

export default ListForumManagement
