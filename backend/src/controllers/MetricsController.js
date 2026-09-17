import metricsService from '../services/MetricsService.js';

class MetricsController {
    async getHealth(req, res, next) {
        try {
            const healthData = await metricsService.getHealthStatus();
            res.json(healthData);
        } catch (err) {
            next(err);
        }
    }

    async getTableMetrics(req, res, next) {
        try {
            const metrics = await metricsService.getTableMetrics();
            res.json(metrics);
        } catch (err) {
            next(err);
        }
    }
}

export default new MetricsController();