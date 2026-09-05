import express from 'express';
import UserController from '../controllers/UserController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get(
    '/:id', 
    authenticate, 
    UserController.getUserById.bind(UserController)
);

export default router;