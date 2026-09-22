import WorkSessionRepository from '../repositories/WorkSessionRepository.js';

class WorkSessionService {
    constructor() {
        this.workSessionRepository = new WorkSessionRepository();
    }

    async listActivePositions(studentId) {
        return this.workSessionRepository.findActivePositionsForStudent(studentId);
    }

    /**
     * Records a work session retroactively for a given position. The student
     * already knows the date, activity, start time, and end time - there is
     * no live clock-in/out. Hours and remuneration are calculated here from
     * the submitted times, and checked against the position's allocated-
     * hours cap before saving.
     */
    async recordSession(studentId, positionId, { date, activity, startTime, endTime }) {
        if (!date || !activity || !startTime || !endTime) {
            throw new Error('date, activity, startTime, and endTime are all required.');
        }

        const position = await this.workSessionRepository.findPositionForStudent(positionId, studentId);
        if (!position) {
            throw new Error('Position not found, or does not belong to you.');
        }

        const startDateTime = new Date(`${date}T${startTime}:00`);
        const endDateTime = new Date(`${date}T${endTime}:00`);

        if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
            throw new Error('date, startTime, and endTime must be valid.');
        }

        if (endDateTime <= startDateTime) {
            throw new Error('End time must be later than the start time.');
        }

        const hours = (endDateTime - startDateTime) / (1000 * 60 * 60);

        const allocatedHours = position.TotalAllocatedHours;
        const workedSoFar = Number(position.WorkedHours || 0);
        if (allocatedHours != null) {
            const remaining = Number(allocatedHours) - workedSoFar;
            if (hours > remaining) {
                throw new Error(
                    `This session exceeds your remaining ${remaining.toFixed(1)} allowable hours for this appointment.`
                );
            }
        }

        const hourlyRate = Number(position.StandardHourlyRate);
        const remuneration = Math.round(hours * hourlyRate * 100) / 100;

        return this.workSessionRepository.createSession({
            positionId,
            activityDescription: activity,
            startTime: startDateTime,
            endTime: endDateTime,
            totalHoursWorked: Math.round(hours * 100) / 100,
            estimatedRemuneration: remuneration,
        });
    }

    async listSessionsForPosition(studentId, positionId) {
        const position = await this.workSessionRepository.findPositionForStudent(positionId, studentId);
        if (!position) {
            throw new Error('Position not found, or does not belong to you.');
        }
        return this.workSessionRepository.findSessionsForPosition(positionId);
    }

    async getSessionDetail(studentId, sessionId) {
        const belongsToStudent = await this.workSessionRepository.belongsToStudent(sessionId, studentId);
        if (!belongsToStudent) {
            throw new Error('Session not found, or does not belong to you.');
        }

        const row = await this.workSessionRepository.findSessionDetailById(sessionId);
        if (!row) {
            throw new Error('Session not found.');
        }

        // NOTE: WORK_SESSION has no verification-date or lecturer-comment column
        // yet, so those two fields the frontend expects (SessionDetail.jsx) are
        // returned as null for now - a schema gap, not a bug here.
        return {
            session_id: row.SessionID,
            position_id: row.PositionID,
            activity: row.ActivityDescription,
            start_time: row.StartTime,
            end_time: row.EndTime,
            total_hours_worked: row.TotalHoursWorked,
            estimated_remuneration: row.EstimatedRemuneration,
            status: row.LecturerApproval ? 'Verified' : 'Pending',
            verification_date: null,
            lecturer_comment: null,
            module_code: row.ModuleCode,
            module_name: row.ModuleName,
            hourly_rate: row.StandardHourlyRate,
            lecturer_name: `${row.LecturerFName} ${row.LecturerLName}`,
        };
    }
}

export default new WorkSessionService();