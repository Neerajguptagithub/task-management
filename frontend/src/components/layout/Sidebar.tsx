import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, ClipboardList, LogOut, CheckSquare, Sun, Moon, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { logoutAsync } from '../../features/authSlice';
import toast from 'react-hot-toast';

interface SidebarProps {
  role: 'admin' | 'employee';
  isOpen?: boolean;
  onClose?: () => void;
}

const adminLinks = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/employees', icon: Users, label: 'Employees' },
  { to: '/admin/tasks', icon: ClipboardList, label: 'Tasks' },
];

const employeeLinks = [
  { to: '/employee/dashboard', icon: CheckSquare, label: 'My Tasks' },
];

const Sidebar: React.FC<SidebarProps> = ({ role, isOpen = false, onClose }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((s) => s.auth.user);
  const links = role === 'admin' ? adminLinks : employeeLinks;
  
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  const handleLogout = async () => {
    if (onClose) onClose();
    await dispatch(logoutAsync());
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const handleNavClick = () => {
    if (onClose) onClose();
  };

  return (
    <>
      {isOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={onClose} 
          aria-hidden="true" 
        />
      )}

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0 0.5rem' }}>
            <div style={{
              width: 36, height: 36, borderRadius: '0.5rem',
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <CheckSquare size={18} color="white" />
            </div>
            <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>TaskFlow</span>
          </div>

          <button 
            className="sidebar-close-btn"
            onClick={onClose} 
            aria-label="Close sidebar menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {links.map(({ to, icon: Icon, label }) => (
            <NavLink 
              key={to} 
              to={to} 
              onClick={handleNavClick}
              className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem', marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ padding: '0 0.5rem' }}>
            <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.name}
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.email}
            </p>
            <span style={{
              display: 'inline-block', marginTop: '0.25rem',
              padding: '0.125rem 0.5rem', borderRadius: '9999px',
              fontSize: '0.6875rem', fontWeight: 600, textTransform: 'capitalize',
              background: role === 'admin' ? 'rgba(99,102,241,0.15)' : 'rgba(16,185,129,0.15)',
              color: role === 'admin' ? '#818cf8' : '#34d399',
            }}>
              {role}
            </span>
          </div>
          
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={toggleTheme} className="btn-ghost" style={{ flex: 1, justifyContent: 'center' }} title="Toggle Theme">
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button onClick={handleLogout} className="btn-ghost" style={{ flex: 2, justifyContent: 'center' }} title="Logout">
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

