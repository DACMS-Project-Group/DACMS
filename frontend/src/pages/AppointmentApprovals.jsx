import Button from '../ui/Button';
import DataTable from '../ui/DataTable';
import PageHeader from '../ui/PageHeader';

import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import { apiGet } from '../api';

const AppointmentApprovals = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  document.title = 'AACMS - Appointment Approvals';
  const [pendingAppointments, setPendingAppointments] = useState([]);
  const [historyAppointments, setHistoryAppointments] = useState([]);

  const [stats, setStats] = useState({
    total_pending: 0,
    total_approved: 0,
    total_rejected: 0,
    total_returned: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

  const filteredPendingAppointments = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return pendingAppointments;

    return pendingAppointments.filter((appointment) => [
      appointment.reference,
      appointment.student,
      appointment.student_number,
      appointment.module_code,
      appointment.lecturer
    ].some((value) => String(value ?? '').toLowerCase().includes(term)));
  }, [pendingAppointments, searchTerm]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await apiGet('/admin/appointments');

        setPendingAppointments(response?.pending || []);
        setHistoryAppointments(response?.history || []);

        setStats(
          response?.stats || {
            total_pending: 0,
            total_approved: 0,
            total_rejected: 0,
            total_returned: 0,
          }
        );
      } catch (err) {
        console.error('Failed to load appointments:', err);
        setError('Failed to load appointments. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) {
      return '-';
    }

    return new Date(dateString).toLocaleDateString('en-ZA', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const handleReviewAppointment = (appointment) => {
    navigate(`/appointment-review/${appointment.position_id}`, {
      state: {
        appointment,
      },
    });
  };

  const pendingColumns = [
    {
      key: 'reference',
      header: 'Reference',
      className: 'p-4 font-inter font-semibold text-dark',
    },
    {
      key: 'student',
      header: 'Student',
      className: 'p-4 font-inter',
      render: (appointment) => (
        <>
          <p className="text-dark">{appointment.student}</p>
          <p className="mt-1 text-sm text-neutral">{appointment.student_number}</p>
        </>
      ),
    },
    {
      key: 'module_code',
      header: 'Module',
      className: 'p-4 font-inter text-dark',
    },
    {
      key: 'lecturer',
      header: 'Lecturer',
      className: 'p-4 font-inter text-dark',
    },
    {
      key: 'date_submitted',
      header: 'Date',
      className: 'p-4 text-sm font-inter text-neutral',
      render: (appointment) => formatDate(appointment.date_submitted),
    },
    {
      key: 'status',
      header: 'Status',
      className: 'p-4',
      render: (appointment) => <StatusBadge status={appointment.status} />,
    },
    {
      key: 'action',
      header: 'Action',
      className: 'p-4',
      render: (appointment) => (
        <Button
          unstyled
          type="button"
          onClick={() => handleReviewAppointment(appointment)}
          className="rounded-xl bg-primary px-4 py-2 font-inter font-semibold text-white transition hover:bg-primary-dark"
        >
          Review
        </Button>
      ),
    },
  ];

  const historyColumns = [
    {
      key: 'reference',
      header: 'Reference',
      className: 'p-4 font-inter font-semibold text-dark',
    },
    {
      key: 'student',
      header: 'Student',
      className: 'p-4 font-inter text-dark',
    },
    {
      key: 'module',
      header: 'Module',
      className: 'p-4 font-inter text-dark',
      render: (appointment) => appointment.module_code || appointment.module,
    },
    {
      key: 'lecturer',
      header: 'Lecturer',
      className: 'p-4 font-inter text-dark',
    },
    {
      key: 'date',
      header: 'Date',
      className: 'p-4 text-sm font-inter text-neutral',
      render: (appointment) =>
        formatDate(appointment.date_submitted || appointment.date),
    },
    {
      key: 'status',
      header: 'Status',
      className: 'p-4',
      render: (appointment) => <StatusBadge status={appointment.status} />,
    },
  ];

  return (
    <>


          <div className="p-4 md:p-8">
            <PageHeader
              title="Appointment Approvals"
              description="Review lecturer recommendations and approve, reject, or return assistant appointments for revision."
            />

            {/* Appointment Summary */}
            <section className="mb-8">
              <h3 className="text-card mb-4 font-poppins font-semibold text-primary">
                Appointment Summary
              </h3>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <p className="font-inter font-medium text-neutral">
                    Pending Approvals
                  </p>

                  <p className="mt-3 text-3xl font-poppins font-bold text-primary">
                    {stats.total_pending}
                  </p>

                  <p className="mt-1 text-sm font-inter text-neutral">
                    Awaiting review
                  </p>
                </Card>

                <Card>
                  <p className="font-inter font-medium text-neutral">
                    Approved
                  </p>

                  <p className="mt-3 text-3xl font-poppins font-bold text-primary">
                    {stats.total_approved}
                  </p>

                  <p className="mt-1 text-sm font-inter text-neutral">
                    Appointments approved
                  </p>
                </Card>

                <Card>
                  <p className="font-inter font-medium text-neutral">
                    Rejected
                  </p>

                  <p className="mt-3 text-3xl font-poppins font-bold text-primary">
                    {stats.total_rejected}
                  </p>

                  <p className="mt-1 text-sm font-inter text-neutral">
                    Appointments rejected
                  </p>
                </Card>

                <Card>
                  <p className="font-inter font-medium text-neutral">
                    Returned
                  </p>

                  <p className="mt-3 text-3xl font-poppins font-bold text-primary">
                    {stats.total_returned}
                  </p>

                  <p className="mt-1 text-sm font-inter text-neutral">
                    Requiring revision
                  </p>
                </Card>
              </div>
            </section>

            {/* Pending Appointments */}
            <section className="mb-8">
              <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h3 className="text-card font-poppins font-semibold text-primary">
                    Pending Appointment Approvals
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search reference, student, module…"
                    className="h-10 w-full rounded border border-neutral px-3 text-sm focus:border-primary focus:outline-none sm:w-64"
                  />
                  <span className="whitespace-nowrap text-sm font-inter text-neutral">
                    {filteredPendingAppointments.length} pending
                  </span>
                </div>
              </div>

              <Card>
                <DataTable
                  columns={pendingColumns}
                  rows={filteredPendingAppointments}
                  getRowKey={(appointment) => appointment.position_id}
                  loading={loading}
                  error={error}
                  emptyTitle="No Pending Appointments"
                  emptyDescription="There are currently no appointments awaiting review."
                  minWidth="1100px"
                />
              </Card>
            </section>

            {/* Approval History */}
            <section className="mb-8">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-card font-poppins font-semibold text-primary">
                  Approval History
                </h3>

                <span className="text-sm font-inter text-neutral">
                  {historyAppointments.length} reviewed
                </span>
              </div>

              <Card>
                <DataTable
                  columns={historyColumns}
                  rows={historyAppointments}
                  getRowKey={(appointment) => appointment.position_id}
                  emptyTitle="No Approval History"
                  emptyDescription="No appointment decisions have been recorded yet."
                  minWidth="1000px"
                />
              </Card>
            </section>

            {/* Appointment Management */}
            <section>
              <h3 className="text-card mb-4 font-poppins font-semibold text-primary">
                Appointment Management
              </h3>

              <Card>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <p className="text-sm font-inter text-neutral">
                      Student Linking
                    </p>

                    <p className="mt-1 font-inter font-semibold text-dark">
                      Approved Positions
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-inter text-neutral">
                      Responsibilities
                    </p>

                    <p className="mt-1 font-inter font-semibold text-dark">
                      Assigned by Lecturer
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-inter text-neutral">
                      Working-Hour Limit
                    </p>

                    <p className="mt-1 font-inter font-semibold text-dark">
                      Administrator Controlled
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-inter text-neutral">
                      Appointment Status
                    </p>

                    <p className="mt-1 font-inter font-semibold text-dark">
                      Updated on Decision
                    </p>
                  </div>
                </div>
              </Card>
            </section>
          </div>

    </>
  );
};

export default AppointmentApprovals;
