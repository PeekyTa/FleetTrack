import React, { useState } from 'react';
import { Globe, Shield, Bell, Map, Code, Save, RefreshCw } from 'lucide-react';
import { RoleGuard } from '../../guards/RoleGuard';
interface SettingSection {
  icon: any;
  title: string;
  description: string;
  fields: { key: string; label: string; type: 'text' | 'select' | 'number' | 'toggle'; value: any; options?: { value: string; label: string }[] }[];
}
export function Settings() {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    company_name: 'FleetTrack Operations',
    timezone: 'UTC+1',
    language: 'Français',
    gps_update_interval: 10,
    map_style: 'map',
    theme: 'light',
    battery_threshold: 15,
    signal_timeout: 5,
    session_timeout: 480,
    two_factor: false,
    email_alerts: true,
    push_alerts: true,
    sms_alerts: false,
    alert_sound: true,
  });
  const handleChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };
  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };
  const sections: SettingSection[] = [
    {
      icon: Globe,
      title: 'Paramètres Généraux',
      description: 'Configuration de base de la plateforme',
      fields: [
        { key: 'company_name', label: 'Nom de l\'entreprise', type: 'text', value: settings.company_name },
        { key: 'timezone', label: 'Fuseau horaire', type: 'select', value: settings.timezone, options: [
          { value: 'UTC+0', label: 'UTC+0 (GMT)' },
          { value: 'UTC+1', label: 'UTC+1 (CET)' },
          { value: 'UTC+2', label: 'UTC+2 (EET)' },
        ] },
        { key: 'language', label: 'Langue', type: 'select', value: settings.language, options: [
          { value: 'Français', label: 'Français' },
          { value: 'English', label: 'English' },
          { value: 'Deutsch', label: 'Deutsch' },
        ] },
        { key: 'theme', label: 'Thème', type: 'select', value: settings.theme, options: [
          { value: 'light', label: 'Clair' },
          { value: 'dark', label: 'Sombre' },
          { value: 'system', label: 'Système' },
        ] },
      ],
    },
    {
      icon: Map,
      title: 'Configuration GPS & Carte',
      description: 'Paramètres de suivi et d\'affichage',
      fields: [
        { key: 'gps_update_interval', label: 'Intervalle MAJ GPS (sec)', type: 'number', value: settings.gps_update_interval },
        { key: 'battery_threshold', label: 'Seuil alerte batterie (%)', type: 'number', value: settings.battery_threshold },
        { key: 'signal_timeout', label: 'Timeout signal (min)', type: 'number', value: settings.signal_timeout },
        { key: 'map_style', label: 'Style de carte', type: 'select', value: settings.map_style, options: [
          { value: 'map', label: 'Carte Standard' },
          { value: 'satellite', label: 'Satellite' },
          { value: 'terrain', label: 'Terrain' },
        ] },
      ],
    },
    {
      icon: Shield,
      title: 'Sécurité',
      description: 'Authentification et contrôle d\'accès',
      fields: [
        { key: 'session_timeout', label: 'Timeout session (min)', type: 'number', value: settings.session_timeout },
        { key: 'two_factor', label: 'Authentification 2FA', type: 'toggle', value: settings.two_factor },
      ],
    },
    {
      icon: Bell,
      title: 'Notifications',
      description: 'Canaux d\'alerte et préférences',
      fields: [
        { key: 'email_alerts', label: 'Alertes par email', type: 'toggle', value: settings.email_alerts },
        { key: 'push_alerts', label: 'Notifications push', type: 'toggle', value: settings.push_alerts },
        { key: 'sms_alerts', label: 'Alertes SMS', type: 'toggle', value: settings.sms_alerts },
        { key: 'alert_sound', label: 'Son d\'alerte', type: 'toggle', value: settings.alert_sound },
      ],
    },
  ];
  return (
    <RoleGuard allowedRoles={['ADMIN']}>
      <div className="p-6 space-y-6 overflow-auto max-w-4xl mx-auto animate-fade-in-up">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-slate-800 font-bold" style={{ fontSize: 18 }}>Paramètres</h2>
            <p className="text-slate-500" style={{ fontSize: 13 }}>Configuration système et préférences</p>
          </div>
          <button
            onClick={handleSave}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-medium shadow-md transition-all ${saved ? 'bg-green-500' : ''}`}
            style={{ background: saved ? undefined : 'linear-gradient(135deg, #1E40AF, #2563EB)', fontSize: 14 }}
          >
            {saved ? <><RefreshCw size={14} /> Enregistré !</> : <><Save size={14} /> Enregistrer</>}
          </button>
        </div>
        {sections.map((section) => (
          <div key={section.title} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
              <section.icon size={18} className="text-blue-600 shrink-0" />
              <div>
                <h3 className="text-slate-700 font-semibold" style={{ fontSize: 14 }}>{section.title}</h3>
                <p className="text-slate-400" style={{ fontSize: 12 }}>{section.description}</p>
              </div>
            </div>
            <div className="divide-y divide-slate-50">
              {section.fields.map((field) => (
                <div key={field.key} className="px-6 py-4 flex items-center justify-between">
                  <label className="text-slate-600 font-medium" style={{ fontSize: 13 }}>{field.label}</label>
                  {field.type === 'text' && (
                    <input
                      type="text" value={field.value}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-blue-400 text-right"
                      style={{ fontSize: 13, width: 240 }}
                    />
                  )}
                  {field.type === 'number' && (
                    <input
                      type="number" value={field.value}
                      onChange={(e) => handleChange(field.key, parseInt(e.target.value))}
                      className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-blue-400 text-right"
                      style={{ fontSize: 13, width: 120 }}
                    />
                  )}
                  {field.type === 'select' && (
                    <select
                      value={field.value}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
                      style={{ fontSize: 13, width: 200 }}
                    >
                      {field.options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  )}
                  {field.type === 'toggle' && (
                    <button
                      onClick={() => handleChange(field.key, !field.value)}
                      className={`w-12 h-6 rounded-full transition-colors relative ${field.value ? 'bg-blue-600' : 'bg-slate-200'}`}
                    >
                      <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform absolute top-0.5 ${field.value ? 'translate-x-6' : 'translate-x-0.5'}`} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
        {}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
            <Code size={18} className="text-blue-600" />
            <div>
              <h3 className="text-slate-700 font-semibold" style={{ fontSize: 14 }}>Clés API</h3>
              <p className="text-slate-400" style={{ fontSize: 12 }}>Gérez vos clés d'accès à l'API</p>
            </div>
          </div>
          <div className="p-6">
            <div className="flex items-center gap-3">
              <input
                type="text" value="ft_live_7f2a8b3c9d4e5f6a1b2c3d4e5f" readOnly
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-mono" style={{ fontSize: 12 }} />
              <button className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200" style={{ fontSize: 12 }}>Copier</button>
              <button className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100" style={{ fontSize: 12 }}>Régénérer</button>
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
