import express from 'express';
import AdminController from '../controllers/AdminController.js';
import {authenticate} from '../middlewares/authMiddleware.js'

const router = express.Router();

router.get('/dashboard_statistics', authenticate, AdminController.getDashboardSummary);

export default router;