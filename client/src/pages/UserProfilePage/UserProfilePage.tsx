import { Outlet, NavLink } from 'react-router';
import { Sidebar } from '../../components/layout/Sidebar';
import { User } from 'lucide-react';
import styles from './UserProfilePage.module.css';

export const UserProfilePage = () => {
  const getNavLinkClass = ({ isActive }: { isActive: boolean }) => {
    return isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink;
  };

  const userIcon = <User size={24} strokeWidth={2.5} />;

  return (
    <div className={styles.wrapper}>
      <Sidebar
        sideBarTitle="Profile"
        icon={userIcon}
        className={styles.profileSidebar}
      >
        <nav className={styles.nav}>
          <NavLink to="/user-profile/saved-trips" className={getNavLinkClass}>
            Saved Trips
          </NavLink>
          <NavLink to="/user-profile/settings" className={getNavLinkClass}>
            Settings
          </NavLink>
          <NavLink to="/" className={getNavLinkClass}>
            Return home
          </NavLink>
        </nav>
      </Sidebar>

      <main className={styles.mainContent}>
        <Outlet />
      </main>
    </div>
  );
};
