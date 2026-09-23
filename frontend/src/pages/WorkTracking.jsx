import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';

const WorkTracking = () => {
  const navigate = useNavigate();

  const [appointments] = useState([
    {
      id: 1,
      moduleCode: 'CMPG311',
      moduleName: 'Databases',
      lecturer: 'Lecturer Name',
      maxHours: 40,
      hourlyRate: 45,
    },
    {
      id: 2,
      moduleCode: 'CMPG312',
      moduleName: 'Operating Systems',
      lecturer: 'Lecturer Name',
      maxHours: 30,
      hourlyRate: 45,
    },
  ]);

  const [sessions, setSessions] = useState([
    {
      id: 1,
      appointmentId: 1,
      moduleCode: 'CMPG311',
      date: '2026-09-02',
      activity: 'Student consultation',
      startTime: '08:00',
      endTime: '12:00',
      hours: 4,
      status: 'Verified',
      verificationDate: '03 September 2026',
      lecturerComment: 'Work session verified.',
    },
    {
      id: 2,
      appointmentId: 1,
      moduleCode: 'CMPG311',
      date: '2026-09-05',
      activity: 'Tutorial assistance',
      startTime: '09:00',
      endTime: '13:30',
      hours: 4.5,
      status: 'Verified',
      verificationDate: '06 September 2026',
      lecturerComment: 'Work session verified.',
    },
    {
      id: 3,
      appointmentId: 1,
      moduleCode: 'CMPG311',
      date: '2026-09-09',
      activity: 'Student consultation',
      startTime: '08:00',
      endTime: '13:00',
      hours: 5,
      status: 'Pending',
      verificationDate: '',
      lecturerComment: '',
    },
    {
      id: 4,
      appointmentId: 1,
      moduleCode: 'CMPG311',
      date: '2026-09-12',
      activity: 'Tutorial assistance',
      startTime: '08:00',
      endTime: '13:00',
      hours: 5,
      status: 'Pending',
      verificationDate: '',
      lecturerComment: '',
    },
    {
      id: 5,
      appointmentId: 2,
      moduleCode: 'CMPG312',
      date: '2026-09-04',
      activity: 'Tutorial assistance',
      startTime: '09:00',
      endTime: '12:00',
      hours: 3,
      status: 'Verified',
      verificationDate: '05 September 2026',
      lecturerComment: 'Work session verified.',
    },
  ]);

  const [selectedAppointment, setSelectedAppointment] = useState(
    appointments[0]
  );

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    date: '',
    activity: '',
    startTime: '',
    endTime: '',
  });

  const [error, setError] = useState('');

  const activities = [
    'Tutorial assistance',
    'Student consultation',
    'Practical assistance',
    'Assignment assistance',
    'Laboratory assistance',
    'Marking / assessment assistance',
    'Administrative assistance',
    'Other',
  ];

  const getAppointmentSessions = (appointmentId) => {
    return sessions.filter(
      (session) => session.appointmentId === appointmentId
    );
  };

  const getAppointmentTotalHours = (appointmentId) => {
    return getAppointmentSessions(appointmentId).reduce(
      (total, session) => total + session.hours,
      0
    );
  };

  const calculateHours = (startTime, endTime) => {
    if (!startTime || !endTime) {
      return 0;
    }

    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);

    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;

    if (endMinutes <= startMinutes) {
      return 0;
    }

    return (endMinutes - startMinutes) / 60;
  };

  const calculatedHours = calculateHours(
    formData.startTime,
    formData.endTime
  );

  const remainingHours =
    selectedAppointment.maxHours -
    getAppointmentTotalHours(selectedAppointment.id);

  const handleAppointmentChange = (appointment) => {
    setSelectedAppointment(appointment);
    setShowForm(false);
    setError('');
    setFormData({
      date: '',
      activity: '',
      startTime: '',
      endTime: '',
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError('');
  };

  const handleRecordSession = () => {
    setError('');
    setShowForm(true);
  };

  const handleSaveSession = (event) => {
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
        `This session exceeds your remaining ${remainingHours.toFixed(
          1
        )} allowable hours for ${selectedAppointment.moduleCode}.`
      );
      return;
    }

    const newSession = {
      id: Date.now(),
      appointmentId: selectedAppointment.id,
      moduleCode: selectedAppointment.moduleCode,
      date: formData.date,
      activity: formData.activity,
      startTime: formData.startTime,
      endTime: formData.endTime,
      hours: calculatedHours,
      status: 'Pending',
      verificationDate: '',
      lecturerComment: '',
    };

    setSessions((previous) => [...previous, newSession]);

    setFormData({
      date: '',
      activity: '',
      startTime: '',
      endTime: '',
    });

    setShowForm(false);
  };

  const handleCancel = () => {
    setShowForm(false);
    setError('');
    setFormData({
      date: '',
      activity: '',
      startTime: '',
      endTime: '',
    });
  };

  const handleViewSession = (session) => {
    const appointment = appointments.find(
      (item) => item.id === session.appointmentId
    );

    navigate(`/session-detail/${session.id}`, {
      state: {
        session,
        appointment,
      },
    });
  };

  return (
    <div className="min-h-screen bg-off-white">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1">
          <div className="bg-primary px-8 py-4">
            <h1 className="text-2xl font-semibold text-white">
              Work Tracking
            </h1>
          </div>

          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-primary-dark">
                Work Tracking
              </h2>

              <p className="mt-2 text-neutral">
                Record and monitor your Assistant working hours and session
                history.
              </p>
            </div>

            <Card className="mb-6">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-primary-dark">
                  Assistant Appointments
                </h2>

                <p className="mt-1 text-sm text-neutral">
                  Select an approved Assistant appointment to view and record
                  your working hours.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {appointments.map((appointment) => {
                  const totalHours = getAppointmentTotalHours(
                    appointment.id
                  );

                  const remaining =
                    appointment.maxHours - totalHours;

                  const isSelected =
                    selectedAppointment.id === appointment.id;

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
                    onClick={handleRecordSession}
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

                {error && (
                  <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

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
                        This session will automatically be recorded under
                        this appointment.
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

                      <select
                        id="activity"
                        name="activity"
                        value={formData.activity}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      >
                        <option value="">Select an activity</option>

                        {activities.map((activity) => (
                          <option key={activity} value={activity}>
                            {activity}
                          </option>
                        ))}
                      </select>
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
                      className="rounded-lg bg-primary px-5 py-3 font-medium text-white transition hover:bg-primary-dark"
                    >
                      Save Work Session
                    </button>

                    <button
                      type="button"
                      onClick={handleCancel}
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
                <p className="text-sm text-neutral">Total Hours Worked</p>
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

              {getAppointmentSessions(selectedAppointment.id).length ===
              0 ? (
                <div className="py-10 text-center">
                  <p className="font-medium text-gray-700">
                    No Work Sessions Yet
                  </p>

                  <p className="mt-1 text-sm text-neutral">
                    Record your first work session for this appointment.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[800px]">
                    <thead>
                      <tr className="border-b border-gray-200 text-left">
                        <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                          Date
                        </th>

                        <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                          Module
                        </th>

                        <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                          Activity
                        </th>

                        <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                          Time
                        </th>

                        <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                          Hours
                        </th>

                        <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                          Status
                        </th>

                        <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                          Action
                        </th>
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
          </div>
        </main>
      </div>
    </div>
  );
};

export default WorkTracking;