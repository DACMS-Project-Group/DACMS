class RemunerationClaim {
    constructor({
        claim_id = null,
        reference_number,
        application_id,
        module_id,
        total_hours_claimed,
        total_claim_amount,
        hourly_rate_applied,
        claim_status,
        submission_date = new Date(),
    }) {
        this.claim_id = claim_id;
        this.reference_number = reference_number;
        this.application_id = application_id;
        this.module_id = module_id;
        this.total_hours_claimed = total_hours_claimed;
        this.total_claim_amount = total_claim_amount;
        this.hourly_rate_applied = hourly_rate_applied;
        this.claim_status = claim_status;
        this.submission_date = submission_date;
    }

    static fromDb(row) {
        return new RemunerationClaim({
            claim_id: row.ClaimID,
            reference_number: row.ClaimReferenceNumber,
            application_id: row.ApplicationID,
            module_id: row.ModuleID,
            total_hours_claimed: row.TotalHoursClaimed,
            total_claim_amount: row.TotalClaimAmount,
            hourly_rate_applied: row.HourlyRateApplied,
            claim_status: row.ClaimStatus,
            submission_date: row.SubmissionDate,
        });
    }

    toDb() {
        return {
            ClaimID: this.claim_id,
            ClaimReferenceNumber: this.reference_number,
            ApplicationID: this.application_id,
            ModuleID: this.module_id,
            TotalHoursClaimed: this.total_hours_claimed,
            TotalClaimAmount: this.total_claim_amount,
            HourlyRateApplied: this.hourly_rate_applied,
            ClaimStatus: this.claim_status,
            SubmissionDate: this.submission_date,
        };
    }

    validate() {
        if (!this.reference_number) throw new Error("Reference number is required.");
        if (!this.application_id) throw new Error("Application ID is required.");
        if (!this.module_id) throw new Error("Module ID is required.");
        if (this.total_hours_claimed == null || isNaN(this.total_hours_claimed)) {
            throw new Error("Total hours claimed must be a valid number.");
        }
        if (this.total_claim_amount == null || isNaN(this.total_claim_amount)) {
            throw new Error("Total claim amount must be a valid number.");
        }
        if (this.hourly_rate_applied == null || isNaN(this.hourly_rate_applied)) {
            throw new Error("Hourly rate applied must be a valid number.");
        }
        if (!this.claim_status) throw new Error("Claim status is required.");
    }
}

export default RemunerationClaim;