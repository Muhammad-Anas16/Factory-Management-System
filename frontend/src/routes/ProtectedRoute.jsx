import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { usePermission } from '../context/PermissionContext';

export default function ProtectedRoute({ page = null }) {
  const { isAuthenticated, loading } = useAuth();
  const { canView, isAdmin } = usePermission();
  const location = useLocation();

  if (loading) return <div className="route-loading">Loading application…</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (page && !isAdmin && !canView(page)) return <Navigate to="/forbidden" replace />;
  return <Outlet />;
}
