import React from 'react';
import styles from './Button.module.css';
import { Loader } from '../Loader';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'custom';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const buttonClasses = [styles.button, styles[variant], className]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      className={buttonClasses}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <>
          <Loader />
          <span>&nbsp;</span>
        </>
      )}

      {/* Текст кнопки */}
      {children}
    </button>
  );
};
