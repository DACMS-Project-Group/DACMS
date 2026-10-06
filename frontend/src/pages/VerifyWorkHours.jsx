import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import { apiGet } from '../api';

const VerifyWorkHours = () => {
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState('');
  const [savedMessage, setSavedMessage] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectBox, setShowRejectBox] = useState(false);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setError('');

        const data = await apiGet('/lecturer/sessions');

        const formattedSessions = data.map((session, index) => ({
          id: session.SessionID ?? session.session_id ?? index,
          sessionId: session.SessionID ?? session.session_id ?? null,
          moduleCode:
            session.ModuleCode ?? session.module_code ?? '',
          studentName:
            session.StudentName ?? session.student_name ?? '',
          studentNumber:
            session.StudentNumber ?? session.student_number ?? '',
          date:
            session.SessionDate ?? session.session_date ?? '',
          activity:
            session.ActivityDescription ??
            session.activity ??
            '',
          startTime:
            session.StartTime ?? session.start_time ?? '',
          endTime:
            session.EndTime ?? session.end_time ?? '',
          hours: Number(
            session.TotalHoursWorked ??
              session.total_hours_worked ??
              0
          ),
          status:
            session.LecturerApproval === true ||
            session.lecturer_approval === true
              ? 'Verified'
              : 'Pending',
        }));

        setSessions(formattedSessions);
      } catch (err) {
        console.error('Error fetching work sessions:', err);
        setError('Could not load work sessions.');
      }
    };

    fetchSessions();
  }, []);

  const formatDate = (date) => {
    if (!date) return '';

    return new Date(date).toLocaleDateString('en-ZA', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const flashSaved = (text) => {
    setSavedMessage(text);

    window.setTimeout(() => {
      setSavedMessage('');
    }, 2500);
  };

  const handleVerifyOne = async (id) => {
    const session = sessions.find(
      (item) => item.id === id
    );

    if (!session?.sessionId) {
      setError(
        'A session ID is missing. The work session cannot be verified.'
      );
      return;
    }

    try {
      setError('');

      const response = await fetch(
        `/api/lecturer/sessions/review/${session.sessionId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            decision: true,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          'Failed to verify the work session.'
        );
      }

      setSessions((current) =>
        current.map((item) =>
          item.id === id
            ? { ...item, status: 'Verified' }
            : item
        )
      );

      flashSaved(
        `Session #${session.sessionId} verified successfully.`
      );
    } catch (err) {
      console.error(err);
      setError(
        err.message ||
          'Failed to verify the work session.'
      );
    }
  };

  const handleUnverifyOne = (id) => {
    setSessions((current) =>
      current.map((session) =>
        session.id === id
          ? { ...session, status: 'Pending' }
          : session
      )
    );

    setError('');
  };

  const handleApprove = async () => {
    setError('');

    if (sessions.length === 0) {
      setError('There are no work sessions to approve.');
      return;
    }

    const unverifiedSessions = sessions.filter(
      (session) => session.status !== 'Verified'
    );

    if (unverifiedSessions.length > 0) {
      setError(
        'Please verify all work sessions before approving.'
      );
      return;
    }

    try {
      for (const session of sessions) {
        if (!session.sessionId) {
          throw new Error(
            'A session ID is missing. The work session cannot be approved.'
          );
        }

        const response = await fetch(
          `/api/lecturer/sessions/review/${session.sessionId}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
              decision: true,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(
            'Failed to approve one or more work sessions.'
          );
        }
      }

      flashSaved('All work hours have been approved.');
    } catch (err) {
      console.error(err);
      setError(
        err.message ||
          'Failed to approve the work hours.'
      );
    }
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      setError(
        'Please provide a reason for rejecting these hours.'
      );
      return;
    }

    setError(
      'The rejection API requires a backend-supported decision value. Please confirm the rejection value with the backend team before rejecting hours.'
    );
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
                Review and verify the working hours recorded by
                your Assistant. Changes are saved immediately.
              </p>
            </div>

            {savedMessage && (
              <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-800">
                {savedMessage}
              </div>
            )}

            {error && (
              <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <Card>
              <div className="mb-5">
                <h2 className="text-lg font-semibold text-primary-dark">
                  Recorded Work Sessions
                </h2>

                <p className="mt-1 text-sm text-neutral">
                  Review the work sessions recorded by your
                  assistants.
                </p>
              </div>

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
                    {sessions.length === 0 ? (
                      <tr>
                        <td
                          colSpan="8"
                          className="px-4 py-8 text-center text-sm text-neutral"
                        >
                          No work sessions found.
                        </td>
                      </tr>
                    ) : (
                      sessions.map((session) => (
                        <tr
                          key={session.id}
                          className="border-b border-gray-100 last:border-b-0"
                        >
                          <td className="px-4 py-4 text-sm text-gray-700">
                            {formatDate(session.date)}
                          </td>

                          <td className="px-4 py-4 text-sm text-gray-700">
                            <div>
                              <div className="font-medium">
                                {session.studentName}
                              </div>

                              {session.studentNumber && (
                                <div className="text-xs text-neutral">
                                  {session.studentNumber}
                                </div>
                              )}
                            </div>
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
                            {session.status === 'Verified' ? (
                              <button
                                type="button"
                                onClick={() =>
                                  handleUnverifyOne(session.id)
                                }
                                className="text-sm font-semibold text-neutral transition hover:text-primary-dark"
                              >
                                Unverify
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() =>
                                  handleVerifyOne(session.id)
                                }
                                className="rounded-lg border border-primary px-3 py-1.5 text-sm font-semibold text-primary transition hover:bg-purple-50"
                              >
                                Verify
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>

            <Card>
              <div className="mb-5">
                <h2 className="text-lg font-semibold text-primary-dark">
                  Verification Decision
                </h2>

                <p className="mt-1 text-sm text-neutral">
                  Approve the recorded hours once all sessions
                  have been verified, or reject them with a
                  reason.
                </p>
              </div>

              {showRejectBox && (
                <div className="mb-5">
                  <label
                    htmlFor="rejection-reason"
                    className="mb-2 block text-sm font-medium text-neutral"
                  >
                    Rejection Reason
                  </label>

                  <textarea
                    id="rejection-reason"
                    rows="4"
                    value={rejectionReason}
                    onChange={(event) => {
                      setRejectionReason(event.target.value);
                      setError('');
                    }}
                    placeholder="Explain why these recorded hours are being rejected..."
                    className="w-full rounded-lg border border-neutral bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-primary focus:ring-2 focus:ring-purple-200"
                  />
                </div>
              )}

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                {!showRejectBox && (
                  <button
                    type="button"
                    onClick={() => setShowRejectBox(true)}
                    className="rounded-lg border border-red-500 px-5 py-3 font-semibold text-red-600 transition hover:bg-red-50"
                  >
                    Reject Hours
                  </button>
                )}

                {showRejectBox && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setShowRejectBox(false);
                        setRejectionReason('');
                      }}
                      className="rounded-lg border border-gray-300 px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      onClick={handleReject}
                      className="rounded-lg bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700"
                    >
                      Confirm Rejection
                    </button>
                  </>
                )}

                {!showRejectBox && (
                  <button
                    type="button"
                    onClick={handleApprove}
                    className="rounded-lg bg-primary px-5 py-3 font-semibold text-white transition hover:bg-primary-dark"
                  >
                    Approve Hours
                  </button>
                )}
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default VerifyWorkHours;