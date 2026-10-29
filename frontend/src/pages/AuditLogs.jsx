import { useEffect, useMemo, useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import { apiGet } from '../api';

const ROLE_OPTIONS = ['All', 'admin', 'lecturer', 'student'];

const ACTION_BADGE_CLASSES = {
  ADMIN_LOGIN: 'bg-primary-lightest text-primary',
  ADMIN_CLAIM_APPROVAL: 'bg-success text-white',
  ADMIN_APPOINTMENT_REVIEW: 'bg-warning text-dark',
  ADMIN_CLAIM_EXPORT: 'bg-primary text-white',
};

const HEADER_CELL =
  'px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-primary font-inter';

const BODY_CELL = 'px-3 py-1.5 align-middle';

const formatEvent = (event) => {
  if (!event || typeof event !== 'object') {
    return '—';
  }

  const parts = Object.entries(event).map(([key, value]) => {
    const rendered = Array.isArray(value)
      ? value.join(', ')
      : value && typeof value === 'object'
        ? JSON.stringify(value)
        : String(value ?? '—');

    return `${key}: ${rendered}`;
  });

  return parts.length ? parts.join(' · ') : '—';
};

const escapeCsv = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;

const downloadFile = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

const AuditLogs = () => {
  document.title = 'AACMS - Audit Logs';

  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({
    total_events: 0,
    unique_users: 0,
    admin_logins: 0,
    last_activity: null,
    log_files: 0,
  });
  const [selectedLogs, setSelectedLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('All');
  const [roleFilter, setRoleFilter] = useState('All');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
    let isMounted = true;

    apiGet('/admin/audit-logs')
      .then((result) => {
        if (!Array.isArray(result?.logs)) {
          throw new Error('The server returned an invalid audit log response.');
        }

        if (isMounted) {
          setLogs(
            result.logs.map((log, index) => ({
              ...log,
              log_key: `${log.source || 'log'}-${index}-${log.timestamp}`,
            }))
          );
          setStats(
            result.stats || {
              total_events: 0,
              unique_users: 0,
              admin_logins: 0,
              last_activity: null,
              log_files: 0,
            }
          );
        }
      })
      .catch((requestError) => {
        console.error('Error loading audit logs:', requestError);
        if (isMounted) {
          setError(requestError.message || 'Could not load audit logs.');
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const actionOptions = useMemo(() => {
    const actions = logs.map((log) => log.action).filter(Boolean);
    return [...new Set(actions)].sort();
  }, [logs]);

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch = [
        log.user_name,
        log.user_email,
        log.role,
        log.action,
        log.record_type,
        log.record_reference,
        formatEvent(log.event),
      ].some((value) =>
        String(value ?? '').toLowerCase().includes(normalizedSearch)
      );

      const logDate = String(log.timestamp || '').slice(0, 10);
      const matchesAction =
        actionFilter === 'All' || log.action === actionFilter;
      const matchesRole =
        roleFilter === 'All' || log.role === roleFilter;

      return (
        matchesSearch &&
        matchesAction &&
        matchesRole &&
        (!dateFrom || logDate >= dateFrom) &&
        (!dateTo || logDate <= dateTo)
      );
    });
  }, [logs, normalizedSearch, actionFilter, roleFilter, dateFrom, dateTo]);

  const filteredKeys = filteredLogs.map((log) => log.log_key);
  const allVisibleSelected =
    filteredKeys.length > 0 &&
    filteredKeys.every((key) => selectedLogs.includes(key));

  const toggleLog = (key) => {
    setSelectedLogs((current) =>
      current.includes(key)
        ? current.filter((logKey) => logKey !== key)
        : [...current, key]
    );
  };

  const toggleAll = () => {
    setSelectedLogs((current) => {
      if (allVisibleSelected) {
        return current.filter((key) => !filteredKeys.includes(key));
      }

      return [...new Set([...current, ...filteredKeys])];
    });
  };

  const selectedLogData = useMemo(
    () => logs.filter((log) => selectedLogs.includes(log.log_key)),
    [logs, selectedLogs]
  );

  const exportCsv = () => {
    if (!selectedLogData.length) {
      setError('Please select at least one log entry to export.');
      return;
    }

    const columns = [
      ['Timestamp', (log) => log.timestamp],
      ['User Name', (log) => log.user_name],
      ['User Email', (log) => log.user_email],
      ['Role', (log) => log.role],
      ['Action', (log) => log.action],
      ['Record Type', (log) => log.record_type],
      ['Record Reference', (log) => log.record_reference],
      ['Details', (log) => formatEvent(log.event)],
      ['Log File', (log) => log.source],
    ];

    const rows = [
      columns.map(([heading]) => escapeCsv(heading)).join(','),
      ...selectedLogData.map((log) =>
        columns.map(([, getValue]) => escapeCsv(getValue(log))).join(',')
      ),
    ];

    setError('');
    downloadFile(
      new Blob([`\uFEFF${rows.join('\r\n')}`], {
        type: 'text/csv;charset=utf-8',
      }),
      `audit-logs-${new Date().toISOString().slice(0, 10)}.csv`
    );
  };

  const formatTimestamp = (value) => {
    if (!value) {
      return '—';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleString('en-ZA', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const actionBadgeClass = (action) =>
    ACTION_BADGE_CLASSES[action] || 'bg-light-grey text-neutral';

  return (
    <div className="min-h-screen bg-off-white">
      <Navbar />

      <div className="flex">
        <Sidebar userRole="admin" />

        <main className="flex-1">
          {/* Page Header */}
          <div className="bg-primary px-8 py-4">
            <h1 className="text-2xl font-poppins font-semibold text-white">
              Audit Logs
            </h1>
          </div>

          <div className="p-8">
            {/* Page Introduction */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-primary font-poppins">
                System Activity
              </h2>

              <p className="mt-2 text-neutral font-inter">
                Review the audit trail written by the backend, including
                administrator sign-ins, appointment decisions, claim approvals
                and payment exports.
              </p>
            </div>

            {/* KPI Cards */}
            <section className="mb-8">
              <h3 className="mb-4 text-xl font-semibold text-primary font-poppins">
                Log Summary
              </h3>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <p className="font-medium text-neutral font-inter">
                    Total Events
                  </p>

                  <p className="mt-3 text-3xl font-bold text-primary font-poppins">
                    {stats.total_events}
                  </p>

                  <p className="mt-1 text-sm text-neutral font-inter">
                    Across {stats.log_files} log file
                    {stats.log_files === 1 ? '' : 's'}
                  </p>
                </Card>

                <Card>
                  <p className="font-medium text-neutral font-inter">
                    Unique Users
                  </p>

                  <p className="mt-3 text-3xl font-bold text-primary font-poppins">
                    {stats.unique_users}
                  </p>

                  <p className="mt-1 text-sm text-neutral font-inter">
                    Distinct users recorded
                  </p>
                </Card>

                <Card>
                  <p className="font-medium text-neutral font-inter">
                    Admin Logins
                  </p>

                  <p className="mt-3 text-3xl font-bold text-primary font-poppins">
                    {stats.admin_logins}
                  </p>

                  <p className="mt-1 text-sm text-neutral font-inter">
                    Successful admin sign-ins
                  </p>
                </Card>

                <Card>
                  <p className="font-medium text-neutral font-inter">
                    Last Activity
                  </p>

                  <p className="mt-3 text-xl font-bold text-primary font-poppins">
                    {formatTimestamp(stats.last_activity)}
                  </p>

                  <p className="mt-1 text-sm text-neutral font-inter">
                    Most recent logged event
                  </p>
                </Card>
              </div>
            </section>

            {/* Filters */}
            <section className="mb-8">
              <h3 className="mb-4 text-xl font-semibold text-primary font-poppins">
                Filter Logs
              </h3>

              <Card>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                  <div className="lg:col-span-2">
                    <label
                      htmlFor="audit-search"
                      className="mb-2 block text-sm font-medium text-neutral font-inter"
                    >
                      Search
                    </label>

                    <input
                      id="audit-search"
                      type="text"
                      value={searchTerm}
                      onChange={(event) =>
                        setSearchTerm(event.target.value)
                      }
                      placeholder="User, action, record or details"
                      className="h-11 w-full rounded-xl border border-neutral px-4 font-inter focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="audit-action-filter"
                      className="mb-2 block text-sm font-medium text-neutral font-inter"
                    >
                      Action
                    </label>

                    <select
                      id="audit-action-filter"
                      value={actionFilter}
                      onChange={(event) =>
                        setActionFilter(event.target.value)
                      }
                      className="h-11 w-full rounded-xl border border-neutral px-4 font-inter focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25"
                    >
                      <option value="All">All Actions</option>
                      {actionOptions.map((action) => (
                        <option key={action} value={action}>
                          {action}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="audit-role-filter"
                      className="mb-2 block text-sm font-medium text-neutral font-inter"
                    >
                      Role
                    </label>

                    <select
                      id="audit-role-filter"
                      value={roleFilter}
                      onChange={(event) =>
                        setRoleFilter(event.target.value)
                      }
                      className="h-11 w-full rounded-xl border border-neutral px-4 font-inter focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25"
                    >
                      {ROLE_OPTIONS.map((role) => (
                        <option key={role} value={role}>
                          {role === 'All' ? 'All Roles' : role}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="audit-date-from"
                      className="mb-2 block text-sm font-medium text-neutral font-inter"
                    >
                      Date From
                    </label>

                    <input
                      id="audit-date-from"
                      type="date"
                      value={dateFrom}
                      onChange={(event) =>
                        setDateFrom(event.target.value)
                      }
                      className="h-11 w-full rounded-xl border border-neutral px-4 font-inter focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="audit-date-to"
                      className="mb-2 block text-sm font-medium text-neutral font-inter"
                    >
                      Date To
                    </label>

                    <input
                      id="audit-date-to"
                      type="date"
                      value={dateTo}
                      onChange={(event) => setDateTo(event.target.value)}
                      className="h-11 w-full rounded-xl border border-neutral px-4 font-inter focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25"
                    />
                  </div>

                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => {
                        setSearchTerm('');
                        setActionFilter('All');
                        setRoleFilter('All');
                        setDateFrom('');
                        setDateTo('');
                      }}
                      className="h-11 w-full rounded-xl border-2 border-primary px-4 font-semibold text-primary transition hover:bg-primary-lightest font-inter"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              </Card>
            </section>

            {/* Log Table */}
            <section className="mb-8">
              <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-primary font-poppins">
                    Log Entries
                  </h3>

                  <span className="text-sm text-neutral font-inter">
                    {filteredLogs.length} of {logs.length} entries ·{' '}
                    {selectedLogs.length} selected
                  </span>
                </div>

                <button
                  type="button"
                  onClick={exportCsv}
                  disabled={loading || selectedLogs.length === 0}
                  className="rounded-xl bg-primary px-6 py-3 font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50 font-inter"
                >
                  Export CSV
                </button>
              </div>

              <Card>
                <div className="overflow-x-auto">
                  {loading ? (
                    <div className="px-6 py-10 text-center">
                      <p className="text-neutral font-inter">
                        Loading audit logs...
                      </p>
                    </div>
                  ) : error && logs.length === 0 ? (
                    <div className="px-6 py-10 text-center">
                      <h3 className="text-lg font-semibold text-dark font-poppins">
                        Unable to Load Audit Logs
                      </h3>

                      <p className="mt-2 text-sm text-neutral font-inter">
                        {error}
                      </p>
                    </div>
                  ) : (
                    <table className="w-full min-w-[980px] text-xs">
                      <thead className="bg-primary-lightest">
                        <tr>
                          <th className="w-10 px-3 py-2 text-left">
                            <input
                              type="checkbox"
                              aria-label="Select all visible log entries"
                              checked={allVisibleSelected}
                              onChange={toggleAll}
                              className="h-3.5 w-3.5 accent-primary"
                            />
                          </th>

                          <th className={HEADER_CELL}>Timestamp</th>
                          <th className={HEADER_CELL}>User</th>
                          <th className={HEADER_CELL}>Role</th>
                          <th className={HEADER_CELL}>Action</th>
                          <th className={HEADER_CELL}>Record</th>
                          <th className={HEADER_CELL}>Details</th>
                        </tr>
                      </thead>

                      <tbody>
                        {filteredLogs.map((log) => {
                          const userLabel =
                            [log.user_name, log.user_email]
                              .filter(Boolean)
                              .join(' · ') || 'Unknown user';
                          const recordLabel =
                            [log.record_type, log.record_reference]
                              .filter(Boolean)
                              .join(' · ') || '—';
                          const eventLabel = formatEvent(log.event);

                          return (
                            <tr
                              key={log.log_key}
                              className="border-t border-neutral/20 transition-colors odd:bg-white even:bg-off-white/70 hover:bg-primary-lightest/40"
                            >
                              <td className={BODY_CELL}>
                                <input
                                  type="checkbox"
                                  aria-label={`Select log entry ${log.action} at ${log.timestamp}`}
                                  checked={selectedLogs.includes(log.log_key)}
                                  onChange={() => toggleLog(log.log_key)}
                                  className="h-3.5 w-3.5 accent-primary"
                                />
                              </td>

                              <td
                                className={`${BODY_CELL} whitespace-nowrap tabular-nums text-neutral font-inter`}
                              >
                                {formatTimestamp(log.timestamp)}
                              </td>

                              <td className={BODY_CELL}>
                                {log.user_name || log.user_email ? (
                                  <div
                                    className="max-w-[240px] truncate font-inter"
                                    title={userLabel}
                                  >
                                    <span className="font-semibold text-dark">
                                      {log.user_name || log.user_email}
                                    </span>

                                    {log.user_name && log.user_email && (
                                      <span className="text-neutral">
                                        {' · '}
                                        {log.user_email}
                                      </span>
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-neutral font-inter">
                                    Unknown user
                                  </span>
                                )}
                              </td>

                              <td
                                className={`${BODY_CELL} capitalize text-dark font-inter`}
                              >
                                {log.role}
                              </td>

                              <td className={BODY_CELL}>
                                <span
                                  className={`inline-block whitespace-nowrap rounded px-2 py-0.5 text-[11px] font-semibold font-inter ${actionBadgeClass(log.action)}`}
                                >
                                  {log.action}
                                </span>
                              </td>

                              <td className={BODY_CELL}>
                                <div
                                  className="max-w-[200px] truncate text-dark font-inter"
                                  title={recordLabel}
                                >
                                  {recordLabel}
                                </div>
                              </td>

                              <td className={BODY_CELL}>
                                <div
                                  className="max-w-[340px] truncate text-neutral font-inter"
                                  title={eventLabel}
                                >
                                  {eventLabel}
                                </div>
                              </td>
                            </tr>
                          );
                        })}

                        {filteredLogs.length === 0 && (
                          <tr>
                            <td
                              colSpan="7"
                              className="px-3 py-6 text-center text-xs text-neutral font-inter"
                            >
                              {logs.length === 0
                                ? 'No audit log entries have been recorded yet.'
                                : 'No log entries match your filters.'}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  )}
                </div>
              </Card>

              {error && logs.length > 0 && (
                <p role="alert" className="mt-4 text-sm text-error font-inter">
                  {error}
                </p>
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AuditLogs;
