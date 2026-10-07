import React, { useRef, useState, useMemo, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import { apiGet, apiPatch, apiUpload } from '../api';

// Which camelCase payload keys belong to which section.
const SECTION_FIELDS = {
  A: [
    'title', 'initials', 'middleNames', 'nickName', 'gender', 'race',
    'maritalStatus', 'previousSurname', 'dateOfBirth', 'homeLanguage',
    'preferenceLanguage', 'disability', 'primaryEmploymentOutside',
    'saCitizen', 'nationality', 'countryOfBirth', 'countryOfPassportIssue',
    'permitNumber', 'incomeTaxNumber', 'idPassportNumber',
    'currentlyEmployedByNwu', 'oeCodeAndName1', 'jobName1',
    'oeCodeAndName2', 'jobName2',
    'firstName', 'lastName', 'email',
  ],
  B: [
    'nextOfKinTitle', 'nextOfKinInitials', 'nextOfKinSurname',
    'nextOfKinName', 'nextOfKinRelationship', 'nextOfKinDaytimePhoneNo',
    'nextOfKinMobile', 'isNextOfKinNwuEmployee', 'nextOfKinNwuNumber',
  ],
  C: [
    'resUnitNo', 'resComplex', 'resStreetNo', 'resStreetName', 'resSuburb',
    'resTownCity', 'resPostalCode', 'sameAsResidential', 'poBoxNo',
    'privateBagNo', 'postOfficeBranch', 'mailingPostalCode', 'workPhoneNo',
    'contactDetails',
  ],
  D: [
    'qualificationInstitution', 'qualificationType',
    'qualificationStatus', 'qualificationAwardedDate',
  ],
  E: [
    'bankName', 'branchCode', 'accountNumber', 'accountType',
    'accountHolderName', 'accountHolderRelationship',
  ],
  F: [
    'declarationInitialsSurname', 'declarationDate',
    'declarationAgreed', 'signature',
  ],
};

const StudentProfile = () => {
  const signatureCanvasRef = useRef(null);
  const isDrawing = useRef(false);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [savingSection, setSavingSection] = useState(null);
  const [sectionMessages, setSectionMessages] = useState({});

  const [formData, setFormData] = useState({
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

    nextOfKinTitle: '',
    nextOfKinInitials: '',
    nextOfKinSurname: '',
    nextOfKinName: '',
    nextOfKinRelationship: '',
    nextOfKinDaytimePhoneNo: '',
    nextOfKinMobile: '',
    isNextOfKinNwuEmployee: '',
    nextOfKinNwuNumber: '',

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

    institution: '',
    qualificationType: '',
    qualificationStatus: '',
    awardedDate: '',

    accountHolderSurnameInitials: '',
    bankName: '',
    branchCode: '',
    accountNumber: '',
    accountType: '',
    accountHolderRelationship: '',

    declarationInitialsSurname: '',
    declarationDate: '',
  });

  const [uploadedFiles, setUploadedFiles] = useState({});
  const [uploadingFiles, setUploadingFiles] = useState({});
  const [uploadErrors, setUploadErrors] = useState({});

  const [agreed, setAgreed] = useState(false);
  const [signature, setSignature] = useState('');

  // ---- Load profile ----
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        const data = await apiGet('/student/profile');
        const s = data?.student ?? {};

        const toDateInput = (v) => (v ? String(v).split('T')[0] : '');
        const toYesNo = (v) => (v === true ? 'Yes' : v === false ? 'No' : '');

        if (cancelled) return;

        setFormData((prev) => ({
          ...prev,
          title: s.title ?? '',
          surname: s.last_name ?? '',
          firstName: s.first_name ?? '',
          initials: s.initials ?? '',
          middleNames: s.middle_names ?? '',
          nickName: s.nick_name ?? '',
          gender: s.gender ?? '',
          race: s.race ?? '',
          maritalStatus: s.marital_status ?? '',
          previousSurname: s.previous_surname ?? '',
          dateOfBirth: toDateInput(s.date_of_birth),
          homeLanguage: s.home_language ?? '',
          preferenceLanguage: s.preference_language ?? '',
          disability: s.disability ?? '',
          primaryEmploymentOutside: s.primary_employment_outside ?? '',
          saCitizen: toYesNo(s.sa_citizen),
          nationality: s.nationality ?? '',
          countryOfBirth: s.country_of_birth ?? '',
          countryOfPassportIssue: s.country_of_passport_issue ?? '',
          permitNumber: s.permit_number ?? '',
          incomeTaxNo: s.income_tax_number ?? '',
          studentNumber: s.student_number ?? '',
          idPassportNumber: s.id_passport_number ?? '',
          currentlyEmployedByNwu: s.currently_employed_by_nwu ?? '',
          oeCodeAndName1: s.oe_code_and_name_1 ?? '',
          jobName1: s.job_name_1 ?? '',
          oeCodeAndName2: s.oe_code_and_name_2 ?? '',
          jobName2: s.job_name_2 ?? '',

          nextOfKinTitle: s.next_of_kin_title ?? '',
          nextOfKinInitials: s.next_of_kin_initials ?? '',
          nextOfKinSurname: s.next_of_kin_surname ?? '',
          nextOfKinName: s.next_of_kin_name ?? '',
          nextOfKinRelationship: s.next_of_kin_relationship ?? '',
          nextOfKinDaytimePhoneNo: s.next_of_kin_daytime_phone_no ?? '',
          nextOfKinMobile: s.next_of_kin_mobile ?? '',
          isNextOfKinNwuEmployee: s.is_next_of_kin_nwu_employee ?? '',
          nextOfKinNwuNumber: s.next_of_kin_nwu_number ?? '',

          resUnitNo: s.res_unit_no ?? '',
          resComplex: s.res_complex ?? '',
          resStreetNo: s.res_street_no ?? '',
          resStreetName: s.res_street_name ?? '',
          resSuburb: s.res_suburb ?? '',
          resTownCity: s.res_town_city ?? '',
          resPostalCode: s.res_postal_code ?? '',
          mobileNo: s.contact_details ?? '',
          workPhoneNo: s.work_phone_no ?? '',
          emailAddress: s.email ?? '',
          sameAsResidential: s.same_as_residential ?? true,
          poBoxNo: s.po_box_no ?? '',
          privateBagNo: s.private_bag_no ?? '',
          postOfficeBranch: s.post_office_branch ?? '',
          postalCode: s.mailing_postal_code ?? '',

          institution: s.qualification_institution ?? '',
          qualificationType: s.qualification_type ?? '',
          qualificationStatus: s.qualification_status ?? '',
          awardedDate: toDateInput(s.qualification_awarded_date),

          accountHolderSurnameInitials: s.account_holder_name ?? '',
          bankName: s.bank_name ?? '',
          branchCode: s.branch_code ?? '',
          accountNumber: s.account_number ?? '',
          accountType: s.account_type ?? '',
          accountHolderRelationship: s.account_holder_relationship ?? '',

          declarationInitialsSurname: s.declaration_initials_surname ?? '',
          declarationDate: toDateInput(s.declaration_date),
        }));

        // Reflect declaration state from DB
        if (typeof s.declaration_agreed === 'boolean') setAgreed(s.declaration_agreed);
        if (s.signature) setSignature(s.signature);

        setLoadError('');
      } catch (err) {
        if (!cancelled) setLoadError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // ---- Load existing documents ----
  useEffect(() => {
    let cancelled = false;

    const loadDocuments = async () => {
      try {
        const data = await apiGet('/student/documents');
        const docs = data?.documents ?? [];

        if (cancelled) return;

        const byType = {};
        docs.forEach((d) => {
          const type = d.document_type ?? d.DocumentType ?? d.documentType;
          if (!type) return;
          const path = d.file_path ?? d.FilePath ?? d.filePath ?? '';
          byType[type] = {
            fileName: String(path).split(/[\\/]/).pop(),
            path,
          };
        });

        setUploadedFiles(byType);
      } catch {
        // Documents list failing shouldn't block the profile page
      }
    };

    loadDocuments();
    return () => {
      cancelled = true;
    };
  }, []);

  const requiredDocuments = useMemo(() => {
    const base = [
      { key: 'academicTranscript', name: 'Academic Transcript' },
      {
        key: 'identityDocument',
        name:
          formData.saCitizen === 'Yes'
            ? 'Certified ID Document'
            : 'Certified Passport Copy',
      },
      { key: 'highestQualification', name: 'Certified Highest Qualification' },
      {
        key: 'bankConfirmation',
        name: 'Bank Confirmation Letter (Not older than 3 months)',
      },
      { key: 'registrationProof', name: 'NWU Registration Proof' },
    ];

    if (formData.saCitizen === 'No') {
      base.push(
        { key: 'studyPermit', name: 'Valid Study Permit' },
        { key: 'workPermission', name: 'Work Permission Document (P&C101F)' }
      );
    }
    return base;
  }, [formData.saCitizen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // ---- Signature canvas ----
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
    const canvas = signatureCanvasRef.current;
    const context = canvas.getContext('2d');
    const { x, y } = getCanvasCoordinates(event);
    isDrawing.current = true;
    context.beginPath();
    context.moveTo(x, y);
  };

  const draw = (event) => {
    if (!isDrawing.current) return;
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
    if (!isDrawing.current) return;
    isDrawing.current = false;
    const canvas = signatureCanvasRef.current;
    setSignature(canvas.toDataURL());
  };

  const clearSignature = () => {
    const canvas = signatureCanvasRef.current;
    if (canvas) {
      const context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);
    }
    setSignature('');
  };

  // ---- Upload handlers ----
  const handleFileUpload = async (docKey, event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadingFiles((prev) => ({ ...prev, [docKey]: true }));
    setUploadErrors((prev) => ({ ...prev, [docKey]: '' }));

    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('documentType', docKey);

      const data = await apiUpload('/student/documents', fd);
      const saved = data?.document ?? {};
      const path =
        saved.file_path ?? saved.FilePath ?? saved.filePath ?? file.name;

      setUploadedFiles((prev) => ({
        ...prev,
        [docKey]: {
          fileName: file.name,
          path,
        },
      }));
    } catch (err) {
      setUploadErrors((prev) => ({ ...prev, [docKey]: err.message }));
    } finally {
      setUploadingFiles((prev) => ({ ...prev, [docKey]: false }));
    }
  };

  const handleRemoveFile = (docKey) => {
    // Local-only removal; there's no DELETE endpoint in the current routes.
    setUploadedFiles((prev) => {
      const updated = { ...prev };
      delete updated[docKey];
      return updated;
    });
    setUploadErrors((prev) => {
      const updated = { ...prev };
      delete updated[docKey];
      return updated;
    });
  };

  // ---- Full payload ----
  const buildFullPayload = () => {
    const toBool = (v) => (v === 'Yes' ? true : v === 'No' ? false : null);

    return {
      firstName: formData.firstName || null,
      lastName: formData.surname || null,
      email: formData.emailAddress || null,

      title: formData.title || null,
      initials: formData.initials || null,
      middleNames: formData.middleNames || null,
      nickName: formData.nickName || null,
      gender: formData.gender || null,
      race: formData.race || null,
      maritalStatus: formData.maritalStatus || null,
      previousSurname: formData.previousSurname || null,
      dateOfBirth: formData.dateOfBirth || null,
      homeLanguage: formData.homeLanguage || null,
      preferenceLanguage: formData.preferenceLanguage || null,
      disability: formData.disability || null,
      primaryEmploymentOutside: formData.primaryEmploymentOutside || null,
      saCitizen: toBool(formData.saCitizen),
      nationality: formData.nationality || null,
      countryOfBirth: formData.countryOfBirth || null,
      countryOfPassportIssue: formData.countryOfPassportIssue || null,
      permitNumber: formData.permitNumber || null,
      incomeTaxNumber: formData.incomeTaxNo || null,
      idPassportNumber: formData.idPassportNumber || null,
      currentlyEmployedByNwu: formData.currentlyEmployedByNwu || null,
      oeCodeAndName1: formData.oeCodeAndName1 || null,
      jobName1: formData.jobName1 || null,
      oeCodeAndName2: formData.oeCodeAndName2 || null,
      jobName2: formData.jobName2 || null,

      nextOfKinTitle: formData.nextOfKinTitle || null,
      nextOfKinInitials: formData.nextOfKinInitials || null,
      nextOfKinSurname: formData.nextOfKinSurname || null,
      nextOfKinName: formData.nextOfKinName || null,
      nextOfKinRelationship: formData.nextOfKinRelationship || null,
      nextOfKinDaytimePhoneNo: formData.nextOfKinDaytimePhoneNo || null,
      nextOfKinMobile: formData.nextOfKinMobile || null,
      isNextOfKinNwuEmployee: formData.isNextOfKinNwuEmployee || null,
      nextOfKinNwuNumber: formData.nextOfKinNwuNumber || null,

      resUnitNo: formData.resUnitNo || null,
      resComplex: formData.resComplex || null,
      resStreetNo: formData.resStreetNo || null,
      resStreetName: formData.resStreetName || null,
      resSuburb: formData.resSuburb || null,
      resTownCity: formData.resTownCity || null,
      resPostalCode: formData.resPostalCode || null,
      sameAsResidential: formData.sameAsResidential ?? true,
      poBoxNo: formData.poBoxNo || null,
      privateBagNo: formData.privateBagNo || null,
      postOfficeBranch: formData.postOfficeBranch || null,
      mailingPostalCode: formData.postalCode || null,
      workPhoneNo: formData.workPhoneNo || null,

      contactDetails: formData.mobileNo || null,

      qualificationInstitution: formData.institution || null,
      qualificationType: formData.qualificationType || null,
      qualificationStatus: formData.qualificationStatus || null,
      qualificationAwardedDate: formData.awardedDate || null,

      bankName: formData.bankName || null,
      branchCode: formData.branchCode || null,
      accountNumber: formData.accountNumber || null,
      accountType: formData.accountType || null,
      accountHolderName: formData.accountHolderSurnameInitials || null,
      accountHolderRelationship: formData.accountHolderRelationship || null,

      declarationInitialsSurname:
        formData.declarationInitialsSurname ||
        `${formData.initials} ${formData.surname}`.trim() ||
        null,
      declarationDate:
        formData.declarationDate || new Date().toISOString().split('T')[0],
      declarationAgreed: agreed,
      signature: signature || null,
    };
  };

  // ---- Save a single section ----
  const handleSaveSection = (sectionKey) => async (event) => {
    event.preventDefault();

    setSectionMessages((prev) => ({ ...prev, [sectionKey]: '' }));
    setSavingSection(sectionKey);

    try {
      const full = buildFullPayload();
      const allowed = SECTION_FIELDS[sectionKey];
      const sliced = {};
      allowed.forEach((k) => {
        if (full[k] !== undefined) sliced[k] = full[k];
      });

      await apiPatch('/student/profile/edit', sliced);

      setSectionMessages((prev) => ({ ...prev, [sectionKey]: 'Saved.' }));

      if (sectionKey === 'F') {
        const declarationName =
          `${formData.initials} ${formData.surname}`.trim();
        const declarationDate = new Date().toISOString().split('T')[0];
        setFormData((prev) => ({
          ...prev,
          declarationInitialsSurname: declarationName,
          declarationDate,
        }));
      }
    } catch (err) {
      setSectionMessages((prev) => ({
        ...prev,
        [sectionKey]: `Failed: ${err.message}`,
      }));
    } finally {
      setSavingSection(null);
    }
  };

  const SectionSaveButton = ({ sectionKey }) => (
    <div className="flex items-center justify-end gap-3 pt-4 mt-6 border-t">
      {sectionMessages[sectionKey] && (
        <span
          className={`text-sm font-medium ${
            sectionMessages[sectionKey].startsWith('Saved')
              ? 'text-green-700'
              : 'text-red-700'
          }`}
        >
          {sectionMessages[sectionKey]}
        </span>
      )}
      <button
        type="submit"
        disabled={savingSection === sectionKey}
        className="bg-primary text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-primary-dark transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {savingSection === sectionKey
          ? 'Saving…'
          : `Save Section ${sectionKey}`}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-off-white">
      <Navbar />

      <div className="flex">
        <Sidebar userRole="student" />

        <main className="flex-1">
          <div className="bg-primary text-white px-8 py-5 flex items-center justify-between">
            <h1 className="text-2xl font-bold">Student Profile</h1>
          </div>

          {loading && (
            <div className="p-8">
              <Card>
                <p className="py-6 text-center text-neutral font-inter">
                  Loading profile…
                </p>
              </Card>
            </div>
          )}

          {!loading && loadError && (
            <div className="p-8">
              <Card>
                <div className="py-6 text-center">
                  <p className="font-semibold text-error font-inter">
                    Could not load profile
                  </p>
                  <p className="mt-1 text-sm text-neutral font-inter">
                    {loadError}
                  </p>
                </div>
              </Card>
            </div>
          )}

          {!loading && !loadError && (
            <div className="p-8 space-y-6">
              {/* ============ SECTION A ============ */}
              <form onSubmit={handleSaveSection('A')}>
                <Card>
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-primary-dark mb-6">
                      Section A: Student Information
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <div>
                        <label className="block font-semibold mb-2">
                          Justifiable Reason <span className="text-red-500">*</span>
                        </label>
                        <input type="text" name="justifiableReason"
                          value={formData.justifiableReason}
                          onChange={handleChange} required
                          className="w-full border border-gray-300 rounded-lg p-3" />
                      </div>

                      <div>
                        <label className="block font-semibold mb-2">
                          Student Number <span className="text-red-500">*</span>
                        </label>
                        <input type="text" name="studentNumber"
                          value={formData.studentNumber}
                          onChange={handleChange} required
                          className="w-full border border-gray-300 rounded-lg p-3" />
                      </div>

                      <div>
                        <label className="block font-semibold mb-2">
                          {formData.saCitizen === 'Yes' ? 'ID No.' : 'ID / Identity No.'}
                        </label>
                        <input type="text" name="idPassportNumber"
                          value={formData.idPassportNumber}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-lg p-3" />
                      </div>

                      <div>
                        <label className="block font-semibold mb-2">
                          Person Type <span className="text-red-500">*</span>
                        </label>
                        <input type="text" name="personType"
                          value={formData.personType}
                          onChange={handleChange} required
                          className="w-full border border-gray-300 rounded-lg p-3" />
                      </div>

                      <div>
                        <label className="block font-semibold mb-2">
                          Title <span className="text-red-500">*</span>
                        </label>
                        <select name="title" value={formData.title}
                          onChange={handleChange} required
                          className="w-full border border-gray-300 rounded-lg p-3">
                          <option value="">Select title</option>
                          <option value="Mr">Mr</option>
                          <option value="Mrs">Mrs</option>
                          <option value="Ms">Ms</option>
                          <option value="Dr">Dr</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold mb-2">
                          Surname <span className="text-red-500">*</span>
                        </label>
                        <input type="text" name="surname"
                          value={formData.surname}
                          onChange={handleChange} required
                          className="w-full border border-gray-300 rounded-lg p-3" />
                      </div>

                      <div>
                        <label className="block font-semibold mb-2">
                          First Name <span className="text-red-500">*</span>
                        </label>
                        <input type="text" name="firstName"
                          value={formData.firstName}
                          onChange={handleChange} required
                          className="w-full border border-gray-300 rounded-lg p-3" />
                      </div>

                      <div>
                        <label className="block font-semibold mb-2">
                          Initials <span className="text-red-500">*</span>
                        </label>
                        <input type="text" name="initials"
                          value={formData.initials}
                          onChange={handleChange} required
                          className="w-full border border-gray-300 rounded-lg p-3" />
                      </div>

                      <div>
                        <label className="block font-semibold mb-2">Middle Names</label>
                        <input type="text" name="middleNames"
                          value={formData.middleNames}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-lg p-3" />
                      </div>

                      <div>
                        <label className="block font-semibold mb-2">Nick Name</label>
                        <input type="text" name="nickName"
                          value={formData.nickName}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-lg p-3" />
                      </div>

                      <div>
                        <label className="block font-semibold mb-2">
                          Gender <span className="text-red-500">*</span>
                        </label>
                        <select name="gender" value={formData.gender}
                          onChange={handleChange} required
                          className="w-full border border-gray-300 rounded-lg p-3">
                          <option value="">Select gender</option>
                          <option value="Female">Female</option>
                          <option value="Male">Male</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold mb-2">
                          Race <span className="text-red-500">*</span>
                        </label>
                        <select name="race" value={formData.race}
                          onChange={handleChange} required
                          className="w-full border border-gray-300 rounded-lg p-3">
                          <option value="">Select race</option>
                          <option value="African">African</option>
                          <option value="Colored">Colored</option>
                          <option value="Indian">Indian</option>
                          <option value="White">White</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold mb-2">
                          Marital Status <span className="text-red-500">*</span>
                        </label>
                        <select name="maritalStatus" value={formData.maritalStatus}
                          onChange={handleChange} required
                          className="w-full border border-gray-300 rounded-lg p-3">
                          <option value="">Select option</option>
                          <option value="Single">Single</option>
                          <option value="Married">Married</option>
                          <option value="Divorced">Divorced</option>
                          <option value="Widowed">Widowed</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold mb-2">Previous Surname</label>
                        <input type="text" name="previousSurname"
                          value={formData.previousSurname}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-lg p-3" />
                      </div>

                      <div>
                        <label className="block font-semibold mb-2">
                          Date of Birth <span className="text-red-500">*</span>
                        </label>
                        <input type="date" name="dateOfBirth"
                          value={formData.dateOfBirth}
                          onChange={handleChange} required
                          className="w-full border border-gray-300 rounded-lg p-3" />
                      </div>

                      <div>
                        <label className="block font-semibold mb-2">
                          Home Language <span className="text-red-500">*</span>
                        </label>
                        <select name="homeLanguage" value={formData.homeLanguage}
                          onChange={handleChange} required
                          className="w-full border border-gray-300 rounded-lg p-3">
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
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold mb-2">
                          Preference Language <span className="text-red-500">*</span>
                        </label>
                        <select name="preferenceLanguage" value={formData.preferenceLanguage}
                          onChange={handleChange} required
                          className="w-full border border-gray-300 rounded-lg p-3">
                          <option value="">Select language</option>
                          <option value="English">English</option>
                          <option value="Afrikaans">Afrikaans</option>
                          <option value="Setswana">Setswana</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold mb-2">
                          Disability <span className="text-red-500">*</span>
                        </label>
                        <select name="disability" value={formData.disability}
                          onChange={handleChange} required
                          className="w-full border border-gray-300 rounded-lg p-3">
                          <option value="">Select option</option>
                          <option value="No">No</option>
                          <option value="Yes">Yes</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold mb-2">
                          Currently employed by NWU? <span className="text-red-500">*</span>
                        </label>
                        <select name="currentlyEmployedByNwu"
                          value={formData.currentlyEmployedByNwu}
                          onChange={handleChange} required
                          className="w-full border border-gray-300 rounded-lg p-3">
                          <option value="">Select option</option>
                          <option value="No">No</option>
                          <option value="Yes">Yes</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold mb-2">
                          Primary Employment Outside? <span className="text-red-500">*</span>
                        </label>
                        <select name="primaryEmploymentOutside"
                          value={formData.primaryEmploymentOutside}
                          onChange={handleChange} required
                          className="w-full border border-gray-300 rounded-lg p-3">
                          <option value="">Select option</option>
                          <option value="No">No</option>
                          <option value="Yes">Yes</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold mb-2">
                          SA Citizen <span className="text-red-500">*</span>
                        </label>
                        <select name="saCitizen" value={formData.saCitizen}
                          onChange={handleChange} required
                          className="w-full border border-gray-300 rounded-lg p-3">
                          <option value="">Select option</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold mb-2">
                          Nationality <span className="text-red-500">*</span>
                        </label>
                        <input type="text" name="nationality"
                          value={formData.nationality}
                          onChange={handleChange} required
                          className="w-full border border-gray-300 rounded-lg p-3" />
                      </div>

                      <div>
                        <label className="block font-semibold mb-2">Country of Birth</label>
                        <input type="text" name="countryOfBirth"
                          value={formData.countryOfBirth}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-lg p-3" />
                      </div>

                      <div>
                        <label className="block font-semibold mb-2">Income Tax No.</label>
                        <input type="text" name="incomeTaxNo"
                          value={formData.incomeTaxNo}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-lg p-3" />
                      </div>

                      {formData.saCitizen === 'No' && (
                        <>
                          <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200 col-span-1 md:col-span-3">
                            <p className="text-xs text-yellow-800 font-semibold">
                              Non-SA Citizen Details Required
                            </p>
                          </div>

                          <div>
                            <label className="block font-semibold mb-2">
                              Passport Number <span className="text-red-500">*</span>
                            </label>
                            <input type="text" name="passportNumber"
                              value={formData.passportNumber}
                              onChange={handleChange} required
                              className="w-full border border-gray-300 rounded-lg p-3" />
                          </div>

                          <div>
                            <label className="block font-semibold mb-2">
                              Country of Passport Issue <span className="text-red-500">*</span>
                            </label>
                            <input type="text" name="countryOfPassportIssue"
                              value={formData.countryOfPassportIssue}
                              onChange={handleChange} required
                              className="w-full border border-gray-300 rounded-lg p-3" />
                          </div>

                          <div>
                            <label className="block font-semibold mb-2">
                              Study / Work Permit Number <span className="text-red-500">*</span>
                            </label>
                            <input type="text" name="permitNumber"
                              value={formData.permitNumber}
                              onChange={handleChange} required
                              className="w-full border border-gray-300 rounded-lg p-3" />
                          </div>
                        </>
                      )}

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
                              <input type="text" name="oeCodeAndName1"
                                value={formData.oeCodeAndName1}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg p-2.5" />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold mb-1">
                                Job Name (1)
                              </label>
                              <input type="text" name="jobName1"
                                value={formData.jobName1}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg p-2.5" />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold mb-1">
                                OE Code and Name (2)
                              </label>
                              <input type="text" name="oeCodeAndName2"
                                value={formData.oeCodeAndName2}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg p-2.5" />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold mb-1">
                                Job Name (2)
                              </label>
                              <input type="text" name="jobName2"
                                value={formData.jobName2}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg p-2.5" />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <SectionSaveButton sectionKey="A" />
                  </div>
                </Card>
              </form>

              {/* ============ SECTION B ============ */}
              <form onSubmit={handleSaveSection('B')}>
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
                        <select name="nextOfKinTitle" value={formData.nextOfKinTitle}
                          onChange={handleChange} required
                          className="w-full border border-gray-300 rounded-lg p-3">
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
                        <input type="text" name="nextOfKinInitials"
                          value={formData.nextOfKinInitials}
                          onChange={handleChange} required
                          className="w-full border border-gray-300 rounded-lg p-3" />
                      </div>

                      <div>
                        <label className="block font-semibold mb-2">
                          Surname <span className="text-red-500">*</span>
                        </label>
                        <input type="text" name="nextOfKinSurname"
                          value={formData.nextOfKinSurname}
                          onChange={handleChange} required
                          className="w-full border border-gray-300 rounded-lg p-3" />
                      </div>

                      <div>
                        <label className="block font-semibold mb-2">
                          Name <span className="text-red-500">*</span>
                        </label>
                        <input type="text" name="nextOfKinName"
                          value={formData.nextOfKinName}
                          onChange={handleChange} required
                          className="w-full border border-gray-300 rounded-lg p-3" />
                      </div>

                      <div>
                        <label className="block font-semibold mb-2">
                          Relationship <span className="text-red-500">*</span>
                        </label>
                        <input type="text" name="nextOfKinRelationship"
                          value={formData.nextOfKinRelationship}
                          onChange={handleChange} required
                          className="w-full border border-gray-300 rounded-lg p-3" />
                      </div>

                      <div>
                        <label className="block font-semibold mb-2">Daytime Phone No.</label>
                        <input type="tel" name="nextOfKinDaytimePhoneNo"
                          value={formData.nextOfKinDaytimePhoneNo}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-lg p-3" />
                      </div>

                      <div>
                        <label className="block font-semibold mb-2">
                          Mobile No. <span className="text-red-500">*</span>
                        </label>
                        <input type="tel" name="nextOfKinMobile"
                          value={formData.nextOfKinMobile}
                          onChange={handleChange} required
                          className="w-full border border-gray-300 rounded-lg p-3" />
                      </div>

                      <div>
                        <label className="block font-semibold mb-2">
                          Is Next of Kin an NWU Employee?
                        </label>
                        <select name="isNextOfKinNwuEmployee"
                          value={formData.isNextOfKinNwuEmployee}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-lg p-3">
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
                          <input type="text" name="nextOfKinNwuNumber"
                            value={formData.nextOfKinNwuNumber}
                            onChange={handleChange} required
                            className="w-full border border-gray-300 rounded-lg p-3" />
                        </div>
                      )}
                    </div>

                    <SectionSaveButton sectionKey="B" />
                  </div>
                </Card>
              </form>

              {/* ============ SECTION C ============ */}
              <form onSubmit={handleSaveSection('C')}>
                <Card>
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-primary-dark mb-6">
                      Section C: Contact Details
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <h3 className="font-bold text-lg text-gray-800 border-b pb-2">
                          Residential Address
                        </h3>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-semibold mb-1">Unit No.</label>
                            <input type="text" name="resUnitNo"
                              value={formData.resUnitNo}
                              onChange={handleChange}
                              className="w-full border border-gray-300 rounded-lg p-2.5" />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold mb-1">Complex</label>
                            <input type="text" name="resComplex"
                              value={formData.resComplex}
                              onChange={handleChange}
                              className="w-full border border-gray-300 rounded-lg p-2.5" />
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <label className="block text-sm font-semibold mb-1">
                              Street No. <span className="text-red-500">*</span>
                            </label>
                            <input type="text" name="resStreetNo"
                              value={formData.resStreetNo}
                              onChange={handleChange} required
                              className="w-full border border-gray-300 rounded-lg p-2.5" />
                          </div>
                          <div className="col-span-2">
                            <label className="block text-sm font-semibold mb-1">
                              Street Name / Farm Name <span className="text-red-500">*</span>
                            </label>
                            <input type="text" name="resStreetName"
                              value={formData.resStreetName}
                              onChange={handleChange} required
                              className="w-full border border-gray-300 rounded-lg p-2.5" />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold mb-1">
                            Suburb / District <span className="text-red-500">*</span>
                          </label>
                          <input type="text" name="resSuburb"
                            value={formData.resSuburb}
                            onChange={handleChange} required
                            className="w-full border border-gray-300 rounded-lg p-2.5" />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-semibold mb-1">
                              Town / City <span className="text-red-500">*</span>
                            </label>
                            <input type="text" name="resTownCity"
                              value={formData.resTownCity}
                              onChange={handleChange} required
                              className="w-full border border-gray-300 rounded-lg p-2.5" />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold mb-1">
                              Postal Code <span className="text-red-500">*</span>
                            </label>
                            <input type="text" name="resPostalCode"
                              value={formData.resPostalCode}
                              onChange={handleChange} required
                              className="w-full border border-gray-300 rounded-lg p-2.5" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b pb-2">
                          <h3 className="font-bold text-lg text-gray-800">Postal Address</h3>
                          <label className="flex items-center text-xs text-gray-600 gap-1.5 cursor-pointer">
                            <input type="checkbox" name="sameAsResidential"
                              checked={formData.sameAsResidential}
                              onChange={handleChange} className="rounded" />
                            Same as residential address
                          </label>
                        </div>

                        {!formData.sameAsResidential && (
                          <>
                            <div>
                              <label className="block text-sm font-semibold mb-1">PO Box No.</label>
                              <input type="text" name="poBoxNo"
                                value={formData.poBoxNo}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg p-2.5" />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold mb-1">Private Bag No.</label>
                              <input type="text" name="privateBagNo"
                                value={formData.privateBagNo}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg p-2.5" />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold mb-1">Post Office Branch Name</label>
                              <input type="text" name="postOfficeBranch"
                                value={formData.postOfficeBranch}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg p-2.5" />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold mb-1">Postal Code</label>
                              <input type="text" name="postalCode"
                                value={formData.postalCode}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg p-2.5" />
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
                        <input type="tel" name="mobileNo"
                          value={formData.mobileNo}
                          onChange={handleChange} required
                          className="w-full border border-gray-300 rounded-lg p-3" />
                      </div>
                      <div>
                        <label className="block font-semibold mb-2">Work Telephone No.</label>
                        <input type="tel" name="workPhoneNo"
                          value={formData.workPhoneNo}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-lg p-3" />
                      </div>
                      <div>
                        <label className="block font-semibold mb-2">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <input type="email" name="emailAddress"
                          value={formData.emailAddress}
                          onChange={handleChange} required
                          className="w-full border border-gray-300 rounded-lg p-3" />
                      </div>
                    </div>

                    <SectionSaveButton sectionKey="C" />
                  </div>
                </Card>
              </form>

              {/* ============ SECTION D ============ */}
              <form onSubmit={handleSaveSection('D')}>
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
                          Institution <span className="text-red-500">*</span>
                        </label>
                        <input type="text" name="institution"
                          value={formData.institution}
                          onChange={handleChange} required
                          className="w-full border border-gray-300 rounded-lg p-3" />
                      </div>
                      <div>
                        <label className="block font-semibold mb-2">
                          Qualification Type <span className="text-red-500">*</span>
                        </label>
                        <input type="text" name="qualificationType"
                          value={formData.qualificationType}
                          onChange={handleChange} required
                          className="w-full border border-gray-300 rounded-lg p-3" />
                      </div>
                      <div>
                        <label className="block font-semibold mb-2">
                          Qualification Status <span className="text-red-500">*</span>
                        </label>
                        <select name="qualificationStatus"
                          value={formData.qualificationStatus}
                          onChange={handleChange} required
                          className="w-full border border-gray-300 rounded-lg p-3">
                          <option value="">Select option</option>
                          <option value="Completed">Completed</option>
                          <option value="In Progress">In Progress</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-semibold mb-2">Awarded Date</label>
                        <input type="date" name="awardedDate"
                          value={formData.awardedDate}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-lg p-3" />
                      </div>
                    </div>

                    <SectionSaveButton sectionKey="D" />
                  </div>
                </Card>
              </form>

              {/* ============ SECTION E ============ */}
              <form onSubmit={handleSaveSection('E')}>
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
                        <input type="text" name="accountHolderSurnameInitials"
                          value={formData.accountHolderSurnameInitials}
                          onChange={handleChange} required
                          className="w-full border border-gray-300 rounded-lg p-3" />
                      </div>
                      <div>
                        <label className="block font-semibold mb-2">
                          Name of Bank <span className="text-red-500">*</span>
                        </label>
                        <input type="text" name="bankName"
                          value={formData.bankName}
                          onChange={handleChange} required
                          className="w-full border border-gray-300 rounded-lg p-3" />
                      </div>
                      <div>
                        <label className="block font-semibold mb-2">
                          Bank Branch Code <span className="text-red-500">*</span>
                        </label>
                        <input type="text" name="branchCode"
                          value={formData.branchCode}
                          onChange={handleChange} required
                          className="w-full border border-gray-300 rounded-lg p-3" />
                      </div>
                      <div>
                        <label className="block font-semibold mb-2">
                          Account Number <span className="text-red-500">*</span>
                        </label>
                        <input type="text" name="accountNumber"
                          value={formData.accountNumber}
                          onChange={handleChange} required
                          className="w-full border border-gray-300 rounded-lg p-3" />
                      </div>
                      <div>
                        <label className="block font-semibold mb-2">
                          Account Type <span className="text-red-500">*</span>
                        </label>
                        <select name="accountType" value={formData.accountType}
                          onChange={handleChange} required
                          className="w-full border border-gray-300 rounded-lg p-3">
                          <option value="">Select account type</option>
                          <option value="Cheque / Current">Cheque / Current</option>
                          <option value="Savings">Savings</option>
                          <option value="Transmission">Transmission</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-semibold mb-2">
                          Account Holder Relationship <span className="text-red-500">*</span>
                        </label>
                        <select name="accountHolderRelationship"
                          value={formData.accountHolderRelationship}
                          onChange={handleChange} required
                          className="w-full border border-gray-300 rounded-lg p-3">
                          <option value="">Select relationship</option>
                          <option value="Own">Own Account</option>
                          <option value="Parent/Guardian">Parent/Guardian Account</option>
                          <option value="Spouse">Spouse Account</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <SectionSaveButton sectionKey="E" />
                  </div>
                </Card>
              </form>

              {/* ============ SECTION F: DOCUMENTS + DECLARATION ============ */}
              <form onSubmit={handleSaveSection('F')}>
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
                      {requiredDocuments.map((doc) => {
                        const isUploading = uploadingFiles[doc.key];
                        const uploadError = uploadErrors[doc.key];
                        const entry = uploadedFiles[doc.key];

                        return (
                          <div
                            key={doc.key}
                            className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg bg-gray-50 gap-4"
                          >
                            <div className="flex-1">
                              <p className="font-semibold text-gray-800">
                                {doc.name} <span className="text-red-500">*</span>
                              </p>

                              {entry && !isUploading && !uploadError && (
                                <p className="text-xs text-green-600 mt-1">
                                  ✓ Uploaded: {entry.fileName || 'file'}
                                </p>
                              )}

                              {isUploading && (
                                <p className="text-xs text-blue-600 mt-1">
                                  Uploading…
                                </p>
                              )}

                              {uploadError && (
                                <p className="text-xs text-red-600 mt-1">
                                  Upload failed: {uploadError}
                                </p>
                              )}
                            </div>

                            <div className="flex items-center gap-3 w-full sm:w-auto">
                              <input
                                type="file"
                                id={`file-${doc.key}`}
                                onChange={(e) => handleFileUpload(doc.key, e)}
                                className="hidden"
                                disabled={isUploading}
                              />

                              <label
                                htmlFor={`file-${doc.key}`}
                                className={`cursor-pointer bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium shadow-sm ${
                                  isUploading
                                    ? 'opacity-50 cursor-not-allowed'
                                    : 'hover:bg-gray-50'
                                }`}
                              >
                                {isUploading
                                  ? 'Uploading…'
                                  : entry
                                  ? 'Replace File'
                                  : 'Choose File'}
                              </label>

                              {entry && !isUploading && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveFile(doc.key)}
                                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </Card>

                <Card>
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-primary-dark mb-4">
                      Declaration
                    </h2>

                    <div className="space-y-4">
                      <p className="text-sm text-gray-700 leading-relaxed font-medium">
                        I, the undersigned, hereby confirm that the information
                        I provided is true and correct.
                      </p>

                      <div className="flex items-start gap-3 mt-4">
                        <input type="checkbox" id="declarationAgreement"
                          checked={agreed}
                          onChange={(e) => setAgreed(e.target.checked)}
                          className="mt-1 h-4 w-4 text-primary rounded border-gray-300" />
                        <label htmlFor="declarationAgreement"
                          className="text-sm font-medium text-gray-800">
                          I agree to the declaration statement above
                        </label>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pt-4 border-t items-end">
                        <div>
                          <label className="block font-semibold mb-2">
                            Initials and Surname
                          </label>
                          <div className="w-full border border-gray-300 rounded-lg p-3 bg-gray-100 text-gray-700">
                            {formData.declarationInitialsSurname ||
                              `${formData.initials} ${formData.surname}`.trim() ||
                              'Automatically recorded'}
                          </div>
                        </div>

                        <div>
                          <label className="block font-semibold mb-2">
                            Student Signature
                          </label>
                          <div className="space-y-2">
                            <canvas ref={signatureCanvasRef}
                              width={300} height={100}
                              onMouseDown={startDrawing}
                              onMouseMove={draw}
                              onMouseUp={stopDrawing}
                              onMouseLeave={stopDrawing}
                              onTouchStart={startDrawing}
                              onTouchMove={draw}
                              onTouchEnd={stopDrawing}
                              className="border border-gray-300 rounded-lg bg-white w-full cursor-crosshair" />
                            <button type="button" onClick={clearSignature}
                              className="text-xs text-red-600 font-semibold hover:underline">
                              Clear Signature
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block font-semibold mb-2">Date</label>
                          <div className="w-full border border-gray-300 rounded-lg p-3 bg-gray-100 text-gray-700">
                            {formData.declarationDate || 'Automatically recorded when saved'}
                          </div>
                        </div>
                      </div>
                    </div>

                    <SectionSaveButton sectionKey="F" />
                  </div>
                </Card>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default StudentProfile;