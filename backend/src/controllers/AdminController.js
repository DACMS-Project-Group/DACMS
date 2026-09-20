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

    static async getBudgetsSummary(req, res) {
        try {
            const data = await AdminService.getBudgetsSummary();
            return res.status(200).json(data);
        } catch (error) {
            return res.status(500).json({ error: error.message})
        }
    }

    static async getBudgetById(req, res) {
        const { budget_id } = req.params;

        try {
            const data = await AdminService.getBudgetById(budget_id);
            return res.status(200).json(data);
        } catch (error) {
            return res.status(500).json({ error: error.message})
        }
    }
}

export default AdminController;