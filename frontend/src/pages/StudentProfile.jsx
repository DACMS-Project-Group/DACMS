import React, { useRef, useState, useMemo } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Card from '../components/Card';

const StudentProfile = () => {
  const signatureCanvasRef = useRef(null);
  const isDrawing = useRef(false);

  // Edit Mode State
  const [isEditing, setIsEditing] = useState(true);

  const [formData, setFormData] = useState({
    // Section A: Student Information
    justifiableReason: 'Student Assistant',
    studentType: 'local',
    studentNumber: '',
    idPassportNumber: '',
    passportNumber: '',
    personType: 'Student Assistant',
    title: '',
    surname: '',
    firstName: '',
    initials: '',
    middleNames: '',
    nickName: '',
    gender: '',
    race: '',
    maritalStatus: '',
    previousSurname: '',
    dateOfBirth: '',
    homeLanguage: '',
    preferenceLanguage: '',
    disability: '',
    primaryEmploymentOutside: '',
    saCitizen: '',
    nationality: '',
    countryOfBirth: '',
    countryOfPassportIssue: '',
    permitNumber: '',
    incomeTaxNo: '',
    currentlyEmployedByNwu: '',
    oeCodeAndName1: '',
    jobName1: '',
    oeCodeAndName2: '',
    jobName2: '',

    // Section B: Next of Kin
    nextOfKinTitle: '',
    nextOfKinInitials: '',
    nextOfKinSurname: '',
    nextOfKinName: '',
    nextOfKinRelationship: '',
    nextOfKinDaytimePhoneNo: '',
    nextOfKinMobile: '',
    isNextOfKinNwuEmployee: '',
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

    sameAsResidential: true,
    poBoxNo: '',
    privateBagNo: '',
    postOfficeBranch: '',
    postalCode: '',

    // Section D: Highest Qualification
    institution: '',
    qualificationType: '',
    qualificationStatus: '',
    awardedDate: '',

    // Section E: Bank Details
    accountHolderSurnameInitials: '',
    bankName: '',
    branchCode: '',
    accountNumber: '',
    accountType: '',
    accountHolderRelationship: '',

    // Declaration
    declarationInitialsSurname: '',
    declarationDate: '',
  });

  // Dynamically update required documents based on SA Citizenship state
  const requiredDocuments = useMemo(() => {
    const baseDocuments = [
      {
        key: 'academicTranscript',
        name: 'Academic Transcript',
        required: true,
      },
      {
        key: 'identityDocument',
        name:
          formData.saCitizen === 'Yes'
            ? 'Certified ID Document'
            : 'Certified Passport Copy',
        required: true,
      },
      {
        key: 'highestQualification',
        name: 'Certified Highest Qualification',
        required: true,
      },
      {
        key: 'bankConfirmation',
        name: 'Bank Confirmation Letter (Not older than 3 months)',
        required: true,
      },
      {
        key: 'registrationProof',
        name: 'NWU Registration Proof',
        required: true,
      },
    ];

    if (formData.saCitizen === 'No') {
      baseDocuments.push(
        {
          key: 'studyPermit',
          name: 'Valid Study Permit',
          required: true,
        },
        {
          key: 'workPermission',
          name: 'Work Permission Document (P&C101F)',
          required: true,
        }
      );
    }

    return baseDocuments;
  }, [formData.saCitizen]);

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

    if (!canvas) {
      return { x: 0, y: 0 };
    }

    const rect = canvas.getBoundingClientRect();

    const clientX = event.touches
      ? event.touches[0].clientX
      : event.clientX;

    const clientY = event.touches
      ? event.touches[0].clientY
      : event.clientY;

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

      context.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
      );
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
    setMessage('Student profile saved successfully.');
  };

  return (
    <div className="flex min-h-screen bg-off-white">
      <Sidebar userRole="student" />

      <main className="flex-1">
        <Navbar />

        {/* Header */}
        <div className="bg-primary text-white px-8 py-5 flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            Student Profile
          </h1>

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

        <form
          onSubmit={handleSaveProfile}
          className="p-8 space-y-6"
        >
          {/* SECTION A */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-bold text-primary-dark mb-6">
                Section A: Student Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block font-semibold mb-2">
                    Justifiable Reason{' '}
                    <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    name="justifiableReason"
                    value={formData.justifiableReason}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full border border-gray-300 rounded-lg p-3 disabled:bg-gray-100"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-2">
                    Student Number{' '}
                    <span className="text-red-500">*</span>
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
                    {formData.saCitizen === 'Yes'
                      ? 'ID No.'
                      : 'ID / Identity No.'}
                  </label>

                  <input
                    type="text"
                    name="idPassportNumber"
                    value={formData.idPassportNumber}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full border border-gray-300 rounded-lg p-3 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-2">
                    Person Type{' '}
                    <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    name="personType"
                    value={formData.personType}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full border border-gray-300 rounded-lg p-3 disabled:bg-gray-100"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-2">
                    Title{' '}
                    <span className="text-red-500">*</span>
                  </label>

                  <select
                    name="title"
                    value={formData.title}
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
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-2">
                    Surname{' '}
                    <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    name="surname"
                    value={formData.surname}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full border border-gray-300 rounded-lg p-3 disabled:bg-gray-100"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-2">
                    First Name{' '}
                    <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full border border-gray-300 rounded-lg p-3 disabled:bg-gray-100"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-2">
                    Initials{' '}
                    <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    name="initials"
                    value={formData.initials}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full border border-gray-300 rounded-lg p-3 disabled:bg-gray-100"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-2">
                    Middle Names
                  </label>

                  <input
                    type="text"
                    name="middleNames"
                    value={formData.middleNames}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full border border-gray-300 rounded-lg p-3 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-2">
                    Nick Name
                  </label>

                  <input
                    type="text"
                    name="nickName"
                    value={formData.nickName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full border border-gray-300 rounded-lg p-3 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-2">
                    Gender{' '}
                    <span className="text-red-500">*</span>
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
                    Race{' '}
                    <span className="text-red-500">*</span>
                  </label>

                  <select
                    name="race"
                    value={formData.race}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full border border-gray-300 rounded-lg p-3 disabled:bg-gray-100"
                    required
                  >
                    <option value="">Select race</option>
                    <option value="African">African</option>
                    <option value="Colored">Colored</option>
                    <option value="Indian">Indian</option>
                    <option value="White">White</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-2">
                    Marital Status{' '}
                    <span className="text-red-500">*</span>
                  </label>

                  <select
                    name="maritalStatus"
                    value={formData.maritalStatus}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full border border-gray-300 rounded-lg p-3 disabled:bg-gray-100"
                    required
                  >
                    <option value="">Select option</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-2">
                    Previous Surname
                  </label>

                  <input
                    type="text"
                    name="previousSurname"
                    value={formData.previousSurname}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full border border-gray-300 rounded-lg p-3 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-2">
                    Date of Birth{' '}
                    <span className="text-red-500">*</span>
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
                    Home Language{' '}
                    <span className="text-red-500">*</span>
                  </label>

                  <select
                    name="homeLanguage"
                    value={formData.homeLanguage}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full border border-gray-300 rounded-lg p-3 disabled:bg-gray-100"
                    required
                  >
                    <option value="">Select language</option>
                    <option value="Afrikaans">Afrikaans</option>
                    <option value="English">English</option>
                    <option value="isiNdebele">isiNdebele</option>
                    <option value="isiXhosa">isiXhosa</option>
                    <option value="isiZulu">isiZulu</option>
                    <option value="Sepedi">Sepedi</option>
                    <option value="Sesotho">Sesotho</option>
                    <option value="Setswana">Setswana</option>
                    <option value="siSwati">siSwati</option>
                    <option value="Tshivenda">Tshivenda</option>
                    <option value="TshiVenda">TshiVenda</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-2">
                    Preference Language{' '}
                    <span className="text-red-500">*</span>
                  </label>

                  <select
                    name="preferenceLanguage"
                    value={formData.preferenceLanguage}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full border border-gray-300 rounded-lg p-3 disabled:bg-gray-100"
                    required
                  >
                    <option value="">Select language</option>
                    <option value="English">English</option>
                    <option value="Afrikaans">Afrikaans</option>
                    <option value="Setswana">Setswana</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-2">
                    Disability{' '}
                    <span className="text-red-500">*</span>
                  </label>

                  <select
                    name="disability"
                    value={formData.disability}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full border border-gray-300 rounded-lg p-3 disabled:bg-gray-100"
                    required
                  >
                    <option value="">Select option</option>
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>

                {/* FIXED: NWU EMPLOYMENT FIELD */}
                <div>
                  <label className="block font-semibold mb-2">
                    Are you currently employed by NWU?{' '}
                    <span className="text-red-500">*</span>
                  </label>

                  <select
                    name="currentlyEmployedByNwu"
                    value={formData.currentlyEmployedByNwu}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full border border-gray-300 rounded-lg p-3 disabled:bg-gray-100"
                    required
                  >
                    <option value="">Select option</option>
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-2">
                    Primary Employment Outside of Organization?{' '}
                    <span className="text-red-500">*</span>
                  </label>

                  <select
                    name="primaryEmploymentOutside"
                    value={formData.primaryEmploymentOutside}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full border border-gray-300 rounded-lg p-3 disabled:bg-gray-100"
                    required
                  >
                    <option value="">Select option</option>
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-2">
                    SA Citizen{' '}
                    <span className="text-red-500">*</span>
                  </label>

                  <select
                    name="saCitizen"
                    value={formData.saCitizen}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full border border-gray-300 rounded-lg p-3 disabled:bg-gray-100"
                    required
                  >
                    <option value="">Select option</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-2">
                    Nationality{' '}
                    <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full border border-gray-300 rounded-lg p-3 disabled:bg-gray-100"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-2">
                    Country of Birth
                  </label>

                  <input
                    type="text"
                    name="countryOfBirth"
                    value={formData.countryOfBirth}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full border border-gray-300 rounded-lg p-3 disabled:bg-gray-100"
                  />
                </div>

                {/* FIXED: INCOME TAX FIELD */}
                <div>
                  <label className="block font-semibold mb-2">
                    Income Tax No.
                  </label>

                  <input
                    type="text"
                    name="incomeTaxNo"
                    value={formData.incomeTaxNo}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full border border-gray-300 rounded-lg p-3 disabled:bg-gray-100"
                  />
                </div>

                {/* Conditional Fields for Non-SA Citizens */}
                {formData.saCitizen === 'No' && (
                  <>
                    <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200 col-span-1 md:col-span-3">
                      <p className="text-xs text-yellow-800 font-semibold">
                        Non-SA Citizen Details Required
                      </p>
                    </div>

                    <div>
                      <label className="block font-semibold mb-2">
                        Passport Number{' '}
                        <span className="text-red-500">*</span>
                      </label>

                      <input
                        type="text"
                        name="passportNumber"
                        value={formData.passportNumber}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full border border-gray-300 rounded-lg p-3 disabled:bg-gray-100"
                        required={formData.saCitizen === 'No'}
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-2">
                        Country of Passport Issue{' '}
                        <span className="text-red-500">*</span>
                      </label>

                      <input
                        type="text"
                        name="countryOfPassportIssue"
                        value={formData.countryOfPassportIssue}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full border border-gray-300 rounded-lg p-3 disabled:bg-gray-100"
                        required={formData.saCitizen === 'No'}
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-2">
                        Study / Work Permit Number{' '}
                        <span className="text-red-500">*</span>
                      </label>

                      <input
                        type="text"
                        name="permitNumber"
                        value={formData.permitNumber}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full border border-gray-300 rounded-lg p-3 disabled:bg-gray-100"
                        required={formData.saCitizen === 'No'}
                      />
                    </div>
                  </>
                )}

                {/* NWU Employment Details */}
                {formData.currentlyEmployedByNwu === 'Yes' && (
                  <div className="mt-6 pt-4 border-t bg-gray-50 p-4 rounded-lg col-span-1 md:col-span-3">
                    <p className="font-semibold text-sm text-gray-700 mb-3">
                      NWU Employment Details:
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold mb-1">
                          OE Code and Name (1)
                        </label>

                        <input
                          type="text"
                          name="oeCodeAndName1"
                          value={formData.oeCodeAndName1}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="w-full border border-gray-300 rounded-lg p-2.5 disabled:bg-gray-100"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-1">
                          Job Name (1)
                        </label>

                        <input
                          type="text"
                          name="jobName1"
                          value={formData.jobName1}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="w-full border border-gray-300 rounded-lg p-2.5 disabled:bg-gray-100"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-1">
                          OE Code and Name (2)
                        </label>

                        <input
                          type="text"
                          name="oeCodeAndName2"
                          value={formData.oeCodeAndName2}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="w-full border border-gray-300 rounded-lg p-2.5 disabled:bg-gray-100"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-1">
                          Job Name (2)
                        </label>

                        <input
                          type="text"
                          name="jobName2"
                          value={formData.jobName2}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="w-full border border-gray-300 rounded-lg p-2.5 disabled:bg-gray-100"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* SECTION B */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-bold text-primary-dark mb-6">
                Section B: Next of Kin{' '}
                <span className="text-sm font-normal text-gray-500">
                  (in case of emergency)
                </span>
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
                    <option value="">Select option</option>
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
                  <label className="block font-semibold mb-2">
                    Name <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    name="nextOfKinName"
                    value={formData.nextOfKinName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full border border-gray-300 rounded-lg p-3 disabled:bg-gray-100"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-2">
                    Relationship{' '}
                    <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    name="nextOfKinRelationship"
                    value={formData.nextOfKinRelationship}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full border border-gray-300 rounded-lg p-3 disabled:bg-gray-100"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-2">
                    Daytime Phone No.
                  </label>

                  <input
                    type="tel"
                    name="nextOfKinDaytimePhoneNo"
                    value={formData.nextOfKinDaytimePhoneNo}
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
                  <label className="block font-semibold mb-2">
                    Is Next of Kin an NWU Employee?
                  </label>

                  <select
                    name="isNextOfKinNwuEmployee"
                    value={formData.isNextOfKinNwuEmployee}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full border border-gray-300 rounded-lg p-3 disabled:bg-gray-100"
                  >
                    <option value="">Select option</option>
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>

                {formData.isNextOfKinNwuEmployee === 'Yes' && (
                  <div>
                    <label className="block font-semibold mb-2">
                      If yes, his/her NWU No.{' '}
                      <span className="text-red-500">*</span>
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
                  <h3 className="font-bold text-lg text-gray-800 border-b pb-2">
                    Residential Address
                  </h3>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-semibold mb-1">
                        Unit No.
                      </label>

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
                      <label className="block text-sm font-semibold mb-1">
                        Complex
                      </label>

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
                        Street No.{' '}
                        <span className="text-red-500">*</span>
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
                        Street Name / Farm Name{' '}
                        <span className="text-red-500">*</span>
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
                      Suburb / District{' '}
                      <span className="text-red-500">*</span>
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
                        Town / City{' '}
                        <span className="text-red-500">*</span>
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
                        Postal Code{' '}
                        <span className="text-red-500">*</span>
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
                    <h3 className="font-bold text-lg text-gray-800">
                      Postal Address
                    </h3>

                    <label className="flex items-center text-xs text-gray-600 gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        name="sameAsResidential"
                        checked={formData.sameAsResidential}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="rounded"
                      />

                      Same as residential address
                    </label>
                  </div>

                  {!formData.sameAsResidential && (
                    <>
                      <div>
                        <label className="block text-sm font-semibold mb-1">
                          PO Box No.
                        </label>

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
                        <label className="block text-sm font-semibold mb-1">
                          Private Bag No.
                        </label>

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
                        <label className="block text-sm font-semibold mb-1">
                          Post Office Branch Name
                        </label>

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
                        <label className="block text-sm font-semibold mb-1">
                          Postal Code
                        </label>

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
                  <label className="block font-semibold mb-2">
                    Work Telephone No.
                  </label>

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
                    Email Address{' '}
                    <span className="text-red-500">*</span>
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
                Section D: Highest Qualification{' '}
                <span className="text-sm font-normal text-gray-500">
                  (Certified copy must accompany this form)
                </span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block font-semibold mb-2">
                    Institution{' '}
                    <span className="text-red-500">*</span>
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
                    Qualification Type{' '}
                    <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    name="qualificationType"
                    value={formData.qualificationType}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full border border-gray-300 rounded-lg p-3 disabled:bg-gray-100"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-2">
                    Qualification Status{' '}
                    <span className="text-red-500">*</span>
                  </label>

                  <select
                    name="qualificationStatus"
                    value={formData.qualificationStatus}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full border border-gray-300 rounded-lg p-3 disabled:bg-gray-100"
                    required
                  >
                    <option value="">Select option</option>
                    <option value="Completed">Completed</option>
                    <option value="In Progress">In Progress</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-2">
                    Awarded Date
                  </label>

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

              <p className="text-xs text-red-600 mb-6 italic">
                (No payment will be made if the bank account confirmation
                letter, not older than 3 months, is not attached)
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block font-semibold mb-2">
                    Account Holder Surname and Initials{' '}
                    <span className="text-red-500">*</span>
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
                    Name of Bank{' '}
                    <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full border border-gray-300 rounded-lg p-3 disabled:bg-gray-100"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-2">
                    Bank Branch Code{' '}
                    <span className="text-red-500">*</span>
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
                    Account Number{' '}
                    <span className="text-red-500">*</span>
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
                    Account Type{' '}
                    <span className="text-red-500">*</span>
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
                    <option value="Cheque / Current">
                      Cheque / Current
                    </option>
                    <option value="Savings">Savings</option>
                    <option value="Transmission">
                      Transmission
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-2">
                    Account Holder Relationship{' '}
                    <span className="text-red-500">*</span>
                  </label>

                  <select
                    name="accountHolderRelationship"
                    value={formData.accountHolderRelationship}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full border border-gray-300 rounded-lg p-3 disabled:bg-gray-100"
                    required
                  >
                    <option value="">Select relationship</option>
                    <option value="Own">Own Account</option>
                    <option value="Parent/Guardian">
                      Parent/Guardian Account
                    </option>
                    <option value="Spouse">Spouse Account</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>
          </Card>

          {/* REQUIRED DOCUMENTS */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-bold text-primary-dark mb-4">
                Required Document Attachments
              </h2>

              <p className="text-sm text-gray-600 mb-6">
                Please attach clear copies of all required supporting
                documentation below.
              </p>

              <div className="space-y-4">
                {requiredDocuments.map((doc) => (
                  <div
                    key={doc.key}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg bg-gray-50 gap-4"
                  >
                    <div>
                      <p className="font-semibold text-gray-800">
                        {doc.name}{' '}
                        {doc.required && (
                          <span className="text-red-500">*</span>
                        )}
                      </p>

                      {uploadedFiles[doc.key] && (
                        <p className="text-xs text-green-600 mt-1">
                          Selected: {uploadedFiles[doc.key].name}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      {isEditing ? (
                        <>
                          <input
                            type="file"
                            id={`file-${doc.key}`}
                            onChange={(e) =>
                              handleFileUpload(doc.key, e)
                            }
                            className="hidden"
                          />

                          <label
                            htmlFor={`file-${doc.key}`}
                            className="cursor-pointer bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 shadow-sm"
                          >
                            {uploadedFiles[doc.key]
                              ? 'Change File'
                              : 'Choose File'}
                          </label>

                          {uploadedFiles[doc.key] && (
                            <button
                              type="button"
                              onClick={() =>
                                handleRemoveFile(doc.key)
                              }
                              className="text-red-600 hover:text-red-800 text-sm font-medium"
                            >
                              Remove
                            </button>
                          )}
                        </>
                      ) : (
                        <span className="text-sm font-medium text-gray-500">
                          {uploadedFiles[doc.key]
                            ? 'Attached'
                            : 'Not Provided'}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* DECLARATION */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-bold text-primary-dark mb-4">
                Declaration
              </h2>

              <div className="space-y-4">
                <p className="text-sm text-gray-700 leading-relaxed font-medium">
                  I, the undersigned, hereby confirm that the information I
                  provided is true and correct.
                </p>

                <div className="flex items-start gap-3 mt-4">
                  <input
                    type="checkbox"
                    id="declarationAgreement"
                    checked={agreed}
                    onChange={(e) =>
                      isEditing && setAgreed(e.target.checked)
                    }
                    disabled={!isEditing}
                    className="mt-1 h-4 w-4 text-primary rounded border-gray-300"
                  />

                  <label
                    htmlFor="declarationAgreement"
                    className="text-sm font-medium text-gray-800"
                  >
                    I agree to the declaration statement above{' '}
                    <span className="text-red-500">*</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pt-4 border-t items-end">
                  <div>
                    <label className="block font-semibold mb-2">
                      Initials and Surname{' '}
                      <span className="text-red-500">*</span>
                    </label>

                    <input
                      type="text"
                      name="declarationInitialsSurname"
                      value={formData.declarationInitialsSurname}
                      onChange={handleChange}
                      placeholder="e.g. A.B. Smith"
                      disabled={!isEditing}
                      className="w-full border border-gray-300 rounded-lg p-3 disabled:bg-gray-100"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-2">
                      Student Signature{' '}
                      <span className="text-red-500">*</span>
                    </label>

                    {isEditing ? (
                      <div className="space-y-2">
                        <canvas
                          ref={signatureCanvasRef}
                          width={300}
                          height={100}
                          onMouseDown={startDrawing}
                          onMouseMove={draw}
                          onMouseUp={stopDrawing}
                          onMouseLeave={stopDrawing}
                          onTouchStart={startDrawing}
                          onTouchMove={draw}
                          onTouchEnd={stopDrawing}
                          className="border border-gray-300 rounded-lg bg-white w-full cursor-crosshair"
                        />

                        <button
                          type="button"
                          onClick={clearSignature}
                          className="text-xs text-red-600 font-semibold hover:underline"
                        >
                          Clear Signature
                        </button>
                      </div>
                    ) : (
                      <div className="border rounded-lg p-2 bg-gray-50 inline-block">
                        {signature && (
                          <img
                            src={signature}
                            alt="Student Signature"
                            className="h-16 object-contain"
                          />
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block font-semibold mb-2">
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

          {/* MESSAGE DISPLAY */}
          {message && (
            <div
              className={`p-4 rounded-lg font-medium text-sm ${
                message.includes('successfully')
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {message}
            </div>
          )}

          {/* SUBMIT BUTTON */}
          {isEditing && (
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-primary-dark transition shadow-md"
              >
                Save Profile
              </button>
            </div>
          )}
        </form>
      </main>
    </div>
  );
};

export default StudentProfile;