import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function RoleGate({ allowedRoles }) {
  const { user } = useAuth();

  if (!allowedRoles.includes(user?.role)) {

    return <Navigate to={`/${user?.role}`} replace />;
  }

  return <Outlet />;
}