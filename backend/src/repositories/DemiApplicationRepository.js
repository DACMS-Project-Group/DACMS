import BaseRepository from './BaseRepository.js';
import DemiApplication from '../models/DemiApplication.js';

class DemiApplicationRepository extends BaseRepository {
    constructor() {
        super('"DEMI_APPLICATION"', DemiApplication);
    }

    /** Lecturer access to applications */
    async lecturerFetchApplications(lecturerId) {
        const rows = await this.query(
            `
            SELECT 
                a."ApplicationID",
                CONCAT(u."FName", ' ', u."LName") AS "Student",
                s."StudentNumber",
                m."ModuleCode",
                a."DateSubmitted"::DATE,
                a."ApplicationStatus"
            FROM "DEMI_LISTING" l
            JOIN "DEMI_APPLICATION" a ON a."ListingID" = l."ListingID"
            JOIN "STUDENT" s ON s."StudentID" = a."StudentID"
            JOIN "APP_USER" u ON u."UserID" = s."StudentID"
            JOIN "NWU_MODULE" m ON m."ModuleID" = l."ModuleID"
            WHERE l."LecturerID" = $1
            ORDER BY a."DateSubmitted" DESC
            `
            , [lecturerId]
        )

        if(rows.length == 0)
            return { output: "No applications found" };

        return { output: rows.length, rows };
    }

    async lecturerFindApplicationById(applicationId) {
        return await this.query(
            `
            SELECT *
            FROM "DEMI_APPLICATION"
            WHERE "ApplicationID" = $1
            `
            , [applicationId]
        )
    }

    async getStudentIdFromApplication(applicationId) {
        const studentId =  await this.query(
            `
            SELECT "StudentID"
            FROM "DEMI_APPLICATION"
            WHERE "ApplicationID" = $1
            `
            , [applicationId]
        )

        return studentId[0].StudentID;
    }

    /** Lecturer reviews assistant application */

    async lecturerReviewApplication(applicationId, lecturerDecision) {
        return await this.query(
            `
            UPDATE "DEMI_APPLICATION"
            SET "ApplicationStatus" = $1
            WHERE "ApplicationID" = $2
            `
            , [lecturerDecision, applicationId]
        )
    }

    /** All applications submitted by a student, with listing/module context. */
    async findByStudentId(studentId) {
        const sql = `
            SELECT
                a.*,
                l."ModuleID",
                l."Deadline",
                l."MinimumGrade",
                m."ModuleCode",
                m."ModuleName"
            FROM "DEMI_APPLICATION" a
            JOIN "DEMI_LISTING" l ON l."ListingID" = a."ListingID"
            JOIN "NWU_MODULE" m ON m."ModuleID" = l."ModuleID"
            WHERE a."StudentID" = $1
            ORDER BY a."DateSubmitted" DESC
        `;
        return this.query(sql, [studentId]);
    }

    async findById(applicationId) {
        const rows = await this.query(
            `SELECT * FROM "DEMI_APPLICATION" WHERE "ApplicationID" = $1`,
            [applicationId]
        );
        return rows[0] ? DemiApplication.fromDb(rows[0]) : null;
    }

    /** Fetches a single listing by ID, or null if it doesn't exist. */
    async findListingById(listingId) {
        const rows = await this.query(
            `SELECT "ListingID", "ModuleID", "LecturerID", "Deadline", "MinimumGrade" FROM "DEMI_LISTING" WHERE "ListingID" = $1`,
            [listingId]
        );
        return rows[0] || null;
    }

    /** Prevents a student from applying to the same listing twice. */
    async findExisting(studentId, listingId) {
        const rows = await this.query(
            `SELECT * FROM "DEMI_APPLICATION" WHERE "StudentID" = $1 AND "ListingID" = $2`,
            [studentId, listingId]
        );
        return rows[0] ? DemiApplication.fromDb(rows[0]) : null;
    }

    /** Currently open listings a student could apply to (deadline not passed). */
      async findOpenListings(studentId) {
         return this.query(`
             SELECT
               l."ListingID",
               l."ModuleID",
               l."LecturerID",
               l."Deadline",
               l."MinimumGrade",
               m."ModuleCode",
               m."ModuleName",
               g."GradeAchieved"
            FROM "DEMI_LISTING" l
            JOIN "NWU_MODULE" m
                ON m."ModuleID" = l."ModuleID"
            JOIN "STUDENT_MODULE_GRADE" g
                ON g."ModuleID" = l."ModuleID"
                AND g."StudentID" = $1
            WHERE l."Deadline" > NOW()
                AND g."GradeAchieved" >= l."MinimumGrade"
            ORDER BY l."Deadline" ASC
            `, [studentId]);
    }

    /**
     * Checks a student's grade for the listing's module against the
     * listing's minimum grade requirement. Returns 'Eligible',
     * 'Ineligible', or 'Unverified' (no grade on record for that module).
     */
    async checkEligibility(studentId, listingId) {
        const rows = await this.query(
            `
            SELECT g."GradeAchieved", l."MinimumGrade"
            FROM "DEMI_LISTING" l
            LEFT JOIN "STUDENT_MODULE_GRADE" g
                ON g."ModuleID" = l."ModuleID" AND g."StudentID" = $1
            WHERE l."ListingID" = $2
            `,
            [studentId, listingId]
        );

        if (!rows.length || rows[0].GradeAchieved == null) {
            return 'Unverified';
        }

        return Number(rows[0].GradeAchieved) >= Number(rows[0].MinimumGrade)
            ? 'Eligible'
            : 'Ineligible';
    }

    async create({ studentId, listingId, verificationEligibilityStatus }) {
        const rows = await this.query(
            `
            INSERT INTO "DEMI_APPLICATION"
                ("StudentID", "ListingID", "VerificationEligibilityStatus")
            VALUES ($1, $2, $3)
            RETURNING *
            `,
            [studentId, listingId, verificationEligibilityStatus]
        );
        return DemiApplication.fromDb(rows[0]);
    }

    async addSupportingDocument({ studentId, documentType, filePath }) {
        const rows = await this.query(
            `
            INSERT INTO "SUPPORTING_DOCUMENT" ("StudentID", "DocumentType", "FilePath")
            VALUES ($1, $2, $3)
            RETURNING *
            `,
            [studentId, documentType, filePath]
        );
        return rows[0];
    }

    async findDocumentsByStudentId(studentId) {
        return this.query(
            `SELECT * FROM "SUPPORTING_DOCUMENT" WHERE "StudentID" = $1 ORDER BY "UploadTimestamp" DESC`,
            [studentId]
        );
    }
}

export default DemiApplicationRepository;