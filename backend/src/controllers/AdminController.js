import AdminService from '../services/AdminService.js';
import Budget from '../models/ModuleBudget.js';

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

    static async createBudget(req, res) {
        try {
            const budgetData = req.body || {};
            const budget = new Budget(budgetData);
            budget.validate();

            const data = await AdminService.createBudget(budget);
            return res.status(201).json({
                message: 'Budget creation Successful',
                budget_id: data.data
            });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    static async editBudget(req, res) {
        const { id } = req.params;
        try {
            const updateData = req.body || {};
            const data = await AdminService.editBudget(id, updateData);
            return res.status(200).json({
                message: 'Budget updated successfully',
                data: data.data
            });
        } catch (error) {
            if (error.message === "Budget not found" || error.message === "No fields provided to update") {
                return res.status(400).json({ error: error.message });
            }
            return res.status(500).json({ error: error.message });
        }
    }
}

export default AdminController;