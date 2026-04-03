import React from 'react';
import { Bell, Moon, Sun, Search, Wifi, WifiOff } from 'lucide-react';
import { useSocket } from '../../context/SocketContext';
interface NavbarProps {
  currentTitle: string;
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
  unacknowledgedAlerts: number;
  userName?: string;
  userRole?: string;
}
export function Navbar({ currentTitle, darkMode, setDarkMode, unacknowledgedAlerts, userName, userRole }: NavbarProps) {
  const { connected } = useSocket();
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
      <div>
        <h1 className="text-slate-800 font-semibold" style={{ fontSize: 18 }}>{currentTitle}</h1>
      </div>
      <div className="flex items-center gap-3">
        {}
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${connected ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`} style={{ fontSize: 11 }}>
          {connected ? <Wifi size={12} /> : <WifiOff size={12} />}
          {connected ? 'Connecté' : 'Hors ligne'}
        </div>
        {}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher..."
            className="pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:border-blue-400"
            style={{ fontSize: 13, width: 200 }}
          />
        </div>
        {}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        {}
        <button className="relative p-2 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-slate-600">
          <Bell size={18} />
          {unacknowledgedAlerts > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
              {unacknowledgedAlerts}
            </span>
          )}
        </button>
        {}
        <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold"
            style={{ background: 'linear-gradient(135deg, #1E40AF, #3B82F6)', fontSize: 12 }}
          >
            {userName?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() || 'U'}
          </div>
          <div className="hidden lg:block">
            <div className="text-slate-700 font-medium" style={{ fontSize: 13 }}>{userName || 'Utilisateur'}</div>
            <div className="text-slate-400" style={{ fontSize: 10 }}>{userRole || 'VIEWER'}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
