import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';

const VerifyWorkHours = () => {
  const [sessions, setSessions] = useState([
    {
      id: 1,
      moduleCode: 'CMPG311',
      studentName: 'Student Name',
      studentNumber: '12345678',
      date: '2026-09-02',
      activity: 'Student consultation',
      startTime: '08:00',
      endTime: '12:00',
      hours: 4,
      status: 'Verified',
    },
    {
      id: 2,
      moduleCode: 'CMPG311',
      studentName: 'Student Name',
      studentNumber: '12345678',
      date: '2026-09-05',
      activity: 'Tutorial assistance',
      startTime: '09:00',
      endTime: '13:30',
      hours: 4.5,
      status: 'Verified',
    },
    {
      id: 3,
      moduleCode: 'CMPG311',
      studentName: 'Student Name',
      studentNumber: '12345678',
      date: '2026-09-09',
      activity: 'Student consultation',
      startTime: '08:00',
      endTime: '13:00',
      hours: 5,
      status: 'Pending',
    },
    {
      id: 4,
      moduleCode: 'CMPG311',
      studentName: 'Student Name',
      studentNumber: '12345678',
      date: '2026-09-12',
      activity: 'Tutorial assistance',
      startTime: '08:00',
      endTime: '13:00',
      hours: 5,
      status: 'Pending',
    },
  ]);

  const [rejectingId, setRejectingId] = useState(null);
  const [rejectionReasons, setRejectionReasons] = useState({});
  const [error, setError] = useState('');
  const [savedMessage, setSavedMessage] = useState('');

  const formatDate = (date) =>
    new Date(`${date}T00:00:00`).toLocaleDateString('en-ZA', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

  const flashSaved = (text) => {
    setSavedMessage(text);
    window.setTimeout(() => setSavedMessage(''), 2500);
  };

  // ---- Set a single session's status and "save" it ----
  const setSessionStatus = (id, status, extra = {}) => {
    setSessions((current) =>
      current.map((session) =>
        session.id === id ? { ...session, status, ...extra } : session
      )
    );
    setError('');
    flashSaved(`Session #${id} saved as ${status}.`);
  };

  // ---- Verify all pending sessions ----
  const verifyAllSessions = () => {
    const pendingCount = sessions.filter((s) => s.status === 'Pending').length;

    if (pendingCount === 0) {
      setError('No pending sessions to verify.');
      return;
    }

    setSessions((current) =>
      current.map((session) =>
        session.status === 'Pending'
          ? { ...session, status: 'Verified' }
          : session
      )
    );
    setError('');
    flashSaved(`Verified ${pendingCount} session${pendingCount === 1 ? '' : 's'}.`);
  };

  // ---- Per-row actions ----
  const handleVerifyOne = (id) => setSessionStatus(id, 'Verified');
  const handleUnverifyOne = (id) => setSessionStatus(id, 'Pending');

  const handleStartReject = (id) => {
    setRejectingId(id);
    setError('');
  };

  const handleCancelReject = () => {
    setRejectingId(null);
  };

  const handleConfirmReject = (id) => {
    const reason = (rejectionReasons[id] || '').trim();

    if (!reason) {
      setError('Please provide a reason for rejecting this session.');
      return;
    }

    setSessionStatus(id, 'Rejected', { rejectionReason: reason });
    setRejectingId(null);
  };

  const handleReasonChange = (id, value) => {
    setRejectionReasons((current) => ({ ...current, [id]: value }));
    setError('');
  };

  return (
    <div className="min-h-screen bg-off-white">
      <Navbar />

      <div className="flex">
        <Sidebar userRole="lecturer" />

        <main className="flex-1">
          <div className="bg-primary px-8 py-4">
            <h1 className="text-2xl font-semibold text-white">
              Verify Work Hours
            </h1>
          </div>

          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-primary-dark">
                Verify Work Hours
              </h2>

              <p className="mt-2 text-neutral">
                Review and verify the working hours recorded by your
                Assistant. Changes are saved immediately.
              </p>
            </div>

            {/* Save confirmation banner */}
            {savedMessage && (
              <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-800">
                {savedMessage}
              </div>
            )}

            {/* Sessions */}
            <Card>
              <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-primary-dark">
                    Recorded Work Sessions
                  </h2>

                  <p className="mt-1 text-sm text-neutral">
                    Verify or reject sessions individually, or use Verify All
                    for pending sessions.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={verifyAllSessions}
                  className="rounded-lg border border-primary px-4 py-2 text-sm font-semibold text-primary transition hover:bg-purple-50"
                >
                  Verify All
                </button>
              </div>

              {error && (
                <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full min-w-[950px]">
                  <thead>
                    <tr className="border-b border-gray-200 bg-light-grey text-left">
                      <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                        Date
                      </th>
                      <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                        Student
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
                    {sessions.map((session) => (
                      <tr
                        key={session.id}
                        className="border-b border-gray-100 last:border-b-0"
                      >
                        <td className="px-4 py-4 text-sm text-gray-700">
                          {formatDate(session.date)}
                        </td>

                        <td className="px-4 py-4 text-sm text-gray-700">
                          {session.studentName}
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

                        <td className="px-4 py-4 text-sm font-medium text-gray-800">
                          {session.hours.toFixed(1)} hrs
                        </td>

                        <td className="px-4 py-4">
                          <StatusBadge status={session.status} />
                        </td>

                        <td className="px-4 py-4">
                          {rejectingId === session.id ? (
                            <div className="flex flex-col gap-2">
                              <textarea
                                rows="2"
                                placeholder="Reason for rejection..."
                                value={rejectionReasons[session.id] || ''}
                                onChange={(e) =>
                                  handleReasonChange(
                                    session.id,
                                    e.target.value
                                  )
                                }
                                className="w-48 rounded-lg border border-gray-300 px-3 py-2 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                              />

                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleConfirmReject(session.id)
                                  }
                                  className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
                                >
                                  Confirm
                                </button>

                                <button
                                  type="button"
                                  onClick={handleCancelReject}
                                  className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : session.status === 'Verified' ? (
                            <div className="flex flex-wrap gap-3">
                              <button
                                type="button"
                                onClick={() => handleUnverifyOne(session.id)}
                                className="text-sm font-semibold text-neutral transition hover:text-primary-dark"
                              >
                                Unverify
                              </button>

                              <button
                                type="button"
                                onClick={() => handleStartReject(session.id)}
                                className="text-sm font-semibold text-red-600 transition hover:text-red-700"
                              >
                                Reject
                              </button>
                            </div>
                          ) : session.status === 'Rejected' ? (
                            <button
                              type="button"
                              onClick={() => handleUnverifyOne(session.id)}
                              className="text-sm font-semibold text-neutral transition hover:text-primary-dark"
                            >
                              Undo
                            </button>
                          ) : (
                            <div className="flex flex-wrap gap-3">
                              <button
                                type="button"
                                onClick={() => handleVerifyOne(session.id)}
                                className="rounded-lg border border-primary px-3 py-1.5 text-sm font-semibold text-primary transition hover:bg-purple-50"
                              >
                                Verify
                              </button>

                              <button
                                type="button"
                                onClick={() => handleStartReject(session.id)}
                                className="text-sm font-semibold text-red-600 transition hover:text-red-700"
                              >
                                Reject
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default VerifyWorkHours;