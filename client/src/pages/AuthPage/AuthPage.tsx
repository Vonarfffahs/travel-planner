import React, { useEffect, useState } from 'react';
import { authAPI } from '../../api';
import { useNavigate, useSearchParams } from 'react-router';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../store/authSlice';

import styles from './AuthPage.module.css';

type AuthMode = 'login' | 'register' | 'reset_password' | 'verify_code';

export const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('register');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [code, setCode] = useState('');
  const role = 'user';

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const codeFromUrl = searchParams.get('code');
    const emailFromUrl = searchParams.get('email');

    if (codeFromUrl && emailFromUrl) {
      setMode('verify_code');
      setCode(codeFromUrl);
      setEmail(emailFromUrl);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (mode === 'login') {
        const response = await authAPI.login({ email, password });
        // TODO: redux saving
        dispatch(setCredentials({ token: response.token }));
        navigate('/user-profile/settings');
      } else if (mode === 'register') {
        await authAPI.register({ nickname, email, role });
        setMode('verify_code');
      } else if (mode === 'reset_password') {
        await authAPI.resetPassword({ email });
        setMode('verify_code');
      } else if (mode === 'verify_code') {
        if (password !== confirmPassword) {
          setError('Passwords do not match. Please try again.');
          setIsLoading(false);
          return;
        }

        await authAPI.setPassword({ code, email, password });

        const response = await authAPI.login({ email, password });
        dispatch(setCredentials({ token: response.token }));
        navigate('/user-profile/settings');
      }
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

  const getTitle = () => {
    switch (mode) {
      case 'login':
        return 'Log in';
      case 'register':
        return 'Create an account';
      case 'reset_password':
        return 'Reset Password';
      case 'verify_code':
        return 'Enter Code';
    }
  };

  const getButtonText = () => {
    switch (mode) {
      case 'login':
        return 'Log in';
      case 'register':
        return 'Sign up';
      case 'reset_password':
        return 'Send Code';
      case 'verify_code':
        return 'Set Password';
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h2 className={styles.title}>{getTitle()}</h2>

        {error && <div className={styles.error}>{error}</div>}

        {mode === 'verify_code' && (
          <p
            style={{
              textAlign: 'center',
              marginBottom: '1rem',
              fontSize: '14px',
            }}
          >
            We've sent a verification code to <b>{email}</b>
          </p>
        )}

        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div className={styles.formGroup}>
              <Input
                type="text"
                placeholder="Nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                required
              />
            </div>
          )}

          {(mode === 'login' ||
            mode === 'register' ||
            mode === 'reset_password') && (
            <div className={styles.formGroup}>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          )}

          {mode === 'verify_code' && (
            <div className={styles.formGroup}>
              <Input
                type="text"
                placeholder="Verification Code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </div>
          )}

          {(mode === 'login' || mode === 'verify_code') && (
            <div className={styles.formGroup}>
              <Input
                type="password"
                placeholder={
                  mode === 'verify_code' ? 'New Password' : 'Password'
                }
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          )}

          {mode === 'verify_code' && (
            <div className={styles.formGroup}>
              <Input
                type="password"
                placeholder="Repeat Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          )}

          <Button type="submit" isLoading={isLoading} style={{ width: '100%' }}>
            {getButtonText()}
          </Button>
        </form>

        <div className={styles.switchMode}>
          {mode === 'login' && (
            <>
              <div>
                Don't have an account?{' '}
                <span
                  style={{ color: 'blue', cursor: 'pointer' }}
                  onClick={() => {
                    setMode('register');
                    setError(null);
                  }}
                >
                  Sign up
                </span>
              </div>
              <div>
                <span
                  style={{ color: 'blue', cursor: 'pointer' }}
                  onClick={() => {
                    setMode('reset_password');
                    setError(null);
                  }}
                >
                  Forgot password?
                </span>
              </div>
            </>
          )}

          {(mode === 'register' ||
            mode === 'reset_password' ||
            mode === 'verify_code') && (
            <div>
              Already have an account?{' '}
              <span
                style={{ color: 'blue', cursor: 'pointer' }}
                onClick={() => {
                  setMode('login');
                  setError(null);
                }}
              >
                Log in
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
