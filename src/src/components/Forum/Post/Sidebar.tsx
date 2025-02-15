import React from 'react';
import { Menu } from 'antd';
import {
    HomeFilled,
    UserOutlined,
    HeartFilled,
    CommentOutlined,
    RetweetOutlined
} from '@ant-design/icons';

const Sidebar: React.FC<{ collapsed?: boolean }> = ({ collapsed = false }) => {
    const menuItems = [
        { key: 'home', icon: <HomeFilled />, label: 'Trang chủ' },
        { key: 'my-posts', icon: <UserOutlined />, label: 'Bài viết của tôi' },
        { key: 'liked', icon: <HeartFilled />, label: 'Bài viết đã thích' },
        { key: 'commented', icon: <CommentOutlined />, label: 'Bài viết đã bình luận' },
        { key: 'shared', icon: <RetweetOutlined />, label: 'Bài viết đã đăng lại' },
    ];

    return (
        <Menu
            mode="inline"
            defaultSelectedKeys={['home']}
            items={menuItems}
            className="h-full"
        />
    );
};

export default Sidebar;
