import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Card from '../components/Card';

const GenerateNewClaim = () => {
  const navigate = useNavigate();

  // Sample student information
  // This will later come from the API.
  const student = {
    studentNumber: '12345678',
    fullName: 'John Doe',
    bankingStatus: 'Banking details verified',
  };

  // Sample Assistant appointments
  // A student can have multiple appointments/modules.
  // This will later come from the API.
  const appointments = [
    {
      id: 1,
      moduleCode: 'CMPG311',
      moduleName: 'Databases',
      lecturer: 'Lecturer Name',
      hourlyRate: 45,
    },
    {
      id: 2,
      moduleCode: 'CMPG312',
      moduleName: 'Operating Systems',
      lecturer: 'Lecturer Name',
      hourlyRate: 45,
    },
  ];

  // Sample verified work sessions from all appointments.
  // Only verified sessions can be included in a claim.
  // These will later come from the API.
  const approvedSessions = [
    {
      id: 1,
      appointmentId: 1,
      moduleCode: 'CMPG311',
      moduleName: 'Databases',
      date: '2026-09-02',
      activity: 'Student consultation',
      startTime: '08:00',
      endTime: '12:00',
      hours: 4,
      status: 'Verified',
    },
    {
      id: 2,
      appointmentId: 1,
      moduleCode: 'CMPG311',
      moduleName: 'Databases',
      date: '2026-09-05',
      activity: 'Tutorial assistance',
      startTime: '09:00',
      endTime: '13:30',
      hours: 4.5,
      status: 'Verified',
    },
    {
      id: 3,
      appointmentId: 2,
      moduleCode: 'CMPG312',
      moduleName: 'Operating Systems',
      date: '2026-09-04',
      activity: 'Tutorial assistance',
      startTime: '09:00',
      endTime: '12:00',
      hours: 3,
      status: 'Verified',
    },
  ];

  const [claimSubmitted, setClaimSubmitted] = useState(false);

  // Calculate total approved hours.
  const totalHours = approvedSessions.reduce(
    (total, session) => total + session.hours,
    0
  );

  // Calculate total claim amount using each appointment's hourly rate.
  const totalClaimAmount = approvedSessions.reduce((total, session) => {
    const appointment = appointments.find(
      (item) => item.id === session.appointmentId
    );

    if (!appointment) {
      return total;
    }

    return total + session.hours * appointment.hourlyRate;
  }, 0);

  // Format dates for display.
  const formatDate = (date) => {
    return new Date(`${date}T00:00:00`).toLocaleDateString('en-ZA', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  // Format currency amounts.
  const formatAmount = (amount) => {
    return `R ${amount.toLocaleString('en-ZA', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // Get total hours for a specific module.
  const getModuleTotalHours = (moduleCode) => {
    return approvedSessions
      .filter((session) => session.moduleCode === moduleCode)
      .reduce((total, session) => total + session.hours, 0);
  };

  // Get total claim amount for a specific module.
  const getModuleAmount = (moduleCode) => {
    const appointment = appointments.find(
      (item) => item.moduleCode === moduleCode
    );

    if (!appointment) {
      return 0;
    }

    const hours = getModuleTotalHours(moduleCode);

    return hours * appointment.hourlyRate;
  };

  // Get the unique modules included in the claim.
  const getUniqueModules = () => {
    return [...new Set(approvedSessions.map((session) => session.moduleCode))];
  };

  // Submit the remuneration claim.
  const handleSubmitClaim = () => {
    setClaimSubmitted(true);
  };

  // Return to the Claims page.
  const handleBackToClaims = () => {
    navigate('/claims');
  };

  return (
    <div className="min-h-screen bg-off-white">
      {/* Top Navigation */}
      <Navbar />

      {/* Sidebar + Main Content */}
      <div className="flex">

        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1">

          {/* Page Header */}
          <div className="bg-primary px-8 py-4">
            <h1 className="text-2xl font-semibold text-white">
              Generate New Claim
            </h1>
          </div>

          {/* Page Content */}
          <div className="p-8">

            {/* Back Button */}
            <div className="mb-6">
              <button
                type="button"
                onClick={handleBackToClaims}
                className="font-medium text-primary transition hover:text-primary-dark"
              >
                ← Back to Claims
              </button>
            </div>

            {/* Success Message */}
            {claimSubmitted && (
              <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-5 py-4">
                <h3 className="font-semibold text-green-800">
                  Claim Submitted Successfully
                </h3>

                <p className="mt-1 text-sm text-green-700">
                  Your remuneration claim has been submitted and is awaiting
                  verification.
                </p>

                <button
                  type="button"
                  onClick={handleBackToClaims}
                  className="mt-3 font-medium text-green-800 underline"
                >
                  View Claims
                </button>
              </div>
            )}

            {/* Student Information */}
            <Card className="mb-6">
              <div className="mb-5">
                <h2 className="text-lg font-semibold text-primary-dark">
                  Student Information
                </h2>

                <p className="mt-1 text-sm text-neutral">
                  Your information used for this remuneration claim.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

                <div>
                  <p className="text-sm text-neutral">
                    Student Number
                  </p>

                  <p className="mt-1 font-semibold text-gray-800">
                    {student.studentNumber}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-neutral">
                    Full Name
                  </p>

                  <p className="mt-1 font-semibold text-gray-800">
                    {student.fullName}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-neutral">
                    Banking Details
                  </p>

                  <p className="mt-1 font-semibold text-green-700">
                    {student.bankingStatus}
                  </p>
                </div>

              </div>
            </Card>

            {/* Claim Period */}
            <Card className="mb-6">
              <div className="mb-5">
                <h2 className="text-lg font-semibold text-primary-dark">
                  Claim Period
                </h2>

                <p className="mt-1 text-sm text-neutral">
                  This claim includes all verified Assistant work sessions
                  available for the current claim period.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                <div>
                  <p className="text-sm text-neutral">
                    Period Start
                  </p>

                  <p className="mt-1 font-semibold text-gray-800">
                    02 September 2026
                  </p>
                </div>

                <div>
                  <p className="text-sm text-neutral">
                    Period End
                  </p>

                  <p className="mt-1 font-semibold text-gray-800">
                    05 September 2026
                  </p>
                </div>

              </div>
            </Card>

            {/* Assistant Appointments */}
            <Card className="mb-6">
              <div className="mb-5">
                <h2 className="text-lg font-semibold text-primary-dark">
                  Assistant Appointments
                </h2>

                <p className="mt-1 text-sm text-neutral">
                  All approved Assistant appointments with verified work
                  included in this claim.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[750px]">

                  <thead>
                    <tr className="border-b border-gray-200 text-left">

                      <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                        Module
                      </th>

                      <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                        Lecturer
                      </th>

                      <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                        Hourly Rate
                      </th>

                      <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                        Hours
                      </th>

                      <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                        Amount
                      </th>

                    </tr>
                  </thead>

                  <tbody>
                    {getUniqueModules().map((moduleCode) => {
                      const appointment = appointments.find(
                        (item) => item.moduleCode === moduleCode
                      );

                      if (!appointment) {
                        return null;
                      }

                      return (
                        <tr
                          key={moduleCode}
                          className="border-b border-gray-100 last:border-b-0"
                        >

                          <td className="px-4 py-4 text-sm font-medium text-primary-dark">
                            {appointment.moduleCode} -{' '}
                            {appointment.moduleName}
                          </td>

                          <td className="px-4 py-4 text-sm text-gray-700">
                            {appointment.lecturer}
                          </td>

                          <td className="px-4 py-4 text-sm text-gray-700">
                            {formatAmount(appointment.hourlyRate)}
                          </td>

                          <td className="px-4 py-4 text-sm font-medium text-gray-800">
                            {getModuleTotalHours(moduleCode).toFixed(2)}
                          </td>

                          <td className="px-4 py-4 text-sm font-medium text-gray-800">
                            {formatAmount(getModuleAmount(moduleCode))}
                          </td>

                        </tr>
                      );
                    })}
                  </tbody>

                </table>
              </div>
            </Card>

            {/* Approved Work Sessions */}
            <Card className="mb-6">
              <div className="mb-5">
                <h2 className="text-lg font-semibold text-primary-dark">
                  Approved Work Sessions
                </h2>

                <p className="mt-1 text-sm text-neutral">
                  All verified work sessions from your Assistant appointments
                  are automatically included in this claim.
                </p>
              </div>

              {approvedSessions.length === 0 ? (

                <div className="rounded-lg border border-dashed border-gray-300 px-6 py-10 text-center">

                  <h3 className="text-lg font-semibold text-gray-700">
                    No Approved Work Sessions
                  </h3>

                  <p className="mt-2 text-sm text-neutral">
                    You do not have any verified work sessions available for
                    claiming.
                  </p>

                  <button
                    type="button"
                    onClick={() => navigate('/work-tracking')}
                    className="mt-4 rounded-lg bg-primary px-5 py-2.5 font-medium text-white transition hover:bg-primary-dark"
                  >
                    View Work Tracking
                  </button>

                </div>

              ) : (

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[850px]">

                    <thead>
                      <tr className="border-b border-gray-200 text-left">

                        <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                          Date
                        </th>

                        <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                          Module
                        </th>

                        <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                          Activity
                        </th>

                        <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                          Time
                        </th>

                        <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                          Hours
                        </th>

                        <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                          Status
                        </th>

                      </tr>
                    </thead>

                    <tbody>
                      {approvedSessions.map((session) => (
                        <tr
                          key={session.id}
                          className="border-b border-gray-100 last:border-b-0"
                        >

                          <td className="px-4 py-4 text-sm text-gray-700">
                            {formatDate(session.date)}
                          </td>

                          <td className="px-4 py-4 text-sm font-medium text-primary-dark">
                            {session.moduleCode}
                          </td>

                          <td className="px-4 py-4 text-sm text-gray-700">
                            {session.activity}
                          </td>

                          <td className="px-4 py-4 text-sm text-gray-700">
                            {session.startTime} - {session.endTime}
                          </td>

                          <td className="px-4 py-4 text-sm font-medium text-gray-800">
                            {session.hours.toFixed(2)}
                          </td>

                          <td className="px-4 py-4">
                            <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                              {session.status}
                            </span>
                          </td>

                        </tr>
                      ))}
                    </tbody>

                  </table>
                </div>

              )}
            </Card>

            {/* Claim Calculation */}
            <Card className="mb-6">
              <div className="mb-5">
                <h2 className="text-lg font-semibold text-primary-dark">
                  Claim Calculation
                </h2>

                <p className="mt-1 text-sm text-neutral">
                  The total claim amount is automatically calculated from all
                  verified work sessions included in this claim.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

                <div className="rounded-lg bg-off-white p-5">
                  <p className="text-sm text-neutral">
                    Total Approved Hours
                  </p>

                  <p className="mt-2 text-2xl font-bold text-primary-dark">
                    {totalHours.toFixed(2)}
                  </p>
                </div>

                <div className="rounded-lg bg-off-white p-5">
                  <p className="text-sm text-neutral">
                    Modules Included
                  </p>

                  <p className="mt-2 text-2xl font-bold text-primary-dark">
                    {getUniqueModules().length}
                  </p>
                </div>

                <div className="rounded-lg bg-off-white p-5">
                  <p className="text-sm text-neutral">
                    Total Claim Amount
                  </p>

                  <p className="mt-2 text-2xl font-bold text-primary-dark">
                    {formatAmount(totalClaimAmount)}
                  </p>
                </div>

              </div>

              {/* Claim Breakdown */}
              <div className="mt-5 rounded-lg border border-gray-200 bg-white p-5">

                <p className="mb-4 text-sm font-semibold text-primary-dark">
                  Claim Breakdown
                </p>

                <div className="space-y-3">

                  {getUniqueModules().map((moduleCode) => (
                    <div
                      key={moduleCode}
                      className="flex flex-col justify-between gap-2 border-b border-gray-100 pb-3 last:border-b-0 sm:flex-row"
                    >

                      <div>
                        <p className="font-medium text-gray-800">
                          {moduleCode}
                        </p>

                        <p className="text-sm text-neutral">
                          {getModuleTotalHours(moduleCode).toFixed(2)} hours
                        </p>
                      </div>

                      <p className="font-semibold text-gray-800">
                        {formatAmount(getModuleAmount(moduleCode))}
                      </p>

                    </div>
                  ))}

                </div>
              </div>

              {/* Total Calculation */}
              <div className="mt-5 rounded-lg border border-gray-200 bg-white p-4">

                <p className="text-sm text-neutral">
                  Total Calculation
                </p>

                <p className="mt-1 font-semibold text-gray-800">
                  Total approved hours across all modules ={' '}
                  {totalHours.toFixed(2)} hours
                </p>

                <p className="mt-1 font-semibold text-primary-dark">
                  Total Claim Amount = {formatAmount(totalClaimAmount)}
                </p>

              </div>
            </Card>

            {/* Submit Claim */}
            {!claimSubmitted && approvedSessions.length > 0 && (
              <Card>

                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

                  <div>
                    <h2 className="text-lg font-semibold text-primary-dark">
                      Submit Remuneration Claim
                    </h2>

                    <p className="mt-1 text-sm text-neutral">
                      Review all claim information before submitting it for
                      verification.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleSubmitClaim}
                    className="rounded-lg bg-primary px-6 py-3 font-medium text-white transition hover:bg-primary-dark"
                  >
                    Submit Claim
                  </button>

                </div>

              </Card>
            )}

          </div>
        </main>
      </div>
    </div>
  );
};

export default GenerateNewClaim;
