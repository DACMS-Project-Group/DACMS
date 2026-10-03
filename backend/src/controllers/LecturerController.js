import LecturerService from '../services/LecturerService.js';
import getAuthUserId from '../utils/getAuthUserId.js';

class LecturerController {
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
}

export default LecturerController;