import React from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../types/index';
interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
  fallback?: string;
}
export function RoleGuard({ allowedRoles, children, fallback = '/dashboard' }: RoleGuardProps) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (!allowedRoles.includes(user.role as UserRole)) {
    return <Navigate to={fallback} replace />;
  }
  return <>{children}</>;
}
