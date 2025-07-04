const jwt = require('jsonwebtoken');
const User = require('../models/user');

// User roles
const ROLES = {
  FARMER: 'farmer',
  EXPERT: 'expert',
  ADMIN: 'admin'
};

// Demo user credentials
const DEMO_USERS = {
  '9876543210': { user_type: ROLES.FARMER, password: 'demo123' },
  '9876543211': { user_type: ROLES.EXPERT, password: 'expert123' },
  '9876543212': { user_type: ROLES.ADMIN, password: 'admin123' }
};

// Basic auth middleware
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (process.env.NODE_ENV === 'demo') {
      // In demo mode, accept any token and return demo user
      const demoUser = DEMO_USERS[req.body.mobile || '9876543210'];
      if (!demoUser) {
        return res.status(401).json({ error: 'Demo user not found' });
      }
      req.user = { ...demoUser, mobile: req.body.mobile || '9876543210' };
      next();
      return;
    }

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id);
    
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Role-based authorization middleware
const authorize = (...roles) => {
  return async (req, res, next) => {
    try {
      const user = req.user;
      if (!roles.includes(user.user_type)) {
        return res.status(403).json({ error: 'Unauthorized access' });
      }
      next();
    } catch (error) {
      res.status(401).json({ error: 'Authentication required' });
    }
  };
};

module.exports = {
  auth,
  authorize,
  ROLES
};