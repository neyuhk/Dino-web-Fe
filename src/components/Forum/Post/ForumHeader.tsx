import React from 'react';
import { Layout, Input, Typography } from 'antd';

const { Header } = Layout;
const { Title } = Typography;
const { Search } = Input;

const ForumHeader: React.FC = () => (
    <Header className="bg-white px-4 flex items-center justify-between">
        <Title level={3}>Forum</Title>
        <Search
            placeholder="Tìm kiếm bài viết..."
            className="max-w-md"
            allowClear
            enterButton
        />
    </Header>
);

export default ForumHeader;
