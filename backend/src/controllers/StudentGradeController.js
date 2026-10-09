import studentGradeService from '../services/StudentGradeService.js';
import { getAuthUserId } from '../utils/getAuthUserId.js';

class StudentGradeController {

    // GET /api/student/modules
    // List all modules available for selection
    async getAvailableModules(req, res, next) {
        try {
            const modules = await studentGradeService.getAvailableModules();
            return res.json({ modules });
        } catch (err) {
            next(err);
        }
    }

    // GET /api/student/grades
    // List all grades recorded for the authenticated student

    async getMyGrades(req, res, next) {
        try {
            const studentId = getAuthUserId(req);
            const grades = await studentGradeService.getGrades(studentId);
            return res.json({ grades });
        } catch (err) {
            next(err);
        }
    }


    // POST /api/student/grades
    // Upsert a module grade for the authenticated student

    async saveGrade(req, res, next) {
        try {
            const studentId = getAuthUserId(req);
            const { moduleId, gradeAchieved } = req.body;

            const saved = await studentGradeService.saveGrade(studentId, {
                moduleId,
                gradeAchieved,
            });

            return res.status(200).json({
                message: 'Grade saved successfully.',
                grade: saved,
            });
        } catch (err) {
            if (
                err.message.includes('required') ||
                err.message.includes('percentage between 0 and 100')
            ) {
                return res.status(400).json({ message: err.message });
            }
            if (err.message.includes('Module not found')) {
                return res.status(404).json({ message: err.message });
            }
            next(err);
        }
    }


    // DELETE /api/student/grades/:gradeId
    // Remove a student's recorded grade

    async deleteGrade(req, res, next) {
        try {
            const studentId = getAuthUserId(req);
            const { gradeId } = req.params;

            await studentGradeService.deleteGrade(studentId, gradeId);

            return res.status(200).json({ message: 'Grade deleted successfully.' });
        } catch (err) {
            if (err.message.includes('not found') || err.message.includes('unauthorized')) {
                return res.status(404).json({ message: err.message });
            }
            if (err.message.includes('Valid Grade ID')) {
                return res.status(400).json({ message: err.message });
            }
            next(err);
        }
    }
}

export default new StudentGradeController();
