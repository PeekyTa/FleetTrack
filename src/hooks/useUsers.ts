import { useState, useEffect, useCallback } from 'react';
import { userApi } from '../services/api';
import type { User } from '../types/index';
export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await userApi.getAll();
      setUsers(data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);
  const createUser = useCallback(async (user: { name: string; email: string; password: string; role?: string }) => {
    const created = await userApi.create(user);
    setUsers((prev) => [created, ...prev]);
    return created;
  }, []);
  const updateUser = useCallback(async (id: number, user: Partial<User>) => {
    const updated = await userApi.update(id, user);
    setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
    return updated;
  }, []);
  const deleteUser = useCallback(async (id: number) => {
    await userApi.delete(id);
    setUsers((prev) => prev.filter((u) => u.id !== id));
  }, []);
  return {
    users, loading, error,
    fetchUsers, createUser, updateUser, deleteUser,
  };
}
