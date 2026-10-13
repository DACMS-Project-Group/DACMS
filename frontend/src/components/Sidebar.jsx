import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSidebar } from '../contexts/SidebarContext';

const Sidebar = ({ userRole = 'student' }) => {
  const role = userRole?.toLowerCase().trim();
  const { logout } = useAuth();
  const { isOpen, close } = useSidebar();

  const studentNavItems = [
    { name: 'Dashboard', href: '/student-dashboard' },
    { name: 'Applications', href: '/applications' },
    { name: 'Modules', href: '/modules' },
    { name: 'Work Tracking', href: '/work-tracking' },
    { name: 'Claims', href: '/claims' },
    { name: 'Profile', href: '/profile' },
  ];

  const lecturerNavItems = [
    { name: 'Dashboard', href: '/lecturer-dashboard' },
    { name: 'Assistant Listings', href: '/assistant-listings' },
    { name: 'Review Applications', href: '/review-applications' },
    { name: 'Assign Duties', href: '/assign-responsibilities' },
    { name: 'Review Claims', href: '/review-claims' },
    { name: 'Verify Hours', href: '/verify-hours' },
    { name: 'Budgets', href: '/lecturer-budgets' },
  ];

  const adminNavItems = [
    { name: 'Dashboard', href: '/admin-dashboard' },
    { name: 'Budget Management', href: '/budget-management' },
    { name: 'Appointment Approvals', href: '/appointment-approvals' },
    { name: 'Claims Verification', href: '/claims-verification' },
  ];

  const navItems =
    role === 'lecturer'
      ? lecturerNavItems
      : role === 'admin'
        ? adminNavItems
        : studentNavItems;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={close}
          aria-hidden="true"
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
        />
      )}

      <aside
        className={[
          // --- Mobile: fixed off-canvas drawer ---
          'fixed top-0 left-0 z-50',
          'h-screen w-64',
          'bg-primary-dark text-white',
          'flex flex-col',
          'transform transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full',

          // --- Desktop: sticky full-height column, never scrolls away ---
          'md:sticky md:top-24 md:z-auto md:h-[calc(100vh-6rem)] md:translate-x-0',
        ].join(' ')}
      >
        <nav className="min-h-0 flex-1 overflow-y-auto p-4 pt-6">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              onClick={close}
              className={({ isActive }) =>
                `block px-4 py-3 rounded-xl transition-colors duration-200 mb-2 ${
                  isActive
                    ? 'bg-primary-light font-semibold'
                    : 'hover:bg-primary-light'
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-4">
          <button
            type="button"
            onClick={logout}
            className="block w-full text-left px-4 py-3 rounded-xl hover:bg-primary-light transition-colors duration-200"
          >
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;