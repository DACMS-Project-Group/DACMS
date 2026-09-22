import remunerationClaimService from '../services/RemunerationClaimService.js';
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