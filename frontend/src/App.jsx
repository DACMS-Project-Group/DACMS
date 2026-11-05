import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SidebarProvider } from './contexts/SidebarContext';
import { DensityProvider } from './contexts/DensityContext';

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
import StudentModules from './pages/StudentModules';

// ===== LECTURER PAGES =====
import LectureDashboard from './pages/LectureDashboard';
import ReviewApplications from './pages/ReviewApplications';
import AssignAssistantResponsibilities from './pages/AssignAssistantResponsibilities';
import VerifyWorkHours from './pages/VerifyWorkHours';
import AssistantListings from './pages/AssistantListings';

// ===== ADMIN PAGES =====
import TwoFactorAuth from './pages/TwoFactorAuth';
import AdminDashboard from './pages/AdminDashboard';
import BudgetManagement from './pages/BudgetManagement';
import BudgetForm from './pages/BudgetForm';
import BudgetDetails from './pages/BudgetDetails';
import ClaimsWorkspace from './pages/ClaimsWorkspace';
import ClaimReview from './pages/ClaimReview';
import AppointmentApprovals from './pages/AppointmentApprovals';
import AppointmentReview from './pages/AppointmentReview';
import ReviewClaims from './pages/ReviewClaims';
import AuditLogs from './pages/AuditLogs';

// ===== NOTIFICATION BADGE =====
import { NotificationProvider } from './contexts/notificationContext';

// ===== SHARED PAGES =====
import Notifications from './pages/Notifications';

import ProtectedRoute from './routes/ProtectedRoute';
import AppLayout from './components/AppLayout';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <DensityProvider>
        <AuthProvider>
        <NotificationProvider>
          <SidebarProvider>
          <Routes>

            {/* ===== PUBLIC ROUTES ===== */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            {/* 2FA happens before a session exists, so it cannot sit behind ProtectedRoute */}
            <Route path="/2fa" element={<TwoFactorAuth />} />

            {/* ===== SHARED ROUTES ===== */}
            <Route
              element={
                <ProtectedRoute
                  requiredRoles={['student', 'lecturer', 'admin']}
                />
              }
            >
              <Route element={<AppLayout />}>
                <Route path="/notifications" element={<Notifications />} />
              </Route>
            </Route>

            {/* ===== STUDENT ROUTES ===== */}
            <Route element={<ProtectedRoute requiredRoles={['student']} />}>
              <Route element={<AppLayout />}>
                <Route path="/student-dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<StudentProfile />} />
                <Route path="/applications" element={<Applications />} />
                <Route path="/apply-for-assistant" element={<ApplyForAssistant />} />
                <Route path="/application-detail/:id" element={<ApplicationDetail />} />
                <Route path="/work-tracking" element={<WorkTracking />} />
                <Route path="/session-detail/:id" element={<SessionDetail />} />
                <Route path="/claims" element={<Claims />} />
                <Route path="/generate-new-claim" element={<GenerateNewClaim />} />
                <Route path="/claim-detail/:id" element={<ClaimDetail />} />
                <Route path="/modules" element={<StudentModules />} />
              </Route>
            </Route>

            {/* ===== LECTURER ROUTES ===== */}
            <Route element={<ProtectedRoute requiredRoles={['lecturer']} />}>
              <Route element={<AppLayout />}>
                <Route path="/lecturer-dashboard" element={<LectureDashboard />} />
                <Route path="/review-applications" element={<ReviewApplications />} />
                <Route
                  path="/assign-responsibilities"
                  element={<AssignAssistantResponsibilities />}
                />
                <Route path="/review-claims" element={<ReviewClaims />} />
                <Route path="/review-claim/:id" element={<ClaimReview />} />
                <Route
                  path="/assistant-listings"
                  element={<AssistantListings />}
                />
                <Route path="/verify-hours" element={<VerifyWorkHours />} />
                <Route path="/lecturer-budgets" element={<BudgetManagement />} />
                <Route path="/lecturer-budget-details/:id" element={<BudgetDetails />} />
              </Route>
            </Route>

            {/* ===== ADMIN ROUTES ===== */}
            <Route element={<ProtectedRoute requiredRoles={['admin']} />}>
              <Route element={<AppLayout />}>
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/budget-management" element={<BudgetManagement />} />
                <Route path="/create-budget" element={<BudgetForm />} />
                <Route path="/edit-budget/:id" element={<BudgetForm />} />
                <Route path="/budget-details/:id" element={<BudgetDetails />} />
                <Route path="/admin/claims" element={<ClaimsWorkspace />} />
                <Route
                  path="/claims-verification"
                  element={<Navigate to="/admin/claims" replace />}
                />
                <Route
                  path="/claim-review/:id"
                  element={<ClaimReview />}
                />
                <Route
                  path="/export-payments"
                  element={
                    <Navigate to="/admin/claims?tab=export" replace />
                  }
                />
                <Route
                  path="/appointment-approvals"
                  element={<AppointmentApprovals />}
                />
                <Route
                  path="/appointment-review/:id"
                  element={<AppointmentReview />}
                />
                <Route path="/audit-logs" element={<AuditLogs />} />
              </Route>
            </Route>

            {/* ===== FALLBACK ===== */}
            <Route path="*" element={<Navigate to="/" replace />} />

          </Routes>
          </SidebarProvider>
        </NotificationProvider>
      </AuthProvider>
      </DensityProvider>
    </BrowserRouter>
  );
}

export default App;