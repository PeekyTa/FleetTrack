import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Radio, Eye, EyeOff, Wifi, MapPin, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
export function Login() {
  const [email, setEmail] = useState('admin@fleettrack.io');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Identifiants invalides. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex" style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 40%, #0F2A5C 100%)' }}>
      {}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 flex-col items-center justify-center p-12 relative overflow-hidden">
        <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
          {Array.from({ length: 12 }, (_, i) => (
            <line key={`h${i}`} x1={0} y1={i * 55} x2={800} y2={i * 55} stroke="white" strokeWidth={0.8} />
          ))}
          {Array.from({ length: 16 }, (_, i) => (
            <line key={`v${i}`} x1={i * 55} y1={0} x2={i * 55} y2={600} stroke="white" strokeWidth={0.8} />
          ))}
          {[110, 275, 440].map((y, i) => (
            <line key={`mh${i}`} x1={0} y1={y} x2={800} y2={y} stroke="#3B82F6" strokeWidth={2} />
          ))}
          {[165, 385, 605].map((x, i) => (
            <line key={`mv${i}`} x1={x} y1={0} x2={x} y2={600} stroke="#3B82F6" strokeWidth={2} />
          ))}
          {[
            { cx: 200, cy: 120, r: 8, fill: '#10B981' },
            { cx: 420, cy: 200, r: 8, fill: '#10B981' },
            { cx: 600, cy: 150, r: 8, fill: '#F59E0B' },
            { cx: 300, cy: 380, r: 8, fill: '#EF4444' },
            { cx: 550, cy: 420, r: 8, fill: '#10B981' },
            { cx: 150, cy: 450, r: 8, fill: '#10B981' },
            { cx: 700, cy: 300, r: 8, fill: '#10B981' },
          ].map((d, i) => (
            <g key={i}>
              <circle cx={d.cx} cy={d.cy} r={d.r * 2.5} fill={d.fill} opacity={0.2} />
              <circle cx={d.cx} cy={d.cy} r={d.r} fill={d.fill} />
            </g>
          ))}
        </svg>
        <div className="relative z-10 max-w-md text-center">
          <div className="w-20 h-20 rounded-2xl mx-auto mb-8 flex items-center justify-center shadow-2xl" style={{ background: 'linear-gradient(135deg, #1E40AF, #3B82F6)' }}>
            <Radio size={36} color="white" />
          </div>
          <h1 className="text-white mb-4" style={{ fontSize: 36, fontWeight: 800, lineHeight: 1.2 }}>
            Intelligence de Flotte<br />en Temps Réel
          </h1>
          <p className="text-slate-400" style={{ fontSize: 16, lineHeight: 1.7 }}>
            Surveillez et gérez votre flotte de radios POC sur une plateforme unifiée. Suivez les appareils, gérez les géorepérages et répondez aux alertes instantanément.
          </p>
          <div className="mt-10 flex flex-wrap gap-3 justify-center">
            {[
              { icon: MapPin, label: 'Suivi GPS en Direct' },
              { icon: Shield, label: 'Alertes Géorepérage' },
              { icon: Wifi, label: 'Surveillance Signal' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/15 bg-white/8 text-slate-300" style={{ fontSize: 13 }}>
                <Icon size={14} className="text-blue-400" />
                {label}
              </div>
            ))}
          </div>
        </div>
        <div className="relative z-10 mt-14 w-full max-w-md grid grid-cols-3 gap-4">
          {[
            { value: '2,400+', label: 'Appareils Suivis' },
            { value: '99.9%', label: 'Disponibilité' },
            { value: '50ms', label: 'Latence MAJ' },
          ].map(stat => (
            <div key={stat.label} className="bg-white/8 border border-white/10 rounded-xl p-4 text-center">
              <div className="text-white font-bold" style={{ fontSize: 22 }}>{stat.value}</div>
              <div className="text-slate-400" style={{ fontSize: 12 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
      {}
      <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-sm animate-fade-in-up">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #1E40AF, #3B82F6)' }}>
              <Radio size={18} color="white" />
            </div>
            <div>
              <div className="text-slate-800 font-bold" style={{ fontSize: 18 }}>FleetTrack</div>
              <div className="text-blue-600 text-xs font-medium">Plateforme de Gestion POC</div>
            </div>
          </div>
          <div className="mb-8">
            <h2 className="text-slate-800 mb-2" style={{ fontWeight: 700, fontSize: 28 }}>Bon retour</h2>
            <p className="text-slate-500" style={{ fontSize: 14 }}>Connectez-vous à votre tableau de bord</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600" style={{ fontSize: 14 }}>
                {error}
              </div>
            )}
            <div>
              <label htmlFor="login-email" className="block text-slate-700 mb-1.5" style={{ fontSize: 14, fontWeight: 500 }}>
                Adresse email
              </label>
              <input
                id="login-email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e: any) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                style={{ fontSize: 15 }}
                placeholder="vous@organisation.com"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="login-password" className="text-slate-700" style={{ fontSize: 14, fontWeight: 500 }}>Mot de passe</label>
                <a href="#" className="text-blue-600 hover:text-blue-700" style={{ fontSize: 13 }}>Mot de passe oublié ?</a>
              </div>
              <div className="relative">
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e: any) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all pr-12"
                  style={{ fontSize: 15 }}
                  placeholder="Entrez votre mot de passe"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s: boolean) => !s)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="remember" name="remember" defaultChecked className="w-4 h-4 accent-blue-600 rounded" />
              <label htmlFor="remember" className="text-slate-600" style={{ fontSize: 14 }}>Rester connecté</label>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-white font-semibold transition-all shadow-lg hover:shadow-blue-500/30 disabled:opacity-70"
              style={{ background: loading ? '#64748B' : 'linear-gradient(135deg, #1E40AF, #2563EB)', fontSize: 15 }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
                  Authentification...
                </span>
              ) : 'Se Connecter'}
            </button>
          </form>
          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-slate-400" style={{ fontSize: 12 }}>
              Identifiants de démonstration pré-remplis • SSO entreprise disponible
            </p>
          </div>
          <div className="mt-6 flex items-center justify-center gap-4">
            {['SOC 2 Type II', 'ISO 27001', 'RGPD Conforme'].map(badge => (
              <div key={badge} className="flex items-center gap-1 text-slate-400" style={{ fontSize: 11 }}>
                <Shield size={10} className="text-green-500" />
                {badge}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
