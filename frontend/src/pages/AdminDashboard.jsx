import Button from '../ui/Button';
import EmptyState from '../ui/EmptyState';
import PageHeader from '../ui/PageHeader';
import Section from '../ui/Section';
import StatCard from '../ui/StatCard';
import WorkQueue from '../ui/WorkQueue';
import { useEffect, useState } from 'react';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import { useNavigate } from 'react-router-dom';
import { formatMoney } from '../lib/format';
import { apiGet } from '../api';

const APPOINTMENTS_PER_PAGE = 4;

const renderAmount = (value) => {
  if (value === null || value === undefined || value === '') return '—';

  if (typeof value === 'number') return formatMoney(value);

  const numeric = Number(value);

  return Number.isFinite(numeric) ? formatMoney(numeric) : value;
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  document.title = 'AACMS - Admin Dashboard';

  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [appointmentPage, setAppointmentPage] = useState(1);

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
  const monthlyClaims = data?.monthlyClaims || [];
  const monthlyWork = data?.monthlyWork || [];
  const pendingAppointments = data?.pendingAppointments || [];

  const totalAppointmentPages = Math.max(
    Math.ceil(pendingAppointments.length / APPOINTMENTS_PER_PAGE),
    1
  );

  useEffect(() => {
    setAppointmentPage((currentPage) =>
      Math.min(currentPage, totalAppointmentPages)
    );
  }, [totalAppointmentPages]);

  const currentAppointments = pendingAppointments.slice(
    (appointmentPage - 1) * APPOINTMENTS_PER_PAGE,
    appointmentPage * APPOINTMENTS_PER_PAGE
  );

  const kpis = [
    {
      title: 'Total modules',
      value: stats.total_modules ?? 0,
      to: '/budget-management',
      viewLabel: 'Manage budgets',
    },
    {
      title: 'Total lecturers',
      value: stats.total_lecturers ?? 0,
    },
    {
      title: 'Total assistants',
      value: stats.total_demis ?? 0,
    },
    {
      title: 'Pending approvals',
      value: stats.total_pending_approvals ?? 0,
      to: '/appointment-approvals',
      viewLabel: 'Review approvals',
    },
    {
      title: 'Pending claims',
      value: stats.total_pending_claims ?? 0,
      to: '/admin/claims',
      viewLabel: 'Review claims',
    },
  ];

  const attentionItems = [
    {
      label: 'Appointments awaiting approval',
      count: Number(stats.total_pending_approvals ?? 0),
      to: '/appointment-approvals',
      cta: 'Review approvals',
    },
    {
      label: 'Claims awaiting processing',
      count: Number(stats.total_pending_claims ?? 0),
      to: '/admin/claims',
      cta: 'Review claims',
    },
  ].filter((item) => item.count > 0);

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

      {/* Overview */}
      <Section title="Overview">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 xl:grid-cols-5">
          {kpis.map((kpi) => (
            <StatCard
              key={kpi.title}
              label={kpi.title}
              value={kpi.value}
              loading={loading}
              actionLabel={kpi.viewLabel}
              onAction={kpi.to ? () => navigate(kpi.to) : undefined}
            />
          ))}
        </div>
      </Section>

      {/* Monthly activity and pending appointments */}
      <div className="grid grid-cols-1 items-stretch gap-6 xl:grid-cols-3">
        <Section
          title="Monthly claims"
          noMargin
          className="flex h-full min-w-0 flex-col"
          actions={
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/admin/claims')}
            >
              View claims →
            </Button>
          }
        >
          <Card className="flex-1">
            {loading ? (
              <p className="py-6 text-center text-neutral font-inter">
                Loading…
              </p>
            ) : monthlyClaims.length === 0 ? (
              <EmptyState
                title="No claim data"
                description="Monthly claim totals will appear here."
              />
            ) : (
              <div className="space-y-4">
                {monthlyClaims.map((claim) => (
                  <div
                    key={claim.month}
                    className="flex items-center justify-between border-b border-border-subtle pb-3 last:border-0 last:pb-0"
                  >
                    <span className="font-semibold text-dark font-inter">
                      {claim.month}
                    </span>

                    <span className="whitespace-nowrap font-semibold text-primary font-inter">
                      {renderAmount(claim.amount)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </Section>

        <Section
          title="Monthly work sessions"
          noMargin
          className="flex h-full min-w-0 flex-col"
        >
          <Card className="flex-1">
            {loading ? (
              <p className="py-6 text-center text-neutral font-inter">
                Loading…
              </p>
            ) : monthlyWork.length === 0 ? (
              <EmptyState
                title="No session data"
                description="Monthly work session totals will appear here."
              />
            ) : (
              <div className="space-y-4">
                {monthlyWork.map((month) => (
                  <div
                    key={month.month}
                    className="flex items-center justify-between border-b border-border-subtle pb-3 last:border-0 last:pb-0"
                  >
                    <span className="font-semibold text-dark font-inter">
                      {month.month}
                    </span>

                    <span className="whitespace-nowrap font-semibold text-primary font-inter">
                      {month.total_sessions}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </Section>

        <Section
          title="Pending appointments"
          noMargin
          className="flex h-full min-w-0 flex-col"
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
            <div className="flex-1 space-y-3">
              {loading ? (
                <p className="py-6 text-center text-neutral font-inter">
                  Loading…
                </p>
              ) : currentAppointments.length === 0 ? (
                <EmptyState
                  title="No pending appointments"
                  description="New appointment requests will appear here."
                />
              ) : (
                currentAppointments.map((appointment, index) => (
                  <div
                    key={`${appointment.module}-${appointment.date}-${index}`}
                    className="border-b border-border-subtle pb-3 last:border-0 last:pb-0"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-dark font-inter">
                          {appointment.module}
                        </p>

                        <p className="mt-1 truncate text-xs text-neutral font-inter">
                          {appointment.lecturer} → {appointment.assistant}
                        </p>

                        <p className="mt-1 text-xs text-neutral font-inter">
                          {appointment.date}
                        </p>
                      </div>

                      <div className="shrink-0">
                        <StatusBadge status={appointment.status} />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {pendingAppointments.length > 0 && (
              <div className="mt-4 flex flex-col gap-2 border-t border-border-subtle pt-3 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-xs text-neutral font-inter">
                  Showing {(appointmentPage - 1) * APPOINTMENTS_PER_PAGE + 1}–
                  {Math.min(
                    appointmentPage * APPOINTMENTS_PER_PAGE,
                    pendingAppointments.length
                  )}{' '}
                  of {pendingAppointments.length}
                </span>

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    type="button"
                    onClick={() =>
                      setAppointmentPage((page) => Math.max(page - 1, 1))
                    }
                    disabled={appointmentPage === 1}
                    aria-label="Previous page"
                  >
                    ‹
                  </Button>

                  {Array.from(
                    { length: totalAppointmentPages },
                    (_, index) => index + 1
                  ).map((page) => (
                    <Button
                      key={page}
                      variant={page === appointmentPage ? 'primary' : 'ghost'}
                      size="sm"
                      type="button"
                      aria-label={`Go to page ${page}`}
                      aria-current={
                        page === appointmentPage ? 'page' : undefined
                      }
                      onClick={() => setAppointmentPage(page)}
                      className="min-w-9 px-2"
                    >
                      {page}
                    </Button>
                  ))}

                  <Button
                    variant="ghost"
                    size="sm"
                    type="button"
                    onClick={() =>
                      setAppointmentPage((page) =>
                        Math.min(page + 1, totalAppointmentPages)
                      )
                    }
                    disabled={appointmentPage === totalAppointmentPages}
                    aria-label="Next page"
                  >
                    ›
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </Section>
      </div>
    </div>
  );
};

export default AdminDashboard;
