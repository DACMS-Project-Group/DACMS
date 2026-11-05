import Button from '../ui/Button';
import React, { useEffect, useState } from 'react';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import DataTable from '../ui/DataTable';
import PageHeader from '../ui/PageHeader';
import { apiGet, apiPatch } from '../api';
import { useNavigate } from 'react-router-dom';
import { APPLICATION_STATUS_OPTIONS } from '../lib/statuses';

const ReviewApplications = () => {
  document.title = 'AACMS - Review Applications';
  const navigate = useNavigate();
  
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const mapApplicationOverview = (app) => ({
    id:
      app.application_id ??
      app.ApplicationID ??
      app.listingId ??
      app.id ??
      Math.random(),
    studentName:
      app.Student ??
      app.studentName ??
      app.student_name ??
      app.StudentName ??
      '—',
    studentNumber:
      app.studentNumber ??
      app.student_number ??
      app.StudentNumber ??
      '—',
    moduleCode:
      app.moduleCode ??
      app.module_code ??
      app.ModuleCode ??
      '—',
    status:
      app.status ??
      app.ApplicationStatus ??
      'Pending',
    dateSubmitted: String(
      app.DateSubmitted ??
      app.dateSubmitted ??
      app.ApplicationDate ??
      app.applicationDate ??
      '00-00-00'
    ).split('T')[0],
  });

  const mapApplicationDetail = (app) => ({
    ...mapApplicationOverview(app),
    studentId:
      app.StudentID ??
      app.studentID ??
      0,
    email: 
      app.Email ?? 
      app.email ?? 
      '—',
    phone: 
      app.ContactDetails ?? 
      app.contactDetails ??
      app.phone ?? 
      '—',
    moduleName:
      app.ModuleName ??
      app.moduleName ??
      '-',
    documents:
      (app.Documents ?? app.documents ?? []).map((document) => ({
        ...document,
      id:
        document.DocumentID ??
        document.documentId ??
        document.document_id ??
        document.id,
      type:
        document.DocumentType ??
        document.documentType ??
        document.document_type,
      })),
    reason:
      app.DecisionReason ?? 
      app.decisionReason ??
      '-',
    comment:
      app.ReviewComment ??
      app.reviewComment ??
      app.comment ??
      '',
  });

    // ---- Fetch applications on mount ----
  useEffect(() => {
    let cancelled = false;
  
    const load = async () => {
      try {
        setLoading(true);
        const data = await apiGet('/lecturer/applications');
  
        const payload = data?.data ?? data;
        const list = Array.isArray(payload)
          ? payload
          : payload?.rows ??
            payload?.application ??
            payload?.results ??
            payload?.items ??
            [];
  
        if (!cancelled) {
          const mappedList = list.map(mapApplicationOverview); 
          setApplications(mappedList);
          setError('');
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
  
    load();
  
  return () => {
    cancelled = true;
  };
  }, []);

  const [application, setApplication] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [comment, setComment] = useState('');

  // Filter applications
const filteredApplications = applications.filter((application) => {
  const query = searchTerm.toLowerCase();

  const matchesSearch = !query || [
    application.studentName,
    application.studentNumber,
    application.module,
    application.moduleCode,
  ].some((value) => String(value ?? '').toLowerCase().includes(query));

  // If filter is 'All', this returns true. Otherwise, it checks the status.
  const matchesStatus = statusFilter === 'All' || application.status === statusFilter;

  // Only keep the application if it matches BOTH the search and the status
  return matchesSearch && matchesStatus;
});

  // Open application for review
  const handleReview = async (application) => {
    try {
      const data = await apiGet(
        `/lecturer/applications/fetch/${application.id}`
      );
      const payload = data?.data ?? data;
      const detail = Array.isArray(payload)
          ? payload
          : payload?.rows ??
            payload?.data ??
            payload?.application ??
            payload?.application[0] ??
            payload?.data?.application[0] ??
            payload?.results ??
            payload?.items ??
            [];


      const fullApplication = detail.map(mapApplicationDetail);

      setSelectedApplication(fullApplication[0] || null);

      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const applicationColumns = [
    {
      key: 'studentName',
      header: 'Student',
      className: 'px-4 py-4 font-semibold text-primary-dark',
      render: (application) => application.studentName,
    },
    {
      key: 'studentNumber',
      header: 'Student Number',
      className: 'px-4 py-4 text-neutral',
      render: (application) => application.studentNumber,
    },
    {
      key: 'moduleCode',
      header: 'Module',
      className: 'px-4 py-4 text-neutral',
      render: (application) => application.moduleCode,
    },
    {
      key: 'dateSubmitted',
      header: 'Application Date',
      className: 'px-4 py-4 text-neutral',
      render: (application) => application.dateSubmitted,
    },
    {
      key: 'status',
      header: 'Status',
      className: 'px-4 py-4',
      render: (application) => <StatusBadge status={application.status} />,
    },
    {
      key: 'action',
      header: 'Action',
      className: 'px-4 py-4',
      render: (application) => (
        <button
          type="button"
          onClick={() => handleReview(application)}
          className="bg-primary text-white px-5 py-2 rounded-lg font-semibold hover:bg-primary-dark transition"
        >
          {application.status === 'Pending Review' ? 'Review' : 'View'}
        </button>
      ),
    },
  ];

  //File download function
  const viewDocument = (document) => {
    if (!selectedApplication?.id || !document.id) {
      setError('Document not found.');
      return;
    }

    const link = window.document.createElement('a');
    link.href =
      `/api/lecturer/applications/${encodeURIComponent(selectedApplication.id)}` +
      `/documents/${encodeURIComponent(document.id)}`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    window.document.body.appendChild(link);
    link.click();
    link.remove();
  }


  // Return to application list
  const handleBack = () => {
    setSelectedApplication(null);
    setComment('');
  };

  // Update application status
  const handleStatusUpdate = async (newStatus) => {
    if (!selectedApplication) {
      error.log("No application selected for status update.");
      return;
    }

    try {
      await apiPatch(`/lecturer/applications/review/${selectedApplication.id}`, {
        decision: newStatus,
        comment,
      });

      setApplications((currentApplications) =>
        currentApplications.map((application) =>
          application.id === selectedApplication.id
            ? { 
              ...application, 
              status: newStatus, 
              comment 
            } : application
        )
      );
      setSelectedApplication((currentApplication) =>
        currentApplication
          ? { 
            ...currentApplication, 
            status: newStatus, 
            comment 
          } : currentApplication
      );

      setError('');
    } catch (err) {
      setError(err.message || 'Unable to update the application.');
    }
  };

  // Save comment
  const handleSaveComment = async (comment) => {
    if (!selectedApplication) {
      return;
    }
    setComment(comment);

    const updatedApplications = applications.map((application) =>
      application.id === selectedApplication.id
        ? {
            ...application,
            comment: comment,
          }
        : application
    );

    setApplications(updatedApplications);

    const updatedApplication = updatedApplications.find(
      (application) => application.id === selectedApplication.id
    );

    setSelectedApplication(updatedApplication);
  };



  /*
   * APPLICATION REVIEW PAGE
   */
  if (selectedApplication) {
    return (
      <>
        <div className="p-4 md:p-8">
          <PageHeader title="Application Review" />

              {/* Back Button */}
              <Button unstyled
                type="button"
                onClick={handleBack}
                className="mb-6 text-primary font-semibold hover:underline"
              >
                ← Back to Review Applications
              </Button>

              <div className="space-y-6">

              {/* Application Header */}
              <Card>
                <div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                    <div className="min-w-0">
                      <h2 className="text-section font-bold text-primary-dark">
                        {selectedApplication.studentName}
                      </h2>

                      <p className="text-neutral mt-1">
                        Student Number: {selectedApplication.studentNumber}
                      </p>
                    </div>

                    <StatusBadge
                      status={selectedApplication.status}
                    />

                  </div>

                </div>
              </Card>

              {/* Student Information */}
              <Card>
                <div>

                  <h3 className="text-card font-bold text-primary-dark mb-5">
                    Student Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <div>
                      <label className="block text-sm font-semibold text-neutral mb-1">
                        Full Names
                      </label>

                      <p className="text-dark">
                        {selectedApplication.studentName}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-neutral mb-1">
                        Student Number
                      </label>

                      <p className="text-dark">
                        {selectedApplication.studentNumber}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-neutral mb-1">
                        Email Address
                      </label>

                      <p className="text-dark">
                        {selectedApplication.email}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-neutral mb-1">
                        Contact Number
                      </label>

                      <p className="text-dark">
                        {selectedApplication.phone}
                      </p>
                    </div>

                  </div>

                </div>
              </Card>

              {/* Application Information */}
              <Card>
                <div>

                  <h3 className="text-card font-bold text-primary-dark mb-5">
                    Application Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <div>
                      <label className="block text-sm font-semibold text-neutral mb-1">
                        Module
                      </label>

                      <p className="text-dark">
                        {selectedApplication.moduleCode} - {selectedApplication.moduleName}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-neutral mb-1">
                        Application Date
                      </label>

                      <p className="text-dark">
                        {selectedApplication.dateSubmitted}
                      </p>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-neutral mb-1">
                        Application Reason
                      </label>

                      <p className="text-dark">
                        {selectedApplication.reason}
                      </p>
                    </div>

                  </div>

                </div>
              </Card>

              {/* Supporting Documents */}
              <Card>
                <div>

                  <h3 className="text-card font-bold text-primary-dark mb-5">
                    Supporting Documents
                  </h3>

                  <div className="space-y-3">

                    {(selectedApplication.documents || []).map(
                      (document, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between border border-border-subtle rounded-xl p-4"
                        >

                          <div>
                            <p className="font-semibold text-dark">
                              {document.type || document.documentType || 'Document'}
                            </p>
                          </div>

                          <Button unstyled
                            type="button"
                            onClick={() => viewDocument(document)}
                            className="border-2 border-primary text-primary px-4 py-2 rounded-lg font-semibold hover:bg-primary-lightest transition"
                          >
                            View
                          </Button>

                        </div>
                      )
                    )}

                  </div>

                </div>
              </Card>

              {/* Lecturer Comments */}
              <Card>
                <div>

                  <h3 className="text-card font-bold text-primary-dark mb-5">
                    Lecturer Comments
                  </h3>

                  <textarea
                    value={comment}
                    onChange={(event) => setComment(event.target.value)}
                    placeholder="Enter comments or feedback for the student..."
                    rows="5"
                    className="w-full border border-border-subtle rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-primary"
                  />

                </div>
              </Card>

              {/* Application Actions */}
              <Card>
                <div>

                  <h3 className="text-card font-bold text-primary-dark mb-5">
                    Application Decision
                  </h3>

                  <p className="text-neutral mb-5">
                    Select an action for this application.
                  </p>

                  <div className="flex flex-wrap gap-4">

                    <Button unstyled
                      type="button"
                      onClick={() =>
                        handleStatusUpdate('Approved')
                      }
                      className="bg-success text-white px-6 py-3 rounded-xl font-semibold hover:bg-success/90 transition"
                    >
                      Approve Application
                    </Button>

                    <Button unstyled
                      type="button"
                      onClick={() =>
                        handleStatusUpdate('Rejected')
                      }
                      className="bg-error text-white px-6 py-3 rounded-xl font-semibold hover:bg-error/90 transition"
                    >
                      Reject Application
                    </Button>

                    <Button unstyled
                      type="button"
                      onClick={() =>
                        handleStatusUpdate('Returned')
                      }
                      className="border-2 border-primary text-primary px-6 py-3 rounded-xl font-semibold hover:bg-primary-lightest transition"
                    >
                      Request Changes
                    </Button>

                  </div>

                  <div className="mt-5 p-4 bg-surface-muted rounded-xl">
                    <p className="text-sm text-neutral">
                      Current Status
                    </p>

                    <div className="mt-2">
                      <StatusBadge
                        status={selectedApplication.status}
                      />
                    </div>
                  </div>

                </div>
              </Card>

              </div>

            </div>
      </>
    );
  }

  /*
   * REVIEW APPLICATIONS MAIN PAGE
   */
  return (
    <>
      <div className="p-4 md:p-8">
            <PageHeader
              title="Review Applications"
              description="Review and manage applications submitted by students."
            />

            <div className="space-y-6">

            {/* Search and Filter */}
            <Card>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  {/* Search */}
                  <div>
                    <label className="block text-sm font-semibold text-neutral mb-2">
                      Search Applications
                    </label>

                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(event) =>
                        setSearchTerm(event.target.value)
                      }
                      placeholder="Search by student name, number or module..."
                      className="w-full border border-border-subtle rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  {/* Status Filter */}
                  <div>
                    <label className="block text-sm font-semibold text-neutral mb-2">
                      Filter by Status
                    </label>

                    <select
                      value={statusFilter}
                      onChange={(event) =>
                        setStatusFilter(event.target.value)
                      }
                      className="w-full border border-border-subtle rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="All">
                        All Applications
                      </option>

                      {APPLICATION_STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>

                </div>

            </Card>

            {/* Applications */}
            <Card>
              <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                  <div>
                    <h3 className="text-card font-bold text-primary-dark">
                      Applications
                    </h3>

                    <p className="text-neutral mt-1">
                      Select an application to review.
                    </p>
                  </div>

                  <span className="text-sm text-neutral">
                    {filteredApplications.length} Application(s)
                  </span>

                </div>

              <DataTable
                  columns={applicationColumns}
                  rows={filteredApplications.map(mapApplicationOverview)}
                  getRowKey={(application) => application.id}
                  loading={loading}
                  error={error}
                  emptyTitle="No applications found"
                  emptyDescription="No applications match your search criteria."
                  minWidth="900px"
                />

            </Card>

            </div>

          </div>
    </>
  );
};

export default ReviewApplications;