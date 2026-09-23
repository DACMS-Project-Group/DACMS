import LecturerRepository from '../repositories/LecturerRepository.js';
import DemiApplicationRepository from '../repositories/DemiApplicationRepository.js';
import WorkSessionRepository from '../repositories/WorkSessionRepository.js';

class LecturerService {

    constructor() {
        this.demiApplicationRepository = new DemiApplicationRepository();
        this.workSessionRepository = new WorkSessionRepository();
    }

    async getDashboardSummary(lecturerId) {
        const stats = await LecturerRepository.getDashboardMetrics(lecturerId);

        return {
            stats
        };
    }
}

export default new LecturerService();