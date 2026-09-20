import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';

const BudgetDetails = () => {
  
  const { id } = useParams();

  const budget = {
    id: id || 'BUD-2026-002',
    moduleCode: 'CMPG323',
    moduleName: 'Software Engineering',
    allocated: 75000,
    used: 61500,
    year: '2026',
    period: 'Semester 2',
    status: 'Warning',
  };

  const lecturers = [
    {
      name: 'Dr John Example',
      allocated: 20000,
      used: 16500,
    },
    {
      name: 'Prof Jane Example',
      allocated: 15000,
      used: 12000,
    },
    {
      name: 'Dr Michael Example',
      allocated: 10000,
      used: 8500,
    },
  ];

  const auditLogs = [
    {
      date: '28 Aug 2026',
      user: 'Administrator',
      action: 'Created',
      description: 'Budget created',
    },
    {
      date: '30 Aug 2026',
      user: 'Administrator',
      action: 'Updated',
      description: 'Budget allocation updated',
    },
    {
      date: '02 Sep 2026',
      user: 'Administrator',
      action: 'Updated',
      description: 'Lecturer allocation modified',
    },
  ];

  const percentage = Math.round(
    (budget.used / budget.allocated) * 100
  );

  const remaining =
    budget.allocated - budget.used;

  const formatCurrency = (amount) =>
    `R ${amount.toLocaleString('en-ZA')}`;

  return (
    <div className="flex min-h-screen bg-off-white">
      <Sidebar userRole="admin" />

      <div className="flex-1">
        <Navbar />

        {/* Page Header */}
        <div className="bg-primary h-16 flex items-center justify-between px-8">

          <h1 className="text-3xl font-poppins font-bold text-white">
            Budget Details
          </h1>

          

        </div>

        <main className="p-8">

          

          {/* Page Introduction */}
          <div className="mb-8">

            <h2 className="text-3xl font-poppins font-semibold text-primary">
              {budget.moduleCode} — {budget.moduleName}
            </h2>

            <p className="text-neutral mt-2 font-inter">
              View budget allocation, utilisation, lecturer allocations,
              and audit history.
            </p>

          </div>

          {/* Basic Information */}
          <section className="mb-8">

            <h3 className="text-2xl font-poppins font-semibold text-primary mb-4">
              Budget Information
            </h3>

            <Card>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <div>
                  <p className="text-sm text-neutral font-inter">
                    Budget ID
                  </p>

                  <p className="font-semibold text-dark mt-1 font-inter">
                    {budget.id}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-neutral font-inter">
                    Budget Period
                  </p>

                  <p className="font-semibold text-dark mt-1 font-inter">
                    {budget.period}, {budget.year}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-neutral font-inter">
                    Status
                  </p>

                  <div className="mt-1">
                    <StatusBadge status={budget.status} />
                  </div>
                </div>

              </div>

            </Card>
          </section>

          {/* Budget Summary */}
          <section className="mb-8">

            <h3 className="text-2xl font-poppins font-semibold text-primary mb-4">
              Budget Summary
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              <Card>
                <p className="text-neutral font-inter font-medium">
                  Allocated Budget
                </p>

                <p className="text-3xl font-poppins font-bold text-primary mt-3">
                  {formatCurrency(budget.allocated)}
                </p>
              </Card>

              <Card>
                <p className="text-neutral font-inter font-medium">
                  Budget Used
                </p>

                <p className="text-3xl font-poppins font-bold text-primary mt-3">
                  {formatCurrency(budget.used)}
                </p>
              </Card>

              <Card>
                <p className="text-neutral font-inter font-medium">
                  Remaining
                </p>

                <p
                  className={`text-3xl font-poppins font-bold mt-3 ${
                    remaining < 0
                      ? 'text-red-600'
                      : 'text-primary'
                  }`}
                >
                  {formatCurrency(remaining)}
                </p>
              </Card>

            </div>

          </section>

          {/* Budget Utilisation */}
          <section className="mb-8">

            <h3 className="text-2xl font-poppins font-semibold text-primary mb-4">
              Budget Utilisation
            </h3>

            <Card>

              <div className="flex justify-between items-center mb-3">

                <span className="text-neutral font-inter">
                  {formatCurrency(budget.used)} used of{' '}
                  {formatCurrency(budget.allocated)}
                </span>

                <span className="font-semibold text-dark font-inter">
                  {percentage}%
                </span>

              </div>

              <div className="w-full h-4 bg-primary-lightest rounded-full overflow-hidden">

                <div
                  className={`h-4 rounded-full ${
                    percentage >= 100
                      ? 'bg-red-600'
                      : percentage >= 80
                      ? 'bg-yellow-500'
                      : 'bg-green-600'
                  }`}
                  style={{
                    width: `${Math.min(
                      percentage,
                      100
                    )}%`,
                  }}
                />

              </div>

              {percentage >= 80 && (
                <div className="mt-5 p-4 bg-primary-lightest rounded-xl">

                  <p className="text-primary font-semibold font-inter">
                    ⚠ Budget approaching limit
                  </p>

                  <p className="text-sm text-neutral mt-1 font-inter">
                    This budget has reached {percentage}%
                    utilisation.
                  </p>

                </div>
              )}

            </Card>
          </section>

          {/* Lecturer Allocation */}
          <section className="mb-8">

            <h3 className="text-2xl font-poppins font-semibold text-primary mb-4">
              Lecturer Allocation
            </h3>

            <Card>

              <div className="overflow-x-auto">

                <table className="w-full">

                  <thead className="bg-primary-lightest">

                    <tr>

                      <th className="p-4 text-left text-sm font-semibold text-primary font-inter">
                        Lecturer
                      </th>

                      <th className="p-4 text-left text-sm font-semibold text-primary font-inter">
                        Allocated
                      </th>

                      <th className="p-4 text-left text-sm font-semibold text-primary font-inter">
                        Used
                      </th>

                      <th className="p-4 text-left text-sm font-semibold text-primary font-inter">
                        Remaining
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {lecturers.map((lecturer) => {

                      const lecturerRemaining =
                        lecturer.allocated -
                        lecturer.used;

                      return (
                        <tr
                          key={lecturer.name}
                          className="border-t border-neutral/30 hover:bg-primary-lightest/30 transition"
                        >

                          <td className="p-4 font-semibold text-dark font-inter">
                            {lecturer.name}
                          </td>

                          <td className="p-4 text-dark font-inter">
                            {formatCurrency(
                              lecturer.allocated
                            )}
                          </td>

                          <td className="p-4 text-dark font-inter">
                            {formatCurrency(
                              lecturer.used
                            )}
                          </td>

                          <td className="p-4 text-dark font-inter">
                            {formatCurrency(
                              lecturerRemaining
                            )}
                          </td>

                        </tr>
                      );
                    })}

                  </tbody>

                </table>

              </div>

            </Card>
          </section>

          {/* Audit History */}
          <section>

            <h3 className="text-2xl font-poppins font-semibold text-primary mb-4">
              Budget Audit History
            </h3>

            <Card>

              <div className="overflow-x-auto">

                <table className="w-full">

                  <thead className="bg-primary-lightest">

                    <tr>

                      <th className="p-4 text-left text-sm font-semibold text-primary font-inter">
                        Date
                      </th>

                      <th className="p-4 text-left text-sm font-semibold text-primary font-inter">
                        User
                      </th>

                      <th className="p-4 text-left text-sm font-semibold text-primary font-inter">
                        Action
                      </th>

                      <th className="p-4 text-left text-sm font-semibold text-primary font-inter">
                        Details
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {auditLogs.map((log, index) => (

                      <tr
                        key={index}
                        className="border-t border-neutral/30 hover:bg-primary-lightest/30 transition"
                      >

                        <td className="p-4 text-dark font-inter">
                          {log.date}
                        </td>

                        <td className="p-4 text-dark font-inter">
                          {log.user}
                        </td>

                        <td className="p-4">

                          <span className="px-3 py-1 rounded-full bg-primary-lightest text-primary text-xs font-semibold font-inter">
                            {log.action}
                          </span>

                        </td>

                        <td className="p-4 text-neutral font-inter">
                          {log.description}
                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            </Card>
          </section>

        </main>
      </div>
    </div>
  );
};

export default BudgetDetails;