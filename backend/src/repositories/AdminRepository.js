import pool from '../config/db.js';

const BUDGET_WARNING = 0.8;

class AdminRepository {
    static async getDashboardMetrics() {
        const query = `
            SELECT
                (SELECT COUNT(*) FROM "NWU_MODULE") AS total_modules,
                (SELECT COUNT(*) FROM "LECTURER") AS total_lecturers,
                (
                    SELECT COUNT(*) FROM "DEMI_POSITION"
                    WHERE "StartDate" <= CURRENT_DATE AND "TerminationDate" >= CURRENT_DATE
                ) AS total_demis,
                (SELECT COUNT(*) FROM "DEMI_APPLICATION" WHERE "ApplicationStatus" = 'Approved') AS total_pending_approvals,
                (SELECT COUNT(*) FROM "REMUNERATION_CLAIM" WHERE "ClaimStatus" = 'Pending') AS total_pending_claims;
        `;

        const result = await pool.query(query);
        const row = result.rows[0] || {};

        return {
            total_modules: Number(row.total_modules ?? 0),
            total_lecturers: Number(row.total_lecturers ?? 0),
            total_demis: Number(row.total_demis ?? 0),
            total_pending_approvals: Number(row.total_pending_approvals ?? 0),
            total_pending_claims: Number(row.total_pending_claims ?? 0),
        };
    }

    static async getMonthlyWorkSessions() {
        const query = `
            SELECT
                TO_CHAR("StartTime", 'YYYY-MM') AS month,
                COUNT(*) AS total_sessions
            FROM "WORK_SESSION"
            WHERE "StartTime" >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '11 months'
            GROUP BY TO_CHAR("StartTime", 'YYYY-MM')
            ORDER BY month;
        `;

        const result = await pool.query(query);

        return result.rows.map((row) => ({
            month: row.month || null,
            total_sessions: Number(row.total_sessions ?? 0),
        }));
    }

    static async getPendingAppointments() {
        const query = `
            SELECT
                da."ApplicationID" AS application_id,
                da."ApplicationStatus" AS status,
                da."DateSubmitted" AS date_submitted,
                nm."ModuleCode" AS module,
                CONCAT(au_lect."Title", ' ', au_lect."FName", ' ', au_lect."LName") AS lecturer,
                CONCAT(au_stud."Title", ' ', au_stud."FName", ' ', au_stud."LName") AS student
            FROM "DEMI_APPLICATION" da
            JOIN "DEMI_LISTING" dl
                ON dl."ListingID" = da."ListingID"
            JOIN "NWU_MODULE" nm
                ON nm."ModuleID" = dl."ModuleID"
            JOIN "STUDENT" st
                ON st."StudentID" = da."StudentID"
            JOIN "APP_USER" au_stud
                ON au_stud."UserID" = st."StudentID"
            JOIN "LECTURER" lect
                ON lect."LecturerID" = dl."LecturerID"
            JOIN "APP_USER" au_lect
                ON au_lect."UserID" = lect."LecturerID"
            WHERE da."ApplicationStatus" = 'Pending'
            ORDER BY da."DateSubmitted" DESC;
        `;

        const result = await pool.query(query);

        return result.rows.map((row) => ({
            application_id: row.application_id,
            status: row.status,
            date_submitted: row.date_submitted,
            module: row.module,
            lecturer: row.lecturer,
            student: row.student,
        }));
    }

    static async getBudgetsMetrics() {
        const query = `
            SELECT
                COALESCE(SUM("AllocatedBudget"), 0) AS total_allocated,
                COALESCE(SUM("CurrentBudgetUsage"), 0) AS total_used,
                COALESCE(SUM("AllocatedBudget" - "CurrentBudgetUsage"), 0) AS total_remaining,
                COUNT(*) FILTER (
                    WHERE "CurrentBudgetUsage" >= "AllocatedBudget" * $1
                ) AS count_near_limit
            FROM "MODULE_BUDGET"
            WHERE "AcademicYear" = EXTRACT(YEAR FROM CURRENT_DATE);`;
        const result = await pool.query(query, [BUDGET_WARNING]);
        const row = result.rows[0] || {};

        return {
            total_allocated: Number(row.total_allocated ?? 0),
            total_used: Number(row.total_used ?? 0),
            total_remaining: Number(row.total_remaining ?? 0),
            count_near_limit: Number(row.count_near_limit ?? 0)
        }
    }

    static async getBudgetsSummary() {
        const query = `
            SELECT
                b."BudgetID",
                m."ModuleCode",
                m."Description",
                b."AllocatedBudget",
                b."CurrentBudgetUsage",
                (b."AllocatedBudget" - b."CurrentBudgetUsage") AS "RemainingBudget"
            FROM "MODULE_BUDGET" b
            JOIN "NWU_MODULE" m
                ON m."ModuleID" = b."ModuleID"
            WHERE b."AcademicYear" = EXTRACT(YEAR FROM CURRENT_DATE);
        `;

        const result = await pool.query(query);

        return result.rows.map((row) => ({
            budget_id: row.BudgetID,
            module_code: row.ModuleCode,
            module_description: row.Description,
            allocated_budget: Number(row.AllocatedBudget ?? 0),
            current_budget_usage: Number(row.CurrentBudgetUsage ?? 0),
            remaining_budget: Number(row.RemainingBudget ?? 0),
        }));
    }

    static async getBudgetById(budget_id) {
        const query = `
            SELECT
                b."BudgetID",
                l."LecturerID",
                u."Title", u."FName", u."LName", u."Email",
                m."ModuleCode", m."Description",
                b."AllocatedBudget", b."CurrentBudgetUsage",
                (b."AllocatedBudget" - b."CurrentBudgetUsage") AS "RemainingBudget"
            FROM "MODULE_BUDGET" b
            JOIN "NWU_MODULE" m
                ON m."ModuleID" = b."ModuleID"
            JOIN "LECTURER" l
                ON l."LecturerID" = b."LecturerID"
            JOIN "APP_USER" u
                ON u."UserID" = l."LecturerID"
            WHERE b."BudgetID" = $1
            ORDER BY m."ModuleCode";
        `;

        const result = await pool.query(query, [budget_id]);

        return result.rows.map((row) => ({
            budget_id: row.BudgetID,
            lecturer_id: row.LecturerID,
            lecturer: `${row.Title} ${row.FName} ${row.LName} - ${row.Email}`,
            lecturer_email: row.Email,
            module_code: row.ModuleCode,
            module_description: row.Description,
            allocated_budget: Number(row.AllocatedBudget ?? 0),
            current_budget_usage: Number(row.CurrentBudgetUsage ?? 0),
            remaining_budget: Number(row.RemainingBudget ?? 0),
        }));
    }

    static async editBudget(budget_id, updateData) {
        const fields = [];
        const values = [];
        let index = 1;

        if (updateData.module_id !== undefined) {
            fields.push(`"ModuleID" = $${index++}`);
            values.push(updateData.module_id);
        }
        if (updateData.lecturer_id !== undefined) {
            fields.push(`"LecturerID" = $${index++}`);
            values.push(updateData.lecturer_id);
        }
        if (updateData.allocated_budget !== undefined) {
            fields.push(`"AllocatedBudget" = $${index++}`);
            values.push(updateData.allocated_budget);
        }
        if (updateData.current_budget_usage !== undefined) {
            fields.push(`"CurrentBudgetUsage" = $${index++}`);
            values.push(updateData.current_budget_usage);
        }
        if (updateData.max_allowable_work_hours !== undefined) {
            fields.push(`"MaxAllowableWorkHours" = $${index++}`);
            values.push(updateData.max_allowable_work_hours);
        }
        if (updateData.academic_year !== undefined) {
            fields.push(`"AcademicYear" = $${index++}`);
            values.push(updateData.academic_year);
        }

        if (fields.length === 0) {
            throw new Error("No fields provided to update");
        }

        values.push(budget_id);
        const query = `
            UPDATE "MODULE_BUDGET"
            SET ${fields.join(', ')}
            WHERE "BudgetID" = $${index}
            RETURNING *;
        `;
        
        const result = await pool.query(query, values);
        if (result.rows.length === 0) {
            throw new Error("Budget not found");
        }
        return result.rows[0];
    }

    static async createBudget(Budget) {
        const query = `
            INSERT INTO "MODULE_BUDGET" (
                "ModuleID",
                "LecturerID",
                "AllocatedBudget",
                "CurrentBudgetUsage",
                "MaxAllowableWorkHours",
                "AcademicYear"
            ) VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING "BudgetID";
        `;
        const values = [
            Budget.module_id,
            Budget.lecturer_id,
            Budget.allocated_budget,
            Budget.current_budget_usage,
            Budget.max_allowable_work_hours,
            Budget.academic_year
        ];
        const result = await pool.query(query, values);
        return result.rows[0].BudgetID;
    }

    static async getClaimsMetrics() {
        const query = `
            SELECT
                (SELECT COUNT(*) FROM "REMUNERATION_CLAIM") AS total_claims,
                (SELECT COUNT(*) FROM "REMUNERATION_CLAIM" WHERE "ClaimStatus" = 'Pending') AS total_pending,
                (SELECT COUNT(*) FROM "REMUNERATION_CLAIM" WHERE "ClaimStatus" = 'Under Review') AS total_under_review,
                (SELECT COUNT(*) FROM "REMUNERATION_CLAIM" WHERE "ClaimStatus" = 'Verified') AS total_verified
        `;
        const result = await pool.query(query);
        const row = result.rows[0] || {};
        return {
            total_claims: Number(row.total_claims ?? 0),
            total_pending: Number(row.total_pending ?? 0),
            total_under_review: Number(row.total_under_review ?? 0),
            total_verified: Number(row.total_verified ?? 0)
        };
    }

    static async getClaims() {
        const query = `
            SELECT
                c."ClaimID",
                c."ClaimReferenceNumber",
                c."TotalHoursClaimed",
                c."TotalClaimAmount",
                c."ClaimStatus",
                c."SubmissionDate",
                m."ModuleCode",
                CONCAT(au."Title", ' ', au."FName", ' ', au."LName") AS student_name
            FROM "REMUNERATION_CLAIM" c
            JOIN "NWU_MODULE" m ON m."ModuleID" = c."ModuleID"
            JOIN "DEMI_APPLICATION" da ON da."ApplicationID" = c."ApplicationID"
            JOIN "STUDENT" s ON s."StudentID" = da."StudentID"
            JOIN "APP_USER" au ON au."UserID" = s."StudentID"
            ORDER BY c."SubmissionDate" DESC;
        `;
        const result = await pool.query(query);
        return result.rows.map(row => ({
            claim_id: row.ClaimID,
            reference_number: row.ClaimReferenceNumber,
            total_hours_claimed: Number(row.TotalHoursClaimed ?? 0),
            total_claim_amount: Number(row.TotalClaimAmount ?? 0),
            claim_status: row.ClaimStatus,
            submission_date: row.SubmissionDate,
            module_code: row.ModuleCode,
            student_name: row.student_name
        }));
    }

    static async getClaimById(claim_id) {
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
            WHERE c."ClaimID" = $1;
        `;

        const claimResult = await pool.query(claimQuery, [claim_id]);

        if (claimResult.rows.length === 0) {
            return null;
        }

        const claimRow = claimResult.rows[0];

        const sessionsQuery = `
            SELECT
                ws."SessionID" AS "id",
                ws."StartTime" AS "date",
                'Work session' AS "activity",
                TO_CHAR(ws."StartTime", 'HH24:MI') AS "startTime",
                TO_CHAR(ws."EndTime", 'HH24:MI') AS "endTime",
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
              AND ws."StartTime" >= $2
              AND ws."EndTime" IS NOT NULL
              AND ws."EndTime" <= $3
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

    static async approveClaim(claim_id) {
        const query = `
            UPDATE "REMUNERATION_CLAIM"
            SET "ClaimStatus" = 'Verified'
            WHERE "ClaimID" = $1
            RETURNING *;
        `;

        const result = await pool.query(query, [claim_id]);

        if (result.rows.length === 0) {
            throw new Error('Claim not found');
        }

        return result.rows[0];
    }

    static async getAppointmentsMetrics() {
        const query = `
            SELECT
                (SELECT COUNT(*) FROM "DEMI_APPLICATION" WHERE "ApplicationStatus" = 'Pending') AS total_pending,
                (SELECT COUNT(*) FROM "DEMI_APPLICATION" WHERE "ApplicationStatus" = 'Approved') AS total_approved,
                (SELECT COUNT(*) FROM "DEMI_APPLICATION" WHERE "ApplicationStatus" = 'Rejected') AS total_rejected,
                (SELECT COUNT(*) FROM "DEMI_APPLICATION" WHERE "ApplicationStatus" = 'Returned') AS total_returned
        `;
        const result = await pool.query(query);
        const row = result.rows[0] || {};
        return {
            total_pending: Number(row.total_pending ?? 0),
            total_approved: Number(row.total_approved ?? 0),
            total_rejected: Number(row.total_rejected ?? 0),
            total_returned: Number(row.total_returned ?? 0)
        };
    }

    static async getPendingAppointmentsDetailed() {
        const query = `
            SELECT
                dp."PositionID" AS position_id,
                da."ApplicationID" AS application_id,
                CONCAT(
                    COALESCE(au_stud."Title", ''), ' ',
                    COALESCE(au_stud."FName", ''), ' ',
                    COALESCE(au_stud."LName", '')
                ) AS student,
                st."StudentNumber" AS student_number,
                nm."ModuleCode" AS module_code,
                CONCAT(
                    COALESCE(au_lect."Title", ''), ' ',
                    COALESCE(au_lect."FName", ''), ' ',
                    COALESCE(au_lect."LName", '')
                ) AS lecturer,
                da."DateSubmitted" AS date_submitted,
                dp."PositionStatus" AS status
            FROM "DEMI_POSITION" dp
            JOIN "DEMI_APPLICATION" da ON da."ApplicationID" = dp."ApplicationID"
            JOIN "DEMI_LISTING" dl ON dl."ListingID" = da."ListingID"
            JOIN "NWU_MODULE" nm ON nm."ModuleID" = dl."ModuleID"
            JOIN "STUDENT" st ON st."StudentID" = da."StudentID"
            JOIN "APP_USER" au_stud ON au_stud."UserID" = st."StudentID"
            JOIN "LECTURER" lect ON lect."LecturerID" = dl."LecturerID"
            JOIN "APP_USER" au_lect ON au_lect."UserID" = lect."LecturerID"
            WHERE dp."PositionStatus" = 'Pending Admin Review'
            ORDER BY da."DateSubmitted" DESC;
        `;

        const result = await pool.query(query);

        return result.rows.map((row) => ({
            position_id: row.position_id,
            application_id: row.application_id,
            reference: `POS-${row.position_id}`,
            student: row.student,
            student_number: row.student_number,
            module_code: row.module_code,
            lecturer: row.lecturer,
            date_submitted: row.date_submitted,
            status: row.status,
        }));
    }

    static async getApprovalHistory() {
        const query = `
            SELECT
                da."ApplicationID" AS application_id,
                CONCAT(
                    COALESCE(au_stud."Title", ''),
                    ' ',
                    COALESCE(au_stud."FName", ''),
                    ' ',
                    COALESCE(au_stud."LName", '')
                ) AS student,
                nm."ModuleCode" AS module,
                CONCAT(
                    COALESCE(au_lect."Title", ''),
                    ' ',
                    COALESCE(au_lect."FName", ''),
                    ' ',
                    COALESCE(au_lect."LName", '')
                ) AS lecturer,
                -- dp."PositionName" AS position,
                da."DateSubmitted" AS date,
                da."ApplicationStatus" AS status
            FROM "DEMI_APPLICATION" da
            JOIN "DEMI_LISTING" dl
                ON dl."ListingID" = da."ListingID"
            JOIN "NWU_MODULE" nm
                ON nm."ModuleID" = dl."ModuleID"
            JOIN "STUDENT" st
                ON st."StudentID" = da."StudentID"
            JOIN "APP_USER" au_stud
                ON au_stud."UserID" = st."StudentID"
            JOIN "LECTURER" lect
                ON lect."LecturerID" = dl."LecturerID"
            JOIN "APP_USER" au_lect
                ON au_lect."UserID" = lect."LecturerID"
            LEFT JOIN "DEMI_POSITION" dp
                ON dp."ApplicationID" = da."ApplicationID"
            WHERE da."ApplicationStatus" IN ('Approved', 'Rejected')
            ORDER BY da."DateSubmitted" DESC;
        `;

        const result = await pool.query(query);

        return result.rows.map((row) => ({
            application_id: row.application_id,
            reference: row.reference || "!! update data model",
            student: row.student,
            module: row.module,
            lecturer: row.lecturer,
            position: row.position || "!! update data model",
            date: row.date,
            status: row.status,
        }));
    }

    static async getPositionById(position_id) {
        const query = `
            SELECT
                dp."PositionID" AS position_id, dp."PositionStatus" AS position_status, dp."AdminComment" AS admin_comment,
                da."ApplicationID" AS application_id, da."ApplicationID" AS reference, da."ApplicationStatus" AS status, da."DateSubmitted" AS submitted_date,
                s."StudentNumber" AS student_number,
                CONCAT(
                    COALESCE(au."Title", ''), CASE WHEN COALESCE(au."Title", '') = '' THEN '' ELSE ' ' END,
                    COALESCE(au."FName", ''), ' ', COALESCE(au."LName", '')
                ) AS student_name,
                au."Email" AS email,
                m."ModuleCode" AS module_code,
                m."ModuleName" AS module_name,
                CONCAT(
                    COALESCE(lect_au."Title", ''), CASE WHEN COALESCE(lect_au."Title", '') = '' THEN '' ELSE ' ' END,
                    COALESCE(lect_au."FName", ''), ' ', COALESCE(lect_au."LName", '')
                ) AS lecturer_name,
                COALESCE(ps."RoleLevel", 'Student Assistant') AS position,
                COALESCE(dp."TotalAllocatedHours", 0) AS hours_limit,
                COALESCE(
                    json_agg(
                        DISTINCT jsonb_build_object(
                            'name', sd."DocumentType",
                            'type', sd."DocumentType",
                            'documentUrl', sd."FilePath"
                        )
                    ) FILTER (WHERE sd."DocumentID" IS NOT NULL),
                    '[]'::json
                ) AS documents,
                COALESCE(
                    json_agg(
                        DISTINCT jsonb_build_object(
                            'id', r."ResponsibilityID",
                            'description', r."Description"
                        )
                    ) FILTER (WHERE r."ResponsibilityID" IS NOT NULL),
                    '[]'::json
                ) AS responsibilities
            FROM "DEMI_APPLICATION" da
            JOIN "DEMI_LISTING" dl ON dl."ListingID" = da."ListingID"
            JOIN "STUDENT" s ON s."StudentID" = da."StudentID"
            JOIN "APP_USER" au ON au."UserID" = s."StudentID"
            JOIN "NWU_MODULE" m ON m."ModuleID" = dl."ModuleID"
            JOIN "LECTURER" lect ON lect."LecturerID" = dl."LecturerID"
            JOIN "APP_USER" lect_au ON lect_au."UserID" = lect."LecturerID"
            LEFT JOIN "DEMI_POSITION" dp ON dp."ApplicationID" = da."ApplicationID"
            LEFT JOIN "PAYMENT_SCALE" ps ON ps."ScaleID" = dp."PaymentScaleID"
            LEFT JOIN "SUPPORTING_DOCUMENT" sd ON sd."StudentID" = da."StudentID"
            LEFT JOIN "RESPONSIBILITY" r ON r."PositionID" = dp."PositionID"
            WHERE dp."PositionID" = $1
            GROUP BY
                da."ApplicationID", da."ApplicationStatus", da."DateSubmitted",
                s."StudentNumber", au."Email", au."Title", au."FName", au."LName",
                m."ModuleCode", m."ModuleName", lect_au."Title", lect_au."FName", lect_au."LName",
                ps."RoleLevel", dp."TotalAllocatedHours", dp."PositionID", dp."PositionStatus", dp."AdminComment";
        `;

        const result = await pool.query(query, [position_id]);
        if (result.rows.length === 0) return null;

        const row = result.rows[0];

        return {
            positionId: row.position_id,
            positionStatus: row.position_status,
            position: row.position || 'Student Assistant',
            application_id: Number(row.id),
            reference: String(row.reference),
            status: row.status,
            submittedDate: row.submitted_date
                ? new Date(row.submitted_date).toLocaleDateString('en-ZA', {
                    day: '2-digit', month: 'long', year: 'numeric',
                })
                : null,
            studentNumber: row.student_number,
            studentName: row.student_name,
            email: row.email,
            moduleCode: row.module_code,
            moduleName: row.module_name,
            lecturer: row.lecturer_name,
            hoursLimit: Number(row.hours_limit ?? 0),
            documents: Array.isArray(row.documents) ? row.documents : [],
            adminComment: row.admin_comment,
            responsibilities: Array.isArray(row.responsibilities) ? row.responsibilities : []
        };
    }
    static async reviewPosition(position_id, action, comment) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            // 1. Update position status and admin comment
            const posQuery = `
                UPDATE "DEMI_POSITION"
                SET "PositionStatus" = $1,
                    "AdminComment" = $2
                WHERE "PositionID" = $3
                RETURNING "PositionID", "ApplicationID";
            `;
            const posRes = await client.query(posQuery, [action, comment || null, position_id]);
            if (posRes.rows.length === 0) throw new Error('Position not found');

            const { ApplicationID } = posRes.rows[0];

            // 2. Sync corresponding application status
            let appStatus = action === 'Approved' ? 'Approved' : (action === 'Rejected' ? 'Rejected' : 'Returned');
            const appQuery = `
                UPDATE "DEMI_APPLICATION"
                SET "ApplicationStatus" = $1
                WHERE "ApplicationID" = $2
                RETURNING "StudentID", "ListingID";
            `;
            const appRes = await client.query(appQuery, [appStatus, ApplicationID]);
            const { StudentID, ListingID } = appRes.rows[0];

            // Fetch LecturerID via Listing
            const listRes = await client.query(`SELECT "LecturerID" FROM "DEMI_LISTING" WHERE "ListingID" = $1`, [ListingID]);
            const lecturerId = listRes.rows[0].LecturerID;

            // 3. Dispatch notifications to Student and Lecturer
            const notifQuery = `
                INSERT INTO "NOTIFICATION" ("RecipientUserID", "NotificationType", "Subject", "Message")
                VALUES ($1, 'Position Review', $2, $3);
            `;
            const message = `Your position request for Application #${ApplicationID} has been ${action.toLowerCase()}. Comment: ${comment || 'None'}`;
            
            await client.query(notifQuery, [StudentID, 'Position Decision', message]);
            await client.query(notifQuery, [lecturerId, 'Position Decision', message]);

            await client.query('COMMIT');
            return { position_id, status: action, comment };
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }
}

export default AdminRepository;