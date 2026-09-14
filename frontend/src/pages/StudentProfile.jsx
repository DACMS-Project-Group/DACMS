import React, { useRef, useState, useMemo } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Card from '../components/Card';

const StudentProfile = () => {
  const signatureCanvasRef = useRef(null);
  const isDrawing = useRef(false);

  // Edit Mode State: Set to true initially for creation, false once saved
  const [isEditing, setIsEditing] = useState(true);

  const [formData, setFormData] = useState({
    // Section A
    studentType: 'local',
    studentNumber: '',
    surname: '',
    fullNames: '',
    initials: '',
    dateOfBirth: '',
    idPassportNumber: '',
    gender: '',
    programme: '',
    yearOfStudy: '',

    // Section B: Next of Kin
    nextOfKinTitle: '',
    nextOfKinInitials: '',
    nextOfKinSurname: '',
    nextOfKinRelationship: '',
    nextOfKinWorkTelephoneNo: '',
    nextOfKinMobile: '',
    isNextOfKinNwuEmployee: 'No',
    nextOfKinNwuNumber: '',

    // Section C: Contact Details
    resUnitNo: '',
    resComplex: '',
    resStreetNo: '',
    resStreetName: '',
    resSuburb: '',
    resTownCity: '',
    resPostalCode: '',
    mobileNo: '',
    workPhoneNo: '',
    emailAddress: '',

    sameAsResidential: false,
    poBoxNo: '',
    privateBagNo: '',
    postOfficeBranch: '',
    postalCode: '',

    // Section D: Highest Qualification
    institution: 'North-West University',
    qualificationType: '',
    qualificationStatus: '',
    awardedDate: '',

    // Section E: Bank Details
    accountHolderSurnameInitials: '',
    bankName: '',
    branchCode: '',
    accountNumber: '',
    accountType: '',
    accountHolderRelationship: 'Own',

    // Section F: Declaration
    declarationDate: '',
  });

  const requiredDocuments = useMemo(() => {
    const baseDocuments = [
      { key: 'academicTranscript', name: 'Academic Transcript', required: true },
      { key: 'identityDocument', name: 'Certified Identity Document', required: true },
      { key: 'highestQualification', name: 'Certified Highest Qualification', required: true },
      { key: 'bankConfirmation', name: 'Bank Confirmation Letter', required: true },
      { key: 'registrationProof', name: 'NWU Registration Proof', required: true },
    ];

    if (formData.studentType === 'international') {
      baseDocuments.push(
        { key: 'passport', name: 'Certified Passport', required: true },
        { key: 'workPermission', name: 'Work Permission (P&C101F)', required: true },
        { key: 'studyPermit', name: 'Study Permit', required: true }
      );
    }

    return baseDocuments;
  }, [formData.studentType]);

  const [uploadedFiles, setUploadedFiles] = useState({});
  const [agreed, setAgreed] = useState(false);
  const [signature, setSignature] = useState('');
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const getCanvasCoordinates = (event) => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = event.touches ? event.touches[0].clientX : event.clientX;
    const clientY = event.touches ? event.touches[0].clientY : event.clientY;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (event) => {
    if (!isEditing) return;
    const canvas = signatureCanvasRef.current;
    const context = canvas.getContext('2d');
    const { x, y } = getCanvasCoordinates(event);

    isDrawing.current = true;
    context.beginPath();
    context.moveTo(x, y);
  };

  const draw = (event) => {
    if (!isDrawing.current || !isEditing) return;
    const canvas = signatureCanvasRef.current;
    const context = canvas.getContext('2d');
    const { x, y } = getCanvasCoordinates(event);

    context.lineWidth = 2;
    context.lineCap = 'round';
    context.strokeStyle = '#000000';
    context.lineTo(x, y);
    context.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing.current || !isEditing) return;
    isDrawing.current = false;
    const canvas = signatureCanvasRef.current;
    setSignature(canvas.toDataURL());
  };

  const clearSignature = () => {
    if (!isEditing) return;
    const canvas = signatureCanvasRef.current;
    if (canvas) {
      const context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);
    }
    setSignature('');
  };

  const handleFileUpload = (docKey, event) => {
    if (!isEditing) return;
    const file = event.target.files[0];
    if (!file) return;

    setUploadedFiles((prev) => ({
      ...prev,
      [docKey]: file,
    }));
  };

  const handleRemoveFile = (docKey) => {
    if (!isEditing) return;

    setUploadedFiles((prev) => {
      const updatedFiles = { ...prev };
      delete updatedFiles[docKey];
      return updatedFiles;
    });
  };

  const handleSaveProfile = (event) => {
    event.preventDefault();

    if (!agreed) {
      setMessage('Please confirm the declaration before saving.');
      return;
    }
    if (!signature) {
      setMessage('Please provide your signature before saving.');
      return;
    }
    if (!formData.declarationDate) {
      setMessage('Please enter the date in the declaration section.');
      return;
    }

    const unuploadedRequired = requiredDocuments.filter(
      (doc) => doc.required && !uploadedFiles[doc.key]
    );

    if (unuploadedRequired.length > 0) {
      setMessage(
        `Please upload all required documents: ${unuploadedRequired
          .map((d) => d.name)
          .join(', ')}`
      );
      return;
    }

    setIsEditing(false);
    setMessage('Student profile saved successfully. Information is locked for editing.');
  };

  return (
    <div className="flex min-h-screen bg-off-white">
      <Sidebar userRole="student" />

      <main className="flex-1">
        <Navbar />
        <div className="bg-primary text-white px-8 py-5 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Student Profile</h1>
          {!isEditing && (
            <button
              type="button"
              onClick={() => {
                setIsEditing(true);
                setMessage('');
              }}
              className="bg-white text-primary px-5 py-2 rounded-lg font-semibold hover:bg-gray-100 transition shadow"
            >
              Edit Profile
            </button>
          )}
        </div>

        <form onSubmit={handleSaveProfile} className="p-8 space-y-6">
          {/* SECTION A */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-bold text-primary-dark mb-6">
                Section A: Student Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block font-semibold mb-2">
                    Student Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="studentType"
                    value={formData.studentType}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full border border-gray-300 rounded-lg p-3 disabled:bg-gray-100"
                    required
                  >
                    <option value="local">South African Student</option>
                    <option value="international">International Student</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-2">
                    Student Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="studentNumber"
                    value={formData.studentNumber}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full border border-gray-300 rounded-lg p-3 disabled:bg-gray-100"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-2">
                    Surname <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="surname"
                    value={formData.surname}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder=""
                    className="w-full border border-gray-300 rounded-lg p-3 disabled:bg-gray-100"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-2">
                    Full Names <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullNames"
                    value={formData.fullNames}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full border border-gray-300 rounded-lg p-3 disabled:bg-gray-100"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-2">
                    Initials <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="initials"
                    value={formData.initials}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder=""
                    className="w-full border border-gray-300 rounded-lg p-3 disabled:bg-gray-100"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-2">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full border border-gray-300 rounded-lg p-3 disabled:bg-gray-100"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-2">
                    ID / Passport Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="idPassportNumber"
                    value={formData.idPassportNumber}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full border border-gray-300 rounded-lg p-3 disabled:bg-gray-100"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-2">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full border border-gray-300 rounded-lg p-3 disabled:bg-gray-100"
                    required
                  >
                    <option value="">Select gender</option>
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-2">
                    Academic Programme <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="programme"
                    value={formData.programme}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="e.g. BSc Information Technology"
                    className="w-full border border-gray-300 rounded-lg p-3 disabled:bg-gray-100"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-2">
                    Year of Study <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="yearOfStudy"
                    value={formData.yearOfStudy}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full border border-gray-300 rounded-lg p-3 disabled:bg-gray-100"
                    required
                  >
                    <option value="">Select year of study</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year / Honours">4th Year / Honours</option>
                    <option value="Master's">Master's</option>
                    <option value="Doctorate">Doctorate</option>
                  </select>
                </div>
              </div>
            </div>
          </Card>

          {/* SECTION B */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-bold text-primary-dark mb-6">
                Section B: Next of Kin <span className="text-sm font-normal text-gray-500">(in case of emergency)</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block font-semibold mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="nextOfKinTitle"
                    value={formData.nextOfKinTitle}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full border border-gray-300 rounded-lg p-3 disabled:bg-gray-100"
                    required
                  >
                    <option value="">Select title</option>
                    <option value="Mr">Mr</option>
                    <option value="Mrs">Mrs</option>
                    <option value="Ms">Ms</option>
                    <option value="Dr">Dr</option>
                    <option value="Prof">Prof</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-2">
                    Initials <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nextOfKinInitials"
                    value={formData.nextOfKinInitials}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="e.g. N S"
                    className="w-full border border-gray-300 rounded-lg p-3 disabled:bg-gray-100"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2">
                    Surname <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nextOfKinSurname"
                    value={formData.nextOfKinSurname}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full border border-gray-300 rounded-lg p-3 disabled:bg-gray-100"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2">Work Telephone No.</label>
                  <input
                    type="tel"
                    name="nextOfKinWorkTelephoneNo"
                    value={formData.nextOfKinWorkTelephoneNo}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full border border-gray-300 rounded-lg p-3 disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2">
                    Mobile No. <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="nextOfKinMobile"
                    value={formData.nextOfKinMobile}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full border border-gray-300 rounded-lg p-3 disabled:bg-gray-100"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2">Is Next of Kin an NWU Employee?</label>
                  <select
                    name="isNextOfKinNwuEmployee"
                    value={formData.isNextOfKinNwuEmployee}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full border border-gray-300 rounded-lg p-3 disabled:bg-gray-100"
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>
                {formData.isNextOfKinNwuEmployee === 'Yes' && (
                  <div>
                    <label className="block font-semibold mb-2">
                      NWU Staff Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="nextOfKinNwuNumber"
                      value={formData.nextOfKinNwuNumber}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full border border-gray-300 rounded-lg p-3 disabled:bg-gray-100"
                      required
                    />
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* SECTION C */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-bold text-primary-dark mb-6">
                Section C: Contact Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Residential Address */}
                <div className="space-y-4">
                  <h3 className="font-bold text-lg text-gray-800 border-b pb-2">Residential Address</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-semibold mb-1">Unit No.</label>
                      <input
                        type="text"
                        name="resUnitNo"
                        value={formData.resUnitNo}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full border border-gray-300 rounded-lg p-2.5 disabled:bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">Complex</label>
                      <input
                        type="text"
                        name="resComplex"
                        value={formData.resComplex}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full border border-gray-300 rounded-lg p-2.5 disabled:bg-gray-100"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm font-semibold mb-1">
                        Street No. <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="resStreetNo"
                        value={formData.resStreetNo}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full border border-gray-300 rounded-lg p-2.5 disabled:bg-gray-100"
                        required
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-semibold mb-1">
                        Street / Farm Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="resStreetName"
                        value={formData.resStreetName}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full border border-gray-300 rounded-lg p-2.5 disabled:bg-gray-100"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-1">
                      Suburb / District <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="resSuburb"
                      value={formData.resSuburb}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full border border-gray-300 rounded-lg p-2.5 disabled:bg-gray-100"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-semibold mb-1">
                        Town / City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="resTownCity"
                        value={formData.resTownCity}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full border border-gray-300 rounded-lg p-2.5 disabled:bg-gray-100"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">
                        Postal Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="resPostalCode"
                        value={formData.resPostalCode}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full border border-gray-300 rounded-lg p-2.5 disabled:bg-gray-100"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Postal Address */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <h3 className="font-bold text-lg text-gray-800">Postal Address</h3>
                    <label className="flex items-center text-xs text-gray-600 gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        name="sameAsResidential"
                        checked={formData.sameAsResidential}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="rounded"
                      />
                      Same as residential
                    </label>
                  </div>

                  {!formData.sameAsResidential && (
                    <>
                      <div>
                        <label className="block text-sm font-semibold mb-1">PO Box No.</label>
                        <input
                          type="text"
                          name="poBoxNo"
                          value={formData.poBoxNo}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="w-full border border-gray-300 rounded-lg p-2.5 disabled:bg-gray-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-1">Private Bag No.</label>
                        <input
                          type="text"
                          name="privateBagNo"
                          value={formData.privateBagNo}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="w-full border border-gray-300 rounded-lg p-2.5 disabled:bg-gray-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-1">Post Office Branch Name</label>
                        <input
                          type="text"
                          name="postOfficeBranch"
                          value={formData.postOfficeBranch}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="w-full border border-gray-300 rounded-lg p-2.5 disabled:bg-gray-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-1">Postal Code</label>
                        <input
                          type="text"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="w-full border border-gray-300 rounded-lg p-2.5 disabled:bg-gray-100"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6 pt-6 border-t">
                <div>
                  <label className="block font-semibold mb-2">
                    Mobile No. <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="mobileNo"
                    value={formData.mobileNo}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full border border-gray-300 rounded-lg p-3 disabled:bg-gray-100"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2">Work Telephone No.</label>
                  <input
                    type="tel"
                    name="workPhoneNo"
                    value={formData.workPhoneNo}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full border border-gray-300 rounded-lg p-3 disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="emailAddress"
                    value={formData.emailAddress}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full border border-gray-300 rounded-lg p-3 disabled:bg-gray-100"
                    required
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* SECTION D */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-bold text-primary-dark mb-6">
                Section D: Highest Qualification <span className="text-sm font-normal text-gray-500">(Certified copy must accompany this form)</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block font-semibold mb-2">
                    Institution <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="institution"
                    value={formData.institution}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full border border-gray-300 rounded-lg p-3 disabled:bg-gray-100"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2">
                    Qualification Type <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="qualificationType"
                    value={formData.qualificationType}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="e.g. BSc Information Technology"
                    className="w-full border border-gray-300 rounded-lg p-3 disabled:bg-gray-100"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2">
                    Qualification Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="qualificationStatus"
                    value={formData.qualificationStatus}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full border border-gray-300 rounded-lg p-3 disabled:bg-gray-100"
                    required
                  >
                    <option value="">Select status</option>
                    <option value="Completed">Completed</option>
                    <option value="In Progress">In Progress</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-2">Awarded Date</label>
                  <input
                    type="date"
                    name="awardedDate"
                    value={formData.awardedDate}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full border border-gray-300 rounded-lg p-3 disabled:bg-gray-100"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* SECTION E */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-bold text-primary-dark mb-2">
                Section E: Bank Details
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Please provide South African bank account details for claim disbursements.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block font-semibold mb-2">
                    Account Holder Surname & Initials <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="accountHolderSurnameInitials"
                    value={formData.accountHolderSurnameInitials}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full border border-gray-300 rounded-lg p-3 disabled:bg-gray-100"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2">
                    Bank Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="e.g. ABSA, FNB, Standard Bank, Capitec"
                    className="w-full border border-gray-300 rounded-lg p-3 disabled:bg-gray-100"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2">
                    Branch Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="branchCode"
                    value={formData.branchCode}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full border border-gray-300 rounded-lg p-3 disabled:bg-gray-100"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2">
                    Account Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full border border-gray-300 rounded-lg p-3 disabled:bg-gray-100"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2">
                    Account Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="accountType"
                    value={formData.accountType}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full border border-gray-300 rounded-lg p-3 disabled:bg-gray-100"
                    required
                  >
                    <option value="">Select account type</option>
                    <option value="Cheque / Current">Cheque / Current</option>
                    <option value="Savings">Savings</option>
                    <option value="Transmission">Transmission</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-2">
                    Relationship to Account Holder <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="accountHolderRelationship"
                    value={formData.accountHolderRelationship}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="Own, Parent, Spouse, etc."
                    className="w-full border border-gray-300 rounded-lg p-3 disabled:bg-gray-100"
                    required
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* SECTION F */}
          <Card>
            <div className="p-6 space-y-6">
              <h2 className="text-xl font-bold text-primary-dark mb-4">
                Section F: Required Documents & Declaration
              </h2>

              {/* Document Uploads */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-gray-800">1. Supporting Documents</h3>
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                  {requiredDocuments.map((doc) => (
                    <div key={doc.key} className="border p-4 rounded-lg bg-gray-50 flex flex-col justify-between space-y-3">
                      <div>
                        <p className="font-medium text-sm text-gray-800">
                          {doc.name} {doc.required && <span className="text-red-500">*</span>}
                        </p>
                        {uploadedFiles[doc.key] ? (
                          <div className="mt-2 flex items-center justify-between gap-3">
                            <p className="text-xs text-green-600 font-semibold">
                              Uploaded: {uploadedFiles[doc.key].name}
                            </p>
                            {isEditing && (
                              <button
                                type="button"
                                onClick={() => handleRemoveFile(doc.key)}
                                className="text-xs text-red-600 hover:underline font-semibold"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        ) : (
                          <p className="text-xs text-gray-500 mt-1">No file selected</p>
                        )}
                      </div>
                      <input
                        type="file"
                        onChange={(e) => handleFileUpload(doc.key, e)}
                        disabled={!isEditing}
                        className="text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark cursor-pointer disabled:opacity-50"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Signature Canvas & Declaration */}
              <div className="pt-6 border-t space-y-4">
                <h3 className="font-semibold text-lg text-gray-800">2. Legal Declaration</h3>
                
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    disabled={!isEditing}
                    className="mt-1 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700 leading-relaxed">
                    I declare that all information supplied in this profile and attached documentation is true and correct. I understand that false or misleading details may result in administrative action or disqualification from appointment and claims processing.
                  </span>
                </label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block font-semibold text-sm">
                        Digital Signature <span className="text-red-500">*</span>
                      </label>
                      {isEditing && (
                        <button
                          type="button"
                          onClick={clearSignature}
                          className="text-xs text-red-600 hover:underline font-semibold"
                        >
                          Clear Signature
                        </button>
                      )}
                    </div>
                    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
                      <canvas
                        ref={signatureCanvasRef}
                        width={400}
                        height={120}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                        className={`w-full h-30 touch-none ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : 'cursor-crosshair'}`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold mb-2 text-sm">
                      Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="declarationDate"
                      value={formData.declarationDate}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full border border-gray-300 rounded-lg p-3 disabled:bg-gray-100"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Feedback Messages & Submit Button */}
          {message && (
            <div
              className={`p-4 rounded-lg font-medium text-sm ${
                !isEditing
                  ? 'bg-green-100 text-green-800 border border-green-200'
                  : 'bg-red-100 text-red-800 border border-red-200'
              }`}
            >
              {message}
            </div>
          )}

          {isEditing && (
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg font-bold transition shadow-lg"
              >
                Save Profile Details
              </button>
            </div>
          )}
        </form>
      </main>
    </div>
  );
};

export default StudentProfile;