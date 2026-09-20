import ListingService from '../services/ListingService.js';

class ListingController {
    
    static async getOpenListings(req, res) {
        try {
            const listings = await ListingService.getOpenListings();
            return res.status(200).json(listings);
        } catch (error) {
            console.error('Error fetching open listings:', error);
            return res.status(500).json({ error: error.message });
        }
    }

    static async getListingById(req, res) {
        try {
            const listingId = req.params.Id;
            const listing = await ListingService.getListingById(listingId);
            return res.status(200).json(listing);
        } catch (error) {
            console.error('Error fetching listing by ID:', error);
            return res.status(500).json({ error: error.message });
        }
    }

    static async createListing(req, res) {
        try {
            const listingData = req.body;
            const newListing = await ListingService.createListing(listingData);
            return res.status(201).json(newListing);
        } catch (error) {
            console.error('Error creating listing:', error);
            return res.status(500).json({ error: error.message });
        }
    }

    static async editListing(req, res) {
        try {
            const listingId = req.params.Id;
            const listingData = req.body;
            const updatedListing = await ListingService.editListing(listingId, listingData);
            return res.status(200).json(updatedListing);
        } catch (error) {
            console.error('Error editing listing:', error);
            return res.status(500).json({ error: error.message });
        }
    }
}