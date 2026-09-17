import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { liveNotifs } from '../contexts/NotificationContext'

const Sidebar = ({ userRole = 'student' }) => {
  // Normalise the role so that Lecturer, LECTURER, lecturer, etc.
  // are treated the same way.
  const role = userRole?.toLowerCase().trim();

<<<<<<< HEAD
  const { logout } = useAuth();
  const { unreadCount } = liveNotifs();

=======
>>>>>>> ab698f2 (Fix role-based login and sidebar)
  // Student Navigation
  const studentNavItems = [
    { name: 'Dashboard', href: '/student-dashboard' },
    { name: 'Applications', href: '/applications' },
    { name: 'Work Tracking', href: '/work-tracking' },
    { name: 'Claims', href: '/claims' },
    { name: 'Profile', href: '/profile' },
    { name: 'Notifications', href: '/notifications' },
  ];

  // Lecturer Navigation
  const lecturerNavItems = [
    { name: 'Dashboard', href: '/lecturer-dashboard' },
    { name: 'Assistant Positions', href: '/assistant-positions' },
    { name: 'Review Applications', href: '/review-applications' },
    { name: 'Assign Duties', href: '/assign-responsibilities' },
    { name: 'Review Claims', href: '/review-claims' },
    { name: 'Verify Hours', href: '/verify-hours' },
    { name: 'Notifications', href: '/notifications' },
  ];

  // Administrator Navigation
  const adminNavItems = [
    { name: 'Dashboard', href: '/admin-dashboard' },
    { name: 'Budget Management', href: '/budget-management' },
    { name: 'Appointment Approvals', href: '/appointment-approvals' },
    { name: 'Claims Verification', href: '/claims-verification' },
    { name: 'Notifications', href: '/notifications' },
  ];

  const navItems =
    role === 'lecturer'
      ? lecturerNavItems
      : role === 'admin'
        ? adminNavItems
        : studentNavItems;

  return (
    <aside className="w-64 bg-primary-dark text-white flex flex-col min-h-screen">

      {/* Navigation */}
      <nav className="flex-1 p-4 pt-6">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              `
              block px-4 py-3 rounded-xl
              transition-colors duration-200 mb-2
              ${
                isActive
                  ? 'bg-primary-light font-semibold'
                  : 'hover:bg-primary-light'
              }
              `
            }
          >
            <span>{item.name}</span>

            {item.name === 'Notifications'  && (
              <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-full ml-2">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Navigation */}
      <div className="p-4">
<<<<<<< HEAD
=======

        {/* Profile is strictly for students */}
        {role === 'student' && (
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `
              block px-4 py-3 rounded-xl
              transition-colors duration-200 mb-2
              ${
                isActive
                  ? 'bg-primary-light font-semibold'
                  : 'hover:bg-primary-light'
              }
              `
            }
          >
            Profile
          </NavLink>
        )}
>>>>>>> ab698f2 (Fix role-based login and sidebar)

        {/* Profile is strictly for students */}
        {role === 'student' && (
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `
              block px-4 py-3 rounded-xl
              transition-colors duration-200 mb-2
              ${
                isActive
                  ? 'bg-primary-light font-semibold'
                  : 'hover:bg-primary-light'
              }
              `
            }
          >
            Profile
          </NavLink>
        )}

        <button
          type="button"
          onClick={logout}
          className="block w-full text-left px-4 py-3 rounded-xl hover:bg-primary-light transition-colors duration-200"
        >
          Logout
        </button>
      </div>

    </aside>
  );
};

export default Sidebar;