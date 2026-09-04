import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

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

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-700';
      case 'Warning':
        return 'bg-yellow-100 text-yellow-700';
      case 'Exceeded':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredBudgets = budgets.filter(
    (budget) =>
      budget.moduleCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      budget.moduleName.toLowerCase().includes(searchTerm.toLowerCase())
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
    <div className="min-h-screen bg-[#F8F9FA]">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-8">
          {/* Page Header */}
          <div className="bg-[#6C3D91] text-white px-8 py-5 rounded-t-lg">
            <h1 className="text-3xl font-bold">
              Budget Management
            </h1>
          </div>

          <div className="bg-white px-8 py-6">

            {/* Introduction */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-[#6C3D91]">
                Budget Overview
              </h2>

              <p className="text-[#78848E] mt-1">
                Create, allocate and monitor module budgets and expenditure.
              </p>
            </div>

            {/* Top actions */}
            <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">

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
                    border-[#78848E]
                    rounded-xl
                    focus:outline-none
                    focus:border-[#6C3D91]
                    focus:ring-2
                    focus:ring-[#6C3D91]/25
                  "
                />
              </div>

              <button
                onClick={() => navigate('/budget-management/create')}
                className="
                  h-11
                  px-6
                  rounded-xl
                  bg-[#6C3D91]
                  text-white
                  font-semibold
                  hover:bg-[#5A3280]
                  transition
                "
              >
                + Create Budget
              </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">

              <div className="bg-white border border-[#78848E] rounded-xl p-6 shadow-sm">
                <p className="text-sm text-[#78848E]">
                  Total Allocated
                </p>

                <h3 className="text-2xl font-bold text-[#6C3D91] mt-2">
                  {formatCurrency(totalAllocated)}
                </h3>
              </div>

              <div className="bg-white border border-[#78848E] rounded-xl p-6 shadow-sm">
                <p className="text-sm text-[#78848E]">
                  Total Used
                </p>

                <h3 className="text-2xl font-bold text-[#6C3D91] mt-2">
                  {formatCurrency(totalUsed)}
                </h3>
              </div>

              <div className="bg-white border border-[#78848E] rounded-xl p-6 shadow-sm">
                <p className="text-sm text-[#78848E]">
                  Remaining Budget
                </p>

                <h3 className="text-2xl font-bold text-[#6C3D91] mt-2">
                  {formatCurrency(totalRemaining)}
                </h3>
              </div>

              <div className="bg-white border border-[#78848E] rounded-xl p-6 shadow-sm">
                <p className="text-sm text-[#78848E]">
                  Budgets Near Limit
                </p>

                <h3 className="text-2xl font-bold text-[#6C3D91] mt-2">
                  {budgetsNearLimit}
                </h3>

                <p className="text-xs text-[#78848E] mt-1">
                  80% utilisation or higher
                </p>
              </div>

            </div>

            {/* Budget Table */}
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-[#6C3D91]">
                Module Budgets
              </h3>
            </div>

            <div className="overflow-x-auto border border-[#78848E] rounded-xl">

              <table className="w-full">

                <thead className="bg-[#F3F4F6]">
                  <tr>
                    <th className="px-5 py-4 text-left text-sm font-semibold text-[#78848E]">
                      Module
                    </th>

                    <th className="px-5 py-4 text-left text-sm font-semibold text-[#78848E]">
                      Allocated
                    </th>

                    <th className="px-5 py-4 text-left text-sm font-semibold text-[#78848E]">
                      Used
                    </th>

                    <th className="px-5 py-4 text-left text-sm font-semibold text-[#78848E]">
                      Remaining
                    </th>

                    <th className="px-5 py-4 text-left text-sm font-semibold text-[#78848E]">
                      Utilisation
                    </th>

                    <th className="px-5 py-4 text-left text-sm font-semibold text-[#78848E]">
                      Status
                    </th>

                    <th className="px-5 py-4 text-left text-sm font-semibold text-[#78848E]">
                      Actions
                    </th>
                  </tr>
                </thead>

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
                        className="border-t border-[#78848E]/40 hover:bg-[#E8DDF0]/30"
                      >

                        <td className="px-5 py-5">
                          <p className="font-semibold text-[#181512]">
                            {budget.moduleCode}
                          </p>

                          <p className="text-sm text-[#78848E]">
                            {budget.moduleName}
                          </p>
                        </td>

                        <td className="px-5 py-5 text-[#181512]">
                          {formatCurrency(budget.allocated)}
                        </td>

                        <td className="px-5 py-5 text-[#181512]">
                          {formatCurrency(budget.used)}
                        </td>

                        <td
                          className={`px-5 py-5 font-medium ${
                            remaining < 0
                              ? 'text-[#DC3545]'
                              : 'text-[#181512]'
                          }`}
                        >
                          {formatCurrency(remaining)}
                        </td>

                        <td className="px-5 py-5 min-w-[170px]">

                          <div className="flex justify-between mb-1">
                            <span className="text-sm">
                              {percentage}%
                            </span>
                          </div>

                          <div className="w-full h-2 bg-gray-200 rounded-full">
                            <div
                              className={`h-2 rounded-full ${
                                percentage >= 100
                                  ? 'bg-[#DC3545]'
                                  : percentage >= 80
                                  ? 'bg-[#FFC107]'
                                  : 'bg-[#28A745]'
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

                        <td className="px-5 py-5">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
                              budget.status
                            )}`}
                          >
                            {budget.status}
                          </span>
                        </td>

                        <td className="px-5 py-5">

                          <div className="flex gap-2">

                            <button
                              onClick={() =>
                                navigate(
                                  `/budget-management/details/${budget.id}`
                                )
                              }
                              className="text-[#6C3D91] font-semibold hover:underline"
                            >
                              View
                            </button>

                            <button
                              onClick={() =>
                                navigate(
                                  `/budget-management/edit/${budget.id}`
                                )
                              }
                              className="text-[#78848E] font-semibold hover:underline"
                            >
                              Edit
                            </button>

                          </div>

                        </td>

                      </tr>
                    );
                  })}

                </tbody>

              </table>

            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default BudgetManagement;