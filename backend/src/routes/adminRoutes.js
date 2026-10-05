import express from 'express';
import AdminController from '../controllers/AdminController.js';
import ModuleController from '../controllers/ModuleController.js';
import {authenticate, authorize} from '../middlewares/authMiddleware.js'
import LecturerController from '../controllers/LecturerController.js';

const router = express.Router();

router.get('/dashboard', 
           authenticate, 
           authorize([3]), 
           AdminController.getDashboardSummary
);

router.get('/budgets',
            authenticate,
            authorize([3]),
            AdminController.getBudgetsSummary
);
router.get('/budgets/fetch/:budget_id',
            authenticate,
            authorize([3]),
            AdminController.getBudgetById
);

router.post('/budgets/create',
            authenticate,
            authorize([3]),
            AdminController.createBudget
);

router.put('/budgets/edit/:id',
            authenticate,
            authorize([3]),
            AdminController.editBudget
);

router.get('/claims',
            authenticate,
            authorize([3]),
            AdminController.getClaimsSummary
);

router.get('/claims/export',
            authenticate,
            authorize([3]),
            AdminController.getClaimsForExport
);

router.get('/claims/fetch/:claim_id',
            authenticate,
            authorize([3]),
            AdminController.getClaimById
);

router.patch('/claims/approve/:claim_id',
            authenticate,
            authorize([3]),
            AdminController.approveClaim
);

router.get('/appointments',
            authenticate,
            authorize([3]),
            AdminController.getAppointments
);

router.get('/appointments/fetch/:position_id',
            authenticate,
            authorize([3]),
            AdminController.getPositionById
);

router.patch('/appointments/review/:position_id',
    authenticate,
    authorize([3]),
    AdminController.reviewPosition
);

router.post('/claims/export',
             authenticate,
             authorize([3]),
             AdminController.exportClaims
)

router.get('/modules',
    authenticate,
    authorize([3]),
    ModuleController.getModules
)

router.get('/modules/:moduleId/lecturers',
    authenticate,
    authorize([3]),
    LecturerController.getLecturersByModule
)

export default router;