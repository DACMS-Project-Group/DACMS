import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import { apiGet } from '../api';

const BudgetDetails = () => {
  document.title = 'AACMS - Budget Details';
  const { id } = useParams();

  const [budget, setBudget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBudget = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await apiGet(`/admin/budgets/fetch/${id}`);

        const budgetData = response?.data?.[0];

        if (!budgetData) {
          throw new Error('Budget information could not be found.');
        }

        setBudget(budgetData);
      } catch (err) {
        console.error('Failed to load budget details:', err);
        setError(
          err.message || 'Failed to load budget details.'
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBudget();
    }
  }, [id]);

  const formatCurrency = (amount) =>
    `R ${Number(amount || 0).toLocaleString('en-ZA', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const getPercentage = () => {
    if (!budget || !budget.allocated_budget) return 0;

    return Math.round(
      (Number(budget.current_budget_usage) /
        Number(budget.allocated_budget)) *
        100
    );
  };

  const getStatus = (percentage) => {
    if (percentage >= 100) return 'Exceeded';
    if (percentage >= 80) return 'Warning';
    return 'Active';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-off-white">
        <Navbar />

        <div className="flex">
          <Sidebar userRole="admin" />

          <main className="flex-1">
            <div className="bg-primary px-8 py-4">
              <h1 className="text-2xl font-poppins font-semibold text-white">
                Budget Details
              </h1>
            </div>

            <div className="p-8">
              <Card>
                <div className="p-6 text-center text-neutral font-inter">
                  Loading budget details...
                </div>
              </Card>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error || !budget) {
    return (
      <div className="min-h-screen bg-off-white">
        <Navbar />

        <div className="flex">
          <Sidebar userRole="admin" />

          <main className="flex-1">
            <div className="bg-primary px-8 py-4">
              <h1 className="text-2xl font-semibold text-white font-poppins">
                Budget Details
              </h1>
            </div>

            <div className="p-8">
              <Card>
                <div className="p-6 text-red-600 font-inter">
                  {error || 'Budget information could not be found.'}
                </div>
              </Card>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const percentage = getPercentage();
  const status = getStatus(percentage);

  return (
    <div className="min-h-screen bg-off-white">
      <Navbar />

      <div className="flex">
        <Sidebar userRole="admin" />

        <main className="flex-1">
          <div className="bg-primary px-8 py-4">
            <h1 className="text-2xl font-semibold text-white font-poppins">
              Budget Details
            </h1>
          </div>

          <div className="p-8">
            {/* Page Introduction */}
            <div className="mb-8">
              <h2 className="text-3xl font-poppins font-semibold text-primary">
                {budget.module_code}
              </h2>

              <p className="text-neutral mt-2 font-inter">
                {budget.module_description}
              </p>
            </div>

            {/* Budget Information */}
            <section className="mb-8">
              <h3 className="text-2xl font-poppins font-semibold text-primary mb-4">
                Budget Information
              </h3>

              <Card>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-neutral font-inter">
                      Budget ID
                    </p>

                    <p className="font-semibold text-dark mt-1 font-inter">
                      {budget.budget_id}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-neutral font-inter">
                      Module
                    </p>

                    <p className="font-semibold text-dark mt-1 font-inter">
                      {budget.module_code}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-neutral font-inter">
                      Status
                    </p>

                    <div className="mt-1">
                      <StatusBadge status={status} />
                    </div>
                  </div>
                </div>
              </Card>
            </section>

            {/* Budget Summary */}
            <section className="mb-8">
              <h3 className="text-2xl font-poppins font-semibold text-primary mb-4">
                Budget Summary
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <p className="text-neutral font-inter font-medium">
                    Allocated Budget
                  </p>

                  <p className="text-3xl font-poppins font-bold text-primary mt-3">
                    {formatCurrency(budget.allocated_budget)}
                  </p>
                </Card>

                <Card>
                  <p className="text-neutral font-inter font-medium">
                    Budget Used
                  </p>

                  <p className="text-3xl font-poppins font-bold text-primary mt-3">
                    {formatCurrency(budget.current_budget_usage)}
                  </p>
                </Card>

                <Card>
                  <p className="text-neutral font-inter font-medium">
                    Remaining
                  </p>

                  <p
                    className={`text-3xl font-poppins font-bold mt-3 ${
                      Number(budget.remaining_budget) < 0
                        ? 'text-red-600'
                        : 'text-primary'
                    }`}
                  >
                    {formatCurrency(budget.remaining_budget)}
                  </p>
                </Card>
              </div>
            </section>

            {/* Budget Utilisation */}
            <section className="mb-8">
              <h3 className="text-2xl font-poppins font-semibold text-primary mb-4">
                Budget Utilisation
              </h3>

              <Card>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-neutral font-inter">
                    {formatCurrency(budget.current_budget_usage)} used of{' '}
                    {formatCurrency(budget.allocated_budget)}
                  </span>

                  <span className="font-semibold text-dark font-inter">
                    {percentage}%
                  </span>
                </div>

                <div className="w-full h-4 bg-primary-lightest rounded-full overflow-hidden">
                  <div
                    className={`h-4 rounded-full ${
                      percentage >= 100
                        ? 'bg-red-600'
                        : percentage >= 80
                        ? 'bg-yellow-500'
                        : 'bg-green-600'
                    }`}
                    style={{
                      width: `${Math.min(percentage, 100)}%`,
                    }}
                  />
                </div>

                {percentage >= 80 && (
                  <div className="mt-5 p-4 bg-primary-lightest rounded-xl">
                    <p className="text-primary font-semibold font-inter">
                      ⚠ Budget approaching limit
                    </p>

                    <p className="text-sm text-neutral mt-1 font-inter">
                      This budget has reached {percentage}% utilisation.
                    </p>
                  </div>
                )}
              </Card>
            </section>

            {/* Lecturer Allocation */}
            <section className="mb-8">
              <h3 className="text-2xl font-poppins font-semibold text-primary mb-4">
                Lecturer Allocation
              </h3>

              <Card>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-primary-lightest">
                      <tr>
                        <th className="p-4 text-left text-sm font-semibold text-primary font-inter">
                          Lecturer
                        </th>

                        <th className="p-4 text-left text-sm font-semibold text-primary font-inter">
                          Email
                        </th>

                        <th className="p-4 text-left text-sm font-semibold text-primary font-inter">
                          Allocated
                        </th>

                        <th className="p-4 text-left text-sm font-semibold text-primary font-inter">
                          Used
                        </th>

                        <th className="p-4 text-left text-sm font-semibold text-primary font-inter">
                          Remaining
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      <tr className="border-t border-neutral/30 hover:bg-primary-lightest/30 transition">
                        <td className="p-4 font-semibold text-dark font-inter">
                          {budget.lecturer}
                        </td>

                        <td className="p-4 text-dark font-inter">
                          {budget.lecturer_email}
                        </td>

                        <td className="p-4 text-dark font-inter">
                          {formatCurrency(budget.allocated_budget)}
                        </td>

                        <td className="p-4 text-dark font-inter">
                          {formatCurrency(budget.current_budget_usage)}
                        </td>

                        <td className="p-4 text-dark font-inter">
                          {formatCurrency(budget.remaining_budget)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Card>
            </section>

            {/* Audit History */}
            <section>
              <h3 className="text-2xl font-poppins font-semibold text-primary mb-4">
                Budget Audit History
              </h3>

              <Card>
                <div className="p-6">
                  <p className="text-neutral font-inter">
                    Audit history is not currently provided by the budget
                    details API.
                  </p>
                </div>
              </Card>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default BudgetDetails;