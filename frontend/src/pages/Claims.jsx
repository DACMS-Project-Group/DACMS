import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import { apiGet } from '../api';

const Claims = () => {
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

  const formatDate = (date) => {
    if (!date) return '—';

    return new Date(date).toLocaleDateString('en-ZA', {
      day: '2-digit',
      month: 'short',
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

  const formatCurrency = (amount) => {
    return `R ${Number(amount || 0).toFixed(2)}`;
  };

  const totalClaims = claims.length;

  const pendingClaims = claims.filter(
    (claim) => claim.ClaimStatus === 'Pending'
  ).length;

  const approvedClaims = claims.filter(
    (claim) =>
      claim.ClaimStatus === 'Approved' ||
      claim.ClaimStatus === 'Verified'
  ).length;

  const rejectedClaims = claims.filter(
    (claim) => claim.ClaimStatus === 'Rejected'
  ).length;

  const handleViewClaim = (claim) => {
    navigate(`/claim-detail/${claim.ClaimID}`, {
      state: { claim },
    });
  };

  return (
    <div className="min-h-screen bg-off-white">
      <Navbar />

      <div className="flex">
        <Sidebar userRole="student" />

        <main className="flex-1">
          <div className="bg-primary h-16 flex items-center px-8">
            <h1 className="text-3xl font-poppins font-bold text-white">
              Claims
            </h1>
          </div>

          <div className="p-8">
            {/* Page heading and Generate New Claim button */}
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-3xl font-poppins font-semibold text-primary">
                  My Claims
                </h2>

                <p className="text-neutral mt-2">
                  View and track your remuneration claims.
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate('/generate-new-claim')}
                className="rounded-lg bg-primary px-5 py-3 font-medium text-white transition hover:bg-primary-dark"
              >
                Generate New Claim
              </button>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <p className="text-sm text-neutral font-inter">
                  Total Claims
                </p>

                <p className="text-3xl font-poppins font-bold text-primary mt-2">
                  {totalClaims}
                </p>
              </Card>

              <Card>
                <p className="text-sm text-neutral font-inter">
                  Pending
                </p>

                <p className="text-3xl font-poppins font-bold text-primary mt-2">
                  {pendingClaims}
                </p>
              </Card>

              <Card>
                <p className="text-sm text-neutral font-inter">
                  Approved
                </p>

                <p className="text-3xl font-poppins font-bold text-primary mt-2">
                  {approvedClaims}
                </p>
              </Card>

              <Card>
                <p className="text-sm text-neutral font-inter">
                  Rejected
                </p>

                <p className="text-3xl font-poppins font-bold text-primary mt-2">
                  {rejectedClaims}
                </p>
              </Card>
            </div>

            {/* Loading */}
            {loading && (
              <Card>
                <p className="py-8 text-center text-neutral font-inter">
                  Loading claims...
                </p>
              </Card>
            )}

            {/* Error */}
            {!loading && error && (
              <Card>
                <div className="py-8 text-center">
                  <p className="font-semibold text-error font-inter">
                    Could not load claims
                  </p>

                  <p className="mt-1 text-sm text-neutral font-inter">
                    {error}
                  </p>
                </div>
              </Card>
            )}

            {/* Empty state */}
            {!loading && !error && claims.length === 0 && (
              <Card>
                <div className="py-10 text-center">
                  <p className="font-medium text-dark font-inter">
                    No claims yet
                  </p>

                  <p className="mt-1 text-sm text-neutral font-inter">
                    Your remuneration claims will appear here once they have
                    been submitted.
                  </p>
                </div>
              </Card>
            )}

            {/* Claims table */}
            {!loading && !error && claims.length > 0 && (
              <Card>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-4 px-4 font-poppins font-semibold text-dark">
                          Reference
                        </th>

                        <th className="text-left py-4 px-4 font-poppins font-semibold text-dark">
                          Module
                        </th>

                        <th className="text-left py-4 px-4 font-poppins font-semibold text-dark">
                          Period
                        </th>

                        <th className="text-left py-4 px-4 font-poppins font-semibold text-dark">
                          Hours
                        </th>

                        <th className="text-left py-4 px-4 font-poppins font-semibold text-dark">
                          Amount
                        </th>

                        <th className="text-left py-4 px-4 font-poppins font-semibold text-dark">
                          Status
                        </th>

                        <th className="text-right py-4 px-4 font-poppins font-semibold text-dark">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {claims.map((claim) => (
                        <tr
                          key={claim.ClaimID}
                          className="border-b border-gray-100 last:border-0"
                        >
                          <td className="py-4 px-4">
                            <p className="font-semibold text-dark">
                              {claim.ClaimReferenceNumber}
                            </p>

                            <p className="text-xs text-neutral mt-1">
                              Submitted {formatDate(claim.SubmissionDate)}
                            </p>
                          </td>

                          <td className="py-4 px-4">
                            <p className="font-semibold text-dark">
                              {claim.ModuleCode}
                            </p>

                            <p className="text-sm text-neutral mt-1">
                              {claim.ModuleName}
                            </p>
                          </td>

                          <td className="py-4 px-4 text-sm text-neutral">
                            {formatPeriod(
                              claim.PeriodStartDate,
                              claim.PeriodEndDate
                            )}
                          </td>

                          <td className="py-4 px-4 text-dark">
                            {Number(
                              claim.TotalHoursClaimed || 0
                            ).toFixed(1)}
                          </td>

                          <td className="py-4 px-4 font-semibold text-dark">
                            {formatCurrency(claim.TotalClaimAmount)}
                          </td>

                          <td className="py-4 px-4">
                            <StatusBadge
                              status={claim.ClaimStatus || 'Pending'}
                            />
                          </td>

                          <td className="py-4 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => handleViewClaim(claim)}
                              className="text-primary font-semibold hover:underline"
                            >
                              View Details →
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}

            <div className="mt-8">
              <button
                type="button"
                onClick={() => navigate('/student-dashboard')}
                className="text-primary font-semibold hover:underline"
              >
                ← Back to Dashboard
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Claims;