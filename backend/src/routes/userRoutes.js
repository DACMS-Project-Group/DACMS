import express from 'express';
import UserController from '../controllers/UserController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/create_user', UserController.createUser.bind(UserController));
router.post('/login', UserController.login.bind(UserController));
router.post('/logout', UserController.logout.bind(UserController));

router.get(
    '/fetch/:id', 
    authenticate, 
    UserController.getUserById.bind(UserController)
);

router.get(
    '/admin', 
    authenticate, 
    (req, res, next) => {
        req.requiredRole = 1;
        res.json( { message: 'Admin access granted' });
    }
);

export default router;