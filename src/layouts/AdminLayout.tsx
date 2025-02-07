import { Breadcrumb, Layout, theme, Button } from 'antd';
import HeaderAdmin from '../components/commons/Admin/HeaderAdmin.tsx';
import SiderAdmin from '../components/commons/Admin/SiderAdmin.tsx';
import { useLocation } from 'react-router-dom';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { useState } from 'react';

const { Header, Content, Sider } = Layout;

const siderStyle: React.CSSProperties = {
    overflow: 'auto',
    height: '100vh',
    position: 'fixed',
    insetInlineStart: 0,
    top: 0,
    bottom: 0,
    scrollbarWidth: 'thin',
    scrollbarGutter: 'stable',
};

// @ts-ignore
const AdminLayout = ({ children }) => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

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
