import Button from '../ui/Button';
import DataTable from '../ui/DataTable';
import EmptyState from '../ui/EmptyState';
import PageHeader from '../ui/PageHeader';
import Section from '../ui/Section';
import StatCard from '../ui/StatCard';
import WorkQueue from '../ui/WorkQueue';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import { apiGet } from '../api';
import { formatHours, formatMoney } from '../lib/format';

const Dashboard = () => {
  document.title = 'AACMS - Dashboard';
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [notificationError, setNotificationError] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        const data = await apiGet('/student/dashboard');
        if (!cancelled) {
          setDashboardData(data);
          setError('');
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadNotifications = async () => {
      try {
        const data = await apiGet('/notifications/fetch');
        if (!cancelled) {
          setNotifications(Array.isArray(data) ? data.slice(0, 3) : []);
          setNotificationError('');
        }
      } catch (err) {
        if (!cancelled) setNotificationError(err.message);
      }
    };

    loadNotifications();

    return () => {
      cancelled = true;
    };
  }, []);

  const profile = dashboardData?.profile || {};
  const stats = dashboardData?.stats || {};
  const monthlyHours = dashboardData?.monthlyHours || [];
  const applications = dashboardData?.applications || [];
  const claims = dashboardData?.claims || [];

  const kpis = [
    {
      label: 'Active positions',
      value: stats.active_positions ?? 0,
      to: '/modules',
      viewLabel: 'View modules',
    },
    {
      label: 'Pending applications',
      value: stats.pending_applications ?? 0,
      to: '/applications',
      viewLabel: 'View applications',
    },
    {
      label: 'Hours this month',
      value: formatHours(stats.hours_this_month ?? 0, 1),
      to: '/work-tracking',
      viewLabel: 'View work tracking',
    },
    {
      label: 'Pending claims',
      value: stats.pending_claims ?? 0,
      to: '/claims',
      viewLabel: 'View claims',
    },
  ];

  const attentionItems = [
    {
      label: 'Applications awaiting a decision',
      count: stats.pending_applications ?? 0,
      to: '/applications',
      cta: 'View applications',
    },
    {
      label: 'Claims pending approval',
      count: stats.pending_claims ?? 0,
      to: '/claims',
      cta: 'View claims',
    },
  ].filter((item) => item.count > 0);

  const monthlyHoursColumns = [
    {
      key: 'module',
      header: 'Module',
      className: 'py-3 px-4 text-dark font-inter',
      render: (row) => row.module || '—',
    },
    {
      key: 'hours',
      header: 'Hours worked',
      className: 'py-3 px-4 text-dark font-inter',
      sortValue: (row) => Number(row.hours ?? row.total_hours ?? 0),
      render: (row) => row.hours ?? row.total_hours ?? 0,
    },
  ];

  const applicationColumns = [
    {
      key: 'module',
      header: 'Module',
      className: 'py-3 px-4 text-dark font-inter',
      render: (app) => app.module || app.moduleCode || '—',
    },
    {
      key: 'status',
      header: 'Status',
      className: 'py-3 px-4',
      render: (app) => <StatusBadge status={app.status || 'Pending'} />,
    },
  ];

  const claimColumns = [
    {
      key: 'module',
      header: 'Module',
      className: 'py-3 px-4 text-dark font-inter',
    },
    {
      key: 'amount',
      header: 'Amount',
      className: 'py-3 px-4 text-dark font-inter',
      sortValue: (claim) => Number(claim.amount ?? 0),
      render: (claim) => formatMoney(claim.amount),
    },
    {
      key: 'status',
      header: 'Status',
      className: 'py-3 px-4',
      render: (claim) => <StatusBadge status={claim.status} />,
    },
    {
      key: 'reference',
      header: 'Claim #',
      className: 'py-3 px-4 text-dark font-inter',
    },
  ];

  return (
    <div className="p-4 md:p-8">
      <PageHeader
        title={loading ? 'Dashboard' : `Welcome ${profile.name || 'Student'}!`}
        description="Your applications, work hours, and claims at a glance."
      />

      {error && (
        <p className="mb-6 text-sm text-error font-inter">
          Could not load dashboard data: {error}
        </p>
      )}

      {/* Work queue */}
      <Section
        title="Needs your attention"
        description="Items waiting on you or the university."
      >
        <WorkQueue
          items={attentionItems}
          loading={loading}
          emptyDescription="You have no pending applications or claims."
          emptyAction={{
            label: 'Start a work session',
            to: '/work-tracking',
          }}
        />
      </Section>

      {/* Stats overview */}
      <Section title="Overview">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 md:gap-4">
          {kpis.map((kpi) => (
            <StatCard
              key={kpi.label}
              label={kpi.label}
              value={kpi.value}
              loading={loading}
              actionLabel={kpi.viewLabel}
              onAction={() => navigate(kpi.to)}
            />
          ))}
        </div>
      </Section>

      {/* Notifications and quick actions */}
      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Section
          title="Notifications"
          noMargin
          className="flex h-full min-w-0 flex-col"
        >
          <Card className="flex-1">
            <div className="flex h-full flex-col">
              <div className="flex-1 space-y-4">
                {notificationError ? (
                  <p className="text-sm text-error font-inter">
                    Could not load notifications: {notificationError}
                  </p>
                ) : notifications.length === 0 ? (
                  <EmptyState
                    title="No notifications yet"
                    description="Updates about your applications and claims will appear here."
                  />
                ) : (
                  notifications.map((notification) => (
                    <div key={notification.NotificationID}>
                      <p className="font-semibold text-dark font-inter">
                        {notification.Subject}
                      </p>

                      <p className="text-sm text-neutral font-inter">
                        {notification.Message}
                      </p>
                    </div>
                  ))
                )}
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/notifications')}
                className="mt-4 self-end"
              >
                View all →
              </Button>
            </div>
          </Card>
        </Section>

        <Section
          title="Quick actions"
          noMargin
          className="flex h-full min-w-0 flex-col"
        >
          <Card className="flex-1">
            <div className="flex flex-col gap-3">
              <Button
                onClick={() => navigate('/work-tracking')}
                className="w-full"
              >
                Start work session
              </Button>

              <Button
                variant="subtle"
                onClick={() => navigate('/apply-for-assistant')}
                className="w-full"
              >
                Apply to Assistant
              </Button>

              <Button
                variant="secondary"
                onClick={() => navigate('/generate-new-claim')}
                className="w-full"
              >
                Submit Claim
              </Button>
            </div>
          </Card>
        </Section>
      </div>

      {/* Hours this month */}
      <Section
        title="Hours this month"
        description="Hours captured per module this month."
      >
        <Card>
          <DataTable
            columns={monthlyHoursColumns}
            rows={monthlyHours}
            loading={loading}
            emptyTitle="No hours recorded yet"
            emptyDescription="Start a work session to see your hours here."
            minWidth="320px"
          />
        </Card>
      </Section>

      {/* Applications and claims */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Section
          title="Application status"
          noMargin
          className="h-full min-w-0"
          actions={
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/applications')}
            >
              View all →
            </Button>
          }
        >
          <Card>
            <DataTable
              columns={applicationColumns}
              rows={applications}
              loading={loading}
              emptyTitle="No applications yet"
              emptyDescription="Apply for an Assistant position to see it here."
              minWidth="280px"
            />
          </Card>
        </Section>

        <Section
          title="Claims"
          noMargin
          className="h-full min-w-0"
          actions={
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/claims')}
            >
              View all →
            </Button>
          }
        >
          <Card>
            <DataTable
              columns={claimColumns}
              rows={claims}
              loading={loading}
              emptyTitle="No claims yet"
              emptyDescription="Submit a claim once you have logged work hours."
              minWidth="480px"
            />
          </Card>
        </Section>
      </div>
    </div>
  );
};

export default Dashboard;
