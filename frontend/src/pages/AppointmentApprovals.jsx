import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

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

  const getStatusStyle = (status) => {

    if (status === 'Approved') {
      return 'bg-green-100 text-green-700';
    }

    if (status === 'Rejected') {
      return 'bg-red-100 text-red-700';
    }

    if (status === 'Returned') {
      return 'bg-yellow-100 text-yellow-700';
    }

    return 'bg-[#E8DDF0] text-[#6C3D91]';
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA]">

      <Navbar />

      <div className="flex">

        <Sidebar userRole="admin" />

        <main className="flex-1 p-8">

          {/* Page header */}
          <div className="bg-[#6C3D91] text-white px-8 py-5 rounded-t-lg">

            <h1 className="text-3xl font-bold">
              Appointment Approvals
            </h1>

          </div>

          <div className="bg-white p-8">

            {/* Page introduction */}
            <div className="mb-8">

              <h2 className="text-2xl font-semibold text-[#6C3D91]">
                Appointment Approval
              </h2>

              <p className="text-[#78848E] mt-1">
                Review lecturer recommendations and approve, reject, or return
                assistant appointments for revision.
              </p>

            </div>

            {/* Appointment Summary */}
            <div className="border border-[#78848E] rounded-xl p-6 mb-8">

              <h3 className="text-lg font-semibold text-[#6C3D91] mb-5">
                Appointment Summary
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-5">

                <div className="border border-[#78848E] rounded-xl p-6">

                  <p className="text-sm text-[#78848E]">
                    Pending Approvals
                  </p>

                  <p className="text-2xl font-bold text-[#6C3D91] mt-2">
                    {pendingAppointments.length}
                  </p>

                  <p className="text-sm text-[#78848E] mt-1">
                    Awaiting review
                  </p>

                </div>

                <div className="border border-[#78848E] rounded-xl p-6">

                  <p className="text-sm text-[#78848E]">
                    Approved
                  </p>

                  <p className="text-2xl font-bold text-[#6C3D91] mt-2">
                    {
                      appointments.filter(
                        (appointment) =>
                          appointment.status === 'Approved'
                      ).length
                    }
                  </p>

                  <p className="text-sm text-[#78848E] mt-1">
                    Appointments approved
                  </p>

                </div>

                <div className="border border-[#78848E] rounded-xl p-6">

                  <p className="text-sm text-[#78848E]">
                    Rejected
                  </p>

                  <p className="text-2xl font-bold text-[#6C3D91] mt-2">
                    {
                      appointments.filter(
                        (appointment) =>
                          appointment.status === 'Rejected'
                      ).length
                    }
                  </p>

                  <p className="text-sm text-[#78848E] mt-1">
                    Appointments rejected
                  </p>

                </div>

                <div className="border border-[#78848E] rounded-xl p-6">

                  <p className="text-sm text-[#78848E]">
                    Returned
                  </p>

                  <p className="text-2xl font-bold text-[#6C3D91] mt-2">
                    {
                      appointments.filter(
                        (appointment) =>
                          appointment.status === 'Returned'
                      ).length
                    }
                  </p>

                  <p className="text-sm text-[#78848E] mt-1">
                    Requiring revision
                  </p>

                </div>

              </div>

            </div>

            {/* Pending appointments */}
            <div className="mb-8">

              <div className="flex justify-between items-center mb-4">

                <h3 className="text-xl font-semibold text-[#6C3D91]">
                  Pending Appointment Approvals
                </h3>

                <span className="text-sm text-[#78848E]">
                  {pendingAppointments.length} pending
                </span>

              </div>

              <div className="border border-[#78848E] rounded-xl overflow-x-auto">

                <table className="w-full">

                  <thead className="bg-[#F3F4F6]">

                    <tr>

                      <th className="p-4 text-left text-sm text-[#78848E]">
                        Reference
                      </th>

                      <th className="p-4 text-left text-sm text-[#78848E]">
                        Student
                      </th>

                      <th className="p-4 text-left text-sm text-[#78848E]">
                        Module
                      </th>

                      <th className="p-4 text-left text-sm text-[#78848E]">
                        Lecturer
                      </th>

                      <th className="p-4 text-left text-sm text-[#78848E]">
                        Position
                      </th>

                      <th className="p-4 text-left text-sm text-[#78848E]">
                        Hours
                      </th>

                      <th className="p-4 text-left text-sm text-[#78848E]">
                        Date
                      </th>

                      <th className="p-4 text-left text-sm text-[#78848E]">
                        Status
                      </th>

                      <th className="p-4 text-left text-sm text-[#78848E]">
                        Action
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {pendingAppointments.map(
                      (appointment) => (

                        <tr
                          key={appointment.id}
                          className="border-t border-[#78848E]/40 hover:bg-[#E8DDF0]/30"
                        >

                          <td className="p-4 font-semibold">
                            {appointment.reference}
                          </td>

                          <td className="p-4">

                            <p>
                              {appointment.student}
                            </p>

                            <p className="text-sm text-[#78848E]">
                              {appointment.studentNumber}
                            </p>

                          </td>

                          <td className="p-4">
                            {appointment.module}
                          </td>

                          <td className="p-4">
                            {appointment.lecturer}
                          </td>

                          <td className="p-4">
                            {appointment.position}
                          </td>

                          <td className="p-4">
                            {appointment.hours}
                          </td>

                          <td className="p-4 text-sm text-[#78848E]">
                            {appointment.date}
                          </td>

                          <td className="p-4">

                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
                                appointment.status
                              )}`}
                            >
                              {appointment.status}
                            </span>

                          </td>

                          <td className="p-4">

                            <button
                              type="button"
                              onClick={() =>
                                navigate(`/appointment-review/${appointment.id}`, {
                                    state: {
                                    appointment,
                                    },
                                })
                                }
                              className="px-4 py-2 bg-[#6C3D91] text-white rounded-xl font-semibold hover:bg-[#5A3280]"
                            >
                              Review
                            </button>

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            </div>

            {/* Approval History */}
            <div className="mb-8">

              <div className="flex justify-between items-center mb-4">

                <h3 className="text-xl font-semibold text-[#6C3D91]">
                  Approval History
                </h3>

                <span className="text-sm text-[#78848E]">
                  {historyAppointments.length} reviewed
                </span>

              </div>

              <div className="border border-[#78848E] rounded-xl overflow-x-auto">

                <table className="w-full">

                  <thead className="bg-[#F3F4F6]">

                    <tr>

                      <th className="p-4 text-left text-sm text-[#78848E]">
                        Reference
                      </th>

                      <th className="p-4 text-left text-sm text-[#78848E]">
                        Student
                      </th>

                      <th className="p-4 text-left text-sm text-[#78848E]">
                        Module
                      </th>

                      <th className="p-4 text-left text-sm text-[#78848E]">
                        Lecturer
                      </th>

                      <th className="p-4 text-left text-sm text-[#78848E]">
                        Position
                      </th>

                      <th className="p-4 text-left text-sm text-[#78848E]">
                        Date
                      </th>

                      <th className="p-4 text-left text-sm text-[#78848E]">
                        Status
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {historyAppointments.map(
                      (appointment) => (

                        <tr
                          key={appointment.id}
                          className="border-t border-[#78848E]/40 hover:bg-[#E8DDF0]/30"
                        >

                          <td className="p-4 font-semibold">
                            {appointment.reference}
                          </td>

                          <td className="p-4">
                            {appointment.student}
                          </td>

                          <td className="p-4">
                            {appointment.module}
                          </td>

                          <td className="p-4">
                            {appointment.lecturer}
                          </td>

                          <td className="p-4">
                            {appointment.position}
                          </td>

                          <td className="p-4 text-sm text-[#78848E]">
                            {appointment.date}
                          </td>

                          <td className="p-4">

                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
                                appointment.status
                              )}`}
                            >
                              {appointment.status}
                            </span>

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            </div>

            {/* Appointment Management Information */}
            <div className="border border-[#78848E] rounded-xl p-6 bg-[#F8F9FA]">

              <h3 className="text-lg font-semibold text-[#6C3D91] mb-5">
                Appointment Management
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

                <div>

                  <p className="text-sm text-[#78848E]">
                    Student Linking
                  </p>

                  <p className="font-semibold mt-1">
                    Approved Positions
                  </p>

                </div>

                <div>

                  <p className="text-sm text-[#78848E]">
                    Responsibilities
                  </p>

                  <p className="font-semibold mt-1">
                    Assigned by Lecturer
                  </p>

                </div>

                <div>

                  <p className="text-sm text-[#78848E]">
                    Working-Hour Limit
                  </p>

                  <p className="font-semibold mt-1">
                    Administrator Controlled
                  </p>

                </div>

                <div>

                  <p className="text-sm text-[#78848E]">
                    Appointment Status
                  </p>

                  <p className="font-semibold mt-1">
                    Updated on Decision
                  </p>

                </div>

              </div>

            </div>

          </div>

        </main>

      </div>

    </div>
  );
};

export default AppointmentApprovals;