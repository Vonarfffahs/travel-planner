import React, { useEffect, useState } from 'react';
import { authAPI } from '../../api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Loader } from '../../components/ui/Loader';
import type { UserProfile } from '../../types';
import axios from 'axios';

import styles from './SettingsPage.module.css';

export const SettingsPage: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isResettingPwd, setIsResettingPwd] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [nickname, setNickname] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await authAPI.getProfile();
        setUser(data);
        setNickname(data.nickname);
      } catch (err) {
        let errorMessage = 'Something went wrong. Please try again.';

        if (axios.isAxiosError(err)) {
          errorMessage = err.response?.data?.message || errorMessage;
        }

        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccessMsg(null);

    try {
      // TODO: update nickname request

      setSuccessMsg('Profile updated successfully!');
      setUser((prev) => (prev ? { ...prev, nickname } : null));
    } catch (err) {
      let errorMessage = 'Something went wrong. Please try again.';

      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.message || errorMessage;
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!user?.email) return;

    if (
      !window.confirm(
        `We will send a password reset link to ${user.email}. Do you want to proceed?`,
      )
    ) {
      return;
    }

    setIsResettingPwd(true);
    setError(null);
    setSuccessMsg(null);

    try {
      await authAPI.resetPassword({ email: user.email });
      setSuccessMsg('A password reset link has been sent to your email!');
    } catch (err) {
      let errorMessage = 'Failed to send reset link. Please try again.';
      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.message || errorMessage;
      }
      setError(errorMessage);
    } finally {
      setIsResettingPwd(false);
    }
  };

  if (isLoading) return <Loader />;
  if (!user)
    return <div className={styles.error}>Unable to load settings.</div>;

  return (
    <div className={styles.settingsContainer}>
      <h1 className={styles.pageTitle}>Settings</h1>

      {/* BLOCK 1: PERSONAL DATA */}
      <section className={styles.settingsSection}>
        <h2>Profile Information</h2>
        {error && <p className={styles.errorText}>{error}</p>}
        {successMsg && <p className={styles.successText}>{successMsg}</p>}

        <form onSubmit={handleUpdateProfile} className={styles.form}>
          <div className={styles.inputGroup}>
            <label>Email (Read-only)</label>
            <Input type="email" value={user.email} disabled />
          </div>

          <div className={styles.inputGroup}>
            <label>Nickname</label>
            <Input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
          </div>

          <Button type="submit" isLoading={isSaving}>
            Save Changes
          </Button>
        </form>
      </section>

      {/* BLOCK 2: Security */}
      <section className={styles.settingsSection}>
        <h2>Security</h2>
        <div className={styles.actionRow}>
          <div>
            <h3>Reset Password</h3>
            <p>Receive an email with a link to set a new password.</p>
          </div>
          <Button onClick={handleResetPassword} isLoading={isResettingPwd}>
            Send Reset Link
          </Button>
        </div>
      </section>

      {/* BLOCK 3: Danger zone */}
      <section className={`${styles.settingsSection} ${styles.dangerZone}`}>
        <h2 className={styles.dangerTitle}>Danger Zone</h2>
        <div className={styles.actionRow}>
          <div>
            <h3>Delete Account</h3>
            <p>Permanently delete your account and all saved trips.</p>
          </div>
          <Button
            className={styles.dangerButton}
            onClick={() => {
              if (
                window.confirm(
                  'Are you sure you want to delete your account? This action cannot be undone.',
                )
              ) {
                // TODO: delete profile request
              }
            }}
          >
            Delete Account
          </Button>
        </div>
      </section>
    </div>
  );
};
