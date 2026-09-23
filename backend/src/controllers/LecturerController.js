import LecturerService from '../services/LecturerService.js';

class LecturerController {

    static async getDashboardSummary(req, res) {
        try {
            const lecturerId = req.user.user_id;

            const data = await LecturerService.getDashboardSummary(lecturerId);

            return res.status(200).json(data);

        } catch (error) {
            console.error('Lecturer dashboard error:', error);

            return res.status(500).json({
                error: error.message
            });
        }
    }

    static async getClaimsSummary(req, res) {
        try {
            const lecturerId = req.user.user_id;

            const data = await LecturerService.getClaimsSummary(lecturerId);

            return res.status(200).json(data);
        } catch (error) {
            console.error('Lecturer claims error:', error);
            return res.status(500).json({ error: error.message });
        }
    }

    static async getClaimById(req, res) {
        try {
            const lecturerId = req.user.user_id;
            const claimId = Number(req.params.claim_id);

            if (!Number.isInteger(claimId) || claimId <= 0) {
                return res.status(400).json({
                    error: 'Claim ID must be a positive integer.'
                });
            }

            const data = await LecturerService.getClaimById(
                lecturerId,
                claimId
            );

            if (!data) {
                return res.status(404).json({
                    error: 'Claim not found.'
                });
            }

            return res.status(200).json({ data });
        } catch (error) {
            console.error('Lecturer claim fetch error:', error);
            return res.status(500).json({ error: error.message });
        }
    }

    static async reviewClaim(req, res) {
        try {
            const lecturerId = req.user.user_id;

            const claimId = Number(req.body?.claim_id);
            const status = req.body?.status;

            if (!Number.isInteger(claimId) || claimId <= 0) {
                return res.status(400).json({
                    error: 'A valid claim_id is required.'
                });
            }

            const allowedStatuses = ['Under Review', 'Verified'];

            if (!allowedStatuses.includes(status)) {
                return res.status(400).json({
                    error: 'Status must be Under Review or Verified.'
                });
            }

            const data = await LecturerService.reviewClaim(
                lecturerId,
                claimId,
                status
            );

            if (!data) {
                return res.status(404).json({
                    error: 'Claim not found or does not belong to this lecturer.'
                });
            }

            return res.status(200).json({
                message: 'Claim reviewed successfully.',
                data
            });
        } catch (error) {
            console.error('Lecturer claim review error:', error);
            return res.status(500).json({ error: error.message });
        }
    }

    static async getBudgetsSummary(req, res) {
        try {
            const lecturerId = req.user.user_id;

            const data = await LecturerService.getBudgetsSummary(lecturerId);

            return res.status(200).json(data);
        } catch (error) {
            console.error('Lecturer budgets error:', error);
            return res.status(500).json({ error: error.message });
        }
    }

    static async getBudgetById(req, res) {
        try {
            const lecturerId = req.user.user_id;
            const budgetId = Number(req.params.budget_id);

            if (!Number.isInteger(budgetId) || budgetId <= 0) {
                return res.status(400).json({
                    error: 'Budget ID must be a positive integer.'
                });
            }

            const data = await LecturerService.getBudgetById(
                lecturerId,
                budgetId
            );

            if (!data) {
                return res.status(404).json({
                    error: 'Budget not found.'
                });
            }

            return res.status(200).json({ data });
        } catch (error) {
            console.error('Lecturer budget fetch error:', error);
            return res.status(500).json({ error: error.message });
        }
    }

}


export default LecturerController;