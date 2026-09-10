import AdminRepository from '../repositories/AdminRepository.js';
import BaseRepository from '../repositories/BaseRepository.js';

class AdminService {
    static async getDashboardStatistics() {
        return await AdminRepository.getDashboardMetrics();
    }
}

export default AdminService;