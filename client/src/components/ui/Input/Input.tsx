import React, { useId, useState } from 'react';
import styles from './Input.module.css';
import { Eye, EyeClosed } from 'lucide-react';

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
  type,
  ...props
}) => {
  const generatedId = useId();
  const inputId = id || generatedId;

  const [showPassword, setShowPassword] = useState(false);

  const isPasswordType = type === 'password';

  const inputType = isPasswordType
    ? showPassword
      ? 'text'
      : 'password'
    : type;

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className={`${styles.wrapper} ${className}`}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      )}

      <div className={`${styles.inputContainer} ${error ? styles.error : ''}`}>
        {icon && (
          <label htmlFor={inputId} className={styles.iconLabel}>
            {icon}
          </label>
        )}

        <input
          id={inputId}
          type={inputType}
          className={styles.input}
          {...props}
        />

        {isPasswordType && (
          <button
            type="button"
            className={styles.toggleButton}
            onClick={togglePasswordVisibility}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <Eye /> : <EyeClosed />}
          </button>
        )}
      </div>

      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
};
