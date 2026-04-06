import styles from './Sidebar.module.css';

interface SidebarProps extends React.BaseHTMLAttributes<HTMLDivElement> {
  sideBarTitle?: React.ReactNode;
  icon?: React.ReactNode;
  isHidden?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  children,
  className = '',
  sideBarTitle,
  icon,
  isHidden,
  ...props
}) => {
  const sidebarClasses = [
    styles.sidebar,
    isHidden ? styles.hidden : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <aside className={sidebarClasses} {...props}>
      <h2>
        {icon}&nbsp;{sideBarTitle}
      </h2>

      {children}
    </aside>
  );
};
