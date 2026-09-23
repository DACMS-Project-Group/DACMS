import express from 'express';
import { getUserById } from './userController.js';
import { authenticate } from './auth.js';

const router = express.Router();

router.get('/:id', authenticate, getUserById);

export default router;