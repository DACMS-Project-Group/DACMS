import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import { apiGet, apiPost } from '../api';

const GenerateNewClaim = () => {
  document.title = 'AACMS - Generate New Claim';
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [positions, setPositions] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [claims, setClaims] = useState([]);
  const [student, setStudent] = useState(null);

  const [selectedApplicationId, setSelectedApplicationId] = useState('');
  const [loading, setLoading] = useState(true);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState('');
  const [claimSubmitted, setClaimSubmitted] = useState(false);
  const [submittedClaim, setSubmittedClaim] = useState(null);

  /*
   * Load the student's applications, active Demi positions,
   * and authenticated student profile.
   */
  useEffect(() => {
    const loadClaimData = async () => {
      try {
        setLoading(true);
        setError('');

        const [
          applicationsResponse,
          positionsResponse,
          claimsResponse,
          studentResponse,
        ] = await Promise.all([
          apiGet('/student/applications'),
          apiGet('/student/positions'),
          apiGet('/student/claims'),
          apiGet('/student/profile/'),
        ]);

        const applicationData =
          Array.isArray(applicationsResponse)
            ? applicationsResponse
            : applicationsResponse?.applications || [];

        const positionData =
          Array.isArray(positionsResponse)
            ? positionsResponse
            : positionsResponse?.positions || [];

        const claimData =
          Array.isArray(claimsResponse)
            ? claimsResponse
            : claimsResponse?.claims || [];

        const studentData =
          studentResponse?.student ?? studentResponse;

        setApplications(applicationData);
        setPositions(positionData);
        setClaims(claimData);
        setStudent(studentData);

        /*
         * Select the first application that has a matching
         * Demi position.
         */
        const firstValidApplication = applicationData.find((application) => {
          const applicationId =
            application.application_id ??
            application.ApplicationID ??
            application.id;

          return positionData.some((position) => {
            const positionApplicationId =
              position.application_id ??
              position.ApplicationID;

            return (
              String(positionApplicationId) ===
              String(applicationId)
            );
          });
        });

        if (firstValidApplication) {
          const applicationId =
            firstValidApplication.application_id ??
            firstValidApplication.ApplicationID ??
            firstValidApplication.id;

          setSelectedApplicationId(String(applicationId));
        }
      } catch (err) {
        setError(
          err.message || 'Unable to load your claim information.'
        );
      } finally {
        setLoading(false);
      }
    };

    loadClaimData();
  }, []);

  /*
   * Get ApplicationID consistently.
   */
  const getApplicationId = (application) => {
    return (
      application.application_id ??
      application.ApplicationID ??
      application.id
    );
  };

  /*
   * Get PositionID consistently.
   */
  const getPositionId = (position) => {
    return (
      position.position_id ??
      position.PositionID ??
      position.id
    );
  };

  /*
   * Get the selected application.
   */
  const selectedApplication = useMemo(() => {
    return applications.find(
      (application) =>
        String(getApplicationId(application)) ===
        String(selectedApplicationId)
    );
  }, [applications, selectedApplicationId]);

  /*
   * Find the active Demi Position belonging to the selected application.
   */
  const selectedPosition = useMemo(() => {
    if (!selectedApplicationId) {
      return null;
    }

    return (
      positions.find((position) => {
        const positionApplicationId =
          position.application_id ??
          position.ApplicationID;

        return (
          String(positionApplicationId) ===
          String(selectedApplicationId)
        );
      }) || null
    );
  }, [positions, selectedApplicationId]);

  /*
   * Load Work Sessions whenever the selected Demi Position changes.
   */
  useEffect(() => {
    const loadSessions = async () => {
      if (!selectedPosition) {
        setSessions([]);
        return;
      }

      const positionId = getPositionId(selectedPosition);

      if (!positionId) {
        setSessions([]);
        return;
      }

      try {
        setSessionsLoading(true);
        setError('');

        const response = await apiGet(
          `/student/positions/${positionId}/sessions`
        );

        const sessionData =
          Array.isArray(response)
            ? response
            : response?.sessions || [];

        setSessions(sessionData);
      } catch (err) {
        setSessions([]);
        setError(
          err.message || 'Unable to load your work sessions.'
        );
      } finally {
        setSessionsLoading(false);
      }
    };

    loadSessions();
  }, [selectedPosition]);

  /*
   * Only completed and lecturer-approved work sessions
   * are available for claiming.
   */
  const approvedSessions = useMemo(() => {
    const applicationClaims = claims.filter((claim) => {
      const claimApplicationId =
        claim.application_id ??
        claim.ApplicationID;

      return String(claimApplicationId) === String(selectedApplicationId);
    });
    const latestClaimSubmission = applicationClaims.reduce((latest, claim) => {
      const submittedAt = new Date(
        claim.submission_date ??
        claim.SubmissionDate
      ).getTime();

      return Number.isFinite(submittedAt) && submittedAt > latest
        ? submittedAt
        : latest;
    }, 0);

    return sessions.filter((session) => {
      const lecturerApproval =
        session.lecturer_approval ??
        session.LecturerApproval;

      const endTime =
        session.end_time ??
        session.EndTime;
      const endedAt = endTime ? new Date(endTime).getTime() : NaN;

      return lecturerApproval === true &&
        Number.isFinite(endedAt) &&
        (!latestClaimSubmission || endedAt > latestClaimSubmission);
    });
  }, [claims, selectedApplicationId, sessions]);

  /*
   * Position information.
   */
  const moduleCode =
    selectedPosition?.module_code ??
    selectedPosition?.ModuleCode ??
    selectedApplication?.module_code ??
    selectedApplication?.ModuleCode ??
    '';

  const moduleName =
    selectedPosition?.module_name ??
    selectedPosition?.ModuleName ??
    selectedApplication?.module_name ??
    selectedApplication?.ModuleName ??
    '';

  const lecturerFirstName =
    selectedPosition?.lecturer_f_name ??
    selectedPosition?.LecturerFName ??
    '';

  const lecturerLastName =
    selectedPosition?.lecturer_l_name ??
    selectedPosition?.LecturerLName ??
    '';

  const lecturer =
    selectedPosition?.lecturer ??
    selectedPosition?.lecturer_name ??
    selectedPosition?.LecturerName ??
    (`${lecturerFirstName} ${lecturerLastName}`.trim() || '-');

  /*
   * Payment Scale → StandardHourlyRate.
   */
  const hourlyRate = Number(
    selectedPosition?.standard_hourly_rate ??
    selectedPosition?.StandardHourlyRate ??
    0
  );

  /*
   * Calculate total approved hours.
   */
  const totalHours = approvedSessions.reduce(
    (total, session) => {
      const hours = Number(
        session.total_hours ??
        session.TotalHoursWorked ??
        0
      );

      return total + hours;
    },
    0
  );

  /*
   * Display calculation.
   * The backend remains the official source of truth
   * when the claim is created.
   */
  const totalClaimAmount = totalHours * hourlyRate;

  /*
   * Earliest approved session date.
   */
  const periodStart = useMemo(() => {
    if (approvedSessions.length === 0) {
      return null;
    }

    const dates = approvedSessions
      .map((session) => {
        const startTime =
          session.start_time ??
          session.StartTime;

        return startTime ? new Date(startTime) : null;
      })
      .filter(Boolean)
      .sort((a, b) => a - b);

    return dates[0] || null;
  }, [approvedSessions]);

  /*
   * Latest approved session date.
   */
  const periodEnd = useMemo(() => {
    if (approvedSessions.length === 0) {
      return null;
    }

    const dates = approvedSessions
      .map((session) => {
        const endTime =
          session.end_time ??
          session.EndTime;

        return endTime ? new Date(endTime) : null;
      })
      .filter(Boolean)
      .sort((a, b) => b - a);

    return dates[0] || null;
  }, [approvedSessions]);

  /*
   * Format dates.
   */
  const formatDate = (date) => {
    if (!date) {
      return '-';
    }

    return new Date(date).toLocaleDateString('en-ZA', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  /*
   * Format session date.
   */
  const formatSessionDate = (date) => {
    if (!date) {
      return '-';
    }

    return new Date(date).toLocaleDateString('en-ZA', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  /*
   * Format time.
   */
  const formatTime = (date) => {
    if (!date) {
      return '-';
    }

    return new Date(date).toLocaleTimeString('en-ZA', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  /*
   * Format currency.
   */
  const formatAmount = (amount) => {
    return `R ${Number(amount || 0).toLocaleString('en-ZA', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  /*
   * Change the selected application.
   */
  const handleApplicationChange = (event) => {
    setSelectedApplicationId(event.target.value);
    setClaimSubmitted(false);
    setSubmittedClaim(null);
    setError('');
  };

  /*
   * Submit the claim.
   *
   * Backend route:
   * POST /api/student/claims/create
   *
   * Only ApplicationID is sent.
   */
  const handleSubmitClaim = async () => {
    if (!selectedApplicationId) {
      setError('Please select an Assistant appointment.');
      return;
    }

    if (!selectedPosition) {
      setError(
        'No active Assistant appointment is available for this application.'
      );
      return;
    }

    if (approvedSessions.length === 0) {
      setError(
        'No approved work sessions are available to claim yet.'
      );
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      const response = await apiPost(
        '/student/claims/create',
        {
          applicationId: Number(selectedApplicationId),
        }
      );

      setSubmittedClaim(response?.claim || response || null);
      setClaimSubmitted(true);
    } catch (err) {
      setError(
        err.message || 'Unable to submit the remuneration claim.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  /*
   * Return to Claims.
   */
  const handleBackToClaims = () => {
    navigate('/claims');
  };

  /*
   * Student information.
   */
  const studentFirstName =
    student?.first_name ??
    student?.FName ??
    '';

  const studentLastName =
    student?.last_name ??
    student?.LName ??
    '';

  const studentName =
    `${studentFirstName} ${studentLastName}`.trim() || '-';

  const studentNumber =
    student?.student_number ??
    student?.StudentNumber ??
    '-';

  const studentEmail =
    student?.email ??
    student?.Email ??
    '-';

  const studentStudyLevel =
    student?.study_level ??
    student?.StudyLevel ??
    '-';

  /*
   * Account details.
   * These values are automatically retrieved from
   * the student's Student Profile.
   */
  const bankName =
    student?.bank_name ??
    student?.BankName ??
    '-';

  const accountNumber =
    student?.account_number ??
    student?.AccountNumber ??
    '-';

  const branchCode =
    student?.branch_code ??
    student?.BranchCode ??
    '-';

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
            <h1 className="text-2xl font-poppins font-semibold text-white">
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

            {/* Loading */}
            {loading && (
              <Card className="mb-6">
                <p className="text-sm text-neutral">
                  Loading your claim information...
                </p>
              </Card>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-5 py-4">
                <h3 className="font-semibold text-red-800">
                  Unable to continue
                </h3>

                <p className="mt-1 text-sm text-red-700">
                  {error}
                </p>
              </div>
            )}

            {/* Success Message */}
            {claimSubmitted && (
              <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-5 py-4">
                <h3 className="font-semibold text-green-800">
                  Claim Submitted Successfully
                </h3>

                <p className="mt-1 text-sm text-green-700">
                  Your remuneration claim has been submitted and is
                  awaiting verification.
                </p>

                {submittedClaim && (
                  <div className="mt-3 space-y-1 text-sm text-green-800">
                    <p>
                      <span className="font-medium">
                        Claim Reference:
                      </span>{' '}
                      {submittedClaim.reference_number ??
                        submittedClaim.ClaimReferenceNumber ??
                        '-'}
                    </p>

                    <p>
                      <span className="font-medium">
                        Amount:
                      </span>{' '}
                      {formatAmount(
                        submittedClaim.total_claim_amount ??
                        submittedClaim.TotalClaimAmount
                      )}
                    </p>

                    <p>
                      <span className="font-medium">
                        Status:
                      </span>{' '}
                      {submittedClaim.claim_status ??
                        submittedClaim.ClaimStatus ??
                        '-'}
                    </p>
                  </div>
                )}

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
                  Your authenticated student account is used for this
                  remuneration claim.
                </p>
              </div>

              {!student ? (
                <div className="rounded-lg border border-gray-200 bg-off-white px-5 py-4">
                  <p className="text-sm text-neutral">
                    Loading student information...
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                  <div>
                    <p className="text-sm text-neutral">
                      Student Name
                    </p>

                    <p className="mt-1 font-semibold text-gray-800">
                      {studentName}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-neutral">
                      Student Number
                    </p>

                    <p className="mt-1 font-semibold text-gray-800">
                      {studentNumber}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-neutral">
                      Email
                    </p>

                    <p className="mt-1 font-semibold text-gray-800">
                      {studentEmail}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-neutral">
                      Study Level
                    </p>

                    <p className="mt-1 font-semibold text-gray-800">
                      {studentStudyLevel}
                    </p>
                  </div>

                </div>
              )}
            </Card>

            {/* Account Details */}
            <Card className="mb-6">
              <div className="mb-5">
                <h2 className="text-lg font-semibold text-primary-dark">
                  Account Details
                </h2>

                <p className="mt-1 text-sm text-neutral">
                  Your banking details are automatically retrieved from
                  your Student Profile.
                </p>
              </div>

              {!student ? (
                <div className="rounded-lg border border-gray-200 bg-off-white px-5 py-4">
                  <p className="text-sm text-neutral">
                    Loading account details...
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

                  <div>
                    <p className="text-sm text-neutral">
                      Bank Name
                    </p>

                    <p className="mt-1 font-semibold text-gray-800">
                      {bankName}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-neutral">
                      Account Number
                    </p>

                    <p className="mt-1 font-semibold text-gray-800">
                      {accountNumber}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-neutral">
                      Branch Code
                    </p>

                    <p className="mt-1 font-semibold text-gray-800">
                      {branchCode}
                    </p>
                  </div>

                </div>
              )}
            </Card>

            {/* Claim Period */}
            <Card className="mb-6">
              <div className="mb-5">
                <h2 className="text-lg font-semibold text-primary-dark">
                  Claim Period
                </h2>

                <p className="mt-1 text-sm text-neutral">
                  The dates below show the range of approved work
                  sessions currently available for this claim.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                <div>
                  <p className="text-sm text-neutral">
                    Period Start
                  </p>

                  <p className="mt-1 font-semibold text-gray-800">
                    {formatDate(periodStart)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-neutral">
                    Period End
                  </p>

                  <p className="mt-1 font-semibold text-gray-800">
                    {formatDate(periodEnd)}
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
                  Select the Assistant appointment for which you want
                  to generate a remuneration claim.
                </p>
              </div>

              {applications.length === 0 ? (

                <div className="rounded-lg border border-dashed border-gray-300 px-6 py-10 text-center">
                  <h3 className="text-lg font-semibold text-gray-700">
                    No Applications Found
                  </h3>

                  <p className="mt-2 text-sm text-neutral">
                    You do not have any applications available for
                    remuneration claims.
                  </p>
                </div>

              ) : (

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[850px]">

                    <thead>
                      <tr className="border-b border-gray-200 text-left">

                        <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                          Select
                        </th>

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
                          Approved Hours
                        </th>

                      </tr>
                    </thead>

                    <tbody>
                      {applications.map((application) => {
                        const applicationId =
                          getApplicationId(application);

                        const position = positions.find(
                          (item) =>
                            String(
                              item.application_id ??
                              item.ApplicationID
                            ) === String(applicationId)
                        );

                        const applicationModuleCode =
                          position?.module_code ??
                          position?.ModuleCode ??
                          application.module_code ??
                          application.ModuleCode ??
                          '-';

                        const applicationModuleName =
                          position?.module_name ??
                          position?.ModuleName ??
                          application.module_name ??
                          application.ModuleName ??
                          '';

                        const applicationLecturerFirstName =
                          position?.lecturer_f_name ??
                          position?.LecturerFName ??
                          '';

                        const applicationLecturerLastName =
                          position?.lecturer_l_name ??
                          position?.LecturerLName ??
                          '';

                        const applicationLecturer =
                          position?.lecturer ??
                          position?.lecturer_name ??
                          position?.LecturerName ??
                          (`${applicationLecturerFirstName} ${applicationLecturerLastName}`.trim() || '-');

                        const applicationRate = Number(
                          position?.standard_hourly_rate ??
                          position?.StandardHourlyRate ??
                          0
                        );

                        const isSelected =
                          String(applicationId) ===
                          String(selectedApplicationId);

                        return (
                          <tr
                            key={applicationId}
                            className={`border-b border-gray-100 last:border-b-0 ${
                              isSelected ? 'bg-purple-50' : ''
                            }`}
                          >

                            <td className="px-4 py-4">
                              <input
                                type="radio"
                                name="selectedApplication"
                                value={applicationId}
                                checked={isSelected}
                                onChange={handleApplicationChange}
                                className="h-4 w-4"
                              />
                            </td>

                            <td className="px-4 py-4 text-sm font-medium text-primary-dark">
                              {applicationModuleCode}

                              {applicationModuleName
                                ? ` - ${applicationModuleName}`
                                : ''}
                            </td>

                            <td className="px-4 py-4 text-sm text-gray-700">
                              {applicationLecturer}
                            </td>

                            <td className="px-4 py-4 text-sm text-gray-700">
                              {position
                                ? formatAmount(applicationRate)
                                : '-'}
                            </td>

                            <td className="px-4 py-4 text-sm font-medium text-gray-800">
                              {isSelected
                                ? totalHours.toFixed(2)
                                : '-'}
                            </td>

                          </tr>
                        );
                      })}
                    </tbody>

                  </table>
                </div>

              )}
            </Card>

            {/* Approved Work Sessions */}
            <Card className="mb-6">
              <div className="mb-5">
                <h2 className="text-lg font-semibold text-primary-dark">
                  Approved Work Sessions
                </h2>

                <p className="mt-1 text-sm text-neutral">
                  Only completed work sessions that have been approved
                  by the lecturer are included in the claim.
                </p>
              </div>

              {sessionsLoading ? (

                <div className="rounded-lg border border-dashed border-gray-300 px-6 py-10 text-center">
                  <p className="text-sm text-neutral">
                    Loading approved work sessions...
                  </p>
                </div>

              ) : approvedSessions.length === 0 ? (

                <div className="rounded-lg border border-dashed border-gray-300 px-6 py-10 text-center">

                  <h3 className="text-lg font-semibold text-gray-700">
                    No Approved Work Sessions
                  </h3>

                  <p className="mt-2 text-sm text-neutral">
                    You do not have any completed work sessions
                    approved by your lecturer and available for
                    claiming.
                  </p>

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
                      {approvedSessions.map((session) => {
                        const startTime =
                          session.start_time ??
                          session.StartTime;

                        const endTime =
                          session.end_time ??
                          session.EndTime;

                        const activity =
                          session.activity_description ??
                          session.ActivityDescription ??
                          '-';

                        const hours = Number(
                          session.total_hours ??
                          session.TotalHoursWorked ??
                          0
                        );

                        const sessionId =
                          session.session_id ??
                          session.SessionID;

                        return (
                          <tr
                            key={sessionId}
                            className="border-b border-gray-100 last:border-b-0"
                          >

                            <td className="px-4 py-4 text-sm text-gray-700">
                              {formatSessionDate(startTime)}
                            </td>

                            <td className="px-4 py-4 text-sm font-medium text-primary-dark">
                              {moduleCode || '-'}
                            </td>

                            <td className="px-4 py-4 text-sm text-gray-700">
                              {activity}
                            </td>

                            <td className="px-4 py-4 text-sm text-gray-700">
                              {formatTime(startTime)} -{' '}
                              {formatTime(endTime)}
                            </td>

                            <td className="px-4 py-4 text-sm font-medium text-gray-800">
                              {hours.toFixed(2)}
                            </td>

                            <td className="px-4 py-4">
                              <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                                Verified
                              </span>
                            </td>

                          </tr>
                        );
                      })}
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
                  The total claim amount is calculated from your
                  approved work sessions and the hourly rate from the
                  Payment Scale connected to your Assistant position.
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
                    Hourly Rate
                  </p>

                  <p className="mt-2 text-2xl font-bold text-primary-dark">
                    {formatAmount(hourlyRate)}
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

                  <div className="flex flex-col justify-between gap-2 border-b border-gray-100 pb-3 sm:flex-row">

                    <div>
                      <p className="font-medium text-gray-800">
                        {moduleCode || 'Selected Module'}
                      </p>

                      <p className="text-sm text-neutral">
                        {totalHours.toFixed(2)} hours ×{' '}
                        {formatAmount(hourlyRate)}
                      </p>
                    </div>

                    <p className="font-semibold text-gray-800">
                      {formatAmount(totalClaimAmount)}
                    </p>

                  </div>

                </div>
              </div>

              {/* Total Calculation */}
              <div className="mt-5 rounded-lg border border-gray-200 bg-white p-4">

                <p className="text-sm text-neutral">
                  Total Calculation
                </p>

                <p className="mt-1 font-semibold text-gray-800">
                  {totalHours.toFixed(2)} hours ×{' '}
                  {formatAmount(hourlyRate)} ={' '}
                  {formatAmount(totalClaimAmount)}
                </p>

              </div>
            </Card>

            {/* Submit Claim */}
            {!claimSubmitted && (
              <Card>

                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

                  <div>
                    <h2 className="text-lg font-semibold text-primary-dark">
                      Submit Remuneration Claim
                    </h2>

                    <p className="mt-1 text-sm text-neutral">
                      Review all claim information before submitting
                      it for verification.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleSubmitClaim}
                    disabled={
                      submitting ||
                      loading ||
                      !selectedPosition ||
                      approvedSessions.length === 0
                    }
                    className="rounded-lg bg-primary px-6 py-3 font-medium text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {submitting
                      ? 'Submitting...'
                      : 'Submit Claim'}
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