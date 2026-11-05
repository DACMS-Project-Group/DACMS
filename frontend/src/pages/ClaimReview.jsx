import Button from '../ui/Button';
import DataTable from '../ui/DataTable';
import DetailPage from '../ui/DetailPage';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import { formatMoney, formatNumber } from '../lib/format';
import { apiGet, apiPatch } from '../api';

const ClaimReview = () => {
  document.title = 'AACMS - Claim Review';
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const isLecturerReview = location.pathname.startsWith('/review-claim/');
  const listPath = isLecturerReview
    ? '/review-claims'
    : '/admin/claims';

  const [claim, setClaim] = useState(null);
  const [verifiedSessions, setVerifiedSessions] = useState([]);
  const [lecturerComment, setLecturerComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [actionError, setActionError] = useState('');

  const formatDate = (date) => {
    if (!date) return 'Not provided';

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString('en-ZA', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  useEffect(() => {
    let isCurrent = true;

    const fetchClaim = async () => {
      try {
        setIsLoading(true);
        setLoadError('');
        setActionError('');

        const endpoint = isLecturerReview
          ? `/lecturer/claims/fetch/${id}`
          : `/admin/claims/fetch/${id}`;

        const response = await apiGet(endpoint);
        const result = response?.data ?? response;

        if (!result) {
          throw new Error('Claim not found.');
        }

        if (!isCurrent) return;

        setClaim(result);

        if (isLecturerReview) {
          setVerifiedSessions(
            (result.sessions ?? []).map(
              (session) => session.status === 'Verified'
            )
          );

          setLecturerComment(result.lecturerComment || '');
        }
      } catch (error) {
        if (isCurrent) {
          setLoadError(error.message || 'Failed to load claim.');
        }
      } finally {
        if (isCurrent) {
          setIsLoading(false);
        }
      }
    };

    if (id) {
      fetchClaim();
    }

    return () => {
      isCurrent = false;
    };
  }, [id, isLecturerReview]);

  const sessions = claim?.sessions ?? [];

  const allSessionsVerified =
    sessions.length > 0 &&
    (isLecturerReview
      ? verifiedSessions.length === sessions.length &&
        verifiedSessions.every((verified) => verified)
      : sessions.every((session) => session.status === 'Verified'));

  const calculatedAmount =
    Number(claim?.hours ?? 0) * Number(claim?.hourlyRate ?? 0);

  const calculationValid =
    claim &&
    Math.abs(calculatedAmount - Number(claim.amount ?? 0)) < 0.01;

  const toggleSessionVerification = (index) => {
    setVerifiedSessions((current) =>
      current.map((verified, sessionIndex) =>
        sessionIndex === index ? !verified : verified
      )
    );
  };

  const verifyAllSessions = () => {
    setVerifiedSessions(sessions.map(() => true));
  };

  const handleApprove = async () => {
    setActionError('');

    if (!claim) return;

    if (sessions.length === 0) {
      setActionError('This claim has no work sessions to verify.');
      return;
    }

    if (!allSessionsVerified) {
      setActionError(
        'Verify all timesheet sessions before approving this claim.'
      );
      return;
    }

    if (!calculationValid) {
      setActionError(
        'The claim calculation must be valid before approval.'
      );
      return;
    }

    if (isLecturerReview && !lecturerComment.trim()) {
      setActionError('Add a comment before approving this claim.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (isLecturerReview) {
        const result = await apiPatch('/lecturer/claims/review', {
          claim_id: claim.id,
          status: 'Approved by Lecturer',
          comment: lecturerComment.trim(),
        });

        if (!result) {
          throw new Error('The claim could not be updated.');
        }
      } else {
        await apiPatch(`/admin/claims/approve/${claim.id}`);

        setClaim((currentClaim) => ({
          ...currentClaim,
          status: 'Verified',
        }));
      }

      navigate(listPath, { replace: true });
    } catch (error) {
      setActionError(
        error.message || 'The claim could not be approved.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    setActionError('');

    if (isLecturerReview) {
      if (!lecturerComment.trim()) {
        setActionError('Add a comment before rejecting this claim.');
        return;
      }

      setIsSubmitting(true);

      try {
        const result = await apiPatch('/lecturer/claims/review', {
          claim_id: claim.id,
          status: 'Rejected by Lecturer',
          comment: lecturerComment.trim(),
        });

        if (!result) {
          throw new Error('The claim could not be updated.');
        }

        navigate(listPath, { replace: true });
      } catch (error) {
        setActionError(
          error.message || 'The claim could not be rejected.'
        );
      } finally {
        setIsSubmitting(false);
      }

      return;
    }
  };

  const sessionColumns = [
    {
      key: 'date',
      header: 'Date',
      className: 'px-4 py-4 text-sm text-dark font-inter',
      render: (session) => formatDate(session.date),
    },
    {
      key: 'activity',
      header: 'Activity',
      className: 'px-4 py-4 text-sm text-dark font-inter',
      render: (session) => session.activity || 'Not provided',
    },
    {
      key: 'time',
      header: 'Time',
      className: 'px-4 py-4 text-sm text-dark font-inter',
      render: (session) =>
        `${session.startTime || '--:--'} - ${session.endTime || '--:--'}`,
    },
    {
      key: 'hours',
      header: 'Hours',
      className: 'px-4 py-4 text-sm font-medium text-dark font-inter',
      render: (session) => formatNumber(session.hours, 2),
    },
    {
      key: 'verification',
      header: 'Verification',
      className: 'px-4 py-4',
      render: (session, index) =>
        isLecturerReview ? (
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={verifiedSessions[index] || false}
              onChange={() => toggleSessionVerification(index)}
              className="h-4 w-4 rounded border-neutral text-primary focus:ring-primary"
            />
            <span className="text-sm font-medium text-dark font-inter">
              {verifiedSessions[index] ? 'Verified' : 'Pending verification'}
            </span>
          </label>
        ) : session.status === 'Verified' ? (
          <span className="inline-flex rounded-full bg-status-done-soft px-3 py-1 text-xs font-semibold text-status-done">
            Verified
          </span>
        ) : (
          <span className="inline-flex rounded-full bg-status-amber-soft px-3 py-1 text-xs font-semibold text-status-amber">
            Pending verification
          </span>
        ),
    },
  ];

  return (
    <DetailPage
      title={isLecturerReview ? 'Claim Verification' : 'Claim Review'}
      breadcrumbs={[
        {
          label: isLecturerReview ? 'Review Claims' : 'Claims',
          to: listPath,
        },
        {
          label:
            claim?.claimReference ||
            claim?.reference ||
            (claim?.id
              ? `Claim #${claim.id}`
              : isLecturerReview
                ? 'Claim Verification'
                : 'Claim Review'),
        },
      ]}
      backTo={listPath}
      backLabel="Back to Claims"
      loading={isLoading}
      loadingMessage="Loading claim..."
      errorTitle="Could not load claim"
      error={!claim ? loadError || 'Claim not found.' : ''}
    >
      {claim ? (
        <>
            {/* Claim Summary */}
            <Card className="mb-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm text-neutral font-inter">
                    Claim Reference
                  </p>

                  <h2 className="text-section mt-1 font-semibold text-primary font-poppins">
                    {claim.claimReference ||
                      claim.reference ||
                      `Claim #${claim.id}`}
                  </h2>

                  <p className="mt-1 text-sm text-neutral font-inter">
                    Submitted on {formatDate(claim.submittedDate)}
                  </p>
                </div>

                <StatusBadge status={claim.status} />
              </div>
            </Card>

            {/* Student Information */}
            <Card className="mb-6">
              <h2 className="text-section mb-5 font-semibold text-primary font-poppins">
                Student Information
              </h2>

              <div className="grid gap-5 md:grid-cols-3">
                <div>
                  <p className="text-sm text-neutral font-inter">
                    Student Number
                  </p>

                  <p className="mt-1 font-semibold text-dark font-inter">
                    {claim.studentNumber || 'Not provided'}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-neutral font-inter">
                    Student Name
                  </p>

                  <p className="mt-1 font-semibold text-dark font-inter">
                    {claim.studentName || 'Not provided'}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-neutral font-inter">
                    Module
                  </p>

                  <p className="mt-1 font-semibold text-dark font-inter">
                    {claim.moduleCode || 'Not provided'} -{' '}
                    {claim.moduleName || 'Not provided'}
                  </p>
                </div>
              </div>
            </Card>

            {/* Banking Information */}
            <Card className="mb-6">
              <h2 className="text-section mb-5 font-semibold text-primary font-poppins">
                Banking Information
              </h2>

              <div className="grid gap-5 md:grid-cols-4">
                <div>
                  <p className="text-sm text-neutral font-inter">
                    Bank
                  </p>

                  <p className="mt-1 font-semibold text-dark font-inter">
                    {claim.banking?.bank || 'Not provided'}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-neutral font-inter">
                    Account Holder
                  </p>

                  <p className="mt-1 font-semibold text-dark font-inter">
                    {claim.banking?.accountHolder || 'Not provided'}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-neutral font-inter">
                    Account Number
                  </p>

                  <p className="mt-1 font-semibold text-dark font-inter">
                    {claim.banking?.accountNumber || 'Not provided'}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-neutral font-inter">
                    Verification Status
                  </p>

                  <div className="mt-2">
                    <span className="inline-flex rounded-full bg-status-done-soft px-3 py-1 text-xs font-semibold text-status-done">
                      {claim.banking?.status || 'Not provided'}
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Claim Details */}
            <Card className="mb-6">
              <h2 className="text-section mb-5 font-semibold text-primary font-poppins">
                Claim Details
              </h2>

              <div className="grid gap-5 md:grid-cols-3">
                <div>
                  <p className="text-sm text-neutral font-inter">
                    Module Code
                  </p>

                  <p className="mt-1 font-semibold text-dark font-inter">
                    {claim.moduleCode || 'Not provided'}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-neutral font-inter">
                    Module Name
                  </p>

                  <p className="mt-1 font-semibold text-dark font-inter">
                    {claim.moduleName || 'Not provided'}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-neutral font-inter">
                    Lecturer
                  </p>

                  <p className="mt-1 font-semibold text-dark font-inter">
                    {claim.lecturer || 'Not provided'}
                  </p>
                </div>
              </div>
            </Card>

            {/* Timesheet Verification */}
            <Card className="mb-6">
              <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-section font-semibold text-primary font-poppins">
                    Timesheet Verification
                  </h2>

                  <p className="mt-1 text-sm text-neutral font-inter">
                    {isLecturerReview
                      ? 'Verify each work session included in this claim.'
                      : 'Review the work sessions included in this claim. Session verification reflects the approval recorded in the system.'}
                  </p>
                </div>

                {isLecturerReview && sessions.length > 0 && (
                  <Button unstyled
                    type="button"
                    onClick={verifyAllSessions}
                    className="rounded-xl border border-primary px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary-lightest font-inter"
                  >
                    Verify All
                  </Button>
                )}
              </div>
              <DataTable
                columns={sessionColumns}
                rows={sessions}
                getRowKey={(session, index) => session.id ?? index}
                emptyTitle="No work sessions were found for this claim."
                minWidth="800px"
              />
            </Card>

            {/* Claim Calculation */}
            <Card className="mb-6">
              <h2 className="text-section mb-5 font-semibold text-primary font-poppins">
                Claim Calculation
              </h2>

              <div className="grid gap-5 md:grid-cols-3">
                <div className="rounded-xl bg-off-white px-5 py-4">
                  <p className="text-sm text-neutral font-inter">
                    Total Hours
                  </p>

                  <p className="mt-2 text-2xl font-bold text-primary font-poppins">
                    {formatNumber(claim.hours, 2)}
                  </p>
                </div>

                <div className="rounded-xl bg-off-white px-5 py-4">
                  <p className="text-sm text-neutral font-inter">
                    Hourly Rate
                  </p>

                  <p className="mt-2 text-2xl font-bold text-primary font-poppins">
                    {formatMoney(claim.hourlyRate)}
                  </p>
                </div>

                <div className="rounded-xl bg-off-white px-5 py-4">
                  <p className="text-sm text-neutral font-inter">
                    Claimed Amount
                  </p>

                  <p className="mt-2 text-2xl font-bold text-primary font-poppins">
                    {formatMoney(claim.amount)}
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-neutral/30 bg-white px-5 py-4">
                <p className="text-sm text-neutral font-inter">
                  Calculation
                </p>

                <p className="mt-1 font-semibold text-dark font-inter">
                  {formatNumber(claim.hours, 2)} hours ×{' '}
                  {formatMoney(claim.hourlyRate)} ={' '}
                  {formatMoney(calculatedAmount)}
                </p>
              </div>

              <div className="mt-4">
                {calculationValid ? (
                  <div className="rounded-xl bg-status-done-soft px-4 py-3 text-sm font-medium text-status-done font-inter">
                    Calculation is valid. The claimed amount matches the
                    calculated remuneration.
                  </div>
                ) : (
                  <div className="rounded-xl bg-status-danger-soft px-4 py-3 text-sm font-medium text-status-danger font-inter">
                    Calculation requires review. The claimed amount does not
                    match the calculated remuneration.
                  </div>
                )}
              </div>
            </Card>

            {/* Review Actions */}
            <Card>
              <div className="mb-5">
                <h2 className="text-section font-semibold text-primary font-poppins">
                  Review Decision
                </h2>

                <p className="mt-1 text-sm text-neutral font-inter">
                  {isLecturerReview
                    ? 'Approve or reject this claim with a comment for administrative processing.'
                    : 'Approve the claim once the timesheets and calculations have been verified.'}
                </p>
              </div>

              {isLecturerReview && (
                <div className="mb-5">
                  <label
                    htmlFor="lecturer-comment"
                    className="mb-2 block text-sm font-medium text-neutral font-inter"
                  >
                    Lecturer Comment
                  </label>

                  <textarea
                    id="lecturer-comment"
                    rows="4"
                    value={lecturerComment}
                    onChange={(event) =>
                      setLecturerComment(event.target.value)
                    }
                    placeholder="Add a comment about this claim..."
                    className="w-full rounded-xl border border-neutral bg-white px-4 py-3 text-sm text-dark outline-none transition focus:border-primary focus:ring-2 focus:ring-primary-lightest font-inter"
                  />
                </div>
              )}

              {!isLecturerReview && (
                <div className="mb-5 rounded-xl border border-neutral/30 bg-off-white px-4 py-3">
                  <p className="text-sm text-neutral font-inter">
                    Timesheet verification
                  </p>

                  <p className="mt-1 text-sm font-semibold text-dark font-inter">
                    {allSessionsVerified
                      ? 'All sessions are verified.'
                      : 'Some sessions are still pending verification.'}
                  </p>
                </div>
              )}

              {actionError && (
                <p
                  role="alert"
                  className="mb-4 text-sm font-medium text-error font-inter"
                >
                  {actionError}
                </p>
              )}

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                {isLecturerReview && (
                  <Button unstyled
                    type="button"
                    onClick={handleReject}
                    disabled={isSubmitting}
                    className="rounded-xl border border-error px-5 py-3 font-semibold text-error transition hover:bg-status-danger-soft disabled:cursor-not-allowed disabled:opacity-50 font-inter"
                  >
                    Reject Claim
                  </Button>
                )}

                <Button unstyled
                  type="button"
                  onClick={handleApprove}
                  disabled={
                    isSubmitting ||
                    claim.status === 'Verified' ||
                    !allSessionsVerified ||
                    !calculationValid
                  }
                  className="rounded-xl bg-primary px-5 py-3 font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50 font-inter"
                >
                  {isSubmitting
                    ? 'Saving...'
                    : claim.status === 'Verified'
                      ? 'Claim Verified'
                      : 'Approve Claim'}
                </Button>
              </div>
            </Card>
        </>
      ) : null}
    </DetailPage>
  );
};

export default ClaimReview;