import DemiApplicationRepository from '../repositories/DemiApplicationRepository.js';

class DemiApplicationService {
    constructor() {
        this.demiApplicationRepository = new DemiApplicationRepository();
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
