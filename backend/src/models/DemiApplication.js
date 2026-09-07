class DemiApplication {
    constructor({
        application_id = null,
        student_id,
        listing_id,
        application_status,
        verification_eligibility_status,
        date_submitted = new Date(),
    }) {
        this.application_id = application_id;
        this.student_id = student_id;
        this.listing_id = listing_id;
        this.application_status = application_status;
        this.verification_eligibility_status = verification_eligibility_status;
        this.date_submitted = date_submitted;
    }

    static fromDb(row) {
        return new DemiApplication({
            application_id: row.ApplicationID,
            student_id: row.StudentID,
            listing_id: row.ListingID,
            application_status: row.ApplicationStatus,
            verification_eligibility_status: row.VerificationEligibilityStatus,
            date_submitted: row.DateSubmitted,
        });
    }

    toDb() {
        return {
            ApplicationID: this.application_id,
            StudentID: this.student_id,
            ListingID: this.listing_id,
            ApplicationStatus: this.application_status,
            VerificationEligibilityStatus: this.verification_eligibility_status,
            DateSubmitted: this.date_submitted,
        };
    }

    validate() {
        if (!this.student_id) {
            throw new Error("Student ID is required.");
        }

        if (!this.listing_id) {
            throw new Error("Listing ID is required.");
        }

        if (!this.application_status || this.application_status.trim() === "") {
            throw new Error("Application status is required.");
        }

        if (!this.verification_eligibility_status || this.verification_eligibility_status.trim() === "") {
            throw new Error("Verification eligibility status is required.");
        }
    }
}

export default DemiApplication;