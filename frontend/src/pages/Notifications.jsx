import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import { useAuth } from '../contexts/AuthContext';
import { apiGet, apiPatch } from '../api';

const Notifications = () => {
  const { user } = useAuth();
  const userRole = user?.role || 'student';

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  // ---- Load notifications on mount ----
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        const data = await apiGet('/notifications/fetch');

        // Backend wraps in { notification: [...] } (singular!)
        const list = Array.isArray(data)
          ? data
          : data?.notification || data?.notifications || [];

        if (!cancelled) {
          setNotifications(
            list.map((n) => ({
              id: n.NotificationId ?? n.notification_id ?? n.id,
              title: n.title,
              message: n.message,
              timestamp: n.CreatedTimestamp ?? n.created_at ?? n.timestamp,
              read: Boolean(n.IsRead ?? n.is_read ?? n.read),
              type: n.type || 'info',
              category: n.category || 'General',
            }))
          );
          setError('');
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  // ---- Toggle expand + mark as read ----
  const toggleExpand = async (id) => {
    const opening = expandedId !== id;
    setExpandedId(opening ? id : null);

    const target = notifications.find((n) => n.id === id);
    if (opening && target && !target.read) {
      // Optimistic update
      setNotifications((current) =>
        current.map((n) => (n.id === id ? { ...n, read: true } : n))
      );

      try {
        await apiPatch(`/notifications/read/${id}`);
      } catch (err) {
        // Roll back on failure
        setNotifications((current) =>
          current.map((n) => (n.id === id ? { ...n, read: false } : n))
        );
        console.error('Failed to mark as read:', err);
      }
    }
  };

  // ---- Mark all as read ----
  const markAllAsRead = async () => {
    const unread = notifications.filter((n) => !n.read);
    if (unread.length === 0) return;

    // Optimistic update
    setNotifications((current) =>
      current.map((n) => ({ ...n, read: true }))
    );

    try {
      await Promise.all(
        unread.map((n) => apiPatch(`/notifications/read/${n.id}`))
      );
    } catch (err) {
      console.error('Some notifications failed to mark as read:', err);
    }
  };

  // ---- Delete is not supported by the backend yet ----

  const unreadCount = notifications.filter((n) => !n.read).length;
  const readCount = notifications.filter((n) => n.read).length;

  const categoryCount = [
    ...new Set(notifications.map((n) => n.category)),
  ].length;

  const getTypeColor = (type) => {
    switch (type) {
      case 'success':
        return 'bg-success';
      case 'error':
        return 'bg-error';
      case 'warning':
        return 'bg-warning';
      case 'info':
        return 'bg-primary';
      default:
        return 'bg-neutral';
    }
  };

  return (
    <div className="min-h-screen bg-off-white">
      <Navbar />

      <div className="flex">
        <Sidebar userRole={userRole} />

        <main className="flex-1">
          {/* Page Header */}
          <div className="bg-primary px-8 py-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <h1 className="text-2xl font-semibold text-white font-poppins">
                Notifications
              </h1>

              <div className="flex items-center gap-4">
                <span className="text-sm text-white/80 font-inter">
                  {unreadCount} unread
                </span>

                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllAsRead}
                    className="text-sm text-white/80 underline transition hover:text-white font-inter"
                  >
                    Mark all as read
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Summary Cards */}
            <section className="mb-8">
              <h2 className="mb-4 text-xl font-semibold text-primary font-poppins">
                Notification Summary
              </h2>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <p className="font-medium text-neutral font-inter">Total</p>
                  <p className="mt-3 text-3xl font-bold text-primary font-poppins">
                    {notifications.length}
                  </p>
                  <p className="mt-1 text-sm text-neutral font-inter">
                    All notifications
                  </p>
                </Card>

                <Card>
                  <p className="font-medium text-neutral font-inter">Unread</p>
                  <p className="mt-3 text-3xl font-bold text-primary font-poppins">
                    {unreadCount}
                  </p>
                  <p className="mt-1 text-sm text-neutral font-inter">
                    Notifications requiring attention
                  </p>
                </Card>

                <Card>
                  <p className="font-medium text-neutral font-inter">Read</p>
                  <p className="mt-3 text-3xl font-bold text-primary font-poppins">
                    {readCount}
                  </p>
                  <p className="mt-1 text-sm text-neutral font-inter">
                    Previously viewed
                  </p>
                </Card>

                <Card>
                  <p className="font-medium text-neutral font-inter">
                    Categories
                  </p>
                  <p className="mt-3 text-3xl font-bold text-primary font-poppins">
                    {categoryCount}
                  </p>
                  <p className="mt-1 text-sm text-neutral font-inter">
                    Notification categories
                  </p>
                </Card>
              </div>
            </section>

            {/* Notifications List */}
            <section>
              <h2 className="mb-4 text-xl font-semibold text-primary font-poppins">
                All Notifications
              </h2>

              <Card>
                {loading ? (
                  <div className="py-12 text-center">
                    <p className="text-neutral font-inter">
                      Loading notifications…
                    </p>
                  </div>
                ) : error ? (
                  <div className="py-12 text-center">
                    <p className="font-semibold text-error font-inter">
                      Could not load notifications
                    </p>
                    <p className="mt-1 text-sm text-neutral font-inter">
                      {error}
                    </p>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="py-12 text-center">
                    <p className="mb-2 text-2xl">📭</p>
                    <p className="text-neutral font-inter">
                      No notifications yet
                    </p>
                    <p className="text-sm text-neutral/60 font-inter">
                      Check back later for updates
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`rounded-xl border transition-all duration-300 ${
                          expandedId === notification.id
                            ? 'border-primary shadow-md'
                            : 'border-neutral/30 hover:border-neutral'
                        } ${
                          !notification.read
                            ? 'bg-primary-lightest/30'
                            : 'bg-white'
                        }`}
                      >
                        {/* Notification Header */}
                        <div
                          className="flex cursor-pointer items-center justify-between p-4"
                          onClick={() => toggleExpand(notification.id)}
                        >
                          <div className="flex min-w-0 flex-1 items-center gap-4">
                            <div
                              className={`h-2 w-2 flex-shrink-0 rounded-full ${
                                !notification.read
                                  ? 'bg-primary'
                                  : 'bg-neutral/30'
                              }`}
                            />

                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-3">
                                <p
                                  className={`truncate font-inter text-dark ${
                                    !notification.read
                                      ? 'font-bold'
                                      : 'font-semibold'
                                  }`}
                                >
                                  {notification.title}
                                </p>

                                <span
                                  className={`flex-shrink-0 rounded-full px-2 py-0.5 text-xs text-white font-inter ${getTypeColor(
                                    notification.type
                                  )}`}
                                >
                                  {notification.category}
                                </span>
                              </div>

                              <p className="mt-0.5 text-xs text-neutral font-inter">
                                {notification.timestamp
                                  ? new Date(
                                      notification.timestamp
                                    ).toLocaleString('en-ZA', {
                                      day: '2-digit',
                                      month: '2-digit',
                                      year: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })
                                  : ''}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-shrink-0 items-center gap-3">
                            {!notification.read && (
                              <span className="rounded-full bg-primary-lightest px-2 py-0.5 text-xs text-primary font-inter">
                                New
                              </span>
                            )}

                            <span className="text-sm text-neutral/50">
                              {expandedId === notification.id ? '▲' : '▼'}
                            </span>
                          </div>
                        </div>

                        {/* Expanded Content */}
                        {expandedId === notification.id && (
                          <div className="border-t border-neutral/20 px-4 pb-4 pt-3">
                            <p className="text-sm leading-relaxed text-dark font-inter">
                              {notification.message}
                            </p>

                            <div className="mt-3 flex items-center gap-4">
                              <span
                                className={`rounded-full px-2 py-0.5 text-xs text-white font-inter ${getTypeColor(
                                  notification.type
                                )}`}
                              >
                                {notification.type.toUpperCase()}
                              </span>

                              <span className="text-xs text-neutral/50 font-inter">
                                ID: #{notification.id}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Notifications;