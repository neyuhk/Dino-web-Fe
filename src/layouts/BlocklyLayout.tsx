// src/layouts/BlocklyLayout.tsx
import { Layout } from 'antd'
import React from 'react'
import HeaderBlocklyComponent from '../components/commons/HeaderBlocklyComponent.tsx'

const { Header, Content } = Layout

const headerStyle: React.CSSProperties = {
    textAlign: 'center',
    color: '#fff',
    height: 64,
    paddingInline: 48,
    lineHeight: '64px',
    backgroundColor: '#37796F',
}

const contentStyle: React.CSSProperties = {
    flex: 1,
    overflow: 'auto',
}

const layoutStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
}

// @ts-ignore
const BlocklyLayout: React.FC = ({ children }) => {
    return (
        <Layout style={layoutStyle}>
            <Header style={headerStyle}>
                <HeaderBlocklyComponent />
            </Header>
            <Content><div>{children}</div></Content>
        </Layout>
    )
}

export default BlocklyLayout
