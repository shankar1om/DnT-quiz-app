const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware to verify JWT and optionally check for required roles
function authMiddleware(requiredRoles = []) {
    return (req, res, next) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided', success: false });
        }
        try {
            const decoded = jwt.verify(token, process.env.SECERET_KEY);
            req.user = decoded.user;
            if (requiredRoles.length > 0 && !requiredRoles.includes(req.user.role)) {
                return res.status(403).json({ message: 'Forbidden: insufficient permissions', success: false });
            }
            next();
        } catch (err) {
            console.log("error from authMiddleware")
            return res.status(401).json({ message: 'Invalid or expired token', success: false });
        }
    };
}

module.exports = authMiddleware;
