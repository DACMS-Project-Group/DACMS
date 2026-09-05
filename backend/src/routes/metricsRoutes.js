import { Router } from 'express';
import metricsController from '../controllers/MetricsController.js';

const router = Router();

router.get('/health', metricsController.getHealth);
router.get('/metrics/tables', metricsController.getTableMetrics);

export default router;