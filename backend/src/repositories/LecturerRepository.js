import pool from '../config/db.js';
const BUDGET_WARNING = 0.8;

class LecturerRepository {

    static async getDashboardMetrics(lecturerId) {
        const query = `
            SELECT
                (
                    SELECT COUNT(*)
                    FROM "DEMI_APPLICATION" da
                    JOIN "DEMI_LISTING" dl
                        ON dl."ListingID" = da."ListingID"
                    WHERE dl."LecturerID" = $1
                ) AS total_applicants,

                (
                    SELECT COUNT(*)
                    FROM "DEMI_APPLICATION" da
                    JOIN "DEMI_LISTING" dl
                        ON dl."ListingID" = da."ListingID"
                    WHERE dl."LecturerID" = $1
                    AND da."ApplicationStatus" = 'Approved'
                ) AS approved_demis,

                (
                    SELECT COUNT(*)
                    FROM "DEMI_APPLICATION" da
                    JOIN "DEMI_LISTING" dl
                        ON dl."ListingID" = da."ListingID"
                    WHERE dl."LecturerID" = $1
                    AND da."ApplicationStatus" = 'Pending'
                ) AS pending_applications,

                (
                    SELECT COALESCE(SUM(mb."MaxAllowableWorkHours"), 0)
                    FROM "MODULE_BUDGET" mb
                    WHERE mb."LecturerID" = $1
                ) AS hours_allocated;
        `;

        const result = await pool.query(query, [lecturerId]);
        const row = result.rows[0] || {};

        return {
            total_applicants: Number(row.total_applicants ?? 0),
            approved_demis: Number(row.approved_demis ?? 0),
            pending_applications: Number(row.pending_applications ?? 0),
            hours_allocated: Number(row.hours_allocated ?? 0)
        };
    }

    static async getBudgetsMetrics(lecturerId) {
        const query = `
            SELECT
                COALESCE(SUM("AllocatedBudget"), 0) AS total_allocated,
                COALESCE(SUM("CurrentBudgetUsage"), 0) AS total_used,
                COALESCE(
                    SUM("AllocatedBudget" - "CurrentBudgetUsage"),
                    0
                ) AS total_remaining,
                COUNT(*) FILTER (
                    WHERE "CurrentBudgetUsage" >= "AllocatedBudget" * $2
                ) AS count_near_limit
            FROM "MODULE_BUDGET"
            WHERE "LecturerID" = $1
            AND "AcademicYear" = EXTRACT(YEAR FROM CURRENT_DATE);
        `;

        const result = await pool.query(
            query,
            [lecturerId, BUDGET_WARNING]
        );

        const row = result.rows[0] || {};

        return {
            total_allocated: Number(row.total_allocated ?? 0),
            total_used: Number(row.total_used ?? 0),
            total_remaining: Number(row.total_remaining ?? 0),
            count_near_limit: Number(row.count_near_limit ?? 0)
        };
    }

    static async getBudgetsSummary(lecturerId) {
        const query = `
            SELECT
                b."BudgetID",
                m."ModuleCode",
                m."Description",
                b."AllocatedBudget",
                b."CurrentBudgetUsage",
                b."MaxAllowableWorkHours",
                b."AcademicYear",
                (b."AllocatedBudget" - b."CurrentBudgetUsage")
                    AS "RemainingBudget"
            FROM "MODULE_BUDGET" b
            JOIN "NWU_MODULE" m
                ON m."ModuleID" = b."ModuleID"
            WHERE b."LecturerID" = $1
            AND b."AcademicYear" = EXTRACT(YEAR FROM CURRENT_DATE)
            ORDER BY m."ModuleCode";
        `;

        const result = await pool.query(query, [lecturerId]);

        return result.rows.map((row) => ({
            budget_id: row.BudgetID,
            module_code: row.ModuleCode,
            module_description: row.Description,
            allocated_budget: Number(row.AllocatedBudget ?? 0),
            current_budget_usage: Number(row.CurrentBudgetUsage ?? 0),
            remaining_budget: Number(row.RemainingBudget ?? 0),
            max_allowable_work_hours:
                Number(row.MaxAllowableWorkHours ?? 0),
            academic_year: Number(row.AcademicYear)
        }));
    }

    static async getBudgetById(lecturerId, budgetId) {
        const query = `
            SELECT
                b."BudgetID",
                b."LecturerID",
                m."ModuleCode",
                m."ModuleName",
                m."Description",
                b."AllocatedBudget",
                b."CurrentBudgetUsage",
                b."MaxAllowableWorkHours",
                b."AcademicYear",
                (b."AllocatedBudget" - b."CurrentBudgetUsage")
                    AS "RemainingBudget"
            FROM "MODULE_BUDGET" b
            JOIN "NWU_MODULE" m
                ON m."ModuleID" = b."ModuleID"
            WHERE b."BudgetID" = $1
            AND b."LecturerID" = $2;
        `;

        const result = await pool.query(
            query,
            [budgetId, lecturerId]
        );

        if (result.rows.length === 0) {
            return null;
        }

        const row = result.rows[0];

        return {
            budget_id: row.BudgetID,
            lecturer_id: row.LecturerID,
            module_code: row.ModuleCode,
            module_name: row.ModuleName,
            module_description: row.Description,
            allocated_budget: Number(row.AllocatedBudget ?? 0),
            current_budget_usage: Number(row.CurrentBudgetUsage ?? 0),
            remaining_budget: Number(row.RemainingBudget ?? 0),
            max_allowable_work_hours:
                Number(row.MaxAllowableWorkHours ?? 0),
            academic_year: Number(row.AcademicYear)
        };
    }

    static async getClaimsMetrics(lecturerId) {
        const query = `
            SELECT
                COUNT(*) AS total_claims,
                COUNT(*) FILTER (
                    WHERE c."ClaimStatus" = 'Pending'
                ) AS total_pending,
                COUNT(*) FILTER (
                    WHERE c."ClaimStatus" = 'Under Review'
                ) AS total_under_review,
                COUNT(*) FILTER (
                    WHERE c."ClaimStatus" = 'Verified'
                ) AS total_verified
            FROM "REMUNERATION_CLAIM" c
            JOIN "DEMI_APPLICATION" da
                ON da."ApplicationID" = c."ApplicationID"
            JOIN "DEMI_LISTING" dl
                ON dl."ListingID" = da."ListingID"
            WHERE dl."LecturerID" = $1;
        `;

        const result = await pool.query(query, [lecturerId]);
        const row = result.rows[0] || {};

        return {
            total_claims: Number(row.total_claims ?? 0),
            total_pending: Number(row.total_pending ?? 0),
            total_under_review: Number(row.total_under_review ?? 0),
            total_verified: Number(row.total_verified ?? 0)
        };
    }

    static async getClaims(lecturerId) {
        const query = `
            SELECT
                c."ClaimID",
                c."ClaimReferenceNumber",
                c."TotalHoursClaimed",
                c."TotalClaimAmount",
                c."ClaimStatus",
                c."SubmissionDate",
                m."ModuleCode",
                CONCAT(
                    au."Title", ' ',
                    au."FName", ' ',
                    au."LName"
                ) AS student_name
            FROM "REMUNERATION_CLAIM" c
            JOIN "NWU_MODULE" m
                ON m."ModuleID" = c."ModuleID"
            JOIN "DEMI_APPLICATION" da
                ON da."ApplicationID" = c."ApplicationID"
            JOIN "DEMI_LISTING" dl
                ON dl."ListingID" = da."ListingID"
            JOIN "STUDENT" s
                ON s."StudentID" = da."StudentID"
            JOIN "APP_USER" au
                ON au."UserID" = s."StudentID"
            WHERE dl."LecturerID" = $1
            ORDER BY c."SubmissionDate" DESC;
        `;

        const result = await pool.query(query, [lecturerId]);

        return result.rows.map((row) => ({
            claim_id: row.ClaimID,
            reference_number: row.ClaimReferenceNumber,
            total_hours_claimed:
                Number(row.TotalHoursClaimed ?? 0),
            total_claim_amount:
                Number(row.TotalClaimAmount ?? 0),
            claim_status: row.ClaimStatus,
            submission_date: row.SubmissionDate,
            module_code: row.ModuleCode,
            student_name: row.student_name
        }));
    }

    static async getClaimById(lecturerId, claimId) {
        const claimQuery = `
            SELECT
                c."ClaimID",
                c."ClaimReferenceNumber" AS "reference",
                c."SubmissionDate" AS "submittedDate",
                c."ClaimStatus" AS "status",
                c."PeriodStartDate" AS "periodStartDate",
                c."PeriodEndDate" AS "periodEndDate",
                c."TotalHoursClaimed" AS "hours",
                c."HourlyRateApplied" AS "hourlyRate",
                c."TotalClaimAmount" AS "amount",
                s."StudentNumber" AS "studentNumber",
                CONCAT(COALESCE(au."Title", ''), ' ', COALESCE(au."FName", ''), ' ', COALESCE(au."LName", '')) AS "studentName",
                m."ModuleCode" AS "moduleCode",
                m."ModuleName" AS "moduleName",
                CONCAT(COALESCE(lect_au."Title", ''), ' ', COALESCE(lect_au."FName", ''), ' ', COALESCE(lect_au."LName", '')) AS "lecturer",
                s."BankName" AS "bank",
                s."AccountNumber" AS "accountNumber",
                s."BranchCode" AS "branchCode",
                da."ApplicationID"
            FROM "REMUNERATION_CLAIM" c
            JOIN "DEMI_APPLICATION" da
                ON da."ApplicationID" = c."ApplicationID"
            JOIN "STUDENT" s
                ON s."StudentID" = da."StudentID"
            JOIN "APP_USER" au
                ON au."UserID" = s."StudentID"
            JOIN "NWU_MODULE" m
                ON m."ModuleID" = c."ModuleID"
            JOIN "DEMI_LISTING" dl
                ON dl."ListingID" = da."ListingID"
            JOIN "LECTURER" lect
                ON lect."LecturerID" = dl."LecturerID"
            JOIN "APP_USER" lect_au
                ON lect_au."UserID" = lect."LecturerID"
            WHERE c."ClaimID" = $1
                AND dl."LecturerID" = $2;
        `;

        const claimResult = await pool.query(
            claimQuery,
            [claimId, lecturerId]
        );

        if (claimResult.rows.length === 0) {
            return null;
        }

        const claimRow = claimResult.rows[0];

        const sessionsQuery = `
            SELECT
                ws."SessionID" AS "id",
                ws."StartTime" AS "date",
                'Work session' AS "activity",
                TO_CHAR(
                    ws."StartTime" AT TIME ZONE 'Africa/Johannesburg',
                    'HH24:MI'
                ) AS "startTime",

                TO_CHAR(
                    ws."EndTime" AT TIME ZONE 'Africa/Johannesburg',
                    'HH24:MI'
                ) AS "endTime",
                ROUND(
                    COALESCE(
                        ws."TotalHoursWorked",
                        EXTRACT(EPOCH FROM (ws."EndTime" - ws."StartTime")) / 3600.0
                    ),
                    2
                ) AS "hours",
                CASE
                    WHEN ws."LecturerApproval" = true THEN 'Verified'
                    ELSE 'Pending'
                END AS "status"
            FROM "WORK_SESSION" ws
            JOIN "DEMI_POSITION" p
                ON p."PositionID" = ws."PositionID"
            WHERE p."ApplicationID" = $1
                AND ws."StartTime" >= $2::date
                AND ws."EndTime" IS NOT NULL
                AND ws."EndTime" < ($3::date + INTERVAL '1 day')
            ORDER BY ws."StartTime" ASC;
        `;

        const sessionsResult = await pool.query(sessionsQuery, [
            claimRow.ApplicationID,
            claimRow.periodStartDate,
            claimRow.periodEndDate
        ]);

        const formatDisplayDate = (value) => {
            if (!value) return '';
            return new Date(value).toLocaleDateString('en-ZA', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
            });
        };

        const period = claimRow.periodStartDate && claimRow.periodEndDate
            ? `${formatDisplayDate(claimRow.periodStartDate)} - ${formatDisplayDate(claimRow.periodEndDate)}`
            : '';

        return {
            id: claimRow.ClaimID,
            reference: claimRow.reference,
            studentNumber: claimRow.studentNumber,
            studentName: claimRow.studentName,
            moduleCode: claimRow.moduleCode,
            moduleName: claimRow.moduleName,
            lecturer: claimRow.lecturer,
            period,
            submittedDate: formatDisplayDate(claimRow.submittedDate),
            hours: Number(claimRow.hours ?? 0),
            hourlyRate: Number(claimRow.hourlyRate ?? 0),
            amount: Number(claimRow.amount ?? 0),
            status: claimRow.status,
            banking: {
                bank: claimRow.bank || 'Not provided',
                accountHolder: claimRow.studentName,
                accountNumber: claimRow.accountNumber
                    ? `**** **** ${String(claimRow.accountNumber).slice(-4)}`
                    : 'Not provided',
                accountType: 'Bank account',
                status: 'Verified'
            },
            sessions: sessionsResult.rows.map((session) => ({
                id: session.id,
                date: session.date ? new Date(session.date).toISOString().slice(0, 10) : null,
                activity: session.activity,
                startTime: session.startTime,
                endTime: session.endTime,
                hours: Number(session.hours ?? 0),
                status: session.status
            }))
        };
    }

    static async reviewClaim(lecturerId, claimId, status) {
        const query = `
            UPDATE "REMUNERATION_CLAIM" c
            SET "ClaimStatus" = $3
            FROM "DEMI_APPLICATION" da
            JOIN "DEMI_LISTING" dl
                ON dl."ListingID" = da."ListingID"
            WHERE c."ApplicationID" = da."ApplicationID"
            AND c."ClaimID" = $1
            AND dl."LecturerID" = $2
            RETURNING
                c."ClaimID",
                c."ClaimReferenceNumber",
                c."ClaimStatus",
                c."SubmissionDate";
        `;

        const result = await pool.query(
            query,
            [claimId, lecturerId, status]
        );

        return result.rows[0] || null;
    }

}

export default LecturerRepository;