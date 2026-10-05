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

    static async getAssistantsWithResponsibilities(req, res) {
        const lecturerId = getAuthUserId(req);
        if (!lecturerId) {
            return res.status(401).json({ error: 'Authenticated lecturer ID is required.' });
        }

        try {
            const data = await LecturerService.getAssistantsWithResponsibilities(lecturerId);
            return res.status(200).json(data);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    static async saveAssistantResponsibilities(req, res) {
        const lecturerId = getAuthUserId(req);
        if (!lecturerId) {
            return res.status(401).json({ error: 'Authenticated lecturer ID is required.' });
        }

        const positionId = Number(req.params.position_id);
        if (!Number.isInteger(positionId) || positionId < 1) {
            return res.status(400).json({ error: 'position_id must be a positive integer.' });
        }

        try {
            const data = await LecturerService.saveAssistantResponsibilities(
                lecturerId,
                positionId,
                req.body
            );
            return res.status(200).json({
                message: 'Assistant responsibilities saved successfully.',
                data
            });
        } catch (error) {
            if (error.message === 'Assistant position not found.') {
                return res.status(404).json({ error: error.message });
            }
            if (
                error.message.startsWith('Hour limit') ||
                error.message.startsWith('Responsibilities')
            ) {
                return res.status(400).json({ error: error.message });
            }
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
            const comment = req.body.comment;

            const data = await LecturerService.reviewClaim(
                lecturerId,
                claimId,
                status,
                comment
            );
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