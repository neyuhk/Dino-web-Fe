import React from 'react';
import styles from './ButtonGradient.module.css';

interface ButtonGradientProps {
    text: string;
    onClick?: () => void;
    disabled?: boolean;
}

const ButtonGradient: React.FC<ButtonGradientProps> = ({ text, onClick }) => {
    return (
        <div className={styles.borderButton}>
            <button
                onClick={onClick}
                className={styles.gradientButton}
            >
                {text}
            </button>
        </div>

    );
};

export default ButtonGradient;
