import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';

const ApplicationReview = ({ application, onBack, onUpdateApplication }) => {
  const navigate = useNavigate();

  const [comment, setComment] = useState(application?.comment || '');
  const [message, setMessage] = useState('');

  // If no application was selected
  if (!application) {
    return (
      <div className="flex min-h-screen bg-off-white">
        <Sidebar userRole="lecturer" />

        <main className="flex-1">
          <div className="bg-primary text-white px-8 py-5">
            <h1 className="text-2xl font-bold">
              Application Review
            </h1>
          </div>

          <div className="p-8">
            <p className="text-gray-600">
              No application selected.
            </p>

            <button
              type="button"
              onClick={() => navigate('/review-applications')}
              className="mt-4 bg-primary text-white px-5 py-2 rounded-lg font-semibold"
            >
              Back to Review Applications
            </button>
          </div>
        </main>
      </div>
    );
  }

  // Update application status
  const handleStatusUpdate = (newStatus) => {
    const updatedApplication = {
      ...application,
      status: newStatus,
      comment: comment,
    };

    if (onUpdateApplication) {
      onUpdateApplication(updatedApplication);
    }

    setMessage(
      `Application has been ${newStatus.toLowerCase()}.`
    );

    setTimeout(() => {
      navigate('/review-applications');
    }, 1000);
  };

  // Save lecturer comment
  const handleSaveComment = () => {
    const updatedApplication = {
      ...application,
      comment: comment,
    };

    if (onUpdateApplication) {
      onUpdateApplication(updatedApplication);
    }

    setMessage('Comment saved successfully.');
  };

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
            onClick={() => navigate('/review-applications')}
            className="mt-4 bg-primary text-white px-5 py-2 rounded-lg font-semibold"
          >
            Back to Review Applications
          </button>

          {/* Application Header */}
          <Card>
            <div className="p-6">

              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">

                <div>
                  <h2 className="text-2xl font-bold text-primary-dark">
                    {application.studentName}
                  </h2>

                  <p className="text-gray-600 mt-1">
                    Student Number: {application.studentNumber}
                  </p>

                  <p className="text-gray-600">
                    Application for {application.module}
                  </p>
                </div>

                <StatusBadge status={application.status} />

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
                    {application.studentName}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">
                    Student Number
                  </label>

                  <p className="text-gray-900">
                    {application.studentNumber}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">
                    Email Address
                  </label>

                  <p className="text-gray-900">
                    {application.email}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">
                    Contact Number
                  </label>

                  <p className="text-gray-900">
                    {application.phone}
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
                    {application.module}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">
                    Application Date
                  </label>

                  <p className="text-gray-900">
                    {application.applicationDate}
                  </p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-600 mb-1">
                    Application Reason
                  </label>

                  <p className="text-gray-900">
                    {application.reason}
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

                {application.documents.map((document, index) => (
                  <div
                    key={index}
                    className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border border-gray-200 rounded-xl p-4"
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
                      onClick={() =>
                        setMessage(
                          `${document.name} selected for viewing.`
                        )
                      }
                      className="border-2 border-primary text-primary px-4 py-2 rounded-lg font-semibold hover:bg-primary-lightest transition"
                    >
                      View Document
                    </button>

                  </div>
                ))}

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

              <button
                type="button"
                onClick={handleSaveComment}
                className="mt-4 bg-primary text-white px-5 py-2 rounded-lg font-semibold hover:bg-primary-dark transition"
              >
                Save Comment
              </button>

            </div>
          </Card>

          {/* Application Decision */}
          <Card>
            <div className="p-6">

              <h3 className="text-xl font-bold text-primary-dark mb-5">
                Application Decision
              </h3>

              <p className="text-gray-600 mb-5">
                Review the application and select a decision.
              </p>

              <div className="flex flex-wrap gap-4">

                <button
                  type="button"
                  onClick={() => handleStatusUpdate('Approved')}
                  className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition"
                >
                  Approve Application
                </button>

                <button
                  type="button"
                  onClick={() => handleStatusUpdate('Rejected')}
                  className="bg-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700 transition"
                >
                  Reject Application
                </button>

                <button
                  type="button"
                  onClick={() => handleStatusUpdate('Changes Requested')}
                  className="border-2 border-primary text-primary px-6 py-3 rounded-xl font-semibold hover:bg-primary-lightest transition"
                >
                  Request Changes
                </button>

              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-xl">

                <p className="text-sm text-gray-600 mb-2">
                  Current Application Status
                </p>

                <StatusBadge status={application.status} />

              </div>

            </div>
          </Card>

          {/* Message */}
          {message && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
              <p className="text-green-700 font-semibold">
                {message}
              </p>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default ApplicationReview;