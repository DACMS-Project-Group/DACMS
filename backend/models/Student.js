import User from "./User.js";

class Student extends User {
    constructor({
        user_id = null,
        first_name,
        last_name,
        email,
        password_hash,
        role_id,
        created_at = new Date(),
        student_id = user_id,
        student_number,
        study_level,
        contact_details,
        bank_name = null,
        account_number,
        branch_code,
    }) {
        super({
            user_id,
            first_name,
            last_name,
            email,
            password_hash,
            role_id,
            created_at
        });

        this.student_id = student_id ?? user_id;
        this.student_number = student_number;
        this.study_level = study_level;
        this.contact_details = contact_details;
        this.bank_name = bank_name;
        this.account_number = account_number;
        this.branch_code = branch_code;
    }

    static fromDb(row) {
        return new Student({
            user_id: row.UserID ?? row.StudentID,
            student_id: row.StudentID ?? row.UserID,
            first_name: row.FName,
            last_name: row.LName,
            email: row.Email,
            password_hash: row.PasswordHash,
            role_id: row.RoleID,
            created_at: row.CreatedAt ?? row.created_at,
            student_number: row.StudentNumber,
            study_level: row.StudyLevel,
            contact_details: row.ContactDetails,
            bank_name: row.BankName,
            account_number: row.AccountNumber,
            branch_code: row.BranchCode,
        });
    }

    toDb() {
        return {
            ...super.toDb(),
            StudentID: this.student_id ?? this.user_id,
            StudentNumber: this.student_number,
            StudyLevel: this.study_level,
            ContactDetails: this.contact_details,
            BankName: this.bank_name,
            AccountNumber: this.account_number,
            BranchCode: this.branch_code,
        };
    }

    validate() {
        super.validate();

        if (!this.student_number || this.student_number.trim() === "") {
            throw new Error("Student number is required.");
        }

        if (!this.study_level || this.study_level.trim() === "") {
            throw new Error("Study level is required.");
        }

        if (!this.contact_details || this.contact_details.trim() === "") {
            throw new Error("Contact details are required.");
        }

        if (!this.account_number || this.account_number.trim() === "") {
            throw new Error("Account number is required.");
        }

        if (!this.branch_code || this.branch_code.trim() === "") {
            throw new Error("Branch code is required.");
        }
    }
}

export default Student;