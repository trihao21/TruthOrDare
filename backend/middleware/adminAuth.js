import User from '../models/User.js';

// Middleware to check if user is admin
export const requireAdmin = async (req, res, next) => {
    try {
        // Check if user is authenticated (should be done by authenticate middleware first)
        if (!req.userId) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        // Get user from database
        const user = await User.findById(req.userId);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if user is admin
        if (user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }

        // Add user info to request
        req.user = user;
        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Middleware to check if user is admin or accessing their own resources
export const requireAdminOrOwner = async (req, res, next) => {
    try {
        if (!req.userId) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const user = await User.findById(req.userId);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Allow if admin or if accessing own resources
        const isAdmin = user.role === 'admin';
        const isOwner = req.params.userId === req.userId;
        
        if (!isAdmin && !isOwner) {
            return res.status(403).json({ error: 'Access denied' });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};