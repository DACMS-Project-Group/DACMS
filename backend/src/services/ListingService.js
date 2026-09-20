import ListingRepository from '../repositories/ListingRepository.js';

class ListingService {
    constructor() {
        this.listingRepository = new ListingRepository();
    }

    async getOpenListings() {
        const rows = await this.listingRepository.getOpenListings();
        return rows;
    }

    async getListingById(listingId) {
        if (!listingId) {
            throw new Error('listingId is required.');
        }
        const rows = await this.listingRepository.getListingById(listingId);
        return rows;
    }

    async createListing(listingData) {
        if (!listingData.moduleId) {
            throw new Error('moduleId is required.');
        }

        if (!listingData.lecturerId) {
            throw new Error('lecturerId is required.');
        }

        if (!listingData.deadline) {
            throw new Error('deadline is required.');
        }

        if (!listingData.minimumGrade) {
            throw new Error('minimumGrade is required.');
        }

        const rows = await this.listingRepository.createListing(listingData);
        return rows;
    }

    async editListing(listingId, listingData) {
        if (!listingId) {
            throw new Error('listingId is required.');
        }

        const rows = await this.listingRepository.editListing(listingId, listingData);
        return rows;
    }
}

export default new ListingService();