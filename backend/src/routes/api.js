import { Router } from 'express';
import metricsRoutes from './metricsRoutes.js';
import userRoutes from './userRoutes.js';
import UserController from '../controllers/UserController.js';

const router = Router();

router.use('/', metricsRoutes);
router.use('/'), userRoutes

router.post('/create/user', (req, res) =>
    UserController.createUser(req, res)
);

router.get('/users/:id', (req, res) =>
    UserController.getUserById(req, res)
);

export default router;