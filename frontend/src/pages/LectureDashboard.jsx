import React from 'react';
import Card from '../components/Card';

const LectureDashboard = () => {
  return (
    <div className="min-h-screen bg-off-white">

      {/* ================= TOP WHITE HEADER ================= */}
      <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8">

        {/* NWU Logo */}
        <div className="flex items-center gap-4">

          {/* Temporary NWU logo text */}
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
            <span className="text-white font-bold text-lg">
              NWU
            </span>
          </div>

          <span className="text-xl font-poppins font-semibold text-primary">
            North-West University
          </span>

        </div>


        {/* Lecturer Profile */}
        <div className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-full bg-primary-lightest flex items-center justify-center text-primary font-bold">
            L
          </div>

          <div>
            <p className="font-semibold text-dark">
              Lecturer
            </p>

            <p className="text-sm text-neutral">
              NWU
            </p>
          </div>

        </div>

      </header>


      {/* ================= CONTENT BELOW HEADER ================= */}
      <div className="flex min-h-[calc(100vh-80px)]">


        {/* ================= SIDEBAR ================= */}
        <aside className="w-64 bg-primary text-white flex flex-col">

          {/* Navigation */}
          <nav className="flex-1 p-4">

            {/* Dashboard */}
            <a
              href="#"
              className="block px-4 py-3 rounded-xl bg-primary-light mb-2 font-semibold"
            >
              Dashboard
            </a>


            {/* Applications */}
            <a
              href="#"
              className="block px-4 py-3 rounded-xl hover:bg-primary-light mb-2"
            >
              Applications
            </a>


            {/* Claims */}
            <a
              href="#"
              className="block px-4 py-3 rounded-xl hover:bg-primary-light mb-2"
            >
              Claims
            </a>


            {/* Appointments */}
            <a
              href="#"
              className="block px-4 py-3 rounded-xl hover:bg-primary-light mb-2"
            >
              Appointments
            </a>


            {/* Work Overview */}
            <a
              href="#"
              className="block px-4 py-3 rounded-xl hover:bg-primary-light mb-2"
            >
              Work Overview
            </a>


            {/* Notifications */}
            <a
              href="#"
              className="block px-4 py-3 rounded-xl hover:bg-primary-light mb-2"
            >
              Notifications
            </a>

          </nav>


          {/* Bottom Navigation */}
          <div className="p-4 border-t border-primary-light">

            {/* Profile */}
            <a
              href="#"
              className="block px-4 py-3 rounded-xl hover:bg-primary-light mb-2"
            >
              Profile
            </a>


            {/* Logout */}
            <a
              href="#"
              className="block px-4 py-3 rounded-xl hover:bg-primary-light"
            >
              Logout
            </a>

          </div>

        </aside>


        {/* ================= MAIN CONTENT ================= */}
        <main className="flex-1">

          {/* ================= CONTENT ================= */}
          <div className="container mx-auto p-8">


            {/* Welcome */}
            <div className="mb-8">

              <h1 className="text-3xl font-poppins font-semibold text-primary">
                Welcome back, Lecturer!
              </h1>

              <p className="text-neutral mt-2">
                Here's an overview of your demi applications and activities.
              </p>

            </div>


            {/* ================= OVERVIEW ================= */}
            <div className="mb-8">

              <h2 className="text-2xl font-poppins font-semibold text-primary mb-4">
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
                      <p className="text-sm text-neutral">
                        Applicants
                      </p>

                      <h2 className="text-2xl font-bold text-dark">
                        48
                      </h2>
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
                      <p className="text-sm text-neutral">
                        Approved Demis
                      </p>

                      <h2 className="text-2xl font-bold text-dark">
                        20
                      </h2>
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
                      <p className="text-sm text-neutral">
                        Pending Applications
                      </p>

                      <h2 className="text-2xl font-bold text-dark">
                        3
                      </h2>
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
                      <p className="text-sm text-neutral">
                        Hours Allocated
                      </p>

                      <h2 className="text-2xl font-bold text-dark">
                        120h
                      </h2>
                    </div>

                  </div>
                </Card>

              </div>

            </div>


            {/* ================= BUDGET ================= */}
            <div className="mb-8">

              <Card>

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                  <div>

                    <h3 className="text-xl font-poppins font-semibold text-primary">
                      Budget Allocation
                    </h3>

                    <p className="text-neutral mt-1">
                      View the current budget allocated for demi appointments.
                    </p>

                  </div>


                  <button className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition">
                    View Budget Allocation →
                  </button>

                </div>

              </Card>

            </div>


            {/* ================= NOTIFICATIONS ================= */}
            <div>

              <h2 className="text-2xl font-poppins font-semibold text-primary mb-4">
                Notifications
              </h2>


              <Card>

                <div className="space-y-5">


                  {/* Applications */}
                  <div className="border-b border-neutral pb-4">

                    <div className="flex items-start gap-3">

                      <div className="w-3 h-3 rounded-full bg-primary mt-2"></div>

                      <div>

                        <p className="font-semibold text-dark">
                          Applications to Review
                        </p>

                        <p className="text-neutral">
                          You have 3 demi applications waiting for your review.
                        </p>

                        <p className="text-sm text-neutral mt-1">
                          Today
                        </p>

                      </div>

                    </div>

                  </div>


                  {/* Appointment */}
                  <div className="border-b border-neutral pb-4">

                    <div className="flex items-start gap-3">

                      <div className="w-3 h-3 rounded-full bg-primary mt-2"></div>

                      <div>

                        <p className="font-semibold text-dark">
                          Upcoming Appointment
                        </p>

                        <p className="text-neutral">
                          You have an appointment scheduled for tomorrow at 10:00.
                        </p>

                        <p className="text-sm text-neutral mt-1">
                          Today
                        </p>

                      </div>

                    </div>

                  </div>


                  {/* Work Session */}
                  <div className="border-b border-neutral pb-4">

                    <div className="flex items-start gap-3">

                      <div className="w-3 h-3 rounded-full bg-primary mt-2"></div>

                      <div>

                        <p className="font-semibold text-dark">
                          Work Session Review
                        </p>

                        <p className="text-neutral">
                          A demi work session has been submitted for your review.
                        </p>

                        <p className="text-sm text-neutral mt-1">
                          Yesterday
                        </p>

                      </div>

                    </div>

                  </div>


                  {/* Claim */}
                  <div>

                    <div className="flex items-start gap-3">

                      <div className="w-3 h-3 rounded-full bg-primary mt-2"></div>

                      <div>

                        <p className="font-semibold text-dark">
                          Claim Submitted
                        </p>

                        <p className="text-neutral">
                          A new claim has been submitted and requires your review.
                        </p>

                        <p className="text-sm text-neutral mt-1">
                          Yesterday
                        </p>

                      </div>

                    </div>

                  </div>


                  {/* View All */}
                  <div className="text-right pt-2">

                    <a
                      href="#"
                      className="text-primary font-semibold hover:underline"
                    >
                      View all →
                    </a>

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