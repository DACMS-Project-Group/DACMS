import { useEffect, useState } from 'react';
import DataTable from '../ui/DataTable';
import DetailPage from '../ui/DetailPage';
import { useParams } from 'react-router-dom';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import { apiGet } from '../api';
import { useAuth } from '../contexts/AuthContext';

const BudgetDetails = () => {
  document.title = 'AACMS - Budget Details';
  const { id } = useParams();
  const { user } = useAuth();
  const isLecturer = user?.role === 'lecturer';

  const [budget, setBudget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBudget = async () => {
      try {
        setLoading(true);
        setError('');

        const endpoint = isLecturer
          ? `/lecturer/budgets/fetch/${id}`
          : `/admin/budgets/fetch/${id}`;
        const response = await apiGet(endpoint);

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
  }, [id, isLecturer]);

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

  const percentage = getPercentage();
  const status = getStatus(percentage);

  const lecturerColumns = [
    {
      key: 'lecturer',
      header: 'Lecturer',
      className: 'p-4 font-semibold text-dark font-inter',
    },
    {
      key: 'lecturer_email',
      header: 'Email',
      className: 'p-4 text-dark font-inter',
    },
    {
      key: 'allocated_budget',
      header: 'Allocated',
      className: 'p-4 text-dark font-inter',
      render: (row) => formatCurrency(row.allocated_budget),
    },
    {
      key: 'current_budget_usage',
      header: 'Used',
      className: 'p-4 text-dark font-inter',
      render: (row) => formatCurrency(row.current_budget_usage),
    },
    {
      key: 'remaining_budget',
      header: 'Remaining',
      className: 'p-4 text-dark font-inter',
      render: (row) => formatCurrency(row.remaining_budget),
    },
  ];

  return (
    <DetailPage
      title={budget?.module_code || 'Budget Details'}
      description={budget?.module_description}
      breadcrumbs={[
        {
          label: 'Budgets',
          to: isLecturer ? '/lecturer-budgets' : '/budget-management',
        },
        { label: 'Budget Details' },
      ]}
      backTo={isLecturer ? '/lecturer-budgets' : '/budget-management'}
      backLabel="Back to Budgets"
      loading={loading}
      loadingMessage="Loading budget details..."
      errorTitle="Could not load budget"
      error={error || (!budget ? 'Budget information could not be found.' : '')}
    >
      {budget ? (
        <>
            {/* Budget Information */}
            <section className="mb-8">
              <h3 className="text-card font-poppins font-semibold text-primary mb-4">
                Budget Information
              </h3>

              <Card>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
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
              <h3 className="text-card font-poppins font-semibold text-primary mb-4">
                Budget Summary
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
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
                        ? 'text-error'
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
              <h3 className="text-card font-poppins font-semibold text-primary mb-4">
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
                        ? 'bg-error'
                        : percentage >= 80
                        ? 'bg-warning'
                        : 'bg-success'
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
              <h3 className="text-card font-poppins font-semibold text-primary mb-4">
                Lecturer Allocation
              </h3>

              <Card>
                <DataTable
                  columns={lecturerColumns}
                  rows={[budget]}
                  getRowKey={(row) => row.budget_id}
                  emptyTitle="No lecturer allocation found"
                  minWidth="700px"
                />
              </Card>
            </section>

            {/* Audit History — admin only */}
            {!isLecturer && (
              <section>
                <h3 className="text-card font-poppins font-semibold text-primary mb-4">
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
            )}
        </>
      ) : null}
    </DetailPage>
  );
};

export default BudgetDetails;