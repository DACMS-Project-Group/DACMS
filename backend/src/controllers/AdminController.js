import AdminRepository from '../repositories/AdminRepository.js';

class AdminController {
    static async getDashboardStatistics(req, res) {
        const user = req.user;
        // if (!user || user.role_id !== 3) {
        // throw new Error('Illegal request: Not an administrator.');
        // }
        try {
            const data = await AdminRepository.getDashboardMetrics();
            return res.status(200).json(data);
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }
}

export default AdminController;