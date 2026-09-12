import { Router } from 'express';
import metricsRoutes from './metricsRoutes.js';
import userRoutes from './userRoutes.js';
import adminRoutes from './adminRoutes.js';
import UserController from '../controllers/UserController.js';
import AdminController from '../controllers/AdminController.js';

const router = Router();

router.use('/', metricsRoutes);
router.use('/', userRoutes);
router.use('/admin', adminRoutes);

router.post('/users/create', (req, res) =>
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

router.get('/users/perms', (req, res) => {
    UserController.checkUserPerms(req, res);
});

export default router;