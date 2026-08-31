import React from 'react';

const Sidebar = ({ userRole = 'student' }) => {
  // Student Navigation
  const studentNavItems = [
    { name: 'Dashboard', icon: '📊', href: '/dashboard' },
    { name: 'Applications', icon: '📝', href: '/applications' },
    { name: 'Work Tracking', icon: '⏱️', href: '/work-tracking' },
    { name: 'Claims', icon: '💰', href: '/claims' },
    { name: 'Profile', icon: '👤', href: '/profile' },
    { name: 'Notifications', icon: '🔔', href: '/notifications' },
  ];

  // Lecturer Navigation
  const lecturerNavItems = [
    { name: 'Dashboard', icon: '📊', href: '/dashboard' },
    { name: 'Module Management', icon: '📚', href: '/modules' },
    { name: 'Review Applications', icon: '📋', href: '/review-applications' },
    { name: 'Assign Duties', icon: '✏️', href: '/assign-duties' },
    { name: 'Verify Hours', icon: '✅', href: '/verify-hours' },
    { name: 'Notifications', icon: '🔔', href: '/notifications' },
  ];

  // Administrator Navigation
  const adminNavItems = [
    { name: 'Dashboard', icon: '📊', href: '/dashboard' },
    { name: 'Budget Management', icon: '💰', href: '/budget-management' },
    { name: 'Appointment Approvals', icon: '📋', href: '/appointment-approvals' },
    { name: 'Claims Verification', icon: '✅', href: '/claims-verification' },
    { name: 'User Management', icon: '👥', href: '/user-management' },
    { name: 'Reports', icon: '📈', href: '/reports' },
    { name: 'Notifications', icon: '🔔', href: '/notifications' },
  ];

  let navItems = [];
  let roleLabel = '';

  switch (userRole) {
    case 'lecturer':
      navItems = lecturerNavItems;
      roleLabel = 'Lecturer';
      break;
    case 'admin':
      navItems = adminNavItems;
      roleLabel = 'Administrator';
      break;
    default:
      navItems = studentNavItems;
      roleLabel = 'Student';
      break;
  }

  return (
    <aside className="w-64 bg-primary-dark text-white flex flex-col min-h-screen">
      
      <div className="p-6 border-b border-neutral">
        <h2 className="text-lg font-poppins font-semibold">DACMS</h2>
        <p className="text-sm text-neutral mt-1">{roleLabel}</p>
      </div>

      <nav className="flex-1 p-4">
        {navItems.map((item, index) => (
          <a
            key={index}
            href={item.href}
            className={`
              flex items-center gap-3 px-4 py-3 rounded-xl 
              transition-colors duration-200 mb-2
              ${index === 0 
                ? 'bg-primary-light font-semibold text-white' 
                : 'hover:bg-primary-light text-white'
              }
            `}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-inter">{item.name}</span>
          </a>
        ))}
      </nav>

      <div className="p-4 border-t border-neutral">
        <a
          href="/profile"
          className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-primary-light text-white transition-colors duration-200 mb-2"
        >
          <span className="text-xl">👤</span>
          <span className="font-inter">Profile</span>
        </a>
        <a
          href="/logout"
          className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-primary-light text-white transition-colors duration-200"
        >
          <span className="text-xl">🚪</span>
          <span className="font-inter">Logout</span>
        </a>
      </div>

    </aside>
  );
};

export default Sidebar;