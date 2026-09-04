import { BrowserRouter, Routes, Route } from 'react-router-dom';

import AdminDashboard from './pages/AdminDashboard';
import BudgetManagement from './pages/BudgetManagement';
import CreateBudget from './pages/CreateBudget';
import EditBudget from './pages/EditBudget';
import BudgetDetails from './pages/BudgetDetails';
import ExportPayments from './pages/ExportPayments';
//import PageNavigation from './components/PageNavigation';

import './index.css';

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<AdminDashboard />}
        />

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

      </Routes>

    </BrowserRouter>
  );
}

export default App;