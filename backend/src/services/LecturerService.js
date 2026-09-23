import LecturerRepository from '../repositories/LecturerRepository.js';
import DemiApplicationRepository from '../repositories/DemiApplicationRepository.js';
import WorkSessionRepository from '../repositories/WorkSessionRepository.js';

class LecturerService {
    constructor() {
        this.demiApplicationRepository = new DemiApplicationRepository();
        this.workSessionRepository = new WorkSessionRepository();
    }

    async getDashboardSummary(lecturerId) {
        const stats = await LecturerRepository.getDashboardMetrics(lecturerId);
        return { stats };
    }

    async getApplicationsForLecturer(lecturerId) {
        return this.demiApplicationRepository.lecturerFetchApplications(lecturerId);
    }

    async getApplicationById(lecturerId, applicationId) {
        const application = await this.demiApplicationRepository.lecturerFindApplicationById(applicationId);

        if (!application || application.length === 0) {
            throw new Error('Application not found');
        }

        return application;
    }

    async reviewApplication(lecturerId, applicationId, decision) {
        if (!decision) {
            throw new Error('Decision is required');
        }

        return this.demiApplicationRepository.lecturerReviewApplication(applicationId, decision);
    }

    async getSessionsForLecturer(lecturerId) {
        return this.workSessionRepository.fetchSessionsForLecturer(lecturerId);
    }

    async getSessionByIdForLecturer(sessionId) {
        const session = await this.workSessionRepository.fetchSessionByIdForLecturer(sessionId);

        if (!session || session.length === 0) {
            throw new Error('Session not found');
        }

        return session;
    }

    async reviewSession(lecturerId, sessionId, decision) {
        if (!decision) {
            throw new Error('Decision is required');
        }

        return this.workSessionRepository.reviewSessionByLecturer(sessionId, decision);
    }

    async getClaimsSummary(lecturerId) {
        const stats = await LecturerRepository.getClaimsMetrics(lecturerId);
        const claims = await LecturerRepository.getClaims(lecturerId);

        return { stats, claims };
    }

    async getClaimById(lecturerId, claimId) {
        return LecturerRepository.getClaimById(lecturerId, claimId);
    }

    async reviewClaim(lecturerId, claimId, status) {
        if (!status) {
            throw new Error('Status is required');
        }

        return LecturerRepository.reviewClaim(lecturerId, claimId, status);
    }

    async getBudgetsSummary(lecturerId) {
        const stats = await LecturerRepository.getBudgetsMetrics(lecturerId);
        const budgets = await LecturerRepository.getBudgetsSummary(lecturerId);

        return { stats, budgets };
    }

    async getBudgetById(lecturerId, budgetId) {
        return LecturerRepository.getBudgetById(lecturerId, budgetId);
    }
}

export default new LecturerService();