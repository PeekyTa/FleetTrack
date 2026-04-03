import { useState } from 'react';
import { Radio, Bell, TrendingUp, Signal } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts';
import { useAnalytics } from '../../hooks/useAnalytics';
import { RoleGuard } from '../../guards/RoleGuard';
export function Analytics() {
  const [period, setPeriod] = useState('week');
  const { deviceActivity, signalQuality, coverage, distance, alertStats, totalDistance, totalAlerts, loading } = useAnalytics(period);
  if (loading) {
    return (
      <RoleGuard allowedRoles={['ADMIN', 'SUPERVISOR']}>
        <div className="flex items-center justify-center h-64 text-slate-400">Chargement des analytiques...</div>
      </RoleGuard>
    );
  }
  const stats = [
    { icon: Radio, label: 'Appareils en Ligne', value: deviceActivity?.current.online ?? 0, color: '#10B981', bg: '#F0FDF4' },
    { icon: Bell, label: 'Alertes Totales', value: totalAlerts, color: '#EF4444', bg: '#FEF2F2' },
    { icon: TrendingUp, label: 'Distance (7j)', value: `${totalDistance} km`, color: '#1E40AF', bg: '#EFF6FF' },
    { icon: Signal, label: 'Signal Moyen', value: `${signalQuality.length > 0 ? Math.round(signalQuality.reduce((s: number, q: any) => s + q.value, 0) / signalQuality.length * 10) : 0}%`, color: '#7C3AED', bg: '#F5F3FF' },
  ];
  return (
    <RoleGuard allowedRoles={['ADMIN', 'SUPERVISOR']}>
      <div className="p-6 space-y-6 overflow-auto animate-fade-in-up">
        {}
        <div className="flex items-center justify-between">
          <h2 className="text-slate-800 font-bold" style={{ fontSize: 18 }}>Analytique</h2>
          <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
            {[
              { value: 'today', label: 'Aujourd\'hui' },
              { value: 'week', label: 'Semaine' },
              { value: 'month', label: 'Mois' },
            ].map((p) => (
              <button
                key={p.value}
                onClick={() => setPeriod(p.value)}
                className={`px-4 py-1.5 rounded-lg transition-colors ${period === p.value ? 'bg-white text-slate-700 shadow-sm font-medium' : 'text-slate-500'}`}
                style={{ fontSize: 13 }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
        {}
        <div className="grid grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: s.bg }}>
                <s.icon size={22} style={{ color: s.color }} />
              </div>
              <div>
                <div className="text-slate-800 font-bold" style={{ fontSize: 22 }}>{s.value}</div>
                <div className="text-slate-500" style={{ fontSize: 11 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>
        {}
        <div className="grid grid-cols-2 gap-6">
          {}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <h3 className="text-slate-700 font-semibold mb-4" style={{ fontSize: 14 }}>Activité des Appareils</h3>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={deviceActivity?.history || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="hour" tick={{ fontSize: 11 }} stroke="#94A3B8" />
                <YAxis tick={{ fontSize: 11 }} stroke="#94A3B8" />
                <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                <Line type="monotone" dataKey="online" stroke="#10B981" strokeWidth={2} dot={false} name="En ligne" />
                <Line type="monotone" dataKey="offline" stroke="#94A3B8" strokeWidth={2} dot={false} name="Hors ligne" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          {}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <h3 className="text-slate-700 font-semibold mb-4" style={{ fontSize: 14 }}>Distance Parcourue</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={distance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="#94A3B8" />
                <YAxis tick={{ fontSize: 11 }} stroke="#94A3B8" />
                <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="km" fill="#3B82F6" radius={[6, 6, 0, 0]} name="km" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        {}
        <div className="grid grid-cols-3 gap-6">
          {}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <h3 className="text-slate-700 font-semibold mb-4" style={{ fontSize: 14 }}>Qualité du Signal</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={signalQuality} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3}>
                  {signalQuality.map((entry: any, i: number) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Legend verticalAlign="bottom" iconType="circle" formatter={(value: string) => <span style={{ fontSize: 11, color: '#64748B' }}>{value}</span>} />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <h3 className="text-slate-700 font-semibold mb-4" style={{ fontSize: 14 }}>Couverture par Groupe</h3>
            <div className="space-y-4">
              {coverage.map((g: any) => (
                <div key={g.group}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-slate-600 font-medium" style={{ fontSize: 12 }}>{g.group}</span>
                    <span className="text-slate-500" style={{ fontSize: 11 }}>{g.online}/{g.total} ({g.coverage}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="h-full rounded-full transition-all" style={{ width: `${g.coverage}%`, background: g.coverage > 70 ? '#10B981' : g.coverage > 40 ? '#F59E0B' : '#EF4444' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          {}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <h3 className="text-slate-700 font-semibold mb-4" style={{ fontSize: 14 }}>Distribution des Alertes</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={alertStats?.byType || []} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis type="number" tick={{ fontSize: 11 }} stroke="#94A3B8" />
                <YAxis dataKey="type" type="category" width={100} tick={{ fontSize: 10 }} stroke="#94A3B8" />
                <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="count" fill="#F59E0B" radius={[0, 6, 6, 0]} name="Nombre" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
