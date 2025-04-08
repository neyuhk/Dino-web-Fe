import React from "react";
import styles from "./EmptyStateNotification.module.css";

interface EmptyStateProps {
    title: string;
    message: string;
    image: string;
}

const EmptyStateNotification: React.FC<EmptyStateProps> = ({ title, message, image }) => {
    return (
        <div className={styles.emptyStateContainer}>
            <div className={styles.emptyStateContent}>
                <img src={image} alt={title} className={styles.emptyStateImage} />
                <h2 className={styles.emptyStateTitle}>{title}</h2>
                <p className={styles.emptyStateMessage}>{message}</p>
            </div>
        </div>
    );
};

export default EmptyStateNotification;
