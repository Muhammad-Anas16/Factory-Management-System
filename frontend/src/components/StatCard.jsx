export default function StatCard({ label, value, hint, icon = '•' }) {
  return (
    <div className="stat-card">
      <div className="stat-top"><span className="stat-icon">{icon}</span><span className="stat-label">{label}</span></div>
      <div className="stat-value">{value}</div>
      {hint && <div className="stat-hint">{hint}</div>}
    </div>
  );
}
