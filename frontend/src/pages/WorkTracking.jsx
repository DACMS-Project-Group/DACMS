import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiGet, apiPost } from '../api';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';

const pad = (value) => String(value).padStart(2, '0');

const getLocalDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
  ].join('-');
};

const getLocalTime = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const mapSession = (session, moduleCode) => ({
  id: session.session_id,
  appointmentId: session.position_id,
  moduleCode,
  date: getLocalDate(session.start_time),
  activity: session.activity_description,
  startTime: getLocalTime(session.start_time),
  endTime: getLocalTime(session.end_time),
  hours: Number(session.total_hours ?? 0),
  status: session.lecturer_approval ? 'Verified' : 'Pending',
  verificationDate: '',
  lecturerComment: '',
});

const WorkTracking = () => {
  document.title = 'AACMS - Work Tracking';
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    date: '',
    activity: '',
    startTime: '',
    endTime: '',
  });

  useEffect(() => {
    let active = true;

    apiGet('/student/positions')
      .then(({ positions = [] } = {}) => {
        if (!active) return;

        const mapped = positions.map((position) => ({
          id: position.PositionID,
          moduleCode: position.ModuleCode,
          moduleName: position.ModuleName,
          lecturer: `${position.LecturerFName} ${position.LecturerLName}`,
          maxHours: Number(position.TotalAllocatedHours ?? 0),
          hourlyRate: Number(position.StandardHourlyRate ?? 0),
          workedHours: Number(position.WorkedHours ?? 0),
        }));

        setAppointments(mapped);
        setSelectedAppointment(mapped[0] ?? null);
      })
      .catch((err) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    if (!selectedAppointment) {
      setSessions([]);
      setSessionsLoading(false);
      return () => {
        active = false;
      };
    }

    setSessions([]);
    setSessionsLoading(true);
    setError('');

    apiGet(`/student/positions/${selectedAppointment.id}/sessions`)
      .then(({ sessions: result = [] } = {}) => {
        if (!active) return;
        setSessions(
          result.map((session) =>
            mapSession(session, selectedAppointment.moduleCode)
          )
        );
      })
      .catch((err) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setSessionsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [selectedAppointment]);

  const getAppointmentSessions = (appointmentId) =>
    sessions.filter(
      (session) => String(session.appointmentId) === String(appointmentId)
    );

  const getAppointmentTotalHours = (appointmentId) => {
    const appointment = appointments.find(
      (item) => String(item.id) === String(appointmentId)
    );

    if (
      selectedAppointment &&
      String(selectedAppointment.id) === String(appointmentId)
    ) {
      if (sessionsLoading) return appointment?.workedHours ?? 0;

      return getAppointmentSessions(appointmentId).reduce(
        (total, session) => total + session.hours,
        0
      );
    }

    return appointment?.workedHours ?? 0;
  };

  const calculateHours = (startTime, endTime) => {
    if (!startTime || !endTime) return 0;

    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    const difference =
      endHour * 60 + endMinute - (startHour * 60 + startMinute);

    return difference > 0 ? difference / 60 : 0;
  };

  const calculatedHours = calculateHours(
    formData.startTime,
    formData.endTime
  );

  const remainingHours = selectedAppointment
    ? selectedAppointment.maxHours -
      getAppointmentTotalHours(selectedAppointment.id)
    : 0;

  const resetForm = () => {
    setFormData({
      date: '',
      activity: '',
      startTime: '',
      endTime: '',
    });
  };

  const handleAppointmentChange = (appointment) => {
    setSelectedAppointment(appointment);
    setShowForm(false);
    setError('');
    resetForm();
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
    setError('');
  };

  const handleSaveSession = async (event) => {
    event.preventDefault();
    setError('');

    if (
      !formData.date ||
      !formData.activity ||
      !formData.startTime ||
      !formData.endTime
    ) {
      setError('Please complete all fields before saving the work session.');
      return;
    }

    if (calculatedHours <= 0) {
      setError('End time must be later than the start time.');
      return;
    }

    if (calculatedHours > remainingHours) {
      setError(
        `This session exceeds your remaining ${Math.max(
          remainingHours,
          0
        ).toFixed(1)} allowable hours for ${selectedAppointment.moduleCode}.`
      );
      return;
    }

    setSaving(true);

    try {
      const { session } = await apiPost(
        `/student/positions/${selectedAppointment.id}/sessions/create`,
        formData
      );

      const savedSession = mapSession(
        session,
        selectedAppointment.moduleCode
      );

      setSessions((previous) => [...previous, savedSession]);

      const updatedWorkedHours =
        getAppointmentTotalHours(selectedAppointment.id) +
        savedSession.hours;

      const updatedAppointment = {
        ...selectedAppointment,
        workedHours: updatedWorkedHours,
      };

      setAppointments((previous) =>
        previous.map((appointment) =>
          String(appointment.id) === String(updatedAppointment.id)
            ? updatedAppointment
            : appointment
        )
      );
      setSelectedAppointment(updatedAppointment);
      setShowForm(false);
      resetForm();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleViewSession = (session) => {
    navigate(`/session-detail/${session.id}`, {
      state: { session, appointment: selectedAppointment },
    });
  };

  return (
    <div className="min-h-screen bg-off-white">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1">
          <div className="bg-primary px-8 py-4">
            <h1 className="text-2xl font-semibold text-white">Work Tracking</h1>
          </div>

          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-poppins font-semibold text-white">
                Work Tracking
              </h2>
              <p className="mt-2 text-neutral">
                Record and monitor your Assistant working hours and session
                history.
              </p>
            </div>

            {error && (
              <div
                role="alert"
                className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            {loading ? (
              <p className="py-8 text-neutral">Loading appointments...</p>
            ) : appointments.length === 0 ? (
              <p className="py-8 text-neutral">
                No active assistant appointments found.
              </p>
            ) : (
              <>
                <Card className="mb-6">
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-primary-dark">
                      Assistant Appointments
                    </h2>
                    <p className="mt-1 text-sm text-neutral">
                      Select an approved Assistant appointment to view and
                      record your working hours.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {appointments.map((appointment) => {
                      const totalHours = getAppointmentTotalHours(
                        appointment.id
                      );
                      const remaining = appointment.maxHours - totalHours;
                      const isSelected =
                        String(selectedAppointment?.id) ===
                        String(appointment.id);

                      return (
                        <button
                          key={appointment.id}
                          type="button"
                          onClick={() => handleAppointmentChange(appointment)}
                          className={`rounded-lg border p-5 text-left transition ${
                            isSelected
                              ? 'border-primary bg-purple-50'
                              : 'border-gray-200 bg-white hover:border-primary'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-primary-dark">
                                {appointment.moduleCode}
                              </h3>
                              <p className="mt-1 text-sm text-gray-700">
                                {appointment.moduleName}
                              </p>
                            </div>
                            {isSelected && (
                              <span className="text-sm font-medium text-primary">
                                Selected
                              </span>
                            )}
                          </div>

                          <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                            <div>
                              <p className="text-neutral">Worked</p>
                              <p className="mt-1 font-semibold text-gray-800">
                                {totalHours.toFixed(1)} hrs
                              </p>
                            </div>
                            <div>
                              <p className="text-neutral">Maximum</p>
                              <p className="mt-1 font-semibold text-gray-800">
                                {appointment.maxHours} hrs
                              </p>
                            </div>
                            <div>
                              <p className="text-neutral">Remaining</p>
                              <p className="mt-1 font-semibold text-gray-800">
                                {remaining.toFixed(1)} hrs
                              </p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </Card>

                {selectedAppointment && (
                  <>
                    <Card className="mb-6">
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                          <p className="text-sm text-neutral">
                            Selected Assistant Appointment
                          </p>
                          <h2 className="mt-1 text-xl font-semibold text-primary-dark">
                            {selectedAppointment.moduleCode} -{' '}
                            {selectedAppointment.moduleName}
                          </h2>
                          <p className="mt-1 text-sm text-neutral">
                            Lecturer: {selectedAppointment.lecturer}
                          </p>
                        </div>

                        {!showForm && (
                          <button
                            type="button"
                            onClick={() => {
                              setError('');
                              setShowForm(true);
                            }}
                            className="rounded-lg bg-primary px-5 py-3 font-medium text-white transition hover:bg-primary-dark"
                          >
                            Record Work Session
                          </button>
                        )}
                      </div>
                    </Card>

                    {showForm && (
                      <Card className="mb-6">
                        <div className="mb-6">
                          <h2 className="text-lg font-semibold text-primary-dark">
                            Record Work Session
                          </h2>
                          <p className="mt-1 text-sm text-neutral">
                            Enter the date and time you worked. The system will
                            calculate the total hours automatically.
                          </p>
                        </div>

                        <form onSubmit={handleSaveSession}>
                          <div className="mb-5">
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                              Assistant Appointment
                            </label>
                            <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                              <p className="font-semibold text-primary-dark">
                                {selectedAppointment.moduleCode} -{' '}
                                {selectedAppointment.moduleName}
                              </p>
                              <p className="mt-1 text-sm text-neutral">
                                This session will be recorded under this
                                appointment.
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            <div>
                              <label
                                htmlFor="date"
                                className="mb-2 block text-sm font-medium text-gray-700"
                              >
                                Date
                              </label>
                              <input
                                id="date"
                                name="date"
                                type="date"
                                value={formData.date}
                                onChange={handleChange}
                                required
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                              />
                            </div>

                            <div>
                              <label
                                htmlFor="activity"
                                className="mb-2 block text-sm font-medium text-gray-700"
                              >
                                Activity
                              </label>
                              <input
                                id="activity"
                                name="activity"
                                type="text"
                                value={formData.activity}
                                onChange={handleChange}
                                required
                                maxLength={200}
                                placeholder="Describe the work you performed"
                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                              />
                            </div>

                            <div>
                              <label
                                htmlFor="startTime"
                                className="mb-2 block text-sm font-medium text-gray-700"
                              >
                                Start Time
                              </label>
                              <input
                                id="startTime"
                                name="startTime"
                                type="time"
                                value={formData.startTime}
                                onChange={handleChange}
                                required
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                              />
                            </div>

                            <div>
                              <label
                                htmlFor="endTime"
                                className="mb-2 block text-sm font-medium text-gray-700"
                              >
                                End Time
                              </label>
                              <input
                                id="endTime"
                                name="endTime"
                                type="time"
                                value={formData.endTime}
                                onChange={handleChange}
                                required
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                              />
                            </div>
                          </div>

                          <div className="mt-6 rounded-lg bg-gray-50 p-4">
                            <p className="text-sm text-neutral">
                              Calculated Hours
                            </p>
                            <p className="mt-1 text-2xl font-semibold text-primary-dark">
                              {calculatedHours.toFixed(1)} hours
                            </p>
                            {formData.startTime && formData.endTime && (
                              <p className="mt-1 text-sm text-neutral">
                                {formData.startTime} - {formData.endTime}
                              </p>
                            )}
                          </div>

                          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                            <button
                              type="submit"
                              disabled={saving}
                              className="rounded-lg bg-primary px-5 py-3 font-medium text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {saving ? 'Saving...' : 'Save Work Session'}
                            </button>
                            <button
                              type="button"
                              disabled={saving}
                              onClick={() => {
                                setShowForm(false);
                                setError('');
                                setFormData({
                                  date: '',
                                  activity: '',
                                  startTime: '',
                                  endTime: '',
                                });
                              }}
                              className="rounded-lg border border-gray-300 px-5 py-3 font-medium text-gray-700 transition hover:bg-gray-50"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      </Card>
                    )}

                    <div className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-4">
                      <Card>
                        <p className="text-sm text-neutral">
                          Total Hours Worked
                        </p>
                        <p className="mt-2 text-2xl font-semibold text-primary-dark">
                          {getAppointmentTotalHours(
                            selectedAppointment.id
                          ).toFixed(1)}
                        </p>
                      </Card>
                      <Card>
                        <p className="text-sm text-neutral">Maximum Hours</p>
                        <p className="mt-2 text-2xl font-semibold text-primary-dark">
                          {selectedAppointment.maxHours}
                        </p>
                      </Card>
                      <Card>
                        <p className="text-sm text-neutral">Remaining Hours</p>
                        <p className="mt-2 text-2xl font-semibold text-primary-dark">
                          {Math.max(remainingHours, 0).toFixed(1)}
                        </p>
                      </Card>
                      <Card>
                        <p className="text-sm text-neutral">
                          Estimated Earnings
                        </p>
                        <p className="mt-2 text-2xl font-semibold text-primary-dark">
                          R{' '}
                          {(
                            getAppointmentTotalHours(
                              selectedAppointment.id
                            ) * selectedAppointment.hourlyRate
                          ).toFixed(2)}
                        </p>
                      </Card>
                    </div>

                    <Card>
                      <div className="mb-6">
                        <h2 className="text-lg font-semibold text-primary-dark">
                          Work Session History
                        </h2>
                        <p className="mt-1 text-sm text-neutral">
                          Work sessions recorded for{' '}
                          {selectedAppointment.moduleCode}.
                        </p>
                      </div>

                      {sessionsLoading ? (
                        <p className="py-8 text-center text-neutral">
                          Loading work sessions...
                        </p>
                      ) : getAppointmentSessions(selectedAppointment.id)
                          .length === 0 ? (
                        <div className="py-10 text-center">
                          <p className="font-medium text-gray-700">
                            No Work Sessions Yet
                          </p>
                          <p className="mt-1 text-sm text-neutral">
                            Record your first work session for this
                            appointment.
                          </p>
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full min-w-[800px]">
                            <thead>
                              <tr className="border-b border-gray-200 text-left">
                                {[
                                  'Date',
                                  'Module',
                                  'Activity',
                                  'Time',
                                  'Hours',
                                  'Status',
                                  'Action',
                                ].map((heading) => (
                                  <th
                                    key={heading}
                                    className="px-4 py-3 text-sm font-semibold text-gray-700"
                                  >
                                    {heading}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {getAppointmentSessions(
                                selectedAppointment.id
                              ).map((session) => (
                                <tr
                                  key={session.id}
                                  className="border-b border-gray-100"
                                >
                                  <td className="px-4 py-4 text-sm text-gray-700">
                                    {session.date}
                                  </td>
                                  <td className="px-4 py-4 text-sm font-medium text-primary-dark">
                                    {session.moduleCode}
                                  </td>
                                  <td className="px-4 py-4 text-sm text-gray-700">
                                    {session.activity}
                                  </td>
                                  <td className="px-4 py-4 text-sm text-gray-700">
                                    {session.startTime} - {session.endTime}
                                  </td>
                                  <td className="px-4 py-4 text-sm font-medium text-gray-700">
                                    {session.hours.toFixed(1)} hrs
                                  </td>
                                  <td className="px-4 py-4">
                                    <StatusBadge status={session.status} />
                                  </td>
                                  <td className="px-4 py-4">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleViewSession(session)
                                      }
                                      className="font-medium text-primary transition hover:text-primary-dark"
                                    >
                                      View
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </Card>
                  </>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default WorkTracking;