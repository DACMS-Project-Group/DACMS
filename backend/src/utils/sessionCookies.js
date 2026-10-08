import jwt from 'jsonwebtoken';

export const PENDING_COOKIE = 'twofa_token';

const secret = () => process.env.JWT_SECRET || 'your_super_secret_key';

// Full session - identical to what UserController.login issued before.
export function issueSessionCookie(res, { user_id, role_id }) {
    const token = jwt.sign({ user_id, role_id }, secret(), { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true, sameSite: 'strict', maxAge: 3600000 });
    return token;
}

// Pending 2FA - deliberately has NO role_id, so it can never pass authenticate().
export function issuePendingCookie(res, user_id) {
    const token = jwt.sign({ user_id, purpose: '2fa' }, secret(), { expiresIn: '10m' });
    res.cookie(PENDING_COOKIE, token, { httpOnly: true, sameSite: 'strict', maxAge: 10 * 60 * 1000 });
    return token;
}

export function clearPendingCookie(res) {
    res.clearCookie(PENDING_COOKIE, { httpOnly: true, sameSite: 'strict' });
}