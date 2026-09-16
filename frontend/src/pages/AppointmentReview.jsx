import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';

const AppointmentReview = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const appointment = location.state?.appointment;

  // Fallback data for testing the page directly
  const defaultAppointment = {
    id: 1,
    reference: 'APP-2026-001',
    studentNumber: '12345678',
    studentName: 'Tswarelo Motloung',
    email: 'student@nwu.ac.za',
    moduleCode: 'CMPG311',
    moduleName: 'Databases',
    lecturer: 'Dr. M. Mokoena',
    position: 'Student Assistant',
    hoursLimit: 10,
    submittedDate: '13 September 2026',
    status: 'Pending',
  };

  const currentAppointment = appointment || defaultAppointment;

  const [decision, setDecision] = useState('');
  const [comments, setComments] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const supportingDocuments = [
    {
      id: 1,
      name: 'Student Application',
      type: 'Application Form',
    },
    {
      id: 2,
      name: 'Academic Record',
      type: 'Supporting Document',
    },
    {
      id: 3,
      name: 'Lecturer Recommendation',
      type: 'Recommendation',
    },
  ];

  const responsibilities = [
    'Assist students during scheduled consultations',
    'Provide tutorial assistance where required',
    'Assist with practical sessions and coursework',
    'Provide feedback to the module lecturer',
  ];

  const handleBack = () => {
    navigate('/appointment-approvals');
  };

  const handleDecision = (selectedDecision) => {
    setDecision(selectedDecision);
  };

  const handleSubmitDecision = (event) => {
    event.preventDefault();

    if (!decision) {
      return;
    }

    setSubmitted(true);
  };

  const getDecisionText = () => {
    if (decision === 'Approved') {
      return 'Appointment approved successfully.';
    }

    if (decision === 'Rejected') {
      return 'Appointment rejected successfully.';
    }

    if (decision === 'Returned') {
      return 'Appointment returned to the lecturer for revision.';
    }

    return '';
  };

  return (
    <div className="min-h-screen bg-off-white">

      <Navbar />

      <div className="flex">

        <Sidebar userRole="admin" />

        <main className="flex-1">

          {/* Page Header */}
          <div className="bg-primary px-8 py-4">
            <h1 className="text-2xl font-semibold text-white">
              Appointment Review
            </h1>
          </div>

          <div className="p-8">

            {/* Back Button */}
            <div className="mb-6">
              <button
                type="button"
                onClick={handleBack}
                className="font-medium text-primary transition hover:text-primary-dark"
              >
                ← Back to Appointment Approvals
              </button>
            </div>

            {/* Appointment Overview */}
            <Card className="mb-6">

              <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                <div>
                  <p className="text-sm text-neutral">
                    Appointment Reference
                  </p>

                  <h2 className="mt-1 text-xl font-semibold text-primary-dark">
                    {currentAppointment.reference}
                  </h2>
                </div>

                <StatusBadge status={currentAppointment.status} />

              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

                <div>
                  <p className="text-sm text-neutral">
                    Submitted Date
                  </p>

                  <p className="mt-1 font-semibold text-gray-800">
                    {currentAppointment.submittedDate}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-neutral">
                    Appointment Status
                  </p>

                  <div className="mt-2">
                    <StatusBadge status={currentAppointment.status} />
                  </div>
                </div>

                <div>
                  <p className="text-sm text-neutral">
                    Recommended Position
                  </p>

                  <p className="mt-1 font-semibold text-gray-800">
                    {currentAppointment.position}
                  </p>
                </div>

              </div>

            </Card>

            {/* Student Information */}
            <Card className="mb-6">

              <div className="mb-5">
                <h2 className="text-lg font-semibold text-primary-dark">
                  Student Information
                </h2>

                <p className="mt-1 text-sm text-neutral">
                  Student information associated with this appointment.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

                <div>
                  <p className="text-sm text-neutral">
                    Student Number
                  </p>

                  <p className="mt-1 font-semibold text-gray-800">
                    {currentAppointment.studentNumber}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-neutral">
                    Full Name
                  </p>

                  <p className="mt-1 font-semibold text-gray-800">
                    {currentAppointment.studentName}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-neutral">
                    Email Address
                  </p>

                  <p className="mt-1 font-semibold text-gray-800">
                    {currentAppointment.email}
                  </p>
                </div>

              </div>

            </Card>

            {/* Application Information */}
            <Card className="mb-6">

              <div className="mb-5">
                <h2 className="text-lg font-semibold text-primary-dark">
                  Application Information
                </h2>

                <p className="mt-1 text-sm text-neutral">
                  Details of the appointment recommended by the lecturer.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

                <div>
                  <p className="text-sm text-neutral">
                    Module
                  </p>

                  <p className="mt-1 font-semibold text-gray-800">
                    {currentAppointment.moduleCode} -{' '}
                    {currentAppointment.moduleName}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-neutral">
                    Lecturer
                  </p>

                  <p className="mt-1 font-semibold text-gray-800">
                    {currentAppointment.lecturer}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-neutral">
                    Position
                  </p>

                  <p className="mt-1 font-semibold text-gray-800">
                    {currentAppointment.position}
                  </p>
                </div>

              </div>

            </Card>

            {/* Supporting Documents */}
            <Card className="mb-6">

              <div className="mb-5">
                <h2 className="text-lg font-semibold text-primary-dark">
                  Supporting Documents
                </h2>

                <p className="mt-1 text-sm text-neutral">
                  Documents submitted as part of the appointment recommendation.
                </p>
              </div>

              <div className="space-y-3">

                {supportingDocuments.map((document) => (
                  <div
                    key={document.id}
                    className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 md:flex-row md:items-center md:justify-between"
                  >

                    <div>
                      <p className="font-medium text-gray-800">
                        {document.name}
                      </p>

                      <p className="mt-1 text-sm text-neutral">
                        {document.type}
                      </p>
                    </div>

                    <button
                      type="button"
                      className="font-medium text-primary hover:text-primary-dark"
                    >
                      View Document
                    </button>

                  </div>
                ))}

              </div>

            </Card>

            {/* Lecturer Recommendation */}
            <Card className="mb-6">

              <div className="mb-5">
                <h2 className="text-lg font-semibold text-primary-dark">
                  Lecturer Recommendation
                </h2>

                <p className="mt-1 text-sm text-neutral">
                  Recommendation and comments submitted by the lecturer.
                </p>
              </div>

              <div className="rounded-lg bg-off-white p-5">

                <p className="text-sm leading-6 text-gray-700">
                  The student is recommended for appointment as a Student
                  Assistant for {currentAppointment.moduleCode}. The student
                  demonstrated good academic performance and is considered
                  suitable to assist with student consultations, tutorials,
                  and practical activities.
                </p>

              </div>

            </Card>

            {/* Appointment Details */}
            <Card className="mb-6">

              <div className="mb-5">
                <h2 className="text-lg font-semibold text-primary-dark">
                  Proposed Appointment Details
                </h2>

                <p className="mt-1 text-sm text-neutral">
                  Appointment information proposed by the lecturer.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

                <div>
                  <p className="text-sm text-neutral">
                    Position
                  </p>

                  <p className="mt-1 font-semibold text-gray-800">
                    {currentAppointment.position}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-neutral">
                    Approved Working-Hour Limit
                  </p>

                  <p className="mt-1 font-semibold text-gray-800">
                    {currentAppointment.hoursLimit} hours per week
                  </p>
                </div>

                <div>
                  <p className="text-sm text-neutral">
                    Appointment Status
                  </p>

                  <p className="mt-1 font-semibold text-gray-800">
                    Pending Administrator Approval
                  </p>
                </div>

              </div>

              <div className="mt-6">

                <p className="mb-3 text-sm font-medium text-gray-700">
                  Assigned Responsibilities
                </p>

                <ul className="space-y-2">

                  {responsibilities.map((responsibility, index) => (
                    <li
                      key={index}
                      className="rounded-lg bg-off-white px-4 py-3 text-sm text-gray-700"
                    >
                      • {responsibility}
                    </li>
                  ))}

                </ul>

              </div>

            </Card>

            {/* Decision */}
            <Card>

              <div className="mb-5">
                <h2 className="text-lg font-semibold text-primary-dark">
                  Administrator Decision
                </h2>

                <p className="mt-1 text-sm text-neutral">
                  Select an action for this appointment recommendation.
                </p>
              </div>

              {submitted ? (

                <div className="rounded-lg border border-gray-200 bg-off-white p-5">

                  <p className="font-semibold text-primary-dark">
                    {getDecisionText()}
                  </p>

                  <p className="mt-2 text-sm text-neutral">
                    The relevant student and lecturer would be notified of
                    this decision.
                  </p>

                  <button
                    type="button"
                    onClick={handleBack}
                    className="mt-4 rounded-lg bg-primary px-5 py-2.5 font-medium text-white transition hover:bg-primary-dark"
                  >
                    Back to Appointment Approvals
                  </button>

                </div>

              ) : (

                <form onSubmit={handleSubmitDecision}>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                    <button
                      type="button"
                      onClick={() => handleDecision('Approved')}
                      className={`rounded-lg border px-5 py-4 text-left transition ${
                        decision === 'Approved'
                          ? 'border-primary bg-primary text-white'
                          : 'border-gray-200 bg-white text-gray-800 hover:border-primary'
                      }`}
                    >
                      <p className="font-semibold">
                        Approve Appointment
                      </p>

                      <p
                        className={`mt-1 text-sm ${
                          decision === 'Approved'
                            ? 'text-white'
                            : 'text-neutral'
                        }`}
                      >
                        Approve the recommended appointment.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDecision('Rejected')}
                      className={`rounded-lg border px-5 py-4 text-left transition ${
                        decision === 'Rejected'
                          ? 'border-primary bg-primary text-white'
                          : 'border-gray-200 bg-white text-gray-800 hover:border-primary'
                      }`}
                    >
                      <p className="font-semibold">
                        Reject Appointment
                      </p>

                      <p
                        className={`mt-1 text-sm ${
                          decision === 'Rejected'
                            ? 'text-white'
                            : 'text-neutral'
                        }`}
                      >
                        Reject the appointment recommendation.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDecision('Returned')}
                      className={`rounded-lg border px-5 py-4 text-left transition ${
                        decision === 'Returned'
                          ? 'border-primary bg-primary text-white'
                          : 'border-gray-200 bg-white text-gray-800 hover:border-primary'
                      }`}
                    >
                      <p className="font-semibold">
                        Return for Revision
                      </p>

                      <p
                        className={`mt-1 text-sm ${
                          decision === 'Returned'
                            ? 'text-white'
                            : 'text-neutral'
                        }`}
                      >
                        Return the recommendation to the lecturer.
                      </p>
                    </button>

                  </div>

                  <div className="mt-6">

                    <label
                      htmlFor="comments"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Administrator Comments
                    </label>

                    <textarea
                      id="comments"
                      value={comments}
                      onChange={(event) => setComments(event.target.value)}
                      rows="4"
                      placeholder="Enter comments or reasons for your decision..."
                      className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                    />

                  </div>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">

                    <button
                      type="button"
                      onClick={handleBack}
                      className="rounded-lg border border-gray-300 px-5 py-2.5 font-medium text-gray-700 transition hover:bg-gray-100"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={!decision}
                      className="rounded-lg bg-primary px-5 py-2.5 font-medium text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Submit Decision
                    </button>

                  </div>

                </form>

              )}

            </Card>

          </div>
        </main>
      </div>
    </div>
  );
};

export default AppointmentReview;