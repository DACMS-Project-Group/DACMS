import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import { apiGet, apiPost, apiPatch } from '../api';
import { useNavigate } from 'react-router-dom';

const ReviewApplications = () => {
  
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
        type: 
          document.DocumentType ?? 
          document.documentType,
        path: 
          document.FilePath ?? 
          document.filePath,
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

  //File download function
  const viewDocument = (document) => {
    const filePath = document.path ?? document.FilePath;

    if (!filePath) {
      setError('Document not found.');
      return;
    }

    const fileName = String(filePath).replace(/\\/g, '/').split('/').pop();
    if (!fileName) {
      setError('Document not found.');
      return;
    }

    const link = window.document.createElement('a');
    link.href = `/backend/documents/${encodeURIComponent(fileName)}`;
    link.download = fileName;
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

      await apiPost('/notifications/send', {
        recipientId: selectedApplication.studentId,
        subject: `Application ${newStatus}`,
        type: 'application_status',
        message: `Your application has been ${newStatus.toLowerCase()}. Lecturer's comment: ${comment || 'No comment provided.'}`,
      });

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
      <div className="min-h-screen bg-off-white">

        {/* Top Navbar */}
        <Navbar />

        <div className="flex">

          {/* Lecturer Sidebar */}
          <Sidebar userRole="lecturer" />

          {/* Main Content */}
          <main className="flex-1">

            {/* Page Title */}
            <div className="bg-primary text-white px-8 py-5">
              <h1 className="text-2xl font-bold">
                Application Review
              </h1>
            </div>

            <div className="p-8">

              {/* Back Button */}
              <button
                type="button"
                onClick={handleBack}
                className="mb-6 text-primary font-semibold hover:underline"
              >
                ← Back to Review Applications
              </button>

              {/* Application Header */}
              <Card>
                <div className="p-6">

                  <div className="flex justify-between items-start">

                    <div>
                      <h2 className="text-2xl font-bold text-primary-dark">
                        {selectedApplication.studentName}
                      </h2>

                      <p className="text-gray-600 mt-1">
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
                <div className="p-6">

                  <h3 className="text-xl font-bold text-primary-dark mb-5">
                    Student Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-1">
                        Full Names
                      </label>

                      <p className="text-gray-900">
                        {selectedApplication.studentName}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-1">
                        Student Number
                      </label>

                      <p className="text-gray-900">
                        {selectedApplication.studentNumber}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-1">
                        Email Address
                      </label>

                      <p className="text-gray-900">
                        {selectedApplication.email}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-1">
                        Contact Number
                      </label>

                      <p className="text-gray-900">
                        {selectedApplication.phone}
                      </p>
                    </div>

                  </div>

                </div>
              </Card>

              {/* Application Information */}
              <Card>
                <div className="p-6">

                  <h3 className="text-xl font-bold text-primary-dark mb-5">
                    Application Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-1">
                        Module
                      </label>

                      <p className="text-gray-900">
                        {selectedApplication.moduleCode} - {selectedApplication.moduleName}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-1">
                        Application Date
                      </label>

                      <p className="text-gray-900">
                        {selectedApplication.dateSubmitted}
                      </p>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-600 mb-1">
                        Application Reason
                      </label>

                      <p className="text-gray-900">
                        {selectedApplication.reason}
                      </p>
                    </div>

                  </div>

                </div>
              </Card>

              {/* Supporting Documents */}
              <Card>
                <div className="p-6">

                  <h3 className="text-xl font-bold text-primary-dark mb-5">
                    Supporting Documents
                  </h3>

                  <div className="space-y-3">

                    {(selectedApplication.documents || []).map(
                      (document, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between border border-gray-200 rounded-xl p-4"
                        >

                          <div>
                            <p className="font-semibold text-gray-900">
                              {document.type || document.documentType || 'Document'}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => viewDocument(document)}
                            className="border-2 border-primary text-primary px-4 py-2 rounded-lg font-semibold hover:bg-primary-lightest transition"
                          >
                            View
                          </button>

                        </div>
                      )
                    )}

                  </div>

                </div>
              </Card>

              {/* Lecturer Comments */}
              <Card>
                <div className="p-6">

                  <h3 className="text-xl font-bold text-primary-dark mb-5">
                    Lecturer Comments
                  </h3>

                  <textarea
                    value={comment}
                    onChange={(event) => setComment(event.target.value)}
                    placeholder="Enter comments or feedback for the student..."
                    rows="5"
                    className="w-full border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-primary"
                  />

                </div>
              </Card>

              {/* Application Actions */}
              <Card>
                <div className="p-6">

                  <h3 className="text-xl font-bold text-primary-dark mb-5">
                    Application Decision
                  </h3>

                  <p className="text-gray-600 mb-5">
                    Select an action for this application.
                  </p>

                  <div className="flex flex-wrap gap-4">

                    <button
                      type="button"
                      onClick={() =>
                        handleStatusUpdate('Approved')
                      }
                      className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition"
                    >
                      Approve Application
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleStatusUpdate('Rejected')
                      }
                      className="bg-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700 transition"
                    >
                      Reject Application
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleStatusUpdate('Changes Requested')
                      }
                      className="border-2 border-primary text-primary px-6 py-3 rounded-xl font-semibold hover:bg-primary-lightest transition"
                    >
                      Request Changes
                    </button>

                  </div>

                  <div className="mt-5 p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-600">
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
          </main>
        </div>
      </div>
    );
  }

  /*
   * REVIEW APPLICATIONS MAIN PAGE
   */
  return (
    <div className="min-h-screen bg-off-white">

      {/* Top Navbar */}
      <Navbar />

      <div className="flex">

        {/* Lecturer Sidebar */}
        <Sidebar userRole="lecturer" />

        {/* Main Content */}
        <main className="flex-1">

          {/* Page Title */}
          <div className="bg-primary text-white px-8 py-5">
            <h1 className="text-2xl font-bold">
              Review Applications
            </h1>
          </div>

          <div className="p-8">

            {/* Page Introduction */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-primary-dark">
                Student Applications
              </h2>

              <p className="text-gray-600 mt-1">
                Review and manage applications submitted by students.
              </p>
            </div>

            {/* Search and Filter */}
            <Card>
              <div className="p-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  {/* Search */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-2">
                      Search Applications
                    </label>

                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(event) =>
                        setSearchTerm(event.target.value)
                      }
                      placeholder="Search by student name, number or module..."
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  {/* Status Filter */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-2">
                      Filter by Status
                    </label>

                    <select
                      value={statusFilter}
                      onChange={(event) =>
                        setStatusFilter(event.target.value)
                      }
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="All">
                        All Applications
                      </option>

                      <option value="Pending Review">
                        Pending Review
                      </option>

                      <option value="Approved">
                        Approved
                      </option>

                      <option value="Rejected">
                        Rejected
                      </option>

                      <option value="Changes Requested">
                        Changes Requested
                      </option>
                    </select>
                  </div>

                </div>

              </div>
            </Card>

            {/* Applications */}
            <Card>
              <div className="p-6">

                <div className="flex justify-between items-center mb-6">

                  <div>
                    <h3 className="text-xl font-bold text-primary-dark">
                      Applications
                    </h3>

                    <p className="text-gray-600 mt-1">
                      Select an application to review.
                    </p>
                  </div>

                  <span className="text-sm text-gray-600">
                    {filteredApplications.length} Application(s)
                  </span>

                </div>

                {/* Applications Table */}
                <div className="overflow-x-auto">

                  <table className="w-full">

                    <thead>
                      <tr className="border-b border-gray-200 text-left">

                        <th className="px-4 py-4 text-sm font-semibold text-gray-600">
                          Student
                        </th>

                        <th className="px-4 py-4 text-sm font-semibold text-gray-600">
                          Student Number
                        </th>

                        <th className="px-4 py-4 text-sm font-semibold text-gray-600">
                          Module
                        </th>

                        <th className="px-4 py-4 text-sm font-semibold text-gray-600">
                          Application Date
                        </th>

                        <th className="px-4 py-4 text-sm font-semibold text-gray-600">
                          Status
                        </th>

                        <th className="px-4 py-4 text-sm font-semibold text-gray-600">
                          Action
                        </th>

                      </tr>
                    </thead>

                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="6" className="px-4 py-10 text-center text-gray-500">
                            Loading applications...
                          </td>
                        </tr>
                      ) : error ? (
                        <tr>
                          <td colSpan="6" className="px-4 py-10 text-center text-red-600">
                            {error}
                          </td>
                        </tr>
                      ) : filteredApplications.length > 0 ? (
                        filteredApplications.map((raw) => {
                          const application = mapApplicationOverview(raw);

                          return (
                            <tr
                              key={application.id}
                              className="border-b border-gray-100 hover:bg-gray-50 transition"
                            >
                              <td className="px-4 py-4 font-semibold text-primary-dark">
                                {application.studentName}
                              </td>

                              <td className="px-4 py-4 text-gray-600">
                                {application.studentNumber}
                              </td>

                              <td className="px-4 py-4 text-gray-600">
                                {application.moduleCode}
                              </td>

                              <td className="px-4 py-4 text-gray-600">
                                {application.dateSubmitted}
                              </td>

                              <td className="px-4 py-4">
                                <StatusBadge status={application.status} />
                              </td>

                              <td className="px-4 py-4">
                                <button
                                  type="button"
                                  onClick={() => handleReview(application)}
                                  className="bg-primary text-white px-5 py-2 rounded-lg font-semibold hover:bg-primary-dark transition"
                                >
                                  {application.status === 'Pending Review'
                                    ? 'Review'
                                    : 'View'}
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td
                            colSpan="6"
                            className="px-4 py-10 text-center text-gray-500"
                          >
                            No applications found.
                          </td>
                        </tr>
                      )}
                    </tbody>

                  </table>

                </div>

              </div>
            </Card>

          </div>
        </main>
      </div>
    </div>
  );
};

export default ReviewApplications;