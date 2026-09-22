import workSessionService from '../services/WorkSessionService.js';
import { getAuthUserId } from '../utils/getAuthUserId.js';

class WorkSessionController {
    async getMyPositions(req, res, next) {
        try {
            const studentId = getAuthUserId(req);
            const positions = await workSessionService.listActivePositions(studentId);
            res.json({ positions });
        } catch (err) {
            next(err);
        }
    }

    async createSession(req, res, next) {
        try {
            const studentId = getAuthUserId(req);
            const { positionId } = req.params;
            const { date, activity, startTime, endTime } = req.body;

            const session = await workSessionService.recordSession(studentId, positionId, {
                date,
                activity,
                startTime,
                endTime,
            });

            res.status(201).json({ session });
        } catch (err) {
            if (
                err.message.includes('does not belong') ||
                err.message.includes('required') ||
                err.message.includes('End time') ||
                err.message.includes('exceeds your remaining') ||
                err.message.includes('must be valid')
            ) {
                return res.status(400).json({ message: err.message });
            }
            next(err);
        }
    }

    async listSessionsForPosition(req, res, next) {
        try {
            const studentId = getAuthUserId(req);
            const { positionId } = req.params;

            const sessions = await workSessionService.listSessionsForPosition(studentId, positionId);
            res.json({ sessions });
        } catch (err) {
            if (err.message.includes('does not belong')) {
                return res.status(400).json({ message: err.message });
            }
            next(err);
        }
    }

    async getSessionDetail(req, res, next) {
        try {
            const studentId = getAuthUserId(req);
            const { sessionId } = req.params;

            const session = await workSessionService.getSessionDetail(studentId, sessionId);
            res.json({ session });
        } catch (err) {
            if (err.message.includes('does not belong') || err.message.includes('not found')) {
                return res.status(404).json({ message: err.message });
            }
            next(err);
        }
    }
}

export default new WorkSessionController();