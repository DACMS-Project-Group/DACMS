import { Router } from 'express';
import metricsRoutes from './metricsRoutes.js';
import userRoutes from './userRoutes.js';
import studentRoutes from './studentRoutes.js';
import lecturerRoutes from './lecturerRoutes.js';
import adminRoutes from './adminRoutes.js';
import notificationRoutes from './notificationRoutes.js';

const router = Router();

router.use('/', metricsRoutes);
router.use('/users', userRoutes);
router.use('/admin', adminRoutes);
router.use('/lecturer', lecturerRoutes);
router.use('/student', studentRoutes);
router.use('/notifications', notificationRoutes);

export default router;