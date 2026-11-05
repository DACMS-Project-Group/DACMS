import Button from '../ui/Button';
import PageHeader from '../ui/PageHeader';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import DataTable from '../ui/DataTable';
import { formatDate, formatMoney, formatNumber } from '../lib/format';
import { apiGet } from '../api';

const Claims = () => {
  document.title = 'AACMS - Claims';
  const navigate = useNavigate();

  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const loadClaims = async () => {
      try {
        setLoading(true);
        setError('');

        const data = await apiGet('/student/claims');

        if (!cancelled) {
          setClaims(data?.claims || []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Failed to load claims.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadClaims();

    return () => {
      cancelled = true;
    };
  }, []);

  const formatPeriod = (startDate, endDate) => {
    if (!startDate && !endDate) return '—';
    if (startDate && endDate) {
      return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    }
    return formatDate(startDate || endDate);
  };

  const totalClaims = claims.length;
  const pendingClaims = claims.filter(
    (claim) => claim.ClaimStatus === 'Pending'
  ).length;
  const approvedClaims = claims.filter(
    (claim) =>
      claim.ClaimStatus === 'Approved' || claim.ClaimStatus === 'Verified'
  ).length;
  const rejectedClaims = claims.filter(
    (claim) => claim.ClaimStatus === 'Rejected'
  ).length;

  const handleViewClaim = (claim) => {
    navigate(`/claim-detail/${claim.ClaimID}`, { state: { claim } });
  };

  const claimColumns = [
    {
      key: 'reference',
      header: 'Reference',
      render: (claim) => (
        <>
          <p className="font-semibold text-dark">
            {claim.ClaimReferenceNumber}
          </p>
          <p className="mt-1 text-xs text-neutral">
            Submitted {formatDate(claim.SubmissionDate)}
          </p>
        </>
      ),
    },
    {
      key: 'module',
      header: 'Module',
      render: (claim) => (
        <>
          <p className="font-semibold text-dark">{claim.ModuleCode}</p>
          <p className="mt-1 text-sm text-neutral">{claim.ModuleName}</p>
        </>
      ),
    },
    {
      key: 'period',
      header: 'Period',
      className: 'p-4 text-sm text-neutral whitespace-nowrap',
      render: (claim) =>
        formatPeriod(claim.PeriodStartDate, claim.PeriodEndDate),
    },
    {
      key: 'hours',
      header: 'Hours',
      className: 'p-4 text-dark',
      render: (claim) => formatNumber(claim.TotalHoursClaimed, 1),
    },
    {
      key: 'amount',
      header: 'Amount',
      className: 'p-4 font-semibold text-dark whitespace-nowrap',
      render: (claim) => formatMoney(claim.TotalClaimAmount),
    },
    {
      key: 'status',
      header: 'Status',
      render: (claim) => (
        <StatusBadge status={claim.ClaimStatus || 'Pending'} />
      ),
    },
    {
      key: 'action',
      header: 'Action',
      headerClassName: 'p-4 text-right text-sm font-semibold text-primary font-inter',
      className: 'p-4 text-right whitespace-nowrap',
      render: (claim) => (
        <Button unstyled
          type="button"
          onClick={() => handleViewClaim(claim)}
          className="text-primary font-semibold hover:underline"
        >
          View Details →
        </Button>
      ),
    },
  ];

  return (
    <>


          <div className="p-4 md:p-8">
            <PageHeader
              title="My Claims"
              description="View and track your remuneration claims."
              actions={
                <Button unstyled
                  type="button"
                  onClick={() => navigate('/generate-new-claim')}
                  className="rounded-lg bg-primary px-5 py-3 font-medium text-white transition hover:bg-primary-dark w-full md:w-auto"
                >
                  Generate New Claim
                </Button>
              }
            />

            {/* Summary cards: 2×2 on phone, 4 across on desktop */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
              <Card>
                <p className="text-xs md:text-sm text-neutral font-inter">
                  Total Claims
                </p>
                <p className="text-2xl md:text-3xl font-poppins font-bold text-primary mt-2">
                  {totalClaims}
                </p>
              </Card>

              <Card>
                <p className="text-xs md:text-sm text-neutral font-inter">
                  Pending
                </p>
                <p className="text-2xl md:text-3xl font-poppins font-bold text-primary mt-2">
                  {pendingClaims}
                </p>
              </Card>

              <Card>
                <p className="text-xs md:text-sm text-neutral font-inter">
                  Approved
                </p>
                <p className="text-2xl md:text-3xl font-poppins font-bold text-primary mt-2">
                  {approvedClaims}
                </p>
              </Card>

              <Card>
                <p className="text-xs md:text-sm text-neutral font-inter">
                  Rejected
                </p>
                <p className="text-2xl md:text-3xl font-poppins font-bold text-primary mt-2">
                  {rejectedClaims}
                </p>
              </Card>
            </div>

            <Card>
              <DataTable
                columns={claimColumns}
                rows={claims}
                getRowKey={(claim) => claim.ClaimID}
                loading={loading}
                error={error}
                emptyTitle="No claims yet"
                emptyDescription="Your remuneration claims will appear here once they have been submitted."
                minWidth="900px"
              />
            </Card>

            <div className="mt-6 md:mt-8">
              <Button unstyled
                type="button"
                onClick={() => navigate('/student-dashboard')}
                className="text-primary font-semibold hover:underline"
              >
                ← Back to Dashboard
              </Button>
            </div>
          </div>

    </>
  );
};

export default Claims;