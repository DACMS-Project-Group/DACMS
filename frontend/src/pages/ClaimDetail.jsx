import DetailPage from '../ui/DetailPage';
import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import { formatMoney, formatNumber } from '../lib/format';
import { apiGet } from '../api';

const ClaimDetail = () => {
  document.title = 'AACMS - Claim Detail';
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

  return (
    <DetailPage
      title="Claim Detail"
      breadcrumbs={[
        { label: 'Claims', to: '/claims' },
        {
          label: claim?.ClaimReferenceNumber || 'Claim Detail',
        },
      ]}
      backTo="/claims"
      backLabel="Back to Claims"
      loading={loading}
      loadingMessage="Loading claim details..."
      errorTitle="Could not load claim"
      error={error || (!claim ? 'The requested claim could not be found.' : '')}
    >
      {claim ? (
        <>
            <Card className="mb-6">
              <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0">
                  <p className="text-sm text-neutral">Claim Reference</p>

                  <h2 className="text-section mt-1 font-semibold text-primary-dark break-words">
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
                <h2 className="text-section font-semibold text-primary-dark">
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
                <h2 className="text-section font-semibold text-primary-dark">
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
                <h2 className="text-section font-semibold text-primary-dark">
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
                <h2 className="text-section font-semibold text-primary-dark">
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
                <h2 className="text-section font-semibold text-primary-dark">
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
        </>
      ) : null}
    </DetailPage>
  );
};

export default ClaimDetail;