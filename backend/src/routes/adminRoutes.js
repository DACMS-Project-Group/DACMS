import express from 'express';
import AdminController from '../controllers/AdminController.js';
import {authenticate, authorize} from '../middlewares/authMiddleware.js'

const router = express.Router();

<<<<<<< HEAD
router.get('/dashboard_statistics', authenticate, authorize([3]), AdminController.getDashboardSummary);
=======
router.get('/dashboard_statistics', 
           authenticate, 
           authorize([3]), 
           AdminController.getDashboardSummary
           );
>>>>>>> fb498c160c50690cb45cfd9c0aafb17ef7909ec5

export default router;