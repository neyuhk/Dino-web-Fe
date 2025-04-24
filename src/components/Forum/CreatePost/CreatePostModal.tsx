// CreatePostModal.tsx
import React, { useState, useRef } from 'react';
import { X, ImagePlus, Loader2, AlertCircle } from 'lucide-react'
import styles from './CreatePostModal.module.css';
import { newForum } from '../../../services/forum.ts'
import { message } from 'antd'
import Toast, { ToastMessage } from '../../commons/Toast/Toast.tsx'

interface CreatePostModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string;
    onSuccess?: () => void;
}

interface CreatePostData {
    title: string;
    description: string;
    userId: string;
    image?: File;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({
                                                             isOpen,
                                                             onClose,
                                                             userId,
                                                             onSuccess
                                                         }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const MAX_IMAGE_SIZE = 4.9 * 1024 * 1024;
    const [toast, setToast] = useState<ToastMessage>({
        show: false,
        type: 'info',
        title: '',
        message: '',
    })

    if (!isOpen) return null;

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setImage(null);
        setImagePreview('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };
    const hideToast = () => {
        setToast(prev => ({ ...prev, show: false }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setToast({
            show: false,
            type: 'success',
            title: 'Thành công',
            message: '',
        });

        try {
            // Kiểm tra dữ liệu đầu vào
            if (!title.trim()) {
                throw new Error("Vui lòng nhập tiêu đề cho bài viết");
            }

            if (!description.trim()) {
                throw new Error("Vui lòng nhập nội dung cho bài viết");
            }

            // Kiểm tra kích thước ảnh trước khi gửi
            if (image && image.size > MAX_IMAGE_SIZE) {
                setToast({
                    show: true,
                    type: 'error',
                    title: 'Ảnh quá lớn',
                    message: 'Kích thước ảnh quá lớn. Vui lòng chọn ảnh nhỏ hơn.',
                });
                return; // Dừng lại không gửi ảnh lên server
            }

            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            formData.append('userId', userId);
            if (image) {
                formData.append('image', image);
            }

            await newForum(formData);

            // Hiển thị thông báo thành công
            message.success('Đăng bài viết thành công!');

            setTitle('');
            setDescription('');
            setImage(null);
            setImagePreview('');
            onSuccess?.();
            onClose();
        } catch (error) {
            // Hiển thị thông báo lỗi chung
            setToast({
                show: true,
                type: 'error',
                title: 'Đã có lỗi xảy ra',
                message: 'Vui lòng thử lại sau.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h2>Tạo bài viết mới</h2>
                    <button
                        onClick={onClose}
                        className={styles.closeButton}
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="title">Tiêu đề</label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Nhập tiêu đề bài viết"
                            required
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="description">Nội dung</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Chia sẻ suy nghĩ của bạn..."
                            required
                            rows={4}
                        />
                    </div>

                    <div className={styles.imageUpload}>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className={styles.fileInput}
                            id="image-upload"
                        />

                        {!imagePreview ? (
                            <label htmlFor="image-upload" className={styles.uploadLabel}>
                                <ImagePlus size={24} />
                                <span>Thêm ảnh</span>
                            </label>
                        ) : (
                            <div className={styles.imagePreviewContainer}>
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className={styles.imagePreview}
                                />
                                <button
                                    type="button"
                                    onClick={handleRemoveImage}
                                    className={styles.removeImage}
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        )}
                    </div>

                    <div className={styles.actions}>
                        <button
                            type="button"
                            onClick={onClose}
                            className={styles.cancelButton}
                            disabled={isLoading}
                        >
                            Huỷ
                        </button>
                        <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={20} className={styles.spinner} />
                                    Đang đăng...
                                </>
                            ) : (
                                'Đăng bài'
                            )}
                        </button>
                    </div>
                </form>
            </div>
            {/* Toast notification */}
            {toast.show && <Toast toast={toast} onClose={hideToast} type={''} />}

        </div>
    );
};

export default CreatePostModal;