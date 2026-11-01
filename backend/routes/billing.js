const express = require('express')
const router = express.Router()
const Billing = require('../models/Billing')
const { protect } = require('../middleware/auth')

router.use(protect)

router.get('/', async (req, res) => {
  try {
    const { status, patient, page = 1, limit = 20 } = req.query
    const filter = {}
    if (status) filter.status = status
    if (patient) filter.patient = patient

    const skip = (parseInt(page) - 1) * parseInt(limit)
    const [bills, total] = await Promise.all([
      Billing.find(filter)
        .populate('patient', 'name patientId')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Billing.countDocuments(filter),
    ])

    res.json({ success: true, data: bills, pagination: { total, page: parseInt(page), limit: parseInt(limit) } })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

router.get('/stats', async (req, res) => {
  try {
    const stats = await Billing.aggregate([
      {
        $group: {
          _id: null,
          totalBilled: { $sum: '$totalAmount' },
          totalCollected: { $sum: '$paidAmount' },
          totalPending: { $sum: '$balanceDue' },
          count: { $sum: 1 },
        },
      },
    ])

    res.json({ success: true, data: stats[0] || {} })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

router.post('/', async (req, res) => {
  try {
    const bill = await Billing.create(req.body)
    await bill.populate('patient', 'name patientId')
    res.status(201).json({ success: true, data: bill })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const bill = await Billing.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('patient', 'name patientId')
    if (!bill) return res.status(404).json({ success: false, message: 'Invoice not found' })
    res.json({ success: true, data: bill })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// Record payment
router.post('/:id/payment', async (req, res) => {
  try {
    const { amount, method, transactionId, notes } = req.body
    const bill = await Billing.findById(req.params.id)
    if (!bill) return res.status(404).json({ success: false, message: 'Invoice not found' })

    bill.payments.push({ amount, method, transactionId, notes })
    bill.paidAmount += amount
    await bill.save()

    res.json({ success: true, data: bill, message: 'Payment recorded successfully' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

module.exports = router
