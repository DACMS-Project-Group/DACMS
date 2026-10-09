 import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import { apiGet } from '../api';

const BudgetManagement = () => {
  document.title = 'AACMS - Budget Management';
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [budgets, setBudgets] = useState([]);
  const [stats, setStats] = useState({
    total_allocated: 0,
    total_used: 0,
    total_remaining: 0,
    count_near_limit: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        setLoading(true);
        setError('');

        const data = await apiGet('/admin/budgets');

        setBudgets(data.module_budgets || []);
        setStats(
          data.stats || {
            total_allocated: 0,
            total_used: 0,
            total_remaining: 0,
            count_near_limit: 0,
          }
        );
      } catch (err) {
        console.error('Failed to load budgets:', err);
        setError(err.message || 'Failed to load budget data.');
      } finally {
        setLoading(false);
      }
    };

    fetchBudgets();
  }, []);

  const formatCurrency = (amount) => {
    return `R ${Number(amount || 0).toLocaleString('en-ZA', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const getPercentage = (used, allocated) => {
    if (!allocated || allocated <= 0) return 0;

    return Math.round((Number(used) / Number(allocated)) * 100);
  };

  const getStatus = (percentage) => {
    if (percentage >= 100) return 'Exceeded';
    if (percentage >= 80) return 'Warning';
    return 'Active';
  };

  const filteredBudgets = budgets.filter(
    (budget) =>
      budget.module_code
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      budget.module_description
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-off-white">
      <Navbar />

      <div className="flex">
        <Sidebar userRole="admin" />

        <main className="flex-1">
          <div className="bg-primary px-8 py-4">
            <h1 className="text-2xl font-poppins font-semibold text-white">
              Budget Management
            </h1>
          </div>

          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-3xl font-poppins font-semibold text-primary">
                Budget Overview
              </h2>

              <p className="text-neutral mt-2 font-inter">
                Create, allocate and monitor module budgets and expenditure.
              </p>
            </div>

            <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
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

            <section className="mb-8">
              <h3 className="text-2xl font-poppins font-semibold text-primary mb-4">
                Budget Summary
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <p className="text-neutral font-inter font-medium">
                    Total Allocated
                  </p>

                  <p className="text-3xl font-poppins font-bold text-primary mt-3">
                    {loading
                      ? 'Loading...'
                      : formatCurrency(stats.total_allocated)}
                  </p>
                </Card>

                <Card>
                  <p className="text-neutral font-inter font-medium">
                    Total Used
                  </p>

                  <p className="text-3xl font-poppins font-bold text-primary mt-3">
                    {loading
                      ? 'Loading...'
                      : formatCurrency(stats.total_used)}
                  </p>
                </Card>

                <Card>
                  <p className="text-neutral font-inter font-medium">
                    Remaining Budget
                  </p>

                  <p
                    className={`text-3xl font-poppins font-bold mt-3 ${
                      Number(stats.total_remaining) < 0
                        ? 'text-red-600'
                        : 'text-primary'
                    }`}
                  >
                    {loading
                      ? 'Loading...'
                      : formatCurrency(stats.total_remaining)}
                  </p>
                </Card>

                <Card>
                  <p className="text-neutral font-inter font-medium">
                    Budgets Near Limit
                  </p>

                  <p className="text-3xl font-poppins font-bold text-primary mt-3">
                    {loading ? 'Loading...' : stats.count_near_limit}
                  </p>

                  <p className="text-sm text-neutral mt-2 font-inter">
                    80% utilisation or higher
                  </p>
                </Card>
              </div>
            </section>

            <section>
              <h3 className="text-2xl font-poppins font-semibold text-primary mb-4">
                Module Budgets
              </h3>

              {error && (
                <Card>
                  <div className="p-6 text-red-600 font-inter">
                    {error}
                  </div>
                </Card>
              )}

              {!error && (
                <Card>
                  <div className="overflow-x-auto">
                    <table className="w-full">
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

                      <tbody>
                        {loading ? (
                          <tr>
                            <td
                              colSpan="7"
                              className="px-5 py-10 text-center text-neutral font-inter"
                            >
                              Loading budgets...
                            </td>
                          </tr>
                        ) : (
                          filteredBudgets.map((budget) => {
                            const percentage = getPercentage(
                              budget.current_budget_usage,
                              budget.allocated_budget
                            );

                            const status = getStatus(percentage);

                            return (
                              <tr
                                key={budget.budget_id}
                                className="
                                  border-t
                                  border-neutral/30
                                  hover:bg-primary-lightest/30
                                  transition
                                "
                              >
                                <td className="px-5 py-5">
                                  <p className="font-semibold text-dark font-inter">
                                    {budget.module_code}
                                  </p>

                                  <p className="text-sm text-neutral mt-1 font-inter">
                                    {budget.module_description}
                                  </p>
                                </td>

                                <td className="px-5 py-5 text-dark font-inter">
                                  {formatCurrency(budget.allocated_budget)}
                                </td>

                                <td className="px-5 py-5 text-dark font-inter">
                                  {formatCurrency(
                                    budget.current_budget_usage
                                  )}
                                </td>

                                <td
                                  className={`px-5 py-5 font-medium font-inter ${
                                    Number(budget.remaining_budget) < 0
                                      ? 'text-red-600'
                                      : 'text-dark'
                                  }`}
                                >
                                  {formatCurrency(budget.remaining_budget)}
                                </td>

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

                                <td className="px-5 py-5">
                                  <StatusBadge status={status} />
                                </td>

                                <td className="px-5 py-5">
                                  <div className="flex gap-4">
                                    <button
                                      onClick={() =>
                                        navigate(
                                          `/budget-details/${budget.budget_id}`
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
                                          `/edit-budget/${budget.budget_id}`
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
                          })
                        )}

                        {!loading && filteredBudgets.length === 0 && (
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
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default BudgetManagement;