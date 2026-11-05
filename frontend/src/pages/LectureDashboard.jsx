import Button from '../ui/Button';
import PageHeader from '../ui/PageHeader';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import { formatPercent } from '../lib/format';
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

  const formatAmount = (amount) =>
    `R ${Number(amount).toLocaleString('en-ZA', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const formatDate = (iso) => {
    if (!iso) return '—';
    try {
      return new Date(iso).toLocaleDateString('en-ZA', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return iso;
    }
  };

  const formatMonth = (yyyyMm) => {
    if (!yyyyMm) return '—';
    const [year, month] = yyyyMm.split('-');
    const date = new Date(Number(year), Number(month) - 1, 1);
    return date.toLocaleDateString('en-ZA', {
      month: 'long',
      year: 'numeric',
    });
  };

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

  return (
    <>

{/* Page Header */}

          {/* Page Content */}
          <div className="p-8">
            <PageHeader
              title="Lecturer Dashboard"
              description="Here's an overview of your assistant applications and activities."
            />

            {error && (
              <p className="mb-6 text-sm text-error font-inter">
                Could not load dashboard data: {error}
              </p>
            )}

            {/* Overview */}
            <div className="mb-8">
              <h2 className="text-section font-poppins font-semibold text-primary mb-4">
                Overview
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <div>
                    <p className="text-sm text-neutral">
                      Number of Applicants
                    </p>
                    <p className="mt-2 text-3xl font-bold text-primary-dark">
                      {loading ? '—' : stats?.total_applicants ?? 0}
                    </p>
                  </div>
                </Card>

                <Card>
                  <div>
                    <p className="text-sm text-neutral">Approved Demis</p>
                    <p className="mt-2 text-3xl font-bold text-primary-dark">
                      {loading ? '—' : stats?.approved_demis ?? 0}
                    </p>
                  </div>
                </Card>

                <Card>
                  <div>
                    <p className="text-sm text-neutral">
                      Pending Applications
                    </p>
                    <p className="mt-2 text-3xl font-bold text-primary-dark">
                      {loading ? '—' : stats?.pending_applications ?? 0}
                    </p>
                  </div>
                </Card>

                <Card>
                  <div>
                    <p className="text-sm text-neutral">Hours Allocated</p>
                    <p className="mt-2 text-3xl font-bold text-primary-dark">
                      {loading ? '—' : `${stats?.hours_allocated ?? 0}h`}
                    </p>
                  </div>
                </Card>
              </div>
            </div>

            {/* Claims + Applications grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Claims summary */}
              <div>
                <h2 className="text-section font-poppins font-semibold text-primary mb-4">
                  Claims Summary
                </h2>

                <Card>
                  {loading ? (
                    <p className="py-6 text-center text-neutral font-inter">
                      Loading…
                    </p>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-neutral">Total Claims</p>
                        <p className="mt-1 text-2xl font-bold text-primary-dark">
                          {claimsStats.total_claims ?? 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-neutral">Pending</p>
                        <p className="mt-1 text-2xl font-bold text-primary-dark">
                          {claimsStats.total_pending ?? 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-neutral">Under Review</p>
                        <p className="mt-1 text-2xl font-bold text-primary-dark">
                          {claimsStats.total_under_review ?? 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-neutral">Verified</p>
                        <p className="mt-1 text-2xl font-bold text-primary-dark">
                          {claimsStats.total_verified ?? 0}
                        </p>
                      </div>
                    </div>
                  )}

                  <Button unstyled
                    onClick={() => navigate('/review-claims')}
                    className="text-primary font-semibold hover:underline mt-4 font-inter"
                  >
                    Review claims →
                  </Button>
                </Card>
              </div>

              {/* Applications */}
              <div>
                <h2 className="text-section font-poppins font-semibold text-primary mb-4">
                  Applications
                </h2>

                <Card>
                  {loading ? (
                    <p className="py-6 text-center text-neutral font-inter">
                      Loading…
                    </p>
                  ) : applications.length === 0 ? (
                    <p className="py-6 text-center text-neutral font-inter">
                      No applications yet
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {applications.slice(0, 4).map((app) => (
                        <div
                          key={app.ApplicationID}
                          className="border-b border-neutral pb-4 last:border-0"
                        >
                          <div className="flex justify-between items-start gap-3">
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-dark font-inter truncate">
                                {app.ModuleCode} — {app.Student}
                              </p>
                              <p className="text-xs text-neutral mt-1 font-inter">
                                Student #: {app.StudentNumber}
                              </p>
                              <p className="text-xs text-neutral mt-1 font-inter">
                                Submitted: {formatDate(app.DateSubmitted)}
                              </p>
                            </div>
                            <StatusBadge status={app.ApplicationStatus} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <Button unstyled
                    onClick={() => navigate('/review-applications')}
                    className="text-primary font-semibold hover:underline mt-4 font-inter"
                  >
                    Review applications →
                  </Button>
                </Card>
              </div>
            </div>

            {/* Work Sessions */}
            <div className="mb-8">
              <h2 className="text-section font-poppins font-semibold text-primary mb-4">
                Work Sessions
              </h2>

              <Card>
                {loading ? (
                  <p className="py-6 text-center text-neutral font-inter">
                    Loading…
                  </p>
                ) : sessions.length === 0 ? (
                  <p className="py-6 text-center text-neutral font-inter">
                    No work sessions awaiting verification.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {sessions.slice(0, 5).map((session, index) => (
                      <div
                        key={session.SessionID ?? session.session_id ?? index}
                        className="border-b border-neutral pb-4 last:border-0"
                      >
                        <div className="flex justify-between items-start gap-3">
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-dark font-inter">
                              {session.StudentName ??
                                session.student_name ??
                                session.Student ??
                                session.student ??
                                '—'}
                            </p>
                            <p className="text-xs text-neutral mt-1 font-inter">
                              {session.ModuleCode ?? session.module_code ?? ''}
                            </p>
                            {(session.SessionDate ??
                              session.session_date ??
                              session.Date ??
                              session.date) && (
                              <p className="text-xs text-neutral mt-1 font-inter">
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
                            )} hrs
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <Button unstyled
                  onClick={() => navigate('/verify-hours')}
                  className="text-primary font-semibold hover:underline mt-4 font-inter"
                >
                  Verify hours →
                </Button>
              </Card>
            </div>

            {/* Budget Utilisation */}
            <div className="mb-8">
              <h2 className="text-section font-poppins font-semibold text-primary mb-4">
                Budget Utilisation
              </h2>

              <Card>
                <div className="mb-5">
                  <h3 className="text-card font-poppins font-semibold text-primary-dark">
                    Current Budget
                  </h3>
                  <p className="mt-1 text-sm text-neutral">
                    View the budget allocated for your assistant appointments
                    and how much has been used.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-lg bg-off-white p-5">
                    <p className="text-sm text-neutral">Allocated Budget</p>
                    <p className="mt-2 text-2xl font-bold text-primary-dark">
                      {loading ? '—' : formatAmount(allocated)}
                    </p>
                  </div>

                  <div className="rounded-lg bg-off-white p-5">
                    <p className="text-sm text-neutral">Amount Used</p>
                    <p className="mt-2 text-2xl font-bold text-primary-dark">
                      {loading ? '—' : formatAmount(used)}
                    </p>
                  </div>

                  <div className="rounded-lg bg-off-white p-5">
                    <p className="text-sm text-neutral">Remaining Budget</p>
                    <p className="mt-2 text-2xl font-bold text-primary-dark">
                      {loading ? '—' : formatAmount(remaining)}
                    </p>
                  </div>

                  <div className="rounded-lg bg-off-white p-5">
                    <p className="text-sm text-neutral">Utilisation</p>
                    <p className="mt-2 text-2xl font-bold text-primary-dark">
                      {loading ? '—' : formatPercent(utilisationPct)}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-6">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-dark">
                      Budget Used
                    </span>
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

                {/* Per-module budgets */}
                {budgets.length > 0 && (
                  <div className="mt-6 border-t border-neutral pt-4">
                    <h4 className="text-body font-semibold text-dark mb-3">
                      Your Modules
                    </h4>
                    <div className="space-y-3">
                      {budgets.map((budget) => (
                        <div
                          key={budget.budget_id}
                          className="flex justify-between items-center text-sm"
                        >
                          <div className="min-w-0">
                            <p className="font-semibold text-dark font-inter">
                              {budget.module_code}
                            </p>
                            <p className="text-xs text-neutral font-inter truncate">
                              {budget.module_description}
                            </p>
                          </div>
                          <div className="text-right shrink-0 ml-4">
                            <p className="font-semibold text-primary-dark font-inter">
                              {formatAmount(budget.remaining_budget)}
                            </p>
                            <p className="text-xs text-neutral font-inter">
                              of {formatAmount(budget.allocated_budget)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </div>

    </>
  );
};

export default LectureDashboard;