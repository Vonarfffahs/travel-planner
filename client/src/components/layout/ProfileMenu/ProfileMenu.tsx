import { useState } from 'react';
import { useNavigate } from 'react-router';
import { User, Map, Bookmark, Settings, LogOut } from 'lucide-react';
import styles from './ProfileMenu.module.css';

export const ProfileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  const handleNavigate = (path: string) => {
    navigate(path);
    closeMenu();
  };

  const userName = 'User';
  const userEmail = 'user.email@gmail.com';

  const mapIcon = <Map size={18} />;
  const bookmarkIcon = <Bookmark size={18} />;
  const settingsIcon = <Settings size={18} />;
  const logOutIcon = <LogOut size={18} />;

  return (
    <div className={styles.wrapper}>
      <button className={styles.avatarBtn} onClick={toggleMenu}>
        <User size={24} />
      </button>

      {isOpen && (
        <>
          <div className={styles.overlay} onClick={closeMenu} />

          <div className={styles.dropdown}>
            <div className={styles.header}>
              <div className={styles.largeAvatar}>
                <User size={32} />
              </div>
              <p className={styles.greeting}>Hello, {userName}!</p>
              <p className={styles.email}>{userEmail}</p>
            </div>

            <div className={styles.menuItems}>
              <button onClick={() => handleNavigate('/trip/new')}>
                {mapIcon}&nbsp;Trips Map
              </button>
              <button
                onClick={() => handleNavigate('/user-profile/saved-trips')}
              >
                {bookmarkIcon}&nbsp;Saved trips
              </button>
              <button onClick={() => handleNavigate('/user-profile/settings')}>
                {settingsIcon}&nbsp;Settings
              </button>
            </div>

            <hr className={styles.divider} />

            <div className={styles.menuItems}>
              <button
                className={styles.logoutBtn}
                onClick={() => alert('Вихід...')}
              >
                {logOutIcon}&nbsp;Log Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
