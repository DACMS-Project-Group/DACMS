import pool from '../config/db.js';

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
        return result.rows;
    }

    static async getPendingAppointments() {
        const query = `
            SELECT *
            FROM "DEMI_APPLICATION"
            WHERE "ApplicationStatus" = 'Pending'
            ORDER BY "DateSubmitted" DESC;
        `;

        const result = await pool.query(query);
        return result.rows;
    }
}

export default AdminRepository;