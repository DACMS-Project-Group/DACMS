import WorkSessionRepository from '../repositories/WorkSessionRepository.js';

class WorkSessionService {
    constructor() {
        this.workSessionRepository = new WorkSessionRepository();
    }

    async getStudentIdBySession(sessionId) {
        const response = await this.workSessionRepository.getStudentIdFromSession(sessionId);

        if(!response)
           throw new Error("Student not found!");

        return response;
    }

    async listActivePositions(studentId) {
        return this.workSessionRepository.findActivePositionsForStudent(studentId);
    }

    async listSessionsForStudent(studentId) {
        return this.workSessionRepository.findByStudentId(studentId);
    }

    async clockIn(studentId, positionId) {
        const position = await this.workSessionRepository.findPositionForStudent(positionId, studentId);
        if (!position) {
            throw new Error('Position not found, or does not belong to you.');
        }

        const openSession = await this.workSessionRepository.findOpenSessionForPosition(positionId);
        if (openSession) {
            throw new Error('You are already clocked in for this position.');
        }

        return this.workSessionRepository.clockIn(positionId);
    }

    async clockOut(studentId, sessionId) {
        const belongsToStudent = await this.workSessionRepository.belongsToStudent(sessionId, studentId);
        if (!belongsToStudent) {
            throw new Error('Session not found, or does not belong to you.');
        }

        const session = await this.workSessionRepository.findById(sessionId);
        if (!session || session.end_time) {
            throw new Error('This session is not currently open.');
        }

        const position = await this.workSessionRepository.findPositionForStudent(session.position_id, studentId);
        const hourlyRate = position.StandardHourlyRate;

        return this.workSessionRepository.clockOut(sessionId, hourlyRate);
    }
}

export default new WorkSessionService();
