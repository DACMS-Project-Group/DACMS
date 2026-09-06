import { Navigate, Outlet } from 'react-router-dom';

// SIMPLE DEMO VERSION - No authentication required
const ProtectedRoute = ({ requiredRoles = [] }) => {
  // For demo mode, just render the outlet (allow all access)
  return <Outlet />;
};

export default ProtectedRoute;