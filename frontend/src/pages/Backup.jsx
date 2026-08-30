import { useEffect, useState } from 'react';
import PageHeader from '../components/PageHeader';
import Toast from '../components/Toast';
import { backupApi } from '../api/resources';

export default function Backup() {
  const [items, setItems] = useState([]); const [toast, setToast] = useState(null); const [busy, setBusy] = useState(false);
  const load = async () => { try { const response = await backupApi.list(); const data = response.data?.data; setItems(data?.items ?? data ?? []); } catch (err) { setToast({ type: 'error', message: err.response?.data?.message || 'Unable to load backups.' }); } };
  useEffect(() => { load(); }, []);
  const backup = async () => { setBusy(true); try { await backupApi.create(); await load(); setToast({ type: 'success', message: 'Backup requested successfully.' }); } catch (err) { setToast({ type: 'error', message: err.response?.data?.message || 'Backup failed.' }); } finally { setBusy(false); } };
  return <div className="page"><Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} /><PageHeader title="Backup" subtitle="Protect the local SQLite data with a simple backup workflow." actions={<button className="primary-button" onClick={backup} disabled={busy}>{busy ? 'Creating…' : 'Create Backup'}</button>} /><div className="panel"><div className="panel-title">Backup history</div><div className="table-scroll"><table><thead><tr><th>File</th><th>Date</th><th>Status</th></tr></thead><tbody>{items.map((item, i) => <tr key={item.id || i}><td>{item.file_name || item.path || 'Backup'}</td><td>{item.created_at || item.date || '—'}</td><td><span className="status-badge success">Available</span></td></tr>)}</tbody></table></div></div></div>;
}
