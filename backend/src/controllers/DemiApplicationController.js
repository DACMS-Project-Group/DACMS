import demiApplicationService from '../services/DemiApplicationService.js';
import { getAuthUserId } from '../utils/getAuthUserId.js';

class DemiApplicationController {
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