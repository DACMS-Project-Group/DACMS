import BreakdownDonut from '../ui/BreakdownDonut';
import Button from '../ui/Button';
import EmptyState from '../ui/EmptyState';
import PageHeader from '../ui/PageHeader';
import Section from '../ui/Section';
import StackedBarChart from '../ui/StackedBarChart';
import StatusSummaryList from '../ui/StatusSummaryList';
import WorkQueue from '../ui/WorkQueue';
import { useEffect, useState } from 'react';
import Card from '../components/Card';
import { useNavigate } from 'react-router-dom';
import {
  formatMoney,
  formatMoneyCompact,
  formatPercent,
} from '../lib/format';
import { apiGet } from '../api';

const STATUS_COLORS = {
  approved: '#3F1D5A',
  awaitingLecturer: '#6C3D91',
  awaitingAdmin: '#B08BC9',
};

const Metric = ({ label, value, hint, tone = 'neutral' }) => {
  const hintTone = {
    neutral: 'text-neutral',
    warning: 'text-status-amber',
    danger: 'text-status-danger',
  }[tone];

  return (
    <div>
      <p className="text-xs text-neutral font-inter">{label}</p>

      <p className="mt-1 text-lg font-semibold text-primary-dark font-poppins">
        {value}
      </p>

      {hint && <p className={`mt-1 text-xs font-inter ${hintTone}`}>{hint}</p>}
    </div>
  );
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  document.title = 'AACMS - Admin Dashboard';

  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        const result = await apiGet('/admin/dashboard');

        if (!cancelled) {
          setData(result);
          setError('');
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Unable to load dashboard data.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, []);

  const stats = data?.stats || {};
  const budgetUtilization = data?.budgetUtilization || {
    months: [],
    modules: [],
  };
  const budgetStats = data?.budgetStats || {};
  const positionApprovals = data?.positionApprovals || {};
  const claimBreakdown = data?.claimBreakdown || {};
  const pendingAppointmentsByModule =
    data?.pendingAppointmentsByModule || [];

  const attentionItems = [
    {
      label: 'Assistant positions awaiting admin approval',
      count: Number(stats.total_pending_approvals ?? 0),
      to: '/appointment-approvals',
      cta: 'Review approvals',
    },
    {
      label: 'Claims awaiting admin verification',
      count: Number(stats.total_pending_claims ?? 0),
      to: '/admin/claims',
      cta: 'Review claims',
    },
  ].filter((item) => item.count > 0);

  const budgetMonths = budgetUtilization.months || [];
  const budgetModules = budgetUtilization.modules || [];
  const moduleTotals = budgetUtilization.moduleTotals || [];
  const budgetAllocated = Number(budgetStats.total_allocated ?? 0);
  const budgetUsed = moduleTotals.reduce(
    (sum, module) => sum + Number(module.utilised ?? 0),
    0
  );
  const budgetRemaining = budgetAllocated - budgetUsed;
  const budgetUsedPct =
    budgetAllocated > 0 ? (budgetUsed / budgetAllocated) * 100 : 0;

  const overBudgetCount = moduleTotals.filter(
    (module) =>
      Number(module.allocated ?? 0) > 0 &&
      Number(module.utilised ?? 0) > Number(module.allocated ?? 0)
  ).length;

  const nearLimitCount = moduleTotals.filter((module) => {
    const allocated = Number(module.allocated ?? 0);
    const utilised = Number(module.utilised ?? 0);

    return (
      allocated > 0 && utilised >= allocated * 0.8 && utilised <= allocated
    );
  }).length;

  const currentMonth = budgetMonths[budgetMonths.length - 1];
  const previousMonth = budgetMonths[budgetMonths.length - 2];
  const currentMonthTotal = Number(currentMonth?.total ?? 0);
  const previousMonthTotal = Number(previousMonth?.total ?? 0);
  const monthChangePct =
    previousMonthTotal > 0
      ? ((currentMonthTotal - previousMonthTotal) / previousMonthTotal) * 100
      : null;

  const positionSegments = [
    {
      label: 'Approved',
      value: Number(positionApprovals.approved ?? 0),
      color: STATUS_COLORS.approved,
    },
    {
      label: 'Awaiting lecturer decision',
      value: Number(positionApprovals.awaiting_lecturer ?? 0),
      color: STATUS_COLORS.awaitingLecturer,
    },
    {
      label: 'Awaiting admin decision',
      value: Number(positionApprovals.awaiting_admin ?? 0),
      color: STATUS_COLORS.awaitingAdmin,
    },
  ];
  const positionTotal = positionSegments.reduce(
    (sum, segment) => sum + segment.value,
    0
  );

  const claimItems = [
    {
      label: 'Approved (verified)',
      value: Number(claimBreakdown.approved ?? 0),
      amount: Number(claimBreakdown.approved_amount ?? 0),
      color: STATUS_COLORS.approved,
    },
    {
      label: 'Awaiting lecturer decision',
      value: Number(claimBreakdown.awaiting_lecturer ?? 0),
      amount: Number(claimBreakdown.awaiting_lecturer_amount ?? 0),
      color: STATUS_COLORS.awaitingLecturer,
    },
    {
      label: 'Awaiting admin decision',
      value: Number(claimBreakdown.awaiting_admin ?? 0),
      amount: Number(claimBreakdown.awaiting_admin_amount ?? 0),
      color: STATUS_COLORS.awaitingAdmin,
    },
  ];
  const claimTotal = claimItems.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="p-4 md:p-8">
      <PageHeader
        title="Administrator Dashboard"
        description="Monitor appointments, claims, and budget health across the system."
      />

      {error && (
        <p className="mb-6 text-sm text-error font-inter">
          Could not load dashboard data: {error}
        </p>
      )}

      {/* Work queue */}
      <Section
        title="Needs your attention"
        description="Approvals and claims waiting on the administrator team."
      >
        <WorkQueue
          items={attentionItems}
          loading={loading}
          emptyDescription="No appointments or claims are awaiting processing."
        />
      </Section>

      {/* Budget utilisation and position approvals */}
      <div className="mb-8 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Section
          title="Budget utilisation by module"
          description="Rand value of logged work sessions per month, stacked by module and compared over the last 12 months."
          noMargin
          className="flex h-full min-w-0 flex-col xl:col-span-2"
          actions={
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/budget-management')}
            >
              Manage budgets →
            </Button>
          }
        >
          <Card className="flex flex-1 flex-col">
            {loading ? (
              <p className="py-10 text-center text-neutral font-inter">
                Loading…
              </p>
            ) : (
              <>
                <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <Metric
                    label="Allocated (YTD)"
                    value={formatMoney(budgetAllocated)}
                  />

                  <Metric
                    label="Utilised (12 mo)"
                    value={formatMoney(budgetUsed)}
                    hint={`${formatPercent(budgetUsedPct)} of allocation`}
                  />

                  <Metric
                    label="Remaining"
                    value={formatMoney(budgetRemaining)}
                    hint={
                      overBudgetCount > 0
                        ? `${overBudgetCount} module${
                            overBudgetCount === 1 ? '' : 's'
                          } over budget`
                        : `${nearLimitCount} module${
                            nearLimitCount === 1 ? '' : 's'
                          } at 80%+`
                    }
                    tone={
                      overBudgetCount > 0
                        ? 'danger'
                        : nearLimitCount > 0
                          ? 'warning'
                          : 'neutral'
                    }
                  />

                  <Metric
                    label="Utilisation this month"
                    value={formatMoney(currentMonthTotal)}
                    hint={
                      monthChangePct === null
                        ? 'No prior month data'
                        : `${monthChangePct >= 0 ? '↑' : '↓'} ${formatPercent(
                            Math.abs(monthChangePct)
                          )} vs last month`
                    }
                  />
                </div>

                <div className="flex-1">
                  <StackedBarChart
                    data={budgetMonths}
                    modules={budgetModules}
                    formatValue={formatMoney}
                    formatAxis={formatMoneyCompact}
                    emptyMessage="Logged work-session value will appear here."
                  />
                </div>
              </>
            )}
          </Card>
        </Section>

        <Section
          title="Assistant position approvals"
          description="Where applications currently sit in the approval pipeline."
          noMargin
          className="flex h-full min-w-0 flex-col"
          actions={
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/appointment-approvals')}
            >
              Review →
            </Button>
          }
        >
          <Card className="flex flex-1 flex-col justify-center">
            {loading ? (
              <p className="py-10 text-center text-neutral font-inter">
                Loading…
              </p>
            ) : positionTotal === 0 ? (
              <EmptyState
                title="No position activity"
                description="Application and appointment totals will appear here."
              />
            ) : (
              <BreakdownDonut
                segments={positionSegments}
                centerLabel="Positions"
              />
            )}
          </Card>
        </Section>
      </div>

      {/* Claims pipeline and pending appointments */}
      <div className="mb-8 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Section
          title="Claims"
          noMargin
          className="flex h-full min-w-0 flex-col"
          actions={
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/admin/claims')}
            >
              Review claims →
            </Button>
          }
        >
          <Card className="flex flex-1 flex-col">
            {loading ? (
              <p className="py-10 text-center text-neutral font-inter">
                Loading…
              </p>
            ) : claimTotal === 0 ? (
              <EmptyState
                title="No claims"
                description="Submitted claims will appear here."
              />
            ) : (
              <StatusSummaryList items={claimItems} total={claimTotal} />
            )}
          </Card>
        </Section>

        <Section
          title="Pending appointments by module"
          description="Modules currently waiting on admin approval for assistant appointments."
          noMargin
          className="flex h-full min-w-0 flex-col xl:col-span-2"
          actions={
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/appointment-approvals')}
            >
              Review appointments →
            </Button>
          }
        >
          <Card className="flex flex-1 flex-col">
            <div className="flex-1">
              {loading ? (
                <p className="py-6 text-center text-neutral font-inter">
                  Loading…
                </p>
              ) : pendingAppointmentsByModule.length === 0 ? (
                <EmptyState
                  title="No pending appointments"
                  description="New appointment requests will appear here."
                />
              ) : (
                <ul className="divide-y divide-border-subtle">
                  {pendingAppointmentsByModule.map((item) => (
                    <li
                      key={item.module_code}
                      className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-dark font-inter">
                          {item.module_code}
                        </p>

                        <p className="mt-0.5 truncate text-xs text-neutral font-inter">
                          {item.module_name}
                        </p>
                      </div>

                      <span className="shrink-0 rounded-full bg-primary-lightest px-3 py-1 text-sm font-semibold text-primary-dark font-poppins">
                        {item.pending_count}{' '}
                        {item.pending_count === 1 ? 'appointment' : 'appointments'}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Card>
        </Section>
      </div>
    </div>
  );
};

export default AdminDashboard;
