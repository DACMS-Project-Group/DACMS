import AdminService from '../services/AdminService.js';

class AdminController {
    static async getDashboardSummary(req, res) {
        try {
            const data = await AdminService.getDashboardSummary();
            return res.status(200).json(data);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}

export default AdminController;