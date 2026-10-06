import LecturerService from '../services/LecturerService.js';
import NotificationService from '../services/NotificationService.js';
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
            const apps = await LecturerService.lecturerFetchApplications(lecturerId);
            res.status(200).json(apps);
        } catch (error) {
            res.status(500).json( { error : error.message } );
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
            const application = await LecturerService.lecturerFetchApplicationById(req.params.id);
            res.status(200).json( { application : application } );
        } catch (error) {
            res.status(500).json( { error : error.message });
        }
    }

    static async lecturerReviewApplication(req, res) {
        try {
            const applicationId = req.params.id;
            const decision = req.body.decision;
            const comment = req.body.comment;

            const data = await LecturerService.lecturerReviewApplication(applicationId, decision, comment);
            return res.status(200).json(data);
        } catch (error) {
            res.status(500).json( {error : error.message });
        }
    }

    static async getLecturerSessions(req, res) {
        try {
            const lecturerId = getAuthUserId(req);
            if (!lecturerId) {
                return res.status(401).json({ error: 'Authenticated lecturer ID is required.' });
            }

            const sessions = await LecturerService.fetchSessionsForLecturer(lecturerId);
            return res.status(200).json(sessions);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    static async getLecturerSessionById(req, res) {
        try {
            const sessionId = req.params.id;
            const session = await LecturerService.fetchSessionByIdForLecturer(sessionId);
            return res.status(200).json({ session });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    static async lecturerReviewSession(req, res) {
        try {
            const sessionId = req.params.id;
            const reviewedStatus = req.body.decision ?? req.body.reviewedStatus;
            const reviewedSession = await LecturerService.reviewSessionByLecturer(sessionId, reviewedStatus);
            const studentId = await LecturerService.getStudentIdBySession(sessionId);
            await NotificationService.sendNotification({
                recipientId: studentId,
                subject: 'Session Status Updated',
                type: reviewedStatus,
                message: `The status of your session ${sessionId} has been updated to ${reviewedStatus}`
            });
            return res.status(200).json({ reviewedSession });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    static async getClaimsSummary(req, res) {
        try {
            const lecturerId = getAuthUserId(req);
            if (!lecturerId) {
                return res.status(401).json({ error: 'Authenticated lecturer ID is required.' });
            }

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
            console.error('Lecturer claim review error:', error);
            return res.status(500).json({ error: error.message });
        }
    }

    static async getBudgetsSummary(req, res) {
        try {
            const lecturerId = getAuthUserId(req);
            if (!lecturerId) {
                return res.status(401).json({ error: 'Authenticated lecturer ID is required.' });
            }

            const data = await LecturerService.getBudgetsSummary(lecturerId);

            return res.status(200).json(data);
        } catch (error) {
            console.error('Lecturer budgets error:', error);
            return res.status(500).json({ error: error.message });
        }
    }

    static async getBudgetById(req, res) {
        try {
            const lecturerId = getAuthUserId(req);
            if (!lecturerId) {
                return res.status(401).json({ error: 'Authenticated lecturer ID is required.' });
            }

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
