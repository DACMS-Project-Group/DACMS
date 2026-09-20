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
    <div className="flex min-h-screen bg-off-white">
      <Sidebar userRole="admin" />

      <div className="flex-1">
        <Navbar />

        {/* Page Header */}
        <div className="bg-primary h-16 flex items-center px-8">
          <h1 className="text-3xl font-poppins font-bold text-white">
            Claims Verification
          </h1>
        </div>

        <main className="p-8">

          {/* Page Introduction */}
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <div>
              <h2 className="text-3xl font-poppins font-semibold text-primary">
                Review Submitted Claims
              </h2>

              <p className="text-neutral mt-2 font-inter">
                Review submitted remuneration claims, verify timesheets,
                validate calculations, and approve or reject claims.
              </p>
            </div>

            <button
              type="button"
              onClick={handleExport}
              className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition font-inter"
            >
              Export Payments
            </button>

          </div>

          {/* Filters */}
          <section className="mb-8">
            <h3 className="text-2xl font-poppins font-semibold text-primary mb-4">
              Filter Claims
            </h3>

            <Card>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div>
                  <label
                    htmlFor="claim-search"
                    className="block text-sm text-neutral mb-2 font-inter font-medium"
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
                    className="w-full h-11 px-4 border border-neutral rounded-xl focus:outline-none focus:border-primary font-inter"
                  />
                </div>

                <div>
                  <label
                    htmlFor="status-filter"
                    className="block text-sm text-neutral mb-2 font-inter font-medium"
                  >
                    Status
                  </label>

                  <select
                    id="status-filter"
                    value={statusFilter}
                    onChange={(event) =>
                      setStatusFilter(event.target.value)
                    }
                    className="w-full h-11 px-4 border border-neutral rounded-xl focus:outline-none focus:border-primary font-inter"
                  >
                    <option value="All">
                      All Statuses
                    </option>

                    <option value="Pending">
                      Pending
                    </option>

                    <option value="Under Review">
                      Under Review
                    </option>

                    <option value="Verified">
                      Verified
                    </option>

                    <option value="Approved">
                      Approved
                    </option>

                    <option value="Rejected">
                      Rejected
                    </option>
                  </select>
                </div>

              </div>
            </Card>
          </section>

          {/* Summary Cards */}
          <section className="mb-8">
            <h3 className="text-2xl font-poppins font-semibold text-primary mb-4">
              Claims Summary
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

              <Card>
                <p className="text-neutral font-inter font-medium">
                  Total Claims
                </p>

                <p className="text-3xl font-poppins font-bold text-primary mt-3">
                  {totalClaims}
                </p>

                <p className="text-sm text-neutral mt-1 font-inter">
                  Submitted claims
                </p>
              </Card>

              <Card>
                <p className="text-neutral font-inter font-medium">
                  Pending
                </p>

                <p className="text-3xl font-poppins font-bold text-primary mt-3">
                  {pendingClaims}
                </p>

                <p className="text-sm text-neutral mt-1 font-inter">
                  Awaiting verification
                </p>
              </Card>

              <Card>
                <p className="text-neutral font-inter font-medium">
                  Under Review
                </p>

                <p className="text-3xl font-poppins font-bold text-primary mt-3">
                  {underReviewClaims}
                </p>

                <p className="text-sm text-neutral mt-1 font-inter">
                  Claims being reviewed
                </p>
              </Card>

              <Card>
                <p className="text-neutral font-inter font-medium">
                  Verified
                </p>

                <p className="text-3xl font-poppins font-bold text-primary mt-3">
                  {verifiedClaims}
                </p>

                <p className="text-sm text-neutral mt-1 font-inter">
                  Ready for processing
                </p>
              </Card>

            </div>
          </section>

          {/* Claims Table */}
          <section className="mb-8">

            <div className="flex justify-between items-center mb-4">

              <h3 className="text-2xl font-poppins font-semibold text-primary">
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

                    <h3 className="text-lg font-poppins font-semibold text-dark">
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
                          className="border-t border-neutral/30 hover:bg-primary-lightest/30 transition"
                        >

                          <td className="p-4 font-semibold text-dark font-inter">
                            {claim.reference}
                          </td>

                          <td className="p-4 font-inter">
                            <p className="text-dark">
                              {claim.studentName}
                            </p>

                            <p className="text-sm text-neutral mt-1">
                              {claim.studentNumber}
                            </p>
                          </td>

                          <td className="p-4 font-inter">
                            <p className="text-dark">
                              {claim.moduleCode}
                            </p>

                            <p className="text-sm text-neutral mt-1">
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
                              className="bg-primary text-white px-4 py-2 rounded-xl font-semibold hover:bg-primary-dark transition font-inter"
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
            <h3 className="text-2xl font-poppins font-semibold text-primary mb-4">
              Verification Summary
            </h3>

            <Card>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                <div>
                  <p className="text-sm text-neutral font-inter">
                    Total Claims
                  </p>

                  <p className="font-semibold text-dark mt-1 font-inter">
                    {totalClaims}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-neutral font-inter">
                    Pending Verification
                  </p>

                  <p className="font-semibold text-dark mt-1 font-inter">
                    {pendingClaims}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-neutral font-inter">
                    Under Review
                  </p>

                  <p className="font-semibold text-dark mt-1 font-inter">
                    {underReviewClaims}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-neutral font-inter">
                    Verified Claims
                  </p>

                  <p className="font-semibold text-dark mt-1 font-inter">
                    {verifiedClaims}
                  </p>
                </div>

              </div>

              <div className="flex justify-end mt-8">

                <button
                  type="button"
                  onClick={handleExport}
                  className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition font-inter"
                >
                  Export Approved Claims
                </button>

              </div>
            </Card>
          </section>

        </main>
      </div>
    </div>
  );
};

export default ClaimsVerification;