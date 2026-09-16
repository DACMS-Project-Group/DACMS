import BaseRepository from './BaseRepository.js';
import RemunerationClaim from '../models/RemunerationClaim.js';

class RemunerationClaimRepository extends BaseRepository {
    constructor() {
        super('"REMUNERATION_CLAIM"', RemunerationClaim);
    }

    /** Confirms an application belongs to this student; returns module + rate info if so. */
    async findApplicationForStudent(applicationId, studentId) {
        const rows = await this.query(
            `
            SELECT
                a."ApplicationID",
                l."ModuleID",
                p."PositionID",
                ps."StandardHourlyRate"
            FROM "DEMI_APPLICATION" a
            JOIN "DEMI_LISTING" l ON l."ListingID" = a."ListingID"
            JOIN "DEMI_POSITION" p ON p."ApplicationID" = a."ApplicationID"
            JOIN "PAYMENT_SCALE" ps ON ps."ScaleID" = p."PaymentScaleID"
            WHERE a."ApplicationID" = $1 AND a."StudentID" = $2
            `,
            [applicationId, studentId]
        );
        return rows[0] || null;
    }

    /** Most recent claim submission date for this application, or null if none yet. */
    async findLatestClaimDate(applicationId) {
        const rows = await this.query(
            `SELECT MAX("SubmissionDate") AS "LatestDate" FROM "REMUNERATION_CLAIM" WHERE "ApplicationID" = $1`,
            [applicationId]
        );
        return rows[0]?.LatestDate || null;
    }

    /**
     * Sums approved (LecturerApproval = true), completed (EndTime not null) work
     * session hours for a position, optionally only sessions ending after `sinceDate`
     * (used to avoid re-claiming hours already included in a previous claim).
     */
    async sumUnclaimedApprovedHours(positionId, sinceDate) {
        const rows = await this.query(
            `
            SELECT COALESCE(SUM("TotalHoursWorked"), 0) AS "TotalHours"
            FROM "WORK_SESSION"
            WHERE "PositionID" = $1
              AND "LecturerApproval" = true
              AND "EndTime" IS NOT NULL
              AND ($2::timestamptz IS NULL OR "EndTime" > $2)
            `,
            [positionId, sinceDate]
        );
        return Number(rows[0]?.TotalHours || 0);
    }

    async create({
        referenceNumber,
        applicationId,
        moduleId,
        periodStartDate,
        periodEndDate,
        totalHoursClaimed,
        totalClaimAmount,
        hourlyRateApplied,
    }) {
        const rows = await this.query(
            `
            INSERT INTO "REMUNERATION_CLAIM"
                ("ClaimReferenceNumber", "ApplicationID", "ModuleID",
                 "PeriodStartDate", "PeriodEndDate",
                 "TotalHoursClaimed", "TotalClaimAmount", "HourlyRateApplied")
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *
            `,
            [
                referenceNumber,
                applicationId,
                moduleId,
                periodStartDate,
                periodEndDate,
                totalHoursClaimed,
                totalClaimAmount,
                hourlyRateApplied,
            ]
        );
        return RemunerationClaim.fromDb(rows[0]);
    }

    async findByStudentId(studentId) {
        return this.query(
            `
            SELECT
                c.*,
                m."ModuleCode",
                m."ModuleName"
            FROM "REMUNERATION_CLAIM" c
            JOIN "DEMI_APPLICATION" a ON a."ApplicationID" = c."ApplicationID"
            JOIN "NWU_MODULE" m ON m."ModuleID" = c."ModuleID"
            WHERE a."StudentID" = $1
            ORDER BY c."SubmissionDate" DESC
            `,
            [studentId]
        );
    }
}

export default RemunerationClaimRepository;