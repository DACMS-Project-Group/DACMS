import studentDashboardService from '../services/StudentDashboardService.js';
import { getAuthUserId } from '../utils/getAuthUserId.js';

class StudentDashboardController {
    async getDashboard(req, res, next) {
        try {
            const studentId = getAuthUserId(req);
            const dashboard = await studentDashboardService.getDashboard(studentId);
            res.json(dashboard);
        } catch (err) {
            if (err.message.includes('not found')) {
                return res.status(404).json({ message: err.message });
            }
            next(err);
        }
    }
}

export default new StudentDashboardController();
