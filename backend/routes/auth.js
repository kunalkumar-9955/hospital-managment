const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { body, validationResult } = require('express-validator')
const User = require('../models/User')
const { protect } = require('../middleware/auth')

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'medicore-secret-key', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  })
}

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required'),
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() })
    }

    const { email, password } = req.body

    // Demo accounts (for development without DB)
    const demoAccounts = {
      'admin@medicore.com': { name: 'Dr. Admin User', role: 'admin', password: 'admin123' },
      'doctor@medicore.com': { name: 'Dr. Sarah Chen', role: 'doctor', password: 'doctor123' },
      'reception@medicore.com': { name: 'Jane Smith', role: 'receptionist', password: 'recep123' },
    }

    if (demoAccounts[email]) {
      const demo = demoAccounts[email]
      if (password !== demo.password) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' })
      }
      const token = jwt.sign(
        { id: email, email, name: demo.name, role: demo.role },
        process.env.JWT_SECRET || 'medicore-secret-key',
        { expiresIn: '7d' }
      )
      return res.json({
        success: true,
        token,
        user: { id: email, name: demo.name, email, role: demo.role },
      })
    }

    // Real DB auth
    const user = await User.findOne({ email }).select('+password')
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' })
    }

    if (!user.isActive) {
      return res.status(401).json({ success: false, message: 'Account deactivated. Contact admin.' })
    }

    // Update last login
    user.lastLogin = new Date()
    user.loginAttempts = 0
    await user.save({ validateBeforeSave: false })

    const token = generateToken(user._id)

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        avatar: user.avatar,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ success: false, message: 'Server error during login' })
  }
})

/**
 * @route   POST /api/auth/register
 * @desc    Register new user (admin only in production)
 * @access  Public (restricted in production)
 */
router.post('/register', [
  body('name').trim().notEmpty().withMessage('Name required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['admin', 'doctor', 'nurse', 'receptionist', 'pharmacist', 'lab_technician']).withMessage('Invalid role'),
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() })
    }

    const { name, email, password, role, department, phone } = req.body

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' })
    }

    const user = await User.create({ name, email, password, role, department, phone })
    const token = generateToken(user._id)

    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Registration failed' })
  }
})

/**
 * @route   GET /api/auth/me
 * @desc    Get current user
 * @access  Private
 */
router.get('/me', protect, async (req, res) => {
  res.json({ success: true, user: req.user })
})

/**
 * @route   POST /api/auth/logout
 * @desc    Logout (client-side token removal)
 * @access  Private
 */
router.post('/logout', protect, (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' })
})

/**
 * @route   PUT /api/auth/change-password
 * @desc    Change password
 * @access  Private
 */
router.put('/change-password', protect, [
  body('currentPassword').notEmpty().withMessage('Current password required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() })
    }

    const user = await User.findById(req.user._id).select('+password')
    if (!(await user.comparePassword(req.body.currentPassword))) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' })
    }

    user.password = req.body.newPassword
    await user.save()

    res.json({ success: true, message: 'Password changed successfully' })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to change password' })
  }
})

module.exports = router
