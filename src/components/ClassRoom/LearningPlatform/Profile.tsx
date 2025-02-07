// Profile.tsx
import React from 'react';
import styles from './LearningPlatform.module.css';

const Profile = ({ data }: { data: any[] }) => {
    return (
        <div className={styles.content}>
            <h2 className={styles.title}>Thông tin tài khoản</h2>
            {data.map((profile) => (
                <div key={profile.fullName} className={styles.profileCard}>
                    <p className={styles.profileName}>{profile.fullName}</p>
                    <p className={styles.profileEmail}>{profile.email}</p>
                </div>
            ))}
        </div>
    );
};

export default Profile;
