import React from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Card from '../components/Card';

const LectureDashboard = () => {
  return (
    <div className="min-h-screen bg-off-white">
      {/* Top Navigation */}
      <Navbar />

      {/* Sidebar + Main Content */}
      <div className="flex">
        <Sidebar userRole="lecturer" />

        {/* Main Content */}
        <main className="flex-1">

          {/* Page Header */}
          <div className="bg-primary h-16 flex items-center px-8">
            <h1 className="text-3xl font-poppins font-bold text-white">
              Lecturer Dashboard
            </h1>
          </div>

          {/* Page Content */}
          <div className="p-8">

            {/* Introduction */}
            <div className="mb-8">
              <p className="text-neutral text-base font-inter">
                Here's an overview of your assistant applications and
                activities.
              </p>
            </div>

            {/* Overview */}
            <div className="mb-8">
              <h2 className="text-3xl font-poppins font-semibold text-primary mb-4">
                Overview
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                {/* Number of Applicants */}
                <Card>
                  <div>
                    <p className="text-sm text-neutral">
                      Number of Applicants
                    </p>

                    <p className="mt-2 text-3xl font-bold text-primary-dark">
                      48
                    </p>
                  </div>
                </Card>

                {/* Approved Demis */}
                <Card>
                  <div>
                    <p className="text-sm text-neutral">
                      Approved Demis
                    </p>

                    <p className="mt-2 text-3xl font-bold text-primary-dark">
                      20
                    </p>
                  </div>
                </Card>

                {/* Pending Applications */}
                <Card>
                  <div>
                    <p className="text-sm text-neutral">
                      Pending Applications
                    </p>

                    <p className="mt-2 text-3xl font-bold text-primary-dark">
                      3
                    </p>
                  </div>
                </Card>

                {/* Hours Allocated */}
                <Card>
                  <div>
                    <p className="text-sm text-neutral">
                      Hours Allocated
                    </p>

                    <p className="mt-2 text-3xl font-bold text-primary-dark">
                      120h
                    </p>
                  </div>
                </Card>

              </div>
            </div>

            {/* Budget Utilisation */}
            <div className="mb-8">
              <h2 className="text-3xl font-poppins font-semibold text-primary mb-4">
                Budget Utilisation
              </h2>

              <Card>
                <div className="mb-5">
                  <h3 className="text-xl font-poppins font-semibold text-primary-dark">
                    Current Budget
                  </h3>

                  <p className="mt-1 text-sm text-neutral">
                    View the budget allocated for your assistant appointments
                    and how much has been used.
                  </p>
                </div>

                {/* Budget Information */}
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">

                  {/* Allocated Budget */}
                  <div className="rounded-lg bg-off-white p-5">
                    <p className="text-sm text-neutral">
                      Allocated Budget
                    </p>

                    <p className="mt-2 text-2xl font-bold text-primary-dark">
                      R 20,000.00
                    </p>
                  </div>

                  {/* Amount Used */}
                  <div className="rounded-lg bg-off-white p-5">
                    <p className="text-sm text-neutral">
                      Amount Used
                    </p>

                    <p className="mt-2 text-2xl font-bold text-primary-dark">
                      R 8,000.00
                    </p>
                  </div>

                  {/* Remaining Budget */}
                  <div className="rounded-lg bg-off-white p-5">
                    <p className="text-sm text-neutral">
                      Remaining Budget
                    </p>

                    <p className="mt-2 text-2xl font-bold text-primary-dark">
                      R 12,000.00
                    </p>
                  </div>

                  {/* Budget Utilisation Percentage */}
                  <div className="rounded-lg bg-off-white p-5">
                    <p className="text-sm text-neutral">
                      Utilisation
                    </p>

                    <p className="mt-2 text-2xl font-bold text-primary-dark">
                      40%
                    </p>
                  </div>

                </div>

                {/* Progress Bar */}
                <div className="mt-6">

                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Budget Used
                    </span>

                    <span className="text-sm font-medium text-gray-700">
                      40%
                    </span>
                  </div>

                  <div className="h-3 w-full rounded-full bg-gray-200">
                    <div
                      className="h-3 rounded-full bg-primary"
                      style={{ width: '40%' }}
                    ></div>
                  </div>

                </div>
              </Card>
            </div>

            {/* Notifications */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">

                <h2 className="text-3xl font-poppins font-semibold text-primary">
                  Notifications
                </h2>

              </div>

              <Card>

                <div className="space-y-4">

                  {/* Notification 1 */}
                  <div className="border-b border-gray-200 pb-4">
                    <h3 className="font-semibold text-gray-800">
                      New Assistant Application
                    </h3>

                    <p className="mt-1 text-sm text-neutral">
                      A new student has submitted an application for your
                      module.
                    </p>

                    <p className="mt-2 text-xs text-gray-500">
                      Today
                    </p>
                  </div>

                  {/* Notification 2 */}
                  <div className="border-b border-gray-200 pb-4">
                    <h3 className="font-semibold text-gray-800">
                      Work Session Awaiting Verification
                    </h3>

                    <p className="mt-1 text-sm text-neutral">
                      A work session has been submitted and is awaiting your
                      verification.
                    </p>

                    <p className="mt-2 text-xs text-gray-500">
                      Yesterday
                    </p>
                  </div>

                  {/* Notification 3 */}
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      Appointment Update
                    </h3>

                    <p className="mt-1 text-sm text-neutral">
                      An assistant appointment has been updated.
                    </p>

                    <p className="mt-2 text-xs text-gray-500">
                      2 days ago
                    </p>
                  </div>

                </div>

              </Card>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default LectureDashboard;