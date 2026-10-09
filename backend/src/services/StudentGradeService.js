import StudentGradeRepository from '../repositories/StudentGradeRepository.js';
import ModuleRepository from '../repositories/ModuleRepository.js';

class StudentGradeService {
    constructor() {
        this.studentGradeRepository = new StudentGradeRepository();
    }

    /**
     * Get all available academic modules for selection.
     */
    async getAvailableModules() {
        const { modules } = await ModuleRepository.getModules();
        return modules;
    }

    /**
     * Get all module grades recorded by a specific student.
     */
    async getGrades(studentId) {
        if (!studentId) {
            throw new Error('Student ID is required.');
        }
        return await this.studentGradeRepository.getGradesByStudentId(studentId);
    }

    /**
     * Save (insert or update) a module mark for a student.
     */
    async saveGrade(studentId, { moduleId, gradeAchieved }) {
        if (!studentId) {
            throw new Error('Student ID is required.');
        }

        const parsedModuleId = parseInt(moduleId, 10);
        if (Number.isNaN(parsedModuleId)) {
            throw new Error('Valid Module ID is required.');
        }

        const parsedGrade = parseFloat(gradeAchieved);
        if (Number.isNaN(parsedGrade) || parsedGrade < 0 || parsedGrade > 100) {
            throw new Error('Grade achieved must be a percentage between 0 and 100.');
        }

        // Verify module exists
        const moduleExists = await ModuleRepository.getModuleById(parsedModuleId);
        if (!moduleExists) {
            throw new Error('Module not found.');
        }

        return await this.studentGradeRepository.upsertGrade(
            studentId,
            parsedModuleId,
            parsedGrade
        );
    }

    /**
     * Delete a student's module mark by grade ID.
     */
    async deleteGrade(studentId, gradeId) {
        if (!studentId) {
            throw new Error('Student ID is required.');
        }

        const parsedGradeId = parseInt(gradeId, 10);
        if (Number.isNaN(parsedGradeId)) {
            throw new Error('Valid Grade ID is required.');
        }

        const existing = await this.studentGradeRepository.findByIdAndStudent(
            parsedGradeId,
            studentId
        );
        if (!existing) {
            throw new Error('Grade record not found or unauthorized.');
        }

        const deleted = await this.studentGradeRepository.deleteGrade(parsedGradeId, studentId);
        return deleted;
    }
}

export default new StudentGradeService();
