import React from 'react';
import styles from './Toggle.module.css';

export interface Option {
  label: string;
  value: string;
  description?: string;
}

interface ToggleProps {
  label?: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
}

export const Toggle: React.FC<ToggleProps> = ({
  label,
  options,
  value,
  onChange,
  className = '',
  disabled = false,
}) => {
  return (
    <div
      className={`${styles.wrapper} ${className} ${disabled ? styles.wrapperDisabled : ''}`}
    >
      {label && <label className={styles.label}>{label}</label>}

      <div className={styles.container}>
        {options.map((option) => {
          const isActive = option.value === value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              disabled={disabled}
              className={`${styles.segment} ${isActive ? styles.active : ''} ${disabled ? styles.disabledSegment : ''}`}
            >
              <span className={styles.title}>{option.label}</span>
              {option.description && (
                <span className={styles.description}>{option.description}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
