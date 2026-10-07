import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import test from 'node:test';
import pool from '../src/config/db.js';
import DemiApplicationRepository from '../src/repositories/DemiApplicationRepository.js';
import AdminService from '../src/services/AdminService.js';
import LecturerService from '../src/services/LecturerService.js';

test('lecturer and admin decisions preserve the application-position checkpoint', async () => {
    const applicationIds = [];

    async function createApplication() {
        const contextResult = await pool.query(
            `
            SELECT s."StudentID", dl."ListingID", dl."LecturerID"
            FROM "STUDENT" s
            CROSS JOIN "DEMI_LISTING" dl
            WHERE EXISTS (
                SELECT 1
                FROM "PAYMENT_SCALE" ps
                WHERE ps."RoleLevel" = CASE
                    WHEN LOWER(BTRIM(s."StudyLevel")) = 'postgraduate' THEN 'Postgraduate Demi'
                    WHEN LOWER(BTRIM(s."StudyLevel")) = 'undergraduate' THEN 'Undergraduate Demi'
                    ELSE NULL
                END
                  AND ps."EffectiveYear" <= EXTRACT(YEAR FROM CURRENT_DATE)
            )
            ORDER BY s."StudentID", dl."ListingID"
            LIMIT 1
            `
        );
        assert.ok(contextResult.rows.length, 'test database needs a student, listing, and current scale');

        const { StudentID, ListingID, LecturerID } = contextResult.rows[0];
        const reference = `WF-${Date.now()}-${randomBytes(3).toString('hex')}`;
        const applicationResult = await pool.query(
            `
            INSERT INTO "DEMI_APPLICATION"
                ("StudentID", "ListingID", "Reference", "ApplicationStatus",
                 "VerificationEligibilityStatus", "AppReason")
            VALUES ($1, $2, $3, 'Pending', 'Eligible', 'Workflow integration test')
            RETURNING "ApplicationID"
            `,
            [StudentID, ListingID, reference]
        );
        const applicationId = applicationResult.rows[0].ApplicationID;
        const applicationRepository = new DemiApplicationRepository();
        const studentApplications = await applicationRepository.findByStudentId(StudentID);
        const application = studentApplications.find(
            (row) => row.ApplicationID === applicationId
        );
        assert.equal(application?.Reference, reference);
        assert.equal(application?.ApplicationReference, reference);
        applicationIds.push(applicationId);
        return { applicationId, lecturerId: LecturerID, studentId: StudentID };
    }

    async function getApplicationState(applicationId) {
        const result = await pool.query(
            `
            SELECT
                a."ApplicationStatus" AS application_status,
                dp."PositionID" AS position_id,
                dp."PositionStatus" AS position_status,
                dp."TotalAllocatedHours" AS allocated_hours,
                dp."AdminComment" AS admin_comment
            FROM "DEMI_APPLICATION" a
            LEFT JOIN "DEMI_POSITION" dp
                ON dp."ApplicationID" = a."ApplicationID"
            WHERE a."ApplicationID" = $1
            `,
            [applicationId]
        );
        return result.rows;
    }

    async function assertNotifications(applicationId, action, comment, recipients) {
        const message = `Your position request for Application #${applicationId} has been ${action.toLowerCase()}. Comment: ${comment}`;
        const result = await pool.query(
            `
            SELECT "RecipientUserID"
            FROM "NOTIFICATION"
            WHERE "Message" = $1
            `,
            [message]
        );
        assert.deepEqual(
            result.rows.map((row) => Number(row.RecipientUserID)).sort(),
            recipients.map(Number).sort()
        );
    }

    try {
        const approved = await createApplication();
        await LecturerService.lecturerReviewApplication(
            approved.lecturerId,
            approved.applicationId,
            'Approved',
            'Lecturer approved'
        );
        await LecturerService.lecturerReviewApplication(
            approved.lecturerId,
            approved.applicationId,
            'Approved',
            'Repeated approval'
        );

        let rows = await getApplicationState(approved.applicationId);
        assert.equal(rows.length, 1, 'repeated lecturer approval must not duplicate the position');
        assert.equal(rows[0].application_status, 'Approved');
        assert.equal(rows[0].position_status, 'Pending Admin Review');
        assert.equal(Number(rows[0].allocated_hours), 0);
        assert.equal(rows[0].admin_comment, null);
        assert.ok(rows[0].position_id);

        const positionId = rows[0].position_id;
        await AdminService.reviewPosition(positionId, 'Approved', 'Admin approved');
        rows = await getApplicationState(approved.applicationId);
        assert.equal(rows[0].application_status, 'Approved');
        assert.equal(rows[0].position_status, 'Approved');
        await assertNotifications(
            approved.applicationId,
            'Approved',
            'Admin approved',
            [approved.studentId, approved.lecturerId]
        );

        await assert.rejects(
            AdminService.reviewPosition(positionId, 'Rejected', 'Must not be reviewed twice'),
            { message: 'Position is not awaiting admin review' }
        );

        for (const decision of ['Rejected', 'Returned']) {
            const lecturerDecision = await createApplication();
            await LecturerService.lecturerReviewApplication(
                lecturerDecision.lecturerId,
                lecturerDecision.applicationId,
                decision,
                'Lecturer decision'
            );
            rows = await getApplicationState(lecturerDecision.applicationId);
            assert.equal(rows.length, 1);
            assert.equal(rows[0].application_status, decision);
            assert.equal(rows[0].position_id, null);
        }

        const existingPosition = await createApplication();
        await LecturerService.lecturerReviewApplication(
            existingPosition.lecturerId,
            existingPosition.applicationId,
            'Approved',
            'Lecturer approved'
        );
        await LecturerService.lecturerReviewApplication(
            existingPosition.lecturerId,
            existingPosition.applicationId,
            'Rejected',
            'Lecturer changed decision'
        );
        rows = await getApplicationState(existingPosition.applicationId);
        assert.equal(rows[0].application_status, 'Rejected');
        assert.equal(rows[0].position_status, 'Pending Admin Review');

        const mismatchedApplication = await createApplication();
        await LecturerService.lecturerReviewApplication(
            mismatchedApplication.lecturerId,
            mismatchedApplication.applicationId,
            'Approved',
            'Lecturer approved'
        );
        rows = await getApplicationState(mismatchedApplication.applicationId);
        await pool.query(
            'UPDATE "DEMI_APPLICATION" SET "ApplicationStatus" = $1 WHERE "ApplicationID" = $2',
            ['Returned', mismatchedApplication.applicationId]
        );
        await assert.rejects(
            AdminService.reviewPosition(rows[0].position_id, 'Approved', 'Must be blocked'),
            { message: 'Application is not approved for admin review' }
        );
        rows = await getApplicationState(mismatchedApplication.applicationId);
        assert.equal(rows[0].application_status, 'Returned');
        assert.equal(rows[0].position_status, 'Pending Admin Review');

        for (const action of ['Rejected', 'Returned']) {
            const adminDecision = await createApplication();
            await LecturerService.lecturerReviewApplication(
                adminDecision.lecturerId,
                adminDecision.applicationId,
                'Approved',
                'Lecturer approved'
            );
            rows = await getApplicationState(adminDecision.applicationId);
            await AdminService.reviewPosition(rows[0].position_id, action, 'Admin decision');
            rows = await getApplicationState(adminDecision.applicationId);
            assert.equal(rows[0].application_status, action);
            assert.equal(rows[0].position_status, action);
            await assertNotifications(
                adminDecision.applicationId,
                action,
                'Admin decision',
                [adminDecision.studentId, adminDecision.lecturerId]
            );
        }
    } finally {
        for (const applicationId of applicationIds) {
            for (const action of ['approved', 'rejected', 'returned']) {
                for (const comment of ['Admin approved', 'Admin decision']) {
                    const message = `Your position request for Application #${applicationId} has been ${action}. Comment: ${comment}`;
                    await pool.query(
                        'DELETE FROM "NOTIFICATION" WHERE "Message" = $1',
                        [message]
                    );
                }
            }
        }
        if (applicationIds.length > 0) {
            await pool.query(
                'DELETE FROM "DEMI_APPLICATION" WHERE "ApplicationID" = ANY($1::int[])',
                [applicationIds]
            );
        }
        await pool.end();
    }
});
