//import React from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../assets/NWU-Acronym-Logo-White-Digital.png';
import { useAuth } from '../contexts/AuthContext';
import { liveNotifs } from '../contexts/notificationContext';

const Navbar = () => {
  const { user } = useAuth();
  const { unreadCount } = liveNotifs();

  console.log(user);

  return (
    <nav className="sticky top-0 z-50 bg-primary text-white px-6 relative shadow-md">
      <div className="container mx-auto flex justify-between items-center h-24">
        {/* LEFT: Logo and title */}
        <div className="flex h-24 items-center">
          <img 
            src={logo} 
            alt="AACMS Logo" 
            className="h-auto max-h-16 w-44 object-contain"
          />
          <h1 className="ml-4 text-2xl font-poppins font-semibold tracking-wide">
            AACMS
          </h1>
        </div>
        {/* RIGHT: Notifications */}
        <div className="flex items-center">
          {user && (
            <NavLink
              to="/notifications"
              aria-label={
                unreadCount > 0
                  ? `Notifications, ${unreadCount} unread`
                  : 'Notifications'
              }
              className={({ isActive }) =>
                `relative rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
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
                className="h-6 w-6"
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