class User {
    constructor({
        user_id = null,
        first_name,
        last_name,
        email,
        password_hash,
        role_id,
        created_at = new Date()
    }) {
        this.user_id = user_id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
        this.password_hash = password_hash;
        this.role_id = role_id;
        this.created_at = created_at;
    }

    get fullName() {
        return `${this.first_name} ${this.last_name}`.trim();
    }

    static fromDb(row) {
        return new User({
            user_id: row.UserID,
            first_name: row.FName,
            last_name: row.LName,
            email: row.Email,
            password_hash: row.PasswordHash,
            role_id: row.RoleID,
            created_at: row.created_at
        });
    }

    toDb() {
        return {
            UserID: this.user_id,
            FName: this.first_name,
            LName: this.last_name,
            Email: this.email,
            PasswordHash: this.password_hash,
            RoleID: this.role_id
        }
    }

    validate() {
        if (!this.first_name || this.first_name.trim() === "") {
            throw new Error("First name is required.");
        }

        if (!this.last_name || this.last_name.trim() === "") {
            throw new Error("Last name is required.");
        }

        if (!this.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
            throw new Error("A valid email is required.");
        }

        if (!this.password_hash || this.password_hash.trim() === "") {
            throw new Error("Password hash is required.");
        }

        if (this.role_id === null || this.role_id === undefined || this.role_id === "") {
            throw new Error("Role ID is required.");
        }
    }
}

export default User;