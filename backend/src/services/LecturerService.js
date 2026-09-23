import LecturerRepository from '../repositories/LecturerRepository.js';

class LecturerService {

    static async getDashboardSummary(lecturerId) {
        const stats = await LecturerRepository.getDashboardMetrics(lecturerId);

        return {
            stats
        };
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
}

export default LecturerService;