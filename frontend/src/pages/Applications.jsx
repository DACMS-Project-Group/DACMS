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

  useEffect(() => {
    let cancelled = false;

    const loadApplications = async () => {
      try {
        setLoading(true);
        setError('');

        const data = await apiGet('/student/applications');

        if (!cancelled) {
          setApplications(data?.applications || []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Failed to load applications.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadApplications();

    return () => {
      cancelled = true;
    };
  }, []);

  const formatDate = (date) => {
    if (!date) return '—';

    return new Date(date).toLocaleDateString('en-ZA', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

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

            {/* ===== LOADING STATE ===== */}
            {loading && (
              <Card>
                <p className="py-6 text-center text-neutral font-inter">
                  Loading applications...
                </p>
              </Card>
            )}

            {/* ===== ERROR STATE ===== */}
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

            {/* ===== EMPTY STATE ===== */}
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
                {applications.map((application) => (
                  <Card key={application.ApplicationID}>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      {/* ===== APPLICATION INFORMATION ===== */}
                      <div>
                        <h3 className="text-2xl font-poppins font-semibold text-dark">
                          {application.ModuleCode}
                        </h3>

                        <p className="text-lg text-dark mt-1">
                          {application.ModuleName}
                        </p>

                        <p className="text-neutral mt-2">
                          Application ID: {application.ApplicationID}
                        </p>

                        <p className="text-sm text-neutral mt-1">
                          Submitted: {formatDate(application.DateSubmitted)}
                        </p>
                      </div>

                      {/* ===== STATUS + DETAILS ===== */}
                      <div className="flex flex-col items-start md:items-end gap-4">
                        <StatusBadge
                          status={
                            application.ApplicationStatus || 'Pending'
                          }
                        />

                        <button
                          onClick={() =>
                            navigate(
                              `/application-detail/${application.ApplicationID}`,
                              {
                                state: { application },
                              }
                            )
                          }
                          className="text-primary font-semibold hover:underline"
                        >
                          View Details →
                        </button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Applications;