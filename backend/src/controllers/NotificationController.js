import NotificationService from '../services/NotificationService.js';

class NotificationController {
    //fetch notifications for the authenticated user
    static async sendNotification(req, res) {
        try {
            const { recipientId, type, message } = req.body;
            const senderId = req.user.user_id; // Assuming the sender is the authenticated user 
            const notification = await NotificationService.sendNotification({ recipientId, senderId, type, message });
            res.status(201).json(notification);
        } catch (error) {
            console.error('Error sending notification:', error);
            res.status(500).json({ error: 'Failed to send notification' });
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
