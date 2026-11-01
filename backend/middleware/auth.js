const jwt = require('jsonwebtoken')
const User = require('../models/User')

/**
 * Protect routes - verify JWT token
 */
exports.protect = async (req, res, next) => {
  try {
    let token

    // Get token from header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Access denied. No token provided.' })
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'medicore-secret-key')

    // Check if user still exists
    const user = await User.findById(decoded.id).select('-password')
    if (!user) {
      return res.status(401).json({ success: false, message: 'User no longer exists.' })
    }

    if (!user.isActive) {
      return res.status(401).json({ success: false, message: 'Account has been deactivated.' })
    }

    // Check if password changed after token was issued
    if (user.changedPasswordAfter && user.changedPasswordAfter(decoded.iat)) {
      return res.status(401).json({ success: false, message: 'Password recently changed. Please log in again.' })
    }

    req.user = user
    next()
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: 'Invalid token.' })
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token expired. Please log in again.' })
    }
    next(error)
  }
}

/**
 * Restrict to specific roles
 */
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${roles.join(' or ')}`,
      })
    }
    next()
  }
}

/**
 * Optional auth - doesn't fail if no token
 */
exports.optionalAuth = async (req, res, next) => {
  try {
    let token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]
    }
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'medicore-secret-key')
      req.user = await User.findById(decoded.id).select('-password')
    }
    next()
  } catch {
    next()
  }
}
