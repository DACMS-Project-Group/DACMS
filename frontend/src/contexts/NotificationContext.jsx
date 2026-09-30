import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { apiGet } from '../api';
import { useAuth } from './AuthContext'; // 1. Import AuthContext

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  
  // Get current user state so we refetch when authentication completes
  const { user } = useAuth();

  const fetchNotifications = useCallback(async () => {
    // Skip fetching if no user is authenticated
    if (!user) {
      setNotifications([]);
      return;
    }

    try {
      const res = await apiGet('/notifications/fetch');
      
      // 2. Safely extract array whether API returns [...] or { notifications: [...] } or { data: [...] }
      const rawList = Array.isArray(res)
        ? res
        : (res?.notifications || res?.data || []);

      setNotifications(
        rawList.map((n) => {
          // 3. Handle property casing (IsRead vs isRead vs is_read) & type differences (1/0 or true/false)
          const readVal = n.IsRead ?? n.isRead ?? n.is_read;
          return {
            ...n,
            read: readVal === true || readVal === 1 || readVal === 'true'
          };
        })
      );
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  }, [user]);

  // Re-run whenever user logs in or auth state changes
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Synchronous count of unread items
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        fetchNotifications,
        setNotifications
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const liveNotifs = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('liveNotifs must be used within a NotificationProvider');
  }
  return context;
};