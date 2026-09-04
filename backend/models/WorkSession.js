class WorkSession {
    constructor({
        session_id = null,
        position_id,
        start_time,
        end_time,
        total_hours = start_time && end_time ? (end_time - start_time) / (1000 * 60 * 60) : null,
        estimated_remuneration,
        lecturer_approval,
    }) {
        this.session_id = session_id;
        this.position_id = position_id;
        this.start_time = start_time;
        this.end_time = end_time;
        this.total_hours = total_hours;
        this.estimated_remuneration = estimated_remuneration;
        this.lecturer_approval = lecturer_approval;
    }

    static fromDb(row) {
        return new WorkSession({
            session_id: row.SessionID,
            position_id: row.PositionID,
            start_time: row.StartTime,
            end_time: row.EndTime,
            total_hours: row.TotalHoursWorked,
            estimated_remuneration: row.EstimatedRemuneration,
            lecturer_approval: row.LecturerApproval
        });
    }

    toDb() {
        return {
            SessionID: this.session_id,
            PositionID: this.position_id,
            StartTime: this.start_time,
            EndTime: this.end_time,
            TotalHoursWorked: this.total_hours,
            EstimatedRemuneration: this.estimated_remuneration,
            LecturerApproval: this.lecturer_approval
        };
    }

    validate() {
        if (!this.position_id) {
            throw new Error("Position ID is required.");
        }

        if (!this.start_time) {
            throw new Error("Start time is required.");
        }

        if (!this.end_time) {
            throw new Error("End time is required.");
        }

        if (this.start_time >= this.end_time) {
            throw new Error("Start time must be before end time.");
        }
    }
}

export default WorkSession;