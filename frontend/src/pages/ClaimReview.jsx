import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import claimsData from '../data/claimsData';

const StatusBadge = ({ status }) => {
  const statusStyles = {
    Pending: 'bg-yellow-100 text-yellow-800',
    'Under Review': 'bg-orange-100 text-orange-800',
    Verified: 'bg-green-100 text-green-800',
    Approved: 'bg-green-100 text-green-800',
    Rejected: 'bg-red-100 text-red-800',
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        statusStyles[status] || 'bg-gray-100 text-gray-700'
      }`}
    >
      {status}
    </span>
  );
};

const ClaimReview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const claimFromState = location.state?.claim;

  const claim =
    claimFromState ||
    claimsData.find((item) => item.id === Number(id)) ||
    claimsData[0];

  const [claimStatus, setClaimStatus] = useState(claim.status);

  const [verifiedSessions, setVerifiedSessions] = useState(
    claim.sessions.map((session) => session.status === 'Verified')
  );

  const [rejectionReason, setRejectionReason] = useState('');

  const [showRejectBox, setShowRejectBox] = useState(false);

  const formatAmount = (amount) => {
    return `R ${amount.toLocaleString('en-ZA', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatDate = (date) => {
    return new Date(`${date}T00:00:00`).toLocaleDateString('en-ZA', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const allSessionsVerified = verifiedSessions.every(
    (verified) => verified
  );

  const calculatedAmount = claim.hours * claim.hourlyRate;

  const calculationValid =
    Math.abs(calculatedAmount - claim.amount) < 0.01;

  const toggleSessionVerification = (index) => {
    setVerifiedSessions((current) =>
      current.map((verified, sessionIndex) =>
        sessionIndex === index ? !verified : verified
      )
    );
  };

  const verifyAllSessions = () => {
    setVerifiedSessions(claim.sessions.map(() => true));
  };

  const handleApprove = () => {
    if (!allSessionsVerified) {
      window.alert(
        'Please verify all timesheet sessions before approving this claim.'
      );
      return;
    }

    if (!calculationValid) {
      window.alert(
        'The claim calculation is invalid and must be reviewed before approval.'
      );
      return;
    }

    setClaimStatus('Verified');

    navigate('/claims-verification', {
      state: {
        updatedClaim: {
          id: claim.id,
          status: 'Verified',
        },
      },
    });
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      window.alert('Please provide a reason for rejecting the claim.');
      return;
    }

    setClaimStatus('Rejected');

    navigate('/claims-verification', {
      state: {
        updatedClaim: {
          id: claim.id,
          status: 'Rejected',
        },
      },
    });
  };

  return (
    <div className="min-h-screen bg-off-white">
      <Navbar />

      <div className="flex">
        <Sidebar userRole="admin"/>

        <main className="flex-1">
          {/* Page Header */}
          <div className="bg-primary px-8 py-4">
            <h1 className="text-2xl font-semibold text-white">
              Claim Review
            </h1>
          </div>

          <div className="p-8">
            {/* Back Button */}
            <div className="mb-6">
              <button
                type="button"
                onClick={() => navigate('/claims-verification')}
                className="font-semibold text-primary transition hover:text-primary-dark"
              >
                ← Back to Claims Verification
              </button>
            </div>

            {/* Claim Overview */}
            <Card className="mb-6">
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm text-neutral">
                    Claim Reference
                  </p>

                  <h2 className="mt-1 text-2xl font-semibold text-primary-dark">
                    {claim.reference}
                  </h2>

                  <p className="mt-1 text-sm text-neutral">
                    Submitted on {claim.submittedDate}
                  </p>
                </div>

                <StatusBadge status={claimStatus} />
              </div>
            </Card>

            {/* Student Information */}
            <Card className="mb-6">
              <div className="mb-5">
                <h2 className="text-lg font-semibold text-primary-dark">
                  Student Information
                </h2>

                <p className="mt-1 text-sm text-neutral">
                  Student information associated with this remuneration claim.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div>
                  <p className="text-sm text-neutral">
                    Student Number
                  </p>

                  <p className="mt-1 font-semibold text-gray-800">
                    {claim.studentNumber}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-neutral">
                    Full Name
                  </p>

                  <p className="mt-1 font-semibold text-gray-800">
                    {claim.studentName}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-neutral">
                    Module
                  </p>

                  <p className="mt-1 font-semibold text-gray-800">
                    {claim.moduleCode} - {claim.moduleName}
                  </p>
                </div>
              </div>
            </Card>

            {/* Banking Information */}
            <Card className="mb-6">
              <div className="mb-5">
                <h2 className="text-lg font-semibold text-primary-dark">
                  Banking Information
                </h2>

                <p className="mt-1 text-sm text-neutral">
                  Banking information associated with the student's profile.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                <div>
                  <p className="text-sm text-neutral">
                    Bank
                  </p>

                  <p className="mt-1 font-semibold text-gray-800">
                    {claim.banking.bank}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-neutral">
                    Account Holder
                  </p>

                  <p className="mt-1 font-semibold text-gray-800">
                    {claim.banking.accountHolder}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-neutral">
                    Account Number
                  </p>

                  <p className="mt-1 font-semibold text-gray-800">
                    {claim.banking.accountNumber}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-neutral">
                    Banking Status
                  </p>

                  <div className="mt-2">
                    <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                      {claim.banking.status}
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Claim / Appointment Information */}
            <Card className="mb-6">
              <div className="mb-5">
                <h2 className="text-lg font-semibold text-primary-dark">
                  Appointment Information
                </h2>

                <p className="mt-1 text-sm text-neutral">
                  Appointment information linked to this remuneration claim.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                <div>
                  <p className="text-sm text-neutral">
                    Module
                  </p>

                  <p className="mt-1 font-semibold text-gray-800">
                    {claim.moduleCode}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-neutral">
                    Module Name
                  </p>

                  <p className="mt-1 font-semibold text-gray-800">
                    {claim.moduleName}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-neutral">
                    Lecturer
                  </p>

                  <p className="mt-1 font-semibold text-gray-800">
                    {claim.lecturer}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-neutral">
                    Hourly Rate
                  </p>

                  <p className="mt-1 font-semibold text-gray-800">
                    {formatAmount(claim.hourlyRate)}
                  </p>
                </div>
              </div>
            </Card>

            {/* Timesheet Verification */}
            <Card className="mb-6">
              <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-primary-dark">
                    Timesheet Verification
                  </h2>

                  <p className="mt-1 text-sm text-neutral">
                    Verify each work session included in this claim.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={verifyAllSessions}
                  className="rounded-lg border border-primary px-4 py-2 text-sm font-semibold text-primary transition hover:bg-purple-50"
                >
                  Verify All
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[850px]">
                  <thead>
                    <tr className="border-b border-gray-200 bg-light-grey text-left">
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
                        Verification
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {claim.sessions.map((session, index) => (
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
                          <label className="flex cursor-pointer items-center gap-3">
                            <input
                              type="checkbox"
                              checked={verifiedSessions[index]}
                              onChange={() =>
                                toggleSessionVerification(index)
                              }
                              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />

                            <span className="text-sm font-medium text-gray-700">
                              {verifiedSessions[index]
                                ? 'Verified'
                                : 'Pending verification'}
                            </span>
                          </label>
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
                  Validate that the claimed amount matches the calculated
                  remuneration.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                <div className="rounded-lg bg-off-white p-5">
                  <p className="text-sm text-neutral">
                    Total Hours
                  </p>

                  <p className="mt-2 text-2xl font-bold text-primary-dark">
                    {claim.hours.toFixed(2)}
                  </p>
                </div>

                <div className="rounded-lg bg-off-white p-5">
                  <p className="text-sm text-neutral">
                    Hourly Rate
                  </p>

                  <p className="mt-2 text-2xl font-bold text-primary-dark">
                    {formatAmount(claim.hourlyRate)}
                  </p>
                </div>

                <div className="rounded-lg bg-off-white p-5">
                  <p className="text-sm text-neutral">
                    Claimed Amount
                  </p>

                  <p className="mt-2 text-2xl font-bold text-primary-dark">
                    {formatAmount(claim.amount)}
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-lg border border-gray-200 bg-white p-4">
                <p className="text-sm text-neutral">
                  Calculation
                </p>

                <p className="mt-1 font-semibold text-gray-800">
                  {claim.hours.toFixed(2)} hours ×{' '}
                  {formatAmount(claim.hourlyRate)} ={' '}
                  {formatAmount(calculatedAmount)}
                </p>
              </div>

              <div className="mt-4">
                {calculationValid ? (
                  <div className="rounded-lg bg-green-50 px-4 py-3 text-sm font-medium text-green-800">
                    ✓ Calculation is valid. The claimed amount matches the
                    calculated remuneration.
                  </div>
                ) : (
                  <div className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
                    ✕ Calculation requires review. The claimed amount does not
                    match the calculated remuneration.
                  </div>
                )}
              </div>
            </Card>

            {/* Verification Decision */}
            <Card>
              <div className="mb-5">
                <h2 className="text-lg font-semibold text-primary-dark">
                  Verification Decision
                </h2>

                <p className="mt-1 text-sm text-neutral">
                  Approve the claim once the timesheets and calculations have
                  been verified, or reject it with a reason.
                </p>
              </div>

              {showRejectBox && (
                <div className="mb-5">
                  <label
                    htmlFor="rejection-reason"
                    className="mb-2 block text-sm font-medium text-neutral"
                  >
                    Rejection Reason
                  </label>

                  <textarea
                    id="rejection-reason"
                    rows="4"
                    value={rejectionReason}
                    onChange={(event) =>
                      setRejectionReason(event.target.value)
                    }
                    placeholder="Explain why this claim is being rejected..."
                    className="w-full rounded-lg border border-neutral bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-primary focus:ring-2 focus:ring-purple-200"
                  />
                </div>
              )}

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                {!showRejectBox && (
                  <button
                    type="button"
                    onClick={() => setShowRejectBox(true)}
                    className="rounded-lg border border-red-500 px-5 py-3 font-semibold text-red-600 transition hover:bg-red-50"
                  >
                    Reject Claim
                  </button>
                )}

                {showRejectBox && (
                  <>
                    <button
                      type="button"
                      onClick={() => setShowRejectBox(false)}
                      className="rounded-lg border border-gray-300 px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      onClick={handleReject}
                      className="rounded-lg bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700"
                    >
                      Confirm Rejection
                    </button>
                  </>
                )}

                {!showRejectBox && (
                  <button
                    type="button"
                    onClick={handleApprove}
                    className="rounded-lg bg-primary px-5 py-3 font-semibold text-white transition hover:bg-primary-dark"
                  >
                    Approve Claim
                  </button>
                )}
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ClaimReview;