import DemiApplicationRepository from '../repositories/DemiApplicationRepository.js';

class DemiApplicationService {
    constructor() {
        this.demiApplicationRepository = new DemiApplicationRepository();
    }

    async lecturerFetchApplications(lecturerId) {
        const applications = this.demiApplicationRepository.lecturerFetchApplications(lecturerId);
        
        if(!applications)
            throw new Error('No applications found');

        return applications;
    }

    async lecturerFetchApplicationById(applicationId) {
        const application =  this.demiApplicationRepository.lecturerFindApplicationById(applicationId);

        if(!application)
            throw new Error('Application not found!');

        return application;
    }
  
    async lecturerReviewApplication(applicationId, lecturerDecision) {
        const reviewed =  this.demiApplicationRepository.lecturerReviewApplication(applicationId, lecturerDecision);

        if(!reviewed)
            throw new Error('Application not found!');

        return reviewed;
    }

    async getStudentIdFromApplication(applicationId) {
        const studentId = this.demiApplicationRepository.getStudentIdFromApplication(applicationId);

        if(!studentId)
            throw new Error("Student not found!");

        return studentId;
    }

    async listOpenListings() {
        return this.demiApplicationRepository.findOpenListings();
    }

    async listApplicationsForStudent(studentId) {
        return this.demiApplicationRepository.findByStudentId(studentId);
    }

    async applyForListing(studentId, listingId) {
        if (!listingId) {
            throw new Error('listingId is required.');
        }

        const listing = await this.demiApplicationRepository.findListingById(listingId);
        if (!listing) {
            throw new Error('That listing does not exist.');
        }

        if (new Date(listing.Deadline) <= new Date()) {
            throw new Error('The application deadline for this listing has passed.');
        }

        const existing = await this.demiApplicationRepository.findExisting(studentId, listingId);
        if (existing) {
            throw new Error('You have already applied to this listing.');
        }

        const verificationEligibilityStatus = await this.demiApplicationRepository.checkEligibility(
            studentId,
            listingId
        );

        return this.demiApplicationRepository.create({
            studentId,
            listingId,
            verificationEligibilityStatus,
        });
    }

    async addSupportingDocument(studentId, { documentType, filePath }) {
        if (!documentType || !filePath) {
            throw new Error('documentType and an uploaded file are required.');
        }

        return this.demiApplicationRepository.addSupportingDocument({
            studentId,
            documentType,
            filePath,
        });
    }

    async listDocumentsForStudent(studentId) {
        return this.demiApplicationRepository.findDocumentsByStudentId(studentId);
    }
}

export default new DemiApplicationService();