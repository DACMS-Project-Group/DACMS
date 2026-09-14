import express from 'express';
import AdminController from '../controllers/AdminController.js';
import {authenticate} from '../middlewares/authMiddleware.js'

const router = express.Router();

<<<<<<< HEAD
router.get(
    '/dashboard_statistics', 
    AdminController.getDashboardSummary
);
=======
router.get('/dashboard_statistics', authenticate, AdminController.getDashboardSummary);
>>>>>>> df401c0 (Add authentication to admin dashboard fetch request)

export default router;