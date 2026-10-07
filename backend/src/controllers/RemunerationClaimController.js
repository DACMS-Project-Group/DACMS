import remunerationClaimService from '../services/RemunerationClaimService.js';
import NotificationService from '../services/NotificationService.js';
import { getAuthUserId } from '../utils/getAuthUserId.js';

class RemunerationClaimController {
    async getMyClaims(req, res, next) {
        try {
            const studentId = getAuthUserId(req);
            const claims = await remunerationClaimService.listClaimsForStudent(studentId);
            res.json({ claims });
        } catch (err) {
            next(err);
        }
    }

    async getClaimById(req, res, next) {
        try {
            const studentId = getAuthUserId(req);
            const { id } = req.params;

            const claim = await remunerationClaimService.getClaimById(studentId, id);
            res.json({ claim });
        } catch (err) {
            if (err.message.includes('not found')) {
                return res.status(404).json({ message: err.message });
            }
            next(err);
        }
    }

    async generateClaim(req, res, next) {
        try {
            const studentId = getAuthUserId(req);
            const { applicationId } = req.body;

            if (!applicationId) {
                return res.status(400).json({ message: 'applicationId is required.' });
            }

            const claim = await remunerationClaimService.generateClaim(studentId, applicationId);
            const details = await remunerationClaimService.getClaimNotificationDetails(claim.claim_id);
            const periodStart = details.PeriodStartDate
                ? new Date(details.PeriodStartDate).toISOString().slice(0, 10)
                : 'the previous claim';
            const periodEnd = new Date(details.PeriodEndDate).toISOString().slice(0, 10);
            await NotificationService.sendNotification({
                recipientId: details.LecturerID,
                subject: 'Remuneration claim awaiting review',
                type: 'Claim Review',
                message:
                    `Claim ${details.ClaimReferenceNumber} from ${details.StudentName} ` +
                    `(${details.StudentNumber}) for ${details.ModuleCode} covers ${periodStart} to ${periodEnd}, ` +
                    `${details.TotalHoursClaimed} hours, and R${Number(details.TotalClaimAmount).toFixed(2)}. ` +
                    `Review it at /review-claims.`
            });
            res.status(201).json({ claim });
        } catch (err) {
            if (
                err.message.includes('does not belong') ||
                err.message.includes('No approved')
            ) {
                return res.status(400).json({ message: err.message });
            }
            next(err);
        }
    }
}

export default new RemunerationClaimController();