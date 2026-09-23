class OrganisationalEntity {
    constructor({
        oe_id = null,
        oe_code,
        oe_name,
        faculty_name = "Faculty of Natural & Agricultural Sciences",
    }) {
        this.oe_id = oe_id;
        this.oe_code = oe_code;
        this.oe_name = oe_name;
        this.faculty_name = faculty_name;
    }

    static fromDb(row) {
        return new OrganisationalEntity({
            oe_id: row.OE_ID,
            oe_code: row.OE_Code,
            oe_name: row.OEName,
            faculty_name: row.FacultyName,
        });
    }

    toDb() {
        return {
            OE_ID: this.oe_id,
            OE_Code: this.oe_code,
            OEName: this.oe_name,
            FacultyName: this.faculty_name,
        };
    }

    validate() {
        if (!this.oe_code || this.oe_code.trim() === "") {
            throw new Error("Organisational entity code is required.");
        }

        if (!this.oe_name || this.oe_name.trim() === "") {
            throw new Error("Organisational entity name is required.");
        }

        if (!this.faculty_name || this.faculty_name.trim() === "") {
            throw new Error("Faculty name is required.");
        }
    }
}

export default OrganisationalEntity;