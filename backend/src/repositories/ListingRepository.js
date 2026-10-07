import BaseRepository from "./BaseRepository.js";
import DemiListing from "../models/DemiListing.js";

class ListingRepository extends BaseRepository { 
    constructor() {
        super('"DEMI_LISTING"', DemiListing);
    }

    async getListingsForLecturer(lecturerId) {
        const rows = await this.query(
            `
            SELECT
                l."ListingID",
                l."ModuleID",
                m."ModuleCode",
                m."ModuleName",
                l."Deadline",
                l."MinimumGrade"
            FROM "DEMI_LISTING" l
            JOIN "NWU_MODULE" m
                ON m."ModuleID" = l."ModuleID"
            WHERE l."LecturerID" = $1
            ORDER BY
                CASE WHEN l."Deadline" > NOW() THEN 0 ELSE 1 END,
                l."Deadline" ASC
            `,
            [lecturerId]
        );
        return rows; 
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
            SET "ModuleID" = $1, "Deadline" = $2, "MinimumGrade" = $3
            WHERE "ListingID" = $4
              AND "LecturerID" = $5
            RETURNING *
            `,
            [moduleId, deadline, minimumGrade, listingId, lecturerId]
        );
        return rows[0] || null;
    }
}

export default ListingRepository;