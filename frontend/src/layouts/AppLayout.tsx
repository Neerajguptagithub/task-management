import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import { Menu, CheckSquare } from 'lucide-react';

interface LayoutProps {
  role: 'admin' | 'employee';
}

const AppLayout: React.FC<LayoutProps> = ({ role }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="app-layout">
      <header className="mobile-header">
        <button
          onClick={toggleMobileMenu}
          className="btn-ghost icon-btn"
          aria-label="Toggle navigation menu"
        >
          <Menu size={22} />
        </button>

        <div className="mobile-logo">
          <div className="logo-icon">
            <CheckSquare size={16} color="white" />
          </div>
          <span className="logo-text">TaskFlow</span>
        </div>
      </header>

      <div className="app-container">
        <Sidebar role={role} isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;

