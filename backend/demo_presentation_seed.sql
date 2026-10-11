-- ============================================================================
-- DACMS PRESENTATION DEMO SEED SCRIPT
-- Flow: Ernst (Student) -> Cole (Lecturer) -> Neil (Administrator)
--
-- 1. Student (Ernst):
--    - Logs in as naledi.molefe@nwu.ac.za (Password123)
--    - Applies live to open listing CMPG311 (Databases, Dr. Alan Smith)
--    - Logs work session on active position CMPG323 (IT Developments)
--          - Prompt Cole to verify the hours immediately 
--          - Lecturer Reviews & approves Naledi's CMPG323 work session
--    - Submits live claim for CMPG323 (demonstrating unverified sessions cannot be claimed)
--
-- 2. Lecturer (Cole):
--    - Logs in as alan.smith@nwu.ac.za (Password123)
--    - Reviews & approves NALEDI MOLEFE's live application for CMPG311
--      (This automatically creates an appointment waiting for Neil in the next step!)
--    - Endorses Naledi's waiting live CMPG323 claim
--    - Views module budget summaries & list view
--
-- 3. Administrator (Neil):
--    - Logs in as eric.johnson@nwu.ac.za (Password123) & demonstrates 2FA enrollment
--    - Approves NALEDI's newly created appointment for CMPG311
--    - Approves NALEDI's claim for CMPG323
--    - Creates a new budget for EERI223 (Signal Processing)
--    - Exports payments & opens Naledi's claim PDF voucher
-- ============================================================================

BEGIN;

-- ----------------------------------------------------------------------------
-- 1. USERS & PASSWORDS & 2FA RESET
-- ----------------------------------------------------------------------------
-- Reset Neil's (Admin Eric Johnson, UserID 15) 2FA so he can enroll live on stage
UPDATE "ADMINISTRATOR"
SET "TFASecret" = NULL, "TFABackupCodes" = '{}', "TFALastStep" = NULL, "TFAConfirmedAt" = NULL
WHERE "AdminID" = 15;

-- ----------------------------------------------------------------------------
-- 2. ERNST (STUDENT) & COLE (LECTURER) FLOWS
-- ----------------------------------------------------------------------------
-- (A) Module CMPG311 (ListingID 12) - Ensure Naledi has NO application yet so Ernst can apply live:
DELETE FROM "DEMI_APPLICATION" WHERE "StudentID" = 17 AND "ListingID" = 12;

-- Ensure Naledi's grade for CMPG311 qualifies (74%, above 65% requirement):
INSERT INTO "STUDENT_MODULE_GRADE" ("StudentID", "ModuleID", "GradeAchieved", "AcademicYear")
VALUES (17, 2, 74.00, 2026)
ON CONFLICT DO NOTHING;

-- (B) Module CMPG323 (PositionID 8) - Clean previous claims so Ernst can generate claim live:
DELETE FROM "REMUNERATION_CLAIM" WHERE "ApplicationID" = 11;

-- Ensure Naledi has approved sessions ready to be claimed:
UPDATE "WORK_SESSION"
SET "LecturerApproval" = TRUE
WHERE "PositionID" = 8 AND "TotalHoursWorked" IN (3.00, 3.50);

-- Ensure Naledi has 1 unapproved session so Ernst shows unverified hours cannot be claimed,
-- and Cole can verify it in Step 2:
UPDATE "WORK_SESSION"
SET "LecturerApproval" = FALSE,
    "ActivityDescription" = 'CMPG323 Demo Lab Tutoring - Pending Verification'
WHERE "PositionID" = 8 AND "TotalHoursWorked" = 2.00;

-- ----------------------------------------------------------------------------
-- 3. NEIL (ADMINISTRATOR) FLOWS
-- ----------------------------------------------------------------------------
-- Remove the 2026 budget for EERI223 (ModuleID: 10) so Neil can demonstrate
-- CREATING a brand new budget without encountering a "budget already exists" error:
DELETE FROM "MODULE_BUDGET" WHERE "ModuleID" = 10 AND "AcademicYear" = 2026;

COMMIT;
