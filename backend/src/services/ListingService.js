import ListingRepository from '../repositories/ListingRepository.js';
import getAuthUserId from '../utils/getAuthUserId.js';

class ListingService {
    constructor() {
        this.listingRepository = new ListingRepository();
    }

    async getListingsForLecturer(lecturerId) {
        if (!lecturerId) {
            throw new Error('lecturerId is required.');
        }
        const rows = await this.listingRepository.getListingsForLecturer(lecturerId);
        return rows;
    }

    async getListingById(listingId) {
        if (!listingId) {
            throw new Error('listingId is required.');
        }
        const rows = await this.listingRepository.getListingById(listingId);
        return rows;
    }

    async createListing(req, listingData) {
        if (!listingData.moduleId) {
            throw new Error('moduleId is required.');
        }

        if (!listingData.deadline) {
            throw new Error('deadline is required.');
        }

        if (!listingData.minimumGrade) {
            throw new Error('minimumGrade is required.');
        }

        listingData.lecturerId = getAuthUserId(req);

        const rows = await this.listingRepository.createListing(listingData);
        return rows;
    }

    async editListing(req, listingId, listingData) {
        if (!listingId) {
            throw new Error('listingId is required.');
        }

        if (!listingData.moduleId || !listingData.deadline || listingData.minimumGrade == null) {
            throw new Error('moduleId, deadline, and minimumGrade are required.');
        }

        listingData.lecturerId = getAuthUserId(req);

        const rows = await this.listingRepository.editListing(listingId, listingData);
        if (!rows) {
            throw new Error('Listing not found or you do not have permission to edit it.');
        }
        return rows;
    }
}

export default new ListingService();