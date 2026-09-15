import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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

const ClaimsVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const [claims, setClaims] = useState(() => {
    const updatedClaim = location.state?.updatedClaim;

    if (!updatedClaim) {
      return claimsData;
    }

    return claimsData.map((claim) =>
      claim.id === updatedClaim.id
        ? { ...claim, status: updatedClaim.status }
        : claim
    );
  });

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

  const totalClaims = claims.length;

  const pendingClaims = claims.filter(
    (claim) => claim.status === 'Pending'
  ).length;

  const underReviewClaims = claims.filter(
    (claim) => claim.status === 'Under Review'
  ).length;

  const verifiedClaims = claims.filter(
    (claim) =>
      claim.status === 'Verified' || claim.status === 'Approved'
  ).length;

  const formatAmount = (amount) => {
    return `R ${amount.toLocaleString('en-ZA', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const handleReviewClaim = (claim) => {
    navigate(`/claim-review/${claim.id}`, {
      state: {
        claim,
      },
    });
  };

  const handleExport = () => {
    navigate('/export-payments');
  };

  return (
    <div className="min-h-screen bg-off-white">
      <Navbar />

      <div className="flex">
        <Sidebar userRole="admin" />

        <main className="flex-1">
          {/* Page Header */}
          <div className="bg-primary px-8 py-4">
            <h1 className="text-2xl font-semibold text-white">
              Claims Verification
            </h1>
          </div>

          <div className="p-8">
            {/* Introduction */}
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-primary-dark">
                  Review Submitted Claims
                </h2>

                <p className="mt-1 text-sm text-neutral">
                  Review submitted remuneration claims, verify timesheets,
                  validate calculations, and approve or reject claims.
                </p>
              </div>

              <button
                type="button"
                onClick={handleExport}
                className="rounded-lg bg-primary px-5 py-3 font-semibold text-white transition hover:bg-primary-dark"
              >
                Export Payments
              </button>
            </div>

            {/* Summary Cards */}
            <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <p className="text-sm text-neutral">
                  Total Claims
                </p>

                <p className="mt-2 text-2xl font-bold text-primary-dark">
                  {totalClaims}
                </p>

                <p className="mt-1 text-xs text-neutral">
                  Submitted claims
                </p>
              </Card>

              <Card>
                <p className="text-sm text-neutral">
                  Pending
                </p>

                <p className="mt-2 text-2xl font-bold text-primary-dark">
                  {pendingClaims}
                </p>

                <p className="mt-1 text-xs text-neutral">
                  Awaiting verification
                </p>
              </Card>

              <Card>
                <p className="text-sm text-neutral">
                  Under Review
                </p>

                <p className="mt-2 text-2xl font-bold text-primary-dark">
                  {underReviewClaims}
                </p>

                <p className="mt-1 text-xs text-neutral">
                  Claims being reviewed
                </p>
              </Card>

              <Card>
                <p className="text-sm text-neutral">
                  Verified
                </p>

                <p className="mt-2 text-2xl font-bold text-primary-dark">
                  {verifiedClaims}
                </p>

                <p className="mt-1 text-xs text-neutral">
                  Ready for processing
                </p>
              </Card>
            </div>

            {/* Filters */}
            <Card className="mb-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-end">
                <div className="flex-1">
                  <label
                    htmlFor="claim-search"
                    className="mb-2 block text-sm font-medium text-neutral"
                  >
                    Search Claims
                  </label>

                  <input
                    id="claim-search"
                    type="text"
                    value={searchTerm}
                    onChange={(event) =>
                      setSearchTerm(event.target.value)
                    }
                    placeholder="Search by claim ID, student, student number or module..."
                    className="w-full rounded-lg border border-neutral bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-primary focus:ring-2 focus:ring-purple-200"
                  />
                </div>

                <div className="w-full md:w-56">
                  <label
                    htmlFor="status-filter"
                    className="mb-2 block text-sm font-medium text-neutral"
                  >
                    Status
                  </label>

                  <select
                    id="status-filter"
                    value={statusFilter}
                    onChange={(event) =>
                      setStatusFilter(event.target.value)
                    }
                    className="w-full rounded-lg border border-neutral bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-primary focus:ring-2 focus:ring-purple-200"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Verified">Verified</option>
                  </select>
                </div>
              </div>
            </Card>

            {/* Claims Table */}
            <Card>
              <div className="mb-5">
                <h2 className="text-lg font-semibold text-primary-dark">
                  Submitted Claims
                </h2>

                <p className="mt-1 text-sm text-neutral">
                  Select a claim to review its student information,
                  timesheets, banking details, and calculations.
                </p>
              </div>

              {filteredClaims.length === 0 ? (
                <div className="rounded-lg border border-dashed border-gray-300 px-6 py-10 text-center">
                  <h3 className="text-lg font-semibold text-gray-700">
                    No Claims Found
                  </h3>

                  <p className="mt-2 text-sm text-neutral">
                    Try changing your search or status filter.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[1100px]">
                    <thead>
                      <tr className="border-b border-gray-200 bg-light-grey text-left">
                        <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                          Claim ID
                        </th>

                        <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                          Student
                        </th>

                        <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                          Module
                        </th>

                        <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                          Hours
                        </th>

                        <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                          Amount
                        </th>

                        <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                          Submitted
                        </th>

                        <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                          Status
                        </th>

                        <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredClaims.map((claim) => (
                        <tr
                          key={claim.id}
                          className="border-b border-gray-100 last:border-b-0"
                        >
                          <td className="px-4 py-4 text-sm font-medium text-gray-800">
                            {claim.reference}
                          </td>

                          <td className="px-4 py-4">
                            <div>
                              <p className="text-sm font-medium text-gray-800">
                                {claim.studentName}
                              </p>

                              <p className="text-xs text-neutral">
                                {claim.studentNumber}
                              </p>
                            </div>
                          </td>

                          <td className="px-4 py-4">
                            <div>
                              <p className="text-sm font-medium text-gray-800">
                                {claim.moduleCode}
                              </p>

                              <p className="text-xs text-neutral">
                                {claim.moduleName}
                              </p>
                            </div>
                          </td>

                          <td className="px-4 py-4 text-sm text-gray-700">
                            {claim.hours.toFixed(2)}
                          </td>

                          <td className="px-4 py-4 text-sm font-medium text-gray-800">
                            {formatAmount(claim.amount)}
                          </td>

                          <td className="px-4 py-4 text-sm text-gray-700">
                            {claim.submittedDate}
                          </td>

                          <td className="px-4 py-4">
                            <StatusBadge status={claim.status} />
                          </td>

                          <td className="px-4 py-4">
                            <button
                              type="button"
                              onClick={() => handleReviewClaim(claim)}
                              className="font-semibold text-primary transition hover:text-primary-dark"
                            >
                              Review
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ClaimsVerification;