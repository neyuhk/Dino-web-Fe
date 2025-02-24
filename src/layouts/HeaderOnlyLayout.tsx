import { Layout } from 'antd'
import React from 'react'
import HeaderComponent from '@/components/commons/HeaderComponent.tsx'
import FooterComponent from '@/components/commons/FooterComponent.tsx'

const { Header, Footer, Content } = Layout

const headerStyle: React.CSSProperties = {
    textAlign: 'center',
    color: '#fff',
    height: 64,
    paddingInline: 48,
    lineHeight: '64px',
    backgroundColor: '#37796F',
}

const contentStyle: React.CSSProperties = {
    textAlign: 'center',
    minHeight: 120,
    lineHeight: '120px',
    color: '#fff',
    backgroundColor: '#F8F9FA',
}

const footerStyle: React.CSSProperties = {
    textAlign: 'center',
    color: '#fff',
    backgroundColor: '#4096ff',
}

const layoutStyle = {
    overflow: 'hidden',
}

// @ts-ignore
const HeaderOnlyLayout = ({ children }) => {
    return (
        <Layout style={layoutStyle}>
            <Header style={headerStyle}>
                <HeaderComponent />
            </Header>
            <Content style={contentStyle}>{ children }</Content>
        </Layout>
    )
}

export default HeaderOnlyLayout