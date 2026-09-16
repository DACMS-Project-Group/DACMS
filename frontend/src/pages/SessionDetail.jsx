import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';

const SessionDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const session = location.state?.session;
  const appointment = location.state?.appointment;

  // Fallback data for testing the page directly
  const defaultAppointment = {
    moduleCode: 'CMPG311',
    moduleName: 'Databases',
    lecturer: 'Lecturer Name',
    hourlyRate: 45,
  };

  const defaultSession = {
    id: 1,
    date: '2026-09-02',
    activity: 'Student consultation',
    startTime: '08:00',
    endTime: '12:00',
    hours: 4,
    status: 'Verified',
    verificationDate: '03 September 2026',
    lecturerComment: 'Work session verified and approved.',
  };

  const currentAppointment = appointment || defaultAppointment;
  const currentSession = session || defaultSession;

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

  const estimatedRemuneration =
    currentSession.hours * currentAppointment.hourlyRate;

  return (
    <div className="min-h-screen bg-off-white">
      {/* Top Navigation */}
      <Navbar />

      {/* Sidebar + Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1">

          {/* Page Header */}
          <div className="bg-primary px-8 py-4">
            <h1 className="text-2xl font-semibold text-white">
              Session Detail
            </h1>
          </div>

          {/* Page Content */}
          <div className="p-8">

            {/* Back Button */}
            <div className="mb-6">
              <button
                type="button"
                onClick={() => navigate('/work-tracking')}
                className="font-medium text-primary transition hover:text-primary-dark"
              >
                ← Back to Work Tracking
              </button>
            </div>

            {/* Session Overview */}
            <Card className="mb-6">
              <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-primary-dark">
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
                  <p className="text-sm text-neutral">
                    Date
                  </p>

                  <p className="mt-1 font-semibold text-gray-800">
                    {formatDate(currentSession.date)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-neutral">
                    Activity
                  </p>

                  <p className="mt-1 font-semibold text-gray-800">
                    {currentSession.activity}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-neutral">
                    Session Time
                  </p>

                  <p className="mt-1 font-semibold text-gray-800">
                    {currentSession.startTime} - {currentSession.endTime}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-neutral">
                    Total Hours
                  </p>

                  <p className="mt-1 font-semibold text-gray-800">
                    {currentSession.hours.toFixed(2)} hours
                  </p>
                </div>

                <div>
                  <p className="text-sm text-neutral">
                    Module
                  </p>

                  <p className="mt-1 font-semibold text-gray-800">
                    {currentAppointment.moduleCode} -{' '}
                    {currentAppointment.moduleName}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-neutral">
                    Lecturer
                  </p>

                  <p className="mt-1 font-semibold text-gray-800">
                    {currentAppointment.lecturer}
                  </p>
                </div>

              </div>
            </Card>

            {/* Remuneration Information */}
            <Card className="mb-6">
              <div className="mb-5">
                <h2 className="text-lg font-semibold text-primary-dark">
                  Remuneration
                </h2>

                <p className="mt-1 text-sm text-neutral">
                  Estimated remuneration for this work session.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

                <div>
                  <p className="text-sm text-neutral">
                    Hours Worked
                  </p>

                  <p className="mt-1 text-xl font-bold text-primary-dark">
                    {currentSession.hours.toFixed(2)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-neutral">

                    Hourly Rate
                  </p>

                  <p className="mt-1 text-xl font-bold text-primary-dark">
                    {formatAmount(currentAppointment.hourlyRate)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-neutral">
                    Estimated Remuneration
                  </p>

                  <p className="mt-1 text-xl font-bold text-primary-dark">
                    {formatAmount(estimatedRemuneration)}
                  </p>
                </div>

              </div>
            </Card>

            {/* Verification Information */}
            <Card>
              <div className="mb-5">
                <h2 className="text-lg font-semibold text-primary-dark">
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

                  <p className="mt-1 font-semibold text-gray-800">
                    {currentSession.verificationDate
                      ? currentSession.verificationDate
                      : 'Not yet verified'}
                  </p>
                </div>

              </div>
            </Card>

          </div>
        </main>
      </div>
    </div>
  );
};

export default SessionDetail;