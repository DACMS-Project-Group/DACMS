import express from 'express';
import AdminController from '../controllers/AdminController.js';
import {authenticate, authorize} from '../middlewares/authMiddleware.js'

const router = express.Router();

router.get('/dashboard_statistics', 
           authenticate, 
           authorize([3]), 
           AdminController.getDashboardSummary
           );

export default router;