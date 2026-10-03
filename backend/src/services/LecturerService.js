import LecturerRepository from '../repositories/LecturerRepository.js';
import DemiApplicationRepository from '../repositories/DemiApplicationRepository.js';
import WorkSessionRepository from '../repositories/WorkSessionRepository.js';

class LecturerService {
    constructor() {
        this.demiApplicationRepository = new DemiApplicationRepository();
        this.workSessionRepository = new WorkSessionRepository();
    }

    async getLecturerByModule(moduleId) {
        if (!moduleId) {
            throw new Error('moduleId is required');
        }

        return LecturerRepository.getLecturersByModule(moduleId);
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

    async reviewApplication(lecturerId, applicationId, decision, reason, comment) {
        if (!decision) {
            throw new Error('Decision is required');
        }

        return this.demiApplicationRepository.lecturerReviewApplication(applicationId, decision, reason, comment);
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

    async reviewApplication(lecturerId, applicationId, decision, comment) {
        if (!decision) {
            throw new Error('Decision is required');
        }

        return this.demiApplicationRepository.lecturerReviewApplication(applicationId, decision, comment);
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

    async lecturerFetchApplications(lecturerId) {
        const applications = await this.demiApplicationRepository.lecturerFetchApplications(lecturerId);
        
        if(!applications)
            throw new Error('No applications found');

        return applications;
    }

    async lecturerFetchApplicationById(applicationId) {
        const application = await this.demiApplicationRepository.lecturerFindApplicationById(applicationId);

        if(!application)
            throw new Error('Application not found!');

        return application;
    }
  
    async lecturerReviewApplication(applicationId, lecturerDecision) {
        const reviewed = await this.demiApplicationRepository.lecturerReviewApplication(applicationId, lecturerDecision);

        if(!reviewed)
            throw new Error('Application not found!');

        return reviewed;
    }

    async fetchSessionsForLecturer(lecturerId) {
        const sessions =  await this.workSessionRepository.fetchSessionsForLecturer(lecturerId);

        if(!sessions)
            throw new Error("No Sessions found!");

        return sessions;
    }

    async fetchSessionByIdForLecturer(sessionId) {
        const session = await this.workSessionRepository.fetchSessionByIdForLecturer(sessionId);

        if(!session)
            throw new Error("Session not found");

        
        return session;
    }

    async reviewSessionByLecturer(sessionId, approvalStatus) {
        const response = await this.workSessionRepository.reviewSessionByLecturer(sessionId, approvalStatus);

        if(!response) 
            throw new Error('Session not found!');
    
        return response;
    }

    static async getClaimsSummary(lecturerId) {
        const stats = await LecturerRepository.getClaimsMetrics(lecturerId);
        const claims = await LecturerRepository.getClaims(lecturerId);

        return {
            stats,
            claims
        };
    }

    static async getClaimById(lecturerId, claimId) {
        return await LecturerRepository.getClaimById(lecturerId, claimId);
    }

    static async reviewClaim(lecturerId, claimId, status) {
        return await LecturerRepository.reviewClaim(
            lecturerId,
            claimId,
            status
        );
    }

    static async getBudgetsSummary(lecturerId) {
        const stats = await LecturerRepository.getBudgetsMetrics(lecturerId);
        const module_budgets =
            await LecturerRepository.getBudgetsSummary(lecturerId);

        return {
            stats,
            module_budgets
        };
    }

    static async getBudgetById(lecturerId, budgetId) {
        return await LecturerRepository.getBudgetById(
            lecturerId,
            budgetId
        );
    }
    async lecturerFetchApplications(lecturerId) {
        const applications = await this.demiApplicationRepository.lecturerFetchApplications(lecturerId);
        
        if(!applications)
            throw new Error('No applications found');

        return applications;
    }

    async lecturerFetchApplicationById(applicationId) {
        const application = await this.demiApplicationRepository.lecturerFindApplicationById(applicationId);

        if(!application)
            throw new Error('Application not found!');

        return application;
    }
  
    async lecturerReviewApplication(applicationId, lecturerDecision) {
        const reviewed = await this.demiApplicationRepository.lecturerReviewApplication(applicationId, lecturerDecision);

        if(!reviewed)
            throw new Error('Application not found!');

        return reviewed;
    }

    async fetchSessionsForLecturer(lecturerId) {
        const sessions =  await this.workSessionRepository.fetchSessionsForLecturer(lecturerId);

        if(!sessions)
            throw new Error("No Sessions found!");

        return sessions;
    }

    async fetchSessionByIdForLecturer(sessionId) {
        const session = await this.workSessionRepository.fetchSessionByIdForLecturer(sessionId);

        if(!session)
            throw new Error("Session not found");

        
        return session;
    }

    async reviewSessionByLecturer(sessionId, approvalStatus) {
        const response = await this.workSessionRepository.reviewSessionByLecturer(sessionId, approvalStatus);

        if(!response) 
            throw new Error('Session not found!');
    
        return response;
    }

}

export default new LecturerService();