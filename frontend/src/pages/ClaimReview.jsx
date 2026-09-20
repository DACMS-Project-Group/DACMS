import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import claimsData from '../data/claimsData';

const ClaimReview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const claimFromState = location.state?.claim;

  const claim =
    claimFromState ||
    claimsData.find((item) => String(item.id) === String(id)) ||
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
        <Sidebar userRole="admin" />

        <main className="flex-1">
          {/* Page Header */}
          <div className="bg-primary px-8 py-4">
            <h1 className="text-2xl font-semibold text-white font-poppins">
              Claim Review
            </h1>
          </div>

          <div className="p-8">
            {/* Claim Overview */}
            <Card className="mb-6">
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm text-neutral font-inter">
                    Claim Reference
                  </p>

                  <h2 className="mt-1 text-2xl font-semibold text-primary font-poppins">
                    {claim.reference}
                  </h2>

                  <p className="mt-1 text-sm text-neutral font-inter">
                    Submitted on {claim.submittedDate}
                  </p>
                </div>

                <StatusBadge status={claimStatus} />
              </div>
            </Card>

            {/* Student Information */}
            <Card className="mb-6">
              <div className="mb-5">
                <h2 className="text-lg font-semibold text-primary font-poppins">
                  Student Information
                </h2>

                <p className="mt-1 text-sm text-neutral font-inter">
                  Student information associated with this remuneration claim.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div>
                  <p className="text-sm text-neutral font-inter">
                    Student Number
                  </p>

                  <p className="mt-1 font-semibold text-dark font-inter">
                    {claim.studentNumber}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-neutral font-inter">
                    Full Name
                  </p>

                  <p className="mt-1 font-semibold text-dark font-inter">
                    {claim.studentName}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-neutral font-inter">
                    Module
                  </p>

                  <p className="mt-1 font-semibold text-dark font-inter">
                    {claim.moduleCode} - {claim.moduleName}
                  </p>
                </div>
              </div>
            </Card>

            {/* Banking Information */}
            <Card className="mb-6">
              <div className="mb-5">
                <h2 className="text-lg font-semibold text-primary font-poppins">
                  Banking Information
                </h2>

                <p className="mt-1 text-sm text-neutral font-inter">
                  Banking information associated with the student's profile.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                <div>
                  <p className="text-sm text-neutral font-inter">
                    Bank
                  </p>

                  <p className="mt-1 font-semibold text-dark font-inter">
                    {claim.banking.bank}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-neutral font-inter">
                    Account Holder
                  </p>

                  <p className="mt-1 font-semibold text-dark font-inter">
                    {claim.banking.accountHolder}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-neutral font-inter">
                    Account Number
                  </p>

                  <p className="mt-1 font-semibold text-dark font-inter">
                    {claim.banking.accountNumber}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-neutral font-inter">
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

            {/* Appointment Information */}
            <Card className="mb-6">
              <div className="mb-5">
                <h2 className="text-lg font-semibold text-primary font-poppins">
                  Appointment Information
                </h2>

                <p className="mt-1 text-sm text-neutral font-inter">
                  Appointment information linked to this remuneration claim.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                <div>
                  <p className="text-sm text-neutral font-inter">
                    Module
                  </p>

                  <p className="mt-1 font-semibold text-dark font-inter">
                    {claim.moduleCode}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-neutral font-inter">
                    Module Name
                  </p>

                  <p className="mt-1 font-semibold text-dark font-inter">
                    {claim.moduleName}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-neutral font-inter">
                    Lecturer
                  </p>

                  <p className="mt-1 font-semibold text-dark font-inter">
                    {claim.lecturer}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-neutral font-inter">
                    Hourly Rate
                  </p>

                  <p className="mt-1 font-semibold text-dark font-inter">
                    {formatAmount(claim.hourlyRate)}
                  </p>
                </div>
              </div>
            </Card>

            {/* Timesheet Verification */}
            <Card className="mb-6">
              <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-primary font-poppins">
                    Timesheet Verification
                  </h2>

                  <p className="mt-1 text-sm text-neutral font-inter">
                    Verify each work session included in this claim.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={verifyAllSessions}
                  className="rounded-xl border border-primary px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary-lightest font-inter"
                >
                  Verify All
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[850px]">
                  <thead className="bg-primary-lightest">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-primary font-inter">
                        Date
                      </th>

                      <th className="px-4 py-3 text-left text-sm font-semibold text-primary font-inter">
                        Activity
                      </th>

                      <th className="px-4 py-3 text-left text-sm font-semibold text-primary font-inter">
                        Time
                      </th>

                      <th className="px-4 py-3 text-left text-sm font-semibold text-primary font-inter">
                        Hours
                      </th>

                      <th className="px-4 py-3 text-left text-sm font-semibold text-primary font-inter">
                        Verification
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {claim.sessions.map((session, index) => (
                      <tr
                        key={session.id}
                        className="border-t border-neutral/30"
                      >
                        <td className="px-4 py-4 text-sm text-dark font-inter">
                          {formatDate(session.date)}
                        </td>

                        <td className="px-4 py-4 text-sm text-dark font-inter">
                          {session.activity}
                        </td>

                        <td className="px-4 py-4 text-sm text-dark font-inter">
                          {session.startTime} - {session.endTime}
                        </td>

                        <td className="px-4 py-4 text-sm font-medium text-dark font-inter">
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
                              className="h-4 w-4 rounded border-neutral text-primary focus:ring-primary"
                            />

                            <span className="text-sm font-medium text-dark font-inter">
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
                <h2 className="text-lg font-semibold text-primary font-poppins">
                  Claim Calculation
                </h2>

                <p className="mt-1 text-sm text-neutral font-inter">
                  Validate that the claimed amount matches the calculated
                  remuneration.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                <div className="rounded-xl bg-off-white p-5">
                  <p className="text-sm text-neutral font-inter">
                    Total Hours
                  </p>

                  <p className="mt-2 text-2xl font-bold text-primary font-poppins">
                    {claim.hours.toFixed(2)}
                  </p>
                </div>

                <div className="rounded-xl bg-off-white p-5">
                  <p className="text-sm text-neutral font-inter">
                    Hourly Rate
                  </p>

                  <p className="mt-2 text-2xl font-bold text-primary font-poppins">
                    {formatAmount(claim.hourlyRate)}
                  </p>
                </div>

                <div className="rounded-xl bg-off-white p-5">
                  <p className="text-sm text-neutral font-inter">
                    Claimed Amount
                  </p>

                  <p className="mt-2 text-2xl font-bold text-primary font-poppins">
                    {formatAmount(claim.amount)}
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-neutral/30 bg-white p-4">
                <p className="text-sm text-neutral font-inter">
                  Calculation
                </p>

                <p className="mt-1 font-semibold text-dark font-inter">
                  {claim.hours.toFixed(2)} hours ×{' '}
                  {formatAmount(claim.hourlyRate)} ={' '}
                  {formatAmount(calculatedAmount)}
                </p>
              </div>

              <div className="mt-4">
                {calculationValid ? (
                  <div className="rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-800 font-inter">
                    ✓ Calculation is valid. The claimed amount matches the
                    calculated remuneration.
                  </div>
                ) : (
                  <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-800 font-inter">
                    ✕ Calculation requires review. The claimed amount does not
                    match the calculated remuneration.
                  </div>
                )}
              </div>
            </Card>

            {/* Verification Decision */}
            <Card>
              <div className="mb-5">
                <h2 className="text-lg font-semibold text-primary font-poppins">
                  Verification Decision
                </h2>

                <p className="mt-1 text-sm text-neutral font-inter">
                  Approve the claim once the timesheets and calculations have
                  been verified, or reject it with a reason.
                </p>
              </div>

              {showRejectBox && (
                <div className="mb-5">
                  <label
                    htmlFor="rejection-reason"
                    className="mb-2 block text-sm font-medium text-neutral font-inter"
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
                    className="w-full rounded-xl border border-neutral bg-white px-4 py-3 text-sm text-dark outline-none transition focus:border-primary focus:ring-2 focus:ring-primary-lightest font-inter"
                  />
                </div>
              )}

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                {!showRejectBox && (
                  <button
                    type="button"
                    onClick={() => setShowRejectBox(true)}
                    className="rounded-xl border border-red-500 px-5 py-3 font-semibold text-red-600 transition hover:bg-red-50 font-inter"
                  >
                    Reject Claim
                  </button>
                )}

                {showRejectBox && (
                  <>
                    <button
                      type="button"
                      onClick={() => setShowRejectBox(false)}
                      className="rounded-xl border border-neutral/40 px-5 py-3 font-semibold text-neutral transition hover:bg-off-white font-inter"
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      onClick={handleReject}
                      className="rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700 font-inter"
                    >
                      Confirm Rejection
                    </button>
                  </>
                )}

                {!showRejectBox && (
                  <button
                    type="button"
                    onClick={handleApprove}
                    className="rounded-xl bg-primary px-5 py-3 font-semibold text-white transition hover:bg-primary-dark font-inter"
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