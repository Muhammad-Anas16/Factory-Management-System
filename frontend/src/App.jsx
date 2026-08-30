import { Navigate, Route, Routes } from 'react-router';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './routes/ProtectedRoute';
import Login from './pages/Login';
import Forbidden from './pages/Forbidden';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Roles from './pages/Roles';
import Articles from './pages/Articles';
import Production from './pages/Production';
import WorkAllocation from './pages/WorkAllocation';
import WorkCompletion from './pages/WorkCompletion';
import Payroll from './pages/Payroll';
import Payments from './pages/Payments';
import Reports from './pages/Reports';
import Challans from './pages/Challans';
import Bills from './pages/Bills';
import Audit from './pages/Audit';
import Backup from './pages/Backup';
import MyProfile from './pages/MyProfile';
import Prediction from './pages/SettingsPrediction';
import { Categories, Parties, Settings } from './pages/SimplePages';
import { Karigars, Helpers, Supervisors } from './pages/People';

export default function App() {
  return <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/forbidden" element={<Forbidden />} />
    <Route path="/" element={<Navigate to="/dashboard" replace />} />
    <Route element={<ProtectedRoute />}>
      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<MyProfile />} />
        <Route element={<ProtectedRoute page="users" />}><Route path="/users" element={<Users />} /></Route>
        <Route element={<ProtectedRoute page="roles" />}><Route path="/roles" element={<Roles />} /></Route>
        <Route element={<ProtectedRoute page="karigars" />}><Route path="/karigars" element={<Karigars />} /></Route>
        <Route element={<ProtectedRoute page="helpers" />}><Route path="/helpers" element={<Helpers />} /></Route>
        <Route element={<ProtectedRoute page="supervisors" />}><Route path="/supervisors" element={<Supervisors />} /></Route>
        <Route element={<ProtectedRoute page="categories" />}><Route path="/categories" element={<Categories />} /></Route>
        <Route element={<ProtectedRoute page="articles" />}><Route path="/articles" element={<Articles />} /></Route>
        <Route element={<ProtectedRoute page="production" />}><Route path="/production" element={<Production />} /></Route>
        <Route element={<ProtectedRoute page="work-allocation" />}><Route path="/work-allocation" element={<WorkAllocation />} /></Route>
        <Route element={<ProtectedRoute page="work-completion" />}><Route path="/work-completion" element={<WorkCompletion />} /></Route>
        <Route element={<ProtectedRoute page="payroll" />}><Route path="/payroll" element={<Payroll />} /></Route>
        <Route element={<ProtectedRoute page="payments" />}><Route path="/payments" element={<Payments />} /></Route>
        <Route element={<ProtectedRoute page="reports" />}><Route path="/reports" element={<Reports />} /></Route>
        <Route element={<ProtectedRoute page="parties" />}><Route path="/parties" element={<Parties />} /></Route>
        <Route element={<ProtectedRoute page="challans" />}><Route path="/challans" element={<Challans />} /></Route>
        <Route element={<ProtectedRoute page="billing" />}><Route path="/billing" element={<Bills />} /></Route>
        <Route element={<ProtectedRoute page="audit-logs" />}><Route path="/audit-logs" element={<Audit />} /></Route>
        <Route element={<ProtectedRoute page="backup" />}><Route path="/backup" element={<Backup />} /></Route>
        <Route element={<ProtectedRoute page="settings" />}><Route path="/settings" element={<Settings />} /></Route>
        <Route element={<ProtectedRoute page="reports" />}><Route path="/prediction" element={<Prediction />} /></Route>
      </Route>
    </Route>
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes>;
}
