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
    '/students/dashboard',
    authenticate,
    StudentDashboardController.getDashboard.bind(StudentDashboardController)
);

// -- Demi Applications ------------------------------------------------------
router.get(
    '/students/listings/open',
    authenticate,
    DemiApplicationController.getOpenListings.bind(DemiApplicationController)
);

router.get(
    '/students/applications',
    authenticate,
    DemiApplicationController.getMyApplications.bind(DemiApplicationController)
);

router.post(
    '/students/applications',
    authenticate,
    DemiApplicationController.apply.bind(DemiApplicationController)
);

// -- Supporting Documents -----------------------------------------------------
router.post(
    '/students/documents',
    authenticate,
    upload.single('file'),
    DemiApplicationController.uploadDocument.bind(DemiApplicationController)
);

router.get(
    '/students/documents',
    authenticate,
    DemiApplicationController.getMyDocuments.bind(DemiApplicationController)
);

// -- Working Hours ------------------------------------------------------------
router.get(
    '/students/positions',
    authenticate,
    WorkSessionController.getMyPositions.bind(WorkSessionController)
);

router.get(
    '/students/sessions',
    authenticate,
    WorkSessionController.getMySessions.bind(WorkSessionController)
);

router.post(
    '/students/positions/:positionId/sessions/clock-in',
    authenticate,
    WorkSessionController.clockIn.bind(WorkSessionController)
);

router.patch(
    '/students/sessions/:sessionId/clock-out',
    authenticate,
    WorkSessionController.clockOut.bind(WorkSessionController)
);

// -- Remuneration Claims --------------------------------------------------------
router.get(
    '/students/claims',
    authenticate,
    RemunerationClaimController.getMyClaims.bind(RemunerationClaimController)
);

router.post(
    '/students/applications/:applicationId/claims',
    authenticate,
    RemunerationClaimController.generateClaim.bind(RemunerationClaimController)
);

// -- Profile --------------------------------------------------------------------
router.get(
    '/students/profile',
    authenticate,
    StudentController.getProfile.bind(StudentController)
);

router.patch(
    '/students/profile',
    authenticate,
    StudentController.updateProfile.bind(StudentController)
);

export default router;
