class Notification {
    constructor({
        notification_id = null,
        user_id,
        title = null,
        type,
        message,
        subject = null,
        is_read = false,
        created_timestamp = new Date(),
    }) {
        this.notification_id = notification_id;
        this.user_id = user_id;
        this.title = title ?? subject ?? null;
        this.type = type;
        this.message = message;
        this.subject = subject ?? title ?? null;
        this.is_read = is_read;
        this.created_timestamp = created_timestamp;
    }

    static fromDb(row) {
        return new Notification({
            notification_id: row.NotificationID,
            user_id: row.RecipientUserID,
            type: row.NotificationType,
            message: row.Message,
            title: row.Title ?? row.NotificationTitle ?? row.Subject ?? null,
            subject: row.Subject ?? row.Title ?? row.NotificationTitle ?? null,
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
            Subject: this.subject ?? this.title ?? null,
            IsRead: this.is_read,
            CreatedTimestamp: this.created_timestamp,
        };
    }

    validate() {
        if (!this.user_id) throw new Error("Recipient User ID is required.");
        if (!this.message || this.message.trim() === "") {
            throw new Error("Message is required.");
        }
    }
}

export default Notification;