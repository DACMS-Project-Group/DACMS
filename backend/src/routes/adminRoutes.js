import express from 'express';
import AdminController from '../controllers/AdminController.js';
import {authenticate, authorize} from '../middlewares/authMiddleware.js'

const router = express.Router();

router.get('/dashboard_statistics', 
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

export default router;