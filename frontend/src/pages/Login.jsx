import { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => setError(''), [form.username, form.password]);

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      await login(form);
      navigate(location.state?.from || '/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Unable to login.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="login-brand"><div className="brand-mark large">FM</div><div><h1>Factory Management</h1><p>Local business operations</p></div></div>
        <div className="login-intro"><h2>Welcome back</h2><p>Sign in to continue to your authorized workspace.</p></div>
        <form onSubmit={submit} className="form-stack">
          <label>Username<input value={form.username} onChange={(e) => setForm((current) => ({ ...current, username: e.target.value }))} autoComplete="username" required /></label>
          <label>Password<input type="password" value={form.password} onChange={(e) => setForm((current) => ({ ...current, password: e.target.value }))} autoComplete="current-password" required /></label>
          {error && <div className="form-error">{error}</div>}
          <button className="primary-button full-width" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
        </form>
        <div className="login-note">Access is controlled by your role and page-level permissions.</div>
      </div>
    </div>
  );
}
