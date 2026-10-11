import { useEffect, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import { apiGet } from '../api';

// ... formatDate and mapApplication stay identical ...

const ApplicationDetail = () => {
  // ... all your state + useEffect stay identical ...
  // (I'm only rewriting the JSX — nothing above the `if (loading)` block changes)

  // ---------------------------------------------------------
  // Loading state
  // ---------------------------------------------------------
  if (loading) {
    return (
      <div className="min-h-screen bg-off-white">
        <Navbar />
        <div className="flex">
          <Sidebar userRole="student" />
          <main className="flex-1 min-w-0">
            <div className="bg-primary h-16 flex items-center px-4 md:px-8">
              <h1 className="text-xl md:text-2xl font-poppins font-semibold text-white">
                Application Details
              </h1>
            </div>
            <div className="p-4 md:p-8">
              <Card>
                <p className="py-6 text-center text-neutral">
                  Loading application...
                </p>
              </Card>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------
  // Application not found / error state
  // ---------------------------------------------------------
  if (!application) {
    return (
      <div className="min-h-screen bg-off-white">
        <Navbar />
        <div className="flex">
          <Sidebar userRole="student" />
          <main className="flex-1 min-w-0">
            <div className="bg-primary h-16 flex items-center px-4 md:px-8">
              <h1 className="text-xl md:text-2xl font-poppins font-semibold text-white">
                Application Details
              </h1>
            </div>
            <div className="p-4 md:p-8">
              <Card>
                <h2 className="text-xl md:text-2xl font-poppins font-semibold text-dark">
                  Application Not Found
                </h2>
                <p className="text-neutral mt-2">
                  {error ||
                    'Please return to your applications and select an application to view its details.'}
                </p>
                <button
                  onClick={() => navigate('/applications')}
                  className="mt-6 bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition w-full md:w-auto"
                >
                  Back to Applications
                </button>
              </Card>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------
  // Determine approval progress
  // ---------------------------------------------------------
  const getProgress = () => {
    switch (application.status) {
      case 'Approved':
        return 3;
      case 'Under Review':
        return 2;
      case 'Pending':
        return 1;
      case 'Rejected':
        return 2;
      default:
        return 1;
    }
  };

  const progress = getProgress();

  return (
    <div className="min-h-screen bg-off-white">
      <Navbar />
      <div className="flex">
        <Sidebar userRole="student" />
        <main className="flex-1 min-w-0">
          <div className="bg-primary h-16 flex items-center px-4 md:px-8">
            <h1 className="text-xl md:text-2xl font-poppins font-semibold text-white">
              Application Details
            </h1>
          </div>

          <div className="p-4 md:p-8">
            <div className="mb-6 md:mb-8">
              <h2 className="text-2xl md:text-3xl font-poppins font-semibold text-primary">
                {application.moduleCode}
              </h2>
              <p className="text-neutral mt-2 break-words">
                Application Reference: {application.reference || '—'}
              </p>
            </div>

            <Card>
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div className="min-w-0">
                  <h3 className="text-xl md:text-2xl font-poppins font-semibold text-dark break-words">
                    {application.moduleName}
                  </h3>
                  <p className="text-neutral mt-2">
                    Module Code: {application.moduleCode}
                  </p>
                  <p className="text-neutral mt-1 break-words">
                    Lecturer: {application.lecturer}
                  </p>
                </div>
                <StatusBadge status={application.status} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div>
                  <p className="text-sm text-neutral">Date Submitted</p>
                  <p className="font-semibold text-dark mt-1">
                    {application.dateSubmitted}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-neutral">Application Status</p>
                  <p className="font-semibold text-dark mt-1">
                    {application.status}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-neutral">Application Reference</p>
                  <p className="font-semibold text-dark mt-1 break-words">
                    {application.reference || '—'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-neutral">Module</p>
                  <p className="font-semibold text-dark mt-1 break-words">
                    {application.moduleCode} - {application.moduleName}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="mt-6">
              <h3 className="text-lg md:text-xl font-poppins font-semibold text-dark">
                Approval Progress
              </h3>

              <div className="mt-8">
                <div className="flex items-center">
                  <div
                    className={`w-6 h-6 rounded-full ${
                      progress >= 1 ? 'bg-primary' : 'bg-light-grey'
                    }`}
                  />
                  <div
                    className={`flex-1 h-1 ${
                      progress >= 2 ? 'bg-primary' : 'bg-light-grey'
                    }`}
                  />
                  <div
                    className={`w-6 h-6 rounded-full ${
                      progress >= 2 ? 'bg-primary' : 'bg-light-grey'
                    }`}
                  />
                  <div
                    className={`flex-1 h-1 ${
                      progress >= 3 ? 'bg-primary' : 'bg-light-grey'
                    }`}
                  />
                  <div
                    className={`w-6 h-6 rounded-full ${
                      progress >= 3 ? 'bg-primary' : 'bg-light-grey'
                    }`}
                  />
                </div>

                <div className="flex justify-between mt-3 text-xs md:text-sm text-neutral">
                  <span>Submitted</span>
                  <span>Under Review</span>
                  <span>
                    {application.status === 'Rejected' ? 'Rejected' : 'Approved'}
                  </span>
                </div>
              </div>

              <div className="mt-8 p-4 bg-primary-lightest rounded-xl">
                {application.status === 'Pending' && (
                  <p className="text-primary font-medium">
                    Your application has been submitted and is waiting for
                    review.
                  </p>
                )}
                {application.status === 'Under Review' && (
                  <p className="text-primary font-medium">
                    Your application is currently being reviewed by the
                    lecturer.
                  </p>
                )}
                {application.status === 'Approved' && (
                  <p className="text-primary font-medium">
                    Your application has been approved.
                  </p>
                )}
                {application.status === 'Rejected' && (
                  <p className="text-primary font-medium">
                    Your application was not approved. Please review the
                    application outcome for more information.
                  </p>
                )}
              </div>
            </Card>

            <div className="mt-6 md:mt-8">
              <button
                onClick={() => navigate('/applications')}
                className="text-primary font-semibold hover:underline"
              >
                ← Back to Applications
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ApplicationDetail;