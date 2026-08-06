import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../hooks/useRedux';
import Spinner from '../components/ui/Spinner';

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, loading } = useAppSelector((s) => s.auth);

  if (loading) return <Spinner />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Outlet />;
};

export default ProtectedRoute;
