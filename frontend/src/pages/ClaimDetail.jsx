import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';

const ClaimDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const claim = location.state?.claim;

  // Fallback data for testing the page directly
  const defaultClaim = {
    id: 1,
    reference: 'CLM-2026-001',
    moduleCode: 'CMPG311',
    moduleName: 'Databases',
    lecturer: 'Lecturer Name',
    period: '02 Sep 2026 - 05 Sep 2026',
    hours: 8.5,
    hourlyRate: 45,
    amount: 382.5,
    status: 'Pending',
    submittedDate: '13 September 2026',
  };

  const currentClaim = claim || defaultClaim;

  const student = {
    studentNumber: '12345678',
    fullName: 'John Doe',
    bankingStatus: 'Banking details verified',
  };

  // Work sessions included in this claim
  const approvedSessions = [
    {
      id: 1,
      date: '2026-09-02',
      activity: 'Student consultation',
      startTime: '08:00',
      endTime: '12:00',
      hours: 4,
    },
    {
      id: 2,
      date: '2026-09-05',
      activity: 'Tutorial assistance',
      startTime: '09:00',
      endTime: '13:30',
      hours: 4.5,
    },
  ];

  const formatDate = (date) => {
    return new Date(`${date}T00:00:00`).toLocaleDateString('en-ZA', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatAmount = (amount) => {
    return `R ${amount.toLocaleString('en-ZA', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const handleBackToClaims = () => {
    navigate('/claims');
  };

  return (
    <div className="min-h-screen bg-off-white">

      {/* Top Navigation */}
      <Navbar />

      {/* Sidebar + Main Content */}
      <div className="flex">

        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1">

          {/* Page Header */}
          <div className="bg-primary px-8 py-4">
            <h1 className="text-2xl font-semibold text-white">
              Claim Detail
            </h1>
          </div>

          {/* Page Content */}
          <div className="p-8">

            {/* Back Button */}
            <div className="mb-6">
              <button
                type="button"
                onClick={handleBackToClaims}
                className="font-medium text-primary transition hover:text-primary-dark"
              >
                ← Back to Claims
              </button>
            </div>

            {/* Claim Overview */}
            <Card className="mb-6">

              <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                <div>
                  <p className="text-sm text-neutral">
                    Claim Reference
                  </p>

                  <h2 className="mt-1 text-xl font-semibold text-primary-dark">
                    {currentClaim.reference}
                  </h2>
                </div>

                <StatusBadge status={currentClaim.status} />

              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

                <div>
                  <p className="text-sm text-neutral">
                    Claim Period
                  </p>

                  <p className="mt-1 font-semibold text-gray-800">
                    {currentClaim.period}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-neutral">
                    Submitted Date
                  </p>

                  <p className="mt-1 font-semibold text-gray-800">
                    {currentClaim.submittedDate}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-neutral">
                    Claim Status
                  </p>

                  <div className="mt-2">
                    <StatusBadge status={currentClaim.status} />
                  </div>
                </div>

              </div>

            </Card>

            {/* Student Information */}
            <Card className="mb-6">

              <div className="mb-5">
                <h2 className="text-lg font-semibold text-primary-dark">
                  Student Information
                </h2>

                <p className="mt-1 text-sm text-neutral">
                  Student information associated with this claim.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

                <div>
                  <p className="text-sm text-neutral">
                    Student Number
                  </p>

                  <p className="mt-1 font-semibold text-gray-800">
                    {student.studentNumber}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-neutral">
                    Full Name
                  </p>

                  <p className="mt-1 font-semibold text-gray-800">
                    {student.fullName}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-neutral">
                    Banking Details
                  </p>

                  <p className="mt-1 font-semibold text-green-700">
                    {student.bankingStatus}
                  </p>
                </div>

              </div>

            </Card>

            {/* Appointment Information */}
            <Card className="mb-6">

              <div className="mb-5">
                <h2 className="text-lg font-semibold text-primary-dark">
                  Demi Appointment
                </h2>

                <p className="mt-1 text-sm text-neutral">
                  Appointment information linked to this remuneration claim.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

                <div>
                  <p className="text-sm text-neutral">
                    Module
                  </p>

                  <p className="mt-1 font-semibold text-gray-800">
                    {currentClaim.moduleCode} - {currentClaim.moduleName}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-neutral">
                    Lecturer
                  </p>

                  <p className="mt-1 font-semibold text-gray-800">
                    {currentClaim.lecturer || 'Lecturer Name'}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-neutral">
                    Hourly Rate
                  </p>

                  <p className="mt-1 font-semibold text-gray-800">
                    {formatAmount(currentClaim.hourlyRate)}
                  </p>
                </div>

              </div>

            </Card>

            {/* Work Sessions */}
            <Card className="mb-6">

              <div className="mb-5">
                <h2 className="text-lg font-semibold text-primary-dark">
                  Work Sessions Included
                </h2>

                <p className="mt-1 text-sm text-neutral">
                  Verified work sessions included in this remuneration claim.
                </p>
              </div>

              <div className="overflow-x-auto">

                <table className="w-full min-w-[750px]">

                  <thead>
                    <tr className="border-b border-gray-200 text-left">

                      <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                        Date
                      </th>

                      <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                        Activity
                      </th>

                      <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                        Time
                      </th>

                      <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                        Hours
                      </th>

                      <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                        Status
                      </th>

                    </tr>
                  </thead>

                  <tbody>

                    {approvedSessions.map((session) => (
                      <tr
                        key={session.id}
                        className="border-b border-gray-100 last:border-b-0"
                      >

                        <td className="px-4 py-4 text-sm text-gray-700">
                          {formatDate(session.date)}
                        </td>

                        <td className="px-4 py-4 text-sm text-gray-700">
                          {session.activity}
                        </td>

                        <td className="px-4 py-4 text-sm text-gray-700">
                          {session.startTime} - {session.endTime}
                        </td>

                        <td className="px-4 py-4 text-sm font-medium text-gray-800">
                          {session.hours.toFixed(2)}
                        </td>

                        <td className="px-4 py-4">
                          <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                            Verified
                          </span>
                        </td>

                      </tr>
                    ))}

                  </tbody>

                </table>

              </div>

            </Card>

            {/* Claim Calculation */}
            <Card className="mb-6">

              <div className="mb-5">
                <h2 className="text-lg font-semibold text-primary-dark">
                  Claim Calculation
                </h2>

                <p className="mt-1 text-sm text-neutral">
                  Calculation of the total remuneration amount for this claim.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

                <div className="rounded-lg bg-off-white p-5">
                  <p className="text-sm text-neutral">
                    Total Hours
                  </p>

                  <p className="mt-2 text-2xl font-bold text-primary-dark">
                    {currentClaim.hours.toFixed(2)}
                  </p>
                </div>

                <div className="rounded-lg bg-off-white p-5">
                  <p className="text-sm text-neutral">
                    Hourly Rate
                  </p>

                  <p className="mt-2 text-2xl font-bold text-primary-dark">
                    {formatAmount(currentClaim.hourlyRate)}
                  </p>
                </div>

                <div className="rounded-lg bg-off-white p-5">
                  <p className="text-sm text-neutral">
                    Total Claim Amount
                  </p>

                  <p className="mt-2 text-2xl font-bold text-primary-dark">
                    {formatAmount(currentClaim.amount)}
                  </p>
                </div>

              </div>

              <div className="mt-5 rounded-lg border border-gray-200 bg-white p-4">

                <p className="text-sm text-neutral">
                  Calculation
                </p>

                <p className="mt-1 font-semibold text-gray-800">
                  {currentClaim.hours.toFixed(2)} hours ×{' '}
                  {formatAmount(currentClaim.hourlyRate)} ={' '}
                  {formatAmount(currentClaim.amount)}
                </p>

              </div>

            </Card>

            {/* Claim Status */}
            <Card>

              <div className="mb-5">
                <h2 className="text-lg font-semibold text-primary-dark">
                  Claim Status
                </h2>

                <p className="mt-1 text-sm text-neutral">
                  Current processing status of your remuneration claim.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                <div>
                  <p className="text-sm text-neutral">
                    Current Status
                  </p>

                  <div className="mt-2">
                    <StatusBadge status={currentClaim.status} />
                  </div>
                </div>

                <div>
                  <p className="text-sm text-neutral">
                    Next Step
                  </p>

                  <p className="mt-1 font-semibold text-gray-800">
                    {currentClaim.status === 'Pending'
                      ? 'Awaiting administrator verification.'
                      : currentClaim.status === 'Approved'
                        ? 'Claim approved for remuneration processing.'
                        : currentClaim.status === 'Rejected'
                          ? 'Please review the claim and follow the required action.'
                          : 'Claim is being processed.'}
                  </p>
                </div>

              </div>

            </Card>

          </div>
        </main>
      </div>
    </div>
  );
};

export default ClaimDetail;