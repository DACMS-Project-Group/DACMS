import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Card from '../components/Card';

const ApplyForDemi = () => {
  const navigate = useNavigate();

  const modules = [
    {
      code: 'CMPG 311',
      name: '',
      lecturer: 'Dr. John Smith',
      requirement: 'Minimum mark: 70%',
      eligible: true,
    },
    {
      code: 'CMPG 321',
      name: 'Data Analysis',
      lecturer: 'Prof. Jane Doe',
      requirement: 'Minimum mark: 75%',
      eligible: true,
    },
    {
      code: 'CMPG 211',
      name: 'Computer Networks',
      lecturer: 'Dr. Michael Jones',
      requirement: 'Minimum mark: 65%',
      eligible: false,
    },
  ];

  const handleApply = (module) => {
    alert(`Application submitted for ${module.code}`);
    navigate('/applications');
  };

  return (
    <div className="min-h-screen bg-off-white">
      <Navbar />

      <div className="flex">
        <Sidebar userRole="student" />

        <main className="flex-1">
          <div className="bg-primary h-16 flex items-center px-8">
            <h1 className="text-3xl font-poppins font-bold text-white">
              Apply for Demi
            </h1>
          </div>

          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-3xl font-poppins font-semibold text-primary">
                Available Demi Positions
              </h2>

              <p className="text-neutral mt-2">
                View available modules and apply for a Demi position if you
                meet the eligibility requirements.
              </p>
            </div>

            <div className="space-y-6">
              {modules.map((module) => (
                <Card key={module.code}>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div>
                      <h3 className="text-2xl font-poppins font-semibold text-dark">
                        {module.code}
                      </h3>

                      <p className="text-lg text-dark mt-1">
                        {module.name}
                      </p>

                      <p className="text-neutral mt-2">
                        Lecturer: {module.lecturer}
                      </p>

                      <p className="text-sm text-neutral mt-2">
                        {module.requirement}
                      </p>
                    </div>

                    <div className="flex flex-col items-start md:items-end gap-3">
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-semibold ${
                          module.eligible
                            ? 'bg-primary-lightest text-primary'
                            : 'bg-light-grey text-neutral'
                        }`}
                      >
                        {module.eligible ? 'Eligible' : 'Not Eligible'}
                      </span>

                      <button
                        disabled={!module.eligible}
                        onClick={() => handleApply(module)}
                        className={`px-6 py-3 rounded-xl font-semibold transition ${
                          module.eligible
                            ? 'bg-primary text-white hover:bg-primary-dark'
                            : 'bg-light-grey text-neutral cursor-not-allowed'
                        }`}
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

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

export default ApplyForDemi;