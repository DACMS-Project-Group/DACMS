import pool from '../config/db.js';

class ModuleRepository {
    static async getModules() {
        const sql = `
            SELECT
                "ModuleID" AS module_id,
                "ModuleCode" AS module_code,
                "ModuleName" AS module_name,
                "Description" AS description
            FROM "NWU_MODULE"
            ORDER BY "ModuleCode" ASC
        `;
        const { rows } = await pool.query(sql);
        return {
            modules: rows.map((row) => ({
                module_id: row.module_id,
                module_code: row.module_code,
                module_name: row.module_name,
                description: row.description
            }))
        };
    }

    static async getModulesByLecturer(lecturer_id) {
        const sql = `
            SELECT
                m."ModuleID" AS module_id,
                m."ModuleCode" AS module_code,
                m."ModuleName" AS module_name,
                m."Description" AS description
            FROM "NWU_MODULE" m
            JOIN "LECTURER_MODULE" lm
                ON m."ModuleID" = lm."ModuleID"
            WHERE lm."LecturerID" = $1
            ORDER BY m."ModuleCode" ASC
        `;
        const { rows } = await pool.query(sql, [lecturer_id]);
        return {
            modules: rows.map((row) => ({
                module_id: row.module_id,
                module_code: row.module_code,
                module_name: row.module_name,
                description: row.description
            }))
        };
    }

    static async getModuleById(moduleId) {
        const sql = `
            SELECT
                "ModuleID" AS module_id,
                "ModuleCode" AS module_code,
                "ModuleName" AS module_name,
                "Description" AS description,
                "MinAcademicRequirement" AS min_academic_requirement
            FROM "NWU_MODULE"
            WHERE "ModuleID" = $1
        `;
        const { rows } = await pool.query(sql, [moduleId]);
        return rows[0] || null;
    }
}

export default ModuleRepository;