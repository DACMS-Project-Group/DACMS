import Button from '../ui/Button';
import PageHeader from '../ui/PageHeader';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import DataTable from '../ui/DataTable';
import { formatMoney } from '../lib/format';
import { CLAIM_STATUS_OPTIONS } from '../lib/statuses';
import { apiGet } from '../api';

const formatSubmittedDate = (date) =>
  date
    ? new Date(date).toLocaleDateString('en-ZA', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : 'Not available';

const ReviewClaims = () => {
  document.title = 'AACMS - Review Claims';
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [claims, setClaims] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let isCurrent = true;

    apiGet('/lecturer/claims')
      .then((result) => {
        if (!isCurrent) return;

        const rows = Array.isArray(result?.claims) ? result.claims : [];
        setClaims(rows.map((claim) => ({
          id: claim.claim_id,
          reference: claim.reference_number,
          studentNumber: claim.student_number,
          studentName: claim.student_name,
          moduleCode: claim.module_code,
          hours: Number(claim.total_hours_claimed ?? 0),
          amount: Number(claim.total_claim_amount ?? 0),
          date: formatSubmittedDate(claim.submission_date),
          status: claim.claim_status,
          lecturerComment: claim.lecturer_comment || '',
        })));
      })
      .catch((error) => {
        if (isCurrent) setLoadError(error.message);
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  const filteredClaims = useMemo(() => {
    return claims.filter((claim) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        claim.reference.toLowerCase().includes(search) ||
        claim.studentName.toLowerCase().includes(search) ||
        claim.studentNumber.toLowerCase().includes(search) ||
        claim.moduleCode.toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === 'All' || claim.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [claims, searchTerm, statusFilter]);

  const pendingClaims = claims.filter(
    (claim) => claim.status === 'Pending'
  ).length;

  const underReviewClaims = claims.filter(
    (claim) => claim.status === 'Under Review'
  ).length;

  const verifiedClaims = claims.filter(
    (claim) =>
      claim.status === 'Verified' ||
      claim.status === 'Approved' ||
      claim.status === 'Approved by Lecturer'
  ).length;

  const handleReview = (claim) => {
    navigate(`/review-claim/${claim.id}`);
  };

  const claimColumns = [
    {
      key: 'reference',
      header: 'Claim Reference',
      className: 'p-4 text-sm font-medium text-dark font-inter',
      render: (claim) => claim.reference,
    },
    {
      key: 'student',
      header: 'Student',
      className: 'p-4 text-sm font-inter',
      render: (claim) => (
        <>
          <div className="font-medium text-dark">{claim.studentName}</div>
          <div className="text-neutral">{claim.studentNumber}</div>
        </>
      ),
    },
    {
      key: 'module',
      header: 'Module',
      className: 'p-4 text-sm text-dark font-inter',
      render: (claim) => claim.moduleCode,
    },
    {
      key: 'hours',
      header: 'Hours',
      className: 'p-4 text-sm text-dark font-inter',
      render: (claim) => claim.hours,
    },
    {
      key: 'amount',
      header: 'Amount',
      className: 'p-4 text-sm font-medium text-dark font-inter',
      render: (claim) => formatMoney(claim.amount),
    },
    {
      key: 'date',
      header: 'Submitted',
      className: 'p-4 text-sm text-dark font-inter',
      render: (claim) => claim.date,
    },
    {
      key: 'status',
      header: 'Status',
      className: 'p-4',
      render: (claim) => <StatusBadge status={claim.status} />,
    },
    {
      key: 'comment',
      header: 'Lecturer Comment',
      className: 'p-4 text-sm text-dark font-inter',
      render: (claim) => claim.lecturerComment || 'Not reviewed',
    },
    {
      key: 'action',
      header: 'Action',
      className: 'p-4',
      render: (claim) => (
        <Button unstyled
          type="button"
          onClick={() => handleReview(claim)}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-dark font-inter"
        >
          Review
        </Button>
      ),
    },
  ];

  return (
    <>

{/* Page Header */}

          <div className="p-8">
            <PageHeader
              title="Review Claims"
              description="Review submitted claims for assistants assigned to your modules."
            />

            {/* Summary Cards */}
            <section className="mb-8">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <p className="font-medium text-neutral font-inter">
                    Total Claims
                  </p>

                  <p className="mt-3 text-3xl font-bold text-primary font-poppins">
                    {claims.length}
                  </p>

                  <p className="mt-1 text-sm text-neutral font-inter">
                    All submitted claims
                  </p>
                </Card>

                <Card>
                  <p className="font-medium text-neutral font-inter">
                    Pending
                  </p>

                  <p className="mt-3 text-3xl font-bold text-primary font-poppins">
                    {pendingClaims}
                  </p>

                  <p className="mt-1 text-sm text-neutral font-inter">
                    Claims awaiting review
                  </p>
                </Card>

                <Card>
                  <p className="font-medium text-neutral font-inter">
                    Under Review
                  </p>

                  <p className="mt-3 text-3xl font-bold text-primary font-poppins">
                    {underReviewClaims}
                  </p>

                  <p className="mt-1 text-sm text-neutral font-inter">
                    Claims being checked
                  </p>
                </Card>

                <Card>
                  <p className="font-medium text-neutral font-inter">
                    Verified
                  </p>

                  <p className="mt-3 text-3xl font-bold text-primary font-poppins">
                    {verifiedClaims}
                  </p>

                  <p className="mt-1 text-sm text-neutral font-inter">
                    Claims verified by lecturer
                  </p>
                </Card>
              </div>
            </section>

            {/* Search and Filters */}
            <section className="mb-8">
              <Card>
                <h2 className="text-section mb-4 font-semibold text-primary font-poppins">
                  Search & Filter Claims
                </h2>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-dark font-inter">
                      Search Claims
                    </label>

                    <input
                      type="text"
                      placeholder="Search by reference, student or module..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full rounded-lg border border-neutral/40 bg-white px-4 py-3 text-dark outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 font-inter"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-dark font-inter">
                      Status
                    </label>

                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full rounded-lg border border-neutral/40 bg-white px-4 py-3 text-dark outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 font-inter"
                    >
                      <option value="All">All Statuses</option>
                      {CLAIM_STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </Card>
            </section>

            {/* Claims Table */}
            <section className="mb-8">
              <Card>
                <div className="mb-4">
                  <h2 className="text-section font-semibold text-primary font-poppins">
                    Claims Submitted by Assistants
                  </h2>

                  <p className="mt-1 text-sm text-neutral font-inter">
                    Review the hours and remuneration amounts submitted by
                    assistants.
                  </p>
                </div>

                <DataTable
                  columns={claimColumns}
                  rows={filteredClaims}
                  getRowKey={(claim) => claim.id}
                  loading={isLoading}
                  error={loadError}
                  emptyTitle="No claims found"
                  emptyDescription="No claims match your search criteria."
                  minWidth="1000px"
                />
              </Card>
            </section>

            {/* Information */}
            <Card>
              <h2 className="text-section mb-2 font-semibold text-primary font-poppins">
                Claim Review
              </h2>

              <p className="text-sm leading-relaxed text-neutral font-inter">
                Review the hours and remuneration amounts submitted by
                assistants. Claims that have been checked can be marked as
                verified for further administrative processing.
              </p>
            </Card>
          </div>

    </>
  );
};

export default ReviewClaims;