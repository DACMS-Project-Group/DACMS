import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import Button from '../ui/Button';
import { useSidebar } from '../contexts/SidebarContext';

const Sidebar = ({ userRole = 'student' }) => {
  const role = userRole?.toLowerCase().trim();
  const { isOpen, close } = useSidebar();

  const studentNavItems = [
    { name: 'Dashboard', href: '/student-dashboard' },
    { name: 'Applications', href: '/applications' },
    { name: 'Modules', href: '/modules' },
    { name: 'Work Tracking', href: '/work-tracking' },
    { name: 'Claims', href: '/claims' },
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
    { name: 'Claims', href: '/admin/claims' },
  ];

  const navItems =
    role === 'lecturer'
      ? lecturerNavItems
      : role === 'admin'
        ? adminNavItems
        : studentNavItems;

  // Escape closes the mobile drawer.
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        close();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, close]);

  return (
    <>
      {/* Mobile backdrop — above the navbar so the bar is dimmed too */}
      {isOpen && (
        <div
          onClick={close}
          aria-hidden="true"
          className="fixed inset-0 z-[60] bg-black/50 md:hidden"
        />
      )}

      <aside
        id="app-sidebar"
        aria-label="Main navigation"
        className={[
          // --- Mobile: fixed off-canvas drawer ---
          'fixed top-0 left-0 z-[70]',
          'flex h-dvh w-64 flex-col',
          'bg-primary-dark text-white',
          'transform transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full',

          // --- Desktop: sticky full-height column, never scrolls away ---
          'md:sticky md:top-24 md:z-auto md:h-[calc(100vh-6rem)] md:translate-x-0',
        ].join(' ')}
      >
        {/* Drawer header — mobile only */}
        <div className="flex items-center justify-between border-b border-white/15 px-4 py-3 md:hidden">
          <span className="text-xs font-semibold uppercase tracking-wide text-white/70">
            Menu
          </span>

          <Button
            unstyled
            type="button"
            aria-label="Close navigation menu"
            onClick={close}
            className="flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-primary-light"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </Button>
        </div>

        <nav className="min-h-0 flex-1 overflow-y-auto p-4 pt-6">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              onClick={close}
              className={({ isActive }) =>
                `mb-2 block rounded-xl px-4 py-3 transition-colors duration-200 ${
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
      </aside>
    </>
  );
};

export default Sidebar;
