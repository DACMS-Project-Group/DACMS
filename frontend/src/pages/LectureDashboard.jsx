import React from 'react';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';

const LectureDashboard = () => {
  return (
    <div className="flex min-h-screen bg-off-white">
      
      {/* ===== SIDEBAR - Lecturer Role ===== */}
      <Sidebar userRole="lecturer" />
      
      {/* ===== MAIN CONTENT ===== */}
      <div className="flex-1">

        {/* Page Title Bar */}
        <div className="bg-primary h-16 flex items-center px-8">
          <h1 className="text-4xl font-poppins font-bold text-white">
            Lecturer Dashboard
          </h1>
        </div>

        {/* Main Content */}
        <div className="container mx-auto p-8">

          {/* Description */}
          <div className="mb-8">
            <p className="text-neutral text-base font-inter">
              Here's an overview of your demi applications and activities.
            </p>
          </div>

          {/* ===== OVERVIEW STATS ===== */}
          <div className="mb-8">
            <h2 className="text-3xl font-poppins font-semibold text-primary mb-4">
              Overview
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

              {/* Applicants */}
              <Card>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary-lightest flex items-center justify-center text-primary font-bold text-lg">
                    A
                  </div>
                  <div>
                    <p className="text-sm text-neutral font-inter">Applicants</p>
                    <h2 className="text-2xl font-poppins font-bold text-dark">48</h2>
                  </div>
                </div>
              </Card>

              {/* Approved Demis */}
              <Card>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary-lightest flex items-center justify-center text-primary font-bold text-lg">
                    D
                  </div>
                  <div>
                    <p className="text-sm text-neutral font-inter">Approved Demis</p>
                    <h2 className="text-2xl font-poppins font-bold text-dark">20</h2>
                  </div>
                </div>
              </Card>

              {/* Pending Applications */}
              <Card>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary-lightest flex items-center justify-center text-primary font-bold text-lg">
                    P
                  </div>
                  <div>
                    <p className="text-sm text-neutral font-inter">Pending Applications</p>
                    <h2 className="text-2xl font-poppins font-bold text-dark">3</h2>
                  </div>
                </div>
              </Card>

              {/* Hours Allocated */}
              <Card>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary-lightest flex items-center justify-center text-primary font-bold text-lg">
                    H
                  </div>
                  <div>
                    <p className="text-sm text-neutral font-inter">Hours Allocated</p>
                    <h2 className="text-2xl font-poppins font-bold text-dark">120h</h2>
                  </div>
                </div>
              </Card>

            </div>
          </div>

          {/* ===== BUDGET ALLOCATION ===== */}
          <div className="mb-8">
            <Card>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-poppins font-semibold text-dark">
                    Budget Allocation
                  </h3>
                  <p className="text-neutral mt-1 font-inter">
                    View the current budget allocated for demi appointments.
                  </p>
                </div>
                <button className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition text-center">
                  View Budget Allocation →
                </button>
              </div>
            </Card>
          </div>

          {/* ===== NOTIFICATIONS ===== */}
          <div>
            <h2 className="text-3xl font-poppins font-semibold text-primary mb-4">
              Notifications
            </h2>

            <Card>
              <div className="space-y-5">

                {/* Application Review */}
                <div className="border-b border-neutral pb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 rounded-full bg-warning mt-2"></div>
                    <div>
                      <p className="font-semibold text-dark font-inter">
                        Applications to Review
                      </p>
                      <p className="text-dark font-inter">
                        You have 3 demi applications waiting for your review.
                      </p>
                      <p className="text-sm text-neutral mt-1 font-inter">Today</p>
                    </div>
                  </div>
                </div>

                {/* Upcoming Appointment */}
                <div className="border-b border-neutral pb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 rounded-full bg-warning mt-2"></div>
                    <div>
                      <p className="font-semibold text-dark font-inter">
                        Upcoming Appointment
                      </p>
                      <p className="text-dark font-inter">
                        You have an appointment scheduled for tomorrow at 10:00.
                      </p>
                      <p className="text-sm text-neutral mt-1 font-inter">Today</p>
                    </div>
                  </div>
                </div>

                {/* Work Session Review */}
                <div className="border-b border-neutral pb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 rounded-full bg-primary mt-2"></div>
                    <div>
                      <p className="font-semibold text-dark font-inter">
                        Work Session Review
                      </p>
                      <p className="text-dark font-inter">
                        A demi work session has been submitted for your review.
                      </p>
                      <p className="text-sm text-neutral mt-1 font-inter">Yesterday</p>
                    </div>
                  </div>
                </div>

                {/* Claim Submitted */}
                <div>
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 rounded-full bg-success mt-2"></div>
                    <div>
                      <p className="font-semibold text-dark font-inter">
                        Claim Submitted
                      </p>
                      <p className="text-dark font-inter">
                        A new claim has been submitted and requires your review.
                      </p>
                      <p className="text-sm text-neutral mt-1 font-inter">Yesterday</p>
                    </div>
                  </div>
                </div>

                {/* View All */}
                <div className="text-right pt-2">
                  <a href="#" className="text-primary font-semibold hover:underline font-inter">
                    View all →
                  </a>
                </div>

              </div>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LectureDashboard;