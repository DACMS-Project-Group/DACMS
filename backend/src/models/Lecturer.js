import User from "./User.js";

class Lecturer extends User {
    constructor({
        user_id = null,
        first_name,
        last_name,
        email,
        password_hash,
        role_id,
        created_at = new Date(),
        lecturer_id = user_id,
        department,
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

        this.lecturer_id = lecturer_id ?? user_id;
        this.department = department;
    }

    static fromDb(row) {
        return new Lecturer({
            user_id: row.UserID ?? row.LecturerID,
            lecturer_id: row.LecturerID ?? row.UserID,
            first_name: row.FName,
            last_name: row.LName,
            email: row.Email,
            password_hash: row.PasswordHash,
            role_id: row.RoleID,
            created_at: row.CreatedAt ?? row.created_at,
            department: row.Department,
        });
    }

    toDb() {
        return {
            ...super.toDb(),
            LecturerID: this.lecturer_id ?? this.user_id,
            Department: this.department,
        };
    }

    validate() {
        super.validate();

        if (!this.department || this.department.trim() === "") {
            throw new Error("Department is required.");
        }
    }
}

export default Lecturer;