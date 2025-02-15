import React, { useState } from 'react';
import styles from './AboutMe.module.css';
import { User } from '../../../model/model.ts'

const AboutMe: React.FC<{
    user: User;
    onUpdateUser: (updatedUser: Partial<User>) => void
}> = ({ user, onUpdateUser }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedUser, setEditedUser] = useState<Partial<User>>({
        name: user.name,
        avatar: user.avatar,
        birthday: user.birthday,
    });

    const handleSave = () => {
        onUpdateUser(editedUser);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditedUser({
            name: user.name,
            avatar: user.avatar,
            birthday: user.birthday,
        });
        setIsEditing(false);
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditedUser((prev) => ({
                    ...prev,
                    avatar: reader.result as string,
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className={styles.container}>
            {/*<img className={styles.dinoImg} src={'src/assets/dino-bgr.png'}/>*/}
            <div className={styles.header}>
                <h2>Thẻ học sinh</h2>
                <div className={styles.buttons}>
                    {!isEditing ? (
                        <button
                            className={styles.edit}
                            onClick={() => setIsEditing(true)}
                        >
                            ✏️ Chỉnh sửa
                        </button>
                    ) : (
                        <>
                            <button
                                className={styles.save}
                                onClick={handleSave}
                            >
                                💾 Lưu
                            </button>
                            <button
                                className={styles.cancel}
                                onClick={handleCancel}
                            >
                                ✖️ Huỷ
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className={styles.body}>
                <div className={styles.avatarSection}>
                    {isEditing ? (
                        <>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                style={{ display: 'none' }}
                                id="avatar-upload"
                            />
                            <label htmlFor="avatar-upload">Chọn ảnh mới</label>
                        </>
                    ) : (
                        <img src={user.avatar} alt="User Avatar" />
                    )}
                </div>

                <div className={styles.infoSection}>
                    {isEditing ? (
                        <input
                            type="text"
                            value={editedUser.name}
                            onChange={(e) =>
                                setEditedUser((prev) => ({
                                    ...prev,
                                    name: e.target.value,
                                }))
                            }
                            placeholder="Nhập tên"
                        />
                    ) : (
                        <h3>{user.name}</h3>
                    )}

                    <div className={styles.infoItem}>
                        <img
                            className={styles.icon}
                            src={'src/assets/icon/profile-user.png'}
                            alt="User Avatar"
                        />
                        <span>{user.username}</span>
                    </div>

                    <div className={styles.infoItem}>
                        <img
                            className={styles.icon}
                            src={'src/assets/icon/calendar.png'}
                            alt="User Avatar"
                        />
                        {isEditing ? (
                            <input
                                type="date"
                                value={
                                    editedUser.birthday
                                        ? new Date(editedUser.birthday)
                                              .toISOString()
                                              .split('T')[0]
                                        : ''
                                }
                                onChange={(e) =>
                                    setEditedUser((prev) => ({
                                        ...prev,
                                        birthday: new Date(e.target.value),
                                    }))
                                }
                            />
                        ) : (
                            <span>
                                {new Date(user.birthday).toLocaleDateString()}
                            </span>
                        )}
                    </div>
                </div>

                <div className={styles.footer}>
                    {[
                        { label: 'Email', value: user.email },
                        { label: 'Vai trò', value: user.role },
                        { label: 'Ngày tạo', value: user.createdAt },
                        { label: 'Cập nhật gần nhất', value: user.updatedAt },
                    ].map(({ label, value }, index) => (
                        <div key={index} className={styles.footerItem}>
                            <strong>{label}:</strong>
                            <span>{value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
};

export default AboutMe;
