class Module {
    constructor ({
        module_id = null,
        module_code,
        module_name,
        description,
        min_academic_requirement
    }) {
        this.module_id = module_id;
        this.module_code = module_code;
        this.module_name = module_name;
        this.description = description;
        this.min_academic_requirement = min_academic_requirement;
    }

    static fromDb(row) {
        return new Module({
            module_id: row.ModuleID,
            module_code: row.ModuleCode,
            module_name: row.ModuleName,
            description: row.Description,
            min_academic_requirement: row.MinAcademicRequirement,
        });
    }

    toDb() {
        return {
            ModuleID: this.module_id,
            ModuleCode: this.module_code,
            ModuleName: this.module_name,
            Description: this.description,
            MinAcademicRequirement: this.min_academic_requirement,
        };
    }

    validate() {
        if (!this.module_code) {
            throw new Error("Module code is required.");
        }

        if (!this.module_name) {
            throw new Error("Module name is required.");
        }

        if (!this.description) {
            throw new Error("Description is required.");
        }

        if (!this.min_academic_requirement) {
            throw new Error("Minimum academic requirement is required.");
        }
    }   
}

export default Module;