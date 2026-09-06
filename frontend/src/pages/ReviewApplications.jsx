import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';

const ReviewApplications = () => {
  const [applications, setApplications] = useState([
    {
      id: 1,
      studentName: 'John Smith',
      studentNumber: '12345678',
      email: 'john.smith@nwu.ac.za',
      phone: '071 234 5678',
      module: 'CMPG323',
      applicationDate: '01 September 2026',
      status: 'Pending Review',
      reason: 'Application to become a Demi for CMPG323.',
      documents: [
        { name: 'Academic Transcript', status: 'Submitted' },
        { name: 'Certified Identity Document', status: 'Submitted' },
        { name: 'Certified Highest Qualification', status: 'Submitted' },
        { name: 'Bank Confirmation Letter', status: 'Submitted' },
        { name: 'NWU Registration Proof', status: 'Submitted' },
      ],
      comment: '',
    },
    {
      id: 2,
      studentName: 'Sarah Molefe',
      studentNumber: '23456789',
      email: 'sarah.molefe@nwu.ac.za',
      phone: '072 345 6789',
      module: 'CMPG315',
      applicationDate: '30 August 2026',
      status: 'Pending Review',
      reason: 'Application to become a Demi for CMPG315.',
      documents: [
        { name: 'Academic Transcript', status: 'Submitted' },
        { name: 'Certified Identity Document', status: 'Submitted' },
        { name: 'Certified Highest Qualification', status: 'Submitted' },
        { name: 'Bank Confirmation Letter', status: 'Submitted' },
        { name: 'NWU Registration Proof', status: 'Submitted' },
      ],
      comment: '',
    },
    {
      id: 3,
      studentName: 'Thabo Mokoena',
      studentNumber: '34567890',
      email: 'thabo.mokoena@nwu.ac.za',
      phone: '073 456 7890',
      module: 'CMPG321',
      applicationDate: '28 August 2026',
      status: 'Approved',
      reason: 'Application to become a Demi for CMPG321.',
      documents: [
        { name: 'Academic Transcript', status: 'Submitted' },
        { name: 'Certified Identity Document', status: 'Submitted' },
        { name: 'Certified Highest Qualification', status: 'Submitted' },
        { name: 'Bank Confirmation Letter', status: 'Submitted' },
        { name: 'NWU Registration Proof', status: 'Submitted' },
      ],
      comment: 'Application approved. All required documents were verified.',
    },
    {
      id: 4,
      studentName: 'Lerato Dlamini',
      studentNumber: '45678901',
      email: 'lerato.dlamini@nwu.ac.za',
      phone: '074 567 8901',
      module: 'CMPG313',
      applicationDate: '27 August 2026',
      status: 'Pending Review',
      reason: 'Application to become a Demi for CMPG313.',
      documents: [
        { name: 'Academic Transcript', status: 'Submitted' },
        { name: 'Certified Identity Document', status: 'Submitted' },
        { name: 'Certified Highest Qualification', status: 'Submitted' },
        { name: 'Bank Confirmation Letter', status: 'Submitted' },
        { name: 'NWU Registration Proof', status: 'Submitted' },
      ],
      comment: '',
    },
  ]);

  const [selectedApplication, setSelectedApplication] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [comment, setComment] = useState('');

  // Filter applications
  const filteredApplications = applications.filter((application) => {
    const matchesSearch =
      application.studentName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      application.studentNumber
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      application.module
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'All' ||
      application.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Open application for review
  const handleReview = (application) => {
    setSelectedApplication(application);
    setComment(application.comment || '');
  };

  // Return to application list
  const handleBack = () => {
    setSelectedApplication(null);
    setComment('');
  };

  // Update application status
  const handleStatusUpdate = (newStatus) => {
    if (!selectedApplication) {
      return;
    }

    const updatedApplications = applications.map((application) =>
      application.id === selectedApplication.id
        ? {
            ...application,
            status: newStatus,
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

  // Save comment
  const handleSaveComment = () => {
    if (!selectedApplication) {
      return;
    }

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
      <div className="flex min-h-screen bg-off-white">

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
                      {selectedApplication.module}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">
                      Application Date
                    </label>

                    <p className="text-gray-900">
                      {selectedApplication.applicationDate}
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

                  {selectedApplication.documents.map(
                    (document, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between border border-gray-200 rounded-xl p-4"
                      >

                        <div>
                          <p className="font-semibold text-gray-900">
                            {document.name}
                          </p>

                          <p className="text-sm text-gray-500">
                            {document.status}
                          </p>
                        </div>

                        <button
                          type="button"
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
                  onChange={(event) =>
                    setComment(event.target.value)
                  }
                  placeholder="Enter comments or feedback for the student..."
                  rows="5"
                  className="w-full border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-primary"
                />

                <button
                  type="button"
                  onClick={handleSaveComment}
                  className="mt-4 bg-primary text-white px-5 py-2 rounded-lg font-semibold hover:bg-primary-dark transition"
                >
                  Save Comment
                </button>

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
    );
  }

  /*
   * REVIEW APPLICATIONS MAIN PAGE
   */
  return (
    <div className="flex min-h-screen bg-off-white">

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

                    {filteredApplications.length > 0 ? (
                      filteredApplications.map(
                        (application) => (
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
                              {application.module}
                            </td>

                            <td className="px-4 py-4 text-gray-600">
                              {application.applicationDate}
                            </td>

                            <td className="px-4 py-4">
                              <StatusBadge
                                status={application.status}
                              />
                            </td>

                            <td className="px-4 py-4">

                              <button
                                type="button"
                                onClick={() =>
                                  handleReview(application)
                                }
                                className="bg-primary text-white px-5 py-2 rounded-lg font-semibold hover:bg-primary-dark transition"
                              >
                                {application.status === 'Pending Review'
                                  ? 'Review'
                                  : 'View'}
                              </button>

                            </td>

                          </tr>
                        )
                      )
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
  );
};

export default ReviewApplications;