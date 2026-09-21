import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import claimsData from '../data/claimsData';

const ClaimsVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const [claims] = useState(() => {
    const updatedClaim = location.state?.updatedClaim;

    if (!updatedClaim) {
      return claimsData;
    }

    return claimsData.map((claim) =>
      claim.id === updatedClaim.id
        ? {
            ...claim,
            status: updatedClaim.status,
          }
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
        statusFilter === 'All' ||
        claim.status === statusFilter;

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
      claim.status === 'Verified' ||
      claim.status === 'Approved'
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
            <h1 className="text-2xl font-semibold text-white font-poppins">
              Claims Verification
            </h1>
          </div>

          <div className="p-8">
            {/* Page Introduction */}
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-primary font-poppins">
                  Review Submitted Claims
                </h2>

                <p className="mt-2 text-neutral font-inter">
                  Review submitted remuneration claims, verify timesheets,
                  validate calculations, and approve or reject claims.
                </p>
              </div>

              <button
                type="button"
                onClick={handleExport}
                className="rounded-xl bg-primary px-6 py-3 font-semibold text-white transition hover:bg-primary-dark font-inter"
              >
                Export Payments
              </button>
            </div>

            {/* Filters */}
            <section className="mb-8">
              <h3 className="mb-4 text-xl font-semibold text-primary font-poppins">
                Filter Claims
              </h3>

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
                      <option value="Under Review">Under Review</option>
                      <option value="Verified">Verified</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                </div>
              </Card>
            </section>

            {/* Summary Cards */}
            <section className="mb-8">
              <h3 className="mb-4 text-xl font-semibold text-primary font-poppins">
                Claims Summary
              </h3>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <p className="font-medium text-neutral font-inter">
                    Total Claims
                  </p>

                  <p className="mt-3 text-3xl font-bold text-primary font-poppins">
                    {totalClaims}
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
                    {pendingClaims}
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
                    {underReviewClaims}
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
                    {verifiedClaims}
                  </p>

                  <p className="mt-1 text-sm text-neutral font-inter">
                    Ready for processing
                  </p>
                </Card>
              </div>
            </section>

            {/* Claims Table */}
            <section className="mb-8">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl font-semibold text-primary font-poppins">
                  Submitted Claims
                </h3>

                <span className="text-sm text-neutral font-inter">
                  {filteredClaims.length} claims
                </span>
              </div>

              <Card>
                <div className="overflow-x-auto">
                  {filteredClaims.length === 0 ? (
                    <div className="px-6 py-10 text-center">
                      <h3 className="text-lg font-semibold text-dark font-poppins">
                        No Claims Found
                      </h3>

                      <p className="mt-2 text-sm text-neutral font-inter">
                        Try changing your search or status filter.
                      </p>
                    </div>
                  ) : (
                    <table className="w-full min-w-[1100px]">
                      <thead className="bg-primary-lightest">
                        <tr>
                          <th className="p-4 text-left text-sm font-semibold text-primary font-inter">
                            Claim ID
                          </th>

                          <th className="p-4 text-left text-sm font-semibold text-primary font-inter">
                            Student
                          </th>

                          <th className="p-4 text-left text-sm font-semibold text-primary font-inter">
                            Module
                          </th>

                          <th className="p-4 text-left text-sm font-semibold text-primary font-inter">
                            Hours
                          </th>

                          <th className="p-4 text-left text-sm font-semibold text-primary font-inter">
                            Amount
                          </th>

                          <th className="p-4 text-left text-sm font-semibold text-primary font-inter">
                            Submitted
                          </th>

                          <th className="p-4 text-left text-sm font-semibold text-primary font-inter">
                            Status
                          </th>

                          <th className="p-4 text-left text-sm font-semibold text-primary font-inter">
                            Action
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {filteredClaims.map((claim) => (
                          <tr
                            key={claim.id}
                            className="border-t border-neutral/30 transition hover:bg-primary-lightest/30"
                          >
                            <td className="p-4 font-semibold text-dark font-inter">
                              {claim.reference}
                            </td>

                            <td className="p-4 font-inter">
                              <p className="text-dark">
                                {claim.studentName}
                              </p>

                              <p className="mt-1 text-sm text-neutral">
                                {claim.studentNumber}
                              </p>
                            </td>

                            <td className="p-4 font-inter">
                              <p className="text-dark">
                                {claim.moduleCode}
                              </p>

                              <p className="mt-1 text-sm text-neutral">
                                {claim.moduleName}
                              </p>
                            </td>

                            <td className="p-4 text-dark font-inter">
                              {claim.hours.toFixed(2)}
                            </td>

                            <td className="p-4 font-semibold text-dark font-inter">
                              {formatAmount(claim.amount)}
                            </td>

                            <td className="p-4 text-sm text-neutral font-inter">
                              {claim.submittedDate}
                            </td>

                            <td className="p-4">
                              <StatusBadge status={claim.status} />
                            </td>

                            <td className="p-4">
                              <button
                                type="button"
                                onClick={() =>
                                  handleReviewClaim(claim)
                                }
                                className="rounded-xl bg-primary px-4 py-2 font-semibold text-white transition hover:bg-primary-dark font-inter"
                              >
                                Review
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </Card>
            </section>

            {/* Verification Summary */}
            <section>
              <h3 className="mb-4 text-xl font-semibold text-primary font-poppins">
                Verification Summary
              </h3>

              <Card>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <p className="text-sm text-neutral font-inter">
                      Total Claims
                    </p>

                    <p className="mt-1 font-semibold text-dark font-inter">
                      {totalClaims}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-neutral font-inter">
                      Pending Verification
                    </p>

                    <p className="mt-1 font-semibold text-dark font-inter">
                      {pendingClaims}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-neutral font-inter">
                      Under Review
                    </p>

                    <p className="mt-1 font-semibold text-dark font-inter">
                      {underReviewClaims}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-neutral font-inter">
                      Verified Claims
                    </p>

                    <p className="mt-1 font-semibold text-dark font-inter">
                      {verifiedClaims}
                    </p>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    type="button"
                    onClick={handleExport}
                    className="rounded-xl bg-primary px-6 py-3 font-semibold text-white transition hover:bg-primary-dark font-inter"
                  >
                    Export Approved Claims
                  </button>
                </div>
              </Card>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ClaimsVerification;