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

    static async createBudget(Budget) {
        const data = await AdminRepository.createBudget(Budget);
        return { data };
    }

    static async editBudget(budget_id, updateData) {
        const data = await AdminRepository.editBudget(budget_id, updateData);
        return { data };
    }

    static async getClaimsSummary() {
        const stats = await AdminRepository.getClaimsMetrics();
        const claims = await AdminRepository.getClaims();

        return {
            stats,
            claims
        };
    }

    static async getClaimById(claim_id) {
        const data = await AdminRepository.getClaimById(claim_id);
        return { data };
    }

    static async approveClaim(claim_id) {
        const data = await AdminRepository.approveClaim(claim_id);
        return { data };
    }

    static async getAppointments() {
        const stats = await AdminRepository.getAppointmentsMetrics();
        const pending = await AdminRepository.getPendingAppointmentsDetailed();
        const history = await AdminRepository.getApprovalHistory();

        return {
            stats,
            pending,
            history
        };
    }
}

export default AdminService;