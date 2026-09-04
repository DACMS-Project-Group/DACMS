import { NavLink } from 'react-router-dom';

const PageNavigation = () => {
  const linkStyle = ({ isActive }) =>
    `px-4 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? 'bg-primary text-white'
        : 'text-gray-700 hover:bg-gray-100'
    }`;

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="flex items-center gap-3">

        <NavLink
          to="/admin-dashboard"
          className={linkStyle}
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/budget-management"
          className={linkStyle}
        >
          Budget Management
        </NavLink>

        <NavLink
          to="/export-payments"
          className={linkStyle}
        >
          Export Payments
        </NavLink>

      </div>
    </div>
  );
};

export default PageNavigation;