import workSessionService from '../services/WorkSessionService.js';
import NotificationService from '../services/NotificationService.js';
import { getAuthUserId } from '../utils/getAuthUserId.js';

class WorkSessionController {

<<<<<<< HEAD
    async getLecturerSessions(req, res) {
        try {
            const lecturerId = getAuthUserId(req);
            const sessions = await workSessionService.fetchSessionsForLecturer(lecturerId);
            return res.status(200).json(sessions);
        } catch (error) {
            return res.status(500).json(error.message);
        }
        
    }

    async getLecturerSessionById(req, res) {
        try{
            const sessionId = req.params.id;
            const session = await workSessionService.fetchSessionByIdForLecturer(sessionId);
            return res.status(200).json({ session });
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

    async lecturerReviewSession(req, res) {
        try {
            const sessionId = req.params.id;
            const reviewedStatus = req.body.decision;
            const reviewedSession  = await workSessionService.reviewSessionByLecturer(sessionId, reviewedStatus);
            const studentId = await workSessionService.getStudentIdBySession(sessionId);
            const notification = await NotificationService.sendNotification( {
                recipientId : studentId, 
                title : "Session Status Updated", 
                type : reviewedStatus,
                message : `The status of your session ${sessionId} has been updated to ${reviewedStatus}` 
            } )
            return res.status(200).json( {reviewedSession} );
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

=======
>>>>>>> fb51e5e (Neil refactoring)
    async getMyPositions(req, res, next) {
        try {
            const studentId = getAuthUserId(req);
            const positions = await workSessionService.listActivePositions(studentId);
            res.json({ positions });
        } catch (err) {
            next(err);
        }
    }

    async getMySessions(req, res, next) {
        try {
            const studentId = getAuthUserId(req);
            const sessions = await workSessionService.listSessionsForStudent(studentId);
            res.json({ sessions });
        } catch (err) {
            next(err);
        }
    }

    async clockIn(req, res, next) {
        try {
            const studentId = getAuthUserId(req);
            const { positionId } = req.params;

            const session = await workSessionService.clockIn(studentId, positionId);
            res.status(201).json({ session });
        } catch (err) {
            if (err.message.includes('does not belong') || err.message.includes('already clocked in')) {
                return res.status(400).json({ message: err.message });
            }
            next(err);
        }
    }

    async clockOut(req, res, next) {
        try {
            const studentId = getAuthUserId(req);
            const { sessionId } = req.params;

            const session = await workSessionService.clockOut(studentId, sessionId);
            res.json({ session });
        } catch (err) {
            if (err.message.includes('does not belong') || err.message.includes('not currently open')) {
                return res.status(400).json({ message: err.message });
            }
            next(err);
        }
    }
}

export default new WorkSessionController();
