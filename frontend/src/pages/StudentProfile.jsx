import React, { useMemo, useState } from 'react';

// Replace with your actual project UI components
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';

const StudentProfile = () => {
  // =========================================================
  // 1. PERSONAL & BANKING INFORMATION
  // =========================================================
  const [profile, setProfile] = useState({
    studentNumber: '',
    fullNames: '',
    dateOfBirth: '',
    email: '',
    phone: '',
    studentType: 'south-african', // 'south-african' | 'international'

    bankName: '',
    accountHolder: '',
    accountNumber: '',
    accountType: '',
    branchCode: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  // =========================================================
  // 2. REQUIRED SUPPORTING DOCUMENTS
  // =========================================================
  const [documents, setDocuments] = useState({
    academicTranscript: null,
    identityDocument: null,
    passport: null,
    workPermission: null,
    studyPermit: null,
    highestQualification: null,
    bankConfirmation: null,
    registrationProof: null,
  });

  // Dynamic document rules based on Student Type
  const requiredDocuments = useMemo(() => {
    const baseDocs = [
      { key: 'academicTranscript', name: 'Academic Transcript' },
      { key: 'identityDocument', name: 'Certified Identity Document' },
      { key: 'highestQualification', name: 'Certified Highest Qualification' },
      { key: 'bankConfirmation', name: 'Bank Confirmation Letter' },
      { key: 'registrationProof', name: 'NWU Registration Proof' },
    ];

    if (profile.studentType === 'international') {
      baseDocs.push(
        { key: 'passport', name: 'Certified Passport' },
        { key: 'workPermission', name: 'Work Permission (P&C101F)' },
        { key: 'studyPermit', name: 'Study Permit' }
      );
    }

    return baseDocs;
  }, [profile.studentType]);

  // =========================================================
  // 3. NOTIFICATION CENTRE DATA
  // =========================================================
  const [notifications] = useState([
    { id: 1, message: 'Welcome to your NWU Student Profile.', timestamp: 'Today' },
    { id: 2, message: 'Ensure all supporting documents are updated before applying.', timestamp: 'Yesterday' },
  ]);

  // =========================================================
  // 4. APPLICATION HISTORY DATA
  // =========================================================
  const [applicationHistory] = useState([
    { id: 'APP-001', module: 'CMPG 311', date: '15 August 2026', status: 'Approved' },
    { id: 'APP-002', module: 'CMPG 321', date: '10 August 2026', status: 'Pending' },
  ]);

  // =========================================================
  // EVENT HANDLERS (CRUD & UNIFIED SAVE)
  // =========================================================
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
    setSaved(false);
  };

  const handleDocumentUpload = (e, docKey) => {
    const file = e.target.files[0];
    if (!file) return;

    setDocuments((prev) => ({ ...prev, [docKey]: file }));
    setSaved(false);
  };

  const handleRemoveDocument = (docKey) => {
    setDocuments((prev) => ({ ...prev, [docKey]: null }));
    setSaved(false);
  };

  const handleSaveAll = (e) => {
    e.preventDefault();

    // Payload ready for your backend API endpoint
    const completeProfileData = {
      profile,
      documents,
    };

    console.log('Unified Save Payload:', completeProfileData);

    setSaved(true);
    setIsEditing(false);
  };

  // =========================================================
  // 5. PROFILE STATUS & METRICS COMPUTATION
  // =========================================================
  const profileFields = [
    profile.studentNumber,
    profile.fullNames,
    profile.dateOfBirth,
    profile.email,
    profile.phone,
    profile.bankName,
    profile.accountHolder,
    profile.accountNumber,
    profile.accountType,
    profile.branchCode,
  ];

  const completedFieldsCount = profileFields.filter((val) => val.trim() !== '').length;
  const profileProgress = Math.round((completedFieldsCount / profileFields.length) * 100);

  const uploadedDocsCount = requiredDocuments.filter((doc) => documents[doc.key]).length;
  const docProgress = Math.round((uploadedDocsCount / requiredDocuments.length) * 100);

  const overallCompletion = Math.round((profileProgress + docProgress) / 2);

  return (
    <div className="flex min-h-screen bg-off-white">
      <Sidebar userRole="student" />

      <div className="flex-1 p-8">
        {/* HEADER & PROFILE STATUS */}
        <Card className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-poppins font-bold text-primary">
                {profile.fullNames || 'Student Profile'}
              </h1>
              <p className="text-neutral mt-1">
                {profile.studentNumber
                  ? `Student #: ${profile.studentNumber}`
                  : 'Create your profile once to reuse across applications.'}
              </p>
            </div>

            <div className="flex flex-col items-start md:items-end gap-2">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-dark">Profile Status:</span>
                <StatusBadge status={overallCompletion === 100 ? 'Complete' : 'Incomplete'} />
              </div>
              <p className="text-sm text-neutral">{overallCompletion}% Completed</p>

              {!isEditing && (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="border-2 border-primary text-primary px-5 py-2 rounded-xl font-semibold hover:bg-primary-lightest transition"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          <div className="mt-6 w-full bg-light-grey rounded-full h-3">
            <div
              className="bg-primary h-3 rounded-full transition-all duration-300"
              style={{ width: `${overallCompletion}%` }}
            />
          </div>
        </Card>

        {/* UNIFIED FORM */}
        <form onSubmit={handleSaveAll}>
          {/* PERSONAL & BANKING INFORMATION */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Personal Information */}
            <Card>
              <h2 className="text-2xl font-poppins font-semibold text-primary mb-6">
                Personal Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-dark mb-1">Student Number</label>
                  <input
                    type="text"
                    name="studentNumber"
                    value={profile.studentNumber}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="e.g. 12345678"
                    className="w-full border border-neutral rounded-xl px-4 py-2.5 bg-white disabled:bg-light-grey"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-dark mb-1">Full Names</label>
                  <input
                    type="text"
                    name="fullNames"
                    value={profile.fullNames}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="Enter full names"
                    className="w-full border border-neutral rounded-xl px-4 py-2.5 bg-white disabled:bg-light-grey"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-dark mb-1">Date of Birth</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={profile.dateOfBirth}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full border border-neutral rounded-xl px-4 py-2.5 bg-white disabled:bg-light-grey"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-dark mb-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="student@nwu.ac.za"
                    className="w-full border border-neutral rounded-xl px-4 py-2.5 bg-white disabled:bg-light-grey"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-dark mb-1">Contact Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={profile.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="e.g. 0812345678"
                    className="w-full border border-neutral rounded-xl px-4 py-2.5 bg-white disabled:bg-light-grey"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-dark mb-1">Student Type</label>
                  <select
                    name="studentType"
                    value={profile.studentType}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full border border-neutral rounded-xl px-4 py-2.5 bg-white disabled:bg-light-grey"
                  >
                    <option value="south-african">South African Student</option>
                    <option value="international">International Student</option>
                  </select>
                </div>
              </div>
            </Card>

            {/* Banking Details */}
            <Card>
              <h2 className="text-2xl font-poppins font-semibold text-primary mb-6">
                Banking Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-dark mb-1">Bank Name</label>
                  <input
                    type="text"
                    name="bankName"
                    value={profile.bankName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="e.g. Capitec / FNB"
                    className="w-full border border-neutral rounded-xl px-4 py-2.5 bg-white disabled:bg-light-grey"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-dark mb-1">Account Holder</label>
                  <input
                    type="text"
                    name="accountHolder"
                    value={profile.accountHolder}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="Account holder name"
                    className="w-full border border-neutral rounded-xl px-4 py-2.5 bg-white disabled:bg-light-grey"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-dark mb-1">Account Number</label>
                  <input
                    type="text"
                    name="accountNumber"
                    value={profile.accountNumber}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="Enter account number"
                    className="w-full border border-neutral rounded-xl px-4 py-2.5 bg-white disabled:bg-light-grey"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-dark mb-1">Account Type</label>
                  <select
                    name="accountType"
                    value={profile.accountType}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full border border-neutral rounded-xl px-4 py-2.5 bg-white disabled:bg-light-grey"
                  >
                    <option value="">Select account type</option>
                    <option value="savings">Savings Account</option>
                    <option value="cheque">Cheque Account</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-dark mb-1">Branch Code</label>
                  <input
                    type="text"
                    name="branchCode"
                    value={profile.branchCode}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="e.g. 470010"
                    className="w-full border border-neutral rounded-xl px-4 py-2.5 bg-white disabled:bg-light-grey"
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* DOCUMENT MANAGEMENT */}
          <div className="mb-8">
            <h2 className="text-2xl font-poppins font-semibold text-primary mb-4">
              Document Management
            </h2>
            <Card className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-light-grey text-left">
                    <th className="py-3 px-4 text-sm font-semibold text-neutral">Document Title</th>
                    <th className="py-3 px-4 text-sm font-semibold text-neutral">Status</th>
                    <th className="py-3 px-4 text-sm font-semibold text-neutral text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requiredDocuments.map((doc) => {
                    const uploadedFile = documents[doc.key];

                    return (
                      <tr key={doc.key} className="border-b border-neutral last:border-0">
                        <td className="py-4 px-4 font-medium text-dark">{doc.name}</td>
                        <td className="py-4 px-4">
                          <StatusBadge status={uploadedFile ? 'Uploaded' : 'Missing'} />
                        </td>
                        <td className="py-4 px-4 text-right">
                          {uploadedFile ? (
                            <div className="flex items-center justify-end gap-3">
                              <span className="text-sm text-neutral max-w-[160px] truncate">
                                {uploadedFile.name}
                              </span>
                              {isEditing && (
                                <>
                                  <label className="text-primary font-semibold hover:underline cursor-pointer text-sm">
                                    Replace
                                    <input
                                      type="file"
                                      className="hidden"
                                      onChange={(e) => handleDocumentUpload(e, doc.key)}
                                    />
                                  </label>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveDocument(doc.key)}
                                    className="text-red-600 font-semibold hover:underline text-sm"
                                  >
                                    Remove
                                  </button>
                                </>
                              )}
                            </div>
                          ) : (
                            isEditing && (
                              <label className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-dark cursor-pointer inline-block">
                                Upload
                                <input
                                  type="file"
                                  className="hidden"
                                  onChange={(e) => handleDocumentUpload(e, doc.key)}
                                />
                              </label>
                            )
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Card>
          </div>

          {/* ACTIONS & SAVE */}
          {isEditing && (
            <div className="flex justify-end gap-4 mb-8">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="border-2 border-neutral text-neutral px-6 py-3 rounded-xl font-semibold hover:bg-light-grey transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary-dark transition"
              >
                Save Profile
              </button>
            </div>
          )}
        </form>

        {saved && (
          <div className="bg-primary-lightest border border-primary rounded-xl p-4 mb-8">
            <p className="text-primary font-semibold">
              Profile and documents saved successfully.
            </p>
          </div>
        )}

        {/* NOTIFICATION CENTRE & APPLICATION HISTORY */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Notification Centre */}
          <div>
            <h2 className="text-2xl font-poppins font-semibold text-primary mb-4">
              Notification Centre
            </h2>
            <Card>
              <div className="space-y-4">
                {notifications.map((item, index) => (
                  <div
                    key={item.id}
                    className={index < notifications.length - 1 ? 'border-b border-neutral pb-3' : ''}
                  >
                    <p className="font-semibold text-dark">{item.message}</p>
                    <p className="text-xs text-neutral mt-1">{item.timestamp}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Application History */}
          <div>
            <h2 className="text-2xl font-poppins font-semibold text-primary mb-4">
              Application History
            </h2>
            <Card className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-light-grey">
                    <th className="py-2 px-3 text-xs font-semibold text-neutral">Module</th>
                    <th className="py-2 px-3 text-xs font-semibold text-neutral">Date</th>
                    <th className="py-2 px-3 text-xs font-semibold text-neutral">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {applicationHistory.map((app) => (
                    <tr key={app.id} className="border-b border-neutral last:border-0">
                      <td className="py-3 px-3 text-sm text-dark font-medium">{app.module}</td>
                      <td className="py-3 px-3 text-sm text-dark">{app.date}</td>
                      <td className="py-3 px-3 text-sm">
                        <StatusBadge status={app.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
