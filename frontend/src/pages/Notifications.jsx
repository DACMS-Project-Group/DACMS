import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import { useAuth } from '../contexts/AuthContext';

const Notifications = () => {
  const { user } = useAuth();
  const userRole = user?.role || 'student';

  // Sample notification data - replace with real data from API
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Application Approved',
      message: 'Your application for CMPG 323 Demi position has been approved. You will receive your appointment letter shortly.',
      timestamp: '2026-09-06 14:30',
      read: false,
      type: 'success',
      category: 'Application'
    },
    {
      id: 2,
      title: 'Claim Submitted',
      message: 'Your claim for R 1,500.00 has been submitted and is pending review by the administrator.',
      timestamp: '2026-09-05 10:15',
      read: false,
      type: 'info',
      category: 'Claim'
    },
    {
      id: 3,
      title: 'Work Session Verified',
      message: 'Your work session for CMPG 323 (4 hours) has been verified by your lecturer.',
      timestamp: '2026-09-04 16:45',
      read: true,
      type: 'success',
      category: 'Work'
    },
    {
      id: 4,
      title: 'Application Rejected',
      message: 'Your application for XXXX 211 has been rejected. Reason: Insufficient qualifications. Please review the requirements and reapply if eligible.',
      timestamp: '2026-09-03 09:20',
      read: true,
      type: 'error',
      category: 'Application'
    },
    {
      id: 5,
      title: 'Budget Update',
      message: 'The budget for CMPG 323 has been updated. New allocation: R 45,000.00',
      timestamp: '2026-09-02 11:00',
      read: true,
      type: 'warning',
      category: 'Budget'
    },
    {
      id: 6,
      title: 'New Application Received',
      message: 'A new Demi application has been submitted for CMPG 323. Please review it.',
      timestamp: '2026-09-01 08:30',
      read: false,
      type: 'info',
      category: 'Application'
    },
  ]);

  const [expandedId, setExpandedId] = useState(null);

  // Toggle expanded state
  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
    
    // Mark as read when expanded
    if (expandedId !== id) {
      setNotifications(notifications.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      ));
    }
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  // Delete notification
  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  // Get unread count
  const unreadCount = notifications.filter(n => !n.read).length;

  // Get type color
  const getTypeColor = (type) => {
    switch(type) {
      case 'success': return 'bg-success';
      case 'error': return 'bg-error';
      case 'warning': return 'bg-warning';
      case 'info': return 'bg-primary';
      default: return 'bg-neutral';
    }
  };

  return (
    <div className="flex min-h-screen bg-off-white">
      <Sidebar userRole={userRole} />
      
      <div className="flex-1">
        <Navbar />
        
        {/* Page Title */}
        <div className="bg-primary h-16 flex items-center justify-between px-8">
          <h1 className="text-4xl font-poppins font-bold text-white">Notifications</h1>
          
          <div className="flex items-center gap-4">
            <span className="text-white/80 text-sm font-inter">
              {unreadCount} unread
            </span>
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                className="text-white/80 text-sm hover:text-white transition font-inter underline"
              >
                Mark all as read
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="text-center">
              <p className="text-sm text-neutral font-inter">Total</p>
              <p className="text-2xl font-poppins font-bold text-primary-dark">{notifications.length}</p>
            </Card>
            <Card className="text-center">
              <p className="text-sm text-neutral font-inter">Unread</p>
              <p className="text-2xl font-poppins font-bold text-warning">{unreadCount}</p>
            </Card>
            <Card className="text-center">
              <p className="text-sm text-neutral font-inter">Read</p>
              <p className="text-2xl font-poppins font-bold text-success">{notifications.filter(n => n.read).length}</p>
            </Card>
            <Card className="text-center">
              <p className="text-sm text-neutral font-inter">Categories</p>
              <p className="text-2xl font-poppins font-bold text-primary">
                {[...new Set(notifications.map(n => n.category))].length}
              </p>
            </Card>
          </div>

          {/* Notifications List */}
          <Card>
            {notifications.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-2xl mb-2">📭</p>
                <p className="text-neutral font-inter">No notifications yet</p>
                <p className="text-sm text-neutral/60 font-inter">Check back later for updates</p>
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id}
                    className={`border rounded-xl transition-all duration-300 ${
                      expandedId === notification.id 
                        ? 'border-primary shadow-md' 
                        : 'border-neutral/30 hover:border-neutral'
                    } ${!notification.read ? 'bg-primary-lightest/30' : 'bg-white'}`}
                  >
                    {/* Notification Header - Always visible */}
                    <div 
                      className="flex items-center justify-between p-4 cursor-pointer"
                      onClick={() => toggleExpand(notification.id)}
                    >
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        {/* Status dot */}
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${!notification.read ? 'bg-primary' : 'bg-neutral/30'}`}></div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3">
                            <p className={`font-semibold text-dark font-inter truncate ${
                              !notification.read ? 'font-bold' : ''
                            }`}>
                              {notification.title}
                            </p>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-inter flex-shrink-0 ${getTypeColor(notification.type)} text-white`}>
                              {notification.category}
                            </span>
                          </div>
                          <p className="text-xs text-neutral font-inter mt-0.5">
                            {new Date(notification.timestamp).toLocaleDateString('en-ZA', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 flex-shrink-0">
                        {!notification.read && (
                          <span className="text-xs text-primary font-inter bg-primary-lightest px-2 py-0.5 rounded-full">
                            New
                          </span>
                        )}
                        <span className="text-neutral/50 text-sm">
                          {expandedId === notification.id ? '▲' : '▼'}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                          className="text-neutral/30 hover:text-error transition text-sm p-1"
                        >
                          ✕
                        </button>
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {expandedId === notification.id && (
                      <div className="px-4 pb-4 pt-2 border-t border-neutral/20">
                        <p className="text-dark font-inter text-sm leading-relaxed">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-4 mt-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-inter ${getTypeColor(notification.type)} text-white`}>
                            {notification.type.toUpperCase()}
                          </span>
                          <span className="text-xs text-neutral/50 font-inter">
                            ID: #{notification.id}
                          </span>
                          <span className="text-xs text-neutral/50 font-inter">
                            {new Date(notification.timestamp).toLocaleTimeString('en-ZA', {
                              hour: '2-digit',
                              minute: '2-digit'
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
        </div>
      </div>
    </div>
  );
};

export default Notifications;