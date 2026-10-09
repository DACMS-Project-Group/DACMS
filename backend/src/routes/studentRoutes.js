import express from 'express';
import { authenticate } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/upload.js';

import DemiApplicationController from '../controllers/DemiApplicationController.js';
import WorkSessionController from '../controllers/WorkSessionController.js';
import RemunerationClaimController from '../controllers/RemunerationClaimController.js';
import StudentController from '../controllers/StudentController.js';
import StudentDashboardController from '../controllers/StudentDashboardController.js';
import StudentGradeController from '../controllers/StudentGradeController.js';

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

router.post(
    '/applications/apply-for-assistant',
    authenticate,
    DemiApplicationController.apply.bind(DemiApplicationController)
);

// -- Supporting Documents -----------------------------------------------------
router.get(
    '/documents',
    authenticate,
    DemiApplicationController.getMyDocuments.bind(DemiApplicationController)
);

router.post(
    '/documents',
    authenticate,
    upload.single('file'),
    DemiApplicationController.uploadDocument.bind(DemiApplicationController)
);

// -- Working Hours (Positions & Sessions) --------------------------------------
router.get(
    '/positions',
    authenticate,
    WorkSessionController.getMyPositions.bind(WorkSessionController)
);

router.get(
    '/positions/:positionId/sessions',
    authenticate,
    WorkSessionController.listSessionsForPosition.bind(WorkSessionController)
);

router.get(
    '/positions/:positionId/sessions/:sessionId',
    authenticate,
    WorkSessionController.getSessionDetail.bind(WorkSessionController)
);

router.post(
    '/positions/:positionId/sessions/create',
    authenticate,
    WorkSessionController.createSession.bind(WorkSessionController)
);

// -- Remuneration Claims --------------------------------------------------------
router.get(
    '/claims',
    authenticate,
    RemunerationClaimController.getMyClaims.bind(RemunerationClaimController)
);

router.get(
    '/claims/:id',
    authenticate,
    RemunerationClaimController.getClaimById.bind(RemunerationClaimController)
);

router.post(
    '/claims/create',
    authenticate,
    RemunerationClaimController.generateClaim.bind(RemunerationClaimController)
);

// -- Profile ----------------------------------------------------------------
router.get(
    '/profile/',
    authenticate,
    StudentController.getProfile.bind(StudentController)
);

router.patch(
    '/profile/edit',
    authenticate,
    StudentController.updateProfile.bind(StudentController)
);

// -- Academic Modules & Grades ----------------------------------------------
router.get(
    '/modules',
    authenticate,
    StudentGradeController.getAvailableModules.bind(StudentGradeController)
);

router.get(
    '/grades',
    authenticate,
    StudentGradeController.getMyGrades.bind(StudentGradeController)
);

router.post(
    '/grades',
    authenticate,
    StudentGradeController.saveGrade.bind(StudentGradeController)
);

router.delete(
    '/grades/:gradeId',
    authenticate,
    StudentGradeController.deleteGrade.bind(StudentGradeController)
);

export default router;