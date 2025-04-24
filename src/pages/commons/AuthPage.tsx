import React, { useState, useEffect } from 'react';
import {
    Alert,
    Button,
    Card,
    Form,
    Input, message,
    Typography,
} from 'antd'
import { GoogleOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { login, register } from '../../services/auth';
// @ts-ignore
import { PATHS } from '@/router/path';
import { getCurrentUserAction, loginAction } from '../../stores/authAction';
import { AppDispatch } from '../../stores';
import styles from '../../pages/commons/styles/AuthPage.module.css'
import { PATHS_ADMIN } from '../../router/path.ts'
import loginBgr from '../../assets/login.png'
import loginBgr2 from '../../assets/login2.png'

const { Title, Paragraph } = Typography;

const AuthPage = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [error, setError] = useState('');
    const [isLoginView, setIsLoginView] = useState(true);
    const [isAnimating, setIsAnimating] = useState(false);
    const dispatch: AppDispatch = useDispatch();

    // Reset animation flag
    useEffect(() => {
        if (isAnimating) {
            const timer = setTimeout(() => {
                setIsAnimating(false);
            }, 500); // Match transition duration
            return () => clearTimeout(timer);
        }
    }, [isAnimating]);

    const toggleView = () => {
        setIsAnimating(true);
        setIsLoginView(!isLoginView);
    };

    const onFinishLogin = async (values: any) => {
        setError('');
        setSubmitLoading(true);
        try {
            await dispatch(loginAction(values)).unwrap();
            message.success('Đăng nhập thành công!');
            const curUser = await dispatch(getCurrentUserAction()).unwrap();
            if (curUser.role === 'admin') {
                window.location.href = PATHS_ADMIN.HOME;
                return;
            }
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
            message.success('Đăng ký thành công! Vui lòng đăng nhập.');
            setIsLoginView(true);
        } catch (e: any) {
            console.error(e);
            setError(e.message);
        } finally {
            setSubmitLoading(false);
        }
    };

    // Email validation rules
    const validateEmail = (rule: any, value: string) => {
        if (!value) {
            return Promise.reject('Vui lòng nhập email của bạn!');
        }

        // Regular expression for general email format and educational domains
        const emailRegex = /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9.-]+\.(edu|edu\.[a-zA-Z]{2}|ac\.[a-zA-Z]{2})|[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;

        if (!emailRegex.test(value)) {
            return Promise.reject('Email không hợp lệ! Vui lòng kiểm tra lại.');
        }
        return Promise.resolve();
    };

    // Password validation rules
    // const validatePassword = (rule: any, value: string) => {
    //     if (!value) {
    //         return Promise.reject('Vui lòng nhập mật khẩu của bạn!');
    //     }
    //
    //     if (value.length < 8) {
    //         return Promise.reject('Mật khẩu phải có ít nhất 8 ký tự!');
    //     }
    //
    //     // Check for at least one special character
    //     const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    //     if (!specialCharRegex.test(value)) {
    //         return Promise.reject('Mật khẩu phải chứa ít nhất một ký tự đặc biệt!');
    //     }
    //
    //     return Promise.resolve();
    // };

    return (
        <div className={styles.authPage}>
            <div
                className={`${styles.welcome} ${!isLoginView ? styles.shiftRight : ''}`}
                style={{
                    backgroundImage: `url(${loginBgr})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
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
                        onClick={toggleView}
                        className={styles.toggleButton}
                        disabled={isAnimating}
                    >
                        {isLoginView ? 'Đăng ký' : 'Đăng nhập'}
                    </Button>
                </div>
            </div>
            <div
                className={`${styles.formContainer} ${!isLoginView ? styles.shiftLeft : ''}`}
                style={{
                    backgroundImage: `url(${loginBgr2})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <Card className={styles.formCard}>
                    {error && <Alert message={error} type="error" style={{ marginBottom: '1rem' }} />}
                    {isLoginView ? (
                        <Form
                            name="login"
                            layout="vertical"
                            initialValues={{ remember: true }}
                            onFinish={onFinishLogin}
                            className={styles.form}
                        >
                            <h2 className={styles.formTitle}>Đăng nhập với Dino</h2>
                            <Button
                                className={styles.googleButton}
                                type="default"
                                icon={<GoogleOutlined />}
                            >
                                Đăng nhập với Google
                            </Button>
                            <div className={styles.formOr}>hoặc với tài khoản của bạn</div>
                            <Form.Item
                                name="email"
                                label="Email"
                                rules={[{ validator: validateEmail }]}
                                validateTrigger={['onChange', 'onBlur']}
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
                                // rules={[{ validator: validatePassword }]}
                                validateTrigger={['onChange', 'onBlur']}
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
                                    Đăng nhập
                                </Button>
                            </Form.Item>
                            <div className={styles.forgotPassword}>Quên mật khẩu?</div>
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
                                icon={<GoogleOutlined />}
                            >
                                Đăng ký với Google
                            </Button>
                            <div className={styles.formOr}>hoặc với tài khoản của bạn</div>
                            <Form.Item
                                name="username"
                                label="Tên người dùng"
                                rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
                            >
                                <Input className={styles.formItem}
                                       allowClear
                                       prefix={<UserOutlined />}
                                       placeholder="Nhập tên người dùng"
                                />
                            </Form.Item>
                            <Form.Item
                                name="email"
                                label="Email"
                                rules={[{ validator: validateEmail }]}
                                validateTrigger={['onChange', 'onBlur']}
                            >
                                <Input
                                    className={styles.formItem}
                                    allowClear
                                    prefix={<UserOutlined />}
                                    placeholder="Nhập email"
                                />
                            </Form.Item>
                            <Form.Item
                                name="password"
                                label="Mật khẩu"
                                // rules={[{ validator: validatePassword }]}
                                validateTrigger={['onChange', 'onBlur']}
                                help="Mật khẩu phải có ít nhất 8 ký tự và chứa ít nhất 1 ký tự đặc biệt"
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