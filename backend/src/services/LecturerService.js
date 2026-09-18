import LecturerRepository from '../repositories/LecturerRepository.js';

class LecturerService {

    static async getDashboardSummary(lecturerId) {
        const stats = await LecturerRepository.getDashboardMetrics(lecturerId);

        return {
            stats
        };
    }
}

export default LecturerService;