-- ============================================================================
-- DACMS PRESENTATION DEMO SEED SCRIPT
-- Flow: Ernst (Student) -> Cole (Lecturer) -> Neil (Administrator)
--
-- 1. Student (Ernst):
--    - Logs in as 22345671@mynwu.ac.za (password)
--    - Applies live to open listing CMPG311 (Databases, Dr. Alan Smith)
--    - Logs work session on active position CMPG323 (IT Developments)
--          - Prompt Cole to verify the hours immediately
--          - Lecturer Reviews & approves Naledi's CMPG323 work session
--    - Submits live claim for CMPG323 (demonstrating unverified sessions cannot be claimed)
--
-- 2. Lecturer (Cole):
--    - Logs in as alan.smith@nwu.ac.za (password)
--    - Reviews & approves NALEDI MOLEFE's live application for CMPG311
--      (This automatically creates an appointment waiting for Neil in the next step!)
--    - Endorses Naledi's waiting live CMPG323 claim
--    - Views module budget summaries & list view
--
-- 3. Administrator (Neil):
--    - Logs in as eric.johnson@nwu.ac.za (password) & demonstrates 2FA enrollment
--    - Approves NALEDI's newly created appointment for CMPG311
--    - Approves NALEDI's claim for CMPG323
--    - Creates a new budget for EERI223 (Signal Processing)
--    - Exports payments & opens Naledi's claim PDF voucher
-- ============================================================================
-- ============================================================================
-- TO RUN ON RENDER (live database) - open the dacms-web Shell in Render dashboard:
--
--   psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f /app/backend/demo_presentation_seed.sql
--
-- ============================================================================

BEGIN;

-- ----------------------------------------------------------------------------
-- 1. USERS & PASSWORDS & 2FA RESET
-- ----------------------------------------------------------------------------
-- Reset Neil's (Administrator Eric Johnson) 2FA so he can enroll live on stage.
UPDATE "ADMINISTRATOR"
SET "TFASecret" = NULL,
    "TFABackupCodes" = '{}',
    "TFALastStep" = NULL,
    "TFAConfirmedAt" = NULL
WHERE "AdminID" = (
    SELECT "UserID" FROM "APP_USER" WHERE "Email" = 'eric.johnson@nwu.ac.za'
);

-- ----------------------------------------------------------------------------
-- 2. ERNST (STUDENT) & COLE (LECTURER) FLOWS
-- ----------------------------------------------------------------------------
-- (A) Open CMPG311 listing - ensure Naledi has NO application yet so Ernst can
-- apply live. The listing is resolved by module code so seed IDs may change.
DELETE FROM "DEMI_APPLICATION"
WHERE "StudentID" = (
    SELECT "UserID" FROM "APP_USER" WHERE "Email" = '22345671@mynwu.ac.za'
)
AND "ListingID" = (
    SELECT l."ListingID"
    FROM "DEMI_LISTING" l
    JOIN "NWU_MODULE" m ON m."ModuleID" = l."ModuleID"
    WHERE m."ModuleCode" = 'CMPG311'
    ORDER BY l."Deadline" ASC
    LIMIT 1
);

-- Ensure Naledi's grade for CMPG311 qualifies (74%, above 65%) and was earned
-- in a prior academic year, so the "no current-year modules" rule holds.
UPDATE "STUDENT_MODULE_GRADE" g
SET "GradeAchieved" = 74.00,
    "AcademicYear" = EXTRACT(YEAR FROM CURRENT_DATE)::int - 1
FROM "NWU_MODULE" m, "APP_USER" u
WHERE g."ModuleID" = m."ModuleID"
  AND g."StudentID" = u."UserID"
  AND m."ModuleCode" = 'CMPG311'
  AND u."Email" = '22345671@mynwu.ac.za';

INSERT INTO "STUDENT_MODULE_GRADE" ("StudentID", "ModuleID", "GradeAchieved", "AcademicYear")
SELECT u."UserID", m."ModuleID", 74.00, EXTRACT(YEAR FROM CURRENT_DATE)::int - 1
FROM "APP_USER" u, "NWU_MODULE" m
WHERE u."Email" = '22345671@mynwu.ac.za'
  AND m."ModuleCode" = 'CMPG311'
  AND NOT EXISTS (
      SELECT 1
      FROM "STUDENT_MODULE_GRADE" g
      WHERE g."StudentID" = u."UserID" AND g."ModuleID" = m."ModuleID"
  );

-- (B) CMPG323 position - clean previous claims so Ernst can generate a claim live.
DELETE FROM "REMUNERATION_CLAIM"
WHERE "ApplicationID" IN (
    SELECT a."ApplicationID"
    FROM "DEMI_APPLICATION" a
    JOIN "DEMI_LISTING" l ON l."ListingID" = a."ListingID"
    JOIN "NWU_MODULE" m ON m."ModuleID" = l."ModuleID"
    JOIN "APP_USER" u ON u."UserID" = a."StudentID"
    WHERE m."ModuleCode" = 'CMPG323'
      AND u."Email" = '22345671@mynwu.ac.za'
);

-- Ensure Naledi has approved sessions ready to be claimed.
WITH target_position AS (
    SELECT p."PositionID"
    FROM "DEMI_POSITION" p
    JOIN "DEMI_APPLICATION" a ON a."ApplicationID" = p."ApplicationID"
    JOIN "DEMI_LISTING" l ON l."ListingID" = a."ListingID"
    JOIN "NWU_MODULE" m ON m."ModuleID" = l."ModuleID"
    JOIN "APP_USER" u ON u."UserID" = a."StudentID"
    WHERE m."ModuleCode" = 'CMPG323'
      AND u."Email" = '22345671@mynwu.ac.za'
      AND p."PositionStatus" = 'Approved'
    ORDER BY p."PositionID" ASC
    LIMIT 1
)
UPDATE "WORK_SESSION" ws
SET "LecturerApproval" = TRUE
FROM target_position tp
WHERE ws."PositionID" = tp."PositionID"
  AND ws."TotalHoursWorked" IN (3.00, 3.50);

-- Ensure Naledi has 1 unapproved session so Ernst shows unverified hours cannot
-- be claimed, and Cole can verify it in Step 2.
WITH target_position AS (
    SELECT p."PositionID"
    FROM "DEMI_POSITION" p
    JOIN "DEMI_APPLICATION" a ON a."ApplicationID" = p."ApplicationID"
    JOIN "DEMI_LISTING" l ON l."ListingID" = a."ListingID"
    JOIN "NWU_MODULE" m ON m."ModuleID" = l."ModuleID"
    JOIN "APP_USER" u ON u."UserID" = a."StudentID"
    WHERE m."ModuleCode" = 'CMPG323'
      AND u."Email" = '22345671@mynwu.ac.za'
      AND p."PositionStatus" = 'Approved'
    ORDER BY p."PositionID" ASC
    LIMIT 1
)
UPDATE "WORK_SESSION" ws
SET "LecturerApproval" = FALSE,
    "ActivityDescription" = 'CMPG323 Demo Lab Tutoring - Pending Verification'
FROM target_position tp
WHERE ws."PositionID" = tp."PositionID"
  AND ws."TotalHoursWorked" = 2.00;

-- ----------------------------------------------------------------------------
-- 3. NEIL (ADMINISTRATOR) FLOWS
-- ----------------------------------------------------------------------------
-- Remove the current-year budget for EERI223 so Neil can demonstrate CREATING a
-- brand new budget without encountering a "budget already exists" error.
DELETE FROM "MODULE_BUDGET"
WHERE "ModuleID" = (
    SELECT "ModuleID" FROM "NWU_MODULE" WHERE "ModuleCode" = 'EERI223'
)
AND "AcademicYear" = EXTRACT(YEAR FROM CURRENT_DATE)::int;

COMMIT;
