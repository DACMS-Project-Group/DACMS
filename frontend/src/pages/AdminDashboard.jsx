import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/admin/dashboard_statistics', {
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
    { title: "Total", value: data?.stats?.total_modules ?? 'null' },
    { title: 'Total Lecturers', value: data?.stats?.total_lecturers ?? 'null' },
    { title: 'Total Assistants', value: data?.stats?.total_demis ?? 'null' },
    { title: 'Pending Approvals', value: data?.stats?.total_pending_approvals ?? 'null' },
    { title: 'Pending Claims', value: data?.stats?.total_pending_claims ?? 'null' },
    { title: 'Budget Usage', value: '--' },
  ];

  const monthlyClaims = [
    { month: 'August', amount: 'R 45 000' },
    { month: 'July', amount: 'R 38 500' },
    { month: 'June', amount: 'R 42 750' },
  ];

  const pendingAppointments = data?.pendingAppointments || [];

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
                MONTHLY CLAIMS + PENDING ITEMS
            ================================= */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Monthly Claims */}
              <section>
                <h3 className="text-2xl font-poppins font-semibold text-primary mb-4">
                  Monthly Claims Summary
                </h3>

                <Card>
                  <div className="space-y-4">
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

              {/* Pending Appointments */}
              <section>
                <h3 className="text-2xl font-poppins font-semibold text-primary mb-4">
                  Pending Appointments
                </h3>

                <Card>
                  <div className="space-y-4">
                    {pendingAppointments.map((appointment, index) => (
                      <div
                        key={index}
                        className="border-b border-neutral pb-4 last:border-0"
                      >
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <p className="font-semibold text-dark font-inter">
                              {appointment.module}
                            </p>
                            <p className="text-sm text-neutral mt-1 font-inter">
                              {appointment.lecturer} → {appointment.assistant}
                            </p>
                            <p className="text-sm text-neutral mt-1 font-inter">
                              {appointment.date}
                            </p>
                          </div>
                          <StatusBadge status={appointment.status} />
                        </div>
                      </div>
                    ))}
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

            {/* ================================
                PAYMENT INFORMATION
            ================================= */}
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