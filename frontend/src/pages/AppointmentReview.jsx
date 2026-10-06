import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import { apiGet, apiPatch } from '../api';

const AppointmentReview = () => {
  const navigate = useNavigate();
  const { position_id } = useParams();

  const [appointment, setAppointment] = useState(null);
  const [decision, setDecision] = useState('');
  const [comments, setComments] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await apiGet(
          `/admin/appointments/fetch/${position_id}`
        );

        if (!response?.position) {
          setError('Appointment not found.');
          return;
        }

        setAppointment(response.position);
      } catch (err) {
        console.error('Failed to fetch appointment:', err);
        setError(err.message || 'Failed to load appointment.');
      } finally {
        setLoading(false);
      }
    };

    if (position_id) {
      fetchAppointment();
    } else {
      setLoading(false);
      setError('No position ID was provided.');
    }
  }, [position_id]);

  const handleBack = () => {
    navigate('/appointment-approvals');
  };

  const handleDecision = (selectedDecision) => {
    setDecision(selectedDecision);
  };

  const handleSubmitDecision = async (event) => {
    event.preventDefault();

    if (!decision || !position_id) {
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      await apiPatch(
        `/admin/appointments/review/${position_id}`,
        {
          action: decision,
          comment: comments,
        }
      );

      setSubmitted(true);

      setAppointment((current) => ({
        ...current,
        positionStatus: decision,
        status: decision,
        adminComment: comments,
      }));
    } catch (err) {
      console.error('Failed to submit appointment decision:', err);
      setError(err.message || 'Failed to submit appointment decision.');
    } finally {
      setSubmitting(false);
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-off-white">
        <Navbar />

        <div className="flex">
          <Sidebar userRole="admin" />

          <main className="flex-1">
            <div className="bg-primary px-8 py-4">
              <h1 className="text-2xl font-semibold text-white font-poppins">
                Appointment Review
              </h1>
            </div>

            <div className="p-8">
              <Card>
                <p className="font-inter text-neutral">
                  Loading appointment details...
                </p>
              </Card>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error && !appointment) {
    return (
      <div className="min-h-screen bg-off-white">
        <Navbar />

        <div className="flex">
          <Sidebar userRole="admin" />

          <main className="flex-1">
            <div className="bg-primary px-8 py-4">
              <h1 className="text-2xl font-semibold text-white font-poppins">
                Appointment Review
              </h1>
            </div>

            <div className="p-8">
              <Card>
                <p className="font-inter text-red-600">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={handleBack}
                  className="mt-4 rounded-lg bg-primary px-5 py-2.5 font-inter font-medium text-white transition hover:bg-primary-dark"
                >
                  Back to Appointment Approvals
                </button>
              </Card>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const currentAppointment = appointment;

  const supportingDocuments =
    Array.isArray(currentAppointment.documents)
      ? currentAppointment.documents
      : [];

  const responsibilities =
    Array.isArray(currentAppointment.responsibilities)
      ? currentAppointment.responsibilities
      : [];

  return (
    <div className="min-h-screen bg-off-white">
      <Navbar />

      <div className="flex">
        <Sidebar userRole="admin" />

        <main className="flex-1">
          <div className="bg-primary px-8 py-4">
            <h1 className="text-2xl font-semibold text-white font-poppins">
              Appointment Review
            </h1>
          </div>

          <div className="p-8">
            {/* Error message */}
            {error && (
              <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
                <p className="text-sm font-inter text-red-600">
                  {error}
                </p>
              </div>
            )}

            {/* Appointment Overview */}
            <Card className="mb-6">
              <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-inter text-neutral">
                    Appointment Reference
                  </p>

                  <h2 className="mt-1 text-xl font-poppins font-semibold text-primary">
                    {currentAppointment.reference}
                  </h2>
                </div>

                <StatusBadge
                  status={
                    currentAppointment.positionStatus ||
                    currentAppointment.status
                  }
                />
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div>
                  <p className="text-sm font-inter text-neutral">
                    Submitted Date
                  </p>

                  <p className="mt-1 font-inter font-semibold text-dark">
                    {currentAppointment.submittedDate}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-inter text-neutral">
                    Appointment Status
                  </p>

                  <div className="mt-2">
                    <StatusBadge
                      status={
                        currentAppointment.positionStatus ||
                        currentAppointment.status
                      }
                    />
                  </div>
                </div>

                <div>
                  <p className="text-sm font-inter text-neutral">
                    Recommended Position
                  </p>

                  <p className="mt-1 font-inter font-semibold text-dark">
                    {currentAppointment.position}
                  </p>
                </div>
              </div>
            </Card>

            {/* Student Information */}
            <Card className="mb-6">
              <div className="mb-5">
                <h2 className="text-lg font-poppins font-semibold text-primary">
                  Student Information
                </h2>

                <p className="mt-1 text-sm font-inter text-neutral">
                  Student information associated with this appointment.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div>
                  <p className="text-sm font-inter text-neutral">
                    Student Number
                  </p>

                  <p className="mt-1 font-inter font-semibold text-dark">
                    {currentAppointment.studentNumber}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-inter text-neutral">
                    Full Name
                  </p>

                  <p className="mt-1 font-inter font-semibold text-dark">
                    {currentAppointment.studentName}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-inter text-neutral">
                    Email Address
                  </p>

                  <p className="mt-1 font-inter font-semibold text-dark">
                    {currentAppointment.email}
                  </p>
                </div>
              </div>
            </Card>

            {/* Application Information */}
            <Card className="mb-6">
              <div className="mb-5">
                <h2 className="text-lg font-poppins font-semibold text-primary">
                  Application Information
                </h2>

                <p className="mt-1 text-sm font-inter text-neutral">
                  Details of the appointment recommended by the lecturer.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div>
                  <p className="text-sm font-inter text-neutral">
                    Module
                  </p>

                  <p className="mt-1 font-inter font-semibold text-dark">
                    {currentAppointment.moduleCode} -{' '}
                    {currentAppointment.moduleName}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-inter text-neutral">
                    Lecturer
                  </p>

                  <p className="mt-1 font-inter font-semibold text-dark">
                    {currentAppointment.lecturer}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-inter text-neutral">
                    Position
                  </p>

                  <p className="mt-1 font-inter font-semibold text-dark">
                    {currentAppointment.position}
                  </p>
                </div>
              </div>
            </Card>

            {/* Supporting Documents */}
            <Card className="mb-6">
              <div className="mb-5">
                <h2 className="text-lg font-poppins font-semibold text-primary">
                  Supporting Documents
                </h2>

                <p className="mt-1 text-sm font-inter text-neutral">
                  Documents submitted as part of the appointment recommendation.
                </p>
              </div>

              {supportingDocuments.length === 0 ? (
                <p className="text-sm font-inter text-neutral">
                  No supporting documents available.
                </p>
              ) : (
                <div className="space-y-3">
                  {supportingDocuments.map((document, index) => (
                    <div
                      key={document.id || index}
                      className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 md:flex-row md:items-center md:justify-between"
                    >
                      <div>
                        <p className="font-inter font-medium text-dark">
                          {document.name}
                        </p>

                        <p className="mt-1 text-sm font-inter text-neutral">
                          {document.type}
                        </p>
                      </div>

                      {document.documentUrl && (
                        <button
                          type="button"
                          onClick={() =>
                            window.open(
                              document.documentUrl,
                              '_blank',
                              'noopener,noreferrer'
                            )
                          }
                          className="font-inter font-medium text-primary transition hover:text-primary-dark"
                        >
                          View Document
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Lecturer Recommendation */}
            <Card className="mb-6">
              <div className="mb-5">
                <h2 className="text-lg font-poppins font-semibold text-primary">
                  Lecturer Recommendation
                </h2>

                <p className="mt-1 text-sm font-inter text-neutral">
                  Recommendation and comments submitted by the lecturer.
                </p>
              </div>

              <div className="rounded-lg bg-off-white p-5">
                <p className="text-sm font-inter leading-6 text-dark">
                  The student is recommended for appointment as a{' '}
                  {currentAppointment.position || 'Student Assistant'} for{' '}
                  {currentAppointment.moduleCode}. The student is considered
                  suitable for the responsibilities associated with this
                  appointment.
                </p>
              </div>
            </Card>

            {/* Appointment Details */}
            <Card className="mb-6">
              <div className="mb-5">
                <h2 className="text-lg font-poppins font-semibold text-primary">
                  Proposed Appointment Details
                </h2>

                <p className="mt-1 text-sm font-inter text-neutral">
                  Appointment information proposed by the lecturer.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div>
                  <p className="text-sm font-inter text-neutral">
                    Position
                  </p>

                  <p className="mt-1 font-inter font-semibold text-dark">
                    {currentAppointment.position}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-inter text-neutral">
                    Approved Working-Hour Limit
                  </p>

                  <p className="mt-1 font-inter font-semibold text-dark">
                    {currentAppointment.hoursLimit} hours per week
                  </p>
                </div>

                <div>
                  <p className="text-sm font-inter text-neutral">
                    Appointment Status
                  </p>

                  <p className="mt-1 font-inter font-semibold text-dark">
                    {currentAppointment.positionStatus ||
                      currentAppointment.status}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <p className="mb-3 text-sm font-inter font-medium text-dark">
                  Assigned Responsibilities
                </p>

                {responsibilities.length === 0 ? (
                  <p className="text-sm font-inter text-neutral">
                    No responsibilities available.
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {responsibilities.map((responsibility, index) => (
                      <li
                        key={responsibility.id || index}
                        className="rounded-lg bg-off-white px-4 py-3 text-sm font-inter text-dark"
                      >
                        • {responsibility.description}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Card>

            {/* Administrator Decision */}
            <Card>
              <div className="mb-5">
                <h2 className="text-lg font-poppins font-semibold text-primary">
                  Administrator Decision
                </h2>

                <p className="mt-1 text-sm font-inter text-neutral">
                  Select an action for this appointment recommendation.
                </p>
              </div>

              {submitted ? (
                <div className="rounded-lg border border-gray-200 bg-off-white p-5">
                  <p className="font-inter font-semibold text-primary">
                    {getDecisionText()}
                  </p>

                  <p className="mt-2 text-sm font-inter text-neutral">
                    The relevant student and lecturer have been notified of
                    this decision.
                  </p>

                  <button
                    type="button"
                    onClick={handleBack}
                    className="mt-4 rounded-lg bg-primary px-5 py-2.5 font-inter font-medium text-white transition hover:bg-primary-dark"
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
                      className={`rounded-lg border px-5 py-4 text-left font-inter transition ${
                        decision === 'Approved'
                          ? 'border-primary bg-primary text-white'
                          : 'border-gray-200 bg-white text-dark hover:border-primary'
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
                      className={`rounded-lg border px-5 py-4 text-left font-inter transition ${
                        decision === 'Rejected'
                          ? 'border-primary bg-primary text-white'
                          : 'border-gray-200 bg-white text-dark hover:border-primary'
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
                      className={`rounded-lg border px-5 py-4 text-left font-inter transition ${
                        decision === 'Returned'
                          ? 'border-primary bg-primary text-white'
                          : 'border-gray-200 bg-white text-dark hover:border-primary'
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
                      className="block text-sm font-inter font-medium text-dark"
                    >
                      Administrator Comments
                    </label>

                    <textarea
                      id="comments"
                      value={comments}
                      onChange={(event) => setComments(event.target.value)}
                      rows="4"
                      placeholder="Enter comments or reasons for your decision..."
                      className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-inter text-dark outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      onClick={handleBack}
                      disabled={submitting}
                      className="rounded-lg border border-gray-300 px-5 py-2.5 font-inter font-medium text-dark transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={!decision || submitting}
                      className="rounded-lg bg-primary px-5 py-2.5 font-inter font-medium text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {submitting ? 'Submitting...' : 'Submit Decision'}
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