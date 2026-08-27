-- ==========================================
-- DACMS DATABASE SEED DATA SCRIPT
-- Target Platform: PostgreSQL 
-- ==========================================

-- Insert system roles
INSERT INTO system_role (role_name) VALUES 
('Student'), 
('Lecturer'), 
('Administrator');

-- Insert hourly rates for both tutor levels
INSERT INTO payment_scale (role_level, standard_hourly_rate, effective_year) VALUES 
('Undergraduate', 86.75, 2026),
('Postgraduate', 107.80, 2026);

-- Insert 10 academic modules
INSERT INTO nwu_module (module_code, module_name, description, min_academic_requirement) VALUES 
('CMPG323', 'IT Developments', 'Practical software engineering and deployment.', 65.00),
('CMPG311', 'Databases', 'Relational design and advanced SQL querying.', 65.00),
('INGM311', 'Engineering Thermodynamics', 'Advanced thermal systems and cycle analyses.', 60.00),
('EERI124', 'Introduction to Digital Systems', 'Fundamental logic design and gates.', 65.00),
('REES211', 'Renewable Energy Systems', 'Clean energy grid systems and power.', 60.00),
('CMPG221', 'Data Structures', 'Algorithms and memory organisation.', 65.00),
('INGM121', 'Engineering Statics', 'Rigid body mechanics and forces.', 60.00),
('INGM222', 'Engineering Dynamics', 'Motion, kinetic energy, and accelerations.', 60.00),
('INGM412', 'Fluid Mechanics', 'Incompressible flow and piping design.', 60.00),
('EERI223', 'Signal Processing', 'Analogue and digital waves analyses.', 65.00);

-- Insert users including 10 students, 4 lecturers, 2 administrators
INSERT INTO app_user (f_name, l_name, email, password_hash, role_id) VALUES 
('Sipho', 'Ndlovu', 'sipho.ndlovu@nwu.ac.za', 'hash_sipho_123', 1),
('Pieter', 'Botha', 'pieter.botha@nwu.ac.za', 'hash_pieter_123', 1),
('Lerato', 'Mokoena', 'lerato.mokoena@nwu.ac.za', 'hash_lerato_123', 1),
('Sanele', 'Khumalo', 'sanele.khumalo@nwu.ac.za', 'hash_sanele_123', 1),
('Fatima', 'Patel', 'fatima.patel@nwu.ac.za', 'hash_fatima_123', 1),
('Johan', 'Coetzee', 'johan.coetzee@nwu.ac.za', 'hash_johan_123', 1),
('Zola', 'Dlamini', 'zola.dlamini@nwu.ac.za', 'hash_zola_123', 1),
('Chen', 'Wei', 'chen.wei@nwu.ac.za', 'hash_chen_123', 1),
('Ananya', 'Naidoo', 'ananya.naidoo@nwu.ac.za', 'hash_ananya_123', 1),
('David', 'Miller', 'david.miller@nwu.ac.za', 'hash_david_123', 1),
('Alan', 'Smith', 'alan.smith@nwu.ac.za', 'hash_alan_123', 2),
('Beatrice', 'Jones', 'beatrice.jones@nwu.ac.za', 'hash_beatrice_123', 2),
('Charles', 'Brown', 'charles.brown@nwu.ac.za', 'hash_charles_123', 2),
('Diane', 'Taylor', 'diane.taylor@nwu.ac.za', 'hash_diane_123', 2),
('Eric', 'Johnson', 'eric.johnson@nwu.ac.za', 'hash_eric_123', 3),
('Fiona', 'Carter', 'fiona.carter@nwu.ac.za', 'hash_fiona_123', 3);

-- Insert 10 student profiles mapped to student users
INSERT INTO student_profile (student_number, study_level, contact_details, bank_name, account_number, branch_code, user_id) VALUES 
('12345678', 'Undergraduate', '+27820000001', 'FNB', '62111111111', '250655', 1),
('23456789', 'Undergraduate', '+27820000002', 'Standard Bank', '10111111112', '051001', 2),
('34567890', 'Postgraduate', '+27820000003', 'Nedbank', '19811111113', '198765', 3),
('45678901', 'Undergraduate', '+27820000004', 'Capitec', '15211111114', '470010', 4),
('56789012', 'Postgraduate', '+27820000005', 'ABSA', '40511111115', '632005', 5),
('67890123', 'Undergraduate', '+27820000006', 'FNB', '62111111116', '250655', 6),
('78901234', 'Postgraduate', '+27820000007', 'Standard Bank', '10111111117', '051001', 7),
('89012345', 'Undergraduate', '+27820000008', 'Nedbank', '19811111118', '198765', 8),
('90123456', 'Postgraduate', '+27820000009', 'Capitec', '15211111119', '470010', 9),
('91234567', 'Undergraduate', '+27820000010', 'ABSA', '40511111120', '632005', 10);

-- Insert 4 lecturer profiles mapped to lecturer users
INSERT INTO lecturer_profile (department, user_id) VALUES 
('School of Electrical, Electronic and Computer Engineering', 11),
('School of Industrial Engineering', 12),
('School of Mechanical Engineering', 13),
('School of Chemical Engineering', 14);

-- Insert 2 administrator profiles mapped to admin users
INSERT INTO administrator_profile (mfa_enabled, budget_allocation_rights, user_id) VALUES 
(TRUE, TRUE, 15),
(TRUE, TRUE, 16);

-- Insert 10 supporting documents for uploaded student files
INSERT INTO supporting_document (student_id, document_type, file_path, upload_timestamp, document_status) VALUES 
(1, 'Academic Transcript', '/uploads/docs/transcript_sipho.pdf', '2026-08-01 09:00:00+02', 'Approved'),
(1, 'Bank Confirmation', '/uploads/docs/bank_sipho.pdf', '2026-08-01 09:15:00+02', 'Approved'),
(2, 'Academic Transcript', '/uploads/docs/transcript_pieter.pdf', '2026-08-02 10:00:00+02', 'Approved'),
(2, 'Certified ID', '/uploads/docs/id_pieter.pdf', '2026-08-02 10:10:00+02', 'Approved'),
(3, 'Academic Transcript', '/uploads/docs/transcript_lerato.pdf', '2026-08-03 11:00:00+02', 'Approved'),
(4, 'Academic Transcript', '/uploads/docs/transcript_sanele.pdf', '2026-08-04 12:00:00+02', 'Approved'),
(5, 'Academic Transcript', '/uploads/docs/transcript_fatima.pdf', '2026-08-05 13:00:00+02', 'Approved'),
(6, 'Academic Transcript', '/uploads/docs/transcript_johan.pdf', '2026-08-06 14:00:00+02', 'Approved'),
(7, 'Academic Transcript', '/uploads/docs/transcript_zola.pdf', '2026-08-07 15:00:00+02', 'Approved'),
(8, 'Academic Transcript', '/uploads/docs/transcript_chen.pdf', '2026-08-08 16:00:00+02', 'Approved'),
(9, 'Academic Transcript', '/uploads/docs/transcript_ananya.pdf', '2026-08-09 17:00:00+02', 'Approved'),
(10, 'Academic Transcript', '/uploads/docs/transcript_david.pdf', '2026-08-10 18:00:00+02', 'Approved');

-- Insert 10 lecturer module assignments
INSERT INTO lecturer_module (lecturer_id, module_id) VALUES 
(1, 1), -- Lecturer 1 teaches IT Developments
(1, 2), -- Lecturer 1 teaches Databases
(2, 4), -- Lecturer 2 teaches Digital Systems
(2, 10), -- Lecturer 2 teaches Signal Processing
(3, 3), -- Lecturer 3 teaches Thermodynamics
(3, 7), -- Lecturer 3 teaches Statics
(3, 8), -- Lecturer 3 teaches Dynamics
(4, 5), -- Lecturer 4 teaches Renewable Energy
(4, 9), -- Lecturer 4 teaches Fluid Mechanics
(1, 6); -- Lecturer 1 teaches Data Structures

-- Insert 10 module budgets set by admins
INSERT INTO module_budget (module_id, lecturer_id, allocated_budget, max_allowable_work_hours, academic_year) VALUES 
(1, 1, 17292.96, 160, 2026),
(2, 1, 13880.00, 160, 2026),
(3, 3, 17592.96, 160, 2026),
(4, 2, 13880.00, 160, 2026),
(5, 4, 10780.00, 100, 2026),
(6, 1, 13880.00, 160, 2026),
(7, 3, 13272.75, 150, 2026),
(8, 3, 7078.80, 80, 2026),
(9, 4, 4398.24, 40, 2026),
(10, 2, 10995.60, 100, 2026);

-- Insert 10 student grades for eligibility checks
INSERT INTO student_module_grade (student_id, module_id, grade_achieved) VALUES 
(1, 1, 74.50),
(2, 2, 81.00),
(3, 1, 85.00),
(4, 4, 70.00),
(5, 5, 88.50),
(6, 6, 68.00),
(7, 3, 77.00),
(8, 7, 72.00),
(9, 9, 83.00),
(10, 8, 79.50);

-- Insert 10 demi postings/listings
INSERT INTO demi_listing (module_id, lecturer_id, deadline, minimum_grade) VALUES 
(1, 1, '2026-08-31 23:59:59+02', 65.00),
(2, 1, '2026-08-31 23:59:59+02', 65.00),
(3, 3, '2026-08-31 23:59:59+02', 60.00),
(4, 2, '2026-08-31 23:59:59+02', 65.00),
(5, 4, '2026-08-31 23:59:59+02', 60.00),
(6, 1, '2026-08-31 23:59:59+02', 65.00),
(7, 3, '2026-08-31 23:59:59+02', 60.00),
(8, 3, '2026-08-31 23:59:59+02', 60.00),
(9, 4, '2026-08-31 23:59:59+02', 60.00),
(10, 2, '2026-08-31 23:59:59+02', 65.00);

-- Insert 10 applications by our students
INSERT INTO demi_application (student_id, listing_id, application_status, verification_eligibility_status) VALUES 
(1, 1, 'Approved', 'Eligible'),
(2, 2, 'Approved', 'Eligible'),
(3, 1, 'Approved', 'Eligible'),
(4, 4, 'Recommended', 'Eligible'),
(5, 5, 'Approved', 'Eligible'),
(6, 6, 'Pending', 'Eligible'),
(7, 3, 'Approved', 'Eligible'),
(8, 7, 'Pending', 'Eligible'),
(9, 9, 'Approved', 'Eligible'),
(10, 8, 'Approved', 'Eligible');

-- Insert 10 active tutor contracts/positions linked to approved applications
INSERT INTO demi_position (application_id, payment_scale_id, start_date, termination_date) VALUES 
(1, 1, '2026-07-01', '2026-11-30'), -- Student 1 (UG, CMPG323)
(2, 1, '2026-07-01', '2026-11-30'), -- Student 2 (UG, CMPG311)
(3, 2, '2026-07-01', '2026-11-30'), -- Student 3 (PG, CMPG323)
(5, 2, '2026-07-01', '2026-11-30'), -- Student 5 (PG, REES211)
(7, 2, '2026-07-01', '2026-11-30'), -- Student 7 (PG, INGM311)
(9, 2, '2026-07-01', '2026-11-30'), -- Student 9 (PG, INGM412)
(10, 1, '2026-07-01', '2026-11-30'); -- Student 10 (UG, INGM222)

-- Insert 10 practice timesheet work sessions for our appointed tutors
INSERT INTO work_session (student_id, module_id, start_time, end_time, total_hours_worked, estimated_remuneration, lecturer_approval) VALUES 
(1, 1, '2026-08-10 08:00:00+02', '2026-08-10 12:00:00+02', 4.00, 347.00, TRUE), -- Sipho: 4 hrs
(1, 1, '2026-08-12 09:00:00+02', '2026-08-12 11:30:00+02', 2.50, 216.88, TRUE), -- Sipho: 2.5 hrs
(2, 2, '2026-08-10 14:00:00+02', '2026-08-10 18:00:00+02', 4.00, 347.00, TRUE), -- Pieter: 4 hrs
(2, 2, '2026-08-11 14:00:00+02', '2026-08-11 17:00:00+02', 3.00, 260.25, TRUE), -- Pieter: 3 hrs
(3, 1, '2026-08-10 08:00:00+02', '2026-08-10 13:00:00+02', 5.00, 539.00, TRUE), -- Lerato: 5 hrs
(3, 1, '2026-08-11 08:00:00+02', '2026-08-11 13:00:00+02', 5.00, 539.00, TRUE), -- Lerato: 5 hrs
(5, 5, '2026-08-15 09:00:00+02', '2026-08-15 13:00:00+02', 4.00, 431.20, TRUE), -- Fatima: 4 hrs
(7, 3, '2026-08-18 09:00:00+02', '2026-08-18 15:00:00+02', 6.00, 646.80, TRUE), -- Zola: 6 hrs
(9, 9, '2026-08-20 10:00:00+02', '2026-08-20 12:00:00+02', 2.00, 215.60, TRUE), -- Ananya: 2 hrs
(10, 8, '2026-08-22 13:00:00+02', '2026-08-22 16:00:00+02', 3.00, 260.25, TRUE); -- David: 3 hrs

-- Insert 5 monthly claims grouping approved timesheets
INSERT INTO remuneration_claim (claim_reference_number, application_id, module_id, total_hours_claimed, total_claim_amount, hourly_rate_applied, claim_status) VALUES 
('CLAIM-2026-08-001', 1, 1, 6.50, 563.88, 86.75, 'Approved'), -- Sipho's August claim
('CLAIM-2026-08-002', 2, 2, 7.00, 607.25, 86.75, 'Approved'), -- Pieter's August claim
('CLAIM-2026-08-003', 3, 1, 10.00, 1078.00, 107.80, 'Approved'), -- Lerato's August claim
('CLAIM-2026-08-004', 5, 5, 4.00, 431.20, 107.80, 'Pending'), -- Fatima's August claim
('CLAIM-2026-08-005', 7, 3, 6.00, 646.80, 107.80, 'Pending'); -- Zola's August claim

-- Update work sessions to physically lock claim IDs
UPDATE work_session SET claim_id = 1 WHERE student_id = 1 AND module_id = 1;
UPDATE work_session SET claim_id = 2 WHERE student_id = 2 AND module_id = 2;
UPDATE work_session SET claim_id = 3 WHERE student_id = 3 AND module_id = 1;
UPDATE work_session SET claim_id = 4 WHERE student_id = 5 AND module_id = 5;
UPDATE work_session SET claim_id = 5 WHERE student_id = 7 AND module_id = 3;


-- Insert 10 communication notifications
INSERT INTO notification (recipient_user_id, notification_type, message) VALUES 
(1, 'Application Approved', 'Your application for CMPG323 has been approved by the Admin.'),
(2, 'Application Approved', 'Your application for CMPG311 has been approved by the Admin.'),
(3, 'Application Approved', 'Your application for CMPG323 has been approved by the Admin.'),
(4, 'Recommendation Sent', 'Your application for EERI124 has been recommended by the Lecturer.'),
(5, 'Application Approved', 'Your application for REES211 has been approved by the Admin.'),
(6, 'Application Submitted', 'Your application for CMPG221 was submitted successfully.'),
(7, 'Application Approved', 'Your application for INGM311 has been approved by the Admin.'),
(8, 'Application Submitted', 'Your application for INGM121 was submitted successfully.'),
(9, 'Application Approved', 'Your application for INGM412 has been approved by the Admin.'),
(10, 'Application Approved', 'Your application for INGM222 has been approved by the Admin.');

-- Insert 5 login/session security tokens
INSERT INTO security_token (user_id, jwt_token, expires_at) VALUES 
(1, 'jwt_sipho_mock_session_token', '2026-08-27 18:00:00+02'),
(2, 'jwt_pieter_mock_session_token', '2026-08-27 18:00:00+02'),
(3, 'jwt_lerato_mock_session_token', '2026-08-27 18:00:00+02'),
(11, 'jwt_alan_mock_session_token', '2026-08-27 18:00:00+02'),
(15, 'jwt_eric_mock_session_token', '2026-08-27 18:00:00+02');