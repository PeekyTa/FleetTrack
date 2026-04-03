import { useState, useEffect } from 'react';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();
  const { unacknowledgedCount } = useAlerts();
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);
  const currentTitle = PAGE_TITLES[location.pathname] || 'Tableau de Bord';
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden relative">
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden" 
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <div className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 md:relative md:translate-x-0 flex shrink-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          unacknowledgedAlerts={unacknowledgedCount}
          handleLogout={handleLogout}
          userRole={user?.role || 'VIEWER'}
        />
      </div>
      <div className="flex-1 flex flex-col min-w-0 md:min-w-0 w-full overflow-hidden">
        <Navbar
          currentTitle={currentTitle}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          unacknowledgedAlerts={unacknowledgedCount}
          userName={user?.name}
          userRole={user?.role}
          toggleMobileMenu={() => setMobileMenuOpen(true)}
        />
        <main className="flex-1 overflow-auto bg-slate-50 relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
