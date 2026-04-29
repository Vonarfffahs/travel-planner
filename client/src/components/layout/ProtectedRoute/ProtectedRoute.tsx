import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { StoreState } from '../../../store';

export const ProtectedRoute: React.FC = () => {
  const isAuthenticated = useSelector(
    (state: StoreState) => state.auth.isAuthenticated,
  );

  return isAuthenticated ? <Outlet /> : <Navigate to="/auth" replace />;
};
