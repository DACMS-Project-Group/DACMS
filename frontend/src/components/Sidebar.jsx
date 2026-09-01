
const Sidebar = ({ userRole = 'student' }) => {
  // Student Navigation
  const studentNavItems = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Applications', href: '/applications' },
    { name: 'Work Tracking', href: '/work-tracking' },
    { name: 'Claims', href: '/claims' },
    { name: 'Profile', href: '/profile' },
    { name: 'Notifications', href: '/notifications' },
  ];

  // Lecturer Navigation
  const lecturerNavItems = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Module Management', href: '/modules' },
    { name: 'Review Applications', href: '/review-applications' },
    { name: 'Assign Duties', href: '/assign-duties' },
    { name: 'Verify Hours', href: '/verify-hours' },
    { name: 'Notifications', href: '/notifications' },
  ];

  // Administrator Navigation
  const adminNavItems = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Budget Management', href: '/budget-management' },
    { name: 'Appointment Approvals', href: '/appointment-approvals' },
    { name: 'Claims Verification', href: '/claims-verification' },
    { name: 'User Management', href: '/user-management' },
    { name: 'Reports', href: '/reports' },
    { name: 'Notifications', href: '/notifications' },
  ];

  const navItems =
    userRole === 'lecturer'
      ? lecturerNavItems
      : userRole === 'admin'
        ? adminNavItems
        : studentNavItems;

  return (
    <aside className="w-64 bg-primary-dark text-white flex flex-col min-h-screen">
      
      <nav className="flex-1 p-4 pt-6">
        {navItems.map((item, index) => (
          <a
            key={index}
            href={item.href}
            className={`
              block px-4 py-3 rounded-xl 
              transition-colors duration-200 mb-2
              ${index === 0 
                ? 'bg-primary-light font-semibold' 
                : 'hover:bg-primary-light'
              }
            `}
          >
            {item.name}
          </a>
        ))}
      </nav>

      <div className="p-4">
        <a
          href="/profile"
          className="block px-4 py-3 rounded-xl hover:bg-primary-light transition-colors duration-200 mb-2"
        >
          Profile
        </a>
        <a
          href="/logout"
          className="block px-4 py-3 rounded-xl hover:bg-primary-light transition-colors duration-200"
        >
          Logout
        </a>
      </div>

    </aside>
  );
};

export default Sidebar;