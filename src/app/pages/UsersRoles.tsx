import { useState } from 'react';
import { Edit2, Trash2, X, UserPlus, Search } from 'lucide-react';
import { useUsers } from '../../hooks/useUsers';
import { RoleGuard } from '../../guards/RoleGuard';
import type { User, UserRole } from '../../types/index';
import { ROLE_PERMISSIONS } from '../../types/index';
const ROLE_COLORS: Record<string, { color: string; bg: string }> = {
  ADMIN: { color: '#1E40AF', bg: '#EFF6FF' },
  SUPERVISOR: { color: '#0D9488', bg: '#F0FDFA' },
  OPERATOR: { color: '#EA580C', bg: '#FFF7ED' },
  VIEWER: { color: '#64748B', bg: '#F8FAFC' },
};
export function UsersRoles() {
  const { users, loading, createUser, updateUser, deleteUser } = useUsers();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [editUser, setEditUser] = useState<User | null | undefined>(undefined);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'users' | 'permissions'>('users');
  const filtered = users.filter((u) => {
    const roleMatch = roleFilter === 'all' || u.role === roleFilter;
    const searchMatch = !search ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    return roleMatch && searchMatch;
  });
  const handleSave = async (data: { name: string; email: string; password?: string; role?: UserRole }) => {
    try {
      if (editUser) {
        await updateUser(editUser.id, data);
      } else {
        await createUser({ ...data, password: data.password || 'password123' });
      }
      setEditUser(undefined);
    } catch (err) {
      console.error('Error saving user:', err);
    }
  };
  return (
    <RoleGuard allowedRoles={['ADMIN']}>
      <div className="p-6 space-y-6 overflow-auto animate-fade-in-up">
        {}
        <div className="flex items-center justify-between">
          <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-1.5 rounded-lg transition-colors ${activeTab === 'users' ? 'bg-white text-slate-700 shadow-sm font-medium' : 'text-slate-500'}`}
              style={{ fontSize: 13 }}
            >
              Utilisateurs ({users.length})
            </button>
            <button
              onClick={() => setActiveTab('permissions')}
              className={`px-4 py-1.5 rounded-lg transition-colors ${activeTab === 'permissions' ? 'bg-white text-slate-700 shadow-sm font-medium' : 'text-slate-500'}`}
              style={{ fontSize: 13 }}
            >
              Matrice de Permissions
            </button>
          </div>
          {activeTab === 'users' && (
            <button
              onClick={() => setEditUser(null)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium"
              style={{ background: 'linear-gradient(135deg, #1E40AF, #2563EB)', fontSize: 13 }}
            >
              <UserPlus size={14} /> Ajouter un utilisateur
            </button>
          )}
        </div>
        {activeTab === 'users' ? (
          <>
            {}
            <div className="flex items-center gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text" placeholder="Rechercher un utilisateur..."
                  value={search} onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:border-blue-400"
                  style={{ fontSize: 13 }}
                />
              </div>
              <div className="flex gap-1.5">
                {['all', 'ADMIN', 'SUPERVISOR', 'OPERATOR', 'VIEWER'].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRoleFilter(r)}
                    className={`px-3 py-1.5 rounded-lg ${roleFilter === r ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                    style={{ fontSize: 12 }}
                  >
                    {r === 'all' ? 'Tous' : r}
                  </button>
                ))}
              </div>
            </div>
            {}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              {loading ? (
                <div className="flex items-center justify-center h-48 text-slate-400">Chargement...</div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50">
                      {['Utilisateur', 'Rôle', 'Statut', 'Dernière connexion', 'Appareils', 'Actions'].map((h) => (
                        <th key={h} className="py-3 px-5 text-left text-slate-500 font-semibold" style={{ fontSize: 12 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filtered.map((user) => {
                      const roleCfg = ROLE_COLORS[user.role] || ROLE_COLORS.VIEWER;
                      return (
                        <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3.5 px-5">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold" style={{ background: `linear-gradient(135deg, ${roleCfg.color}, ${roleCfg.color}CC)`, fontSize: 12 }}>
                                {user.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                              </div>
                              <div>
                                <div className="text-slate-700 font-medium" style={{ fontSize: 13 }}>{user.name}</div>
                                <div className="text-slate-400" style={{ fontSize: 11 }}>{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-5">
                            <span className="px-2.5 py-1 rounded-full font-semibold" style={{ fontSize: 11, backgroundColor: roleCfg.bg, color: roleCfg.color }}>
                              {user.role}
                            </span>
                          </td>
                          <td className="py-3.5 px-5">
                            <span className={`px-2 py-1 rounded-full font-medium ${user.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-400'}`} style={{ fontSize: 11 }}>
                              {user.status === 'active' ? 'Actif' : 'Inactif'}
                            </span>
                          </td>
                          <td className="py-3.5 px-5 text-slate-500" style={{ fontSize: 12 }}>
                            {user.lastLogin ? new Date(user.lastLogin).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : '—'}
                          </td>
                          <td className="py-3.5 px-5 text-slate-500" style={{ fontSize: 12 }}>
                            {user._count?.assignedDevices ?? 0}
                          </td>
                          <td className="py-3.5 px-5">
                            <div className="flex items-center gap-1">
                              <button onClick={() => setEditUser(user)} className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50">
                                <Edit2 size={14} />
                              </button>
                              <button onClick={() => setDeleteId(user.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50">
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </>
        ) : (
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="py-3 px-5 text-left text-slate-500 font-semibold" style={{ fontSize: 12 }}>Permission</th>
                  {(['ADMIN', 'SUPERVISOR', 'OPERATOR', 'VIEWER'] as UserRole[]).map((role) => (
                    <th key={role} className="py-3 px-5 text-center" style={{ fontSize: 12 }}>
                      <span className="px-2.5 py-1 rounded-full font-semibold" style={{ backgroundColor: ROLE_COLORS[role].bg, color: ROLE_COLORS[role].color }}>
                        {role}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {Object.entries(ROLE_PERMISSIONS.ADMIN).map(([perm]) => (
                  <tr key={perm} className="hover:bg-slate-50">
                    <td className="py-3 px-5 text-slate-600" style={{ fontSize: 13 }}>
                      {perm.replace(/([A-Z])/g, ' $1').replace(/^./, (s: string) => s.toUpperCase())}
                    </td>
                    {(['ADMIN', 'SUPERVISOR', 'OPERATOR', 'VIEWER'] as UserRole[]).map((role) => (
                      <td key={role} className="py-3 px-5 text-center">
                        {ROLE_PERMISSIONS[role][perm as keyof typeof ROLE_PERMISSIONS['ADMIN']] ? (
                          <span className="text-green-500 text-lg">✓</span>
                        ) : (
                          <span className="text-slate-300 text-lg">✗</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {}
        {editUser !== undefined && (
          <UserFormModal user={editUser} onClose={() => setEditUser(undefined)} onSave={handleSave} />
        )}
        {}
        {deleteId !== null && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm animate-fade-in-up">
              <h3 className="text-slate-800 font-semibold mb-2" style={{ fontSize: 16 }}>Supprimer l'utilisateur</h3>
              <p className="text-slate-500 mb-5" style={{ fontSize: 14 }}>Cette action est irréversible.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50" style={{ fontSize: 14 }}>Annuler</button>
                <button onClick={async () => { await deleteUser(deleteId); setDeleteId(null); }} className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium" style={{ fontSize: 14 }}>Supprimer</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </RoleGuard>
  );
}
function UserFormModal({ user, onClose, onSave }: {
  user: User | null;
  onClose: () => void;
  onSave: (data: { name: string; email: string; password?: string; role?: UserRole }) => void;
}) {
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    role: user?.role || ('VIEWER' as UserRole),
  });
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fade-in-up">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h3 className="text-slate-800 font-semibold" style={{ fontSize: 16 }}>{user ? 'Modifier l\'utilisateur' : 'Ajouter un utilisateur'}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 rounded-lg p-1 hover:bg-slate-100"><X size={18} /></button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-slate-600 mb-1.5" style={{ fontSize: 13, fontWeight: 500 }}>Nom</label>
            <input type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-blue-400" style={{ fontSize: 14 }} />
          </div>
          <div>
            <label className="block text-slate-600 mb-1.5" style={{ fontSize: 13, fontWeight: 500 }}>Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-blue-400" style={{ fontSize: 14 }} />
          </div>
          {!user && (
            <div>
              <label className="block text-slate-600 mb-1.5" style={{ fontSize: 13, fontWeight: 500 }}>Mot de passe</label>
              <input type="password" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-blue-400" style={{ fontSize: 14 }} />
            </div>
          )}
          <div>
            <label className="block text-slate-600 mb-1.5" style={{ fontSize: 13, fontWeight: 500 }}>Rôle</label>
            <select value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as UserRole }))}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700" style={{ fontSize: 14 }}>
              <option value="ADMIN">Administrateur</option>
              <option value="SUPERVISOR">Superviseur</option>
              <option value="OPERATOR">Opérateur</option>
              <option value="VIEWER">Observateur</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3 p-5 border-t border-slate-100">
          <button onClick={onClose} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50" style={{ fontSize: 14 }}>Annuler</button>
          <button onClick={() => onSave(form)} className="flex-1 py-2.5 rounded-xl text-white font-semibold" style={{ background: 'linear-gradient(135deg, #1E40AF, #2563EB)', fontSize: 14 }}>
            {user ? 'Enregistrer' : 'Créer'}
          </button>
        </div>
      </div>
    </div>
  );
}
