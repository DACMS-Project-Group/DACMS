import BaseRepository from "./BaseRepository.js";
import DemiListing from "../models/DemiListing.js";

class ListingRepository extends BaseRepository { 
    constructor() {
        super('"DEMI_LISTING"', DemiListing);
    }

    async getOpenListings() {
        const rows = await this.query(
            `
            SELECT "ListingID", "ModuleID", "Deadline"
            FROM "DEMI_LISTING"
            WHERE "Deadline" > NOW()
            ORDER BY "Deadline" ASC
            `
        );
        return rows.rows; 
    }

    async getListingById(listingId) {
        const rows = await this.query(
            `
            SELECT "ListingID", "ModuleID", "Deadline"
            FROM "DEMI_LISTING"
            WHERE "ListingID" = $1
            `,
            [listingId]
        );
        return rows[0] || null;
    }

    async createListing( {moduleId, lecturerId, deadline, minimumGrade} ) {
        const rows = await this.query(
            `
            INSERT INTO "DEMI_LISTING" ("ModuleID", "LecturerID", "Deadline", "MinimumGrade")
            VALUES ($1, $2, $3, $4)
            RETURNING *
            `,
            [moduleId, lecturerId, deadline, minimumGrade]
        );
        return rows[0] || null;
    }

    async editListing(listingId, {moduleId, lecturerId, deadline, minimumGrade}) {
        const rows = await this.query(
            `
            UPDATE "DEMI_LISTING"
            SET "ModuleID" = $1, "LecturerID" = $2, "Deadline" = $3, "MinimumGrade" = $4
            WHERE "ListingID" = $5
            RETURNING *
            `,
            [moduleId, lecturerId, deadline, minimumGrade, listingId]
        );
        return rows[0] || null;
    }
}

export default ListingRepository;