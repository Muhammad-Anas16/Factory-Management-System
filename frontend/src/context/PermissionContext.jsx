import { createContext, useContext, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { normalizePermissions } from '../utils/pages';

const PermissionContext = createContext(null);

export function PermissionProvider({ children }) {
  const { user } = useAuth();
  const isAdmin = String(user?.role || '').toLowerCase() === 'admin';
  const permissions = useMemo(() => normalizePermissions(user?.permissions || {}), [user]);

  const check = (page, action) => {
    if (!user) return false;
    if (isAdmin) return true;
    if (user?.is_permission === false) return false;
    return Boolean(permissions?.[page]?.[`can_${action}`]);
  };

  const value = useMemo(() => ({
    permissions,
    isAdmin,
    canView: (page) => check(page, 'view'),
    canCreate: (page) => check(page, 'create'),
    canEdit: (page) => check(page, 'edit'),
    canDelete: (page) => check(page, 'delete'),
  }), [permissions, user, isAdmin]);

  return <PermissionContext.Provider value={value}>{children}</PermissionContext.Provider>;
}

export function usePermission() {
  const context = useContext(PermissionContext);
  if (!context) throw new Error('usePermission must be used inside PermissionProvider');
  return context;
}
