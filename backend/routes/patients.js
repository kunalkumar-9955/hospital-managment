const express = require('express')
const router = express.Router()
const { body, validationResult, query } = require('express-validator')
const Patient = require('../models/Patient')
const { protect, restrictTo } = require('../middleware/auth')

// All routes require authentication
router.use(protect)

/**
 * @route   GET /api/patients
 * @desc    Get all patients with filtering, sorting, pagination
 */
router.get('/', async (req, res) => {
  try {
    const {
      page = 1, limit = 20, search, status, department,
      sortBy = 'createdAt', sortOrder = 'desc'
    } = req.query

    const filter = { isActive: true }
    if (status) filter.status = status
    if (department) filter.department = department
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { patientId: { $regex: search, $options: 'i' } },
        { diagnosis: { $regex: search, $options: 'i' } },
      ]
    }

    const skip = (parseInt(page) - 1) * parseInt(limit)
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 }

    const [patients, total] = await Promise.all([
      Patient.find(filter)
        .populate('attendingDoctor', 'name specialization')
        .populate('bedId', 'bedId roomNumber ward')
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Patient.countDocuments(filter),
    ])

    res.json({
      success: true,
      data: patients,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

/**
 * @route   GET /api/patients/:id
 * @desc    Get single patient
 */
router.get('/:id', async (req, res) => {
  try {
    const patient = await Patient.findOne({
      $or: [{ _id: req.params.id }, { patientId: req.params.id }],
      isActive: true,
    })
      .populate('attendingDoctor', 'name specialization phone email')
      .populate('bedId', 'bedId roomNumber ward floor')

    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' })
    }

    res.json({ success: true, data: patient })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

/**
 * @route   POST /api/patients
 * @desc    Create new patient
 */
router.post('/', [
  body('name').trim().notEmpty().withMessage('Patient name required'),
  body('gender').isIn(['Male', 'Female', 'Other']).withMessage('Valid gender required'),
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() })
    }

    // AI risk score simulation
    const aiRiskScore = Math.floor(Math.random() * 80) + 10

    const patient = await Patient.create({
      ...req.body,
      aiRiskScore,
      aiHealthInsights: generateAIInsights(req.body),
    })

    // Emit real-time update
    req.app.get('io')?.emit('patient-added', { patient: patient.patientId, name: patient.name })

    res.status(201).json({ success: true, data: patient, message: 'Patient registered successfully' })
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Patient ID already exists' })
    }
    res.status(500).json({ success: false, message: error.message })
  }
})

/**
 * @route   PUT /api/patients/:id
 * @desc    Update patient
 */
router.put('/:id', async (req, res) => {
  try {
    const patient = await Patient.findOneAndUpdate(
      { $or: [{ _id: req.params.id }, { patientId: req.params.id }] },
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    )

    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' })
    }

    res.json({ success: true, data: patient, message: 'Patient updated successfully' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

/**
 * @route   DELETE /api/patients/:id
 * @desc    Soft delete patient
 */
router.delete('/:id', restrictTo('admin'), async (req, res) => {
  try {
    const patient = await Patient.findOneAndUpdate(
      { $or: [{ _id: req.params.id }, { patientId: req.params.id }] },
      { isActive: false },
      { new: true }
    )

    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' })
    }

    res.json({ success: true, message: 'Patient record archived' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

/**
 * @route   GET /api/patients/stats/summary
 * @desc    Get patient statistics
 */
router.get('/stats/summary', async (req, res) => {
  try {
    const [total, active, critical, discharged] = await Promise.all([
      Patient.countDocuments({ isActive: true }),
      Patient.countDocuments({ isActive: true, status: 'Active' }),
      Patient.countDocuments({ isActive: true, status: 'Critical' }),
      Patient.countDocuments({ isActive: true, status: 'Discharged' }),
    ])

    res.json({ success: true, data: { total, active, critical, discharged } })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// Helper: Generate AI health insights
function generateAIInsights(patientData) {
  const insights = []
  if (patientData.age > 60) insights.push('Senior patient - monitor for age-related complications')
  if (patientData.allergies?.length > 0) insights.push(`Known allergies: ${patientData.allergies.join(', ')} - verify before prescribing`)
  if (patientData.bloodGroup === 'O-') insights.push('Universal donor blood type - rare, handle with care')
  return insights
}

module.exports = router
