import express from 'express';

import LecturerController from '../controllers/LecturerController.js';
import ListingController from '../controllers/ListingController.js';
import DemiApplicationController from '../controllers/DemiApplicationController.js';

import {
    authenticate,
    authorize
} from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get(
    '/dashboard_statistics',
    authenticate,
    authorize([2]),
    LecturerController.getDashboardSummary.bind(LecturerController)
);

router.get(
    '/listings',
    authenticate,
    authorize([2]),
    ListingController.fetchOpenListings.bind(ListingController)
);

router.get(
    '/listings/fetch/:Id',
    authenticate,
    authorize([2]),
    ListingController.fetchListingById.bind(ListingController)
);

router.post(
    '/listings/create',
    authenticate,
    authorize([2]),
    ListingController.createNewListing.bind(ListingController)
);

router.patch(
    '/listings/edit/:Id',
    authenticate,
    authorize([2]),
    ListingController.editOldListing.bind(ListingController)
);

router.get(
    '/applications',
    authenticate,
    authorize([2]),
    DemiApplicationController.lecturerFetchApplications.bind(DemiApplicationController)  
);

export default router;