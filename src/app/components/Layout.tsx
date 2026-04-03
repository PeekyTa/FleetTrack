import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router';
import { Sidebar } from '../../components/Sidebar/Sidebar';
import { Navbar } from '../../components/Navbar/Navbar';
import { useAuth } from '../../context/AuthContext';
import { useAlerts } from '../../hooks/useAlerts';
const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Tableau de Bord',
  '/map': 'Carte en Direct',
  '/devices': 'Gestion des Appareils',
  '/history': 'Historique & Lecture',
  '/alerts': 'Alertes & Géorepérage',
  '/analytics': 'Analytique',
  '/users': 'Utilisateurs & Rôles',
  '/settings': 'Paramètres',
};
export function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();
  const { unacknowledgedCount } = useAlerts();
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  const currentTitle = PAGE_TITLES[location.pathname] || 'Tableau de Bord';
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        unacknowledgedAlerts={unacknowledgedCount}
        handleLogout={handleLogout}
        userRole={user?.role || 'VIEWER'}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          currentTitle={currentTitle}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          unacknowledgedAlerts={unacknowledgedCount}
          userName={user?.name}
          userRole={user?.role}
        />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
