import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { apiGet } from '../api';
import { useAuth } from './AuthContext';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Get current user state so we refetch when authentication completes
  const { user } = useAuth();

  const fetchNotifications = useCallback(async () => {
    // Skip fetching if no user is authenticated
    if (!user) {
      setNotifications([]);
      setError('');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await apiGet('/notifications/fetch');
      
      const rawList = Array.isArray(res)
        ? res
        : (res?.notifications || res?.data || []);

      setNotifications(
        rawList.map((n) => {
          const readVal = n.IsRead ?? n.isRead ?? n.is_read;
          return {
            ...n,
            read: readVal === true || readVal === 1 || readVal === 'true'
          };
        })
      );
      setError('');
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Re-run whenever user logs in or auth state changes
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const userId = user?.id;

  useEffect(() => {
    if (!userId) {
      return undefined;
    }

    let active = true;
    let socket;
    let script = document.querySelector('script[data-socket-client]');

    const connect = () => {
      if (!active || !window.io) {
        return;
      }

      socket = window.io({ withCredentials: true });
      socket.on('newNotification', (notification) => {
        setNotifications((current) => {
          if (current.some((item) => item.NotificationID === notification.NotificationID)) {
            return current;
          }
          return [{ ...notification, read: false }, ...current].slice(0, 20);
        });
      });
      socket.on('connect_error', (error) => {
        console.error('Notification live connection failed:', error.message);
      });
    };

    if (!script) {
      script = document.createElement('script');
      script.src = '/socket.io/socket.io.js';
      script.dataset.socketClient = 'true';
      script.onload = connect;
      script.onerror = () => {
        console.error('Failed to load the Socket.IO browser client.');
      };
      document.head.appendChild(script);
    } else if (window.io) {
      connect();
    } else {
      script.addEventListener('load', connect, { once: true });
    }

    return () => {
      active = false;
      socket?.disconnect();
    };
  }, [userId]);

  // Synchronous count of unread items
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        loading,
        error,
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