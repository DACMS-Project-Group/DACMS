
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import { apiGet } from '../api';

const AppointmentApprovals = () => {
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen bg-off-white">
      <Navbar />

      <div className="flex">
        <Sidebar userRole="admin" />

        <main className="flex-1">
          <div className="bg-primary px-8 py-4">
            <h1 className="text-2xl font-semibold text-white font-poppins">
              Appointment Approvals
            </h1>
          </div>

          <div className="p-8">
            {/* Page Introduction */}
            <div className="mb-8">
              <h2 className="text-2xl font-poppins font-semibold text-primary">
                Appointment Approval
              </h2>

              <p className="mt-2 text-neutral font-inter">
                Review lecturer recommendations and approve, reject, or return
                assistant appointments for revision.
              </p>
            </div>

            {/* Appointment Summary */}
            <section className="mb-8">
              <h3 className="mb-4 text-2xl font-poppins font-semibold text-primary">
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
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-2xl font-poppins font-semibold text-primary">
                  Pending Appointment Approvals
                </h3>

                <span className="text-sm font-inter text-neutral">
                  {pendingAppointments.length} pending
                </span>
              </div>

              <Card>
                <div className="overflow-x-auto">
                  {loading ? (
                    <div className="px-6 py-10 text-center">
                      <p className="text-neutral font-inter">
                        Loading appointments...
                      </p>
                    </div>
                  ) : error ? (
                    <div className="px-6 py-10 text-center">
                      <h3 className="text-lg font-semibold text-dark font-poppins">
                        Unable to Load Appointments
                      </h3>

                      <p className="mt-2 text-sm text-neutral font-inter">
                        {error}
                      </p>
                    </div>
                  ) : pendingAppointments.length === 0 ? (
                    <div className="px-6 py-10 text-center">
                      <h3 className="text-lg font-semibold text-dark font-poppins">
                        No Pending Appointments
                      </h3>

                      <p className="mt-2 text-sm text-neutral font-inter">
                        There are currently no appointments awaiting review.
                      </p>
                    </div>
                  ) : (
                    <table className="w-full min-w-[1100px]">
                      <thead className="bg-primary-lightest">
                        <tr>
                          <th className="p-4 text-left text-sm font-semibold font-inter text-primary">
                            Reference
                          </th>

                          <th className="p-4 text-left text-sm font-semibold font-inter text-primary">
                            Student
                          </th>

                          <th className="p-4 text-left text-sm font-semibold font-inter text-primary">
                            Module
                          </th>

                          <th className="p-4 text-left text-sm font-semibold font-inter text-primary">
                            Lecturer
                          </th>

                          <th className="p-4 text-left text-sm font-semibold font-inter text-primary">
                            Date
                          </th>

                          <th className="p-4 text-left text-sm font-semibold font-inter text-primary">
                            Status
                          </th>

                          <th className="p-4 text-left text-sm font-semibold font-inter text-primary">
                            Action
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {pendingAppointments.map((appointment) => (
                          <tr
                            key={appointment.position_id}
                            className="border-t border-neutral/30 transition hover:bg-primary-lightest/30"
                          >
                            <td className="p-4 font-inter font-semibold text-dark">
                              {appointment.reference}
                            </td>

                            <td className="p-4 font-inter">
                              <p className="text-dark">
                                {appointment.student}
                              </p>

                              <p className="mt-1 text-sm text-neutral">
                                {appointment.student_number}
                              </p>
                            </td>

                            <td className="p-4 font-inter text-dark">
                              {appointment.module_code}
                            </td>

                            <td className="p-4 font-inter text-dark">
                              {appointment.lecturer}
                            </td>

                            <td className="p-4 text-sm font-inter text-neutral">
                              {formatDate(appointment.date_submitted)}
                            </td>

                            <td className="p-4">
                              <StatusBadge status={appointment.status} />
                            </td>

                            <td className="p-4">
                              <button
                                type="button"
                                onClick={() =>
                                  handleReviewAppointment(appointment)
                                }
                                className="rounded-xl bg-primary px-4 py-2 font-inter font-semibold text-white transition hover:bg-primary-dark"
                              >
                                Review
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </Card>
            </section>

            {/* Approval History */}
            <section className="mb-8">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-2xl font-poppins font-semibold text-primary">
                  Approval History
                </h3>

                <span className="text-sm font-inter text-neutral">
                  {historyAppointments.length} reviewed
                </span>
              </div>

              <Card>
                <div className="overflow-x-auto">
                  {historyAppointments.length === 0 ? (
                    <div className="px-6 py-10 text-center">
                      <h3 className="text-lg font-semibold text-dark font-poppins">
                        No Approval History
                      </h3>

                      <p className="mt-2 text-sm text-neutral font-inter">
                        No appointment decisions have been recorded yet.
                      </p>
                    </div>
                  ) : (
                    <table className="w-full min-w-[1000px]">
                      <thead className="bg-primary-lightest">
                        <tr>
                          <th className="p-4 text-left text-sm font-semibold font-inter text-primary">
                            Reference
                          </th>

                          <th className="p-4 text-left text-sm font-semibold font-inter text-primary">
                            Student
                          </th>

                          <th className="p-4 text-left text-sm font-semibold font-inter text-primary">
                            Module
                          </th>

                          <th className="p-4 text-left text-sm font-semibold font-inter text-primary">
                            Lecturer
                          </th>

                          <th className="p-4 text-left text-sm font-semibold font-inter text-primary">
                            Date
                          </th>

                          <th className="p-4 text-left text-sm font-semibold font-inter text-primary">
                            Status
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {historyAppointments.map((appointment) => (
                          <tr
                            key={appointment.position_id}
                            className="border-t border-neutral/30 transition hover:bg-primary-lightest/30"
                          >
                            <td className="p-4 font-inter font-semibold text-dark">
                              {appointment.reference}
                            </td>

                            <td className="p-4 font-inter text-dark">
                              {appointment.student}
                            </td>

                            <td className="p-4 font-inter text-dark">
                              {appointment.module_code || appointment.module}
                            </td>

                            <td className="p-4 font-inter text-dark">
                              {appointment.lecturer}
                            </td>

                            <td className="p-4 text-sm font-inter text-neutral">
                              {formatDate(appointment.date_submitted || appointment.date)}
                            </td>

                            <td className="p-4">
                              <StatusBadge status={appointment.status} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </Card>
            </section>

            {/* Appointment Management */}
            <section>
              <h3 className="mb-4 text-2xl font-poppins font-semibold text-primary">
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
        </main>
      </div>
    </div>
  );
};

export default AppointmentApprovals;
