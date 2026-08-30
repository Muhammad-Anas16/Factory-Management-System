import PageHeader from '../components/PageHeader';
import { useAuth } from '../context/AuthContext';
import { fileUrl } from '../utils/format';

export default function MyProfile() {
  const { user } = useAuth();
  return <div className="page"><PageHeader title="My Profile" subtitle="Your account identity and access summary." /><div className="profile-panel"><div>{user?.profile_picture ? <img className="profile-photo" src={fileUrl(user.profile_picture)} alt="" /> : <div className="profile-photo placeholder">{(user?.username || 'U')[0]}</div>}</div><div><div className="eyebrow">Username</div><h2>{user?.username || 'User'}</h2><p className="muted-text">Role: {user?.role || '—'}</p><p className="muted-text">Permission system: {user?.is_permission === false ? 'Disabled' : 'Enabled'}</p></div></div></div>;
}
