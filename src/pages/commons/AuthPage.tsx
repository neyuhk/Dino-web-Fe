import React, { useState } from 'react';
import {
    Alert,
    Button,
    Card,
    Col,
    Form,
    Input,
    Row,
    Typography,
} from 'antd';
import { GoogleOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { login, register } from '../../services/auth';
// @ts-ignore
import { PATHS } from '@/router/path';
import { getCurrentUserAction, loginAction } from '../../stores/authAction';
import { AppDispatch } from '../../stores';
import styles from '../../pages/commons/styles/AuthPage.module.css'

const { Title, Paragraph } = Typography;

const AuthPage = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [error, setError] = useState('');
    const [isLoginView, setIsLoginView] = useState(true);
    const dispatch: AppDispatch = useDispatch();

    const onFinishLogin = async (values: any) => {
        setError('');
        setSubmitLoading(true);
        try {
            await dispatch(loginAction(values)).unwrap();
            await dispatch(getCurrentUserAction()).unwrap();
            window.location.href = PATHS.HOME;
        } catch (e: any) {
            console.error(e);
            setError(e.message);
        } finally {
            setSubmitLoading(false);
        }
    };

    const onFinishRegister = async (values: any) => {
        setError('');
        setSubmitLoading(true);
        try {
            await register(values);
        } catch (e: any) {
            console.error(e);
            setError(e.message);
        } finally {
            setSubmitLoading(false);
        }
    };

    return (
        <div className={styles.authPage}>
            <div
                className={`${styles.welcome} ${isLoginView ? '' : styles.shiftRight}`}
                style={{
                    backgroundImage: 'url("src/assets/login.png")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    transform: isLoginView ? 'translateX(0)' : 'translateX(100%)',
                    transition: 'transform 0.3s ease-in-out',
                }}
            >
                <div className={styles.container}>
                    <Title className={styles.title}>
                        {isLoginView
                            ? 'Chào mừng bạn quay trở lại'
                            : 'Chào mừng đến với Dino!'}
                    </Title>
                    <Paragraph className={styles.description}>
                        {isLoginView
                            ? 'Đăng nhập để khám phá những bài học thú vị và chơi cùng Dino nhé! Hãy nhanh tay để bắt đầu hành trình học tập của mình.'
                            : 'Bạn chưa có tài khoản? Đăng ký ngay để cùng Dino học hỏi và vui chơi mỗi ngày!'}
                    </Paragraph>
                    <Button
                        type="primary"
                        onClick={() => setIsLoginView(!isLoginView)}
                        className={styles.toggleButton}
                    >
                        {isLoginView ? 'Đăng kí' : 'Đăng nhập'}
                    </Button>
                </div>

            </div>
            <div
                className={`${styles.formContainer} ${isLoginView ? '' : styles.shiftLeft}`}
                style={{
                    backgroundImage: 'url("src/assets/login2.png")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    transform: isLoginView ? 'translateX(0)' : 'translateX(-100%)',
                    transition: 'transform 0.3s ease-in-out',
                }}
            >
                <Card className={styles.formCard}>
                    {error && <Alert message={error} type="error" />}
                    {isLoginView ? (
                        <Form
                            name="login"
                            layout="vertical"
                            initialValues={{ remember: true }}
                            onFinish={onFinishLogin}
                            className={styles.form}
                        >
                            <h2  className={styles.formTitle}>Đăng nhập với Dino</h2>
                            <Button
                                className={styles.googleButton}
                                type="default"
                                style={{
                                    borderColor: 'var(--primary-color)',
                                    color: 'var(--primary-color)',
                                    backgroundColor: 'transparent',
                                }}
                            >
                                <GoogleOutlined />
                                Đăng nhập với Google
                            </Button>
                            <Paragraph className={styles.formOr}>hoặc với tài khoản của bạn</Paragraph>
                            <Form.Item
                                name="email"
                                label="Email"
                                rules={[{ required: true, message: 'Vui lòng nhập email của bạn!' }]}

                            >
                                <Input className={styles.formItem}
                                    allowClear
                                    prefix={<UserOutlined />}
                                    placeholder="Nhập email"
                                />
                            </Form.Item>
                            <Form.Item
                                name="password"
                                label="Mật khẩu"
                                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu của bạn!' }]}
                            >
                                <Input.Password
                                    className={styles.formItem}
                                    allowClear
                                    visibilityToggle={{
                                        visible: passwordVisible,
                                        onVisibleChange: setPasswordVisible,
                                    }}
                                    prefix={<LockOutlined />}
                                    placeholder="Nhập mật khẩu"
                                />
                            </Form.Item>
                            <Form.Item >
                                <Button className={styles.confirmButton}
                                    type="primary"
                                    htmlType="submit"
                                    loading={submitLoading}
                                >
                                    Đăng nhập
                                </Button>
                            </Form.Item>
                            <Paragraph className={styles.forgotPassword}>Quên mật khẩu?</Paragraph>
                        </Form>
                    ) : (
                        <Form
                            name="register"
                            layout="vertical"
                            initialValues={{ remember: true }}
                            onFinish={onFinishRegister}
                            className={styles.form}
                        >
                            <h2 className={styles.formTitle}>Tạo tài khoản mới</h2>
                            <Button
                                className={styles.googleButton}
                                type="default"
                                style={{
                                    borderColor: 'var(--primary-color)',
                                    color: 'var(--primary-color)',
                                    backgroundColor: 'transparent',
                                }}
                            >
                                <GoogleOutlined />
                                Đăng ký với Google
                            </Button>
                            <Form.Item
                                name="username"
                                label="Tên đăng nhập"
                                rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
                            >
                                <Input className={styles.formItem}
                                    allowClear
                                    prefix={<UserOutlined />}
                                    placeholder="Nhập tên đăng nhập"
                                />
                            </Form.Item>
                            <Form.Item
                                name="email"
                                label="Email"
                                rules={[{ required: true, message: 'Vui lòng nhập email của bạn!' }]}

                            >
                                <Input
                                    allowClear
                                    prefix={<UserOutlined />}
                                    placeholder="Nhập email"
                                    style={{ color: 'black' }}
                                />
                            </Form.Item>
                            <Form.Item
                                name="password"
                                label="Mật khẩu"
                                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu của bạn!' }]}

                            >
                                <Input.Password
                                    className={styles.formItem}
                                    allowClear
                                    visibilityToggle={{
                                        visible: passwordVisible,
                                        onVisibleChange: setPasswordVisible,
                                    }}
                                    prefix={<LockOutlined />}
                                    placeholder="Nhập mật khẩu"
                                />
                            </Form.Item>
                            <Form.Item>
                                <Button className={styles.confirmButton}
                                    type="primary"
                                    htmlType="submit"
                                    loading={submitLoading}
                                >
                                    Đăng ký
                                </Button>
                            </Form.Item>

                        </Form>
                    )}
                </Card>
            </div>
        </div>
    )
};

export default AuthPage;
