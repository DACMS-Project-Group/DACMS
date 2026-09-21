import jwt from 'jsonwebtoken';

export function authenticate(req, res, next) {
    const token = req.cookies.token;

    //verify token
    if (!token) {
        return res.status(401).json({ message: 'Access Denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_super_secret_key');
        
        if (!decoded.user_id || !decoded.role_id) {
            console.error('Login failed:', decoded.user_id, decoded.role_id);
            return res.status(401).json({ message: 'Invalid Token' });
        }

        req.user = {
            user_id: decoded.user_id,
            role_id: decoded.role_id,
            ...decoded
        };

        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid Token' });
    }  
}

export function authorize(allowedRoles) {
    return (req, res, next) => {
        const userRole = Number(req.user?.role_id);

        if(!userRole || !allowedRoles.includes(userRole)) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        next();
    };
}

export default authenticate;