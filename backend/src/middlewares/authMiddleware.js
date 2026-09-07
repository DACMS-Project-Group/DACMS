import jwt from 'jsonwebtoken';

export function authenticate(req, res, next) {
    const token = req.cookies.token;

    //verify token
    if (!token) {
        return res.status(401).json({ message: 'Access Denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_super_secret_key');
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid Token' });
    }  
}

export default authenticate;