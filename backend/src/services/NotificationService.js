import pool from '../config/db.js';
import { io, userSockets } from '../server.js';
import UserController from '../controllers/UserController.js';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

class NotificationService {
    static async sendNotification({ recipientId, type, message }) {
        // 1. Save to PostgreSQL using parameterized query
        const insertQuery = await pool.query(
            `
            INSERT INTO "NOTIFICATION" ("RecipientUserID", "NotificationType", "Message")
            VALUES ($1, $2, $3)
            RETURNING *
        `, [recipientId, type, message]);

        const { rows } = await pool.query(
            `
            SELECT * 
            FROM "NOTIFICATION"
            WHERE "NotificationID" = $1
            `
            , 
            [insertQuery.rows[0].NotificationID]
 
        );
        const newNotification = rows[0];

        // 2. Push via Socket if the recipient is online
        const recipientSocketId = userSockets.get(recipientId);
        if (recipientSocketId) {
            io.to(recipientSocketId).emit('newNotification', newNotification);
        }
    
        return newNotification;
    }

    //get existing notifications for the authenticated user
    static async getNotifications(req) {
        const userId = await this.unpackUserID(req);
        const { rows } = await pool.query(
             `
                SELECT * FROM "NOTIFICATION" 
                WHERE "RecipientUserID" = $1 
                ORDER BY "CreatedTimestamp" DESC 
                LIMIT 20
            `,
         [userId]);
        return rows;
    }

    //mark a notification as read
    static async markAsRead(req) {
        const userId = await this.unpackUserID(req);

        const { rows } = await pool.query(
            `
            UPDATE "NOTIFICATION"
            SET "IsRead" = true 
            WHERE "NotificationID" = $1 AND "RecipientUserID" = $2 
            RETURNING *
        `, [req.params.id, userId]);
       

        if (rows.length === 0) {
            return { error: 'Notification not found' };
        }

        return rows[0];
    }

    //email notifcation
    static async sendEmailNotification({ recipientUserId, notificationID }) {
        // Fetch the recipient's email from the database
        const { rows: userEmailRows } = await pool.query(
            `
            SELECT "Email" FROM "USER" 
            WHERE "UserID" = $1
            `,
            [recipientUserId]
        );

        // Fetch notification details from the database
        const { rows: notificationRows } = await pool.query(
            `
            SELECT * FROM "NOTIFICATION" 
            WHERE "NotificationID" = $1
            `,
            [notificationID]
        );

        let testAccount = await nodemailer.createTestAccount(); //Create test account, remove this in production

        //create transporter with SMTP settings
        let transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email", // Use Ethereal for testing
            port: 587,
            secure: false, 
            auth: {
                user: testAccount.user, // generated ethereal user
                pass: testAccount.pass, // generated ethereal password
            },
        });

        // Compose the email
        let mailOptions = {
            from: '"AACMS Notifications" <notifications@aacms.com>',
            to: userEmailRows[0].Email,
            subject: notificationRows[0].NotificationType,
            text: notificationRows[0].Message
        };

        // Send the email
        await transporter.sendMail(mailOptions);

        //preview email can be viewed in browswer using link in log
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(mailOptions));

        return { message: 'Email notification sent successfully.' };
    }

    static async unpackUserID(req) {
        const token = req.cookies.token;

        if (!token) 
            return 'Access denied.';

        const verifiedData = jwt.verify(token, process.env.JWT_SECRET || 'your_super_secret_key');

        return verifiedData.id;
    }

}
export default NotificationService;
