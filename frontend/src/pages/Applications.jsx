import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import { apiGet } from '../api';

const Applications = () => {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ---- Fetch applications on mount ----
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        const data = await apiGet('/student/applications');

        // Backend returns { applications: [...] }
        const list = Array.isArray(data)
          ? data
          : data?.applications || [];

        if (!cancelled) {
          setApplications(list);
          setError('');
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  // ---- Field mapping (defensive: backend shape may vary) ----
  const mapApplication = (app) => ({
    id:
      app.application_id ??
      app.ApplicationID ??
      app.listingId ??
      app.id ??
      Math.random(),
    moduleCode:
      app.moduleCode ??
      app.module_code ??
      app.ModuleCode ??
      '—',
    moduleName:
      app.moduleName ??
      app.module_name ??
      app.ModuleName ??
      '—',
    lecturer:
      app.lecturer ??
      app.lecturerName ??
      app.LecturerName ??
      '—',
    status:
      app.status ??
      app.application_status ??
      app.verificationEligibilityStatus ??
      'Pending',
    dateSubmitted:
      app.date_submitted ??
      app.dateSubmitted ??
      app.submission_date ??
      '',
  });

  return (
    <div className="min-h-screen bg-off-white">
      {/* ===== NAVBAR ===== */}
      <Navbar />

      <div className="flex">
        {/* ===== SIDEBAR ===== */}
        <Sidebar userRole="student" />

        {/* ===== MAIN CONTENT ===== */}
        <main className="flex-1">
          {/* ===== PAGE TITLE BAR ===== */}
          <div className="bg-primary h-16 flex items-center px-8">
            <h1 className="text-3xl font-poppins font-bold text-white">
              Applications
            </h1>
          </div>

          {/* ===== PAGE CONTENT ===== */}
          <div className="p-8">
            {/* ===== PAGE INTRO ===== */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-poppins font-semibold text-primary">
                  My Applications
                </h2>

                <p className="text-neutral mt-2">
                  View and track your Assistant applications.
                </p>
              </div>

              <button
                onClick={() => navigate('/apply-for-assistant')}
                className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition"
              >
                + Apply for Assistant
              </button>
            </div>

            {/* ===== STATES ===== */}
            {loading && (
              <Card>
                <p className="py-6 text-center text-neutral font-inter">
                  Loading applications…
                </p>
              </Card>
            )}

            {!loading && error && (
              <Card>
                <div className="py-6 text-center">
                  <p className="font-semibold text-error font-inter">
                    Could not load applications
                  </p>
                  <p className="mt-1 text-sm text-neutral font-inter">
                    {error}
                  </p>
                </div>
              </Card>
            )}

            {!loading && !error && applications.length === 0 && (
              <Card>
                <div className="py-10 text-center">
                  <p className="font-medium text-dark font-inter">
                    No applications yet
                  </p>
                  <p className="mt-1 text-sm text-neutral font-inter">
                    Apply for an Assistant position to see it here.
                  </p>
                </div>
              </Card>
            )}

            {/* ===== APPLICATION CARDS ===== */}
            {!loading && !error && applications.length > 0 && (
              <div className="space-y-6">
                {applications.map((raw) => {
                  const application = mapApplication(raw);

                  return (
                    <Card key={application.id}>
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        {/* ===== APPLICATION INFORMATION ===== */}
                        <div>
                          <h3 className="text-2xl font-poppins font-semibold text-dark">
                            {application.moduleCode}
                          </h3>

                          <p className="text-lg text-dark mt-1">
                            {application.moduleName}
                          </p>

                          <p className="text-neutral mt-2">
                            Lecturer: {application.lecturer}
                          </p>

                          {application.dateSubmitted && (
                            <p className="text-sm text-neutral mt-1">
                              Submitted: {application.dateSubmitted}
                            </p>
                          )}
                        </div>

                        {/* ===== STATUS + DETAILS ===== */}
                        <div className="flex flex-col items-start md:items-end gap-4">
                          <StatusBadge status={application.status} />

                          <button
                            onClick={() =>
                              navigate(
                                `/application-detail/${application.id}`,
                                { state: { application } }
                              )
                            }
                            className="text-primary font-semibold hover:underline"
                          >
                            View Details →
                          </button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Applications;