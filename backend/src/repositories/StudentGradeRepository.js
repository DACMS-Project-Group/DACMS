import BaseRepository from './BaseRepository.js';
import StudentModuleGrade from '../models/StudentModuleGrade.js';

class StudentGradeRepository extends BaseRepository {
    constructor() {
        super('"STUDENT_MODULE_GRADE"', StudentModuleGrade);
    }

    /**
     * Retrieve all modules with grade achieved for a specific student.
     * Includes module code, name, and minimum academic requirements.
     */
    async getGradesByStudentId(studentId) {
        const rows = await this.query(
            `
            SELECT
                g."GradeID" AS grade_id,
                g."StudentID" AS student_id,
                g."ModuleID" AS module_id,
                g."GradeAchieved" AS grade_achieved,
                m."ModuleCode" AS module_code,
                m."ModuleName" AS module_name,
                m."MinAcademicRequirement" AS min_academic_requirement
            FROM "STUDENT_MODULE_GRADE" g
            JOIN "NWU_MODULE" m ON m."ModuleID" = g."ModuleID"
            WHERE g."StudentID" = $1
            ORDER BY m."ModuleCode" ASC
            `,
            [studentId]
        );
        return rows;
    }

    /**
     * Find a student's grade record for a specific module.
     */
    async findByStudentAndModule(studentId, moduleId) {
        const rows = await this.query(
            `
            SELECT
                "GradeID" AS grade_id,
                "StudentID" AS student_id,
                "ModuleID" AS module_id,
                "GradeAchieved" AS grade_achieved
            FROM "STUDENT_MODULE_GRADE"
            WHERE "StudentID" = $1 AND "ModuleID" = $2
            `,
            [studentId, moduleId]
        );
        return rows[0] || null;
    }

    /**
     * Find a single grade entry by its GradeID and verify student ownership.
     */
    async findByIdAndStudent(gradeId, studentId) {
        const rows = await this.query(
            `
            SELECT
                "GradeID" AS grade_id,
                "StudentID" AS student_id,
                "ModuleID" AS module_id,
                "GradeAchieved" AS grade_achieved
            FROM "STUDENT_MODULE_GRADE"
            WHERE "GradeID" = $1 AND "StudentID" = $2
            `,
            [gradeId, studentId]
        );
        return rows[0] || null;
    }

    // Insert or update a grade for a student and module.
    async upsertGrade(studentId, moduleId, gradeAchieved) {
        const existing = await this.findByStudentAndModule(studentId, moduleId);

        if (existing) {
            const rows = await this.query(
                `
                UPDATE "STUDENT_MODULE_GRADE"
                SET "GradeAchieved" = $1
                WHERE "GradeID" = $2
                RETURNING
                    "GradeID" AS grade_id,
                    "StudentID" AS student_id,
                    "ModuleID" AS module_id,
                    "GradeAchieved" AS grade_achieved
                `,
                [gradeAchieved, existing.grade_id]
            );
            return rows[0];
        }

        const rows = await this.query(
            `
            INSERT INTO "STUDENT_MODULE_GRADE" ("StudentID", "ModuleID", "GradeAchieved")
            VALUES ($1, $2, $3)
            RETURNING
                "GradeID" AS grade_id,
                "StudentID" AS student_id,
                "ModuleID" AS module_id,
                "GradeAchieved" AS grade_achieved
            `,
            [studentId, moduleId, gradeAchieved]
        );
        return rows[0];
    }

    // Delete a student's module grade record.
    async deleteGrade(gradeId, studentId) {
        const rows = await this.query(
            `
            DELETE FROM "STUDENT_MODULE_GRADE"
            WHERE "GradeID" = $1 AND "StudentID" = $2
            RETURNING "GradeID" AS grade_id
            `,
            [gradeId, studentId]
        );
        return rows[0] || null;
    }
}

export default StudentGradeRepository;
