import { useEffect, useMemo, useState } from 'react';
import PageHeader from '../components/PageHeader';
import { usersApi } from '../api/resources';
import { usePermission } from '../context/PermissionContext';

function PeoplePage({ title, subtitle, role }) {
  const { canEdit } = usePermission();
  const [users, setUsers] = useState([]); const [search, setSearch] = useState(''); const [error, setError] = useState('');
  useEffect(() => { usersApi.list().then((response) => { const data = response.data?.data; setUsers(data?.items ?? data ?? response.data?.items ?? []); }).catch((err) => setError(err.response?.data?.message || 'Unable to load users.')); }, []);
  const filtered = useMemo(() => users.filter((user) => String(user.role || '').toLowerCase() === role && `${user.username} ${user.role}`.toLowerCase().includes(search.toLowerCase())), [users, role, search]);
  return <div className="page"><PageHeader title={title} subtitle={subtitle} /><div className="toolbar"><input className="search-input" placeholder={`Search ${title.toLowerCase()}…`} value={search} onChange={(e) => setSearch(e.target.value)} /><span className="result-count">{filtered.length} users</span></div>{error && <div className="info-banner">{error}</div>}<div className="table-card"><div className="table-scroll"><table><thead><tr><th>ID</th><th>Username</th><th>Role</th><th>Status</th><th>Permission System</th>{canEdit('users') && <th>Account</th>}</tr></thead><tbody>{filtered.length ? filtered.map((user) => <tr key={user.id}><td>{user.id}</td><td>{user.username}</td><td><span className="badge">{user.role}</span></td><td><span className={`status-badge ${user.isActive === false ? 'muted' : 'success'}`}>{user.isActive === false ? 'Inactive' : 'Active'}</span></td><td>{user.isPermission === false ? 'Disabled' : 'Enabled'}</td>{canEdit('users') && <td><span className="muted-text">Edit from Users</span></td>}</tr>) : <tr><td colSpan={canEdit('users') ? 6 : 5}><div className="table-empty">No {title.toLowerCase()} found.</div></td></tr>}</tbody></table></div></div></div>;
}

export function Karigars() { return <PeoplePage title="Karigars" subtitle="Worker users whose piece-based work contributes to weekly payroll." role="karigar" />; }
export function Helpers() { return <PeoplePage title="Helpers" subtitle="Helper users managed through the same users table." role="helper" />; }
export function Supervisors() { return <PeoplePage title="Supervisors" subtitle="Supervisor users with operational permissions." role="supervisor" />; }
