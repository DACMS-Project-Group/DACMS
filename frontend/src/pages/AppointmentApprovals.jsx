import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';

const AppointmentApprovals = () => {
  const navigate = useNavigate();

  const appointments = [
    {
      id: 1,
      reference: 'APP-2026-001',
      studentNumber: '12345678',
      student: 'Student Example',
      module: 'CMPG323',
      lecturer: 'Lecturer Example',
      position: 'Student Assistant',
      hours: 10,
      date: '13 Sep 2026',
      status: 'Pending',
    },
    {
      id: 2,
      reference: 'APP-2026-002',
      studentNumber: '23456789',
      student: 'Student Example',
      module: 'CMPG321',
      lecturer: 'Lecturer Example',
      position: 'Student Assistant',
      hours: 12,
      date: '12 Sep 2026',
      status: 'Pending',
    },
    {
      id: 3,
      reference: 'APP-2026-003',
      studentNumber: '34567890',
      student: 'Student Example',
      module: 'CMPG315',
      lecturer: 'Lecturer Example',
      position: 'Student Assistant',
      hours: 8,
      date: '10 Sep 2026',
      status: 'Approved',
    },
    {
      id: 4,
      reference: 'APP-2026-004',
      studentNumber: '45678901',
      student: 'Student Example',
      module: 'CMPG323',
      lecturer: 'Lecturer Example',
      position: 'Student Assistant',
      hours: 10,
      date: '08 Sep 2026',
      status: 'Rejected',
    },
  ];

  const pendingAppointments = appointments.filter(
    (appointment) => appointment.status === 'Pending'
  );

  const historyAppointments = appointments.filter(
    (appointment) => appointment.status !== 'Pending'
  );

  const approvedAppointments = appointments.filter(
    (appointment) => appointment.status === 'Approved'
  );

  const rejectedAppointments = appointments.filter(
    (appointment) => appointment.status === 'Rejected'
  );

  const returnedAppointments = appointments.filter(
    (appointment) => appointment.status === 'Returned'
  );

  return (
    <div className="flex min-h-screen bg-off-white">
      <Sidebar userRole="admin" />

      <div className="flex-1">
        <Navbar />

        {/* Page Header */}
        <div className="bg-primary h-16 flex items-center px-8">
          <h1 className="text-3xl font-poppins font-bold text-white">
            Appointment Approvals
          </h1>
        </div>

        <main className="p-8">

          {/* Page Introduction */}
          <div className="mb-8">
            <h2 className="text-3xl font-poppins font-semibold text-primary">
              Appointment Approval
            </h2>

            <p className="text-neutral mt-2 font-inter">
              Review lecturer recommendations and approve, reject, or return
              assistant appointments for revision.
            </p>
          </div>

          {/* Appointment Summary */}
          <section className="mb-8">
            <h3 className="text-2xl font-poppins font-semibold text-primary mb-4">
              Appointment Summary
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

              <Card>
                <p className="text-neutral font-inter font-medium">
                  Pending Approvals
                </p>

                <p className="text-3xl font-poppins font-bold text-primary mt-3">
                  {pendingAppointments.length}
                </p>

                <p className="text-sm text-neutral mt-1 font-inter">
                  Awaiting review
                </p>
              </Card>

              <Card>
                <p className="text-neutral font-inter font-medium">
                  Approved
                </p>

                <p className="text-3xl font-poppins font-bold text-primary mt-3">
                  {approvedAppointments.length}
                </p>

                <p className="text-sm text-neutral mt-1 font-inter">
                  Appointments approved
                </p>
              </Card>

              <Card>
                <p className="text-neutral font-inter font-medium">
                  Rejected
                </p>

                <p className="text-3xl font-poppins font-bold text-primary mt-3">
                  {rejectedAppointments.length}
                </p>

                <p className="text-sm text-neutral mt-1 font-inter">
                  Appointments rejected
                </p>
              </Card>

              <Card>
                <p className="text-neutral font-inter font-medium">
                  Returned
                </p>

                <p className="text-3xl font-poppins font-bold text-primary mt-3">
                  {returnedAppointments.length}
                </p>

                <p className="text-sm text-neutral mt-1 font-inter">
                  Requiring revision
                </p>
              </Card>

            </div>
          </section>

          {/* Pending Appointments */}
          <section className="mb-8">

            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-poppins font-semibold text-primary">
                Pending Appointment Approvals
              </h3>

              <span className="text-sm text-neutral font-inter">
                {pendingAppointments.length} pending
              </span>
            </div>

            <Card>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1100px]">

                  <thead className="bg-primary-lightest">
                    <tr>
                      <th className="p-4 text-left text-sm font-semibold text-primary font-inter">
                        Reference
                      </th>

                      <th className="p-4 text-left text-sm font-semibold text-primary font-inter">
                        Student
                      </th>

                      <th className="p-4 text-left text-sm font-semibold text-primary font-inter">
                        Module
                      </th>

                      <th className="p-4 text-left text-sm font-semibold text-primary font-inter">
                        Lecturer
                      </th>

                      <th className="p-4 text-left text-sm font-semibold text-primary font-inter">
                        Position
                      </th>

                      <th className="p-4 text-left text-sm font-semibold text-primary font-inter">
                        Hours
                      </th>

                      <th className="p-4 text-left text-sm font-semibold text-primary font-inter">
                        Date
                      </th>

                      <th className="p-4 text-left text-sm font-semibold text-primary font-inter">
                        Status
                      </th>

                      <th className="p-4 text-left text-sm font-semibold text-primary font-inter">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {pendingAppointments.map((appointment) => (
                      <tr
                        key={appointment.id}
                        className="border-t border-neutral/30 hover:bg-primary-lightest/30 transition"
                      >
                        <td className="p-4 font-semibold text-dark font-inter">
                          {appointment.reference}
                        </td>

                        <td className="p-4 font-inter">
                          <p className="text-dark">
                            {appointment.student}
                          </p>

                          <p className="text-sm text-neutral mt-1">
                            {appointment.studentNumber}
                          </p>
                        </td>

                        <td className="p-4 text-dark font-inter">
                          {appointment.module}
                        </td>

                        <td className="p-4 text-dark font-inter">
                          {appointment.lecturer}
                        </td>

                        <td className="p-4 text-dark font-inter">
                          {appointment.position}
                        </td>

                        <td className="p-4 text-dark font-inter">
                          {appointment.hours}
                        </td>

                        <td className="p-4 text-sm text-neutral font-inter">
                          {appointment.date}
                        </td>

                        <td className="p-4">
                          <StatusBadge status={appointment.status} />
                        </td>

                        <td className="p-4">
                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/appointment-review/${appointment.id}`,
                                {
                                  state: {
                                    appointment,
                                  },
                                }
                              )
                            }
                            className="bg-primary text-white px-4 py-2 rounded-xl font-semibold hover:bg-primary-dark transition font-inter"
                          >
                            Review
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>

                </table>
              </div>
            </Card>

          </section>

          {/* Approval History */}
          <section className="mb-8">

            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-poppins font-semibold text-primary">
                Approval History
              </h3>

              <span className="text-sm text-neutral font-inter">
                {historyAppointments.length} reviewed
              </span>
            </div>

            <Card>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1000px]">

                  <thead className="bg-primary-lightest">
                    <tr>
                      <th className="p-4 text-left text-sm font-semibold text-primary font-inter">
                        Reference
                      </th>

                      <th className="p-4 text-left text-sm font-semibold text-primary font-inter">
                        Student
                      </th>

                      <th className="p-4 text-left text-sm font-semibold text-primary font-inter">
                        Module
                      </th>

                      <th className="p-4 text-left text-sm font-semibold text-primary font-inter">
                        Lecturer
                      </th>

                      <th className="p-4 text-left text-sm font-semibold text-primary font-inter">
                        Position
                      </th>

                      <th className="p-4 text-left text-sm font-semibold text-primary font-inter">
                        Date
                      </th>

                      <th className="p-4 text-left text-sm font-semibold text-primary font-inter">
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {historyAppointments.map((appointment) => (
                      <tr
                        key={appointment.id}
                        className="border-t border-neutral/30 hover:bg-primary-lightest/30 transition"
                      >
                        <td className="p-4 font-semibold text-dark font-inter">
                          {appointment.reference}
                        </td>

                        <td className="p-4 text-dark font-inter">
                          {appointment.student}
                        </td>

                        <td className="p-4 text-dark font-inter">
                          {appointment.module}
                        </td>

                        <td className="p-4 text-dark font-inter">
                          {appointment.lecturer}
                        </td>

                        <td className="p-4 text-dark font-inter">
                          {appointment.position}
                        </td>

                        <td className="p-4 text-sm text-neutral font-inter">
                          {appointment.date}
                        </td>

                        <td className="p-4">
                          <StatusBadge status={appointment.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>

                </table>
              </div>
            </Card>

          </section>

          {/* Appointment Management */}
          <section>
            <h3 className="text-2xl font-poppins font-semibold text-primary mb-4">
              Appointment Management
            </h3>

            <Card>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                <div>
                  <p className="text-sm text-neutral font-inter">
                    Student Linking
                  </p>

                  <p className="font-semibold text-dark mt-1 font-inter">
                    Approved Positions
                  </p>
                </div>

                <div>
                  <p className="text-sm text-neutral font-inter">
                    Responsibilities
                  </p>

                  <p className="font-semibold text-dark mt-1 font-inter">
                    Assigned by Lecturer
                  </p>
                </div>

                <div>
                  <p className="text-sm text-neutral font-inter">
                    Working-Hour Limit
                  </p>

                  <p className="font-semibold text-dark mt-1 font-inter">
                    Administrator Controlled
                  </p>
                </div>

                <div>
                  <p className="text-sm text-neutral font-inter">
                    Appointment Status
                  </p>

                  <p className="font-semibold text-dark mt-1 font-inter">
                    Updated on Decision
                  </p>
                </div>

              </div>
            </Card>
          </section>

        </main>
      </div>
    </div>
  );
};

export default AppointmentApprovals;