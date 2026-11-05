import DetailPage from '../ui/DetailPage';
import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { apiGet } from '../api';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import { formatNumber } from '../lib/format';

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

const SessionDetail = () => {
  document.title = 'AACMS - Session Detail';
  const location = useLocation();
  const { id: sessionId } = useParams();
  const positionId = location.state?.appointment?.id;
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    setLoading(true);
    setError('');
    setDetails(null);

    if (!positionId || !sessionId) {
      setError(
        'Session details are unavailable. Open this session from Work Tracking.'
      );
      setLoading(false);
      return () => {
        active = false;
      };
    }

    apiGet(`/student/positions/${positionId}/sessions/${sessionId}`)
      .then(({ session: record }) => {
        if (!active) return;

        const start = new Date(record.start_time);
        const end = new Date(record.end_time);
        const hours = Number(record.total_hours_worked ?? 0);
        const hourlyRate = Number(record.hourly_rate ?? 0);

        setDetails({
          session: {
            id: record.session_id,
            date: getLocalDate(start),
            activity: record.activity,
            startTime: getLocalTime(start),
            endTime: getLocalTime(end),
            hours,
            status: record.status,
            verificationDate: record.verification_date,
          },
          appointment: {
            id: record.position_id,
            moduleCode: record.module_code,
            moduleName: record.module_name,
            lecturer: record.lecturer_name,
            hourlyRate,
          },
          estimatedRemuneration: Number(
            record.estimated_remuneration ?? hours * hourlyRate
          ),
        });
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
  }, [positionId, sessionId]);

  const formatDate = (date) => {
    return new Date(`${date}T00:00:00`).toLocaleDateString('en-ZA', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatAmount = (amount) => {
    return `R ${amount.toLocaleString('en-ZA', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const currentSession = details?.session;
  const currentAppointment = details?.appointment;
  const estimatedRemuneration = details?.estimatedRemuneration ?? 0;

  return (
    <DetailPage
      title="Session Detail"
      description="Review the details and remuneration for this work session."
      breadcrumbs={[
        { label: 'Work Tracking', to: '/work-tracking' },
        {
          label: currentSession?.date
            ? formatDate(currentSession.date)
            : 'Session Detail',
        },
      ]}
      backTo="/work-tracking"
      backLabel="Back to Work Tracking"
      loading={loading}
      loadingMessage="Loading session details..."
      errorTitle="Could not load session"
      error={
        error ||
        (!currentSession || !currentAppointment
          ? 'Session details are unavailable.'
          : '')
      }
    >
      {currentSession && currentAppointment ? (
              <>
                {/* Session Overview */}
                <Card className="mb-6">
                  <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h2 className="text-section font-semibold text-primary-dark">
                        Work Session
                      </h2>

                      <p className="mt-1 text-sm text-neutral">
                        Details of the recorded assistant work session.
                      </p>
                    </div>

                    <StatusBadge status={currentSession.status} />
                  </div>

                  {/* Session Information */}
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <div>
                      <p className="text-sm text-neutral">Date</p>

                      <p className="mt-1 font-semibold text-dark">
                        {formatDate(currentSession.date)}
                      </p>
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm text-neutral">Activity</p>

                      <p className="mt-1 font-semibold text-dark break-words">
                        {currentSession.activity}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-neutral">Session Time</p>

                      <p className="mt-1 font-semibold text-dark whitespace-nowrap">
                        {currentSession.startTime} - {currentSession.endTime}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-neutral">Total Hours</p>

                      <p className="mt-1 font-semibold text-dark">
                        {formatNumber(currentSession.hours, 2)} hours
                      </p>
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm text-neutral">Module</p>

                      <p className="mt-1 font-semibold text-dark break-words">
                        {currentAppointment.moduleCode} -{' '}
                        {currentAppointment.moduleName}
                      </p>
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm text-neutral">Lecturer</p>

                      <p className="mt-1 font-semibold text-dark break-words">
                        {currentAppointment.lecturer}
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Remuneration Information */}
                <Card className="mb-6">
                  <div className="mb-5">
                    <h2 className="text-section font-semibold text-primary-dark">
                      Remuneration
                    </h2>

                    <p className="mt-1 text-sm text-neutral">
                      Estimated remuneration for this work session.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div>
                      <p className="text-sm text-neutral">Hours Worked</p>

                      <p className="mt-1 text-lg md:text-xl font-bold text-primary-dark">
                        {formatNumber(currentSession.hours, 2)}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-neutral">Hourly Rate</p>

                      <p className="mt-1 text-lg md:text-xl font-bold text-primary-dark">
                        {formatAmount(currentAppointment.hourlyRate)}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-neutral">
                        Estimated Remuneration
                      </p>

                      <p className="mt-1 text-lg md:text-xl font-bold text-primary-dark">
                        {formatAmount(estimatedRemuneration)}
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Verification Information */}
                <Card>
                  <div className="mb-5">
                    <h2 className="text-section font-semibold text-primary-dark">
                      Verification
                    </h2>

                    <p className="mt-1 text-sm text-neutral">
                      Review the verification status of this work session.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <p className="text-sm text-neutral">
                        Verification Status
                      </p>

                      <div className="mt-2">
                        <StatusBadge status={currentSession.status} />
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-neutral">
                        Verification Date
                      </p>

                      <p className="mt-1 font-semibold text-dark">
                        {currentSession.verificationDate
                          ? currentSession.verificationDate
                          : 'Not yet verified'}
                      </p>
                    </div>
                  </div>
                </Card>
              </>
      ) : null}
    </DetailPage>
  );
};

export default SessionDetail;