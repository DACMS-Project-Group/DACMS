import pool from '../config/db.js'

class ListingRepository { 
    static async getOpenListings() {
        const rows = await this.query(
            `
            SELECT "ListingID", "ModuleID", "Deadline"
            FROM "DEMI_LISTING"
            WHERE "Deadline" > NOW()
            ORDER BY "Deadline" ASC
            `
        )
        return rows 
    }

    static async getListingById(listingId) {
        const rows = await this.query(
            `
            SELECT "ListingID", "ModuleID", "Deadline"
            FROM "DEMI_LISTING"
            WHERE "ListingID" = $1
            `,
            [listingId]
        )
        return rows[0] || null
    }

    static async createListing( {moduleId, lecturerId, deadline, minimumGrade} ) {
        const rows = await this.query(
            `
            INSERT INTO "DEMI_LISTING" ("ModuleID", "LecturerID", "Deadline", "MinimumGrade")
            VALUES ($1, $2, $3, $4)
            RETURNING *
            `,
            [moduleId, lecturerId, deadline, minimumGrade]
        )
        return rows[0] || null
    }

    static async editListing(listingId, {moduleId, lecturerId, deadline, minimumGrade}) {
        const rows = await this.query(
            `
            UPDATE "DEMI_LISTING"
            SET "ModuleID" = $1, "LecturerID" = $2, "Deadline" = $3, "MinimumGrade" = $4
            WHERE "ListingID" = $5
            RETURNING *
            `,
            [moduleId, lecturerId, deadline, minimumGrade, listingId]
        )
        return rows[0] || null
    }
}