import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import { useAppSelector } from '../hooks/useRedux';

interface LayoutProps {
  role: 'admin' | 'employee';
}

const AppLayout: React.FC<LayoutProps> = ({ role }) => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar role={role} />
      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto', background: 'var(--color-bg-primary)' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
