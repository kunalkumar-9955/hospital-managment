const express = require('express')
const router = express.Router()
const Medicine = require('../models/Medicine')
const { protect } = require('../middleware/auth')

router.use(protect)

router.get('/', async (req, res) => {
  try {
    const { search, category, status, page = 1, limit = 20 } = req.query
    const filter = { isActive: true }
    if (category) filter.category = category
    if (status) filter.status = status
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { genericName: { $regex: search, $options: 'i' } },
        { supplier: { $regex: search, $options: 'i' } },
      ]
    }

    const skip = (parseInt(page) - 1) * parseInt(limit)
    const [medicines, total] = await Promise.all([
      Medicine.find(filter).sort({ status: 1, name: 1 }).skip(skip).limit(parseInt(limit)).lean(),
      Medicine.countDocuments(filter),
    ])

    res.json({ success: true, data: medicines, pagination: { total, page: parseInt(page), limit: parseInt(limit) } })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

router.get('/alerts', async (req, res) => {
  try {
    const alerts = await Medicine.find({
      isActive: true,
      $or: [
        { status: { $in: ['Low Stock', 'Critical', 'Out of Stock'] } },
        { expiryDate: { $lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) } }, // expiring in 30 days
      ],
    }).lean()

    res.json({ success: true, data: alerts, count: alerts.length })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

router.post('/', async (req, res) => {
  try {
    const medicine = await Medicine.create(req.body)
    res.status(201).json({ success: true, data: medicine })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const medicine = await Medicine.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!medicine) return res.status(404).json({ success: false, message: 'Medicine not found' })
    res.json({ success: true, data: medicine })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// Update stock
router.patch('/:id/stock', async (req, res) => {
  try {
    const { quantity, operation } = req.body // operation: 'add' | 'subtract'
    const medicine = await Medicine.findById(req.params.id)
    if (!medicine) return res.status(404).json({ success: false, message: 'Medicine not found' })

    if (operation === 'add') medicine.currentStock += quantity
    else if (operation === 'subtract') {
      if (medicine.currentStock < quantity) {
        return res.status(400).json({ success: false, message: 'Insufficient stock' })
      }
      medicine.currentStock -= quantity
    }

    await medicine.save()

    // Emit alert if low stock
    if (medicine.status === 'Critical' || medicine.status === 'Out of Stock') {
      req.app.get('io')?.emit('medicine-alert', { medicine: medicine.name, status: medicine.status, stock: medicine.currentStock })
    }

    res.json({ success: true, data: medicine })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    await Medicine.findByIdAndUpdate(req.params.id, { isActive: false })
    res.json({ success: true, message: 'Medicine removed from inventory' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

module.exports = router
