import pool from '../config/db.js';
import nodemailer from 'nodemailer';
import getAuthUserId from '../utils/getAuthUserId.js';
import compileTemplate from '../utils/templateCompiler.js';
import path from 'path';
import { fileURLToPath } from 'node:url';

let ioInstance = null;
let socketMap = new Map();

export function configureSocketIO(socketServer, sockets = new Map()) {
    ioInstance = socketServer;
    socketMap = sockets;
}

class NotificationService {
    static async sendNotification({ senderId, recipientId, subject, type, message }) {
        const { rows } = await pool.query(
            `
            INSERT INTO "NOTIFICATION" ("RecipientUserID", "Subject", "NotificationType", "Message")
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `, [recipientId, subject, type, message]);

        const newNotification = rows[0];

        const recipientSocketId = socketMap.get(String(recipientId));
        if (recipientSocketId && ioInstance) {
            ioInstance.to(recipientSocketId).emit('newNotification', newNotification);
        }
        
        this.sendEmailNotification({
            senderId,
            recipientUserId: recipientId,
            notificationID: newNotification.NotificationID
        })
            .then(({ message: emailMessage }) => console.log(emailMessage))
            .catch((error) => console.error('Error sending email notification:', error));
    
        return newNotification;
    }

    //get existing notifications for the authenticated user
    static async getNotifications(req) {
        const userId = await getAuthUserId(req);

        const { rows } = await pool.query(
             `
                SELECT "NotificationID", "RecipientUserID", "Subject", "NotificationType", "Message", "IsRead", "CreatedTimestamp"
                FROM "NOTIFICATION" 
                WHERE "RecipientUserID" = $1 
                ORDER BY "CreatedTimestamp" DESC 
                LIMIT 20
            `,
         [userId]);

        const legacySessions = rows.flatMap((notification) => {
                const match = notification.Message?.match(
                    /^The status of your session\s+(\d+)\s+has been updated to\s+(true|false)$/i
                );
                return match
                    ? [{ notification, sessionId: Number(match[1]), approved: match[2].toLowerCase() === 'true' }]
                    : [];
        });

        if (legacySessions.length) {
                const { rows: sessions } = await pool.query(
                    `
                    SELECT
                        w."SessionID",
                        a."StudentID",
                        TO_CHAR(w."StartTime", 'YYYY-MM-DD') AS "SessionDate",
                        TO_CHAR(w."StartTime", 'HH24:MI') AS "StartTime",
                        TO_CHAR(w."EndTime", 'HH24:MI') AS "EndTime",
                        w."ActivityDescription",
                        w."TotalHoursWorked",
                        m."ModuleCode"
                    FROM "WORK_SESSION" w
                    JOIN "DEMI_POSITION" p ON p."PositionID" = w."PositionID"
                    JOIN "DEMI_APPLICATION" a ON a."ApplicationID" = p."ApplicationID"
                    JOIN "DEMI_LISTING" l ON l."ListingID" = a."ListingID"
                    JOIN "NWU_MODULE" m ON m."ModuleID" = l."ModuleID"
                    WHERE w."SessionID" = ANY($1::int[])
                    `,
                    [legacySessions.map(({ sessionId }) => sessionId)]
                );
                const sessionById = new Map(sessions.map((session) => [session.SessionID, session]));

                for (const { notification, sessionId, approved } of legacySessions) {
                    const session = sessionById.get(sessionId);
                    if (!session || Number(session.StudentID) !== Number(notification.RecipientUserID)) {
                        continue;
                    }

                    const status = approved ? 'verified' : 'rejected';
                    notification.Subject = `Work session ${status}`;
                    notification.NotificationType = `Work Session ${approved ? 'Verified' : 'Rejected'}`;
                    notification.Message =
                        `Your ${session.ModuleCode} work session on ${session.SessionDate} ` +
                        `from ${session.StartTime} to ${session.EndTime} ` +
                        `(${session.ActivityDescription}, ${session.TotalHoursWorked} hours) was ${status}. ` +
                        `View /session-detail/${session.SessionID}.`;
                }
        }

        return rows.map(({ RecipientUserID, ...notification }) => notification);
    }

    //mark a notification as read
    static async markAsRead(req) {
        const userId = await getAuthUserId(req);

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
    static async sendEmailNotification({ senderId, recipientUserId, notificationID }) {
        // Fetch the recipient's email from the database
        const recipientRows = await this.getUserInfo(recipientUserId);
        if (!recipientRows.length) {
            throw new Error(`Recipient user ${recipientUserId} was not found`);
        }

        //fetch sender's name from the database
        const senderRows = senderId ? await this.getUserInfo(senderId) : [];

        // Fetch notification details from the database
        const { rows: notificationRows } = await pool.query(
            `
            SELECT * FROM "NOTIFICATION" 
            WHERE "NotificationID" = $1
            `,
            [notificationID]
        );

        const testAccount = await nodemailer.createTestAccount();

        //create transporter with SMTP settings
        let transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false, 
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });

        //compile the email template
        const compiledMessage = await compileTemplate('email_format', {
            title: recipientRows[0].Title || '',
            name: recipientRows[0].FullName || 'Applicant',
            message: notificationRows[0]?.Message || 'You have a new notification.',
            sender: senderRows[0]?.FullName || 'Assistant Applications and Communications Management System'
        });

        // Compose the email
        let mailOptions = {
            from: '"AACMS Notifications" <aacms@noreply.nwu.ac.za>',
            to: recipientRows[0].Email,
            subject: notificationRows[0]?.Subject || 'New notification',
            html: compiledMessage,
           attachments: [
               {
                    filename: 'NWU-Acronym-Logo-Purple_Digital.png',
                    path: path.join(path.dirname(fileURLToPath(import.meta.url)), '../assets', 'NWU-Acronym-Logo-Purple-Digital.png'),
                    cid: 'NWU-Logo'
               }
           ]
        };

        // Send the email
        const mailInfo = await transporter.sendMail(mailOptions);

        //preview email can be viewed in browswer using link in log
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(mailInfo));

        return { message: 'Email notification sent successfully.' };
    }

    static async getUserInfo(userId) {
        const { rows } = await pool.query(
            `
            SELECT 
                "Title", 
                CONCAT("FName", ' ', "LName") AS "FullName",
                "Email"
            FROM "APP_USER" 
            WHERE "UserID" = $1
            `,
            [userId]
        );
        return rows;
    }

    static async getAdministratorIds() {
        const { rows } = await pool.query(
            `SELECT "UserID" FROM "APP_USER" WHERE "RoleID" = 3`
        );
        return rows.map((row) => row.UserID);
    }
}
export default NotificationService;
