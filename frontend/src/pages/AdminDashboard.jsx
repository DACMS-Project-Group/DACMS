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
  const [appointmentPage, setAppointmentPage] = useState(1);
  const APPOINTMENTS_PER_PAGE = 4;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/admin/dashboard', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fecthing dashboard data: ', error);
      }
    }

    fetchData();
  }, []);

  const statistics = [
    { title: "Total Modules", value: data?.stats?.total_modules ?? 'null' },
    { title: 'Total Lecturers', value: data?.stats?.total_lecturers ?? 'null' },
    { title: 'Total Assistants', value: data?.stats?.total_demis ?? 'null' },
    { title: 'Pending Approvals', value: data?.stats?.total_pending_approvals ?? 'null' },
    { title: 'Pending Claims', value: data?.stats?.total_pending_claims ?? 'null' },
  ];

  const monthlyClaims = data?.monthlyClaims || [];
  const monthlyWork = data?.monthlyWork || [];
  const pendingAppointments = data?.pendingAppointments || [];
  const totalAppointmentPages = Math.max(
    Math.ceil(pendingAppointments.length / APPOINTMENTS_PER_PAGE),
    1
  );

  useEffect(() => {
    setAppointmentPage((currentPage) => Math.min(currentPage, totalAppointmentPages));
  }, [totalAppointmentPages]);

  const currentAppointments = pendingAppointments.slice(
    (appointmentPage - 1) * APPOINTMENTS_PER_PAGE,
    appointmentPage * APPOINTMENTS_PER_PAGE
  );

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

          {/* Main Content */}
          <div className="p-8">
            {/* Welcome */}
            <div className="mb-8">
              <h2 className="text-3xl font-poppins font-semibold text-primary">
                Administrator Overview
              </h2>
              <p className="text-neutral mt-2 font-inter">
                Monitor and manage the Assistant Applications and Claims Management System.
              </p>
            </div>

            {/* ================================
                SYSTEM STATISTICS
            ================================= */}
            <section className="mb-8">
              <h3 className="text-2xl font-poppins font-semibold text-primary mb-4">
                System Statistics
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {statistics.map((stat) => (
                  <Card key={stat.title}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-neutral font-inter font-medium">
                          {stat.title}
                        </p>
                        <p className="text-3xl font-poppins font-bold text-primary mt-3">
                          {stat.value}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>

            {/* ================================
                MONTHLY CLAIMS, MONTHLY WORK SESSIONS, AND PENDING CLAIMS
            ================================= */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8 items-stretch">
              {/* Monthly Claims */}
              <section className="min-w-0 h-full flex flex-col">
                <h3 className="text-2xl font-poppins font-semibold text-primary mb-4">
                  Monthly Claims Summary
                </h3>

                <Card className="h-full flex flex-col justify-between">
                  <div className="space-y-4 flex-1">
                    {monthlyClaims.map((claim) => (
                      <div
                        key={claim.month}
                        className="flex justify-between items-center border-b border-neutral pb-3 last:border-0"
                      >
                        <span className="font-semibold text-dark font-inter">
                          {claim.month}
                        </span>
                        <span className="font-semibold text-primary font-inter">
                          {claim.amount}
                        </span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => navigate('/claims-verification')}
                    className="text-primary font-semibold hover:underline mt-4 font-inter"
                  >
                    View claims →
                  </button>
                </Card>
              </section>

              <section className="min-w-0 h-full flex flex-col">
                <h3 className="text-2xl font-poppins font-semibold text-primary mb-4">
                  Work Sessions
                </h3>

                <Card className="h-full flex flex-col justify-between">
                  <div className="space-y-4 flex-1">
                    {monthlyWork.map((month) => (
                      <div
                        key={month.month}
                        className="flex justify-between items-center border-b border-neutral pb-3 last:border-0"
                      >
                        <span className="font-semibold text-dark font-inter">
                          {month.month}
                        </span>
                        <span className="font-semibold text-primary font-inter">
                          {month.total_sessions}
                        </span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => navigate('/claims-verification')}
                    className="text-primary font-semibold hover:underline mt-4 font-inter"
                  >
                    View claims →
                  </button>
                </Card>
              </section>

              {/* Pending Appointments */}
              <section className="min-w-0 h-full flex flex-col">
                <h3 className="text-2xl font-poppins font-semibold text-primary mb-4">
                  Pending Appointments
                </h3>

                <Card className="h-full flex flex-col justify-between">
                  <div className="space-y-3 flex-1">
                    {currentAppointments.length > 0 ? (
                      currentAppointments.map((appointment, index) => (
                        <div
                          key={`${appointment.module}-${appointment.date}-${index}`}
                          className="border-b border-neutral/60 pb-3 last:border-0"
                        >
                          <div className="flex justify-between items-start gap-3">
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-dark font-inter truncate">
                                {appointment.module}
                              </p>
                              <p className="text-xs text-neutral mt-1 font-inter truncate">
                                {appointment.lecturer} → {appointment.assistant}
                              </p>
                              <p className="text-xs text-neutral mt-1 font-inter">
                                {appointment.date}
                              </p>
                            </div>
                            <div className="shrink-0">
                              <StatusBadge status={appointment.status} />
                            </div>
                          </div>
                          <StatusBadge status={appointment.status} />
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-neutral font-inter">No pending appointments.</p>
                    )}
                  </div>

                  <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-xs font-inter text-neutral">
                      Showing {currentAppointments.length > 0 ? (appointmentPage - 1) * APPOINTMENTS_PER_PAGE + 1 : 0}
                      {pendingAppointments.length > 0 ? `-${Math.min(appointmentPage * APPOINTMENTS_PER_PAGE, pendingAppointments.length)}` : ''}
                      {pendingAppointments.length > 0 ? ` of ${pendingAppointments.length}` : ''}
                    </span>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setAppointmentPage((page) => Math.max(page - 1, 1))}
                        disabled={appointmentPage === 1}
                        aria-label="Previous page"
                        className="text-2xl leading-none text-primary disabled:opacity-40 disabled:cursor-not-allowed hover:text-primary-dark"
                      >
                        ‹
                      </button>

                      <div className="flex items-center gap-2">
                        {Array.from({ length: totalAppointmentPages }, (_, index) => index + 1).map((page) => (
                          <button
                            key={page}
                            type="button"
                            aria-label={`Go to page ${page}`}
                            onClick={() => setAppointmentPage(page)}
                            className={`h-2 w-2 rounded-full transition ${
                              page === appointmentPage
                                ? 'bg-primary'
                                : 'bg-primary/30 hover:bg-primary/60'
                            }`}
                          />
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => setAppointmentPage((page) => Math.min(page + 1, totalAppointmentPages))}
                        disabled={appointmentPage === totalAppointmentPages}
                        aria-label="Next page"
                        className="text-2xl leading-none text-primary disabled:opacity-40 disabled:cursor-not-allowed hover:text-primary-dark"
                      >
                        ›
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate('/appointment-approvals')}
                    className="text-primary font-semibold hover:underline mt-4 font-inter"
                  >
                    Review appointments →
                  </button>
                </Card>
              </section>
            </div>

            {/* ================================
                ADMINISTRATOR ACTIONS
            ================================= */}
            <section className="mb-8">
              <h3 className="text-2xl font-poppins font-semibold text-primary mb-4">
                Administrator Actions
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
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

            {/* ================================
<<<<<<< HEAD
                Claims Export
=======
                PAYMENT INFORMATION
>>>>>>> c09018f (fixed routing for some pages and fixed sidebar sitting on top of the navbar in some pages)
            ================================= */}
            <section>
              <h3 className="text-2xl font-poppins font-semibold text-primary mb-4">
                Claims Export
              </h3>

              <Card>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <p className="font-semibold text-dark font-inter">
                      Export approved claims
                    </p>
                    <p className="text-sm text-neutral mt-1 font-inter">
                      Generate payment information for HR and Remuneration departments.
                    </p>
                  </div>

                  <button
                    onClick={() => navigate('/export-payments')}
                    className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition font-inter"
                  >
                    Export Claims
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
