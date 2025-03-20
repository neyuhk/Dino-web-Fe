import { Layout } from 'antd';
import FooterComponent from '../components/commons/FooterComponent';
import DefaultLayout from './DefaultLayout.tsx'

const { Footer } = Layout;

function TestLayout() {
    return (
        <Layout>
            <div style={{ height: '300px' }}>Content</div>
            <Footer>
                <FooterComponent />
            </Footer>
        </Layout>
    );
}
export default TestLayout