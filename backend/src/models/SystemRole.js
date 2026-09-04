class SystemRole {
    constructor ({
        role_id = null,
        name
    }){
    this.role_id = role_id,
    this.name = name
    }

    static fromDb(row) {
        return new SystemRole({
            role_id: row.RoleID,
            name: row.RoleName
        })
    }

    toDb() {
        return {
            RoleID: this.role_id,
            RoleName: this.name
        }
    }

    validate() {
        if (!this.name?.trim()) {
            throw new Error("Role name is required");
        }
    }
}

export default SystemRole;