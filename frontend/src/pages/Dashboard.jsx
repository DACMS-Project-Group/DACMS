import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import { apiGet } from '../api';

const Dashboard = () => {
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ---- Fetch dashboard data on mount ----
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        const data = await apiGet('/student/dashboard');
        if (!cancelled) {
          setDashboardData(data);
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

  // ---- Derived values from the API response ----
  const profile = dashboardData?.profile || {};
  const stats = dashboardData?.stats || {};
  const monthlyHours = dashboardData?.monthlyHours || [];
  const pendingApplications = dashboardData?.pendingApplications || [];

  // These stay as placeholder mock data until the backend exposes the endpoints.
  // Remove the arrays and use real data when endpoints exist.
  const claims = [
    { module: '—', amount: '—', status: 'Pending', claimNo: '—' },
  ];

  const recentActivity = [
    { text: 'No recent activity', time: '' },
  ];

  return (
    <div className="min-h-screen bg-off-white">
      <Navbar />

      <div className="flex">
        <Sidebar userRole="student" />

        <main className="flex-1">
          {/* Page Title Bar */}
          <div className="bg-primary h-16 flex items-center px-8">
            <h1 className="text-4xl font-poppins font-bold text-white">
              Dashboard
            </h1>
          </div>

          <div className="p-8">
            {/* Welcome Message */}
            <div className="mb-8">
              <h2 className="text-3xl font-poppins font-semibold text-primary">
                {loading
                  ? 'Welcome!'
                  : `Welcome ${profile.name || 'Student'}!`}
              </h2>

              {error && (
                <p className="mt-2 text-sm text-error font-inter">
                  Could not load dashboard data: {error}
                </p>
              )}
            </div>

            {/* Quick Actions & Notifications */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Quick Actions */}
              <Card>
                <h3 className="text-2xl font-poppins font-semibold text-dark mb-4">
                  Quick Actions
                </h3>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => navigate('/work-tracking')}
                    className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition text-center"
                  >
                    Start work session
                  </button>

                  <button
                    onClick={() => navigate('/applications')}
                    className="bg-primary-lightest text-dark px-6 py-3 rounded-xl font-semibold hover:bg-primary-light hover:text-white transition text-center"
                  >
                    Apply to Assistant
                  </button>

                  <button
                    onClick={() => navigate('/claims')}
                    className="border-2 border-primary text-primary px-6 py-3 rounded-xl font-semibold hover:bg-primary-lightest transition text-center"
                  >
                    Submit Claim
                  </button>
                </div>
              </Card>

              {/* Notifications */}
              <Card>
                <h3 className="text-2xl font-poppins font-semibold text-dark mb-4">
                  Notifications
                </h3>

                <div className="space-y-4">
                  <p className="text-neutral font-inter text-sm">
                    Notifications will appear here once available.
                  </p>

                  <button
                    onClick={() => navigate('/notifications')}
                    className="text-primary font-semibold hover:underline block ml-auto font-inter"
                  >
                    View all →
                  </button>
                </div>
              </Card>
            </div>

            {/* Stats Overview — uses real API stats */}
            <div className="mb-8">
              <h3 className="text-2xl font-poppins font-semibold text-primary mb-4">
                Overview
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card>
                  <p className="text-sm text-neutral font-inter">
                    Active Positions
                  </p>
                  <p className="mt-2 text-3xl font-bold text-primary-dark font-poppins">
                    {loading ? '—' : stats.active_positions ?? 0}
                  </p>
                </Card>

                <Card>
                  <p className="text-sm text-neutral font-inter">
                    Pending Applications
                  </p>
                  <p className="mt-2 text-3xl font-bold text-primary-dark font-poppins">
                    {loading ? '—' : stats.pending_applications ?? 0}
                  </p>
                </Card>

                <Card>
                  <p className="text-sm text-neutral font-inter">
                    Hours This Month
                  </p>
                  <p className="mt-2 text-3xl font-bold text-primary-dark font-poppins">
                    {loading ? '—' : stats.hours_this_month ?? 0}
                  </p>
                </Card>

                <Card>
                  <p className="text-sm text-neutral font-inter">
                    Pending Claims
                  </p>
                  <p className="mt-2 text-3xl font-bold text-primary-dark font-poppins">
                    {loading ? '—' : stats.pending_claims ?? 0}
                  </p>
                </Card>
              </div>

              {/* Monthly Hours table */}
              <Card className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-light-grey">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-neutral font-inter">
                        Modules
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-neutral font-inter">
                        Hours worked
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {loading ? (
                      <tr>
                        <td
                          colSpan="2"
                          className="py-6 text-center text-neutral font-inter"
                        >
                          Loading…
                        </td>
                      </tr>
                    ) : monthlyHours.length === 0 ? (
                      <tr>
                        <td
                          colSpan="2"
                          className="py-6 text-center text-neutral font-inter"
                        >
                          No hours recorded yet
                        </td>
                      </tr>
                    ) : (
                      monthlyHours.map((row, index) => (
                        <tr
                          key={index}
                          className="border-b border-neutral last:border-0"
                        >
                          <td className="py-3 px-4 text-dark font-inter">
                            {row.module || row.moduleCode || '—'}
                          </td>
                          <td className="py-3 px-4 text-dark font-inter">
                            {row.hours ?? row.total_hours ?? 0}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </Card>
            </div>

            {/* Application Status & Claims */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Application Status */}
              <div>
                <h3 className="text-2xl font-poppins font-semibold text-primary mb-4">
                  Application Status
                </h3>

                <Card className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-light-grey">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-neutral font-inter">
                          Module
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-neutral font-inter">
                          Status
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {loading ? (
                        <tr>
                          <td
                            colSpan="2"
                            className="py-6 text-center text-neutral font-inter"
                          >
                            Loading…
                          </td>
                        </tr>
                      ) : pendingApplications.length === 0 ? (
                        <tr>
                          <td
                            colSpan="2"
                            className="py-6 text-center text-neutral font-inter"
                          >
                            No applications yet
                          </td>
                        </tr>
                      ) : (
                        pendingApplications.map((app, index) => (
                          <tr
                            key={index}
                            className="border-b border-neutral last:border-0"
                          >
                            <td className="py-3 px-4 text-dark font-inter">
                              {app.module || app.moduleCode || '—'}
                            </td>
                            <td className="py-3 px-4">
                              <StatusBadge status={app.status || 'Pending'} />
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>

                  <button
                    onClick={() => navigate('/applications')}
                    className="text-primary font-semibold hover:underline block text-right mt-4 ml-auto font-inter"
                  >
                    View all →
                  </button>
                </Card>
              </div>

              {/* Claims — mock until backend exposes endpoint */}
              <div>
                <h3 className="text-2xl font-poppins font-semibold text-primary mb-4">
                  Claims
                </h3>

                <Card className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-light-grey">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-neutral font-inter">
                          Module
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-neutral font-inter">
                          Amount
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-neutral font-inter">
                          Status
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-neutral font-inter">
                          Claim #
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {claims.map((claim, index) => (
                        <tr
                          key={index}
                          className="border-b border-neutral last:border-0"
                        >
                          <td className="py-3 px-4 text-dark font-inter">
                            {claim.module}
                          </td>
                          <td className="py-3 px-4 text-dark font-inter">
                            {claim.amount}
                          </td>
                          <td className="py-3 px-4">
                            <StatusBadge status={claim.status} />
                          </td>
                          <td className="py-3 px-4 text-dark font-inter">
                            {claim.claimNo}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <button
                    onClick={() => navigate('/claims')}
                    className="text-primary font-semibold hover:underline block text-right mt-4 ml-auto font-inter"
                  >
                    View all →
                  </button>
                </Card>
              </div>
            </div>

            {/* Generate Claim & Recent Activity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-2xl font-poppins font-semibold text-primary mb-4">
                  Generate Claim
                </h3>

                <Card>
                  <p className="text-neutral mb-4 font-inter">
                    Ready to submit a new claim?
                  </p>

                  <button
                    onClick={() => navigate('/claims')}
                    className="w-full bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition font-inter"
                  >
                    Generate New Claim
                  </button>
                </Card>
              </div>

              <div>
                <h3 className="text-2xl font-poppins font-semibold text-primary mb-4">
                  Recent Activity
                </h3>

                <Card>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index}>
                        <p className="font-semibold text-dark font-inter">
                          {activity.text}
                        </p>
                        {activity.time && (
                          <p className="text-sm text-neutral font-inter">
                            {activity.time}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => navigate('/notifications')}
                    className="text-primary font-semibold hover:underline block text-right mt-4 ml-auto font-inter"
                  >
                    View all →
                  </button>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;