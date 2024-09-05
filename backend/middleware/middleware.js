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
            // Make sure to include the role
        };
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(403).json({ error: 'Failed to authenticate token' });
    }
};

export const isAdmin = async (req, res, next) => {
    try {
        if (!req.user || !req.user.userId) {
            return res.status(400).json({ error: 'User information not found in the request.' });
        }

        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        if (user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied. Admin rights required.' });
        }

        next();
    } catch (error) {
        console.error('Error in isAdmin middleware:', error);
        res.status(500).json({ error: 'An error occurred while checking admin rights.', details: error.message });
    }
};