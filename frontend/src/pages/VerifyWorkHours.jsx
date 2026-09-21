import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';

const VerifyWorkHours = () => {
  const navigate = useNavigate();

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

  const [verifiedSessions, setVerifiedSessions] = useState(
    sessions.map((session) => session.status === 'Verified')
  );

  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectBox, setShowRejectBox] = useState(false);
  const [error, setError] = useState('');

  const formatDate = (date) =>
    new Date(`${date}T00:00:00`).toLocaleDateString('en-ZA', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

  const toggleSessionVerification = (index) => {
    setVerifiedSessions((current) =>
      current.map((verified, i) => (i === index ? !verified : verified))
    );
  };

  const verifyAllSessions = () => {
    setVerifiedSessions(sessions.map(() => true));
  };

  const allSessionsVerified = verifiedSessions.every((verified) => verified);

  const handleApprove = () => {
    setError('');

    if (!allSessionsVerified) {
      setError('Please verify all work sessions before approving.');
      return;
    }

    const updatedSessions = sessions.map((session, index) => ({
      ...session,
      status: verifiedSessions[index] ? 'Verified' : session.status,
    }));

    console.log('Approved sessions:', updatedSessions);

    navigate('/lecturer-dashboard', {
      state: { updatedSessions },
    });
  };

  const handleReject = () => {
    setError('');

    if (!rejectionReason.trim()) {
      setError('Please provide a reason for rejecting these hours.');
      return;
    }

    const updatedSessions = sessions.map((session) => ({
      ...session,
      status: 'Rejected',
    }));

    console.log('Rejected sessions:', updatedSessions);

    navigate('/lecturer-dashboard', {
      state: { updatedSessions },
    });
  };

  return (
    <div className="min-h-screen bg-off-white">
      <Navbar />

      <div className="flex">
        <Sidebar userRole="lecturer" />

        <main className="flex-1">
          {/* Page Header */}
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
                Assistant.
              </p>
            </div>

            {/* Sessions */}
            <Card className="mb-6">
              <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-primary-dark">
                    Recorded Work Sessions
                  </h2>

                  <p className="mt-1 text-sm text-neutral">
                    Verify each session before approving the recorded hours.
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

              <div className="overflow-x-auto">
                <table className="w-full min-w-[850px]">
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
                        Verify
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {sessions.map((session, index) => (
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
                          <label className="flex cursor-pointer items-center gap-2">
                            <input
                              type="checkbox"
                              checked={verifiedSessions[index]}
                              onChange={() =>
                                toggleSessionVerification(index)
                              }
                              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />

                            <span className="text-sm font-medium text-gray-700">
                              {verifiedSessions[index]
                                ? 'Verified'
                                : 'Pending'}
                            </span>
                          </label>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Decision */}
            <Card>
              <div className="mb-5">
                <h2 className="text-lg font-semibold text-primary-dark">
                  Verification Decision
                </h2>

                <p className="mt-1 text-sm text-neutral">
                  Approve the recorded hours once all sessions have been
                  verified, or reject them with a reason.
                </p>
              </div>

              {error && (
                <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

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
                    onChange={(event) =>
                      setRejectionReason(event.target.value)
                    }
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
                      onClick={() => setShowRejectBox(false)}
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