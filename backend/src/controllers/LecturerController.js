import LecturerService from '../services/LecturerService.js';

class LecturerController {

    static async getDashboardSummary(req, res) {
        try {
            const lecturerId = req.user.user_id;

            const data = await LecturerService.getDashboardSummary(lecturerId);

            return res.status(200).json(data);

        } catch (error) {
            console.error('Lecturer dashboard error:', error);

            return res.status(500).json({
                error: error.message
            });
        }
    }
}

export default LecturerController;