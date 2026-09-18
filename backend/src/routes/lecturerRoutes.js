import express from 'express';

import LecturerController from '../controllers/LecturerController.js';

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

export default router;