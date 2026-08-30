import { NavLink, Outlet, useLocation, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { usePermission } from '../context/PermissionContext';
import { PAGE_DEFINITIONS } from '../utils/pages';

const navGroups = [
  { title: 'Overview', items: ['dashboard'] },
  { title: 'People', items: ['users', 'roles', 'karigars', 'helpers', 'supervisors'] },
  { title: 'Production', items: ['categories', 'articles', 'production', 'work-allocation', 'work-completion'] },
  { title: 'Accounts', items: ['payroll', 'payments', 'reports'] },
  { title: 'Commercial', items: ['parties', 'challans', 'billing'] },
  { title: 'System', items: ['audit-logs', 'backup', 'settings'] },
];

const iconMap = {
  dashboard: '⌂', users: 'U', roles: 'R', karigars: 'K', helpers: 'H', supervisors: 'S', categories: 'C', articles: 'A', production: 'P',
  'work-allocation': 'W', 'work-completion': '✓', payroll: '₨', payments: '₱', reports: '▤', parties: '◆', challans: '▣', billing: '▧',
  'audit-logs': '◷', backup: '↥', settings: '⚙',
};

export default function MainLayout() {
  const { user, logout } = useAuth();
  const { canView, isAdmin } = usePermission();
  const navigate = useNavigate();
  const location = useLocation();

  const labelFor = (key) => PAGE_DEFINITIONS.find((page) => page.key === key)?.label || key;

  const visibleItems = navGroups.map((group) => ({
    ...group,
    items: group.items.filter((key) => isAdmin || canView(key)),
  })).filter((group) => group.items.length);

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <div className="brand-mark">FM</div>
          <div><div className="brand-name">Factory Management</div><div className="brand-subtitle">Local Production Suite</div></div>
        </div>
        <nav className="nav-groups">
          {visibleItems.map((group) => (
            <div className="nav-group" key={group.title}>
              <div className="nav-group-title">{group.title}</div>
              {group.items.map((key) => (
                <NavLink key={key} to={`/${key}`} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                  <span className="nav-icon">{iconMap[key]}</span>
                  <span>{labelFor(key)}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="small-status"><span className="status-dot" /> Local network</div>
          <button type="button" className="secondary-button full-width" onClick={handleLogout}>Sign out</button>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="crumb">{location.pathname === '/' ? 'Dashboard' : labelFor(location.pathname.slice(1).split('/')[0])}</div>
          <div className="user-menu">
            <div className="avatar">{(user?.username || 'U').slice(0, 1).toUpperCase()}</div>
            <div className="user-text"><strong>{user?.username || 'User'}</strong><span>{user?.role || 'User'}</span></div>
          </div>
        </header>
        <section className="content-wrap"><Outlet /></section>
      </main>
    </div>
  );
}
