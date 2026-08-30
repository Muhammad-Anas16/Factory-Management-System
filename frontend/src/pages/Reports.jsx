import { useEffect, useState } from 'react';
import PageHeader from '../components/PageHeader';
import { reportsApi } from '../api/resources';
import { money } from '../utils/format';

export default function Reports() {
  const [data, setData] = useState([]); const [from, setFrom] = useState(''); const [to, setTo] = useState(''); const [error, setError] = useState('');
  const run = async () => { try { const response = await reportsApi.get({ from, to }); const payload = response.data?.data; setData(Array.isArray(payload) ? payload : [...(payload?.work || []), ...(payload?.production || [])]); setError(''); } catch (err) { setError(err.response?.data?.message || 'Report service is unavailable.'); } };
  useEffect(() => { run(); }, []);
  return <div className="page"><PageHeader title="Reports" subtitle="Filter production and payment records by date and business dimensions." /><div className="filter-card"><label>From<input type="date" value={from} onChange={(e) => setFrom(e.target.value)} /></label><label>To<input type="date" value={to} onChange={(e) => setTo(e.target.value)} /></label><button className="primary-button" onClick={run}>Run Report</button></div>{error && <div className="info-banner">{error}</div>}<div className="table-card"><div className="table-scroll"><table><thead><tr><th>Worker</th><th>Article</th><th>Pieces</th><th>Rate</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead><tbody>{data.map((row, i) => <tr key={row.id || i}><td>{row.worker_name || row.worker_id || '—'}</td><td>{row.article_name || row.article_id || '—'}</td><td>{row.pieces ?? row.assigned_quantity ?? row.quantity ?? 0}</td><td>{money(row.rate)}</td><td>{money(row.amount ?? ((Number(row.completed_quantity || 0)) * Number(row.rate || 0)))}</td><td>{row.status || '—'}</td><td>{row.date || row.assigned_date || row.production_date || row.created_at || '—'}</td></tr>)}</tbody></table></div></div></div>;
}
