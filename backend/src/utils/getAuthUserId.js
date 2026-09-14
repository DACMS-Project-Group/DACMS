/**
 * Pulls the authenticated user's ID out of req.user, set by authMiddleware.js
 * after verifying the JWT.
 *
 * NOTE: We don't have the login() controller code, so the exact JWT payload
 * shape (what field the user's ID is stored under) is unconfirmed. This
 * checks the most likely field names so it works regardless. If login()
 * uses something else entirely, add that field name to the list below.
 */
export function getAuthUserId(req) {
    const id =
        req.user?.userId ??
        req.user?.id ??
        req.user?.UserID ??
        req.user?.sub;

    return id !== undefined ? Number(id) : undefined;
}

export default getAuthUserId;
