//import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const BudgetDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

 

  const budget = {
    id: id || 'BUD-2026-002',
    moduleCode: 'CMPG323',
    moduleName: 'Software Engineering',
    allocated: 75000,
    used: 61500,
    year: '2026',
    period: 'Semester 2',
    status: 'Warning',
  };

  const lecturers = [
    {
      name: 'Dr John Example',
      allocated: 20000,
      used: 16500,
    },
    {
      name: 'Prof Jane Example',
      allocated: 15000,
      used: 12000,
    },
    {
      name: 'Dr Michael Example',
      allocated: 10000,
      used: 8500,
    },
  ];

  const auditLogs = [
    {
      date: '28 Aug 2026',
      user: 'Administrator',
      action: 'Created',
      description: 'Budget created',
    },
    {
      date: '30 Aug 2026',
      user: 'Administrator',
      action: 'Updated',
      description: 'Budget allocation updated',
    },
    {
      date: '02 Sep 2026',
      user: 'Administrator',
      action: 'Updated',
      description: 'Lecturer allocation modified',
    },
  ];

  const percentage = Math.round(
    (budget.used / budget.allocated) * 100
  );

  const remaining =
    budget.allocated - budget.used;

  const formatCurrency = (amount) =>
    `R ${amount.toLocaleString('en-ZA')}`;

  return (
    <div className="min-h-screen bg-[#F8F9FA]">

      <Navbar />

      <div className="flex">

        <Sidebar userRole="admin" />

        <main className="flex-1 p-8">

  {/* Back Button */}
  <button
    onClick={() => navigate('/budget-management')}
    className="flex items-center gap-2 text-[#6C3D91] hover:text-[#4F2D6A] font-medium mb-4"
  >
    <span className="text-lg">←</span>
    Back to Budget Management
  </button>

  {/* Header */}
  <div className="bg-[#6C3D91] text-white px-8 py-5 rounded-t-lg">

            <div className="flex justify-between items-center">

              <div>
                <h1 className="text-3xl font-bold">
                  Budget Details
                </h1>

                <p className="mt-1 text-white/80">
                  {budget.moduleCode} — {budget.moduleName}
                </p>
              </div>

              <button
                onClick={() =>
                  navigate(
                    `/budget-management/edit/${budget.id}`
                  )
                }
                className="bg-white text-[#6C3D91] px-6 h-11 rounded-xl font-semibold hover:bg-[#E8DDF0]"
              >
                Edit Budget
              </button>

            </div>

          </div>

          <div className="bg-white p-8">

            {/* Basic information */}
            <div className="flex flex-wrap gap-8 mb-8">

              <div>
                <p className="text-sm text-[#78848E]">
                  Budget ID
                </p>

                <p className="font-semibold">
                  {budget.id}
                </p>
              </div>

              <div>
                <p className="text-sm text-[#78848E]">
                  Budget Period
                </p>

                <p className="font-semibold">
                  {budget.period}, {budget.year}
                </p>
              </div>

              <div>
                <p className="text-sm text-[#78848E]">
                  Status
                </p>

                <span className="inline-block mt-1 px-4 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm font-semibold">
                  {budget.status}
                </span>
              </div>

            </div>

            {/* Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

              <div className="border border-[#78848E] rounded-xl p-6">
                <p className="text-sm text-[#78848E]">
                  Allocated Budget
                </p>

                <p className="text-2xl font-bold text-[#6C3D91] mt-2">
                  {formatCurrency(budget.allocated)}
                </p>
              </div>

              <div className="border border-[#78848E] rounded-xl p-6">
                <p className="text-sm text-[#78848E]">
                  Budget Used
                </p>

                <p className="text-2xl font-bold text-[#6C3D91] mt-2">
                  {formatCurrency(budget.used)}
                </p>
              </div>

              <div className="border border-[#78848E] rounded-xl p-6">
                <p className="text-sm text-[#78848E]">
                  Remaining
                </p>

                <p
                  className={`text-2xl font-bold mt-2 ${
                    remaining < 0
                      ? 'text-[#DC3545]'
                      : 'text-[#6C3D91]'
                  }`}
                >
                  {formatCurrency(remaining)}
                </p>
              </div>

            </div>

            {/* Utilisation */}
            <div className="border border-[#78848E] rounded-xl p-6 mb-8">

              <h2 className="text-xl font-semibold text-[#6C3D91] mb-6">
                Budget Utilisation
              </h2>

              <div className="flex justify-between mb-2">

                <span className="text-[#78848E]">
                  {formatCurrency(budget.used)} used of{' '}
                  {formatCurrency(budget.allocated)}
                </span>

                <span className="font-semibold">
                  {percentage}%
                </span>

              </div>

              <div className="w-full h-4 bg-gray-200 rounded-full">

                <div
                  className={`h-4 rounded-full ${
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

              {percentage >= 80 && (
                <div className="mt-4 p-4 bg-[#E8DDF0] rounded-xl">
                  <p className="text-[#6C3D91] font-semibold">
                    ⚠ Budget approaching limit
                  </p>

                  <p className="text-sm text-[#78848E] mt-1">
                    This budget has reached {percentage}%
                    utilisation.
                  </p>
                </div>
              )}

            </div>

            {/* Lecturer allocation */}
            <div className="mb-8">

              <h2 className="text-xl font-semibold text-[#6C3D91] mb-4">
                Lecturer Allocation
              </h2>

              <div className="border border-[#78848E] rounded-xl overflow-hidden">

                <table className="w-full">

                  <thead className="bg-[#F3F4F6]">

                    <tr>
                      <th className="p-4 text-left text-sm text-[#78848E]">
                        Lecturer
                      </th>

                      <th className="p-4 text-left text-sm text-[#78848E]">
                        Allocated
                      </th>

                      <th className="p-4 text-left text-sm text-[#78848E]">
                        Used
                      </th>

                      <th className="p-4 text-left text-sm text-[#78848E]">
                        Remaining
                      </th>
                    </tr>

                  </thead>

                  <tbody>

                    {lecturers.map((lecturer) => {

                      const lecturerRemaining =
                        lecturer.allocated -
                        lecturer.used;

                      return (
                        <tr
                          key={lecturer.name}
                          className="border-t border-[#78848E]/40"
                        >

                          <td className="p-4 font-medium">
                            {lecturer.name}
                          </td>

                          <td className="p-4">
                            {formatCurrency(
                              lecturer.allocated
                            )}
                          </td>

                          <td className="p-4">
                            {formatCurrency(
                              lecturer.used
                            )}
                          </td>

                          <td className="p-4">
                            {formatCurrency(
                              lecturerRemaining
                            )}
                          </td>

                        </tr>
                      );

                    })}

                  </tbody>

                </table>

              </div>

            </div>

            {/* Audit Logs */}
            <div>

              <h2 className="text-xl font-semibold text-[#6C3D91] mb-4">
                Budget Audit History
              </h2>

              <div className="border border-[#78848E] rounded-xl overflow-hidden">

                <table className="w-full">

                  <thead className="bg-[#F3F4F6]">

                    <tr>
                      <th className="p-4 text-left text-sm text-[#78848E]">
                        Date
                      </th>

                      <th className="p-4 text-left text-sm text-[#78848E]">
                        User
                      </th>

                      <th className="p-4 text-left text-sm text-[#78848E]">
                        Action
                      </th>

                      <th className="p-4 text-left text-sm text-[#78848E]">
                        Details
                      </th>
                    </tr>

                  </thead>

                  <tbody>

                    {auditLogs.map((log, index) => (

                      <tr
                        key={index}
                        className="border-t border-[#78848E]/40"
                      >

                        <td className="p-4">
                          {log.date}
                        </td>

                        <td className="p-4">
                          {log.user}
                        </td>

                        <td className="p-4">

                          <span className="px-3 py-1 rounded-full bg-[#E8DDF0] text-[#6C3D91] text-xs font-semibold">
                            {log.action}
                          </span>

                        </td>

                        <td className="p-4 text-[#78848E]">
                          {log.description}
                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            </div>

          </div>

        </main>

      </div>

    </div>
  );
};

export default BudgetDetails;
