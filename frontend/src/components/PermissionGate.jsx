import { usePermission } from '../context/PermissionContext';

export default function PermissionGate({ page, action = 'view', children, fallback = null }) {
  const { canView, canCreate, canEdit, canDelete } = usePermission();
  const map = { view: canView, create: canCreate, edit: canEdit, delete: canDelete };
  return map[action]?.(page) ? children : fallback;
}
