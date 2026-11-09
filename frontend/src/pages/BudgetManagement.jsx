import Button from '../ui/Button';
import DataTable from '../ui/DataTable';
import PageHeader from '../ui/PageHeader';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import { apiGet } from '../api';
import { useAuth } from '../contexts/AuthContext';

const BudgetManagement = () => {
  const { user } = useAuth();
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

        const endpoint = user?.role === 'lecturer' ? '/lecturer/budgets' : '/admin/budgets';
        const data = await apiGet(endpoint);

        setBudgets(data.module_budgets || data.budgets || []);
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
  }, [user]);

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

  const budgetColumns = [
    {
      key: 'module_code',
      header: 'Module',
      className: 'px-5 py-5',
      render: (budget) => (
        <>
          <p className="font-semibold text-dark font-inter">{budget.module_code}</p>
          <p className="text-sm text-neutral mt-1 font-inter">
            {budget.module_description}
          </p>
        </>
      ),
    },
    {
      key: 'allocated_budget',
      header: 'Allocated',
      className: 'px-5 py-5 text-dark font-inter',
      render: (budget) => formatCurrency(budget.allocated_budget),
    },
    {
      key: 'current_budget_usage',
      header: 'Used',
      className: 'px-5 py-5 text-dark font-inter',
      render: (budget) => formatCurrency(budget.current_budget_usage),
    },
    {
      key: 'remaining_budget',
      header: 'Remaining',
      className: 'px-5 py-5 font-medium font-inter',
      render: (budget) => (
        <span
          className={
            Number(budget.remaining_budget) < 0 ? 
              'text-error'
            : 'text-dark'
          }
        >
          {formatCurrency(budget.remaining_budget)}
        </span>
      ),
    },
    {
      key: 'utilisation',
      header: 'Utilisation',
      className: 'px-5 py-5 min-w-[170px]',
      render: (budget) => {
        const percentage = getPercentage(
          budget.current_budget_usage,
          budget.allocated_budget
        );
        return (
          <>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-dark font-inter">{percentage}%</span>
            </div>
            <div className="w-full h-2 bg-light-grey rounded-full">
              <div
                className={`h-2 rounded-full ${
                  percentage >= 100
                    ? 'bg-error'
                    : percentage >= 80
                      ? 'bg-warning'
                      : 'bg-success'
                }`}
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
            </div>
          </>
        );
      },
    },
    {
      key: 'status',
      header: 'Status',
      className: 'px-5 py-5',
      render: (budget) => (
        <StatusBadge
          status={getStatus(
            getPercentage(
              budget.current_budget_usage,
              budget.allocated_budget
            )
          )}
        />
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'px-5 py-5',
      render: (budget) => (
        <div className="flex gap-4">
          <Button
            unstyled
            onClick={() =>
              navigate(
                user?.role === 'lecturer'
                  ? `/lecturer-budget-details/${budget.budget_id}`
                  : `/budget-details/${budget.budget_id}`
              )
            }
            className="text-primary font-semibold hover:underline font-inter"
          >
            View
          </Button>

          {user?.role === 'admin' && (
            <Button
              unstyled
              onClick={() => navigate(`/edit-budget/${budget.budget_id}`)}
              className="text-neutral font-semibold hover:underline font-inter"
            >
              Edit
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <>


          <div className="p-8">
            <PageHeader
              title="Budget Management"
              description="Create, allocate and monitor module budgets and expenditure."
            />

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

              {user?.role !== 'lecturer' && (
                <Button unstyled
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
                </Button>
              )}
            </div>

            <section className="mb-8">
              <h3 className="text-card font-poppins font-semibold text-primary mb-4">
                Budget Summary
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
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
                    className={`text-3xl font-poppins font-bold mt-3 ${Number(stats.total_remaining) < 0
                        ? 'text-error'
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
              <h3 className="text-card font-poppins font-semibold text-primary mb-4">
                Module Budgets
              </h3>

              {error && (
                <Card>
                  <div className="p-6 text-error font-inter">
                    {error}
                  </div>
                </Card>
              )}

              {!error && (
                <Card>
                  <DataTable
                    columns={budgetColumns}
                    rows={filteredBudgets}
                    getRowKey={(budget) => budget.budget_id}
                    loading={loading}
                    emptyTitle="No budgets found"
                    emptyDescription="No budgets match your search."
                    minWidth="900px"
                  />
                </Card>
              )}
            </section>
          </div>

    </>
  );
};

export default BudgetManagement;