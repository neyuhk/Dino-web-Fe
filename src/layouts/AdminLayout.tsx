import { Breadcrumb, Layout, theme, Button } from 'antd';
import HeaderAdmin from '../components/commons/Admin/HeaderAdmin.tsx';
import SiderAdmin from '../components/commons/Admin/SiderAdmin.tsx';
import { useLocation } from 'react-router-dom';
import React, { useState } from 'react';
import { useSelector } from 'react-redux'
import RequireAuth from '../components/commons/RequireAuth/RequireAuth.tsx'

const { Header, Content, Sider } = Layout;
// @ts-ignore
const AdminLayout = ({ children }) => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const {user} = useSelector((state: any) => state.auth);
    const [collapsed, setCollapsed] = useState(false);

    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };

    const location = useLocation();
    const pathSnippets = location.pathname.split('/').filter(i => i);
    const breadcrumbItems = [
        ...pathSnippets.map((_, index) => {
            let url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
            return { title: url.split('/').pop(), path: url };
        }),
    ];

    if(!user || user.role !== "admin"){
        return (
            <RequireAuth></RequireAuth>
        );
    }

    return (
        <Layout style={{ width: '100%', overflow: 'hidden' }}>
            <Header>
                <HeaderAdmin />
            </Header>
            <Layout>
                <Sider
                    width={200}
                    style={{ background: colorBgContainer }}
                    collapsible
                    collapsed={collapsed}
                    onCollapse={toggleCollapsed}
                >
                    <SiderAdmin />
                </Sider>
                <Layout style={{ padding: '0 24px 24px', overflow: 'auto'}}>
                    <Breadcrumb
                        items={breadcrumbItems}
                        style={{ margin: '16px 0' }}
                    />
                    <Content
                        style={{
                            padding: 24,
                            margin: 0,
                            minHeight: 280,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG, width: '100%'
                        }}
                    >
                        {children}
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default AdminLayout;
