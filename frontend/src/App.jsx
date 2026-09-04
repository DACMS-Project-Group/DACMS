import { BrowserRouter, Routes, Route } from 'react-router-dom';

import AdminDashboard from './pages/AdminDashboard';
import BudgetManagement from './pages/BudgetManagement';
import CreateBudget from './pages/CreateBudget';
import EditBudget from './pages/EditBudget';
import BudgetDetails from './pages/BudgetDetails';
import ExportPayments from './pages/ExportPayments';

import Dashboard from './pages/Dashboard';
import StudentProfile from './pages/StudentProfile';
import ReviewApplications from './pages/ReviewApplications';
import ApplicationReview from './pages/ApplicationReview';
import Login from './pages/Login';

import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login */}
        <Route
          path="/"
          element={<Login />}
        /> 

        {/* Admin */}
        <Route
          path="/admin-dashboard"
          element={<AdminDashboard />}
        />

        <Route
          path="/budget-management"
          element={<BudgetManagement />}
        />

        <Route
          path="/budget-management/create"
          element={<CreateBudget />}
        />

        <Route
          path="/budget-management/edit/:id"
          element={<EditBudget />}
        />

        <Route
          path="/budget-management/details/:id"
          element={<BudgetDetails />}
        />

        <Route
          path="/export-payments"
          element={<ExportPayments />}
        />

        {/* Existing frontend pages */}
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/student-profile"
          element={<StudentProfile />}
        />

        <Route
          path="/review-applications"
          element={<ReviewApplications />}
        />

        <Route
          path="/application-review"
          element={<ApplicationReview />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;