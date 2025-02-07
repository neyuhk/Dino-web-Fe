import React, { useState } from 'react';
import { Layout } from 'antd';
import { Forum } from '../../model/model.ts'
import { Sidebar } from 'lucide-react'
import ForumHeader from './Post/ForumHeader.tsx'
import PostsList from './Post/PostsList.tsx'

const { Sider, Content } = Layout;

const ForumPage: React.FC = () => {
    const [collapsed, setCollapsed] = useState<boolean>(false);
    const mockPosts: Forum[] = [
        {
            _id: "1",
            title: "Learn Arduino Basics",
            description: "Step-by-step guide for beginners.",
            user_id: { _id: "101", username: "Kim nek", role: "student" },
            like_count: 120,
            view_count: 2000,
            images: ["https://example.com/image1.jpg"],
            createdAt: "2025-01-20",
        },
        {
            _id: "2",
            title: "Master IoT with Arduino",
            description: "Advanced IoT projects with Arduino.",
            user_id: { _id: "102", username: "Huỳn xinh", role: "teacher" },
            like_count: 200,
            view_count: 5000,
            images: ["https://example.com/image2.jpg"],
            createdAt: "2025-01-22",
        },
    ];

    return (
        <Layout className="min-h-screen">
            <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={(value) => setCollapsed(value)}
                className="bg-white"
            >
                <Sidebar collapsed={collapsed} />
            </Sider>
            <Layout>
                <ForumHeader />
                <Content className="p-6 bg-gray-50">
                    <PostsList posts={mockPosts} />
                </Content>
            </Layout>
        </Layout>
    );
};

export default ForumPage;
