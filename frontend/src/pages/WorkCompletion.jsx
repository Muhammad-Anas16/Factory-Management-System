import { useEffect, useState } from 'react';
import PageHeader from '../components/PageHeader';
import Toast from '../components/Toast';
import { workApi } from '../api/resources';
import { usePermission } from '../context/PermissionContext';

export default function WorkCompletion() {
  const { canEdit } = usePermission();
  const [items, setItems] = useState([]); const [toast, setToast] = useState(null);
  const load = async () => { try { const response = await workApi.list(); const data = response.data?.data; setItems(data?.items ?? data ?? []); } catch (err) { setToast({ type: 'error', message: err.response?.data?.message || 'Unable to load work.' }); } };
  useEffect(() => { load(); }, []);
  const complete = async (id) => { try { await workApi.complete(id); await load(); setToast({ type: 'success', message: 'Work marked completed.' }); } catch (err) { setToast({ type: 'error', message: err.response?.data?.message || 'Unable to complete work.' }); } };
  return <div className="page"><Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} /><PageHeader title="Work Completion" subtitle="Confirm completion of assigned work while keeping an auditable status history." /><div className="table-card"><div className="table-scroll"><table><thead><tr><th>Article</th><th>Worker</th><th>Assigned</th><th>Completed</th><th>Pending</th><th>Status</th><th>Action</th></tr></thead><tbody>{items.map((item) => <tr key={item.id}><td>{item.article_id}</td><td>{item.worker_id}</td><td>{item.quantity}</td><td>{item.completed_quantity ?? 0}</td><td>{item.pending_quantity ?? Math.max(0, Number(item.quantity || 0) - Number(item.completed_quantity || 0))}</td><td><span className={`status-badge ${item.status === 'Completed' ? 'success' : 'muted'}`}>{item.status || 'Pending'}</span></td><td>{canEdit('work-completion') && item.status !== 'Completed' ? <button className="text-button" onClick={() => complete(item.id)}>Mark Completed</button> : '—'}</td></tr>)}</tbody></table></div></div></div>;
}
