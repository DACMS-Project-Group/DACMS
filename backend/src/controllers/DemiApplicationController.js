import demiApplicationService from '../services/DemiApplicationService.js';
import NotificationService   from '../services/NotificationService.js';
import { getAuthUserId } from '../utils/getAuthUserId.js';

class DemiApplicationController {

    async lecturerFetchApplications(req, res) {
        try {
            const lecturerId = getAuthUserId(req);
            const apps = await demiApplicationService.lecturerFetchApplications(lecturerId);
            res.status(200).json(apps);
        } catch (error) {
            res.status(500).json( { error : error.message } );
        }
    }

    async lecturerFetchApplicationById(req, res) {
        try {
            const application = await demiApplicationService.lecturerFetchApplicationById(req.params.id);
            res.status(200).json( { application : application } );
        } catch (error) {
            res.status(500).json( { error : error.message });
        }
    }

    async lecturerReviewApplication(req, res) {
        try {
            const applicationId = req.params.id;
            const decision = req.body.decision;
            const reviewedApp = await demiApplicationService.lecturerReviewApplication(applicationId, decision);
            const studentId = await demiApplicationService.getStudentIdFromApplication(applicationId);
            const notification = await NotificationService.sendNotification( {
                recipientId : studentId,
                title : "Application Update",
                type : decision || "none",
                message : `Status of application ${applicationId} has been changed to ${decision}`
            } );

            res.status(200).json( {
                application : reviewedApp,
                notification : notification
            } );
        } catch (error) {
            res.status(500).json( {error : error.message });
        }
    }

    async getOpenListings(req, res, next) {
        try {
            const listings = await demiApplicationService.listOpenListings(studentId);
            res.json({ listings });
        } catch (err) {
            next(err);
        }
    }

    async getMyApplications(req, res, next) {
        try {
            const studentId = getAuthUserId(req);
            const applications = await demiApplicationService.listApplicationsForStudent(studentId);
            res.json({ applications });
        } catch (err) {
            next(err);
        }
    }

    async apply(req, res, next) {
        try {
            const studentId = getAuthUserId(req);
            const { listingId } = req.body;

            const application = await demiApplicationService.applyForListing(studentId, listingId);
            res.status(201).json({ application });
        } catch (err) {
            // Known validation errors -> 400
            if (
                err.message.includes('already applied') ||
                err.message.includes('required') ||
                err.message.includes('does not exist') ||
                err.message.includes('deadline')
            ) {
                return res.status(400).json({ message: err.message });
            }
            next(err);
        }
    }

    async uploadDocument(req, res, next) {
        try {
            const studentId = getAuthUserId(req);
            const { documentType } = req.body;

            if (!req.file) {
                return res.status(400).json({ message: 'No file was uploaded.' });
            }

            const document = await demiApplicationService.addSupportingDocument(studentId, {
                documentType,
                filePath: req.file.path,
            });

            res.status(201).json({ document });
        } catch (err) {
            if (err.message.includes('required')) {
                return res.status(400).json({ message: err.message });
            }
            next(err);
        }
    }

    async getMyDocuments(req, res, next) {
        try {
            const studentId = getAuthUserId(req);
            const documents = await demiApplicationService.listDocumentsForStudent(studentId);
            res.json({ documents });
        } catch (err) {
            next(err);
        }
    }
}

export default new DemiApplicationController();