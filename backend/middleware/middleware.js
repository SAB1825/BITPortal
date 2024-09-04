import jwt from 'jsonwebtoken';
import User from '../model/user.model.js'; // Make sure to import your User model

export const verifyToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        req.user = {
            userId: user._id,
            email: user.email,
            // Add any other necessary user information
        };
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(403).json({ error: 'Failed to authenticate token' });
    }
};