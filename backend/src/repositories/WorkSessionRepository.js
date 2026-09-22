import BaseRepository from './BaseRepository.js';
import WorkSession from '../models/WorkSession.js';

class WorkSessionRepository extends BaseRepository {
    constructor() {
        super('"WORK_SESSION"', WorkSession);
    }

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
    async findActivePositionsForStudent(studentId) {
        return this.query(
            `
            SELECT
                p."PositionID",
                p."ApplicationID",
                p."PaymentScaleID",
                p."StartDate",
                p."TerminationDate",
                ps."StandardHourlyRate",
                m."ModuleCode",
                m."ModuleName"
            FROM "DEMI_POSITION" p
            JOIN "DEMI_APPLICATION" a ON a."ApplicationID" = p."ApplicationID"
            JOIN "DEMI_LISTING" l ON l."ListingID" = a."ListingID"
            JOIN "NWU_MODULE" m ON m."ModuleID" = l."ModuleID"
            JOIN "PAYMENT_SCALE" ps ON ps."ScaleID" = p."PaymentScaleID"
            WHERE a."StudentID" = $1
              AND (p."TerminationDate" IS NULL OR p."TerminationDate" > NOW())
            ORDER BY p."StartDate" DESC
            `,
            [studentId]
        );
    }

    /** Confirms a position belongs to this student, and returns its hourly rate. Null if not. */
    async findPositionForStudent(positionId, studentId) {
        const rows = await this.query(
            `
            SELECT p."PositionID", ps."StandardHourlyRate"
            FROM "DEMI_POSITION" p
            JOIN "DEMI_APPLICATION" a ON a."ApplicationID" = p."ApplicationID"
            JOIN "PAYMENT_SCALE" ps ON ps."ScaleID" = p."PaymentScaleID"
            WHERE p."PositionID" = $1 AND a."StudentID" = $2
            `,
            [positionId, studentId]
        );
        return rows[0] || null;
    }

    async findOpenSessionForPosition(positionId) {
        const rows = await this.query(
            `SELECT * FROM "WORK_SESSION" WHERE "PositionID" = $1 AND "EndTime" IS NULL`,
            [positionId]
        );
        return rows[0] ? WorkSession.fromDb(rows[0]) : null;
    }

    async clockIn(positionId) {
        const rows = await this.query(
            `
            INSERT INTO "WORK_SESSION" ("PositionID", "StartTime")
            VALUES ($1, NOW())
            RETURNING *
            `,
            [positionId]
        );
        return WorkSession.fromDb(rows[0]);
    }

    /** Ends an open session, calculating hours worked and estimated remuneration. */
    async clockOut(sessionId, hourlyRate) {
        const rows = await this.query(
            `
            UPDATE "WORK_SESSION"
            SET
                "EndTime" = NOW(),
                "TotalHoursWorked" = ROUND(EXTRACT(EPOCH FROM (NOW() - "StartTime")) / 3600.0, 2),
                "EstimatedRemuneration" = ROUND(
                    (EXTRACT(EPOCH FROM (NOW() - "StartTime")) / 3600.0) * $2, 2
                )
            WHERE "SessionID" = $1 AND "EndTime" IS NULL
            RETURNING *
            `,
            [sessionId, hourlyRate]
        );
        return rows[0] ? WorkSession.fromDb(rows[0]) : null;
    }

    async findById(sessionId) {
        const rows = await this.query(
            `SELECT * FROM "WORK_SESSION" WHERE "SessionID" = $1`,
            [sessionId]
        );
        return rows[0] ? WorkSession.fromDb(rows[0]) : null;
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

    /** All sessions across all of a student's positions. */
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
