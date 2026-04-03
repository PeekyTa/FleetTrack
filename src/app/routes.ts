import { createBrowserRouter, redirect } from 'react-router';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { LiveMap } from './pages/LiveMap';
import { DeviceManagement } from './pages/DeviceManagement';
import { HistoryPlayback } from './pages/HistoryPlayback';
import { AlertsGeofencing } from './pages/AlertsGeofencing';
import { Analytics } from './pages/Analytics';
import { UsersRoles } from './pages/UsersRoles';
import { Settings } from './pages/Settings';
function requireAuth() {
  const stored = localStorage.getItem('userInfo');
  if (!stored) return redirect('/login');
  try {
    JSON.parse(stored);
    return null;
  } catch {
    localStorage.removeItem('userInfo');
    return redirect('/login');
  }
}
export const router = createBrowserRouter([
  {
    path: '/login',
    Component: Login,
  },
  {
    path: '/',
    Component: Layout,
    loader: requireAuth,
    children: [
      { index: true, loader: () => redirect('/dashboard') },
      { path: 'dashboard', Component: Dashboard },
      { path: 'map', Component: LiveMap },
      { path: 'devices', Component: DeviceManagement },
      { path: 'history', Component: HistoryPlayback },
      { path: 'alerts', Component: AlertsGeofencing },
      { path: 'analytics', Component: Analytics },
      { path: 'users', Component: UsersRoles },
      { path: 'settings', Component: Settings },
    ],
  },
  {
    path: '*',
    loader: () => redirect('/login'),
  },
]);
