import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';

const Claims = () => {
  const navigate = useNavigate();

  const claims = [
    {
      id: 1,
      reference: 'CLM-2026-001',
      moduleCode: 'CMPG311',
      moduleName: 'Databases',
      period: '02 Sep 2026 - 12 Sep 2026',
      hours: 13.5,
      hourlyRate: 45,
      amount: 607.5,
      status: 'Pending',
      submittedDate: '13 September 2026',
    },
    {
      id: 2,
      reference: 'CLM-2026-000',
      moduleCode: 'CMPG311',
      moduleName: 'Databases',
      period: '18 Aug 2026 - 30 Aug 2026',
      hours: 10,
      hourlyRate: 45,
      amount: 450,
      status: 'Approved',
      submittedDate: '31 August 2026',
    },
  ];

  const totalClaims = claims.length;

  const pendingClaims = claims.filter(
    (claim) => claim.status === 'Pending'
  ).length;

  const approvedClaims = claims.filter(
    (claim) => claim.status === 'Approved'
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

  const handleViewClaim = (claim) => {
    navigate(`/claim-detail/${claim.id}`, {
      state: {
        claim,
      },
    });
  };

  return (
    <div className="min-h-screen bg-off-white">
      {/* Top Navigation */}
      <Navbar />

      {/* Sidebar + Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1">

          {/* Page Header */}
          <div className="bg-primary px-8 py-4">
            <h1 className="text-2xl font-semibold text-white">
              Claims
            </h1>
          </div>

          {/* Page Content */}
          <div className="p-8">

            {/* Page Introduction */}
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-neutral">
                  View and manage your remuneration claims.
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

            {/* Summary Cards */}
            <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

              <Card>
                <p className="text-sm text-neutral">
                  Total Claims
                </p>

                <p className="mt-2 text-2xl font-bold text-primary-dark">
                  {totalClaims}
                </p>

                <p className="mt-1 text-xs text-neutral">
                  Claims submitted
                </p>
              </Card>

              <Card>
                <p className="text-sm text-neutral">
                  Pending Claims
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
                  Approved Claims
                </p>

                <p className="mt-2 text-2xl font-bold text-primary-dark">
                  {approvedClaims}
                </p>

                <p className="mt-1 text-xs text-neutral">
                  Successfully approved
                </p>
              </Card>

              <Card>
                <p className="text-sm text-neutral">
                  Rejected Claims
                </p>

                <p className="mt-2 text-2xl font-bold text-primary-dark">
                  {rejectedClaims}
                </p>

                <p className="mt-1 text-xs text-neutral">
                  Claims requiring attention
                </p>
              </Card>

            </div>

            {/* Claim History */}
            <Card>

              <div className="mb-5">
                <h2 className="text-lg font-semibold text-primary-dark">
                  Claim History
                </h2>

                <p className="mt-1 text-sm text-neutral">
                  View your submitted remuneration claims and their current status.
                </p>
              </div>

              {claims.length === 0 ? (

                <div className="rounded-lg border border-dashed border-gray-300 px-6 py-10 text-center">

                  <h3 className="text-lg font-semibold text-gray-700">
                    No Claims Yet
                  </h3>

                  <p className="mt-2 text-sm text-neutral">
                    You have not submitted any remuneration claims yet.
                  </p>

                  <button
                    type="button"
                    onClick={() => navigate('/generate-new-claim')}
                    className="mt-4 rounded-lg bg-primary px-5 py-2.5 font-medium text-white transition hover:bg-primary-dark"
                  >
                    Generate New Claim
                  </button>

                </div>

              ) : (

                <div className="overflow-x-auto">

                  <table className="w-full min-w-[950px]">

                    <thead>
                      <tr className="border-b border-gray-200 text-left">

                        <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                          Reference
                        </th>

                        <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                          Module
                        </th>

                        <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                          Period
                        </th>

                        <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                          Hours
                        </th>

                        <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                          Amount
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

                      {claims.map((claim) => (
                        <tr
                          key={claim.id}
                          className="border-b border-gray-100 last:border-b-0"
                        >

                          <td className="px-4 py-4 text-sm font-medium text-gray-800">
                            {claim.reference}
                          </td>

                          <td className="px-4 py-4 text-sm text-gray-700">
                            <div>
                              <p className="font-medium">
                                {claim.moduleCode}
                              </p>

                              <p className="text-xs text-neutral">
                                {claim.moduleName}
                              </p>
                            </div>
                          </td>

                          <td className="px-4 py-4 text-sm text-gray-700">
                            {claim.period}
                          </td>

                          <td className="px-4 py-4 text-sm text-gray-700">
                            {claim.hours.toFixed(2)}
                          </td>

                          <td className="px-4 py-4 text-sm font-medium text-gray-800">
                            {formatAmount(claim.amount)}
                          </td>

                          <td className="px-4 py-4">
                            <StatusBadge status={claim.status} />
                          </td>

                          <td className="px-4 py-4">
                            <button
                              type="button"
                              onClick={() => handleViewClaim(claim)}
                              className="font-medium text-primary hover:text-primary-dark"
                            >
                              View Details
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

export default Claims;