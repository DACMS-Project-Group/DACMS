import pool from '../config/db.js';

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
}

export default LecturerRepository;