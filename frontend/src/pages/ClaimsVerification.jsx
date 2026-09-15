import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
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
      className={`px-3 py-1 rounded-full text-xs font-semibold ${
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

  const rejectedClaims = claims.filter(
    (claim) => claim.status === 'Rejected'
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
    <div className="min-h-screen bg-[#F8F9FA]">

      <Navbar />

      <div className="flex">

        <Sidebar userRole="admin" />

        <main className="flex-1 p-8">

          {/* Page header */}
          <div className="bg-[#6C3D91] text-white px-8 py-5 rounded-t-lg">

            <h1 className="text-3xl font-bold">
              Claims Verification
            </h1>

          </div>

          <div className="bg-white p-8">

            {/* Page introduction */}
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

              <div>

                <h2 className="text-2xl font-semibold text-[#6C3D91]">
                  Review Submitted Claims
                </h2>

                <p className="text-[#78848E] mt-1">
                  Review submitted remuneration claims, verify timesheets,
                  validate calculations, and approve or reject claims.
                </p>

              </div>

              <button
                type="button"
                onClick={handleExport}
                className="h-11 px-6 bg-[#6C3D91] text-white rounded-xl font-semibold hover:bg-[#5A3280]"
              >
                Export Payments
              </button>

            </div>

            {/* Filters */}
            <div className="border border-[#78848E] rounded-xl p-6 mb-8">

              <h3 className="text-lg font-semibold text-[#6C3D91] mb-5">
                Filter Claims
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div>

                  <label
                    htmlFor="claim-search"
                    className="block text-sm text-[#78848E] mb-2"
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
                    className="w-full h-11 px-4 border border-[#78848E] rounded-xl focus:outline-none focus:border-[#6C3D91]"
                  />

                </div>

                <div>

                  <label
                    htmlFor="status-filter"
                    className="block text-sm text-[#78848E] mb-2"
                  >
                    Status
                  </label>

                  <select
                    id="status-filter"
                    value={statusFilter}
                    onChange={(event) =>
                      setStatusFilter(event.target.value)
                    }
                    className="w-full h-11 px-4 border border-[#78848E] rounded-xl focus:outline-none focus:border-[#6C3D91]"
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

            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">

              <div className="border border-[#78848E] rounded-xl p-6">

                <p className="text-sm text-[#78848E]">
                  Total Claims
                </p>

                <p className="text-2xl font-bold text-[#6C3D91] mt-2">
                  {totalClaims}
                </p>

                <p className="text-sm text-[#78848E] mt-1">
                  Submitted claims
                </p>

              </div>

              <div className="border border-[#78848E] rounded-xl p-6">

                <p className="text-sm text-[#78848E]">
                  Pending
                </p>

                <p className="text-2xl font-bold text-[#6C3D91] mt-2">
                  {pendingClaims}
                </p>

                <p className="text-sm text-[#78848E] mt-1">
                  Awaiting verification
                </p>

              </div>

              <div className="border border-[#78848E] rounded-xl p-6">

                <p className="text-sm text-[#78848E]">
                  Under Review
                </p>

                <p className="text-2xl font-bold text-[#6C3D91] mt-2">
                  {underReviewClaims}
                </p>

                <p className="text-sm text-[#78848E] mt-1">
                  Claims being reviewed
                </p>

              </div>

              <div className="border border-[#78848E] rounded-xl p-6">

                <p className="text-sm text-[#78848E]">
                  Verified
                </p>

                <p className="text-2xl font-bold text-[#6C3D91] mt-2">
                  {verifiedClaims}
                </p>

                <p className="text-sm text-[#78848E] mt-1">
                  Ready for processing
                </p>

              </div>

            </div>

            {/* Claims table */}
            <div className="mb-8">

              <div className="flex justify-between items-center mb-4">

                <h3 className="text-xl font-semibold text-[#6C3D91]">
                  Submitted Claims
                </h3>

                <span className="text-sm text-[#78848E]">
                  {filteredClaims.length} claims
                </span>

              </div>

              <div className="border border-[#78848E] rounded-xl overflow-x-auto">

                {filteredClaims.length === 0 ? (

                  <div className="px-6 py-10 text-center">

                    <h3 className="text-lg font-semibold text-gray-700">
                      No Claims Found
                    </h3>

                    <p className="mt-2 text-sm text-[#78848E]">
                      Try changing your search or status filter.
                    </p>

                  </div>

                ) : (

                  <table className="w-full min-w-[1100px]">

                    <thead className="bg-[#F3F4F6]">

                      <tr>

                        <th className="p-4 text-left text-sm text-[#78848E]">
                          Claim ID
                        </th>

                        <th className="p-4 text-left text-sm text-[#78848E]">
                          Student
                        </th>

                        <th className="p-4 text-left text-sm text-[#78848E]">
                          Module
                        </th>

                        <th className="p-4 text-left text-sm text-[#78848E]">
                          Hours
                        </th>

                        <th className="p-4 text-left text-sm text-[#78848E]">
                          Amount
                        </th>

                        <th className="p-4 text-left text-sm text-[#78848E]">
                          Submitted
                        </th>

                        <th className="p-4 text-left text-sm text-[#78848E]">
                          Status
                        </th>

                        <th className="p-4 text-left text-sm text-[#78848E]">
                          Action
                        </th>

                      </tr>

                    </thead>

                    <tbody>

                      {filteredClaims.map(
                        (claim) => (

                          <tr
                            key={claim.id}
                            className="border-t border-[#78848E]/40 hover:bg-[#E8DDF0]/30"
                          >

                            <td className="p-4 font-semibold">
                              {claim.reference}
                            </td>

                            <td className="p-4">

                              <p>
                                {claim.studentName}
                              </p>

                              <p className="text-sm text-[#78848E]">
                                {claim.studentNumber}
                              </p>

                            </td>

                            <td className="p-4">

                              <p>
                                {claim.moduleCode}
                              </p>

                              <p className="text-sm text-[#78848E]">
                                {claim.moduleName}
                              </p>

                            </td>

                            <td className="p-4">
                              {claim.hours.toFixed(2)}
                            </td>

                            <td className="p-4 font-semibold">
                              {formatAmount(claim.amount)}
                            </td>

                            <td className="p-4 text-sm text-[#78848E]">
                              {claim.submittedDate}
                            </td>

                            <td className="p-4">

                              <StatusBadge
                                status={claim.status}
                              />

                            </td>

                            <td className="p-4">

                              <button
                                type="button"
                                onClick={() =>
                                  handleReviewClaim(claim)
                                }
                                className="px-4 py-2 bg-[#6C3D91] text-white rounded-xl font-semibold hover:bg-[#5A3280]"
                              >
                                Review
                              </button>

                            </td>

                          </tr>

                        )
                      )}

                    </tbody>

                  </table>

                )}

              </div>

            </div>

            {/* Verification Summary */}
            <div className="border border-[#78848E] rounded-xl p-6 bg-[#F8F9FA]">

              <h3 className="text-lg font-semibold text-[#6C3D91] mb-5">
                Verification Summary
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

                <div>

                  <p className="text-sm text-[#78848E]">
                    Total Claims
                  </p>

                  <p className="font-semibold mt-1">
                    {totalClaims}
                  </p>

                </div>

                <div>

                  <p className="text-sm text-[#78848E]">
                    Pending Verification
                  </p>

                  <p className="font-semibold mt-1">
                    {pendingClaims}
                  </p>

                </div>

                <div>

                  <p className="text-sm text-[#78848E]">
                    Under Review
                  </p>

                  <p className="font-semibold mt-1">
                    {underReviewClaims}
                  </p>

                </div>

                <div>

                  <p className="text-sm text-[#78848E]">
                    Verified Claims
                  </p>

                  <p className="font-semibold mt-1">
                    {verifiedClaims}
                  </p>

                </div>

              </div>

              <div className="flex justify-end mt-8">

                <button
                  type="button"
                  onClick={handleExport}
                  className="h-11 px-6 bg-[#6C3D91] text-white rounded-xl font-semibold hover:bg-[#5A3280]"
                >
                  Export Approved Claims
                </button>

              </div>

            </div>

          </div>

        </main>

      </div>

    </div>
  );
};

export default ClaimsVerification;