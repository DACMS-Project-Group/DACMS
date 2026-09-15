import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// ===== PUBLIC PAGES =====
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';

// ===== STUDENT PAGES =====
import Dashboard from './pages/Dashboard';
import StudentProfile from './pages/StudentProfile';
import Applications from './pages/Applications';
import ApplyForAssistant from './pages/ApplyForAssistant';
import ApplicationDetail from './pages/ApplicationDetail';
import WorkTracking from './pages/WorkTracking';
import SessionDetail from './pages/SessionDetail';
import Claims from './pages/Claims';
import GenerateNewClaim from './pages/GenerateNewClaim';
import ClaimDetail from './pages/ClaimDetail';

// ===== LECTURER PAGES =====
import LectureDashboard from './pages/LectureDashboard';
import ReviewApplications from './pages/ReviewApplications';
import ApplicationReview from './pages/ApplicationReview';
import AssignAssistantResponsibilities from './pages/AssignAssistantResponsibilities';

// ===== ADMIN PAGES =====
import AdminDashboard from './pages/AdminDashboard';
import BudgetManagement from './pages/BudgetManagement';
import CreateBudget from './pages/CreateBudget';
import EditBudget from './pages/EditBudget';
import BudgetDetails from './pages/BudgetDetails';
import ExportPayments from './pages/ExportPayments';
import ClaimsVerification from './pages/ClaimsVerification';
import ClaimReview from './pages/ClaimReview';

import ProtectedRoute from './routes/ProtectedRoute';
import './index.css';

// ===== NAVIGATION ITEMS =====
import Notifications from './pages/Notifications';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          {/* ===== PUBLIC ROUTES ===== */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />

          {/* ===== STUDENT ROUTES ===== */}
          <Route element={<ProtectedRoute requiredRoles={['student']} />}>
            <Route path="/student-dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<StudentProfile />} />
            <Route path="/applications" element={<Applications />} />
            <Route path="/apply-for-assistant" element={<ApplyForAssistant />} />
            <Route path="/application-detail/:id" element={<ApplicationDetail />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/work-tracking" element={<WorkTracking />} />
            <Route path="/session-detail/:id" element={<SessionDetail />} />
            <Route path="/claims" element={<Claims />} />
            <Route path="/generate-new-claim" element={<GenerateNewClaim />} />
            <Route path="/claim-detail/:id" element={<ClaimDetail />} />
          </Route>

          {/* ===== LECTURER ROUTES ===== */}
          <Route element={<ProtectedRoute requiredRoles={['lecturer']} />}>
            <Route path="/lecturer-dashboard" element={<LectureDashboard />} />
            <Route path="/review-applications" element={<ReviewApplications />} />
            <Route path="/application-review/:id" element={<ApplicationReview />} />
            <Route path="/assign-responsibilities" element={<AssignAssistantResponsibilities />} />
            <Route path="/notifications" element={<Notifications />} />
          </Route>

          {/* ===== ADMIN ROUTES ===== */}
          <Route element={<ProtectedRoute requiredRoles={['admin']} />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/budget-management" element={<BudgetManagement />} />
            <Route path="/create-budget" element={<CreateBudget />} />
            <Route path="/edit-budget/:id" element={<EditBudget />} />
            <Route path="/budget-details/:id" element={<BudgetDetails />} />
            <Route
              path="/claims-verification"
              element={<ClaimsVerification />}
            />
            <Route
              path="/claim-review/:id"
              element={<ClaimReview />}
            />
            <Route path="/export-payments" element={<ExportPayments />} />
            <Route path="/notifications" element={<Notifications />} />
          </Route>

          {/* ===== FALLBACK ===== */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;