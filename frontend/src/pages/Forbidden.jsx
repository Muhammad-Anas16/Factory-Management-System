import { Link } from 'react-router';
export default function Forbidden() {
  return <div className="empty-state"><div className="empty-icon">!</div><h2>Access restricted</h2><p>You do not have permission to open this page.</p><Link className="primary-button" to="/dashboard">Back to dashboard</Link></div>;
}
