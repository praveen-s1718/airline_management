const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Extract token from "Bearer token"
    
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};

// Middleware to verify admin role
const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.role === 'admin') {
            next();
        } else {
            res.status(403).json({ error: 'Admin access required' });
        }
    });
};

// Middleware to verify passenger role
const verifyPassenger = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.role === 'passenger') {
            next();
        } else {
            res.status(403).json({ error: 'Passenger access required' });
        }
    });
};

module.exports = { verifyToken, verifyAdmin, verifyPassenger };
