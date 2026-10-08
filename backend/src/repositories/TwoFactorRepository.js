import BaseRepository from './BaseRepository.js';

class TwoFactorRepository extends BaseRepository {
    constructor() {
        super('"ADMINISTRATOR"');
    }

    async getAdminTwoFactor(userId) {
        const rows = await this.query(
            `
            SELECT 
                a."AdminID", 
                u."Email", 
                u."RoleID",
                a."TFASecret", 
                a."TFABackupCodes",
                a."TFALastStep", 
                a."TFAConfirmedAt"
            FROM "ADMINISTRATOR" a
            JOIN "APP_USER" u ON u."UserID" = a."AdminID"
            WHERE a."AdminID" = $1
            `,
            [userId]
        );
        return rows[0] || null;
    }

    // Only allowed while enrolment is unconfirmed, so a stolen session can't swap a live secret.
    async savePendingSecret(userId, encryptedSecret) {
        const rows = await this.query(
            `
            UPDATE "ADMINISTRATOR"
            SET "TFASecret" = $2
            WHERE "AdminID" = $1
            RETURNING "AdminID"
            `,
            [userId, encryptedSecret]
        );
        return rows.length > 0;
    }

    async confirmSetup(userId, hashedCodes, step) {
        const rows = await this.query(
            `
            UPDATE "ADMINISTRATOR"
            SET 
                "TFABackupCodes" = $2,
                "TFALastStep" = $3,
                "TFAConfirmedAt" = NOW()
            WHERE 
                "AdminID" = $1
                AND "TFAConfirmedAt" IS NULL
                AND "TFASecret" IS NOT NULL
            RETURNING "AdminID"
            `,
            [userId, hashedCodes, step]
        );
        return rows.length > 0;
    }

    // Atomic: succeeds only if this step is newer than the last accepted one.
    async advanceTotpStep(userId, step) {
        const rows = await this.query(
            `
            UPDATE "ADMINISTRATOR"
                SET "TFALastStep" = $2
            WHERE "AdminID" = $1
                AND ("TFALastStep" IS NULL OR "TFALastStep" < $2)
            RETURNING "AdminID"
            `,
            [userId, step]
        );
        return rows.length > 0;
    }

    // Atomic single-use: succeeds only if the hash is still present.
    async consumeBackupCode(userId, codeHash) {
        const rows = await this.query(
            `
            UPDATE "ADMINISTRATOR"
            SET "TFABackupCodes" = array_remove("TFABackupCodes", $2)
            WHERE "AdminID" = $1 AND $2 = ANY("TFABackupCodes")
            RETURNING "AdminID"
            `,
            [userId, codeHash]
        );
        return rows.length > 0;
    }
}

export default TwoFactorRepository;