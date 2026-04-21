import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import PublicNavbar from './components/layout/PublicNavbar';
import DashboardLayout from './components/layout/DashboardLayout';

import LandingPage from "./pages/LandingPage";
import BrowsePage from "./pages/BrowsePage";
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/AdminDashboard';
import AgentDashboard from './pages/AgentDashboard';
import AgentProfile from './pages/AgentProfile';
import UserDashboard from './pages/UserDashboard';
import SavedHomesPage from './pages/SavedHomesPage';
import AgentPayment from './pages/AgentPayment';
import AIChatPage from './pages/AIChatPage';

import RoleGate from './components/auth/RoleGate';
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          

          <Route element={<><PublicNavbar /><LandingPage /></>} path="/" />
          <Route element={<><PublicNavbar /><BrowsePage /></>} path="/browse" />
          <Route element={<><PublicNavbar /><LoginPage /></>} path="/login" />
          <Route element={<><PublicNavbar /><RegisterPage /></>} path="/register" />

          {/* ==================== 2. PROTECTED DASHBOARDS ==================== */}
          <Route element={<DashboardLayout />}>
            
            <Route path="/ai-chat" element={<AIChatPage />} />

            <Route element={<RoleGate allowedRoles={['admin']} />}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>

            <Route element={<RoleGate allowedRoles={['agent']} />}>
              <Route path="/agent" element={<AgentDashboard />} />
              <Route path="/agent/profile" element={<AgentProfile />} />
              <Route path="/agent/payment" element={<AgentPayment />} />
            </Route>

            <Route element={<RoleGate allowedRoles={['user']} />}>
              <Route path="/user" element={<UserDashboard />} />
              <Route path="/user/saved" element={<SavedHomesPage />} />
            </Route>

          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
          
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
