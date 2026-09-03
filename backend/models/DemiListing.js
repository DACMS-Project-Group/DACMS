class DemiListing {
    constructor ({
        listing_id = null,
        module_id,
        lecturer_id,
        deadline = new Date(),
        min_grade,
    }) {
        this.listing_id = listing_id;
        this.module_id = module_id;
        this.lecturer_id = lecturer_id;
        this.deadline = deadline;
        this.min_grade = min_grade;
    }

    static fromDb(row) {
        return new DemiListing({
            listing_id: row.ListingID,
            module_id: row.ModuleID,
            lecturer_id: row.LecturerID,
            deadline: row.Deadline,
            min_grade: row.MinimumGrade,
        })
    }

    toDb() {
        return {
            ListingID: this.listing_id,
            ModuleID: this.module_id,
            LecturerID: this.lecturer_id,
            Deadline: this.deadline,
            MinimumGrade: this.min_grade,
        }
    }

    validate() {
        if (!this.module_id) {
            throw new Error("Module ID is required.");
        }

        if (!this.lecturer_id) {
            throw new Error("Lecturer ID is required.");
        }
        
        if (!this.deadline || !(this.deadline instanceof Date)) {
            throw new Error("Deadline must be a valid date.");
        }

        if (!this.min_grade) {
            throw new Error("Minimum grade is required.");
        }
    }
}