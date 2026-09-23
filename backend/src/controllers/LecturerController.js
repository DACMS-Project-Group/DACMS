import LecturerService from '../services/LecturerService.js';
import getAuthUserId from '../utils/getAuthUserId.js';

class LecturerController {
    static async getLecturersByModule(req, res) {
        try {
            const { moduleId } = req.params;

            if (!moduleId) {
                return res.status(400).json({ error: 'moduleId is required.' });
            }

            const lecturers = await LecturerService.getLecturerByModule(moduleId);
            return res.status(200).json(lecturers);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    static async getDashboardSummary(req, res) {
        try {
            const lecturerId = getAuthUserId(req);
            const data = await LecturerService.getDashboardSummary(lecturerId);
            return res.status(200).json(data);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    static async lecturerFetchApplications(req, res) {
        try {
            const lecturerId = getAuthUserId(req);
            const data = await LecturerService.getApplicationsForLecturer(lecturerId);
            return res.status(200).json(data);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    static async lecturerFetchApplicationById(req, res) {
        try {
            const lecturerId = getAuthUserId(req);
            const applicationId = req.params.id;
            const data = await LecturerService.getApplicationById(lecturerId, applicationId);
            return res.status(200).json(data);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    static async lecturerReviewApplication(req, res) {
        try {
            const lecturerId = getAuthUserId(req);
            const applicationId = req.params.id;
            const decision = req.body.decision;

            const data = await LecturerService.reviewApplication(lecturerId, applicationId, decision);
            return res.status(200).json(data);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    static async getLecturerSessions(req, res) {
        try {
            const lecturerId = getAuthUserId(req);
            const data = await LecturerService.getSessionsForLecturer(lecturerId);
            return res.status(200).json(data);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    static async getLecturerSessionById(req, res) {
        try {
            const lecturerId = getAuthUserId(req);
            const sessionId = req.params.id;
            const data = await LecturerService.getSessionByIdForLecturer(sessionId);
            return res.status(200).json(data);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    static async lecturerReviewSession(req, res) {
        try {
            const lecturerId = getAuthUserId(req);
            const sessionId = req.params.id;
            const decision = req.body.decision;

            const data = await LecturerService.reviewSession(lecturerId, sessionId, decision);
            return res.status(200).json(data);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    static async getClaimsSummary(req, res) {
        try {
            const lecturerId = getAuthUserId(req);
            const data = await LecturerService.getClaimsSummary(lecturerId);
            return res.status(200).json(data);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    static async getClaimById(req, res) {
        try {
            const lecturerId = getAuthUserId(req);
            const claimId = req.params.claim_id;
            const data = await LecturerService.getClaimById(lecturerId, claimId);
            return res.status(200).json(data);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    static async reviewClaim(req, res) {
        try {
            const lecturerId = getAuthUserId(req);
            const claimId = req.params.claim_id || req.body.claim_id;
            const status = req.body.status;

            const data = await LecturerService.reviewClaim(lecturerId, claimId, status);
            return res.status(200).json(data);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    static async getBudgetsSummary(req, res) {
        try {
            const lecturerId = getAuthUserId(req);
            const data = await LecturerService.getBudgetsSummary(lecturerId);
            return res.status(200).json(data);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    static async getBudgetById(req, res) {
        try {
            const lecturerId = getAuthUserId(req);
            const budgetId = req.params.budget_id;
            const data = await LecturerService.getBudgetById(lecturerId, budgetId);
            return res.status(200).json(data);
        } catch (error) {
            return res.status(500).json({ error: error.message });
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