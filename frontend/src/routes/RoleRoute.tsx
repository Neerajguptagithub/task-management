import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../hooks/useRedux';

interface RoleRouteProps {
  allowedRole: 'admin' | 'employee';
}

const RoleRoute: React.FC<RoleRouteProps> = ({ allowedRole }) => {
  const user = useAppSelector((s) => s.auth.user);

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== allowedRole) {
    return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/employee/dashboard'} replace />;
  }

  return <Outlet />;
};

export default RoleRoute;
