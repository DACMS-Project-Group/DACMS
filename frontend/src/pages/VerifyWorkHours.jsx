import Button from '../ui/Button';
import DataTable from '../ui/DataTable';
import { useEffect, useState } from 'react';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import PageHeader from '../ui/PageHeader';
import { formatHours } from '../lib/format';
import { apiGet } from '../api';

const VerifyWorkHours = () => {
  document.title = 'AACMS - Verify Hours';
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState('');
  const [savedMessage, setSavedMessage] = useState('');

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

  const handleUnverifyOne = async (id) => {
    const session = sessions.find((item) => item.id === id);

    if (!session?.sessionId) {
      setError(
        'A session ID is missing. The work session cannot be unverified.'
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
          body: JSON.stringify({ decision: false }),
        }
      );

      if (!response.ok) {
        const result = await response.json();
        throw new Error(
          result.error || result.message || 'Failed to unverify the work session.'
        );
      }

      setSessions((current) =>
        current.map((item) =>
          item.id === id ? { ...item, status: 'Pending' } : item
        )
      );
      flashSaved(`Session #${session.sessionId} unverified successfully.`);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to unverify the work session.');
    }
  };

  const sessionColumns = [
    {
      key: 'date',
      header: 'Date',
      className: 'px-4 py-4 text-sm text-dark',
      render: (session) => formatDate(session.date),
    },
    {
      key: 'student',
      header: 'Student',
      className: 'px-4 py-4 text-sm text-dark',
      render: (session) => (
        <div>
          <div className="font-medium">{session.studentName}</div>
          {session.studentNumber && (
            <div className="text-xs text-neutral">{session.studentNumber}</div>
          )}
        </div>
      ),
    },
    {
      key: 'moduleCode',
      header: 'Module',
      className: 'px-4 py-4 text-sm font-medium text-primary-dark',
    },
    {
      key: 'activity',
      header: 'Activity',
      className: 'px-4 py-4 text-sm text-dark',
    },
    {
      key: 'time',
      header: 'Time',
      className: 'px-4 py-4 text-sm text-dark',
      render: (session) => `${session.startTime} - ${session.endTime}`,
    },
    {
      key: 'hours',
      header: 'Hours',
      className: 'px-4 py-4 text-sm font-medium text-dark',
      render: (session) => formatHours(session.hours),
    },
    {
      key: 'status',
      header: 'Status',
      className: 'px-4 py-4',
      render: (session) => <StatusBadge status={session.status} />,
    },
    {
      key: 'action',
      header: 'Action',
      className: 'px-4 py-4',
      render: (session) =>
        session.status === 'Verified' ? (
          <Button
            unstyled
            type="button"
            onClick={() => handleUnverifyOne(session.id)}
            className="text-sm font-semibold text-neutral transition hover:text-primary-dark"
          >
            Unverify
          </Button>
        ) : (
          <Button
            unstyled
            type="button"
            onClick={() => handleVerifyOne(session.id)}
            className="rounded-lg border border-primary px-3 py-1.5 text-sm font-semibold text-primary transition hover:bg-primary-lightest"
          >
            Verify
          </Button>
        ),
    },
  ];

  return (
    <>


          <div className="p-8">
            <PageHeader
              title="Verify Work Hours"
              description="Review and verify the working hours recorded by your Assistant. Changes are saved immediately."
            />

            {savedMessage && (
              <div className="mb-5 rounded-lg border border-success/30 bg-status-done-soft px-4 py-3 text-sm font-medium text-status-done">
                {savedMessage}
              </div>
            )}

            {error && (
              <div className="mb-5 rounded-lg border border-error/30 bg-status-danger-soft px-4 py-3 text-sm text-error">
                {error}
              </div>
            )}

            <Card>
              <div className="mb-5">
                <h2 className="text-section font-semibold text-primary-dark">
                  Recorded Work Sessions
                </h2>

                <p className="mt-1 text-sm text-neutral">
                  Review the work sessions recorded by your
                  assistants.
                </p>
              </div>
              <DataTable
                columns={sessionColumns}
                rows={sessions}
                getRowKey={(session) => session.id}
                emptyTitle="No work sessions found"
                minWidth="950px"
              />
            </Card>
          </div>

    </>
  );
};

export default VerifyWorkHours;