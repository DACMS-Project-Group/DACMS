import AdminRepository from '../repositories/AdminRepository.js';
import BaseRepository from '../repositories/BaseRepository.js';

class AdminService {
    static async getDashboardSummary() {
        const stats = await AdminRepository.getDashboardMetrics();
        const monthlyWork = await AdminRepository.getMonthlyWorkSessions();
        const pendingAppointments = await AdminRepository.getPendingAppointments();

        return {
            stats,
            monthlyWork,
            pendingAppointments
        };
    }

    static async getBudgetsSummary() {
        const stats = await AdminRepository.getBudgetsMetrics();
        const module_budgets = await AdminRepository.getBudgetsSummary();
        
        return {
            stats,
            module_budgets
        };
    }

    static async getBudgetById(budget_id) {
        const data = await AdminRepository.getBudgetById(budget_id);
        return { data }
    }
}

export default AdminService;