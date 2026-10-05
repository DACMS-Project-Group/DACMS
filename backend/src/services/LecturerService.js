import LecturerRepository from '../repositories/LecturerRepository.js';
import DemiApplicationRepository from '../repositories/DemiApplicationRepository.js';
import WorkSessionRepository from '../repositories/WorkSessionRepository.js';

const RESPONSIBILITY_LABELS = {
    tutoring: 'Tutoring',
    marking: 'Marking',
    invigilation: 'Invigilation',
    labAssistance: 'Lab Assistance'
};

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

    async getAssistantsWithResponsibilities(lecturerId) {
        const rows = await LecturerRepository.getAssistantsWithResponsibilities(lecturerId);

        return {
            assistants: rows.map((row) => {
                const descriptions = row.Responsibilities.map((description) =>
                    description.toLowerCase()
                );
                const hasResponsibility = (terms) =>
                    descriptions.some((description) =>
                        terms.some((term) => description.includes(term))
                    );

                return {
                    id: Number(row.PositionID),
                    name: row.StudentName,
                    studentNumber: row.StudentNumber,
                    module: row.ModuleCode,
                    hoursWorked: Number(row.HoursWorked ?? 0),
                    hourLimit: Number(row.TotalAllocatedHours ?? 0),
                    responsibilities: {
                        tutoring: hasResponsibility([
                            'tutor',
                            'tutorial',
                            'office hour',
                            'consult',
                            'demonstrat'
                        ]),
                        marking: hasResponsibility(['mark', 'grade', 'assess']),
                        invigilation: hasResponsibility(['invigil']),
                        labAssistance: hasResponsibility(['lab'])
                    }
                };
            })
        };
    }

    async saveAssistantResponsibilities(lecturerId, positionId, update) {
        const { responsibilities, hourLimit } = update ?? {};
        const responsibilityKeys = Object.keys(RESPONSIBILITY_LABELS);
        const numericHourLimit = Number(hourLimit);

        if (
            !Number.isFinite(numericHourLimit) ||
            numericHourLimit < 1 ||
            numericHourLimit > 40
        ) {
            throw new Error('Hour limit must be a number between 1 and 40.');
        }

        if (
            !responsibilities ||
            typeof responsibilities !== 'object' ||
            Array.isArray(responsibilities) ||
            Object.keys(responsibilities).length !== responsibilityKeys.length ||
            responsibilityKeys.some(
                (key) => typeof responsibilities[key] !== 'boolean'
            ) ||
            Object.keys(responsibilities).some(
                (key) => !responsibilityKeys.includes(key)
            )
        ) {
            throw new Error(
                `Responsibilities must include boolean values for: ${responsibilityKeys.join(', ')}.`
            );
        }

        const descriptions = responsibilityKeys
            .filter((key) => responsibilities[key])
            .map((key) => RESPONSIBILITY_LABELS[key]);

        const saved = await LecturerRepository.saveAssistantResponsibilities(
            lecturerId,
            positionId,
            numericHourLimit,
            descriptions
        );

        if (!saved) {
            throw new Error('Assistant position not found.');
        }

        return {
            positionId: saved.positionId,
            hourLimit: saved.hourLimit,
            responsibilities
        };
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

    async reviewClaim(lecturerId, claimId, status, comment) {
        const claimStatus = {
            Approved: 'Approved by Lecturer',
            'Approved by Lecturer': 'Approved by Lecturer',
            Rejected: 'Rejected by Lecturer',
            'Rejected by Lecturer': 'Rejected by Lecturer'
        }[status];

        if (!claimStatus) {
            throw new Error('Status must be Approved or Rejected by Lecturer');
        }

        if (!comment?.trim()) {
            throw new Error('A comment is required when reviewing a claim');
        }

        return LecturerRepository.reviewClaim(
            lecturerId,
            claimId,
            claimStatus,
            comment.trim()
        );
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