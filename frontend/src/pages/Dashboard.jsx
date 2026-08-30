import { useEffect, useState } from 'react';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import { dashboardApi } from '../api/resources';
import { money } from '../utils/format';

const statMap = [
  ['users', 'Active Users', 'U'],
  ['articles', 'Active Articles', 'A'],
  ['pendingWork', 'Pending Work', 'P'],
  ['completedWork', 'Completed Work', '✓'],
  ['currentProduction', 'Current Production', 'P'],
  ['pendingPayments', 'Pending Payments', '₨'],
  ['users', 'Current Users', 'U'],
  ['articles', 'Article Catalog', 'A'],
];

export default function Dashboard() {
  const [data, setData] = useState({});
  const [error, setError] = useState('');
  useEffect(() => { dashboardApi.get().then((response) => setData(response.data?.data || response.data || {})).catch((err) => setError(err.response?.data?.message || 'Dashboard API is unavailable.')); }, []);
  return <div className="page"><PageHeader title="Dashboard" subtitle="A quick operational view of production, people and payments." />{error && <div className="info-banner">{error} You can still navigate through the modules.</div>}<div className="stats-grid">{statMap.map(([key, label, icon]) => <StatCard key={key} label={label} icon={icon} value={key === 'pendingPayments' ? money(data[key]) : (data[key] ?? 0)} />)}</div><div className="dashboard-grid"><section className="panel"><div className="panel-title">Business workflow</div><div className="workflow"><span>Article / Style</span><b>→</b><span>Production</span><b>→</b><span>Allocation</span><b>→</b><span>Completion</span><b>→</b><span>Payroll</span><b>→</b><span>Payment</span></div></section><section className="panel"><div className="panel-title">Recent activity</div><div className="empty-inline">Latest activity appears here as records are created or updated.</div></section></div></div>;
}
