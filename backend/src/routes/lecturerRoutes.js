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

router.get(
    '/claims',
    authenticate,
    authorize([2]),
    LecturerController.getClaimsSummary
);

router.get(
    '/claims/fetch/:claim_id',
    authenticate,
    authorize([2]),
    LecturerController.getClaimById
);

router.patch(
    '/claims/review',
    authenticate,
    authorize([2]),
    LecturerController.reviewClaim
);

router.get(
    '/budgets',
    authenticate,
    authorize([2]),
    LecturerController.getBudgetsSummary
);

router.get(
    '/budgets/fetch/:budget_id',
    authenticate,
    authorize([2]),
    LecturerController.getBudgetById
);

export default router;