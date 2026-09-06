import BaseRepository from '../repositories/BaseRepository.js';

class MetricsService {
    constructor() {
        this.baseRepository = new BaseRepository();
    }

    async getHealthStatus() {
        const dbTime = await this.baseRepository.getDatabaseTime();
        return {
            status: 'ok',
            message: 'Backend and PostgreSQL connected!',
            time: dbTime,
        };
    }

    async getTableMetrics() {
        const tables = await this.baseRepository.getTableMetrics();
        return { tables };
    }
}

export default new MetricsService();