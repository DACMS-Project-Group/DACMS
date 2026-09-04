import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// ===== PUBLIC PAGES =====
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';

// ===== STUDENT PAGES =====
import Dashboard from './pages/Dashboard';
import StudentProfile from './pages/StudentProfile';

// ===== LECTURER PAGES =====
import LectureDashboard from './pages/LectureDashboard';
import ReviewApplications from './pages/ReviewApplications';
import ApplicationReview from './pages/ApplicationReview';

// ===== ADMIN PAGES =====
import AdminDashboard from './pages/AdminDashboard';
import BudgetManagement from './pages/BudgetManagement';
import CreateBudget from './pages/CreateBudget';
import EditBudget from './pages/EditBudget';
import BudgetDetails from './pages/BudgetDetails';
import ExportPayments from './pages/ExportPayments';

import ProtectedRoute from './routes/ProtectedRoute';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>  {/* ← Moved INSIDE BrowserRouter */}
        <Routes>
          
          {/* ===== PUBLIC ROUTES ===== */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />

          {/* ===== STUDENT ROUTES ===== */}
          <Route element={<ProtectedRoute requiredRoles={['student']} />}>
            <Route path="/student-dashboard" element={<Dashboard />} />
            <Route path="/student-profile" element={<StudentProfile />} />
          </Route>

          {/* ===== LECTURER ROUTES ===== */}
          <Route element={<ProtectedRoute requiredRoles={['lecturer']} />}>
            <Route path="/lecturer-dashboard" element={<LectureDashboard />} />
            <Route path="/review-applications" element={<ReviewApplications />} />
            <Route path="/application-review/:id" element={<ApplicationReview />} />
          </Route>

          {/* ===== ADMIN ROUTES ===== */}
          <Route element={<ProtectedRoute requiredRoles={['admin']} />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/budget-management" element={<BudgetManagement />} />
            <Route path="/create-budget" element={<CreateBudget />} />
            <Route path="/edit-budget/:id" element={<EditBudget />} />
            <Route path="/budget-details/:id" element={<BudgetDetails />} />
            <Route path="/export-payments" element={<ExportPayments />} />
          </Route>

          {/* ===== FALLBACK ===== */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;