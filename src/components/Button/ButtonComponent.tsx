import React from 'react'
import styles from './Button.module.css'

interface ButtonProps {
    label: string
    onClick?: () => void
    variant?: 'primary' | 'secondary' | 'ghost'
    className?: string
}

const ButtonComponent: React.FC<ButtonProps> = ({
    label,
    onClick,
    variant = 'primary',
    className = '',
}) => {
    return (
        <button
            className={`${styles.button} ${styles[variant]} ${className}`}
            onClick={onClick}
        >
            {label}
        </button>
    )
}

export default ButtonComponent
