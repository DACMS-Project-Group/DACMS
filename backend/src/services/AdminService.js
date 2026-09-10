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
}

export default AdminService;