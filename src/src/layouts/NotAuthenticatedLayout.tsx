import { Layout } from 'antd'
import React from 'react'

const { Content } = Layout

const contentStyle: React.CSSProperties = {
    textAlign: 'center',
    minHeight: '100vh',
    lineHeight: '120px',
    color: 'black',
    backgroundColor: 'transparent',
}

const layoutStyle = {
    overflow: 'hidden',
}

// @ts-ignore
const NotAuthenticatedLayout = ({ children }) => {
    return (
        <Layout style={layoutStyle}>
            <Content style={contentStyle}>{children}</Content>
        </Layout>
    )
}

export default NotAuthenticatedLayout