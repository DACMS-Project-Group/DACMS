import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';

const BudgetManagement = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');

  const budgets = [
    {
      id: 'BUD-2026-001',
      moduleCode: 'CMPG321',
      moduleName: 'Advanced Databases',
      allocated: 60000,
      used: 46800,
      status: 'Active',
    },
    {
      id: 'BUD-2026-002',
      moduleCode: 'CMPG323',
      moduleName: 'Software Engineering',
      allocated: 75000,
      used: 61500,
      status: 'Warning',
    },
    {
      id: 'BUD-2026-003',
      moduleCode: 'CMPG315',
      moduleName: 'Programming',
      allocated: 50000,
      used: 21000,
      status: 'Active',
    },
    {
      id: 'BUD-2026-004',
      moduleCode: 'CMPG311',
      moduleName: 'Systems Analysis',
      allocated: 45000,
      used: 42750,
      status: 'Warning',
    },
    {
      id: 'BUD-2026-005',
      moduleCode: 'CMPG324',
      moduleName: 'Computer Networks',
      allocated: 55000,
      used: 58000,
      status: 'Exceeded',
    },
  ];

  const formatCurrency = (amount) => {
    return `R ${amount.toLocaleString('en-ZA')}`;
  };

  const getPercentage = (used, allocated) => {
    return Math.round((used / allocated) * 100);
  };

  const filteredBudgets = budgets.filter(
    (budget) =>
      budget.moduleCode
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      budget.moduleName
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const totalAllocated = budgets.reduce(
    (total, budget) => total + budget.allocated,
    0
  );

  const totalUsed = budgets.reduce(
    (total, budget) => total + budget.used,
    0
  );

  const totalRemaining = totalAllocated - totalUsed;

  const budgetsNearLimit = budgets.filter(
    (budget) => getPercentage(budget.used, budget.allocated) >= 80
  ).length;

  return (
    <div className="min-h-screen bg-off-white">
      <Navbar />

      <div className="flex">
        <Sidebar userRole="admin" />

        <main className="flex-1">
          {/* Page Header */}
          <div className="bg-primary px-8 py-4">
            <h1 className="text-2xl font-semibold text-white font-poppins">
              Budget Management
            </h1>
          </div>

          {/* Page Content */}
          <div className="p-8">

            {/* Introduction */}
            <div className="mb-8">
              <h2 className="text-3xl font-poppins font-semibold text-primary">
                Budget Overview
              </h2>

              <p className="text-neutral mt-2 font-inter">
                Create, allocate and monitor module budgets and expenditure.
              </p>
            </div>

            {/* Search + Create Budget */}
            <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">

              {/* Search */}
              <div className="relative w-full md:w-96">
                <input
                  type="text"
                  placeholder="Search module..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="
                    w-full
                    h-11
                    px-4
                    border
                    border-neutral
                    rounded-xl
                    focus:outline-none
                    focus:border-primary
                    focus:ring-2
                    focus:ring-primary/25
                    font-inter
                  "
                />
              </div>

              {/* Create Budget */}
              <button
                onClick={() => navigate('/create-budget')}
                className="
                  bg-primary
                  text-white
                  px-6
                  py-3
                  rounded-xl
                  font-semibold
                  hover:bg-primary-dark
                  transition
                  font-inter
                "
              >
                + Create Budget
              </button>

            </div>

            {/* Budget Summary */}
            <section className="mb-8">

              <h3 className="text-2xl font-poppins font-semibold text-primary mb-4">
                Budget Summary
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                {/* Total Allocated */}
                <Card>
                  <p className="text-neutral font-inter font-medium">
                    Total Allocated
                  </p>

                  <p className="text-3xl font-poppins font-bold text-primary mt-3">
                    {formatCurrency(totalAllocated)}
                  </p>
                </Card>

                {/* Total Used */}
                <Card>
                  <p className="text-neutral font-inter font-medium">
                    Total Used
                  </p>

                  <p className="text-3xl font-poppins font-bold text-primary mt-3">
                    {formatCurrency(totalUsed)}
                  </p>
                </Card>

                {/* Remaining Budget */}
                <Card>
                  <p className="text-neutral font-inter font-medium">
                    Remaining Budget
                  </p>

                  <p
                    className={`text-3xl font-poppins font-bold mt-3 ${
                      totalRemaining < 0
                        ? 'text-red-600'
                        : 'text-primary'
                    }`}
                  >
                    {formatCurrency(totalRemaining)}
                  </p>
                </Card>

                {/* Budgets Near Limit */}
                <Card>
                  <p className="text-neutral font-inter font-medium">
                    Budgets Near Limit
                  </p>

                  <p className="text-3xl font-poppins font-bold text-primary mt-3">
                    {budgetsNearLimit}
                  </p>

                  <p className="text-sm text-neutral mt-2 font-inter">
                    80% utilisation or higher
                  </p>
                </Card>

              </div>

            </section>

            {/* Module Budgets */}
            <section>

              <h3 className="text-2xl font-poppins font-semibold text-primary mb-4">
                Module Budgets
              </h3>

              <Card>

                <div className="overflow-x-auto">

                  <table className="w-full">

                    {/* Table Header */}
                    <thead className="bg-primary-lightest">

                      <tr>

                        <th className="px-5 py-4 text-left text-sm font-semibold text-primary font-inter">
                          Module
                        </th>

                        <th className="px-5 py-4 text-left text-sm font-semibold text-primary font-inter">
                          Allocated
                        </th>

                        <th className="px-5 py-4 text-left text-sm font-semibold text-primary font-inter">
                          Used
                        </th>

                        <th className="px-5 py-4 text-left text-sm font-semibold text-primary font-inter">
                          Remaining
                        </th>

                        <th className="px-5 py-4 text-left text-sm font-semibold text-primary font-inter">
                          Utilisation
                        </th>

                        <th className="px-5 py-4 text-left text-sm font-semibold text-primary font-inter">
                          Status
                        </th>

                        <th className="px-5 py-4 text-left text-sm font-semibold text-primary font-inter">
                          Actions
                        </th>

                      </tr>

                    </thead>

                    {/* Table Body */}
                    <tbody>

                      {filteredBudgets.map((budget) => {

                        const percentage = getPercentage(
                          budget.used,
                          budget.allocated
                        );

                        const remaining =
                          budget.allocated - budget.used;

                        return (
                          <tr
                            key={budget.id}
                            className="
                              border-t
                              border-neutral/30
                              hover:bg-primary-lightest/30
                              transition
                            "
                          >

                            {/* Module */}
                            <td className="px-5 py-5">

                              <p className="font-semibold text-dark font-inter">
                                {budget.moduleCode}
                              </p>

                              <p className="text-sm text-neutral mt-1 font-inter">
                                {budget.moduleName}
                              </p>

                            </td>

                            {/* Allocated */}
                            <td className="px-5 py-5 text-dark font-inter">
                              {formatCurrency(budget.allocated)}
                            </td>

                            {/* Used */}
                            <td className="px-5 py-5 text-dark font-inter">
                              {formatCurrency(budget.used)}
                            </td>

                            {/* Remaining */}
                            <td
                              className={`px-5 py-5 font-medium font-inter ${
                                remaining < 0
                                  ? 'text-red-600'
                                  : 'text-dark'
                              }`}
                            >
                              {formatCurrency(remaining)}
                            </td>

                            {/* Utilisation */}
                            <td className="px-5 py-5 min-w-[170px]">

                              <div className="flex justify-between mb-1">
                                <span className="text-sm text-dark font-inter">
                                  {percentage}%
                                </span>
                              </div>

                              <div className="w-full h-2 bg-gray-200 rounded-full">

                                <div
                                  className={`h-2 rounded-full ${
                                    percentage >= 100
                                      ? 'bg-red-500'
                                      : percentage >= 80
                                      ? 'bg-yellow-500'
                                      : 'bg-green-500'
                                  }`}
                                  style={{
                                    width: `${Math.min(
                                      percentage,
                                      100
                                    )}%`,
                                  }}
                                />

                              </div>

                            </td>

                            {/* Status */}
                            <td className="px-5 py-5">
                              <StatusBadge status={budget.status} />
                            </td>

                            {/* Actions */}
                            <td className="px-5 py-5">

                              <div className="flex gap-4">

                                <button
                                  onClick={() =>
                                    navigate(
                                      `/budget-details/${budget.id}`
                                    )
                                  }
                                  className="
                                    text-primary
                                    font-semibold
                                    hover:underline
                                    font-inter
                                  "
                                >
                                  View
                                </button>

                                <button
                                  onClick={() =>
                                    navigate(
                                      `/edit-budget/${budget.id}`
                                    )
                                  }
                                  className="
                                    text-neutral
                                    font-semibold
                                    hover:underline
                                    font-inter
                                  "
                                >
                                  Edit
                                </button>

                              </div>

                            </td>

                          </tr>
                        );
                      })}

                      {/* No Results */}
                      {filteredBudgets.length === 0 && (
                        <tr>
                          <td
                            colSpan="7"
                            className="px-5 py-10 text-center text-neutral font-inter"
                          >
                            No budgets found matching your search.
                          </td>
                        </tr>
                      )}

                    </tbody>

                  </table>

                </div>

              </Card>

            </section>

          </div>
        </main>
      </div>
    </div>
  );
};

export default BudgetManagement;

