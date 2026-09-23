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

        return {
            stats
        };
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