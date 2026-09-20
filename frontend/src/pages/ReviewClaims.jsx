import { useMemo, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';

const ReviewClaims = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const [claims, setClaims] = useState([
    {
      id: 1,
      reference: 'CLM-001',
      studentNumber: '12345678',
      studentName: 'Student Example',
      moduleCode: 'CMPG323',
      hours: 10,
      hourlyRate: 50,
      amount: 500,
      date: '13 Sep 2026',
      status: 'Pending',
    },
    {
      id: 2,
      reference: 'CLM-002',
      studentNumber: '23456789',
      studentName: 'Student Example',
      moduleCode: 'CMPG321',
      hours: 12,
      hourlyRate: 50,
      amount: 600,
      date: '12 Sep 2026',
      status: 'Under Review',
    },
    {
      id: 3,
      reference: 'CLM-003',
      studentNumber: '34567890',
      studentName: 'Student Example',
      moduleCode: 'CMPG315',
      hours: 8,
      hourlyRate: 50,
      amount: 400,
      date: '10 Sep 2026',
      status: 'Verified',
    },
    {
      id: 4,
      reference: 'CLM-004',
      studentNumber: '45678901',
      studentName: 'Student Example',
      moduleCode: 'CMPG323',
      hours: 10,
      hourlyRate: 50,
      amount: 500,
      date: '08 Sep 2026',
      status: 'Paid',
    },
  ]);

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
    (claim) => claim.status === 'Verified'
  ).length;

  const handleReview = (id) => {
    setClaims((currentClaims) =>
      currentClaims.map((claim) =>
        claim.id === id
          ? { ...claim, status: 'Verified' }
          : claim
      )
    );
  };

  const formatCurrency = (amount) => {
    return `R ${amount.toLocaleString('en-ZA', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <div className="min-h-screen bg-off-white">
      <Navbar />

      <div className="flex">
        <Sidebar userRole="lecturer" />

        <main className="flex-1">
          {/* Page Header */}
          <div className="bg-primary px-8 py-4">
            <h1 className="text-2xl font-semibold text-white font-poppins">
              Review Claims
            </h1>
          </div>

          <div className="p-8">
            {/* Introduction */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-primary font-poppins">
                Assistant Claims
              </h2>

              <p className="mt-1 text-neutral font-inter">
                Review submitted claims for assistants assigned to your
                modules.
              </p>
            </div>

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
                <h2 className="mb-4 text-xl font-semibold text-primary font-poppins">
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
                      <option value="Pending">Pending</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Verified">Verified</option>
                      <option value="Paid">Paid</option>
                    </select>
                  </div>
                </div>
              </Card>
            </section>

            {/* Claims Table */}
            <section className="mb-8">
              <Card>
                <div className="mb-4">
                  <h2 className="text-xl font-semibold text-primary font-poppins">
                    Claims Submitted by Assistants
                  </h2>

                  <p className="mt-1 text-sm text-neutral font-inter">
                    Review the hours and remuneration amounts submitted by
                    assistants.
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-neutral/30">
                        <th className="px-4 py-4 text-left text-sm font-semibold text-primary font-inter">
                          Claim Reference
                        </th>

                        <th className="px-4 py-4 text-left text-sm font-semibold text-primary font-inter">
                          Student
                        </th>

                        <th className="px-4 py-4 text-left text-sm font-semibold text-primary font-inter">
                          Module
                        </th>

                        <th className="px-4 py-4 text-left text-sm font-semibold text-primary font-inter">
                          Hours
                        </th>

                        <th className="px-4 py-4 text-left text-sm font-semibold text-primary font-inter">
                          Amount
                        </th>

                        <th className="px-4 py-4 text-left text-sm font-semibold text-primary font-inter">
                          Date
                        </th>

                        <th className="px-4 py-4 text-left text-sm font-semibold text-primary font-inter">
                          Status
                        </th>

                        <th className="px-4 py-4 text-left text-sm font-semibold text-primary font-inter">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredClaims.length > 0 ? (
                        filteredClaims.map((claim) => (
                          <tr
                            key={claim.id}
                            className="border-b border-neutral/20 transition hover:bg-primary-lightest/30"
                          >
                            <td className="px-4 py-4 text-sm font-medium text-dark font-inter">
                              {claim.reference}
                            </td>

                            <td className="px-4 py-4 text-sm font-inter">
                              <div className="font-medium text-dark">
                                {claim.studentName}
                              </div>

                              <div className="text-neutral">
                                {claim.studentNumber}
                              </div>
                            </td>

                            <td className="px-4 py-4 text-sm text-dark font-inter">
                              {claim.moduleCode}
                            </td>

                            <td className="px-4 py-4 text-sm text-dark font-inter">
                              {claim.hours}
                            </td>

                            <td className="px-4 py-4 text-sm font-medium text-dark font-inter">
                              {formatCurrency(claim.amount)}
                            </td>

                            <td className="px-4 py-4 text-sm text-dark font-inter">
                              {claim.date}
                            </td>

                            <td className="px-4 py-4">
                              <StatusBadge status={claim.status} />
                            </td>

                            <td className="px-4 py-4">
                              {claim.status === 'Pending' ||
                              claim.status === 'Under Review' ? (
                                <button
                                  type="button"
                                  onClick={() => handleReview(claim.id)}
                                  className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-dark font-inter"
                                >
                                  Verify
                                </button>
                              ) : (
                                <span className="text-sm text-neutral font-inter">
                                  Reviewed
                                </span>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="8"
                            className="px-6 py-10 text-center text-neutral font-inter"
                          >
                            No claims found matching your search criteria.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            </section>

            {/* Information */}
            <Card>
              <h2 className="mb-2 text-xl font-semibold text-primary font-poppins">
                Claim Review
              </h2>

              <p className="text-sm leading-relaxed text-neutral font-inter">
                Review the hours and remuneration amounts submitted by
                assistants. Claims that have been checked can be marked as
                verified for further administrative processing.
              </p>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ReviewClaims;