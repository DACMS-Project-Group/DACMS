import path from 'path';
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

    static async lecturerFetchApplicationDocument(req, res, next) {
        const lecturerId = getAuthUserId(req);
        const applicationId = Number(req.params.applicationId);
        const documentId = Number(req.params.documentId);

        if (!lecturerId) {
            return res.status(401).json({ message: 'Authenticated lecturer ID is required.' });
        }

        if (
            !Number.isInteger(applicationId) ||
            applicationId < 1 ||
            !Number.isInteger(documentId) ||
            documentId < 1
        ) {
            return res.status(400).json({ message: 'Application and document IDs must be positive integers.' });
        }

        try {
            const document = await LecturerService.lecturerFetchApplicationDocument(
                lecturerId,
                applicationId,
                documentId
            );

            if (!document) {
                return res.status(404).json({ message: 'Document not found.' });
            }

            res.type(path.extname(document.fileName));
            res.setHeader(
                'Content-Disposition',
                `inline; filename*=UTF-8''${encodeURIComponent(document.fileName)}`
            );
            res.setHeader('X-Content-Type-Options', 'nosniff');
            return res.send(document.content);
        } catch (error) {
            if (error.code === 'ENOENT') {
                return res.status(404).json({ message: 'The document file is no longer available.' });
            }
            return next(error);
        }
    }

    static async lecturerReviewApplication(req, res) {
        const lecturerId = getAuthUserId(req);
        if (!lecturerId) {
            return res.status(401).json({ error: 'Authenticated lecturer ID is required.' });
        }

        const applicationId = Number(req.params.id);
        if (!Number.isInteger(applicationId) || applicationId < 1) {
            return res.status(400).json({ error: 'Application ID must be a positive integer.' });
        }

        try {
            const decision = req.body.decision;
            const comment = req.body.comment;

            const data = await LecturerService.lecturerReviewApplication(
                lecturerId,
                applicationId,
                decision,
                comment
            );
            const details = await LecturerService.getApplicationNotificationDetails(applicationId);
            const decisionMessage = {
                Approved: 'Your application has been approved by the lecturer and is awaiting administrator review. This is not a final appointment.',
                Rejected: 'Your application was not approved. Review the lecturer comment and contact the lecturer if you need clarification.',
                Returned: 'Your application was returned for changes. Review the lecturer comment and update your application.'
            }[decision];
            await NotificationService.sendNotification({
                recipientId: details.StudentID,
                subject: `Application ${decision.toLowerCase()}`,
                type: `Application ${decision}`,
                message:
                    `${decisionMessage} Application ` +
                    `${details.ApplicationReference || `#${details.ApplicationID}`} for ` +
                    `${details.ModuleCode}. Lecturer comment: ${comment?.trim() || 'No comment provided.'} ` +
                    `View /application-detail/${details.ApplicationID}.`
            });
            if (decision === 'Approved') {
                const administratorIds = await NotificationService.getAdministratorIds();
                await Promise.all(administratorIds.map((recipientId) =>
                    NotificationService.sendNotification({
                        recipientId,
                        subject: 'Assistant appointment awaiting review',
                        type: 'Position Review',
                        message:
                            `Application ${details.ApplicationReference || `#${details.ApplicationID}`} ` +
                            `for ${details.StudentName} (${details.StudentNumber}) in ${details.ModuleCode} ` +
                            `has lecturer approval and is awaiting your review. ` +
                            `Open /appointment-approvals.`
                    })
                ));
            }
            return res.status(200).json(data);
        } catch (error) {
            if (error.message.startsWith('Decision must be')) {
                return res.status(400).json({ error: error.message });
            }
            if (error.message === 'Application not found') {
                return res.status(404).json({ error: error.message });
            }
            if (error.message === 'Position has already been reviewed by admin') {
                return res.status(409).json({ error: error.message });
            }
            if (error.message === 'Multiple positions found for application') {
                return res.status(409).json({ error: error.message });
            }
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
            const details = await LecturerService.getSessionNotificationDetails(sessionId);
            const rejectionReason = req.body.reason ?? req.body.comment;
            const decision = reviewedStatus ? 'verified' : 'rejected';
            await NotificationService.sendNotification({
                recipientId: details.StudentID,
                subject: `Work session ${decision}`,
                type: `Work Session ${reviewedStatus ? 'Verified' : 'Rejected'}`,
                message:
                    `Your ${details.ModuleCode} work session on ${details.SessionDate} ` +
                    `from ${details.StartTime} to ${details.EndTime} ` +
                    `(${details.ActivityDescription}, ${details.TotalHoursWorked} hours) was ${decision}.` +
                    (rejectionReason ? ` Reason: ${rejectionReason}` : '') +
                    ` View /session-detail/${details.SessionID}.`
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
            if (data) {
                const decision = data.ClaimStatus === 'Approved by Lecturer' ? 'approved' : 'rejected';
                const nextStep = decision === 'approved'
                    ? 'The claim has been forwarded for administrator review.'
                    : 'Review the comment and contact your lecturer if you need clarification.';
                await NotificationService.sendNotification({
                    recipientId: data.StudentID,
                    subject: `Remuneration claim ${decision}`,
                    type: `Claim ${decision === 'approved' ? 'Approved' : 'Rejected'}`,
                    message:
                        `Claim ${data.ClaimReferenceNumber} for ${data.ModuleCode} was ${decision} by your lecturer. ` +
                        `${nextStep} Lecturer comment: ${data.LecturerComment || 'No comment provided.'} ` +
                        `View /claim-detail/${data.ClaimID}.`
                });
            }
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

            return res.status(200).json({ data: [data] });
        } catch (error) {
            console.error('Lecturer budget fetch error:', error);
            return res.status(500).json({ error: error.message });
        }
    }

}


export default LecturerController;
