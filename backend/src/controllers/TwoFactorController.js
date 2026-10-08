import twoFactorService from '../services/TwoFactorService.js';
import { issueSessionCookie, clearPendingCookie } from '../utils/sessionCookies.js';

function handleError(err, res, next) {
    if (err.message.includes('not found')) {
        return res.status(404).json({ message: err.message });
    }
    if (err.message.includes('already configured')) {
        return res.status(409).json({ message: err.message });
    }
    if (err.message.includes('Invalid code')) {
        return res.status(401).json({ message: err.message });
    }
    if (err.message.includes('not been')) {
        return res.status(400).json({ message: err.message });
    }
    next(err);
}

class TwoFactorController {
    async startSetup(req, res, next) {
        try {
            const result = await twoFactorService.startSetup(req.pending2fa.user_id);
            res.json(result);
        } catch (err) {
            handleError(err, res, next);
        }
    }

    async confirmSetup(req, res, next) {
        try {
            const result = await twoFactorService.confirmSetup(req.pending2fa.user_id, req.body?.token);
            res.json({
                message: 'Two-factor authentication enabled. Save these backup codes now - they will not be shown again.',
                backupCodes: result.backupCodes
            });
        } catch (err) {
            handleError(err, res, next);
        }
    }

    // Used for both first login after setup and every login thereafter.
    async verifyLogin(req, res, next) {
        try {
            const user = await twoFactorService.verifyLogin(req.pending2fa.user_id, req.body?.token);

            clearPendingCookie(res);
            issueSessionCookie(res, { user_id: user.user_id, role_id: user.role_id } );

            res.status(200).json({
                message: 'Login Successful',
                user: { id: user.user_id, email: user.email, role_id: user.role_id }
            });
        } catch (err) {
            handleError(err, res, next);
        }
    }
}

export default new TwoFactorController();