import { Layout } from 'antd'
import React from 'react'
import { useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import FooterComponent from '../components/commons/FooterComponent.tsx'
import HeaderComponent from '../components/commons/HeaderComponent.tsx'

const { Header, Footer, Content } = Layout

const headerStyle: React.CSSProperties = {
    textAlign: 'center',
    color: '#fff',
    height: 64,
    paddingInline: 48,
    lineHeight: '64px',
    backgroundColor: '#37796F',
    width: '100%',
}

const contentStyle: React.CSSProperties = {
    textAlign: 'center',
    minHeight: 120,
    lineHeight: '120px',
    color: '#fff',
    // backgroundColor: '#0958d9',
}

const footerStyle: React.CSSProperties = {
    textAlign: 'center',
    width: '100%',
    padding: '20px 0'
}

const layoutStyle = {
    overflow: 'hidden',
}

// @ts-ignore
const DefaultLayout = ({ children }) => {
    const location = useLocation();

    return (
        <Layout style={layoutStyle}>
            <Header style={headerStyle}>
                <HeaderComponent />
            </Header>
            <Content style={contentStyle}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        className="page-content"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>
            </Content>
            <Footer style={footerStyle}>
                <FooterComponent />
            </Footer>
        </Layout>
    )
}

export default DefaultLayout