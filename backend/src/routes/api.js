import { Router } from 'express';
import metricsRoutes from './metricsRoutes.js';

const router = Router();

router.use('/', metricsRoutes);

export default router;