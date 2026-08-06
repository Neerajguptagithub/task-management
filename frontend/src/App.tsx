import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from './hooks/useRedux';
import { fetchMeAsync } from './features/authSlice';

import ProtectedRoute from './routes/ProtectedRoute';
import RoleRoute from './routes/RoleRoute';
import AppLayout from './layouts/AppLayout';

import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import EmployeesPage from './pages/admin/EmployeesPage';
import AdminTasksPage from './pages/admin/AdminTasksPage';
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import Spinner from './components/ui/Spinner';

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading, isAuthenticated, user } = useAppSelector((s) => s.auth);

  useEffect(() => {
    dispatch(fetchMeAsync());
  }, [dispatch]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg-primary)' }}>
        <Spinner />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--color-bg-card)',
            color: 'var(--color-text-primary)',
            border: '1px solid var(--color-border)',
            fontSize: '0.875rem',
          },
          success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<RoleRoute allowedRole="admin" />}>
            <Route element={<AppLayout role="admin" />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/employees" element={<EmployeesPage />} />
              <Route path="/admin/tasks" element={<AdminTasksPage />} />
            </Route>
          </Route>

          <Route element={<RoleRoute allowedRole="employee" />}>
            <Route element={<AppLayout role="employee" />}>
              <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
            </Route>
          </Route>
        </Route>

        <Route
          path="/"
          element={
            isAuthenticated && user
              ? <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/employee/dashboard'} replace />
              : <Navigate to="/login" replace />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
