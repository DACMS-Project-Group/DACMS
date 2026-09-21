import express from 'express';
import { authenticate } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/upload.js';

import DemiApplicationController from '../controllers/DemiApplicationController.js';
import WorkSessionController from '../controllers/WorkSessionController.js';
import RemunerationClaimController from '../controllers/RemunerationClaimController.js';
import StudentController from '../controllers/StudentController.js';
import StudentDashboardController from '../controllers/StudentDashboardController.js';

const router = express.Router();

// -- Dashboard ------------------------------------------------------------
router.get(
    '/dashboard',
    authenticate,
    StudentDashboardController.getDashboard.bind(StudentDashboardController)
);

// -- Demi Applications ------------------------------------------------------
router.get(
    '/listings/open',
    authenticate,
    DemiApplicationController.getOpenListings.bind(DemiApplicationController)
);

router.get(
    '/applications',
    authenticate,
    DemiApplicationController.getMyApplications.bind(DemiApplicationController)
);

router.post(
    '/applications',
    authenticate,
    DemiApplicationController.apply.bind(DemiApplicationController)
);

// -- Supporting Documents -----------------------------------------------------
router.post(
    '/documents',
    authenticate,
    upload.single('file'),
    DemiApplicationController.uploadDocument.bind(DemiApplicationController)
);

router.get(
    '/documents',
    authenticate,
    DemiApplicationController.getMyDocuments.bind(DemiApplicationController)
);

// -- Working Hours ------------------------------------------------------------
router.get(
    '/positions',
    authenticate,
    WorkSessionController.getMyPositions.bind(WorkSessionController)
);

router.get(
    '/sessions',
    authenticate,
    WorkSessionController.getMySessions.bind(WorkSessionController)
);

router.post(
    '/positions/:positionId/sessions/clock-in',
    authenticate,
    WorkSessionController.clockIn.bind(WorkSessionController)
);

router.patch(
    '/sessions/:sessionId/clock-out',
    authenticate,
    WorkSessionController.clockOut.bind(WorkSessionController)
);

// -- Remuneration Claims --------------------------------------------------------
router.get(
    '/claims',
    authenticate,
    RemunerationClaimController.getMyClaims.bind(RemunerationClaimController)
);

router.get(
    '/claims/:claimId',
    authenticate,
    RemunerationClaimController.getClaimById.bind(RemunerationClaimController)
);
router.post(
    '/applications/:applicationId/claims',
    authenticate,
    RemunerationClaimController.generateClaim.bind(RemunerationClaimController)
);

// -- Profile --------------------------------------------------------------------
router.get(
    '/profile',
    authenticate,
    StudentController.getProfile.bind(StudentController)
);

router.patch(
    '/profile',
    authenticate,
    StudentController.updateProfile.bind(StudentController)
);

export default router;
