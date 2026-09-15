import express from 'express';
import UserController from '../controllers/NotificationController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/notifications/send', authenticate, NotificationController.sendNotification.bind(NotificationController));
router.get('/notifications/fetch', authenticate, NotificationController.getNotifications.bind(NotificationController));
router.patch('/notifications/read/:id', authenticate, NotificationController.markAsRead.bind(NotificationController));

export default router;