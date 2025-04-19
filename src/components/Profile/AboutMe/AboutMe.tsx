import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { editUser } from '../../../services/user';
import { PencilIcon, CheckIcon, XIcon, UserIcon, CalendarIcon, PhoneIcon, AtSignIcon, PlusIcon } from 'lucide-react';
import { format } from 'date-fns';

import styles from './AboutMe.module.css';
import { User } from '../../../model/model.ts';
import Toast from '../../commons/Toast/Toast.tsx';
import { putLocalStorage } from '../../../helpers/localStorageHelper.ts';
import { LOCAL_STORAGE_KEYS } from '../../../constants/localStorageKey.ts';

interface ToastMessage {
    show: boolean
    type: 'success' | 'error' | 'info'
    title: string
    message: string
    image?: string
}

interface AboutMeProps {
    onUserUpdate?: (user: User) => void;
}

const AboutMe: React.FC<AboutMeProps> = ({ onUserUpdate }) => {
    const { user } = useSelector((state: any) => state.auth);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<Partial<User>>({
        username: user?.username || '',
        email: user?.email || '',
        birthday: user?.birthday ? new Date(user.birthday) : new Date(),
        phoneNumber: user?.phoneNumber || '',
    });
    const [toast, setToast] = useState<ToastMessage>({
        show: false,
        type: 'info',
        title: '',
        message: '',
    });
    // Avatar handling
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(
        user?.avatar && user.avatar.length > 0 ? user.avatar[0] : null
    );

    // Update local form data when user prop changes
    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username || '',
                email: user.email || '',
                birthday: user.birthday ? new Date(user.birthday) : new Date(),
                phoneNumber: user.phoneNumber || '',
            });
            setAvatarPreview(user.avatar && user.avatar.length > 0 ? user.avatar[0] : null);
        }
    }, [user]);

    const showToast = (
        type: 'success' | 'error' | 'info',
        title: string,
        message: string
    ) => {
        setToast({
            show: true,
            type,
            title,
            message,
        });
    };

    // Close toast
    const hideToast = () => {
        setToast((prev) => ({ ...prev, show: false }));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'birthday' ? new Date(value) : value,
        });
    };

    const handleAvatarClick = () => {
        if (isEditing && fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            showToast('error', 'Lỗi', 'Vui lòng chọn ảnh định dạng JPG, PNG, GIF hoặc WEBP.');
            return;
        }

        // Validate file size (2MB max)
        if (file.size > 2 * 1024 * 1024) {
            showToast('error', 'Lỗi', 'Kích thước ảnh quá lớn. Vui lòng chọn ảnh nhỏ hơn 2MB.');
            return;
        }

        setSelectedAvatar(file);

        // Create a preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setAvatarPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleCancel = () => {
        // Reset form data to original user data
        setFormData({
            username: user?.username || '',
            email: user?.email || '',
            birthday: user?.birthday ? new Date(user.birthday) : new Date(),
            phoneNumber: user?.phoneNumber || '',
        });

        // Reset avatar preview
        setSelectedAvatar(null);
        setAvatarPreview(user?.avatar && user.avatar.length > 0 ? user.avatar[0] : null);

        setIsEditing(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Create FormData for file upload support
            const data = new FormData();

            // Add form fields to FormData
            Object.entries(formData).forEach(([key, value]) => {
                if (key === 'birthday' && value instanceof Date) {
                    data.append(key, value.toISOString());
                } else if (value !== undefined && value !== null) {
                    data.append(key, String(value));
                }
            });

            // Include user ID
            data.append('userId', user._id);

            // Add avatar if selected
            if (selectedAvatar) {
                data.append('avatar', selectedAvatar);
            }

            // Call the API to update user data
            const response = await editUser(data);
            const updatedUser = response.data.data;
            console.log('Updated user:', updatedUser);

            // Save to local storage
            putLocalStorage(LOCAL_STORAGE_KEYS.INFO, JSON.stringify(updatedUser));

            // Update parent component and Redux store if callback provided
            if (onUserUpdate) {
                onUserUpdate(updatedUser);
            }

            // Show success message
            showToast('success', 'Thành công', 'Thông tin cá nhân đã được cập nhật!');

            // Exit edit mode
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating user profile:', error);
            showToast('error', 'Lỗi', 'Không thể cập nhật thông tin. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    // Format birthday for display
    const formatBirthday = (date: Date | string | undefined) => {
        if (!date) return 'Chưa cập nhật';
        try {
            return format(new Date(date), 'dd/MM/yyyy');
        } catch (error) {
            return 'Ngày không hợp lệ';
        }
    };

    // Format birthday for input field
    const formatBirthdayForInput = (date: Date | string | undefined) => {
        if (!date) return '';
        try {
            return format(new Date(date), 'yyyy-MM-dd');
        } catch (error) {
            return '';
        }
    };

    if (!user) {
        return (
            <div className={styles.noUser}>
                <UserIcon size={48} />
                <h2>Bạn chưa đăng nhập</h2>
                <p>Vui lòng đăng nhập để xem thông tin cá nhân</p>
            </div>
        );
    }

    return (
        <div className={styles.aboutMeContainer}>
            <div className={styles.profileCard}>
                <div className={styles.profileHeader}>
                    <div
                        className={`${styles.avatarContainer} ${isEditing ? styles.editAvatar : ''}`}
                        onClick={handleAvatarClick}
                    >
                        {avatarPreview ? (
                            <img
                                src={avatarPreview}
                                alt={`Avatar của ${user.username}`}
                                className={styles.avatar}
                            />
                        ) : (
                            <div className={styles.defaultAvatar}>
                                <UserIcon size={64} />
                            </div>
                        )}

                        {isEditing && (
                            <div className={styles.avatarOverlay}>
                                <PlusIcon size={24} />
                                <span>Đổi ảnh</span>
                            </div>
                        )}

                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleAvatarChange}
                            accept="image/jpeg,image/png,image/gif,image/webp"
                            className={styles.fileInput}
                        />
                    </div>

                    <div className={styles.headerInfo}>
                        <h1 className={styles.username}>{user.username}</h1>
                        <p className={styles.role}>{user.role === 'user' ? 'Học sinh' : user.role === 'teacher' ? 'Giáo viên' : user.role === 'admin' ? 'Admin' : 'Người dùng'}</p>
                    </div>

                    {!isEditing && (
                        <button
                            className={styles.editButton}
                            onClick={() => setIsEditing(true)}
                            aria-label="Chỉnh sửa thông tin"
                        >
                            <PencilIcon size={18} />
                            <span>Chỉnh sửa</span>
                        </button>
                    )}
                </div>

                {isEditing ? (
                    <form onSubmit={handleSubmit} className={styles.editForm}>
                        <div className={styles.formGroup}>
                            <label htmlFor="username" className={styles.label}>
                                <UserIcon size={16} />
                                <span>Tên người dùng</span>
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                value={formData.username}
                                onChange={handleInputChange}
                                className={styles.input}
                                placeholder="Nhập tên người dùng"
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="email" className={styles.label}>
                                <AtSignIcon size={16} />
                                <span>Email</span>
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className={`${styles.input} ${styles.disabledInput}`}
                                placeholder="Nhập email"
                                required
                                disabled // Disable the email field
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="birthday" className={styles.label}>
                                <CalendarIcon size={16} />
                                <span>Ngày sinh</span>
                            </label>
                            <input
                                id="birthday"
                                name="birthday"
                                type="date"
                                value={formatBirthdayForInput(formData.birthday)}
                                onChange={handleInputChange}
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="phoneNumber" className={styles.label}>
                                <PhoneIcon size={16} />
                                <span>Số điện thoại</span>
                            </label>
                            <input
                                id="phoneNumber"
                                name="phoneNumber"
                                type="tel"
                                value={formData.phoneNumber}
                                onChange={handleInputChange}
                                className={styles.input}
                                placeholder="Nhập số điện thoại"
                            />
                        </div>

                        <div className={styles.formActions}>
                            <button
                                type="button"
                                className={styles.cancelButton}
                                onClick={handleCancel}
                                disabled={loading}
                            >
                                <XIcon size={16} />
                                <span>Hủy</span>
                            </button>
                            <button
                                type="submit"
                                className={styles.saveButton}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className={styles.loadingSpinner}></span>
                                        <span>Đang lưu...</span>
                                    </>
                                ) : (
                                    <>
                                        <CheckIcon size={16} />
                                        <span>Lưu thay đổi</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className={styles.profileInfo}>
                        <div className={styles.infoItem}>
                            <div className={styles.infoLabel}>
                                <AtSignIcon size={16} />
                                <span>Email</span>
                            </div>
                            <div className={styles.infoValue}>{user.email || 'Chưa cập nhật'}</div>
                        </div>

                        <div className={styles.infoItem}>
                            <div className={styles.infoLabel}>
                                <CalendarIcon size={16} />
                                <span>Ngày sinh</span>
                            </div>
                            <div className={styles.infoValue}>{formatBirthday(user.birthday)}</div>
                        </div>

                        <div className={styles.infoItem}>
                            <div className={styles.infoLabel}>
                                <PhoneIcon size={16} />
                                <span>Số điện thoại</span>
                            </div>
                            <div className={styles.infoValue}>{user.phoneNumber || 'Chưa cập nhật'}</div>
                        </div>

                        <div className={styles.infoItem}>
                            <div className={styles.infoLabel}>
                                <UserIcon size={16} />
                                <span>Thành viên từ</span>
                            </div>
                            <div className={styles.infoValue}>
                                {user.createdAt ? format(new Date(user.createdAt), 'dd/MM/yyyy') : 'Không có thông tin'}
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {/* Toast notification */}
            {toast.show && <Toast toast={toast} onClose={hideToast} type={''} />}
        </div>
    );
};

export default AboutMe;
