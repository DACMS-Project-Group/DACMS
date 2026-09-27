import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import { useAuth } from '../contexts/AuthContext';

const Notifications = () => {
  const { user } = useAuth();
  const userRole = user?.role || 'student';

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Application Approved',
      message:
        'Your application for CMPG 323 Assistant position has been approved. You will receive your appointment letter shortly.',
      timestamp: '2026-09-06 14:30',
      read: false,
      type: 'success',
      category: 'Application',
    },
    {
      id: 2,
      title: 'Claim Submitted',
      message:
        'Your claim for R 1,500.00 has been submitted and is pending review by the administrator.',
      timestamp: '2026-09-05 10:15',
      read: false,
      type: 'info',
      category: 'Claim',
    },
    {
      id: 3,
      title: 'Work Session Verified',
      message:
        'Your work session for CMPG 323 (4 hours) has been verified by your lecturer.',
      timestamp: '2026-09-04 16:45',
      read: true,
      type: 'success',
      category: 'Work',
    },
    {
      id: 4,
      title: 'Application Rejected',
      message:
        'Your application for XXXX 211 has been rejected. Reason: Insufficient qualifications. Please review the requirements and reapply if eligible.',
      timestamp: '2026-09-03 09:20',
      read: true,
      type: 'error',
      category: 'Application',
    },
    {
      id: 5,
      title: 'Budget Update',
      message:
        'The budget for CMPG 323 has been updated. New allocation: R 45,000.00',
      timestamp: '2026-09-02 11:00',
      read: true,
      type: 'warning',
      category: 'Budget',
    },
    {
      id: 6,
      title: 'New Application Received',
      message:
        'A new Assistant application has been submitted for CMPG 323. Please review it.',
      timestamp: '2026-09-01 08:30',
      read: false,
      type: 'info',
      category: 'Application',
    },
  ]);

  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);

    if (expandedId !== id) {
      setNotifications((current) =>
        current.map((notification) =>
          notification.id === id
            ? { ...notification, read: true }
            : notification
        )
      );
    }
  };

  const markAllAsRead = () => {
    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };

  const deleteNotification = (id) => {
    setNotifications((current) =>
      current.filter((notification) => notification.id !== id)
    );
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  const readCount = notifications.filter(
    (notification) => notification.read
  ).length;

  const categoryCount = [
    ...new Set(notifications.map((notification) => notification.category)),
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
                  <p className="font-medium text-neutral font-inter">
                    Total
                  </p>

                  <p className="mt-3 text-3xl font-bold text-primary font-poppins">
                    {notifications.length}
                  </p>

                  <p className="mt-1 text-sm text-neutral font-inter">
                    All notifications
                  </p>
                </Card>

                <Card>
                  <p className="font-medium text-neutral font-inter">
                    Unread
                  </p>

                  <p className="mt-3 text-3xl font-bold text-primary font-poppins">
                    {unreadCount}
                  </p>

                  <p className="mt-1 text-sm text-neutral font-inter">
                    Notifications requiring attention
                  </p>
                </Card>

                <Card>
                  <p className="font-medium text-neutral font-inter">
                    Read
                  </p>

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
                {notifications.length === 0 ? (
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
                            {/* Status Dot */}
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
                                {new Date(
                                  notification.timestamp
                                ).toLocaleDateString('en-ZA', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
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

                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                deleteNotification(notification.id);
                              }}
                              className="p-1 text-sm text-neutral/30 transition hover:text-error"
                              aria-label={`Delete ${notification.title}`}
                            >
                              ✕
                            </button>
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

                              <span className="text-xs text-neutral/50 font-inter">
                                {new Date(
                                  notification.timestamp
                                ).toLocaleTimeString('en-ZA', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
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