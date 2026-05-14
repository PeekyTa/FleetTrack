import { NavLink } from 'react-router';
import {
  LayoutDashboard, Map, Radio, History, Bell, BarChart3,
  Users, Settings, LogOut, ChevronLeft, ChevronRight
} from 'lucide-react';
import { ROLE_PERMISSIONS, type UserRole } from '../../types/index';
interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  unacknowledgedAlerts: number;
  handleLogout: () => void;
  userRole: string;
}
const ALL_NAV_ITEMS = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Tableau de Bord', permission: 'viewDashboard' as const },
  { path: '/map', icon: Map, label: 'Carte en Direct', permission: 'viewMap' as const },
  { path: '/devices', icon: Radio, label: 'Appareils', permission: 'viewDevices' as const },
  { path: '/history', icon: History, label: 'Historique', permission: 'viewHistory' as const },
  { path: '/alerts', icon: Bell, label: 'Alertes', permission: 'viewAlerts' as const },
  { path: '/analytics', icon: BarChart3, label: 'Analytique', permission: 'viewAnalytics' as const },
  { path: '/users', icon: Users, label: 'Utilisateurs', permission: 'viewUsers' as const },
  { path: '/settings', icon: Settings, label: 'Paramètres', permission: 'viewSettings' as const },
];
export function Sidebar({ collapsed, setCollapsed, unacknowledgedAlerts, handleLogout, userRole }: SidebarProps) {
  const permissions = ROLE_PERMISSIONS[userRole as UserRole] || ROLE_PERMISSIONS.VIEWER;
  const navItems = ALL_NAV_ITEMS.filter((item) => permissions[item.permission]);
  return (
    <aside
      className={`bg-white border-r border-slate-200 flex flex-col shrink-0 transition-all duration-300 ${
        collapsed ? 'w-[70px]' : 'w-[220px]'
      }`}
    >
      {}
      <div className="h-16 flex items-center gap-3 px-4 border-b border-slate-100 shrink-0">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg, #1E40AF, #3B82F6)' }}
        >
          <Radio size={18} color="white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <div className="text-slate-800 font-bold" style={{ fontSize: 15 }}>FleetTrack</div>
            <div className="text-blue-600 font-medium" style={{ fontSize: 10 }}>POC Platform</div>
          </div>
        )}
      </div>
      {}
      <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
        {navItems.map(({ path, icon: Icon, label, permission }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${
                isActive
                  ? 'bg-blue-50 text-blue-700 border border-blue-100'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              } ${collapsed ? 'justify-center' : ''}`
            }
          >
            <Icon size={18} className="shrink-0" />
            {!collapsed && (
              <span className="truncate" style={{ fontSize: 13, fontWeight: 500 }}>
                {label}
              </span>
            )}
            {}
            {permission === 'viewAlerts' && unacknowledgedAlerts > 0 && (
              <span
                className={`px-1.5 py-0.5 rounded-full text-white font-bold ${
                  collapsed ? 'absolute top-0 right-0' : 'ml-auto'
                }`}
                style={{ fontSize: 10, background: '#EF4444', minWidth: 18, textAlign: 'center' }}
              >
                {unacknowledgedAlerts}
              </span>
            )}
          </NavLink>
        ))}
      </nav>
      {}
      {!collapsed && (
        <div className="px-3 pb-2">
          <div
            className="px-3 py-2 rounded-xl text-center"
            style={{
              fontSize: 11,
              fontWeight: 600,
              background: userRole === 'ADMIN' ? '#EFF6FF' : userRole === 'SUPERVISOR' ? '#F0FDFA' : userRole === 'OPERATOR' ? '#FFF7ED' : '#F8FAFC',
              color: userRole === 'ADMIN' ? '#1E40AF' : userRole === 'SUPERVISOR' ? '#0D9488' : userRole === 'OPERATOR' ? '#EA580C' : '#64748B',
            }}
          >
            {userRole}
          </div>
        </div>
      )}
      {}
      <div className="border-t border-slate-100 p-2 space-y-1">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          {!collapsed && <span style={{ fontSize: 12 }}>Réduire</span>}
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
        >
          <LogOut size={16} />
          {!collapsed && <span style={{ fontSize: 12 }}>Déconnexion</span>}
        </button>
      </div>
    </aside>
  );
}
