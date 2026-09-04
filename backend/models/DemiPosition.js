class DemiPosition {
    constructor({
        position_id = null,
        application_id,
        payment_scale_id,
        start_date = new Date(),
        termination_date,
    }) {
        this.position_id = position_id;
        this.application_id = application_id;
        this.payment_scale_id = payment_scale_id;
        this.start_date = start_date;
        this.termination_date = termination_date;
    }

    static fromDb(row) {
        return new DemiPosition({
            position_id: row.PositionID,
            application_id: row.ApplicationID,
            payment_scale_id: row.PaymentScaleID,
            start_date: row.StartDate,
            termination_date: row.TerminationDate,
        });
    }

    toDb() {
        return {
            PositionID: this.position_id,
            ApplicationID: this.application_id,
            PaymentScaleID: this.payment_scale_id,
            StartDate: this.start_date,
            TerminationDate: this.termination_date,
        };
    }

    validate() {
        if (!this.application_id) throw new Error("Application ID is required.");
        if (!this.payment_scale_id) throw new Error("Payment Scale ID is required.");
        if (!this.start_date || !(this.start_date instanceof Date)) {
            throw new Error("Start date must be a valid date.");
        }
        if (this.termination_date && !(this.termination_date instanceof Date)) {
            throw new Error("Termination date must be a valid date.");
        }
    }
}

export default DemiPosition;