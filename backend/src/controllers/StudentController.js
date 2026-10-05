import studentService from '../services/StudentService.js';
import { getAuthUserId } from '../utils/getAuthUserId.js';

class StudentController {
    async getProfile(req, res, next) {
        try {
            const userId = getAuthUserId(req);
            const student = await studentService.getProfile(userId);
            res.json({ student });
        } catch (err) {
            if (err.message.includes('not found')) {
                return res.status(404).json({ message: err.message });
            }
            next(err);
        }
    }

    async updateProfile(req, res, next) {
        try {
            const userId = getAuthUserId(req);
            // STUDENT_FIELD_MAP / APP_USER_FIELD_MAP in the repository
            // whitelist which fields in req.body are actually writable -
            // safe to pass the whole body straight through.
            const student = await studentService.updateProfile(userId, req.body);
            res.json({ student });
        } catch (err) {
            if (err.message.includes('not found')) {
                return res.status(404).json({ message: err.message });
            }
            if (err.message.includes('already in use')) {
                return res.status(409).json({ message: err.message });
            }
            next(err);
        }
    }
}

export default new StudentController();