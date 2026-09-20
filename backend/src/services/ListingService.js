import listingRepository from '../repositories/ListingRepository.js';

class ListingService {
    constructor() {
        this.listingRepository = new listingRepository();
    }

    async getOpenListings() {
        return this.listingRepository.getOpenListings();
    }

    async getListingById(listingId) {
        if (!listingId) {
            throw new Error('listingId is required.');
        }

        return this.listingRepository.getListingById(listingId);
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

        return this.listingRepository.createListing(listingData);
    }

    async editListing(listingId, listingData) {
        if (!listingId) {
            throw new Error('listingId is required.');
        }

        return this.listingRepository.editListing(listingId, listingData);
    }
}