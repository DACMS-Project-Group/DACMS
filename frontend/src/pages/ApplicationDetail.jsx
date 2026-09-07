import { useNavigate, useLocation, useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';

const ApplicationDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  // Get the application selected from the Applications page
  const application = location.state?.application;

  // If the page is opened directly without selecting an application first
  if (!application) {
    return (
      <div className="min-h-screen bg-off-white">
        <Navbar />

        <div className="flex">
          <Sidebar userRole="student" />

          <main className="flex-1">
            <div className="bg-primary h-16 flex items-center px-8">
              <h1 className="text-4xl font-poppins font-bold text-white">
                Application Details
              </h1>
            </div>

            <div className="p-8">
              <Card>
                <h2 className="text-2xl font-poppins font-semibold text-dark">
                  Application Not Found
                </h2>

                <p className="text-neutral mt-2">
                  Please return to your applications and select an application
                  to view its details.
                </p>

                <button
                  onClick={() => navigate('/applications')}
                  className="mt-6 bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition"
                >
                  Back to Applications
                </button>
              </Card>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Determine the progress based on the application status
  const getProgress = () => {
    switch (application.status) {
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
    <div className="min-h-screen bg-off-white">
      <Navbar />

      <div className="flex">
        <Sidebar userRole="student" />

        <main className="flex-1">

          {/* ===== PAGE TITLE BAR ===== */}
          <div className="bg-primary h-16 flex items-center px-8">
            <h1 className="text-4xl font-poppins font-bold text-white">
              Application Details
            </h1>
          </div>

          <div className="p-8">

            {/* ===== PAGE HEADING ===== */}
            <div className="mb-8">
              <h2 className="text-3xl font-poppins font-semibold text-primary">
                {application.moduleCode}
              </h2>

              <p className="text-neutral mt-2">
                Application ID: {application.id}
              </p>
            </div>

            {/* ===== APPLICATION INFORMATION ===== */}
            <Card>
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">

                <div>
                  <h3 className="text-2xl font-poppins font-semibold text-dark">
                    {application.moduleName}
                  </h3>

                  <p className="text-neutral mt-2">
                    Module Code: {application.moduleCode}
                  </p>

                  <p className="text-neutral mt-1">
                    Lecturer: {application.lecturer}
                  </p>
                </div>

                <StatusBadge status={application.status} />

              </div>

              {/* ===== APPLICATION DETAILS ===== */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">

                <div>
                  <p className="text-sm text-neutral">
                    Date Submitted
                  </p>

                  <p className="font-semibold text-dark mt-1">
                    {application.dateSubmitted}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-neutral">
                    Application Status
                  </p>

                  <p className="font-semibold text-dark mt-1">
                    {application.status}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-neutral">
                    Application ID
                  </p>

                  <p className="font-semibold text-dark mt-1">
                    {application.id}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-neutral">
                    Module
                  </p>

                  <p className="font-semibold text-dark mt-1">
                    {application.moduleCode} - {application.moduleName}
                  </p>
                </div>

              </div>
            </Card>

            {/* ===== APPROVAL PROGRESS ===== */}
            <Card className="mt-6">

              <h3 className="text-xl font-poppins font-semibold text-dark">
                Approval Progress
              </h3>

              <div className="mt-8">

                {/* Progress Line */}
                <div className="flex items-center">

                  {/* Step 1 */}
                  <div
                    className={`w-6 h-6 rounded-full ${
                      progress >= 1
                        ? 'bg-primary'
                        : 'bg-light-grey'
                    }`}
                  />

                  {/* Line 1 */}
                  <div
                    className={`flex-1 h-1 ${
                      progress >= 2
                        ? 'bg-primary'
                        : 'bg-light-grey'
                    }`}
                  />

                  {/* Step 2 */}
                  <div
                    className={`w-6 h-6 rounded-full ${
                      progress >= 2
                        ? 'bg-primary'
                        : 'bg-light-grey'
                    }`}
                  />

                  {/* Line 2 */}
                  <div
                    className={`flex-1 h-1 ${
                      progress >= 3
                        ? 'bg-primary'
                        : 'bg-light-grey'
                    }`}
                  />

                  {/* Step 3 */}
                  <div
                    className={`w-6 h-6 rounded-full ${
                      progress >= 3
                        ? 'bg-primary'
                        : 'bg-light-grey'
                    }`}
                  />

                </div>

                {/* Progress Labels */}
                <div className="flex justify-between mt-3 text-sm text-neutral">
                  <span>Submitted</span>
                  <span>Under Review</span>

                  <span>
                    {application.status === 'Rejected'
                      ? 'Rejected'
                      : 'Approved'}
                  </span>
                </div>

              </div>

              {/* ===== STATUS MESSAGE ===== */}
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

            {/* ===== BACK BUTTON ===== */}
            <div className="mt-8">

              <button
                onClick={() => navigate('/applications')}
                className="text-primary font-semibold hover:underline"
              >
                ← Back to Applications
              </button>

            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default ApplicationDetail;