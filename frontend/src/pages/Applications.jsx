import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import Button from '../ui/Button';
import EmptyState from '../ui/EmptyState';
import PageHeader from '../ui/PageHeader';
import { apiGet } from '../api';

const Applications = () => {
  const navigate = useNavigate();
  document.title = 'AACMS - Applications';

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
    <>

{/* Page title bar */}
          <div className="bg-primary h-16 flex items-center px-4 md:px-8">
            <h1 className="text-xl md:text-2xl font-poppins font-semibold text-white">
              Applications
            </h1>
          </div>

          <div className="p-4 md:p-8">
            <PageHeader
              title="My Applications"
              description="View and track your Assistant applications."
              actions={
                <Button onClick={() => navigate('/apply-for-assistant')}>
                  + Apply for Assistant
                </Button>
              }
            />

            {loading && (
              <Card>
                <p className="py-6 text-center text-neutral font-inter">
                  Loading applications...
                </p>
              </Card>
            )}

            {!loading && error && (
              <Card>
                <EmptyState
                  title="Could not load applications"
                  description={error}
                />
              </Card>
            )}

            {!loading && !error && applications.length === 0 && (
              <Card>
                <EmptyState
                  title="No applications yet"
                  description="Apply for an Assistant position to see it here."
                />
              </Card>
            )}

            {!loading && !error && applications.length > 0 && (
              <div className="space-y-4 md:space-y-6">
                {applications.map((application) => (
                  <Card key={application.ApplicationID}>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <h3 className="text-xl md:text-2xl font-poppins font-semibold text-dark">
                          {application.ModuleCode}
                        </h3>

                        <p className="text-base md:text-lg text-dark mt-1">
                          {application.ModuleName}
                        </p>

                        <p className="text-neutral mt-2 text-sm md:text-base break-words">
                          Application Reference:{' '}
                          {application.ApplicationReference ||
                            application.Reference ||
                            '—'}
                        </p>

                        <p className="text-sm text-neutral mt-1">
                          Submitted: {formatDate(application.DateSubmitted)}
                        </p>
                      </div>

                      <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-4">
                        <StatusBadge
                          status={application.ApplicationStatus || 'Pending'}
                        />

                        <button
                          onClick={() =>
                            navigate(
                              `/application-detail/${application.ApplicationID}`,
                              { state: { application } }
                            )
                          }
                          className="text-primary font-semibold hover:underline whitespace-nowrap"
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

    </>
  );
};

export default Applications;