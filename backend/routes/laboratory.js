const express = require('express')
const router = express.Router()
const LabTest = require('../models/LabTest')
const { protect } = require('../middleware/auth')

router.use(protect)

router.get('/', async (req, res) => {
  try {
    const { status, priority, patient, page = 1, limit = 20 } = req.query
    const filter = {}
    if (status) filter.status = status
    if (priority) filter.priority = priority
    if (patient) filter.patient = patient

    const skip = (parseInt(page) - 1) * parseInt(limit)
    const [tests, total] = await Promise.all([
      LabTest.find(filter)
        .populate('patient', 'name patientId')
        .populate('referredBy', 'name specialization')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      LabTest.countDocuments(filter),
    ])

    res.json({ success: true, data: tests, pagination: { total, page: parseInt(page), limit: parseInt(limit) } })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

router.post('/', async (req, res) => {
  try {
    const test = await LabTest.create(req.body)
    await test.populate('patient', 'name patientId')
    res.status(201).json({ success: true, data: test })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const test = await LabTest.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('patient', 'name patientId')
    if (!test) return res.status(404).json({ success: false, message: 'Test not found' })

    // Emit if result is critical
    if (req.body.result?.interpretation === 'Critical') {
      req.app.get('io')?.emit('critical-lab-result', {
        testId: test.testId,
        patient: test.patient?.name,
        test: test.testName,
      })
    }

    res.json({ success: true, data: test })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// Upload report
router.post('/:id/report', async (req, res) => {
  try {
    const { reportUrl } = req.body
    const test = await LabTest.findByIdAndUpdate(
      req.params.id,
      { reportUrl, status: 'Completed', completedDate: new Date() },
      { new: true }
    )
    if (!test) return res.status(404).json({ success: false, message: 'Test not found' })
    res.json({ success: true, data: test })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

module.exports = router
