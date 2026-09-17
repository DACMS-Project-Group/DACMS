import BaseRepository from './BaseRepository.js';
import Student from '../models/Student.js';

class StudentRepository extends BaseRepository {
    constructor() {
        super('"STUDENT"', Student);
    }

    async findByUserId(userId) {
        const rows = await this.query(
            `
            SELECT u.*, s.*
            FROM "APP_USER" u
            JOIN "STUDENT" s ON s."StudentID" = u."UserID"
            WHERE u."UserID" = $1
            `,
            [userId]
        );
        return rows[0] ? Student.fromDb(rows[0]) : null;
    }

    /**
     * Updates only the student-editable profile fields (contact + banking details).
     * Identity fields (name, email, student number) are intentionally excluded —
     * those likely need an admin-facing change process, not a self-service edit.
     */
    async updateProfile(userId, { contactDetails, bankName, accountNumber, branchCode }) {
        await this.query(
            `
            UPDATE "STUDENT"
            SET
                "ContactDetails" = COALESCE($2, "ContactDetails"),
                "BankName" = COALESCE($3, "BankName"),
                "AccountNumber" = COALESCE($4, "AccountNumber"),
                "BranchCode" = COALESCE($5, "BranchCode")
            WHERE "StudentID" = $1
            `,
            [userId, contactDetails, bankName, accountNumber, branchCode]
        );
        return this.findByUserId(userId);
    }
}

export default StudentRepository;
