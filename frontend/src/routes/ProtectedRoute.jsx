import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const HOME = {
  student: '/student-dashboard',
  lecturer: '/lecturer-dashboard',
  admin: '/admin-dashboard',
};

const ProtectedRoute = ({ requiredRoles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
    return <Navigate to={HOME[user.role] ?? '/login'} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
