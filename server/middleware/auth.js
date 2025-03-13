const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'אין הרשאה' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ error: 'משתמש לא נמצא' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'אין הרשאה' });
  }
};

module.exports = auth; 