import DetailPage from '../ui/DetailPage';
import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import { apiGet } from '../api';

// ---------------------------------------------------------
// Format date
// ---------------------------------------------------------
const formatDate = (date) => {
  if (!date) return '—';

  const datePart = String(date).substring(0, 10);
  const [year, month, day] = datePart.split('-');

  if (!year || !month || !day) {
    return String(date);
  }

  return new Date(
    Number(year),
    Number(month) - 1,
    Number(day)
  ).toLocaleDateString('en-ZA', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

// ---------------------------------------------------------
// Map backend application response
// ---------------------------------------------------------
function mapApplication(app, lecturerFromPosition = '') {
  const firstName =
    app.LecturerFName ??
    app.lecturerFName ??
    '';

  const lastName =
    app.LecturerLName ??
    app.lecturerLName ??
    '';

  const lecturerName =
    app.lecturer ??
    app.lecturerName ??
    app.LecturerName ??
    lecturerFromPosition ??
    (`${firstName} ${lastName}`.trim() || '');

  const dateSubmitted =
    app.date_submitted ??
    app.dateSubmitted ??
    app.DateSubmitted ??
    app.submission_date ??
    app.SubmissionDate ??
    '';

  return {
    id:
      app.application_id ??
      app.ApplicationID ??
      app.id ??
      '',

    reference:
      app.reference ??
      app.ApplicationReference ??
      app.Reference ??
      app.application_reference ??
      '',

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

    lecturer: lecturerName || '—',

    status:
      app.status ??
      app.application_status ??
      app.ApplicationStatus ??
      app.verificationEligibilityStatus ??
      'Pending',

    dateSubmitted: formatDate(dateSubmitted),
  };
}

const ApplicationDetail = () => {
  document.title = 'AACMS - Application Detail';
  const location = useLocation();
  const { id } = useParams();

  const [application, setApplication] = useState(
    location.state?.application
      ? mapApplication(location.state.application)
      : null
  );

  const [loading, setLoading] = useState(!location.state?.application);
  const [error, setError] = useState('');

  // ---------------------------------------------------------
  // Load application and lecturer information
  // ---------------------------------------------------------
  useEffect(() => {
    let cancelled = false;

    const loadApplication = async () => {
      try {
        setLoading(true);
        setError('');

        const [applicationsData, positionsData] = await Promise.all([
          apiGet('/student/applications'),
          apiGet('/student/positions'),
        ]);

        const applications = Array.isArray(applicationsData)
          ? applicationsData
          : applicationsData?.applications || [];

        const positions = Array.isArray(positionsData)
          ? positionsData
          : positionsData?.positions || [];

        const foundApplication = applications.find((app) => {
          const applicationId =
            app.application_id ??
            app.ApplicationID ??
            app.id;

          return String(applicationId) === String(id);
        });

        const applicationSource =
          foundApplication ||
          location.state?.application;

        if (!applicationSource) {
          if (!cancelled) {
            setApplication(null);
            setError('Application not found.');
          }

          return;
        }

        const applicationId =
          applicationSource.application_id ??
          applicationSource.ApplicationID ??
          applicationSource.id ??
          id;

        const matchingPosition = positions.find((position) => {
          const positionApplicationId =
            position.application_id ??
            position.ApplicationID ??
            position.applicationId;

          return (
            String(positionApplicationId) ===
            String(applicationId)
          );
        });

        const lecturerFirstName =
          matchingPosition?.lecturer_f_name ??
          matchingPosition?.LecturerFName ??
          '';

        const lecturerLastName =
          matchingPosition?.lecturer_l_name ??
          matchingPosition?.LecturerLName ??
          '';

        const lecturerFromPosition =
          `${lecturerFirstName} ${lecturerLastName}`.trim();

        const mappedApplication = mapApplication(
          applicationSource,
          lecturerFromPosition
        );

        if (!cancelled) {
          setApplication(mappedApplication);
        }
      } catch (err) {
        if (!cancelled) {
          setApplication(null);
          setError(
            err.message || 'Could not load application.'
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadApplication();

    return () => {
      cancelled = true;
    };
  }, [id, location.state]);

  // ---------------------------------------------------------
  // Determine approval progress
  // ---------------------------------------------------------
  const getProgress = () => {
    switch (application?.status) {
      case 'Approved':
        return 3;
      case 'Under Review':
        return 2;
      case 'Pending':
        return 1;
      case 'Rejected':
        return 2;
      default:
        return 1;
    }
  };

  const progress = getProgress();

  return (
    <DetailPage
      title="Application Details"
      breadcrumbs={[
        { label: 'Applications', to: '/applications' },
        {
          label: application?.reference || 'Application Details',
        },
      ]}
      backTo="/applications"
      backLabel="Back to Applications"
      loading={loading}
      loadingMessage="Loading application..."
      errorTitle="Application Not Found"
      error={
        application
          ? ''
          : error ||
            'Please return to your applications and select an application to view its details.'
      }
    >
      {application ? (
        <>
            <div className="mb-6 md:mb-8">
              <h2 className="text-section font-poppins font-semibold text-primary">
                {application.moduleCode}
              </h2>
              <p className="text-neutral mt-2 break-words">
                Application Reference: {application.reference || '—'}
              </p>
            </div>

            <Card>
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div className="min-w-0">
                  <h3 className="text-card font-poppins font-semibold text-dark break-words">
                    {application.moduleName}
                  </h3>
                  <p className="text-neutral mt-2">
                    Module Code: {application.moduleCode}
                  </p>
                  <p className="text-neutral mt-1 break-words">
                    Lecturer: {application.lecturer}
                  </p>
                </div>
                <StatusBadge status={application.status} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div>
                  <p className="text-sm text-neutral">Date Submitted</p>
                  <p className="font-semibold text-dark mt-1">
                    {application.dateSubmitted}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-neutral">Application Status</p>
                  <p className="font-semibold text-dark mt-1">
                    {application.status}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-neutral">Application Reference</p>
                  <p className="font-semibold text-dark mt-1 break-words">
                    {application.reference || '—'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-neutral">Module</p>
                  <p className="font-semibold text-dark mt-1 break-words">
                    {application.moduleCode} - {application.moduleName}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="mt-6">
              <h3 className="text-card font-poppins font-semibold text-dark">
                Approval Progress
              </h3>

              <div className="mt-8">
                <div className="flex items-center">
                  <div
                    className={`w-6 h-6 rounded-full ${progress >= 1 ? 'bg-primary' : 'bg-light-grey'
                      }`}
                  />
                  <div
                    className={`flex-1 h-1 ${progress >= 2 ? 'bg-primary' : 'bg-light-grey'
                      }`}
                  />
                  <div
                    className={`w-6 h-6 rounded-full ${progress >= 2 ? 'bg-primary' : 'bg-light-grey'
                      }`}
                  />
                  <div
                    className={`flex-1 h-1 ${progress >= 3 ? 'bg-primary' : 'bg-light-grey'
                      }`}
                  />
                  <div
                    className={`w-6 h-6 rounded-full ${progress >= 3 ? 'bg-primary' : 'bg-light-grey'
                      }`}
                  />
                </div>

                <div className="flex justify-between mt-3 text-xs md:text-sm text-neutral">
                  <span>Submitted</span>
                  <span>Under Review</span>
                  <span>
                    {application.status === 'Rejected' ? 'Rejected' : 'Approved'}
                  </span>
                </div>
              </div>

              <div className="mt-8 p-4 bg-primary-lightest rounded-xl">
                {application.status === 'Pending' && (
                  <p className="text-primary font-medium">
                    Your application has been submitted and is waiting for
                    review.
                  </p>
                )}
                {application.status === 'Under Review' && (
                  <p className="text-primary font-medium">
                    Your application is currently being reviewed by the
                    lecturer.
                  </p>
                )}
                {application.status === 'Approved' && (
                  <p className="text-primary font-medium">
                    Your application has been approved.
                  </p>
                )}
                {application.status === 'Rejected' && (
                  <p className="text-primary font-medium">
                    Your application was not approved. Please review the
                    application outcome for more information.
                  </p>
                )}
              </div>
            </Card>
        </>
      ) : null}
    </DetailPage>
  );
};

export default ApplicationDetail;