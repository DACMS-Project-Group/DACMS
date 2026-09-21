import User from "./User.js";

class Administrator extends User {
    constructor({
        user_id = null,
        first_name,
        last_name,
        email,
        password_hash,
        role_id,
        created_at = new Date(),
        admin_id = user_id,
        mfa_enabled = true,
        budget_allocation_rights = true,
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

        this.admin_id = admin_id ?? user_id;
        this.mfa_enabled = mfa_enabled;
        this.budget_allocation_rights = budget_allocation_rights;
    }

    static fromDb(row) {
        return new Administrator({
            user_id: row.UserID ?? row.AdminID,
            admin_id: row.AdminID ?? row.UserID,
            first_name: row.FName,
            last_name: row.LName,
            email: row.Email,
            password_hash: row.PasswordHash,
            role_id: row.RoleID,
            created_at: row.CreatedAt ?? row.created_at,
            mfa_enabled: row.MFA_Enabled,
            budget_allocation_rights: row.BudgetAllocationRights,
        });
    }

    toDb() {
        return {
            ...super.toDb(),
            AdminID: this.admin_id ?? this.user_id,
            MFA_Enabled: this.mfa_enabled,
            BudgetAllocationRights: this.budget_allocation_rights,
        };
    }

    validate() {
        super.validate();

        if (this.mfa_enabled === null || this.mfa_enabled === undefined) {
            throw new Error("MFA enabled flag is required.");
        }

        if (this.budget_allocation_rights === null || this.budget_allocation_rights === undefined) {
            throw new Error("Budget allocation rights flag is required.");
        }
    }
}

export default Administrator;