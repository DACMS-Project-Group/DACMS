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
            WHERE b."AcademicYear" = EXTRACT(YEAR FROM CURRENT_DATE)
            ORDER BY m."ModuleCode";
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
}

export default AdminRepository;