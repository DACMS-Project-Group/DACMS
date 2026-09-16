import express from 'express';
import NotificationController from '../controllers/NotificationController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post(
    '/send', 
    authenticate, 
    NotificationController.sendNotification.bind(NotificationController)
);

router.get(
    '/fetch', 
    authenticate, 
    NotificationController.getNotifications.bind(NotificationController)

);
router.patch(
    '/read/:id', 
    authenticate, 
    NotificationController.markAsRead.bind(NotificationController)
);

export default router;