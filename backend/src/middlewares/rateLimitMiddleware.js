import rateLimit from 'express-rate-limit';

// Runs after authenticatePending2FA, so it's keyed per account rather than per IP.
export const twoFactorLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    keyGenerator: (req) => `2fa:${req.pending2fa.user_id}`,
    message: { message: 'Too many attempts. Try again later.' }
});