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
    '/student/dashboard',
    authenticate,
    StudentDashboardController.getDashboard.bind(StudentDashboardController)
);

// -- Demi Applications ------------------------------------------------------
router.get(
    '/student/listings/open',
    authenticate,
    DemiApplicationController.getOpenListings.bind(DemiApplicationController)
);

router.get(
    '/student/applications',
    authenticate,
    DemiApplicationController.getMyApplications.bind(DemiApplicationController)
);

router.post(
    '/student/applications',
    authenticate,
    DemiApplicationController.apply.bind(DemiApplicationController)
);

// -- Supporting Documents -----------------------------------------------------
router.get(
    '/student/documents',
    authenticate,
    DemiApplicationController.getMyDocuments.bind(DemiApplicationController)
);

router.post(
    '/student/documents',
    authenticate,
    upload.single('file'),
    DemiApplicationController.uploadDocument.bind(DemiApplicationController)
);

// -- Working Hours (Positions & Sessions) --------------------------------------
router.get(
    '/student/positions',
    authenticate,
    WorkSessionController.getMyPositions.bind(WorkSessionController)
);

router.get(
    '/student/positions/:positionId/sessions',
    authenticate,
    WorkSessionController.listSessionsForPosition.bind(WorkSessionController)
);

router.get(
    '/student/positions/:positionId/sessions/:sessionId',
    authenticate,
    WorkSessionController.getSessionDetail.bind(WorkSessionController)
);

router.post(
    '/student/positions/:positionId/sessions/create',
    authenticate,
    WorkSessionController.createSession.bind(WorkSessionController)
);

// -- Remuneration Claims --------------------------------------------------------
router.get(
    '/student/claims',
    authenticate,
    RemunerationClaimController.getMyClaims.bind(RemunerationClaimController)
);

router.get(
    '/student/claims/:id',
    authenticate,
    RemunerationClaimController.getClaimById.bind(RemunerationClaimController)
);

router.post(
    '/student/claims/create',
    authenticate,
    RemunerationClaimController.generateClaim.bind(RemunerationClaimController)
);

// -- Profile ----------------------------------------------------------------
// NOTE: profile is intentionally left pointing at the existing controller for
// now - the schema-mapping decision (how to store the ~30 unmapped
// StudentProfile.jsx fields) is still pending. Only the paths are updated to
// match the team's contract; StudentController itself is unchanged.
router.get(
    '/student/profile/',
    authenticate,
    StudentController.getProfile.bind(StudentController)
);

router.patch(
    '/student/profile/edit',
    authenticate,
    StudentController.updateProfile.bind(StudentController)
);

export default router;
