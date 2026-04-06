import React, { useId } from 'react';
import styles from './Input.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  icon?: React.ReactNode;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  icon,
  error,
  className = '',
  id,
  ...props
}) => {
  const generatedId = useId();
  const inputId = id || generatedId;

  return (
    <div className={`${styles.wrapper} ${className}`}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      )}

      <div className={`${styles.inputContainer} ${error ? styles.error : ''}`}>
        <label htmlFor={inputId} className={styles.iconLabel}>
          {icon}
        </label>
        <input id={inputId} className={`${styles.input}`} {...props} />
      </div>

      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
};
