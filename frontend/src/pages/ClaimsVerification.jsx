
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import Button from '../ui/Button';
import DataTable from '../ui/DataTable';
import PageHeader from '../ui/PageHeader';
import Section from '../ui/Section';
import { formatMoney, formatNumber } from '../lib/format';
import { apiGet } from '../api';

const ClaimsVerification = ({ embedded = false }) => {
  document.title = 'AACMS - Claims Verification';
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState('All');

  const [claims, setClaims] = useState([]);
  const [stats, setStats] = useState({
    total_claims: 0,
    total_pending: 0,
    total_under_review: 0,
    total_verified: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await apiGet('/admin/claims');

        setClaims(response?.claims || []);
        setStats(
          response?.stats || {
            total_claims: 0,
            total_pending: 0,
            total_under_review: 0,
            total_verified: 0,
          }
        );
      } catch (err) {
        console.error('Failed to load claims:', err);
        setError('Failed to load claims. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchClaims();
  }, []);

  const filteredClaims = useMemo(() => {
    return claims.filter((claim) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        claim.reference_number?.toLowerCase().includes(search) ||
        claim.student_name?.toLowerCase().includes(search) ||
        claim.module_code?.toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === 'All' ||
        claim.claim_status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [claims, searchTerm, statusFilter]);

  const formatDate = (dateString) => {
    if (!dateString) {
      return '-';
    }

    return new Date(dateString).toLocaleDateString('en-ZA', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const handleReviewClaim = (claim) => {
    navigate(`/claim-review/${claim.claim_id}`, {
      state: {
        claim,
      },
    });
  };

  const handleExport = () => {
    navigate('/admin/claims?tab=export');
  };

  const claimColumns = [
    {
      key: 'reference',
      header: 'Claim ID',
      className: 'p-4 font-semibold text-dark font-inter',
      render: (claim) => claim.reference_number,
    },
    {
      key: 'student',
      header: 'Student',
      className: 'p-4 text-dark font-inter',
      render: (claim) => claim.student_name,
    },
    {
      key: 'module',
      header: 'Module',
      className: 'p-4 text-dark font-inter',
      render: (claim) => claim.module_code,
    },
    {
      key: 'hours',
      header: 'Hours',
      className: 'p-4 text-dark font-inter',
      render: (claim) => formatNumber(claim.total_hours_claimed, 2),
    },
    {
      key: 'amount',
      header: 'Amount',
      className: 'p-4 font-semibold text-dark font-inter',
      render: (claim) => formatMoney(claim.total_claim_amount),
    },
    {
      key: 'submitted',
      header: 'Submitted',
      className: 'p-4 text-sm text-neutral font-inter',
      render: (claim) => formatDate(claim.submission_date),
    },
    {
      key: 'status',
      header: 'Status',
      className: 'p-4',
      render: (claim) => <StatusBadge status={claim.claim_status} />,
    },
    {
      key: 'action',
      header: 'Action',
      className: 'p-4',
      render: (claim) => (
        <Button size="sm" onClick={() => handleReviewClaim(claim)}>
          Review
        </Button>
      ),
    },
  ];

  return (
    <>
      {!embedded && (
        <div className="bg-primary px-8 py-4">
          <h1 className="text-2xl font-poppins font-semibold text-white">
            Claims Verification
          </h1>
        </div>
      )}

          <div className="p-8">
            <PageHeader
              title="Review Submitted Claims"
              description="Review submitted remuneration claims, verify timesheets, validate calculations, and approve or reject claims."
              actions={<Button onClick={handleExport}>Export Payments</Button>}
            />

            <Section title="Filter Claims">
              <Card>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="claim-search"
                      className="mb-2 block text-sm font-medium text-neutral font-inter"
                    >
                      Search
                    </label>

                    <input
                      id="claim-search"
                      type="text"
                      value={searchTerm}
                      onChange={(event) =>
                        setSearchTerm(event.target.value)
                      }
                      placeholder="Claim, student or module"
                      className="h-11 w-full rounded-xl border border-neutral px-4 font-inter focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="status-filter"
                      className="mb-2 block text-sm font-medium text-neutral font-inter"
                    >
                      Status
                    </label>

                    <select
                      id="status-filter"
                      value={statusFilter}
                      onChange={(event) =>
                        setStatusFilter(event.target.value)
                      }
                      className="h-11 w-full rounded-xl border border-neutral px-4 font-inter focus:border-primary focus:outline-none"
                    >
                      <option value="All">All Statuses</option>
                      <option value="Pending">Pending</option>
                      <option value="Approved by Lecturer">Approved by Lecturer</option>
                      <option value="Verified">Verified</option>
                      <option value="Rejected by Lecturer">Rejected by Lecturer</option>
                    </select>
                  </div>
                </div>
              </Card>
            </Section>

            <Section title="Claims Summary">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <p className="font-medium text-neutral font-inter">
                    Total Claims
                  </p>

                  <p className="mt-3 text-3xl font-bold text-primary font-poppins">
                    {stats.total_claims}
                  </p>

                  <p className="mt-1 text-sm text-neutral font-inter">
                    Submitted claims
                  </p>
                </Card>

                <Card>
                  <p className="font-medium text-neutral font-inter">
                    Pending
                  </p>

                  <p className="mt-3 text-3xl font-bold text-primary font-poppins">
                    {stats.total_pending}
                  </p>

                  <p className="mt-1 text-sm text-neutral font-inter">
                    Awaiting verification
                  </p>
                </Card>

                <Card>
                  <p className="font-medium text-neutral font-inter">
                    Under Review
                  </p>

                  <p className="mt-3 text-3xl font-bold text-primary font-poppins">
                    {stats.total_under_review}
                  </p>

                  <p className="mt-1 text-sm text-neutral font-inter">
                    Claims being reviewed
                  </p>
                </Card>

                <Card>
                  <p className="font-medium text-neutral font-inter">
                    Verified
                  </p>

                  <p className="mt-3 text-3xl font-bold text-primary font-poppins">
                    {stats.total_verified}
                  </p>

                  <p className="mt-1 text-sm text-neutral font-inter">
                    Ready for processing
                  </p>
                </Card>
              </div>
            </Section>

            <Section
              title="Submitted Claims"
              actions={
                <span className="text-sm text-neutral font-inter">
                  {filteredClaims.length} claims
                </span>
              }
            >
              <Card>
                <DataTable
                  columns={claimColumns}
                  rows={filteredClaims}
                  getRowKey={(claim) => claim.claim_id}
                  loading={loading}
                  error={error}
                  emptyTitle="No Claims Found"
                  emptyDescription="Try changing your search or status filter."
                  minWidth="1100px"
                />
              </Card>
            </Section>
          </div>

    </>
  );
};

export default ClaimsVerification;
