const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.error('Malformed Authorization header:', authHeader);
        return res.status(401).json({ message: 'Access Denied' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // Attach user info to request
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            console.error('Token has expired:', err.message);
            return res.status(401).json({ message: 'Token has expired' });
        }
        console.error('Invalid Token:', err.message);
        res.status(400).json({ message: 'Invalid Token' });
    }
};

module.exports = authMiddleware;
