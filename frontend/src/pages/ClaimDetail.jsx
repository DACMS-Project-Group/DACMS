import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import { formatMoney, formatNumber } from '../lib/format';
import { apiGet } from '../api';

const ClaimDetail = () => {
  document.title = 'AACMS - Claim Detail';
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const [claim, setClaim] = useState(location.state?.claim || null);
  const [loading, setLoading] = useState(!location.state?.claim);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const loadClaim = async () => {
      try {
        setLoading(true);
        setError('');

        const data = await apiGet(`/student/claims/${id}`);

        if (!cancelled) {
          setClaim(data?.claim || null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Failed to load claim details.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    if (id) {
      loadClaim();
    }

    return () => {
      cancelled = true;
    };
  }, [id]);

  const formatDate = (date) => {
    if (!date) return '—';

    return new Date(date).toLocaleDateString('en-ZA', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatPeriod = (startDate, endDate) => {
    if (!startDate && !endDate) return '—';

    if (startDate && endDate) {
      return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    }

    return formatDate(startDate || endDate);
  };

  const handleBackToClaims = () => {
    navigate('/claims');
  };

  if (loading) {
    return (
      <>

<div className="bg-primary h-16 flex items-center px-4 md:px-8">
              <h1 className="text-xl md:text-2xl font-poppins font-semibold text-white">
                Claim Detail
              </h1>
            </div>

            <div className="p-4 md:p-8">
              <Card>
                <p className="py-8 text-center text-neutral font-inter">
                  Loading claim details...
                </p>
              </Card>
            </div>

      </>
    );
  }

  if (error || !claim) {
    return (
      <>

<div className="bg-primary h-16 flex items-center px-4 md:px-8">
              <h1 className="text-xl md:text-2xl font-poppins font-semibold text-white">
                Claim Detail
              </h1>
            </div>

            <div className="p-4 md:p-8">
              <Card>
                <div className="py-8 text-center">
                  <p className="font-semibold text-error font-inter">
                    Could not load claim
                  </p>

                  <p className="mt-1 text-sm text-neutral font-inter">
                    {error || 'The requested claim could not be found.'}
                  </p>

                  <button
                    type="button"
                    onClick={handleBackToClaims}
                    className="mt-6 font-medium text-primary transition hover:text-primary-dark"
                  >
                    ← Back to Claims
                  </button>
                </div>
              </Card>
            </div>

      </>
    );
  }

  return (
    <>

{/* Page Header */}
          <div className="bg-primary h-16 flex items-center px-4 md:px-8">
            <h1 className="text-xl md:text-2xl font-poppins font-semibold text-white">
              Claim Detail
            </h1>
          </div>

          <div className="p-4 md:p-8">
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
                <div className="min-w-0">
                  <p className="text-sm text-neutral">Claim Reference</p>

                  <h2 className="mt-1 text-lg md:text-xl font-semibold text-primary-dark break-words">
                    {claim.ClaimReferenceNumber}
                  </h2>
                </div>

                <StatusBadge status={claim.ClaimStatus || 'Pending'} />
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div>
                  <p className="text-sm text-neutral">Claim Period</p>

                  <p className="mt-1 font-semibold text-dark break-words">
                    {formatPeriod(
                      claim.PeriodStartDate,
                      claim.PeriodEndDate
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-neutral">Submitted Date</p>

                  <p className="mt-1 font-semibold text-dark">
                    {formatDate(claim.SubmissionDate)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-neutral">Claim Status</p>

                  <div className="mt-2">
                    <StatusBadge status={claim.ClaimStatus || 'Pending'} />
                  </div>
                </div>
              </div>
            </Card>

            {/* Claim Information */}
            <Card className="mb-6">
              <div className="mb-5">
                <h2 className="text-base md:text-lg font-semibold text-primary-dark">
                  Claim Information
                </h2>

                <p className="mt-1 text-sm text-neutral">
                  Information associated with this remuneration claim.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div>
                  <p className="text-sm text-neutral">Claim ID</p>

                  <p className="mt-1 font-semibold text-dark">
                    {claim.ClaimID}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-neutral">Application ID</p>

                  <p className="mt-1 font-semibold text-dark">
                    {claim.ApplicationID}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-neutral">Student ID</p>

                  <p className="mt-1 font-semibold text-dark">
                    {claim.StudentID}
                  </p>
                </div>
              </div>
            </Card>

            {/* Assistant Appointment */}
            <Card className="mb-6">
              <div className="mb-5">
                <h2 className="text-base md:text-lg font-semibold text-primary-dark">
                  Assistant Appointment
                </h2>

                <p className="mt-1 text-sm text-neutral">
                  Appointment information linked to this remuneration claim.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="min-w-0">
                  <p className="text-sm text-neutral">Module</p>

                  <p className="mt-1 font-semibold text-dark break-words">
                    {claim.ModuleCode} - {claim.ModuleName}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-neutral">Module ID</p>

                  <p className="mt-1 font-semibold text-dark">
                    {claim.ModuleID}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-neutral">Hourly Rate</p>

                  <p className="mt-1 font-semibold text-dark">
                    {formatMoney(claim.HourlyRateApplied)}
                  </p>
                </div>
              </div>
            </Card>

            {/* Work Sessions */}
            <Card className="mb-6">
              <div className="mb-5">
                <h2 className="text-base md:text-lg font-semibold text-primary-dark">
                  Work Sessions Included
                </h2>

                <p className="mt-1 text-sm text-neutral">
                  The claim records the total approved hours included in this
                  remuneration claim. Individual work sessions are not
                  currently returned by the claim API.
                </p>
              </div>

              <div className="rounded-lg border border-border-subtle bg-off-white p-4 md:p-5">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <p className="text-sm text-neutral">
                      Total Approved Hours
                    </p>

                    <p className="mt-2 text-xl md:text-2xl font-bold text-primary-dark">
                      {formatNumber(claim.TotalHoursClaimed, 2)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-neutral">Claim Amount</p>

                    <p className="mt-2 text-xl md:text-2xl font-bold text-primary-dark">
                      {formatMoney(claim.TotalClaimAmount)}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Claim Calculation */}
            <Card className="mb-6">
              <div className="mb-5">
                <h2 className="text-base md:text-lg font-semibold text-primary-dark">
                  Claim Calculation
                </h2>

                <p className="mt-1 text-sm text-neutral">
                  Calculation of the total remuneration amount for this claim.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                <div className="rounded-lg bg-off-white p-4 md:p-5">
                  <p className="text-sm text-neutral">Total Hours</p>

                  <p className="mt-2 text-xl md:text-2xl font-bold text-primary-dark">
                    {formatNumber(claim.TotalHoursClaimed, 2)}
                  </p>
                </div>

                <div className="rounded-lg bg-off-white p-4 md:p-5">
                  <p className="text-sm text-neutral">Hourly Rate</p>

                  <p className="mt-2 text-xl md:text-2xl font-bold text-primary-dark">
                    {formatMoney(claim.HourlyRateApplied)}
                  </p>
                </div>

                <div className="rounded-lg bg-off-white p-4 md:p-5">
                  <p className="text-sm text-neutral">Total Claim Amount</p>

                  <p className="mt-2 text-xl md:text-2xl font-bold text-primary-dark">
                    {formatMoney(claim.TotalClaimAmount)}
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-lg border border-border-subtle bg-white p-4">
                <p className="text-sm text-neutral">Calculation</p>

                <p className="mt-1 font-semibold text-dark break-words">
                  {formatNumber(claim.TotalHoursClaimed, 2)} hours ×{' '}
                  {formatMoney(claim.HourlyRateApplied)} ={' '}
                  {formatMoney(claim.TotalClaimAmount)}
                </p>
              </div>
            </Card>

            {/* Claim Status */}
            <Card>
              <div className="mb-5">
                <h2 className="text-base md:text-lg font-semibold text-primary-dark">
                  Claim Status
                </h2>

                <p className="mt-1 text-sm text-neutral">
                  Current processing status of your remuneration claim.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <p className="text-sm text-neutral">Current Status</p>

                  <div className="mt-2">
                    <StatusBadge
                      status={claim.ClaimStatus || 'Pending'}
                    />
                  </div>
                </div>

                <div>
                  <p className="text-sm text-neutral">Next Step</p>

                  <p className="mt-1 font-semibold text-dark">
                    {claim.ClaimStatus === 'Pending'
                      ? 'Awaiting administrator verification.'
                      : claim.ClaimStatus === 'Approved' ||
                        claim.ClaimStatus === 'Verified'
                        ? 'Claim approved for remuneration processing.'
                        : claim.ClaimStatus === 'Rejected'
                          ? 'Please review the claim and follow the required action.'
                          : 'Claim is being processed.'}
                  </p>
                </div>
              </div>
            </Card>
          </div>

    </>
  );
};

export default ClaimDetail;