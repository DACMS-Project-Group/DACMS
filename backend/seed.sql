-- ============================================================================
-- DACMS DEVELOPMENT SEED DATA
-- Target Platform: PostgreSQL 15+
--
-- This file is loaded automatically after init.sql by the dev Docker stack
-- (PostgreSQL runs /docker-entrypoint-initdb.d/*.sql in alphabetical order).
-- It is development/demo data only - never load it into production.
--
-- Test accounts (all share the password: password)
--   Students      -> <StudentNumber>@mynwu.ac.za          (e.g. 12345678@mynwu.ac.za)
--   Lecturers     -> <first>.<last>@nwu.ac.za             (e.g. alan.smith@nwu.ac.za)
--   Administrators-> <first>.<last>@nwu.ac.za             (e.g. eric.johnson@nwu.ac.za)
--
-- Seed rules this script follows:
--   1. Students may only assist with modules they completed in a PRIOR academic
--      year and passed (grade >= module minimum). A 2026 grade means the student
--      is currently enrolled in that module, so they never receive an
--      application/appointment for a module with a current-year grade.
--   2. Lecturer teaching load averages 1.2 modules (12 module presentations
--      across 10 lecturers, each presenting at least one module).
--   3. Student profiles are intentionally incomplete, except StudentIDs 1, 11
--      and 13, which carry a full P&C122F profile.
-- ============================================================================

BEGIN;

-- ----------------------------------------------------------------------------
-- 1. SYSTEM ROLES
-- ----------------------------------------------------------------------------
INSERT INTO "SYSTEM_ROLE" ("RoleName") VALUES
('Student'),
('Lecturer'),
('Administrator');

-- ----------------------------------------------------------------------------
-- 2. ORGANISATIONAL ENTITIES (NWU SCHOOLS / OE CODES)
-- ----------------------------------------------------------------------------
INSERT INTO "ORGANISATIONAL_ENTITY" ("OE_Code", "OEName", "FacultyName") VALUES
('8412', 'School of Computer Science and Information Systems', 'Faculty of Natural & Agricultural Sciences'),
('8413', 'School of Electrical, Electronic and Computer Engineering', 'Faculty of Engineering'),
('8414', 'School of Mechanical Engineering', 'Faculty of Engineering'),
('8415', 'School of Chemical Engineering', 'Faculty of Engineering');

-- ----------------------------------------------------------------------------
-- 3. PAYMENT SCALES (NWU 2026 HOURLY TARIFFS)
-- ----------------------------------------------------------------------------
INSERT INTO "PAYMENT_SCALE" ("RoleLevel", "StandardHourlyRate", "EffectiveYear") VALUES
('Undergraduate Demi', 86.75, 2026),
('Postgraduate Demi', 107.80, 2026);

-- ----------------------------------------------------------------------------
-- 4. ACADEMIC MODULES (12 MODULES ACROSS 10 LECTURERS)
-- ----------------------------------------------------------------------------
INSERT INTO "NWU_MODULE" ("ModuleCode", "ModuleName", "Description", "MinAcademicRequirement", "OE_ID") VALUES
('CMPG323', 'IT Developments', 'Practical software engineering and deployment.', 65.00, 1),
('CMPG311', 'Databases', 'Relational design and advanced SQL querying.', 65.00, 1),
('INGM311', 'Engineering Thermodynamics', 'Advanced thermal systems and cycle analyses.', 60.00, 3),
('EERI124', 'Introduction to Digital Systems', 'Fundamental logic design and gates.', 65.00, 2),
('REES211', 'Renewable Energy Systems', 'Clean energy grid systems and power.', 60.00, 4),
('CMPG221', 'Data Structures', 'Algorithms and memory organisation.', 65.00, 1),
('INGM121', 'Engineering Statics', 'Rigid body mechanics and forces.', 60.00, 3),
('INGM222', 'Engineering Dynamics', 'Motion, kinetic energy, and accelerations.', 60.00, 3),
('INGM412', 'Fluid Mechanics', 'Incompressible flow and piping design.', 60.00, 4),
('EERI223', 'Signal Processing', 'Analogue and digital waves analyses.', 65.00, 2),
('CMPG312', 'Operating Systems', 'Process scheduling, memory management and concurrency.', 65.00, 1),
('EERI212', 'Digital Electronics', 'Combinational logic, sequential circuits and HDL basics.', 65.00, 2);

-- ----------------------------------------------------------------------------
-- 5. APPLICATION USERS
--    Every account uses the password: password
--    Students 1-22: <StudentNumber>@mynwu.ac.za
--    Lecturers 23-32 / Administrators 33-34: <first>.<last>@nwu.ac.za
--    Explicit IDs keep the student/lecturer/admin numbering stable so the
--    presentation script can resolve rows by email instead of magic numbers.
-- ----------------------------------------------------------------------------
INSERT INTO "APP_USER" ("UserID", "Title", "FName", "LName", "Email", "PasswordHash", "RoleID") VALUES
-- Students
(1,  'Mr', 'Sipho',     'Ndlovu',        '12345678@mynwu.ac.za', '$2b$12$GeA.6JMMb4nABRGN5UMVYOkkIphGNy3FeL.p24tq9/NseTucBE99S', 1),
(2,  'Mr', 'Pieter',    'Botha',         '23456789@mynwu.ac.za', '$2b$12$GeA.6JMMb4nABRGN5UMVYOkkIphGNy3FeL.p24tq9/NseTucBE99S', 1),
(3,  'Ms', 'Lerato',    'Mokoena',       '34567890@mynwu.ac.za', '$2b$12$GeA.6JMMb4nABRGN5UMVYOkkIphGNy3FeL.p24tq9/NseTucBE99S', 1),
(4,  'Mr', 'Sanele',    'Khumalo',       '45678901@mynwu.ac.za', '$2b$12$GeA.6JMMb4nABRGN5UMVYOkkIphGNy3FeL.p24tq9/NseTucBE99S', 1),
(5,  'Ms', 'Fatima',    'Patel',         '56789012@mynwu.ac.za', '$2b$12$GeA.6JMMb4nABRGN5UMVYOkkIphGNy3FeL.p24tq9/NseTucBE99S', 1),
(6,  'Mr', 'Johan',     'Coetzee',       '67890123@mynwu.ac.za', '$2b$12$GeA.6JMMb4nABRGN5UMVYOkkIphGNy3FeL.p24tq9/NseTucBE99S', 1),
(7,  'Ms', 'Zola',      'Dlamini',       '78901234@mynwu.ac.za', '$2b$12$GeA.6JMMb4nABRGN5UMVYOkkIphGNy3FeL.p24tq9/NseTucBE99S', 1),
(8,  'Mr', 'Chen',      'Wei',           '89012345@mynwu.ac.za', '$2b$12$GeA.6JMMb4nABRGN5UMVYOkkIphGNy3FeL.p24tq9/NseTucBE99S', 1),
(9,  'Ms', 'Ananya',    'Naidoo',        '90123456@mynwu.ac.za', '$2b$12$GeA.6JMMb4nABRGN5UMVYOkkIphGNy3FeL.p24tq9/NseTucBE99S', 1),
(10, 'Mr', 'David',     'Miller',        '91234567@mynwu.ac.za', '$2b$12$GeA.6JMMb4nABRGN5UMVYOkkIphGNy3FeL.p24tq9/NseTucBE99S', 1),
(11, 'Ms', 'Naledi',    'Molefe',        '22345671@mynwu.ac.za', '$2b$12$GeA.6JMMb4nABRGN5UMVYOkkIphGNy3FeL.p24tq9/NseTucBE99S', 1),
(12, 'Mr', 'Thabo',     'Maseko',        '22345672@mynwu.ac.za', '$2b$12$GeA.6JMMb4nABRGN5UMVYOkkIphGNy3FeL.p24tq9/NseTucBE99S', 1),
(13, 'Ms', 'Amara',     'Pillay',        '22345673@mynwu.ac.za', '$2b$12$GeA.6JMMb4nABRGN5UMVYOkkIphGNy3FeL.p24tq9/NseTucBE99S', 1),
(14, 'Mr', 'Kagiso',    'Mokoena',       '22345674@mynwu.ac.za', '$2b$12$GeA.6JMMb4nABRGN5UMVYOkkIphGNy3FeL.p24tq9/NseTucBE99S', 1),
(15, 'Ms', 'Elize',     'van der Merwe', '22345675@mynwu.ac.za', '$2b$12$GeA.6JMMb4nABRGN5UMVYOkkIphGNy3FeL.p24tq9/NseTucBE99S', 1),
(16, 'Mr', 'Musa',      'Dube',          '22345676@mynwu.ac.za', '$2b$12$GeA.6JMMb4nABRGN5UMVYOkkIphGNy3FeL.p24tq9/NseTucBE99S', 1),
(17, 'Ms', 'Ayesha',    'Khan',          '22345677@mynwu.ac.za', '$2b$12$GeA.6JMMb4nABRGN5UMVYOkkIphGNy3FeL.p24tq9/NseTucBE99S', 1),
(18, 'Mr', 'Bokang',    'Seakamela',     '22345678@mynwu.ac.za', '$2b$12$GeA.6JMMb4nABRGN5UMVYOkkIphGNy3FeL.p24tq9/NseTucBE99S', 1),
(19, 'Mr', 'Liam',      'Jacobs',        '22345679@mynwu.ac.za', '$2b$12$GeA.6JMMb4nABRGN5UMVYOkkIphGNy3FeL.p24tq9/NseTucBE99S', 1),
(20, 'Ms', 'Rethabile', 'Mahlangu',      '22345680@mynwu.ac.za', '$2b$12$GeA.6JMMb4nABRGN5UMVYOkkIphGNy3FeL.p24tq9/NseTucBE99S', 1),
(21, 'Ms', 'Mia',       'Botha',         '22345681@mynwu.ac.za', '$2b$12$GeA.6JMMb4nABRGN5UMVYOkkIphGNy3FeL.p24tq9/NseTucBE99S', 1),
(22, 'Mr', 'Andile',    'Nkosi',         '22345682@mynwu.ac.za', '$2b$12$GeA.6JMMb4nABRGN5UMVYOkkIphGNy3FeL.p24tq9/NseTucBE99S', 1),
-- Lecturers
(23, 'Dr', 'Alan',      'Smith',      'alan.smith@nwu.ac.za',        '$2b$12$GeA.6JMMb4nABRGN5UMVYOkkIphGNy3FeL.p24tq9/NseTucBE99S', 2),
(24, 'Dr', 'Beatrice',  'Jones',      'beatrice.jones@nwu.ac.za',    '$2b$12$GeA.6JMMb4nABRGN5UMVYOkkIphGNy3FeL.p24tq9/NseTucBE99S', 2),
(25, 'Prof', 'Charles', 'Brown',      'charles.brown@nwu.ac.za',     '$2b$12$GeA.6JMMb4nABRGN5UMVYOkkIphGNy3FeL.p24tq9/NseTucBE99S', 2),
(26, 'Dr', 'Diane',     'Taylor',     'diane.taylor@nwu.ac.za',      '$2b$12$GeA.6JMMb4nABRGN5UMVYOkkIphGNy3FeL.p24tq9/NseTucBE99S', 2),
(27, 'Dr', 'Pieter',    'van Wyk',    'pieter.vanwyk@nwu.ac.za',     '$2b$12$GeA.6JMMb4nABRGN5UMVYOkkIphGNy3FeL.p24tq9/NseTucBE99S', 2),
(28, 'Dr', 'Nombeko',   'Sithole',    'nombeko.sithole@nwu.ac.za',   '$2b$12$GeA.6JMMb4nABRGN5UMVYOkkIphGNy3FeL.p24tq9/NseTucBE99S', 2),
(29, 'Dr', 'Johan',     'Pretorius',  'johan.pretorius@nwu.ac.za',   '$2b$12$GeA.6JMMb4nABRGN5UMVYOkkIphGNy3FeL.p24tq9/NseTucBE99S', 2),
(30, 'Dr', 'Fatima',    'Cassim',     'fatima.cassim@nwu.ac.za',     '$2b$12$GeA.6JMMb4nABRGN5UMVYOkkIphGNy3FeL.p24tq9/NseTucBE99S', 2),
(31, 'Dr', 'Michael',   'Chen',       'michael.chen@nwu.ac.za',      '$2b$12$GeA.6JMMb4nABRGN5UMVYOkkIphGNy3FeL.p24tq9/NseTucBE99S', 2),
(32, 'Dr', 'Lerato',    'Dlamini',    'lerato.dlamini@nwu.ac.za',    '$2b$12$GeA.6JMMb4nABRGN5UMVYOkkIphGNy3FeL.p24tq9/NseTucBE99S', 2),
-- Administrators
(33, 'Mr', 'Eric',      'Johnson',    'eric.johnson@nwu.ac.za',      '$2b$12$GeA.6JMMb4nABRGN5UMVYOkkIphGNy3FeL.p24tq9/NseTucBE99S', 3),
(34, 'Ms', 'Fiona',     'Carter',     'fiona.carter@nwu.ac.za',      '$2b$12$GeA.6JMMb4nABRGN5UMVYOkkIphGNy3FeL.p24tq9/NseTucBE99S', 3);

-- ----------------------------------------------------------------------------
-- 6. STUDENT PROFILES
--    StudentIDs 1 (Sipho), 11 (Naledi) and 13 (Amara) have a complete P&C122F
--    profile. The remaining students are deliberately sparse so incomplete
--    profile handling can be exercised.
-- ----------------------------------------------------------------------------
INSERT INTO "STUDENT" (
    "StudentID", "StudentNumber", "StudyLevel", "ID_PassportNumber", "Title", "Gender",
    "DateOfBirth", "IncomeTaxNumber", "SACitizen", "ResidentialAddress", "PostalAddress",
    "NextOfKinName", "NextOfKinMobile", "HighestQualification", "ContactDetails",
    "BankName", "AccountNumber", "AccountType", "BranchCode", "AccountHolderName",
    "Initials", "MiddleNames", "NickName", "Race", "MaritalStatus", "PreviousSurname",
    "HomeLanguage", "PreferenceLanguage", "Disability", "PrimaryEmploymentOutside",
    "StudentType", "Nationality", "CountryOfBirth", "CountryOfPassportIssue", "PermitNumber",
    "CurrentlyEmployedByNwu", "OeCodeAndName1", "JobName1", "OeCodeAndName2", "JobName2",
    "NextOfKinTitle", "NextOfKinInitials", "NextOfKinSurname", "NextOfKinRelationship",
    "NextOfKinDaytimePhoneNo", "IsNextOfKinNwuEmployee", "NextOfKinNwuNumber",
    "ResUnitNo", "ResComplex", "ResStreetNo", "ResStreetName", "ResSuburb", "ResTownCity",
    "ResPostalCode", "SameAsResidential", "PoBoxNo", "PrivateBagNo", "PostOfficeBranch",
    "MailingPostalCode", "WorkPhoneNo", "QualificationInstitution", "QualificationType",
    "QualificationStatus", "QualificationAwardedDate", "AccountHolderRelationship",
    "DeclarationInitialsSurname", "DeclarationDate", "DeclarationAgreed", "Signature"
) VALUES
(1, '12345678', 'Undergraduate', '0203155123081', 'Mr', 'Male', '2002-03-15', '9012345678', TRUE,
 '12 University Way, Potchefstroom', 'P.O. Box 100, Potchefstroom', 'Nomvula Ndlovu', '+27829990001',
 'BSc Computer Science', '+27820000001', 'FNB', '62111111111', 'Savings', '250655', 'Sipho Ndlovu',
 'S', 'Thabiso', 'Sipho', 'African', 'Single', NULL, 'isiZulu', 'English', 'No', 'No',
 'First-time entering', 'South African', 'South Africa', 'South Africa', NULL, 'No', NULL, NULL, NULL, NULL,
 'Mrs', 'N', 'Ndlovu', 'Mother', '+27829990001', 'No', NULL,
 '12', 'University Way', '12', 'University Way', 'Potchefstroom', 'Potchefstroom', '2531', TRUE,
 '100', NULL, 'Potchefstroom', '2531', NULL, 'North-West University', 'BSc Computer Science',
 'In progress', NULL, 'Self', 'S Ndlovu', '2026-01-15', TRUE, 'S Ndlovu'),
(11, '22345671', 'Undergraduate', '0207185123091', 'Ms', 'Female', '2002-07-18', '9012345691', TRUE,
 '23 Hoffman Street, Potchefstroom', 'P.O. Box 211, Potchefstroom', 'Thandi Molefe', '+27829990011',
 'BSc Information Technology', '+27820000011', 'FNB', '62111111171', 'Savings', '250655', 'Naledi Molefe',
 'N', 'Palesa', 'Naledi', 'African', 'Single', NULL, 'Setswana', 'English', 'No', 'No',
 'First-time entering', 'South African', 'South Africa', 'South Africa', NULL, 'No', NULL, NULL, NULL, NULL,
 'Mrs', 'T', 'Molefe', 'Mother', '+27829990011', 'No', NULL,
 '23', 'Hoffman Street', '23', 'Hoffman Street', 'Potchefstroom', 'Potchefstroom', '2531', TRUE,
 '211', NULL, 'Potchefstroom', '2531', NULL, 'North-West University', 'BSc Information Technology',
 'In progress', NULL, 'Self', 'N Molefe', '2026-01-20', TRUE, 'N Molefe'),
(13, '22345673', 'Postgraduate', '9912045123093', 'Ms', 'Female', '1999-12-04', '9012345693', TRUE,
 '45 Borcherd Street, Potchefstroom', 'P.O. Box 305, Potchefstroom', 'Ravi Pillay', '+27829990013',
 'BSc Honours Computer Science', '+27820000013', 'Nedbank', '19811111173', 'Savings', '198765', 'Amara Pillay',
 'A', 'Devi', 'Amara', 'Indian', 'Single', NULL, 'English', 'English', 'No', 'No',
 'Continuing', 'South African', 'South Africa', 'South Africa', NULL, 'No', NULL, NULL, NULL, NULL,
 'Mr', 'R', 'Pillay', 'Father', '+27829990013', 'No', NULL,
 '45', 'Borcherd Street', '45', 'Borcherd Street', 'Potchefstroom', 'Potchefstroom', '2531', TRUE,
 '305', NULL, 'Potchefstroom', '2531', NULL, 'North-West University', 'BSc Honours Computer Science',
 'In progress', NULL, 'Self', 'A Pillay', '2026-02-02', TRUE, 'A Pillay');

-- Incomplete profiles: contact and bank details only (no address, next of kin,
-- qualification or declaration).
INSERT INTO "STUDENT" (
    "StudentID", "StudentNumber", "StudyLevel", "Title", "Gender", "DateOfBirth",
    "ContactDetails", "BankName", "AccountNumber", "AccountType", "BranchCode", "AccountHolderName"
) VALUES
(2,  '23456789', 'Undergraduate', 'Mr', 'Male',   '2001-11-20', '+27820000002', 'Standard Bank', '10111111112', 'Cheque',  '051001', 'Pieter Botha'),
(3,  '34567890', 'Postgraduate',  'Ms', 'Female', '1999-05-12', '+27820000003', 'Nedbank',       '19811111113', 'Savings', '198765', 'Lerato Mokoena'),
(4,  '45678901', 'Undergraduate', 'Mr', 'Male',   '2003-08-22', '+27820000004', 'Capitec',       '15211111114', 'Savings', '470010', 'Sanele Khumalo'),
(5,  '56789012', 'Postgraduate',  'Ms', 'Female', '1998-01-01', '+27820000005', 'ABSA',          '40511111115', 'Cheque',  '632005', 'Fatima Patel'),
(6,  '67890123', 'Undergraduate', 'Mr', 'Male',   '2002-09-10', '+27820000006', 'FNB',           '62111111116', 'Savings', '250655', 'Johan Coetzee'),
(7,  '78901234', 'Postgraduate',  'Ms', 'Female', '1999-12-04', '+27820000007', 'Standard Bank', '10111111117', 'Cheque',  '051001', 'Zola Dlamini'),
(8,  '89012345', 'Undergraduate', 'Mr', 'Male',   '2003-04-05', '+27820000008', 'Nedbank',       '19811111118', 'Savings', '198765', 'Chen Wei'),
(9,  '90123456', 'Postgraduate',  'Ms', 'Female', '1998-07-18', '+27820000009', 'Capitec',       '15211111119', 'Savings', '470010', 'Ananya Naidoo'),
(10, '91234567', 'Undergraduate', 'Mr', 'Male',   '2002-02-02', '+27820000010', 'ABSA',          '40511111120', 'Savings', '632005', 'David Miller'),
(12, '22345672', 'Undergraduate', 'Mr', 'Male',   '2003-01-14', '+27820000012', 'Capitec',       '00000000012', 'Savings', '470010', 'Thabo Maseko');

-- Incomplete profiles: registration essentials only.
INSERT INTO "STUDENT" ("StudentID", "StudentNumber", "StudyLevel", "ContactDetails") VALUES
(14, '22345674', 'Undergraduate', '+27820000014'),
(15, '22345675', 'Undergraduate', '+27820000015'),
(16, '22345676', 'Postgraduate',  '+27820000016'),
(17, '22345677', 'Undergraduate', '+27820000017'),
(18, '22345678', 'Undergraduate', '+27820000018'),
(19, '22345679', 'Undergraduate', '+27820000019'),
(20, '22345680', 'Postgraduate',  '+27820000020'),
(21, '22345681', 'Undergraduate', '+27820000021'),
(22, '22345682', 'Postgraduate',  '+27820000022');

-- ----------------------------------------------------------------------------
-- 7. LECTURERS
-- ----------------------------------------------------------------------------
INSERT INTO "LECTURER" ("LecturerID", "Department", "OE_ID") VALUES
(23, 'School of Computer Science and Information Systems', 1),
(24, 'School of Electrical, Electronic and Computer Engineering', 2),
(25, 'School of Mechanical Engineering', 3),
(26, 'School of Chemical Engineering', 4),
(27, 'School of Computer Science and Information Systems', 1),
(28, 'School of Electrical, Electronic and Computer Engineering', 2),
(29, 'School of Mechanical Engineering', 3),
(30, 'School of Chemical Engineering', 4),
(31, 'School of Computer Science and Information Systems', 1),
(32, 'School of Electrical, Electronic and Computer Engineering', 2);

-- ----------------------------------------------------------------------------
-- 8. LECTURER MODULE PRESENTATIONS
--    12 presentations / 10 lecturers = 1.2 average, every lecturer has >= 1.
-- ----------------------------------------------------------------------------
INSERT INTO "LECTURER_MODULE" ("LecturerID", "ModuleID") VALUES
(23, 1),  -- Alan Smith:     CMPG323, CMPG311
(23, 2),
(24, 4),  -- Beatrice Jones: EERI124
(25, 3),  -- Charles Brown:  INGM311, INGM222
(25, 8),
(26, 5),  -- Diane Taylor:   REES211
(27, 6),  -- Pieter van Wyk: CMPG221
(28, 10), -- Nombeko Sithole:EERI223
(29, 7),  -- Johan Pretorius:INGM121
(30, 9),  -- Fatima Cassim:  INGM412
(31, 11), -- Michael Chen:   CMPG312
(32, 12); -- Lerato Dlamini: EERI212

-- ----------------------------------------------------------------------------
-- 9. ADMINISTRATORS
-- ----------------------------------------------------------------------------
INSERT INTO "ADMINISTRATOR" ("AdminID", "TFASecret", "TFABackupCodes", "TFALastStep", "TFAConfirmedAt", "BudgetAllocationRights") VALUES
(33, NULL, '{}', NULL, NULL, TRUE),
(34, NULL, '{}', NULL, NULL, TRUE);

-- ----------------------------------------------------------------------------
-- 10. SUPPORTING DOCUMENTS
-- ----------------------------------------------------------------------------
INSERT INTO "SUPPORTING_DOCUMENT" ("StudentID", "DocumentType", "FilePath", "UploadTimestamp") VALUES
(1,  'Academic Transcript', '/app/documents/exampleDoc.jpg', '2026-09-20 09:00:00+02'),
(1,  'Bank Confirmation',   '/app/documents/exampleDoc.jpg', '2026-09-20 09:15:00+02'),
(2,  'Academic Transcript', '/app/documents/exampleDoc.jpg', '2026-09-21 10:00:00+02'),
(2,  'Certified ID',        '/app/documents/exampleDoc.jpg', '2026-09-21 10:10:00+02'),
(3,  'Academic Transcript', '/app/documents/testPDF.pdf',    '2026-09-22 11:00:00+02'),
(4,  'Academic Transcript', '/app/documents/exampleDoc.jpg', '2026-09-23 12:00:00+02'),
(5,  'Academic Transcript', '/app/documents/exampleDoc.jpg', '2026-09-24 13:00:00+02'),
(6,  'Academic Transcript', '/app/documents/exampleDoc.jpg', '2026-09-25 14:00:00+02'),
(7,  'Academic Transcript', '/app/documents/exampleDoc.jpg', '2026-09-26 15:00:00+02'),
(8,  'Academic Transcript', '/app/documents/exampleDoc.jpg', '2026-09-27 16:00:00+02'),
(9,  'Academic Transcript', '/app/documents/exampleDoc.jpg', '2026-09-28 17:00:00+02'),
(10, 'Academic Transcript', '/app/documents/exampleDoc.jpg', '2026-09-29 18:00:00+02'),
(11, 'Academic Transcript', '/app/documents/testPDF.pdf',    '2026-09-28 09:10:00+02'),
(11, 'Bank Confirmation',   '/app/documents/testPDF.pdf',    '2026-09-28 09:18:00+02'),
(12, 'Academic Transcript', '/app/documents/testPDF.pdf',    '2026-09-29 11:20:00+02'),
(13, 'Academic Transcript', '/app/documents/testPDF.pdf',    '2026-09-30 08:45:00+02'),
(13, 'Certified ID',        '/app/documents/exampleDoc.jpg', '2026-09-30 08:52:00+02'),
(14, 'Academic Transcript', '/app/documents/testPDF.pdf',    '2026-10-01 13:05:00+02'),
(19, 'Academic Transcript', '/app/documents/exampleDoc.jpg', '2026-10-04 12:14:00+02'),
(21, 'Academic Transcript', '/app/documents/exampleDoc.jpg', '2026-10-05 16:22:00+02');

-- ----------------------------------------------------------------------------
-- 11. MODULE BUDGETS (ONE PER MODULE, 2026)
--     CurrentBudgetUsage matches the approved work sessions seeded below.
-- ----------------------------------------------------------------------------
INSERT INTO "MODULE_BUDGET" ("ModuleID", "LecturerID", "AllocatedBudget", "CurrentBudgetUsage", "MaxAllowableWorkHours", "AcademicYear") VALUES
(1,  23, 17292.96, 2205.76, 160, 2026),
(2,  23, 13880.00, 1038.45, 160, 2026),
(3,  25, 17592.96,  646.80, 160, 2026),
(4,  24, 13880.00,    0.00, 160, 2026),
(5,  26, 10780.00,  862.40, 100, 2026),
(6,  27, 13880.00,    0.00, 160, 2026),
(7,  29, 13272.75,    0.00, 150, 2026),
(8,  25,  7078.80,  260.25,  80, 2026),
(9,  30,  4398.24,  646.80,  40, 2026),
(10, 28, 10995.60,  260.25, 100, 2026),
(11, 31, 10995.60,    0.00, 100, 2026),
(12, 32, 10995.60,    0.00, 100, 2026);

-- ----------------------------------------------------------------------------
-- 12. STUDENT MODULE GRADES - COMPLETED (PRIOR YEAR) RESULTS
--     Every module a student applies to assist in 2026 was completed in 2024 or
--     2025 (never 2026) and the mark meets the module minimum.
-- ----------------------------------------------------------------------------
INSERT INTO "STUDENT_MODULE_GRADE" ("StudentID", "ModuleID", "GradeAchieved", "AcademicYear") VALUES
(1,  1, 74.50, 2025),  -- Sipho: CMPG323
(2,  2, 81.00, 2025),  -- Pieter: CMPG311
(3,  1, 85.00, 2024),  -- Lerato: CMPG323
(4,  4, 70.00, 2025),  -- Sanele: EERI124
(5,  5, 88.50, 2024),  -- Fatima: REES211
(6,  6, 68.00, 2025),  -- Johan: CMPG221
(7,  3, 77.00, 2024),  -- Zola: INGM311
(8,  7, 72.00, 2025),  -- Chen: INGM121
(9,  9, 83.00, 2024),  -- Ananya: INGM412
(10, 8, 79.50, 2025),  -- David: INGM222
(11, 1, 83.00, 2025),  -- Naledi: CMPG323
(11, 2, 74.00, 2025),  -- Naledi: CMPG311 (eligible to apply live in the demo)
(12, 1, 78.00, 2025),  -- Thabo: CMPG323
(12, 6, 71.00, 2025),  -- Thabo: CMPG221
(13, 2, 89.00, 2024),  -- Amara: CMPG311
(13, 1, 81.00, 2024),  -- Amara: CMPG323
(14, 3, 72.00, 2025),  -- Kagiso: INGM311
(14, 7, 66.00, 2025),  -- Kagiso: INGM121
(15, 4, 69.00, 2025),  -- Elize: EERI124
(16, 5, 86.00, 2024),  -- Musa: REES211
(16, 1, 80.00, 2024),  -- Musa: CMPG323
(17, 6, 58.00, 2025),  -- Ayesha: CMPG221 (below the 65% minimum -> rejected)
(18, 7, 73.00, 2025),  -- Bokang: INGM121
(19, 8, 68.00, 2025),  -- Liam: INGM222
(19, 11, 75.00, 2025), -- Liam: CMPG312
(20, 9, 83.00, 2024),  -- Rethabile: INGM412
(20, 12, 78.00, 2024), -- Rethabile: EERI212
(21, 10, 76.00, 2025), -- Mia: EERI223
(22, 11, 82.00, 2025), -- Andile: CMPG312
(22, 3, 79.00, 2025);  -- Andile: INGM311

-- ----------------------------------------------------------------------------
-- 13. STUDENT MODULE GRADES - CURRENT YEAR (2026)
--     These modules are being taken now, so none of these students may assist
--     with them and no application/appointment exists for them.
-- ----------------------------------------------------------------------------
INSERT INTO "STUDENT_MODULE_GRADE" ("StudentID", "ModuleID", "GradeAchieved", "AcademicYear") VALUES
(11, 11, 74.00, 2026),  -- Naledi currently taking CMPG312
(12, 12, 68.00, 2026),  -- Thabo currently taking EERI212
(14, 8,  71.00, 2026),  -- Kagiso currently taking INGM222
(17, 2,  62.00, 2026),  -- Ayesha currently taking CMPG311
(20, 6,  77.00, 2026),  -- Rethabile currently taking CMPG221
(22, 7,  74.00, 2026);  -- Andile currently taking INGM121

-- ----------------------------------------------------------------------------
-- 14. DEMI LISTINGS (ONE OPEN LISTING PER MODULE)
--     Deadlines are relative to load time so the dev seed does not go stale.
-- ----------------------------------------------------------------------------
INSERT INTO "DEMI_LISTING" ("ModuleID", "LecturerID", "Deadline", "MinimumGrade") VALUES
(1,  23, CURRENT_DATE + INTERVAL '14 days 23:59:59', 65.00),
(2,  23, CURRENT_DATE + INTERVAL '21 days 23:59:59', 65.00),
(3,  25, CURRENT_DATE + INTERVAL '28 days 23:59:59', 60.00),
(4,  24, CURRENT_DATE + INTERVAL '35 days 23:59:59', 65.00),
(5,  26, CURRENT_DATE + INTERVAL '42 days 23:59:59', 60.00),
(6,  27, CURRENT_DATE + INTERVAL '49 days 23:59:59', 65.00),
(7,  29, CURRENT_DATE + INTERVAL '56 days 23:59:59', 60.00),
(8,  25, CURRENT_DATE + INTERVAL '63 days 23:59:59', 60.00),
(9,  30, CURRENT_DATE + INTERVAL '70 days 23:59:59', 60.00),
(10, 28, CURRENT_DATE + INTERVAL '77 days 23:59:59', 65.00),
(11, 31, CURRENT_DATE + INTERVAL '84 days 23:59:59', 65.00),
(12, 32, CURRENT_DATE + INTERVAL '91 days 23:59:59', 65.00);

-- ----------------------------------------------------------------------------
-- 15. DEMI APPLICATIONS
--     "Reference" is left NULL so the generate_demi_application_reference
--     trigger builds it from the submission date, student number and module.
-- ----------------------------------------------------------------------------
INSERT INTO "DEMI_APPLICATION" ("StudentID", "ListingID", "ApplicationStatus", "VerificationEligibilityStatus", "DateSubmitted", "AppReason", "ReviewComment") VALUES
(1,  1,  'Approved',  'Eligible',   '2026-08-01 10:00:00+02', 'Meets eligibility requirements', NULL),
(2,  2,  'Approved',  'Eligible',   '2026-08-02 11:30:00+02', 'Meets eligibility requirements', NULL),
(3,  1,  'Approved',  'Eligible',   '2026-08-03 09:15:00+02', 'Meets eligibility requirements', NULL),
(4,  4,  'In Review', 'Eligible',   '2026-08-04 14:00:00+02', 'Application is under review', NULL),
(5,  5,  'Approved',  'Eligible',   '2026-08-05 15:45:00+02', 'Meets eligibility requirements', NULL),
(6,  6,  'Pending',   'Eligible',   '2026-08-06 08:30:00+02', 'Awaiting application review', NULL),
(7,  3,  'Approved',  'Eligible',   '2026-08-07 12:10:00+02', 'Meets eligibility requirements', NULL),
(8,  7,  'Pending',   'Eligible',   '2026-08-08 16:20:00+02', 'Awaiting application review', NULL),
(9,  9,  'Approved',  'Eligible',   '2026-08-09 11:00:00+02', 'Meets eligibility requirements', NULL),
(10, 8,  'Approved',  'Eligible',   '2026-08-10 13:25:00+02', 'Meets eligibility requirements', NULL),
(11, 1,  'Approved',  'Eligible',   '2026-10-01 08:42:00+02', 'Interested in supporting first-year programming practicals.', 'Strong CMPG323 result; appointment paperwork received.'),
(12, 1,  'In Review', 'Eligible',   '2026-10-01 10:15:00+02', 'Enjoy helping peers debug Java assignments.', 'Lecturer review in progress.'),
(13, 2,  'Approved',  'Eligible',   '2026-10-01 14:25:00+02', 'Interested in database design and SQL tutoring.', 'Available for weekly lab sessions.'),
(14, 3,  'Approved',  'Eligible',   '2026-10-02 09:05:00+02', 'Would like to assist with thermodynamics tutorials.', 'Timetable confirmed with the lecturer.'),
(15, 4,  'Pending',   'Eligible',   '2026-10-02 11:48:00+02', 'Previous experience assembling digital logic circuits.', NULL),
(16, 5,  'Approved',  'Eligible',   '2026-10-02 16:12:00+02', 'Honours research aligns with renewable energy projects.', 'Appointment awaiting administrator review.'),
(17, 6,  'Rejected',  'Ineligible', '2026-10-03 08:55:00+02', 'Interested in helping with data structures labs.', 'Minimum academic requirement not met.'),
(18, 7,  'Returned',  'Eligible',   '2026-10-03 12:20:00+02', 'Can support first-year statics tutorials and marking.', 'Please upload the missing bank confirmation.'),
(19, 8,  'Pending',   'Eligible',   '2026-10-04 09:32:00+02', 'Enjoy explaining motion and engineering problem-solving.', NULL),
(20, 9,  'Approved',  'Eligible',   '2026-10-05 08:17:00+02', 'Interested in laboratory demonstrations and report feedback.', 'Appointment approved for the remainder of the semester.'),
(21, 10, 'Approved',  'Eligible',   '2026-10-05 13:40:00+02', 'Signal processing practicals complement current studies.', 'Appointment paperwork received.'),
(22, 11, 'Approved',  'Eligible',   '2026-10-06 09:10:00+02', 'Can assist with tutorial preparation and problem sessions.', 'Available on Tuesday and Thursday afternoons.');

-- ----------------------------------------------------------------------------
-- 16. DEMI POSITIONS (ADMIN-APPROVED APPOINTMENTS)
--     Scale 1 = Undergraduate (86.75/h), Scale 2 = Postgraduate (107.80/h).
-- ----------------------------------------------------------------------------
INSERT INTO "DEMI_POSITION" ("ApplicationID", "PaymentScaleID", "TempBudgetPositionNo", "AccountingCombination", "TotalAllocatedHours", "PositionStatus", "StartDate", "TerminationDate", "AdminComment") VALUES
(1,  1, 'TBF-2026-001', '8412-4101-2104', 160, 'Approved', '2026-07-01 00:00:00+02', '2026-11-30 23:59:59+02', NULL),
(2,  1, 'TBF-2026-002', '8412-4101-2104', 160, 'Approved', '2026-07-01 00:00:00+02', '2026-11-30 23:59:59+02', NULL),
(3,  2, 'TBF-2026-003', '8412-4101-2104', 160, 'Approved', '2026-07-01 00:00:00+02', '2026-11-30 23:59:59+02', NULL),
(5,  2, 'TBF-2026-004', '8415-4101-2104', 100, 'Approved', '2026-07-01 00:00:00+02', '2026-11-30 23:59:59+02', NULL),
(7,  2, 'TBF-2026-005', '8414-4101-2104', 160, 'Approved', '2026-07-01 00:00:00+02', '2026-11-30 23:59:59+02', NULL),
(9,  2, 'TBF-2026-006', '8415-4101-2104', 40,  'Approved', '2026-07-01 00:00:00+02', '2026-11-30 23:59:59+02', NULL),
(10, 1, 'TBF-2026-007', '8414-4101-2104', 80,  'Approved', '2026-07-01 00:00:00+02', '2026-11-30 23:59:59+02', NULL),
(11, 1, 'TBF-2026-008', '8412-4101-2104', 120, 'Approved', '2026-10-01 00:00:00+02', '2026-11-30 23:59:59+02', 'Appointment confirmed for CMPG323 labs.'),
(13, 2, 'TBF-2026-009', '8412-4101-2104', 100, 'Approved', '2026-10-01 00:00:00+02', '2026-11-30 23:59:59+02', 'Database lab and consultation support.'),
(14, 1, NULL, NULL, 0, 'Pending Admin Review', NULL, NULL, NULL),
(16, 2, 'TBF-2026-011', '8415-4101-2104', 100, 'Approved', '2026-10-02 00:00:00+02', '2026-11-30 23:59:59+02', 'Renewable energy project support approved.'),
(20, 2, 'TBF-2026-012', '8415-4101-2104', 100, 'Approved', '2026-10-05 00:00:00+02', '2026-11-30 23:59:59+02', 'Laboratory support appointment.'),
(21, 1, 'TBF-2026-013', '8413-4101-2104', 80,  'Approved', '2026-10-05 00:00:00+02', '2026-11-30 23:59:59+02', 'Signal processing practical assistance.'),
(22, 2, 'TBF-2026-014', '8412-4101-2104', 100, 'Approved', '2026-10-06 00:00:00+02', '2026-11-30 23:59:59+02', 'Tutorial preparation and student consultations.');

-- ----------------------------------------------------------------------------
-- 17. POSITION RESPONSIBILITIES
-- ----------------------------------------------------------------------------
INSERT INTO "RESPONSIBILITY" ("PositionID", "Description") VALUES
(1,  'Assist with practical session demonstrations and lab setup.'),
(1,  'Grade weekly assignment submissions and provide feedback.'),
(1,  'Hold two office hours per week for student consultations.'),
(8,  'Help students debug Java exercises during CMPG323 practicals.'),
(8,  'Mark weekly programming exercises and provide constructive feedback.'),
(9,  'Support SQL laboratory sessions and review database assignments.'),
(9,  'Run a weekly consultation hour for database design questions.'),
(10, 'Prepare worked examples and facilitate INGM311 tutorial groups.'),
(11, 'Assist with renewable energy project consultations and lab preparation.'),
(12, 'Demonstrate fluid mechanics laboratory procedures and safety.'),
(13, 'Help students interpret signal processing practical results.'),
(14, 'Prepare tutorial questions and support CMPG312 student consultations.');

-- ----------------------------------------------------------------------------
-- 18. WORK SESSIONS (TIMESHEETS)
-- ----------------------------------------------------------------------------
INSERT INTO "WORK_SESSION" ("PositionID", "ActivityDescription", "StartTime", "EndTime", "TotalHoursWorked", "EstimatedRemuneration", "LecturerApproval") VALUES
(1, 'Practical Lab Assistance - CMPG323', '2026-08-10 08:00:00+02', '2026-08-10 12:00:00+02', 4.00, 347.00, TRUE),
(1, 'Assignment 1 Marking - CMPG323', '2026-08-12 09:00:00+02', '2026-08-12 11:30:00+02', 2.50, 216.88, TRUE),
(2, 'Lab Setup - CMPG311', '2026-08-10 14:00:00+02', '2026-08-10 18:00:00+02', 4.00, 347.00, TRUE),
(2, 'Tutoring Session 1 - CMPG311', '2026-08-11 14:00:00+02', '2026-08-11 17:00:00+02', 3.00, 260.25, TRUE),
(3, 'Guest Lecture Support & Marking - CMPG323', '2026-08-10 08:00:00+02', '2026-08-10 13:00:00+02', 5.00, 539.00, TRUE),
(3, 'Project Consultation - CMPG323', '2026-08-11 08:00:00+02', '2026-08-11 13:00:00+02', 5.00, 539.00, TRUE),
(4, 'Lab Assistance - REES211', '2026-08-15 09:00:00+02', '2026-08-15 13:00:00+02', 4.00, 431.20, TRUE),
(5, 'Thermodynamics Lab Invigilation - INGM311', '2026-08-18 09:00:00+02', '2026-08-18 15:00:00+02', 6.00, 646.80, TRUE),
(6, 'Fluid Mechanics Lab Assistance - INGM412', '2026-08-20 10:00:00+02', '2026-08-20 12:00:00+02', 2.00, 215.60, TRUE),
(7, 'Dynamics Tutorial Session - INGM222', '2026-08-22 13:00:00+02', '2026-08-22 16:00:00+02', 3.00, 260.25, TRUE);

INSERT INTO "WORK_SESSION" ("PositionID", "ActivityDescription", "StartTime", "EndTime", "TotalHoursWorked", "EstimatedRemuneration", "LecturerApproval") VALUES
(8,  'CMPG323 Java practical assistance and debugging clinic', '2026-10-01 09:00:00+02', '2026-10-01 12:00:00+02', 3.00, 260.25, TRUE),
(8,  'CMPG323 assignment marking and feedback', '2026-10-02 13:00:00+02', '2026-10-02 16:30:00+02', 3.50, 303.63, TRUE),
(8,  'Prepare examples for next programming practical', '2026-10-06 10:00:00+02', '2026-10-06 12:00:00+02', 2.00, 173.50, FALSE),
(9,  'CMPG311 SQL lab support and query troubleshooting', '2026-10-01 14:00:00+02', '2026-10-01 18:00:00+02', 4.00, 431.20, TRUE),
(9,  'Database design consultation hour', '2026-10-03 10:00:00+02', '2026-10-03 13:00:00+02', 3.00, 323.40, FALSE),
(11, 'REES211 project consultation and literature review guidance', '2026-10-03 09:00:00+02', '2026-10-03 13:00:00+02', 4.00, 431.20, TRUE),
(11, 'Renewable energy lab equipment preparation', '2026-10-06 08:30:00+02', '2026-10-06 11:00:00+02', 2.50, 269.50, FALSE),
(12, 'INGM412 fluid flow laboratory demonstrations', '2026-10-05 09:00:00+02', '2026-10-05 13:00:00+02', 4.00, 431.20, TRUE),
(12, 'Lab report feedback and marking', '2026-10-07 09:00:00+02', '2026-10-07 12:00:00+02', 3.00, 323.40, FALSE),
(13, 'EERI223 signal processing practical setup', '2026-10-05 13:00:00+02', '2026-10-05 16:00:00+02', 3.00, 260.25, TRUE),
(13, 'Fourier transform problem session', '2026-10-07 13:00:00+02', '2026-10-07 16:00:00+02', 3.00, 260.25, FALSE),
(14, 'CMPG312 operating systems lab support', '2026-10-07 10:00:00+02', '2026-10-07 13:00:00+02', 3.00, 323.40, FALSE);

-- ----------------------------------------------------------------------------
-- 19. REMUNERATION CLAIMS
-- ----------------------------------------------------------------------------
INSERT INTO "REMUNERATION_CLAIM" ("ClaimReferenceNumber", "ApplicationID", "ModuleID", "PeriodStartDate", "PeriodEndDate", "TotalHoursClaimed", "TotalClaimAmount", "HourlyRateApplied", "ClaimStatus", "LecturerComment", "SubmissionDate") VALUES
('CLAIM-2026-08-001', 1,  1,  '2026-08-01', '2026-08-24', 6.50,  563.88,  86.75, 'Verified', NULL, '2026-08-25 09:00:00+02'),
('CLAIM-2026-08-002', 2,  2,  '2026-08-01', '2026-08-24', 7.00,  607.25,  86.75, 'Verified', NULL, '2026-08-25 10:30:00+02'),
('CLAIM-2026-08-003', 3,  1,  '2026-08-01', '2026-08-25', 10.00, 1078.00, 107.80,'Verified', NULL, '2026-08-26 08:15:00+02'),
('CLAIM-2026-08-004', 5,  5,  '2026-08-01', '2026-08-26', 4.00,  431.20,  107.80,'Pending',  NULL, '2026-08-27 14:00:00+02'),
('CLAIM-2026-08-005', 7,  3,  '2026-08-01', '2026-08-27', 6.00,  646.80,  107.80,'Under Review', NULL, '2026-08-28 11:45:00+02');

INSERT INTO "REMUNERATION_CLAIM" ("ClaimReferenceNumber", "ApplicationID", "ModuleID", "PeriodStartDate", "PeriodEndDate", "TotalHoursClaimed", "TotalClaimAmount", "HourlyRateApplied", "ClaimStatus", "LecturerComment", "SubmissionDate") VALUES
('CLAIM-2026-10-011', 11, 1,  '2026-10-01', '2026-10-02', 6.50,  563.88,  86.75, 'Approved by Lecturer', 'Hours confirmed against the practical roster.', '2026-10-03 09:15:00+02'),
('CLAIM-2026-10-013', 13, 2,  '2026-10-01', '2026-10-03', 4.00,  431.20,  107.80,'Under Review', 'Please attach the consultation attendance sheet.', '2026-10-04 11:35:00+02'),
('CLAIM-2026-10-016', 16, 5,  '2026-10-03', '2026-10-06', 4.00,  431.20,  107.80,'Verified', 'Project support approved.', '2026-10-07 10:10:00+02'),
('CLAIM-2026-10-020', 20, 9,  '2026-10-05', '2026-10-07', 4.00,  431.20,  107.80,'Under Review', 'Lab hours checked; marking still to be reviewed.', '2026-10-07 15:05:00+02'),
('CLAIM-2026-10-021', 21, 10, '2026-10-05', '2026-10-07', 3.00,  260.25,  86.75, 'Pending', NULL, '2026-10-07 16:30:00+02');

-- ----------------------------------------------------------------------------
-- 20. NOTIFICATIONS
-- ----------------------------------------------------------------------------
INSERT INTO "NOTIFICATION" ("RecipientUserID", "NotificationType", "Subject", "Message", "IsRead", "CreatedTimestamp") VALUES
(1,  'Application Update', 'Application Approved: CMPG323', 'Your application for CMPG323 has been approved.', TRUE,  '2026-08-01 10:05:00+02'),
(2,  'Application Update', 'Application Approved: CMPG311', 'Your application for CMPG311 has been approved.', TRUE,  '2026-08-02 11:35:00+02'),
(3,  'Application Update', 'Application Approved: CMPG323', 'Your application for CMPG323 has been approved.', TRUE,  '2026-08-03 09:20:00+02'),
(4,  'Application Update', 'Application Under Review: EERI124', 'Your application for EERI124 is under lecturer review.', FALSE, '2026-08-04 14:05:00+02'),
(5,  'Application Update', 'Application Approved: REES211', 'Your application for REES211 has been approved.', TRUE,  '2026-08-05 15:50:00+02'),
(6,  'Application Update', 'Application Submitted: CMPG221', 'Your application for CMPG221 was submitted successfully.', FALSE, '2026-08-06 08:35:00+02'),
(7,  'Application Update', 'Application Approved: INGM311', 'Your application for INGM311 has been approved.', TRUE,  '2026-08-07 12:15:00+02'),
(8,  'Application Update', 'Application Submitted: INGM121', 'Your application for INGM121 was submitted successfully.', FALSE, '2026-08-08 16:25:00+02'),
(9,  'Application Update', 'Application Approved: INGM412', 'Your application for INGM412 has been approved.', TRUE,  '2026-08-09 11:05:00+02'),
(10, 'Application Update', 'Application Approved: INGM222', 'Your application for INGM222 has been approved.', TRUE,  '2026-08-10 13:30:00+02'),
(11, 'Application Update', 'Appointment approved: CMPG323', 'Your CMPG323 demi appointment is approved. Review your responsibilities and allocation in your profile.', FALSE, '2026-10-01 08:50:00+02'),
(12, 'Application Update', 'Application in review: CMPG323', 'Your CMPG323 application is with the lecturer for review.', FALSE, '2026-10-01 10:18:00+02'),
(13, 'Claim Submission',   'Claim submitted: CMPG311', 'Your October CMPG311 claim has been submitted and is awaiting lecturer review.', FALSE, '2026-10-04 11:40:00+02'),
(14, 'Application Update', 'Appointment approved: INGM311', 'Your INGM311 appointment has been approved. Please check your allocated hours.', TRUE, '2026-10-02 09:12:00+02'),
(15, 'Application Update', 'Application received: EERI124', 'Your application has been received and is awaiting review.', FALSE, '2026-10-02 11:50:00+02'),
(16, 'Application Update', 'Appointment pending administration: REES211', 'The lecturer approved your application. Your appointment is awaiting administrator review.', FALSE, '2026-10-02 16:20:00+02'),
(17, 'Application Update', 'Application outcome: CMPG221', 'Your CMPG221 application was not eligible because the minimum academic requirement was not met.', TRUE, '2026-10-03 09:05:00+02'),
(18, 'Application Update', 'Action required: INGM121', 'Please upload a bank confirmation document so the lecturer can continue reviewing your application.', FALSE, '2026-10-03 12:25:00+02'),
(19, 'Application Update', 'Application received: INGM222', 'Your application has been received and is awaiting lecturer review.', FALSE, '2026-10-04 09:35:00+02'),
(20, 'Claim Submission',   'Claim under review: INGM412', 'Your submitted claim is being checked against the laboratory timesheet.', FALSE, '2026-10-07 15:10:00+02'),
(21, 'Claim Submission',   'Claim submitted: EERI223', 'Your October EERI223 claim is awaiting lecturer review.', FALSE, '2026-10-07 16:32:00+02'),
(22, 'Application Update', 'Appointment approved: CMPG312', 'Your CMPG312 appointment is approved. Contact the lecturer to coordinate tutorial times.', FALSE, '2026-10-06 09:15:00+02'),
(23, 'Claim Submission',   'Claims ready for review', 'There are new October demi claims awaiting your review.', FALSE, '2026-10-07 16:35:00+02'),
(33, 'Administration',     'Appointments awaiting review', 'A new demi appointment is ready for administrator review.', FALSE, '2026-10-02 16:25:00+02');

-- ----------------------------------------------------------------------------
-- 21. SECURITY SESSION TOKENS
--     Placeholder tokens: authentication tests create their own valid tokens.
-- ----------------------------------------------------------------------------
INSERT INTO "SECURITY_TOKEN" ("UserID", "JWT_Token", "IssuedAt", "ExpiresAt") VALUES
(1,  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwibmFtZSI6IlNpcGhvIE5kbG92dSJ9',  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '8 hours'),
(2,  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyIiwibmFtZSI6IlBpZXRlciBCb3RoYSJ9',  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '8 hours'),
(3,  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzIiwibmFtZSI6IkxlcmF0byBNb2tvZW5hIn0', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '8 hours'),
(11, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMSIsIm5hbWUiOiJOYWxlZGkgTW9sZWZlIn0', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '8 hours'),
(23, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyMyIsIm5hbWUiOiJBbGFuIFNtaXRoIn0',    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '8 hours'),
(33, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzMyIsIm5hbWUiOiJFcmljIEpvaG5zb24ifQ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '8 hours');

-- ----------------------------------------------------------------------------
-- 22. RESET THE APP_USER IDENTITY SEQUENCE
--     Users were inserted with explicit IDs, so advance the sequence past the
--     seeded rows or newly registered users will collide with primary keys.
-- ----------------------------------------------------------------------------
SELECT setval(
    pg_get_serial_sequence('"APP_USER"', 'UserID'),
    (SELECT MAX("UserID") FROM "APP_USER")
);

COMMIT;
