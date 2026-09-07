import { Router } from 'express';
import metricsRoutes from './metricsRoutes.js';
import userRoutes from './userRoutes.js';
import UserController from '../controllers/UserController.js';

const router = Router();

router.use('/', metricsRoutes);
router.use('/', userRoutes);

router.post('/create/user', (req, res) =>
    UserController.createUser(req, res)
);

router.post('/users/login', (req, res) => 
    UserController.login(req, res)
);

router.post('/users/logout', (req, res) =>
    UserController.logout(req, res)
);

router.get('/users/fetch/:id', (req, res) =>
    UserController.getUserById(req, res)
);

export default router;