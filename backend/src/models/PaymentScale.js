class PaymentScale {
    constructor({
        scale_id = null,
        role_level,
        standard_hourly_rate,
        effective_year
    }) {
        this.scale_id = scale_id;
        this.role_level = role_level;
        this.standard_hourly_rate = standard_hourly_rate;
        this.effective_year = effective_year;
    }

    static fromDb(row) {
        return new PaymentScale({
            scale_id: row.ScaleID,
            role_level: row.RoleLevel,
            standard_hourly_rate: row.StandardHourlyRate,
            effective_year: row.EffectiveYear,
        });
    }

    toDb() {
        return {
            ScaleID: this.scale_id,
            RoleLevel: this.role_level,
            StandardHourlyRate: this.standard_hourly_rate,
            EffectiveYear: this.effective_year,
        };
    }

    validate() {
        if (!this.role_level) {
            throw new Error("Role level is required.");
        }

        if (this.standard_hourly_rate === undefined || this.standard_hourly_rate === null) {
            throw new Error("Standard hourly rate is required.");
        }

        if (!this.effective_year) {
            throw new Error("Effective year is required.");
        }
    }
}

export default PaymentScale;