import React, { useEffect } from 'react';
import styles from './Toast.module.css';
import { CheckCircle, AlertCircle, Info, X, AlertTriangle } from 'lucide-react';

export interface ToastMessage {
    show: boolean;
    type: 'success' | 'error' | 'info' | 'warning';
    title: string;
    message: string;
}

interface ToastProps {
    type: string;
    toast: ToastMessage;
    onClose: () => void;
    autoClose?: boolean;
    duration?: number;
}

const Toast: React.FC<ToastProps> = ({
                                         toast,
                                         onClose,
                                         autoClose = true,
                                         duration = 3000
                                     }) => {
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (toast.show && autoClose) {
            timer = setTimeout(() => {
                onClose();
            }, duration);
        }
        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [toast.show, autoClose, duration, onClose]);

    if (!toast.show) return null;

    const getIcon = () => {
        switch (toast.type) {
            case 'success':
                return <CheckCircle className={styles.icon} size={20} />;
            case 'error':
                return <AlertCircle className={styles.icon} size={20} />;
            case 'warning':
                return <AlertTriangle className={styles.icon} size={20} />;
            case 'info':
            default:
                return <Info className={styles.icon} size={20} />;
        }
    };

    return (
        <div className={`${styles.toastContainer} ${styles[toast.type]}`}>
            <div className={styles.iconContainer}>{getIcon()}</div>
            <div className={styles.content}>
                {toast.title && <h4 className={styles.title}>{toast.title}</h4>}
                {toast.message && <p className={styles.message}>{toast.message}</p>}
            </div>
            <button className={styles.closeButton} onClick={onClose}>
                <X size={16} />
            </button>
        </div>
    );
};

export default Toast;