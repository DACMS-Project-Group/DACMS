import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';

const Applications = () => {
  const navigate = useNavigate();

  // Sample application data
  // This will later come from the API/database.
  const applications = [
    {
      id: 'APP-001',
      moduleCode: 'CMPG311',
      moduleName: 'Databases',
      lecturer: 'Lecturer',
      status: 'Pending',
      dateSubmitted: '15 August 2026',
      progress: 2,
    },
    {
      id: 'APP-002',
      moduleCode: 'CMPG313',
      moduleName: 'Artificial Intelligence',
      lecturer: 'Lecturer',
      status: 'Approved',
      dateSubmitted: '10 August 2026',
      progress: 3,
    },
    {
      id: 'APP-003',
      moduleCode: 'CMPG315',
      moduleName: 'Computer Networks',
      lecturer: 'Lecturer',
      status: 'Under Review',
      dateSubmitted: '5 August 2026',
      progress: 2,
    },
    {
      id: 'APP-004',
      moduleCode: 'CMPG321',
      moduleName: 'Advanced Databases',
      lecturer: 'Lecturer',
      status: 'Rejected',
      dateSubmitted: '19 July 2026',
      progress: 2,
    },
  ];

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

            {/* ===== APPLICATION CARDS ===== */}
            <div className="space-y-6">

              {applications.map((application) => (

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

                    </div>

                    {/* ===== STATUS + DETAILS ===== */}
                    <div className="flex flex-col items-start md:items-end gap-4">

                      <StatusBadge status={application.status} />

                      <button
                        onClick={() =>
                          navigate(`/application-detail/${application.id}`, {
                            state: { application },
                          })
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

          </div>

        </main>

      </div>

    </div>
  );
};

export default Applications;