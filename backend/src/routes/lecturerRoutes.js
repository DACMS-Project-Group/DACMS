import express from 'express';

import LecturerController from '../controllers/LecturerController.js';
import ListingController from '../controllers/ListingController.js';

import {
    authenticate,
    authorize
} from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get(
    '/dashboard_statistics',
    authenticate,
    authorize([2]),
    LecturerController.getDashboardSummary
);

router.get(
    '/listings/open',
    authenticate,
    authorize([2]),
    ListingController.getOpenListings
);

router.get(
    '/listings/:Id',
    authenticate,
    authorize([2]),
    ListingController.getListingById
);

router.post(
    '/listings/create',
    authenticate,
    authorize([2]),
    ListingController.createListing
);

router.patch(
    '/listings/edit/:Id',
    authenticate,
    authorize([2]),
    ListingController.editListing
);
export default router;