import NotificationService from '../services/NotificationService.js';

const { io, userSockets } = require('../server');
const pool = require('../db');

class NotificationService {
    static async sendNotification({ recipientId, senderId, type, message }) {
        // 1. Save to PostgreSQL using parameterized query
        const insertQuery = `
            INSERT INTO notifications (RecipientUserID, NotificationType, Message)
            VALUES ($1, $2, $3)
            RETURNING *
        `;
        const { rows } = await pool.query(insertQuery, [
            recipientId, 
            senderId, 
            type, 
            message
        ]);
    
        const newNotification = rows[0];

        // 2. Push via Socket if the recipient is online
        const recipientSocketId = userSockets.get(recipientId);
        if (recipientSocketId) {
            io.to(recipientSocketId).emit('newNotification', newNotification);
        }
    
        return newNotification;
    }

    //get existing notifications for the authenticated user
    static async getNotifications(req, res) {
        const query = `
                SELECT * FROM notifications 
                WHERE RecipientUserID = $1 
                ORDER BY NotificationTimestamp DESC 
                LIMIT 20
            `;
        const { rows } = await pool.query(query, [req.user.id]);
        res.json(rows[0]);
    }

    //mark a notification as read
    static async markAsRead(req, res) {

        const query = `
            UPDATE notifications 
            SET read = true 
            WHERE id = $1 AND recipient_id = $2 
            RETURNING *
        `;
        const { rows } = await pool.query(query, [req.params.id, req.user.id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Notification not found' });
        }

        res.json(rows[0]);
    }

}
export default NotificationService;
