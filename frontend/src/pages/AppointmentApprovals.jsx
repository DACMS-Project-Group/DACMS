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
      studentName: 'Student Example',
      email: 'student@nwu.ac.za',
      moduleCode: 'CMPG323',
      moduleName: 'Software Engineering',
      lecturer: 'Lecturer Example',
      position: 'Student Assistant',
      hoursLimit: 10,
      submittedDate: '13 September 2026',
      status: 'Pending',
    },
    {
      id: 2,
      reference: 'APP-2026-002',
      studentNumber: '23456789',
      studentName: 'Student Example',
      email: 'student@nwu.ac.za',
      moduleCode: 'CMPG321',
      moduleName: 'Advanced Databases',
      lecturer: 'Lecturer Example',
      position: 'Student Assistant',
      hoursLimit: 12,
      submittedDate: '12 September 2026',
      status: 'Pending',
    },
    {
      id: 3,
      reference: 'APP-2026-003',
      studentNumber: '34567890',
      studentName: 'Student Example',
      email: 'student@nwu.ac.za',
      moduleCode: 'CMPG315',
      moduleName: 'Programming',
      lecturer: 'Lecturer Example',
      position: 'Student Assistant',
      hoursLimit: 8,
      submittedDate: '10 September 2026',
      status: 'Approved',
    },
    {
      id: 4,
      reference: 'APP-2026-004',
      studentNumber: '45678901',
      studentName: 'Student Example',
      email: 'student@nwu.ac.za',
      moduleCode: 'CMPG323',
      moduleName: 'Software Engineering',
      lecturer: 'Lecturer Example',
      position: 'Student Assistant',
      hoursLimit: 10,
      submittedDate: '08 September 2026',
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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
    <div className="min-h-screen bg-off-white">
      <Navbar />
=======
    <div className="flex min-h-screen bg-off-white">
      <Sidebar userRole="admin" />
>>>>>>> 3f57c17 (Update admin budget pages and styling)

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

<<<<<<< HEAD
              <p className="mt-2 text-neutral font-inter">
                Review lecturer recommendations and approve, reject, or return
                assistant appointments for revision.
              </p>
=======
    <div className="flex min-h-screen bg-off-white">
      <Sidebar userRole="admin" />
=======
    <div className="min-h-screen bg-off-white">
      <Navbar />
>>>>>>> 27f538a (Standardize frontend page layouts)

      <div className="flex">
        <Sidebar userRole="admin" />

        <main className="flex-1">
          <div className="bg-primary px-8 py-4">
            <h1 className="text-2xl font-semibold text-white font-poppins">
              Appointment Approvals
            </h1>
          </div>

          <div className="p-8">
            {/* Page Introduction */}
            <div className="mb-8">
              <h2 className="text-2xl font-poppins font-semibold text-primary">
                Appointment Approval
              </h2>

<<<<<<< HEAD
>>>>>>> 34d86e6 (Update admin budget pages and styling)
=======
              <p className="mt-2 text-neutral font-inter">
                Review lecturer recommendations and approve, reject, or return
                assistant appointments for revision.
              </p>
>>>>>>> 27f538a (Standardize frontend page layouts)
            </div>

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 27f538a (Standardize frontend page layouts)
            {/* Appointment Summary */}
            <section className="mb-8">
              <h3 className="mb-4 text-2xl font-poppins font-semibold text-primary">
                Appointment Summary
<<<<<<< HEAD
=======
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
>>>>>>> 3f57c17 (Update admin budget pages and styling)
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
<<<<<<< HEAD
              </Card>
            </section>
          </div>
=======
          {/* Pending Appointments */}
          <section className="mb-8">

            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-poppins font-semibold text-primary">
                Pending Appointment Approvals
=======
>>>>>>> 27f538a (Standardize frontend page layouts)
              </h3>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <p className="font-inter font-medium text-neutral">
                    Pending Approvals
                  </p>

                  <p className="mt-3 text-3xl font-poppins font-bold text-primary">
                    {pendingAppointments.length}
                  </p>

                  <p className="mt-1 text-sm font-inter text-neutral">
                    Awaiting review
                  </p>
                </Card>

                <Card>
                  <p className="font-inter font-medium text-neutral">
                    Approved
                  </p>

                  <p className="mt-3 text-3xl font-poppins font-bold text-primary">
                    {approvedAppointments.length}
                  </p>

                  <p className="mt-1 text-sm font-inter text-neutral">
                    Appointments approved
                  </p>
                </Card>

                <Card>
                  <p className="font-inter font-medium text-neutral">
                    Rejected
                  </p>

                  <p className="mt-3 text-3xl font-poppins font-bold text-primary">
                    {rejectedAppointments.length}
                  </p>

                  <p className="mt-1 text-sm font-inter text-neutral">
                    Appointments rejected
                  </p>
                </Card>

                <Card>
                  <p className="font-inter font-medium text-neutral">
                    Returned
                  </p>

                  <p className="mt-3 text-3xl font-poppins font-bold text-primary">
                    {returnedAppointments.length}
                  </p>

                  <p className="mt-1 text-sm font-inter text-neutral">
                    Requiring revision
                  </p>
                </Card>
              </div>
            </section>

            {/* Pending Appointments */}
            <section className="mb-8">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-2xl font-poppins font-semibold text-primary">
                  Pending Appointment Approvals
                </h3>

                <span className="text-sm font-inter text-neutral">
                  {pendingAppointments.length} pending
                </span>
              </div>

              <Card>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[1100px]">
                    <thead className="bg-primary-lightest">
                      <tr>
                        <th className="p-4 text-left text-sm font-semibold font-inter text-primary">
                          Reference
                        </th>

                        <th className="p-4 text-left text-sm font-semibold font-inter text-primary">
                          Student
                        </th>

                        <th className="p-4 text-left text-sm font-semibold font-inter text-primary">
                          Module
                        </th>

                        <th className="p-4 text-left text-sm font-semibold font-inter text-primary">
                          Lecturer
                        </th>

                        <th className="p-4 text-left text-sm font-semibold font-inter text-primary">
                          Position
                        </th>

                        <th className="p-4 text-left text-sm font-semibold font-inter text-primary">
                          Hours
                        </th>

                        <th className="p-4 text-left text-sm font-semibold font-inter text-primary">
                          Date
                        </th>

                        <th className="p-4 text-left text-sm font-semibold font-inter text-primary">
                          Status
                        </th>

                        <th className="p-4 text-left text-sm font-semibold font-inter text-primary">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {pendingAppointments.map((appointment) => (
                        <tr
                          key={appointment.id}
                          className="border-t border-neutral/30 transition hover:bg-primary-lightest/30"
                        >
                          <td className="p-4 font-inter font-semibold text-dark">
                            {appointment.reference}
                          </td>

                          <td className="p-4 font-inter">
                            <p className="text-dark">
                              {appointment.studentName}
                            </p>

                            <p className="mt-1 text-sm text-neutral">
                              {appointment.studentNumber}
                            </p>
                          </td>

                          <td className="p-4 font-inter text-dark">
                            {appointment.moduleCode}
                          </td>

                          <td className="p-4 font-inter text-dark">
                            {appointment.lecturer}
                          </td>

                          <td className="p-4 font-inter text-dark">
                            {appointment.position}
                          </td>

                          <td className="p-4 font-inter text-dark">
                            {appointment.hoursLimit}
                          </td>

                          <td className="p-4 text-sm font-inter text-neutral">
                            {appointment.submittedDate}
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
                              className="rounded-xl bg-primary px-4 py-2 font-inter font-semibold text-white transition hover:bg-primary-dark"
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
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-2xl font-poppins font-semibold text-primary">
                  Approval History
                </h3>

                <span className="text-sm font-inter text-neutral">
                  {historyAppointments.length} reviewed
                </span>
              </div>

              <Card>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[1000px]">
                    <thead className="bg-primary-lightest">
                      <tr>
                        <th className="p-4 text-left text-sm font-semibold font-inter text-primary">
                          Reference
                        </th>

                        <th className="p-4 text-left text-sm font-semibold font-inter text-primary">
                          Student
                        </th>

                        <th className="p-4 text-left text-sm font-semibold font-inter text-primary">
                          Module
                        </th>

                        <th className="p-4 text-left text-sm font-semibold font-inter text-primary">
                          Lecturer
                        </th>

                        <th className="p-4 text-left text-sm font-semibold font-inter text-primary">
                          Position
                        </th>

                        <th className="p-4 text-left text-sm font-semibold font-inter text-primary">
                          Date
                        </th>

                        <th className="p-4 text-left text-sm font-semibold font-inter text-primary">
                          Status
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {historyAppointments.map((appointment) => (
                        <tr
                          key={appointment.id}
                          className="border-t border-neutral/30 transition hover:bg-primary-lightest/30"
                        >
                          <td className="p-4 font-inter font-semibold text-dark">
                            {appointment.reference}
                          </td>

                          <td className="p-4 font-inter text-dark">
                            {appointment.studentName}
                          </td>

                          <td className="p-4 font-inter text-dark">
                            {appointment.moduleCode}
                          </td>

                          <td className="p-4 font-inter text-dark">
                            {appointment.lecturer}
                          </td>

                          <td className="p-4 font-inter text-dark">
                            {appointment.position}
                          </td>

                          <td className="p-4 text-sm font-inter text-neutral">
                            {appointment.submittedDate}
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
              <h3 className="mb-4 text-2xl font-poppins font-semibold text-primary">
                Appointment Management
              </h3>

              <Card>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <p className="text-sm font-inter text-neutral">
                      Student Linking
                    </p>

                    <p className="mt-1 font-inter font-semibold text-dark">
                      Approved Positions
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-inter text-neutral">
                      Responsibilities
                    </p>

                    <p className="mt-1 font-inter font-semibold text-dark">
                      Assigned by Lecturer
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-inter text-neutral">
                      Working-Hour Limit
                    </p>

                    <p className="mt-1 font-inter font-semibold text-dark">
                      Administrator Controlled
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-inter text-neutral">
                      Appointment Status
                    </p>

                    <p className="mt-1 font-inter font-semibold text-dark">
                      Updated on Decision
                    </p>
                  </div>
                </div>
<<<<<<< HEAD

                <div>
                  <p className="text-sm text-neutral font-inter">
                    Responsibilities
                  </p>

                  <p className="font-semibold text-dark mt-1 font-inter">
                    Assigned by Lecturer
                  </p>
                </div>
=======
>>>>>>> 3f57c17 (Update admin budget pages and styling)

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

<<<<<<< HEAD
>>>>>>> 34d86e6 (Update admin budget pages and styling)
=======
              </Card>
            </section>
          </div>
>>>>>>> 27f538a (Standardize frontend page layouts)
=======
>>>>>>> 3f57c17 (Update admin budget pages and styling)
        </main>
      </div>
    </div>
  );
};

export default AppointmentApprovals;