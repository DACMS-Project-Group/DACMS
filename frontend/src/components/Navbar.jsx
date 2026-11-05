import { useEffect, useRef, useState } from 'react';
import Button from '../ui/Button';
import { NavLink } from 'react-router-dom';
import logo from '../assets/NWU-Acronym-Logo-White-Digital.png';
import { useAuth } from '../contexts/AuthContext';
import { liveNotifs } from '../contexts/notificationContext';
import { useSidebar } from '../contexts/SidebarContext';
import { useDensity } from '../contexts/DensityContext';

const ROLE_LABELS = {
  student: 'Student',
  lecturer: 'Lecturer',
  admin: 'Administrator',
};

const getInitials = (email = '') =>
  email
    .split('@')[0]
    .split(/[._-]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || 'U';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { unreadCount } = liveNotifs();
  const { isOpen, toggle } = useSidebar();
  const { density, setDensity } = useDensity();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const role = user?.role || 'student';
  const roleLabel = ROLE_LABELS[role] || ROLE_LABELS.student;
  const email = user?.email || '';
  const initials = getInitials(email);

  useEffect(() => {
    if (!menuOpen) return undefined;

    const handlePointerDown = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="sticky top-0 z-50 bg-primary text-white px-3 shadow-md sm:px-6">
      <div className="container mx-auto flex h-16 items-center justify-between sm:h-20 md:h-24">

        {/* LEFT: Hamburger (mobile) + Logo + Title */}
        <div className="flex h-full items-center gap-2 sm:gap-3 min-w-0">
          {/* Hamburger — only below md */}
          {user && (
            <Button unstyled
              type="button"
              aria-label="Open navigation menu"
              aria-expanded={isOpen}
              aria-controls="app-sidebar"
              onClick={toggle}
              className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-lg hover:bg-primary-dark/50 transition-colors shrink-0"
            >
              <span className="block w-5 h-0.5 bg-white mb-1" />
              <span className="block w-5 h-0.5 bg-white mb-1" />
              <span className="block w-5 h-0.5 bg-white" />
            </Button>
          )}

          <img
            src={logo}
            alt="NWU Logo"
            className="h-auto max-h-10 sm:max-h-16 w-24 sm:w-44 object-contain shrink-0"
          />

          <h1 className="text-page font-poppins font-semibold tracking-wide truncate">
            AACMS
          </h1>
        </div>

        {/* RIGHT: Notifications + user menu */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {user && (
            <NavLink
              to="/notifications"
              aria-label={
                unreadCount > 0
                  ? `Notifications, ${unreadCount} unread`
                  : 'Notifications'
              }
              className={({ isActive }) =>
                `relative rounded-lg px-2 sm:px-3 py-2 text-sm font-semibold transition-colors ${
                  isActive ? 'bg-primary-dark' : 'hover:bg-primary-dark/50'
                }`
              }
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 sm:h-6 sm:w-6"
              >
                <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8A8.5 8.5 0 0 1 8.7 3.9a8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 inline-flex min-w-5 items-center justify-center rounded-full bg-error px-1.5 py-0.5 text-xs leading-none text-white">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </NavLink>
          )}

          {user && (
            <div ref={menuRef} className="relative">
              <Button
                unstyled
                type="button"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                aria-label="Open account menu"
                onClick={() => setMenuOpen((open) => !open)}
                className="flex items-center gap-2 rounded-full p-1 transition hover:bg-primary-dark/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
              >
                <span
                  aria-hidden="true"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-sm font-semibold text-white sm:h-10 sm:w-10"
                >
                  {initials}
                </span>

                <span className="hidden max-w-40 truncate text-sm font-medium lg:block">
                  {email}
                </span>

                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`mr-1 hidden h-4 w-4 transition-transform sm:block ${
                    menuOpen ? 'rotate-180' : ''
                  }`}
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </Button>

              {menuOpen && (
                <div
                  role="menu"
                  aria-label="Account"
                  className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-xl border border-border-subtle bg-surface text-dark shadow-lg"
                >
                  <div className="border-b border-border-subtle px-4 py-3">
                    <p className="truncate text-sm font-semibold text-dark">
                      {email || 'Signed in'}
                    </p>

                    <p className="mt-0.5 text-xs text-neutral">{roleLabel}</p>
                  </div>

                  <div className="py-1">
                    {role === 'student' && (
                      <NavLink
                        to="/profile"
                        role="menuitem"
                        onClick={closeMenu}
                        className="block px-4 py-2.5 text-sm text-dark transition hover:bg-primary-lightest"
                      >
                        Profile
                      </NavLink>
                    )}

                    {role === 'admin' && (
                      <NavLink
                        to="/audit-logs"
                        role="menuitem"
                        onClick={closeMenu}
                        className="block px-4 py-2.5 text-sm text-dark transition hover:bg-primary-lightest"
                      >
                        Audit Logs
                      </NavLink>
                    )}
                  </div>

                  {role === 'admin' && (
                    <div className="border-t border-border-subtle px-4 py-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-neutral">
                        Table density
                      </p>

                      <div
                        role="group"
                        aria-label="Table density"
                        className="mt-2 flex rounded-lg bg-light-grey p-1"
                      >
                        {[
                          ['compact', 'Compact'],
                          ['comfortable', 'Comfortable'],
                        ].map(([value, label]) => (
                          <Button
                            key={value}
                            unstyled
                            type="button"
                            role="menuitemradio"
                            aria-checked={density === value}
                            onClick={() => setDensity(value)}
                            className={`flex-1 rounded-md px-2 py-1.5 text-xs font-semibold transition ${
                              density === value
                                ? 'bg-surface text-primary shadow-sm'
                                : 'text-neutral hover:text-primary'
                            }`}
                          >
                            {label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="border-t border-border-subtle py-1">
                    <Button
                      unstyled
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        closeMenu();
                        logout();
                      }}
                      className="block w-full px-4 py-2.5 text-left text-sm font-medium text-error transition hover:bg-status-danger-soft"
                    >
                      Log Out
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
