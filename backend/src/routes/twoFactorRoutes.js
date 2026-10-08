import express from 'express';
import TwoFactorController from '../controllers/TwoFactorController.js';
import { authenticatePending2FA } from '../middlewares/authMiddleware.js';
import { twoFactorLimiter } from '../middlewares/rateLimitMiddleware.js';

const router = express.Router();

router.post(
    '/setup',
    authenticatePending2FA,
    twoFactorLimiter,
    TwoFactorController.startSetup.bind(TwoFactorController)
);

router.post(
    '/setup/confirm',
    authenticatePending2FA,
    twoFactorLimiter,
    TwoFactorController.confirmSetup.bind(TwoFactorController)
);

router.post(
    '/verify',
    authenticatePending2FA,
    twoFactorLimiter,
    TwoFactorController.verifyLogin.bind(TwoFactorController)
);

export default router;