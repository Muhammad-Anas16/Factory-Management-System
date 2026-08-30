import ResourcePage from './ResourcePage';
import { auditApi } from '../api/resources';
export default function Audit() { return <ResourcePage title="Audit Logs" subtitle="See who changed what and when." page="audit-logs" api={auditApi} fields={[]} columns={[{ key: 'user_id', label: 'User' }, { key: 'action', label: 'Action' }, { key: 'entity', label: 'Module' }, { key: 'entity_id', label: 'Record' }, { key: 'details', label: 'Details' }, { key: 'created_at', label: 'Date / Time' }]} />; }
