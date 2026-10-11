-- ============================================================================
-- DACMS PRESENTATION DEMO SEED SCRIPT
-- Purpose: Pre-seed clean, distinct test records so each presenter speaks ONCE
-- in order: Student -> Lecturer -> Administrator without jumping back and forth.
-- ============================================================================

BEGIN;

-- 1. Ensure our 3 main presentation actors have clear credentials:
-- Student:       naledi.molefe@nwu.ac.za    (UserID: 17, password: Password123)
-- Lecturer:      alan.smith@nwu.ac.za       (UserID: 11, password: Password123)
-- Administrator: eric.johnson@nwu.ac.za     (UserID: 15, password: Password123)

-- 2. Pre-seed a clean un-applied listing for Student to apply to:
-- ListingID 11 (CMPG323, Lecturer Alan Smith) - ensure Student 17 doesn't have a duplicate pending app
DELETE FROM "DEMI_APPLICATION" WHERE "StudentID" = 17 AND "ListingID" = 12;

-- 3. Staged Record for Lecturer to review immediately:
-- Application from Student 18 (Thabo Maseko) for Listing 11 (CMPG323) in 'In Review' status
UPDATE "DEMI_APPLICATION" 
SET "ApplicationStatus" = 'In Review', "ReviewComment" = 'Awaiting lecturer decision'
WHERE "ApplicationID" = 18;

-- 4. Staged Work Session for Lecturer to verify immediately:
-- A logged session waiting for Lecturer Alan's verification (Position 8, CMPG323)
UPDATE "WORK_SESSION"
SET "LecturerApproval" = FALSE, 
    "ActivityDescription" = 'CMPG323 Demo Lab Support - Awaiting Lecturer Verification'
WHERE "SessionID" = 13;

-- 5. Staged Claim for Lecturer to review:
-- A claim submitted by Student 18 waiting for Lecturer review
UPDATE "REMUNERATION_CLAIM"
SET "ClaimStatus" = 'Pending', "LecturerComment" = NULL
WHERE "ClaimID" = 9;

-- 6. Staged Appointment for Administrator to approve:
-- Position awaiting Admin approval (Application 16 / Position 12)
UPDATE "DEMI_POSITION"
SET "PositionStatus" = 'Pending Admin Review'
WHERE "PositionID" = 12;

-- 7. Staged Claim for Administrator to approve for payment:
-- Claim verified by Lecturer, waiting for final Admin approval and payment
UPDATE "REMUNERATION_CLAIM"
SET "ClaimStatus" = 'Verified', "AdminComment" = NULL
WHERE "ClaimID" = 7;

COMMIT;
