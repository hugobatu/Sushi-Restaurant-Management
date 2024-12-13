const jwt = require('jsonwebtoken');

const dotenv = require('dotenv').config();

if (dotenv.error) {
    throw new Error('Failed to load .env file');
}

const protect = (roles = []) => {
    return (req, res, next) => {
        const token = req.headers['authorization']?.split(' ')[1];

        if (!token) {
            return res.status(403).json({ message: 'Access Denied. No token provided.' });
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Invalid or expired token.' });
            }

            // Attach user info to the request object (e.g., username and role from token)
            req.user = decoded;

            // Check if the user's role is in the allowed roles array
            if (roles.length && !roles.includes(decoded.role)) {
                return res.status(403).json({ message: 'You do not have permission to access this resource.' });
            }

            next(); // If everything is good, proceed to the next middleware/route handler
        });
    };
};

module.exports = { protect };
