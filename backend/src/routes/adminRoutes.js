import express from 'express';
import AdminController from '../controllers/AdminController.js';

const router = express.Router();

router.get('/dashboard_statistics', AdminController.getDashboardSummary);

export default router;