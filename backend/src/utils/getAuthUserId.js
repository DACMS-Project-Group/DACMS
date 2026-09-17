
export function getAuthUserId(req) {
    const id =
        req.user?.userId ??
        req.user?.id ??
        req.user?.UserID ??
        req.user?.user_id ??
        req.user?.sub;

    return id !== undefined ? Number(id) : undefined;
}

export default getAuthUserId;
