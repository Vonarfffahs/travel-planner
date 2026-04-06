import styles from './Loader.module.css';

interface LoaderProps {
  size?: number | string;
}

export const Loader = ({ size = 18 }: LoaderProps) => {
  return (
    <>
      <svg
        className={styles.loaderIcon}
        style={{ width: size, height: size }}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="3"
          strokeDasharray="32"
          strokeLinecap="round"
          opacity="0.4"
        />
      </svg>
    </>
  );
};
