//import React from 'react';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const statistics = [
    {
      title: 'Total Modules',
      value: '24',
    },
    {
      title: 'Total Lecturers',
      value: '56',
    },
    {
      title: 'Total DEMIs',
      value: '60',
    },
    {
      title: 'Pending Approvals',
      value: '18',
    },
    {
      title: 'Pending Claims',
      value: '12',
    },
    {
      title: 'Budget Usage',
      value: '78%',
    },
  ];

  const monthlyClaims = [
    {
      month: 'August',
      amount: 'R 45 000',
    },
    {
      month: 'July',
      amount: 'R 38 500',
    },
    {
      month: 'June',
      amount: 'R 42 750',
    },
  ];

  const pendingAppointments = [
    {
      lecturer: 'Dr Example',
      demi: 'Demi Example',
      module: 'CMPG xxx',
      date: '28 August 2026',
      status: 'Pending',
    },
    {
      lecturer: 'Prof Example',
      demi: 'Demi Example',
      module: 'CMPG xxx',
      date: '29 August 2026',
      status: 'Pending',
    },
  ];

  return (
    <div className="min-h-screen bg-off-white">

      {/* Top Navbar */}
      

      {/* Sidebar + Main Dashboard Layout */}
      <div className="flex">

      {/* Administrator Sidebar */}
      <Sidebar userRole="admin" />

      {/* Main Dashboard Content */}
        <main className="flex-1">

      {/* Page Title */}
      <div className="bg-primary h-16 flex items-center px-8">
        <h1 className="text-3xl font-poppins font-bold text-white">
          Administrator Dashboard
        </h1>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-8">

        {/* Welcome */}
        <div className="mb-8">
          <h2 className="text-3xl font-poppins font-semibold text-primary">
            Administrator Overview
          </h2>

          <p className="text-neutral mt-2">
            Monitor and manage the Demi Application and Claims Management System.
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
                    <p className="text-neutral font-medium">
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
                    <span className="font-semibold text-dark">
                      {claim.month}
                    </span>

                    <span className="font-semibold text-primary">
                      {claim.amount}
                    </span>
                  </div>
                ))}

              </div>

              <button
                onClick={() => navigate('/claims')}
                className="text-primary font-semibold hover:underline mt-4"
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
                        <p className="font-semibold text-dark">
                          {appointment.module}
                        </p>

                        <p className="text-sm text-neutral mt-1">
                          {appointment.lecturer} → {appointment.demi}
                        </p>

                        <p className="text-sm text-neutral mt-1">
                          {appointment.date}
                        </p>
                      </div>

                      <StatusBadge status={appointment.status} />

                    </div>
                  </div>
                ))}

              </div>

              <button
                onClick={() => navigate('/review-applications')}
                className="text-primary font-semibold hover:underline mt-4"
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
              className="bg-primary text-white px-6 py-4 rounded-xl font-semibold hover:bg-primary-dark transition"
            >
              Manage Budgets
            </button>

            <button
              onClick={() => navigate('/applications')}
              className="bg-primary text-white px-6 py-4 rounded-xl font-semibold hover:bg-primary-dark transition"
            >
              Review Recommendations
            </button>

            <button
              onClick={() => navigate('/review-applications')}
              className="bg-primary text-white px-6 py-4 rounded-xl font-semibold hover:bg-primary-dark transition"
            >
              Approve Appointments
            </button>

            <button
              onClick={() => navigate('/claims')}
              className="border-2 border-primary text-primary px-6 py-4 rounded-xl font-semibold hover:bg-primary-lightest transition"
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
                <p className="font-semibold text-dark">
                  Export payment information
                </p>

                <p className="text-sm text-neutral mt-1">
                  Generate payment information for HR and Remuneration departments.
                </p>
              </div>

              <button
                onClick={() => navigate('/export-payments')}
                className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition"
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