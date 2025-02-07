import React, { CSSProperties, useMemo } from 'react';
// @ts-ignore
import { COLORS } from '@/constants/color.ts';

interface IconButtonProps {
    customStyle?: () => Record<string, string>;
    icon?: string;
    title?: string;
    color?: string;
    size?: string;
    clickable?: boolean;
    disabled?: boolean;
    onClick?: () => void;
}

const FAIcon: React.FC<IconButtonProps> = ({
                                                   customStyle = () => ({}),
                                                   icon = 'fas fa-question',
                                                   title = '',
                                                   color = COLORS.BLACK,
                                                   size = 'inherit',
                                                   clickable = true,
                                                   disabled = false,
                                                   onClick,
                                               }) => {
    const cursor = useMemo(
        () => (title && clickable && !disabled ? 'pointer' : 'unset'),
        [title, clickable, disabled]
    );

    const displayColor = useMemo(
        () => (disabled ? COLORS.DISABLED : `${color} !important`),
        [disabled, color]
    );

    const displayTitle = useMemo(
        () => (title && disabled ? 'Bạn không có quyền thực hiện chức năng này' : title),
        [title, disabled]
    );

    const fontSize = useMemo(() => size, [size]);

    const handleClick = () => {
        if (!disabled && onClick) onClick();
    };

    const customStyles = {
        color: displayColor,
        cursor,
        ...customStyle(),
    } as CSSProperties;

    return (
        <span
            className={`icon ${disabled ? 'disabled' : 'enabled'}`}
            onClick={handleClick}
            style={customStyles}
        >
      {displayTitle ? (
          <div title={displayTitle}>
              <i className={icon} style={{ fontSize, color: displayColor }} />
          </div>
      ) : (
          <i className={icon} style={{ fontSize, color: displayColor }} />
      )}
    </span>
    );
};

export default FAIcon;
