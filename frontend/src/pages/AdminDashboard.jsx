import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { apiGet } from '../api';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ---- Fetch dashboard stats on mount ----
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        const result = await apiGet('/admin/dashboard_statistics');
        if (!cancelled) {
          setData(result);
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

  const stats = data?.stats || {};
  const monthlyWork = data?.monthlyWork || [];
  const pendingAppointments = data?.pendingAppointments || [];

  // Stat cards derived from the API response
  const statisticCards = [
    { title: 'Total Modules', value: stats.total_modules ?? '—' },
    { title: 'Total Lecturers', value: stats.total_lecturers ?? '—' },
    { title: 'Total Assistants', value: stats.total_demis ?? '—' },
    { title: 'Pending Approvals', value: stats.total_pending_approvals ?? '—' },
    { title: 'Pending Claims', value: stats.total_pending_claims ?? '—' },
    { title: 'Budget Usage', value: '—' },
  ];

  // Format ISO date → "08 August 2026"
  const formatDate = (iso) => {
    if (!iso) return '—';
    try {
      return new Date(iso).toLocaleDateString('en-ZA', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return iso;
    }
  };

  // Format "2026-08" → "August 2026"
  const formatMonth = (yyyyMm) => {
    if (!yyyyMm) return '—';
    const [year, month] = yyyyMm.split('-');
    const date = new Date(Number(year), Number(month) - 1, 1);
    return date.toLocaleDateString('en-ZA', {
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-off-white">
      <Navbar />

      <div className="flex">
        <Sidebar userRole="admin" />

        <main className="flex-1">
          <div className="bg-primary px-8 py-4">
            <h1 className="text-2xl font-semibold text-white">
              Administrator Dashboard
            </h1>
          </div>

          <div className="p-8">
            {/* Welcome */}
            <div className="mb-8">
              <h2 className="text-3xl font-poppins font-semibold text-primary">
                Administrator Overview
              </h2>
              <p className="text-neutral mt-2 font-inter">
                Monitor and manage the Assistant Applications and Claims Management System.
              </p>

              {error && (
                <p className="mt-2 text-sm text-error font-inter">
                  Could not load dashboard data: {error}
                </p>
              )}
            </div>

            {/* SYSTEM STATISTICS */}
            <section className="mb-8">
              <h3 className="text-2xl font-poppins font-semibold text-primary mb-4">
                System Statistics
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {statisticCards.map((stat) => (
                  <Card key={stat.title}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-neutral font-inter font-medium">
                          {stat.title}
                        </p>
                        <p className="text-3xl font-poppins font-bold text-primary mt-3">
                          {loading ? '—' : stat.value}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>

            {/* MONTHLY WORK + PENDING ITEMS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Monthly Work */}
              <section>
                <h3 className="text-2xl font-poppins font-semibold text-primary mb-4">
                  Monthly Work Summary
                </h3>

                <Card>
                  {loading ? (
                    <p className="py-6 text-center text-neutral font-inter">
                      Loading…
                    </p>
                  ) : monthlyWork.length === 0 ? (
                    <p className="py-6 text-center text-neutral font-inter">
                      No work sessions recorded yet
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {monthlyWork.map((row) => (
                        <div
                          key={row.month}
                          className="flex justify-between items-center border-b border-neutral pb-3 last:border-0"
                        >
                          <span className="font-semibold text-dark font-inter">
                            {formatMonth(row.month)}
                          </span>
                          <span className="font-semibold text-primary font-inter">
                            {row.total_sessions} session
                            {row.total_sessions === 1 ? '' : 's'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => navigate('/claims-verification')}
                    className="text-primary font-semibold hover:underline mt-4 font-inter"
                  >
                    View claims →
                  </button>
                </Card>
              </section>

              {/* Pending Appointments */}
              <section>
                <h3 className="text-2xl font-poppins font-semibold text-primary mb-4">
                  Pending Appointments
                </h3>

                <Card>
                  {loading ? (
                    <p className="py-6 text-center text-neutral font-inter">
                      Loading…
                    </p>
                  ) : pendingAppointments.length === 0 ? (
                    <p className="py-6 text-center text-neutral font-inter">
                      No pending appointments
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {pendingAppointments.map((appointment) => (
                        <div
                          key={appointment.application_id}
                          className="border-b border-neutral pb-4 last:border-0"
                        >
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <p className="font-semibold text-dark font-inter">
                                {appointment.module}
                              </p>
                              <p className="text-sm text-neutral mt-1 font-inter">
                                {appointment.lecturer} → {appointment.student}
                              </p>
                              <p className="text-sm text-neutral mt-1 font-inter">
                                {formatDate(appointment.date_submitted)}
                              </p>
                            </div>
                            <StatusBadge status={appointment.status} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => navigate('/appointment-approvals')}
                    className="text-primary font-semibold hover:underline mt-4 font-inter"
                  >
                    Review appointments →
                  </button>
                </Card>
              </section>
            </div>

            {/* ADMINISTRATOR ACTIONS */}
            <section className="mb-8">
              <h3 className="text-2xl font-poppins font-semibold text-primary mb-4">
                Administrator Actions
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <button
                  onClick={() => navigate('/budget-management')}
                  className="bg-primary text-white px-6 py-4 rounded-xl font-semibold hover:bg-primary-dark transition font-inter"
                >
                  Manage Budgets
                </button>

                <button
                  onClick={() => navigate('/appointment-approvals')}
                  className="bg-primary text-white px-6 py-4 rounded-xl font-semibold hover:bg-primary-dark transition font-inter"
                >
                  Review Recommendations
                </button>

                <button
                  onClick={() => navigate('/appointment-approvals')}
                  className="bg-primary text-white px-6 py-4 rounded-xl font-semibold hover:bg-primary-dark transition font-inter"
                >
                  Approve Appointments
                </button>

                <button
                  onClick={() => navigate('/claims-verification')}
                  className="border-2 border-primary text-primary px-6 py-4 rounded-xl font-semibold hover:bg-primary-lightest transition font-inter"
                >
                  Verify Claims
                </button>
              </div>
            </section>

            {/* PAYMENT INFORMATION */}
            <section>
              <h3 className="text-2xl font-poppins font-semibold text-primary mb-4">
                Payment Information
              </h3>

              <Card>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <p className="font-semibold text-dark font-inter">
                      Export payment information
                    </p>
                    <p className="text-sm text-neutral mt-1 font-inter">
                      Generate payment information for HR and Remuneration departments.
                    </p>
                  </div>

                  <button
                    onClick={() => navigate('/export-payments')}
                    className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition font-inter"
                  >
                    Export Payment Information
                  </button>
                </div>
              </Card>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;