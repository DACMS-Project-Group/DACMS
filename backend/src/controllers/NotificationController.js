import NotificationService from '../services/NotificationService.js';

class NotificationController {
    static async sendNotification(req, res) {
        try {
            const { subject, type, message } = req.body;
            const recipientId = req.body.recipientId ?? req.user?.user_id;

            if (!recipientId) {
                return res.status(400).json({ error: 'Recipient user is required' });
            }

            const notification = await NotificationService.sendNotification({
                recipientId,
                subject,
                type,
                message
            });

            return res.status(201).json(notification);
        } catch (error) {
            console.error('Error sending notification:', error);
            return res.status(500).json({ error: 'Failed to send notification' });
        }
    }

    static async getNotifications(req, res) {
        try {
            const notifications = await NotificationService.getNotifications(req, res);
            res.status(200).json(notifications);
        } catch (error) {
            console.error('Error fetching notifications:', error);
            res.status(500).json({ error: 'Failed to fetch notifications' });
        }
    }

    static async markAsRead(req, res) {
        try {
            const updatedNotification = await NotificationService.markAsRead(req, res);
            res.status(200).json(updatedNotification);
        } catch (error) {
            console.error('Error marking notification as read:', error);
            res.status(500).json({ error: 'Failed to mark notification as read' });
        }
    }
}

export default NotificationController;
