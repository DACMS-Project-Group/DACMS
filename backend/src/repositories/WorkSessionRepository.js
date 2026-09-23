import BaseRepository from './BaseRepository.js';
import WorkSession from '../models/WorkSession.js';

class WorkSessionRepository extends BaseRepository {
    constructor() {
        super('"WORK_SESSION"', WorkSession);
    }

<<<<<<< HEAD
    /**
     * Active Demi positions held by a student (approved application, not yet
     * terminated), including lecturer name, allocated hours cap, and hours
     * worked so far (so the frontend can show Worked/Maximum/Remaining).
     */
=======
    /** Lecturer access to Sessions */

    async fetchSessionsForLecturer(lecturerId) {
        return await this.query(
            `
            SELECT
                w."StartTime"::DATE AS "SessionDate",
                m."ModuleCode",
                w."ActivityDescription",
                w."StartTime"::TIME AS "StartTime",
                w."EndTime"::TIME AS "EndTime",
                w."TotalHoursWorked",
                w."LecturerApproval"
            FROM "WORK_SESSION" w
            JOIN "DEMI_POSITION" p ON p."PositionID" = w."PositionID"
            JOIN "DEMI_APPLICATION" a ON a."ApplicationID" = p."ApplicationID"
            JOIN "DEMI_LISTING" l ON l."ListingID" = a."ListingID"
            JOIN "NWU_MODULE" m ON m."ModuleID" = l."ModuleID"
            WHERE l."LecturerID" = $1
            `
            , [lecturerId]
        )
    }

    async fetchSessionByIdForLecturer(sessionId){
        return await this.query(
            `
            SELECT *
            FROM "WORK_SESSION"
            WHERE "SessionID" = $1
            `
            , [sessionId]
        )
    }

    async reviewSessionByLecturer(sessionId, approvalStatus) {
        return await this.query(
            `
            UPDATE "WORK_SESSION"
            SET "LecturerApproval" = $1
            WHERE "SessionID" = $2
            RETURNING "SessionID", "LecturerApproval"
            `
            , [approvalStatus, sessionId]
        )
    }

    /** Get student ID from session for notification */

    async getStudentIdFromSession(sessionId) {
        const studentId = await this.query(
            `
            SELECT 
                a."StudentID"
            FROM "WORK_SESSION" w
            JOIN "DEMI_POSITION" p ON p."PositionID" = w."PositionID"
            JOIN "DEMI_APPLICATION" a ON a."ApplicationID" = p."ApplicationID"
            WHERE w."SessionID" = $1;
            `, [sessionId]
        )

        return studentId[0].StudentID;
    }

    /** Active Demi positions held by a student (approved application, not yet terminated). */
>>>>>>> origin/backend
    async findActivePositionsForStudent(studentId) {
        return this.query(
            `
            SELECT
                p."PositionID",
                p."ApplicationID",
                p."PaymentScaleID",
                p."StartDate",
                p."TerminationDate",
                p."TotalAllocatedHours",
                ps."StandardHourlyRate",
                m."ModuleCode",
                m."ModuleName",
                lu."FName" AS "LecturerFName",
                lu."LName" AS "LecturerLName",
                COALESCE(worked."WorkedHours", 0) AS "WorkedHours"
            FROM "DEMI_POSITION" p
            JOIN "DEMI_APPLICATION" a ON a."ApplicationID" = p."ApplicationID"
            JOIN "DEMI_LISTING" l ON l."ListingID" = a."ListingID"
            JOIN "NWU_MODULE" m ON m."ModuleID" = l."ModuleID"
            JOIN "PAYMENT_SCALE" ps ON ps."ScaleID" = p."PaymentScaleID"
            JOIN "LECTURER" lec ON lec."LecturerID" = l."LecturerID"
            JOIN "APP_USER" lu ON lu."UserID" = lec."LecturerID"
            LEFT JOIN (
                SELECT "PositionID", SUM("TotalHoursWorked") AS "WorkedHours"
                FROM "WORK_SESSION"
                WHERE "TotalHoursWorked" IS NOT NULL
                GROUP BY "PositionID"
            ) worked ON worked."PositionID" = p."PositionID"
            WHERE a."StudentID" = $1
              AND (p."TerminationDate" IS NULL OR p."TerminationDate" > NOW())
            ORDER BY p."StartDate" DESC
            `,
            [studentId]
        );
    }

    /**
     * Confirms a position belongs to this student, and returns its hourly
     * rate, allocated-hours cap, and hours worked so far (for the
     * remaining-hours check when recording a new session).
     */
    async findPositionForStudent(positionId, studentId) {
        const rows = await this.query(
            `
            SELECT
                p."PositionID",
                p."TotalAllocatedHours",
                ps."StandardHourlyRate",
                COALESCE(worked."WorkedHours", 0) AS "WorkedHours"
            FROM "DEMI_POSITION" p
            JOIN "DEMI_APPLICATION" a ON a."ApplicationID" = p."ApplicationID"
            JOIN "PAYMENT_SCALE" ps ON ps."ScaleID" = p."PaymentScaleID"
            LEFT JOIN (
                SELECT "PositionID", SUM("TotalHoursWorked") AS "WorkedHours"
                FROM "WORK_SESSION"
                WHERE "TotalHoursWorked" IS NOT NULL
                GROUP BY "PositionID"
            ) worked ON worked."PositionID" = p."PositionID"
            WHERE p."PositionID" = $1 AND a."StudentID" = $2
            `,
            [positionId, studentId]
        );
        return rows[0] || null;
    }

    /**
     * Records a work session retroactively - start and end time are both
     * known and submitted together (no live clock-in/out). Hours and
     * remuneration are computed here from the given times, not NOW().
     */
    async createSession({ positionId, activityDescription, startTime, endTime, totalHoursWorked, estimatedRemuneration }) {
        const rows = await this.query(
            `
            INSERT INTO "WORK_SESSION"
                ("PositionID", "ActivityDescription", "StartTime", "EndTime", "TotalHoursWorked", "EstimatedRemuneration")
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
            `,
            [positionId, activityDescription, startTime, endTime, totalHoursWorked, estimatedRemuneration]
        );
        return WorkSession.fromDb(rows[0]);
    }

    /** All sessions recorded for one position (a student's own appointment). */
    async findSessionsForPosition(positionId) {
        const rows = await this.query(
            `SELECT * FROM "WORK_SESSION" WHERE "PositionID" = $1 ORDER BY "StartTime" DESC`,
            [positionId]
        );
        return rows.map(WorkSession.fromDb);
    }

    /**
     * Full detail for a single session - including module, lecturer, and
     * hourly rate - for the session detail page.
     */
    async findSessionDetailById(sessionId) {
        const rows = await this.query(
            `
            SELECT
                ws.*,
                m."ModuleCode",
                m."ModuleName",
                ps."StandardHourlyRate",
                lu."FName" AS "LecturerFName",
                lu."LName" AS "LecturerLName"
            FROM "WORK_SESSION" ws
            JOIN "DEMI_POSITION" p ON p."PositionID" = ws."PositionID"
            JOIN "DEMI_APPLICATION" a ON a."ApplicationID" = p."ApplicationID"
            JOIN "DEMI_LISTING" l ON l."ListingID" = a."ListingID"
            JOIN "NWU_MODULE" m ON m."ModuleID" = l."ModuleID"
            JOIN "PAYMENT_SCALE" ps ON ps."ScaleID" = p."PaymentScaleID"
            JOIN "LECTURER" lec ON lec."LecturerID" = l."LecturerID"
            JOIN "APP_USER" lu ON lu."UserID" = lec."LecturerID"
            WHERE ws."SessionID" = $1
            `,
            [sessionId]
        );
        return rows[0] || null;
    }

    /** Confirms a session belongs (via its position) to this student. */
    async belongsToStudent(sessionId, studentId) {
        const rows = await this.query(
            `
            SELECT ws."SessionID"
            FROM "WORK_SESSION" ws
            JOIN "DEMI_POSITION" p ON p."PositionID" = ws."PositionID"
            JOIN "DEMI_APPLICATION" a ON a."ApplicationID" = p."ApplicationID"
            WHERE ws."SessionID" = $1 AND a."StudentID" = $2
            `,
            [sessionId, studentId]
        );
        return rows.length > 0;
    }

    /**
     * All sessions across all of a student's positions. Not exposed as its
     * own public route (not part of the team's API contract), but still used
     * internally by the dashboard aggregation.
     */
    async findByStudentId(studentId) {
        return this.query(
            `
            SELECT
                ws.*,
                m."ModuleCode",
                m."ModuleName"
            FROM "WORK_SESSION" ws
            JOIN "DEMI_POSITION" p ON p."PositionID" = ws."PositionID"
            JOIN "DEMI_APPLICATION" a ON a."ApplicationID" = p."ApplicationID"
            JOIN "DEMI_LISTING" l ON l."ListingID" = a."ListingID"
            JOIN "NWU_MODULE" m ON m."ModuleID" = l."ModuleID"
            WHERE a."StudentID" = $1
            ORDER BY ws."StartTime" DESC
            `,
            [studentId]
        );
    }
}

export default WorkSessionRepository;