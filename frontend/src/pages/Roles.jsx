import ResourcePage from './ResourcePage';
import { rolesApi } from '../api/resources';

export default function Roles() {
  return <ResourcePage title="Roles" subtitle="Database-driven roles; role names are not hard-coded as the authority." page="roles" api={rolesApi} fields={[{ name: 'name', label: 'Role name', required: true }, { name: 'description', label: 'Description', type: 'textarea', full: true }, { name: 'is_active', label: 'Status', type: 'checkbox' }]} columns={[{ key: 'name', label: 'Role' }, { key: 'description', label: 'Description' }, { key: 'is_system_role', label: 'System role' }, { key: 'is_active', label: 'Active' }]} />;
}
