import Button from '../ui/Button';
import ColumnChart from '../ui/ColumnChart';
import DonutChart from '../ui/DonutChart';
import EmptyState from '../ui/EmptyState';
import PageHeader from '../ui/PageHeader';
import Section from '../ui/Section';
import WorkQueue from '../ui/WorkQueue';
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import {
  formatDate,
  formatHours,
  formatMoney,
  formatPercent,
} from '../lib/format';
import { apiGet } from '../api';

const LectureDashboard = () => {
  const navigate = useNavigate();
  document.title = 'AACMS - Lecturer Dashboard';

  const [stats, setStats] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [claimsData, setClaimsData] = useState(null);
  const [applications, setApplications] = useState([]);
  const [budgetsData, setBudgetsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);

        const [statsRes, sessionsRes, claimsRes, appsRes, budgetsRes] =
          await Promise.all([
            apiGet('/lecturer/dashboard_statistics'),
            apiGet('/lecturer/sessions'),
            apiGet('/lecturer/claims'),
            apiGet('/lecturer/applications'),
            apiGet('/lecturer/budgets'),
          ]);

        if (cancelled) return;

        setStats(statsRes?.stats || null);
        setSessions(Array.isArray(sessionsRes) ? sessionsRes : []);
        setClaimsData(claimsRes || null);
        setApplications(
          Array.isArray(appsRes?.rows)
            ? appsRes.rows
            : Array.isArray(appsRes)
              ? appsRes
              : []
        );
        setBudgetsData(budgetsRes || null);
        setError('');
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

  // Budget utilisation
  const budgetStats = budgetsData?.stats || {};
  const budgets = budgetsData?.budgets || [];
  const allocated = budgetStats.total_allocated ?? 0;
  const used = budgetStats.total_used ?? 0;
  const remaining = budgetStats.total_remaining ?? 0;
  const utilisationPct =
    allocated > 0 ? Math.min((used / allocated) * 100, 100) : 0;

  // Claims summary
  const claimsStats = claimsData?.stats || {};
  const totalClaims = Number(claimsStats.total_claims ?? 0);
  const verifiedClaims = Number(claimsStats.total_verified ?? 0);
  const pendingClaimsOnly = Number(claimsStats.total_pending ?? 0);
  const underReviewClaims = Number(claimsStats.total_under_review ?? 0);
  // Anything outside the three tracked statuses (for example lecturer
  // approved or rejected claims) is grouped as unknown.
  const unknownClaims = Math.max(
    totalClaims - verifiedClaims - pendingClaimsOnly - underReviewClaims,
    0
  );
  const pendingClaims = pendingClaimsOnly + underReviewClaims;

  const claimSegments = [
    { key: 'verified', label: 'Verified', value: verifiedClaims, color: '#5A3280' },
    { key: 'pending', label: 'Pending', value: pendingClaimsOnly, color: '#6C3D91' },
    { key: 'under-review', label: 'Under review', value: underReviewClaims, color: '#8B5FA8' },
    { key: 'unknown', label: 'Unknown', value: unknownClaims, color: '#D9C9E6', striped: true },
  ];

  // Weekly applications received, with the still-pending portion highlighted.
  // Buckets run Monday to Sunday for the last eight weeks.
  const weeklyApplications = useMemo(() => {
    const WEEK_COUNT = 8;

    const startOfWeek = (value) => {
      const date = new Date(value);
      const offset = (date.getDay() + 6) % 7; // Monday = 0
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - offset);
      return date;
    };

    const weekKey = (date) =>
      `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

    const currentWeek = startOfWeek(new Date());
    const weeks = [];

    for (let index = WEEK_COUNT - 1; index >= 0; index -= 1) {
      const start = new Date(currentWeek);
      start.setDate(start.getDate() - index * 7);
      weeks.push({
        key: weekKey(start),
        start,
        total: 0,
        pending: 0,
      });
    }

    const buckets = new Map(weeks.map((week) => [week.key, week]));

    applications.forEach((application) => {
      const submitted =
        application.DateSubmitted ??
        application.date_submitted ??
        application.SubmissionDate;
      if (!submitted) return;

      const date = new Date(submitted);
      if (Number.isNaN(date.getTime())) return;

      const bucket = buckets.get(weekKey(startOfWeek(date)));
      if (!bucket) return;

      bucket.total += 1;
      if (String(application.ApplicationStatus ?? '').trim() === 'Pending') {
        bucket.pending += 1;
      }
    });

    return weeks.map((week) => ({
      key: week.key,
      label: String(week.start.getDate()),
      title: `Week of ${week.start.toLocaleDateString(undefined, {
        day: 'numeric',
        month: 'short',
      })}: ${week.pending} of ${week.total} applications pending`,
      total: week.total,
      value: week.pending,
    }));
  }, [applications]);

  const applicationsThisPeriod = weeklyApplications.reduce(
    (sum, week) => sum + week.total,
    0
  );
  const pendingThisPeriod = weeklyApplications.reduce(
    (sum, week) => sum + week.value,
    0
  );

  // Work sessions awaiting verification, grouped by module
  const pendingSessions = sessions.filter((session) => {
    const approval =
      session.LecturerApproval ?? session.lecturer_approval;
    return !(approval === true || approval === 'true' || approval === 1);
  });

  const sessionModules = (() => {
    const groups = new Map();

    pendingSessions.forEach((session) => {
      const code = String(
        session.ModuleCode ?? session.module_code ?? 'Unknown'
      ).trim();

      const hours = Number(
        session.TotalHoursWorked ??
          session.total_hours_worked ??
          session.Hours ??
          session.hours ??
          0
      );

      const group = groups.get(code) ?? { code, hours: 0, count: 0 };
      group.hours += Number.isFinite(hours) ? hours : 0;
      group.count += 1;
      groups.set(code, group);
    });

    return Array.from(groups.values()).sort(
      (a, b) => b.hours - a.hours || a.code.localeCompare(b.code)
    );
  })();

  const attentionItems = [
    {
      label: 'Applications awaiting a decision',
      count: Number(stats?.pending_applications ?? 0),
      to: '/review-applications',
      cta: 'Review applications',
    },
    {
      label: 'Claims awaiting verification',
      count: pendingClaims,
      to: '/review-claims',
      cta: 'Review claims',
    },
    {
      label: 'Work sessions awaiting verification',
      count: pendingSessions.length,
      to: '/verify-hours',
      cta: 'Verify hours',
    },
  ].filter((item) => item.count > 0);

  return (
    <div className="p-4 md:p-8">
      <PageHeader
        title="Lecturer Dashboard"
        description="Your application reviews, claim verifications, and assistant budget in one place."
      />

      {error && (
        <p className="mb-6 text-sm text-error font-inter">
          Could not load dashboard data: {error}
        </p>
      )}

      {/* Work queue */}
      <Section
        title="Needs your attention"
        description="Reviews and verifications waiting on you."
      >
        <WorkQueue
          items={attentionItems}
          loading={loading}
          emptyDescription="No applications, claims, or work sessions are awaiting review."
        />
      </Section>

      {/* Overview */}
      <Section title="Overview">
        <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
          <Card className="flex h-full flex-col">
            <p className="text-xs text-neutral font-inter md:text-sm">
              Pending applications
            </p>

            <p className="mt-1 whitespace-nowrap text-2xl font-bold text-primary-dark font-poppins md:text-3xl">
              {loading ? '—' : (stats?.pending_applications ?? 0)}
            </p>

            {loading ? (
              <p className="flex flex-1 items-center justify-center py-4 text-neutral font-inter">
                Loading…
              </p>
            ) : (
              <div className="mt-3 flex flex-1 flex-col justify-end">
                <ColumnChart
                  data={weeklyApplications}
                  height={80}
                  ariaLabel={`Pending applications per week over the last 8 weeks: ${pendingThisPeriod} pending of ${applicationsThisPeriod} received`}
                />

                <p className="mt-2 text-[10px] leading-tight text-neutral font-inter">
                  Last 8 weeks ·{' '}
                  <span className="font-semibold text-primary-dark">
                    {pendingThisPeriod}
                  </span>{' '}
                  pending of {applicationsThisPeriod} received
                </p>
              </div>
            )}
          </Card>

          <Card className="flex h-full flex-col justify-between">
            <div>
              <p className="text-xs text-neutral font-inter md:text-sm">
                Work sessions to verify
              </p>

              <p className="mt-1 whitespace-nowrap text-2xl font-bold text-primary-dark font-poppins md:text-3xl">
                {loading ? '—' : pendingSessions.length}
              </p>
            </div>

            {loading ? (
              <p className="flex flex-1 items-center justify-center py-4 text-neutral font-inter">
                Loading…
              </p>
            ) : sessionModules.length === 0 ? (
              <p className="py-2 text-xs text-neutral font-inter">
                Nothing waiting for verification.
              </p>
            ) : (
              <div className="mt-3 flex flex-1 flex-col justify-center gap-2">
                {sessionModules.map((module) => (
                  <div
                    key={module.code}
                    className="border-b border-border-subtle pb-2 last:border-0 last:pb-0"
                  >
                    <p className="truncate text-xs font-semibold text-dark font-inter">
                      {module.code}
                    </p>

                    <div className="mt-0.5 flex items-baseline justify-end gap-1 whitespace-nowrap text-[10px] text-neutral font-inter">
                      <span className="w-9 shrink-0 text-right font-semibold text-primary-dark tabular-nums">
                        {formatHours(
                          module.hours,
                          Number.isInteger(module.hours) ? 0 : 1
                        )}
                      </span>

                      <span
                        aria-hidden="true"
                        className="w-2 shrink-0 text-center text-neutral"
                      >
                        →
                      </span>

                      <span className="w-14 shrink-0 whitespace-nowrap">
                        {module.count} session
                        {module.count === 1 ? '' : 's'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/verify-hours')}
              className="mt-3 self-start px-2"
            >
              Verify hours →
            </Button>
          </Card>

          <Card className="flex h-full flex-col">
            <p className="text-xs text-neutral font-inter md:text-sm">
              Budget by module
            </p>

            {loading ? (
              <p className="flex flex-1 items-center justify-center py-4 text-neutral font-inter">
                Loading…
              </p>
            ) : budgets.length === 0 ? (
              <p className="flex flex-1 items-center justify-center py-4 text-center text-xs text-neutral font-inter">
                No module budgets for this year.
              </p>
            ) : (
              <div className="mt-3 flex flex-1 flex-col justify-center gap-2.5">
                {budgets.map((budget) => {
                  const moduleAllocated = Number(
                    budget.allocated_budget ?? 0
                  );
                  const moduleSpent = Number(
                    budget.current_budget_usage ?? 0
                  );
                  const pct =
                    moduleAllocated > 0
                      ? Math.min((moduleSpent / moduleAllocated) * 100, 100)
                      : 0;

                  return (
                    <div
                      key={budget.budget_id}
                      title={`${budget.module_code}: ${formatMoney(moduleSpent)} of ${formatMoney(moduleAllocated)} used`}
                    >
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="truncate text-xs font-semibold text-dark font-inter">
                          {budget.module_code}
                        </span>
                        <span className="shrink-0 text-[11px] font-semibold text-primary-dark font-inter">
                          {Math.round(pct)}%
                        </span>
                      </div>

                      <div className="mt-1 h-2 w-full rounded-full bg-light-grey">
                        <div
                          className="h-2 rounded-full bg-primary"
                          style={{ width: `${pct}%` }}
                        />
                      </div>

                      <p className="mt-0.5 truncate text-[10px] text-neutral font-inter">
                        {formatMoney(moduleSpent)} of{' '}
                        {formatMoney(moduleAllocated)}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          <Card className="flex h-full flex-col">
            <p className="text-xs text-neutral font-inter md:text-sm">
              Claims summary
            </p>

            {loading ? (
              <p className="flex flex-1 items-center justify-center text-neutral font-inter">
                Loading…
              </p>
            ) : (
              <div className="mt-2 flex flex-1 flex-col items-center justify-center gap-2">
                <DonutChart
                  segments={claimSegments}
                  centerValue={totalClaims}
                  centerLabel="claims"
                  ariaLabel={`${totalClaims} claims: ${verifiedClaims} verified, ${pendingClaimsOnly} pending, ${underReviewClaims} under review, ${unknownClaims} unknown`}
                />

                <ul className="w-full space-y-0.5">
                  {claimSegments.map((segment) => (
                    <li
                      key={segment.key}
                      className="flex items-center gap-1.5 text-[11px] text-neutral sm:text-xs"
                    >
                      <span
                        aria-hidden="true"
                        className="h-2.5 w-2.5 shrink-0 rounded-sm border border-border-subtle"
                        style={{
                          background: segment.striped
                            ? 'repeating-linear-gradient(45deg, #D9C9E6 0 3px, #ffffff 3px 5px)'
                            : segment.color,
                        }}
                      />
                      <span className="truncate">{segment.label}</span>
                      <span className="ml-auto font-semibold text-primary-dark">
                        {segment.value}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Card>
        </div>
      </Section>

      {/* Applications */}
      <Section
        title="Applications"
        actions={
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/review-applications')}
          >
            Review applications →
          </Button>
        }
      >
        <Card>
          {loading ? (
            <p className="py-6 text-center text-neutral font-inter">
              Loading…
            </p>
          ) : applications.length === 0 ? (
            <EmptyState
              title="No applications yet"
              description="Student applications for your modules will appear here."
            />
          ) : (
            <div className="space-y-4">
              {applications.slice(0, 4).map((app, index) => (
                <div
                  key={app.ApplicationID ?? app.application_id ?? index}
                  className="border-b border-border-subtle pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-dark font-inter">
                        {app.ModuleCode} — {app.Student}
                      </p>

                      <p className="mt-1 text-xs text-neutral font-inter">
                        Student #: {app.StudentNumber}
                      </p>

                      <p className="mt-1 text-xs text-neutral font-inter">
                        Submitted: {formatDate(app.DateSubmitted)}
                      </p>
                    </div>

                    <StatusBadge status={app.ApplicationStatus} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </Section>

      {/* Work sessions */}
      <Section
        title="Work sessions"
        description="Sessions waiting for your verification."
        actions={
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/verify-hours')}
          >
            Verify hours →
          </Button>
        }
      >
        <Card>
          {loading ? (
            <p className="py-6 text-center text-neutral font-inter">
              Loading…
            </p>
          ) : pendingSessions.length === 0 ? (
            <EmptyState
              title="No work sessions awaiting verification"
              description="Sessions submitted by your assistants will appear here."
            />
          ) : (
            <div className="space-y-4">
              {pendingSessions.slice(0, 5).map((session, index) => (
                <div
                  key={session.SessionID ?? session.session_id ?? index}
                  className="border-b border-border-subtle pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-dark font-inter">
                        {session.StudentName ??
                          session.student_name ??
                          session.Student ??
                          session.student ??
                          '—'}
                      </p>

                      <p className="mt-1 text-xs text-neutral font-inter">
                        {session.ModuleCode ?? session.module_code ?? ''}
                      </p>

                      {(session.SessionDate ??
                        session.session_date ??
                        session.Date ??
                        session.date) && (
                        <p className="mt-1 text-xs text-neutral font-inter">
                          {formatDate(
                            session.SessionDate ??
                              session.session_date ??
                              session.Date ??
                              session.date
                          )}
                        </p>
                      )}
                    </div>

                    <span className="shrink-0 text-sm font-semibold text-primary-dark font-inter">
                      {Number(
                        session.TotalHoursWorked ??
                          session.total_hours_worked ??
                          session.Hours ??
                          session.hours ??
                          0
                      )}{' '}
                      hrs
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </Section>

      {/* Budget utilisation */}
      <Section
        title="Budget utilisation"
        description="Budget allocated for your assistant appointments and how much has been used."
        actions={
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/lecturer-budgets')}
          >
            View budgets →
          </Button>
        }
      >
        <Card>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <div className="rounded-xl bg-surface-muted p-4">
              <p className="text-xs text-neutral md:text-sm">Allocated budget</p>
              <p className="mt-2 text-lg font-bold text-primary-dark md:text-xl">
                {loading ? '—' : formatMoney(allocated)}
              </p>
            </div>

            <div className="rounded-xl bg-surface-muted p-4">
              <p className="text-xs text-neutral md:text-sm">Amount used</p>
              <p className="mt-2 text-lg font-bold text-primary-dark md:text-xl">
                {loading ? '—' : formatMoney(used)}
              </p>
            </div>

            <div className="rounded-xl bg-surface-muted p-4">
              <p className="text-xs text-neutral md:text-sm">Remaining budget</p>
              <p className="mt-2 text-lg font-bold text-primary-dark md:text-xl">
                {loading ? '—' : formatMoney(remaining)}
              </p>
            </div>

            <div className="rounded-xl bg-surface-muted p-4">
              <p className="text-xs text-neutral md:text-sm">Utilisation</p>
              <p className="mt-2 text-lg font-bold text-primary-dark md:text-xl">
                {loading ? '—' : formatPercent(utilisationPct)}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-dark">Budget used</span>
              <span className="text-sm font-medium text-dark">
                {loading ? '—' : formatPercent(utilisationPct)}
              </span>
            </div>

            <div className="h-3 w-full rounded-full bg-light-grey">
              <div
                className="h-3 rounded-full bg-primary"
                style={{ width: `${utilisationPct}%` }}
              />
            </div>
          </div>

          {budgets.length > 0 && (
            <div className="mt-6 border-t border-border-subtle pt-4">
              <h3 className="mb-3 text-body font-semibold text-dark font-poppins">
                Your modules
              </h3>

              <div className="space-y-3">
                {budgets.map((budget) => (
                  <div
                    key={budget.budget_id}
                    className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold text-dark font-inter">
                        {budget.module_code}
                      </p>

                      <p className="truncate text-xs text-neutral font-inter">
                        {budget.module_description}
                      </p>
                    </div>

                    <div className="shrink-0 text-left sm:ml-4 sm:text-right">
                      <p className="font-semibold text-primary-dark font-inter">
                        {formatMoney(budget.remaining_budget)}
                      </p>

                      <p className="text-xs text-neutral font-inter">
                        of {formatMoney(budget.allocated_budget)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </Section>
    </div>
  );
};

export default LectureDashboard;
