import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import { CompactTable } from '../components/CompactTable';
import { useDensity } from '../contexts/DensityContext';
import { apiGet } from '../api';

const ACTION_BADGE_CLASSES = {
  ADMIN_LOGIN: 'bg-primary-lightest text-primary border border-primary/20',
  ADMIN_CLAIM_APPROVAL: 'bg-success text-white',
  ADMIN_APPOINTMENT_REVIEW: 'bg-warning text-dark',
  ADMIN_CLAIM_EXPORT: 'bg-primary text-white',
};

const ROLE_OPTIONS = ['All', 'admin', 'lecturer', 'student'];

const PRESETS = [
  { label: 'Last 24h', days: 1 },
  { label: 'Last 7 days', days: 7 },
  { label: 'Last 30 days', days: 30 },
  { label: 'Custom', days: null }
];

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
    minute: '2-digit'
  });
};

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

const relatedRecordRoute = (recordType, recordReference) => {
  if (!recordReference) {
    return null;
  }

  if (recordType === 'claim') {
    return `/claims-verification?search=${encodeURIComponent(recordReference)}`;
  }

  if (recordType === 'appointment') {
    return `/appointment-approvals?search=${encodeURIComponent(recordReference)}`;
  }

  return null;
};

const AuditLogs = () => {
  document.title = 'AACMS - Security Audit Logs';
  const navigate = useNavigate();
  const { density, toggle } = useDensity();

  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({
    total_events: 0,
    unique_users: 0,
    admin_logins: 0,
    bulk_exports: 0,
    off_hours_activity: 0,
    last_activity: null,
    log_files: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filter state
  const [preset, setPreset] = useState(PRESETS[1]); // Last 7 days default
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [actionFilter, setActionFilter] = useState('All');
  const [userFilter, setUserFilter] = useState('');
  const [recordTypeFilter, setRecordTypeFilter] = useState('All');
  const [recordReferenceFilter, setRecordReferenceFilter] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadLogs = async () => {
      try {
        setLoading(true);
        setError('');

        // Build ISO date range from preset / manual inputs.
        let from = dateFrom;
        let to = dateTo;

        if (preset.days !== null && !dateFrom && !dateTo) {
          const toDate = new Date();
          toDate.setUTCHours(23, 59, 59, 999);
          to = toDate.toISOString().slice(0, 10);

          const fromDate = new Date();
          fromDate.setUTCDate(fromDate.getUTCDate() - (preset.days - 1));
          fromDate.setUTCHours(0, 0, 0, 0);
          from = fromDate.toISOString().slice(0, 10);
        }

        const params = new URLSearchParams();
        if (from) params.set('from', from);
        if (to) params.set('to', to);
        if (actionFilter !== 'All') params.set('action', actionFilter);
        if (userFilter) params.set('user', userFilter);
        if (recordTypeFilter !== 'All') params.set('recordType', recordTypeFilter);
        if (recordReferenceFilter) params.set('recordReference', recordReferenceFilter);

        const response = await apiGet(`/admin/audit-logs?${params.toString()}`);

        if (!Array.isArray(response?.logs)) {
          throw new Error('The server returned an invalid audit log response.');
        }

        if (isMounted) {
          setLogs(
            response.logs.map((log) => ({
              ...log,
              id: `${log.source || 'log'}::${log.timestamp}::${log.action}`
            }))
          );
          setStats(
            response.stats || {
              total_events: 0,
              unique_users: 0,
              admin_logins: 0,
              bulk_exports: 0,
              off_hours_activity: 0,
              last_activity: null,
              log_files: 0
            }
          );
        }
      } catch (requestError) {
        console.error('Error loading audit logs:', requestError);
        if (isMounted) {
          setError(requestError.message || 'Could not load audit logs.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadLogs();

    return () => {
      isMounted = false;
    };
  }, [
    preset,
    dateFrom,
    dateTo,
    actionFilter,
    userFilter,
    recordTypeFilter,
    recordReferenceFilter
  ]);

  // Distinct actions discovered in the data, for the filter dropdown.
  const actionOptions = useMemo(() => {
    const actions = logs.map((log) => log.action).filter(Boolean);
    return [...new Set(actions)].sort();
  }, [logs]);

  const distinctUsers = useMemo(() => {
    const users = new Map();
    for (const log of logs) {
      const key = log.user_email || log.user_name || 'Unknown user';
      if (!users.has(key)) {
        users.set(key, { name: log.user_name, email: log.user_email });
      }
    }
    return Array.from(users.values());
  }, [logs]);

  const offHoursLogs = logs.filter((log) => {
    const hour = new Date(log.timestamp).getUTCHours();
    return hour < 6 || hour >= 15;
  });

  const handleExport = () => {
    if (!logs.length) {
      setError('No log entries to export.');
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
      ['Event', (log) => JSON.stringify(log.event ?? {})],
      ['Source', (log) => log.source]
    ];

    const rows = [
      columns.map(([heading]) => escapeCsv(heading)).join(','),
      ...logs.map((log) =>
        columns.map(([, getValue]) => escapeCsv(getValue(log))).join(',')
      )
    ];

    setError('');
    downloadFile(
      new Blob([`\uFEFF${rows.join('\r\n')}`], {
        type: 'text/csv;charset=utf-8'
      }),
      `audit-logs-${new Date().toISOString().slice(0, 10)}.csv`
    );
  };

  const clearFilters = () => {
    setPreset(PRESETS[1]);
    setDateFrom('');
    setDateTo('');
    setActionFilter('All');
    setUserFilter('');
    setRecordTypeFilter('All');
    setRecordReferenceFilter('');
  };

  const columns = [
    {
      key: 'timestamp',
      label: 'Timestamp',
      render: (log) => formatTimestamp(log.timestamp)
    },
    {
      key: 'user',
      label: 'User',
      render: (log) => {
        const label = [log.user_name, log.user_email]
          .filter(Boolean)
          .join(' · ') || 'Unknown user';
        return (
          <div className="max-w-[200px] truncate font-inter" title={label}>
            <span className="font-semibold text-dark">
              {log.user_name || log.user_email || 'Unknown user'}
            </span>
            {log.user_name && log.user_email && (
              <span className="ml-1 text-[10px] text-neutral">
                {log.user_email}
              </span>
            )}
          </div>
        );
      }
    },
    {
      key: 'role',
      label: 'Role',
      render: (log) => (
        <span className="capitalize text-dark font-inter">{log.role}</span>
      )
    },
    {
      key: 'action',
      label: 'Action',
      render: (log) => (
        <span
          className={`inline-block whitespace-nowrap rounded px-2 py-0.5 text-[10px] font-semibold font-inter border ${ACTION_BADGE_CLASSES[log.action] || 'bg-light-grey text-neutral border-neutral/30'}`}
        >
          {log.action}
        </span>
      )
    },
    {
      key: 'record',
      label: 'Record',
      render: (log) => {
        const type = log.record_type;
        const ref = log.record_reference;
        const label = [type, ref].filter(Boolean).join(' · ') || '—';
        const route = relatedRecordRoute(type, ref);

        return (
          <div className="max-w-[220px] truncate font-inter" title={label}>
            {route ? (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  navigate(route);
                }}
                className="flex items-center gap-1 text-primary text-[11px] font-medium underline underline-offset-2 hover:text-primary-dark"
              >
                {label}
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-3 w-3 ml-0.5"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 14 12 12 19" />
                </svg>
              </button>
            ) : (
              <span className="text-neutral">{label}</span>
            )}
          </div>
        );
      }
    },
    {
      key: 'event',
      label: 'Details',
      render: (log) => formatEvent(log.event)
    }
  ];

  const rowExpansion = (log) => (
    <div className="space-y-2">
      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">
          Event payload
        </span>
        <span className="text-[10px] text-neutral">
          {log.source}
        </span>
      </div>
      <pre className="p-2.5 text-[10px] bg-neutral/50 rounded border border-neutral/100 overflow-x-auto font-mono text-neutral max-w-full break-all whitespace-pre-wrap">
        {JSON.stringify(log.event ?? {}, null, 2)}
      </pre>
    </div>
  );

  return (
    <div className="min-h-screen bg-off-white">
      <Navbar />

      <div className="flex">
        <Sidebar userRole="admin" />

        <main className="flex-1">
          {/* Page Header */}
          <div className="bg-primary px-6 py-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h1 className="text-xl font-poppins font-semibold text-white">
                  Security Audit Logs
                </h1>
                <p className="mt-0.5 text-xs text-primary-light/80 font-inter">
                  Read-only trail of administrator actions for security review
                  and compliance.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggle}
                  className="px-3 py-1.5 rounded text-xs font-semibold bg-white/10 text-white hover:bg-white/20 transition-colors border border-white/20"
                >
                  {density === 'compact' ? 'Comfortable view' : 'Compact view'}
                </button>

                <button
                  type="button"
                  onClick={handleExport}
                  disabled={loading || logs.length === 0}
                  className="px-4 py-2 rounded bg-primary text-white text-xs font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-inter"
                >
                  Export CSV
                </button>
              </div>
            </div>
          </div>

          <div className="p-4">
            {/* Time-range presets */}
            <section className="mb-4">
              <div className="flex flex-wrap gap-2">
                {PRESETS.map((p) => {
                  const isActive = preset === p;
                  return (
                    <button
                      key={p.label}
                      onClick={() => {
                        setPreset(p);
                        if (!p.days) {
                          // Custom: enable manual date inputs
                        } else {
                          setDateFrom('');
                          setDateTo('');
                        }
                      }}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                        isActive
                          ? 'bg-primary text-white border-primary'
                          : 'bg-white text-neutral border-neutral/30 hover:bg-primary-lightest'
                      }`}
                    >
                      {p.label}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Custom date + facet filters */}
            <section className="mb-6">
              <Card className="p-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
                  <div className="sm:col-span-2 lg:col-span-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-semibold text-neutral mb-1 uppercase">
                          From
                        </label>
                        <input
                          type="date"
                          value={dateFrom}
                          onChange={(e) => {
                            setDateFrom(e.target.value);
                            setPreset(PRESETS[3]); // Custom
                          }}
                          className="h-9 w-full rounded border border-neutral bg-white text-xs px-2 focus:border-primary focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-neutral mb-1 uppercase">
                          To
                        </label>
                        <input
                          type="date"
                          value={dateTo}
                          onChange={(e) => {
                            setDateTo(e.target.value);
                            setPreset(PRESETS[3]); // Custom
                          }}
                          className="h-9 w-full rounded border border-neutral bg-white text-xs px-2 focus:border-primary focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-neutral mb-1 uppercase">
                      Action
                    </label>
                    <select
                      value={actionFilter}
                      onChange={(e) => setActionFilter(e.target.value)}
                      className="h-9 w-full rounded border border-neutral bg-white text-xs px-2 focus:border-primary focus:outline-none"
                    >
                      <option value="All">All actions</option>
                      {actionOptions.map((action) => (
                        <option key={action} value={action}>
                          {action}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-neutral mb-1 uppercase">
                      User
                    </label>
                    <select
                      value={userFilter}
                      onChange={(e) => setUserFilter(e.target.value)}
                      className="h-9 w-full rounded border border-neutral bg-white text-xs px-2 focus:border-primary focus:outline-none"
                    >
                      <option value="">All users</option>
                      {distinctUsers.map(({ name, email }, i) => {
                        const label = email || name || 'Unknown user';
                        return (
                          <option key={`${label}-${i}`} value={label}>
                            {label}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-neutral mb-1 uppercase">
                      Record type
                    </label>
                    <select
                      value={recordTypeFilter}
                      onChange={(e) => setRecordTypeFilter(e.target.value)}
                      className="h-9 w-full rounded border border-neutral bg-white text-xs px-2 focus:border-primary focus:outline-none"
                    >
                      <option value="All">All types</option>
                      <option value="claim">Claim</option>
                      <option value="appointment">Appointment</option>
                      <option value="claim_export">Claim export</option>
                      <option value="account">Account</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-neutral mb-1 uppercase">
                      Record reference
                    </label>
                    <input
                      type="text"
                      value={recordReferenceFilter}
                      onChange={(e) => setRecordReferenceFilter(e.target.value)}
                      placeholder="Claim no. / reference"
                      className="h-9 w-full rounded border border-neutral bg-white text-xs px-2 focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="w-full h-9 rounded border-2 border-primary text-primary text-xs font-semibold hover:bg-primary-lightest transition-colors font-inter"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </Card>
            </section>

            {/* Security summary cards */}
            <section className="mb-6">
              <h2 className="mb-3 text-xs font-poppins font-semibold text-primary uppercase tracking-wider">
                Security summary
              </h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <p className="text-[10px] font-medium text-neutral mb-1">
                    Total events
                  </p>
                  <p className="text-xl font-poppins font-bold text-dark">
                    {stats.total_events}
                  </p>
                  <p className="mt-1 text-[10px] text-neutral">
                    Across {stats.log_files} log file
                    {stats.log_files === 1 ? '' : 's'}
                  </p>
                </Card>

                <Card>
                  <p className="text-[10px] font-medium text-neutral mb-1">
                    Admin logins
                  </p>
                  <p className="text-xl font-poppins font-bold text-dark">
                    {stats.admin_logins}
                  </p>
                  <p className="mt-1 text-[10px] text-neutral">
                    Successful administrator sign-ins
                  </p>
                </Card>

                <Card>
                  <p className="text-[10px] font-medium text-neutral mb-1">
                    Bulk exports
                  </p>
                  <p className="text-xl font-poppins font-bold text-dark">
                    {stats.bulk_exports}
                  </p>
                  <p className="mt-1 text-[10px] text-neutral">
                    Claim data export events
                  </p>
                </Card>

                <Card>
                  <p className="text-[10px] font-medium text-neutral mb-1">
                    Off-hours activity
                  </p>
                  <p className="text-xl font-poppins font-bold text-dark">
                    {stats.off_hours_activity}
                  </p>
                  <p className="mt-1 text-[10px] text-neutral">
                    Events outside 08:00–17:00 SAST
                  </p>
                </Card>
              </div>
            </section>

            {/* Audit table */}
            <section>
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-xs font-poppins font-semibold text-primary uppercase tracking-wider">
                    Log entries
                  </h2>
                  <p className="text-[10px] text-neutral">
                    {logs.length} entr{'y' + (logs.length === 1 ? '' : 'ies')}
                  </p>
                </div>

                {error && (
                  <p role="alert" className="text-[10px] text-error font-inter">
                    {error}
                  </p>
                )}
              </div>

              <CompactTable
                columns={columns}
                rows={logs}
                renderRowExpansion={rowExpansion}
              />

              {loading && (
                <div className="mt-4 px-4 py-6 text-center text-[10px] text-neutral font-inter">
                  Loading audit log entries…
                </div>
              )}

              {!loading && logs.length === 0 && (
                <div className="mt-4 px-4 py-10 text-center">
                  <h3 className="text-sm font-semibold text-dark font-poppins">
                    No matching entries
                  </h3>
                  <p className="mt-1 text-[10px] text-neutral font-inter">
                    Try adjusting the time range or filters.
                  </p>
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AuditLogs;
