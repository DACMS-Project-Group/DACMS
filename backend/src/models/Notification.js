class Notification {
    constructor({
        notification_id = null,
        user_id,
        type,
        message,
        is_read = false,
        created_timestamp = new Date(),
    }) {
        this.notification_id = notification_id;
        this.user_id = user_id;
        this.type = type;
        this.message = message;
        this.is_read = is_read;
        this.created_timestamp = created_timestamp;
    }

    static fromDb(row) {
        return new Notification({
            notification_id: row.NotificationID,
            user_id: row.RecipientUserID, 
            type: row.NotificationType,
            message: row.Message,
            is_read: row.IsRead,
            created_timestamp: row.CreatedTimestamp,
        });
    }

    toDb() {
        return {
            NotificationID: this.notification_id,
            RecipientUserID: this.user_id, 
            NotificationType: this.type,
            Message: this.message,
            IsRead: this.is_read,
            CreatedTimestamp: this.created_timestamp,
        };
    }

    validate() {
        if (!this.user_id) throw new Error("Recipient User ID is required.");
        if (!this.message || this.message.trim() === "") throw new Error("Message is required.");
    }
}

export default Notification;