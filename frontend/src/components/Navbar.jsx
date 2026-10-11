import { NavLink } from 'react-router-dom';
import logo from '../assets/NWU-Acronym-Logo-White-Digital.png';
import { useAuth } from '../contexts/AuthContext';
import { liveNotifs } from '../contexts/notificationContext';
import { useSidebar } from '../contexts/SidebarContext';

const Navbar = () => {
  const { user } = useAuth();
  const { unreadCount } = liveNotifs();
  const { toggle } = useSidebar();

  return (
    <nav className="sticky top-0 z-50 bg-primary text-white px-3 sm:px-6 relative shadow-md">
      <div className="container mx-auto flex justify-between items-center h-20 sm:h-24">

        {/* LEFT: Hamburger (mobile) + Logo + Title */}
        <div className="flex h-full items-center gap-2 sm:gap-3 min-w-0">
          {/* Hamburger — only below md */}
          {user && (
            <button
              type="button"
              aria-label="Open navigation menu"
              onClick={toggle}
              className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-lg hover:bg-primary-dark/50 transition-colors shrink-0"
            >
              <span className="block w-5 h-0.5 bg-white mb-1" />
              <span className="block w-5 h-0.5 bg-white mb-1" />
              <span className="block w-5 h-0.5 bg-white" />
            </button>
          )}

          <img
            src={logo}
            alt="NWU Logo"
            className="h-auto max-h-10 sm:max-h-16 w-24 sm:w-44 object-contain shrink-0"
          />

          <h1 className="text-lg sm:text-2xl font-poppins font-semibold tracking-wide truncate">
            AACMS
          </h1>
        </div>

        {/* RIGHT: Notifications */}
        <div className="flex items-center shrink-0">
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
        </div>

      </div>
    </nav>
  );
};

export default Navbar;