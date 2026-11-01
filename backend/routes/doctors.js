const express = require('express')
const router = express.Router()
const Doctor = require('../models/Doctor')
const { protect, restrictTo } = require('../middleware/auth')

router.use(protect)

router.get('/', async (req, res) => {
  try {
    const { search, specialization, department, status, page = 1, limit = 20 } = req.query
    const filter = { isActive: true }
    if (specialization) filter.specialization = specialization
    if (department) filter.department = department
    if (status) filter.status = status
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { specialization: { $regex: search, $options: 'i' } },
      ]
    }

    const skip = (parseInt(page) - 1) * parseInt(limit)
    const [doctors, total] = await Promise.all([
      Doctor.find(filter).sort({ rating: -1 }).skip(skip).limit(parseInt(limit)).lean(),
      Doctor.countDocuments(filter),
    ])

    res.json({ success: true, data: doctors, pagination: { total, page: parseInt(page), limit: parseInt(limit) } })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findOne({
      $or: [{ _id: req.params.id }, { doctorId: req.params.id }],
      isActive: true,
    })
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' })
    res.json({ success: true, data: doctor })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

router.post('/', restrictTo('admin'), async (req, res) => {
  try {
    const doctor = await Doctor.create(req.body)
    res.status(201).json({ success: true, data: doctor })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' })
    res.json({ success: true, data: doctor })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, { status }, { new: true })
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' })
    req.app.get('io')?.emit('doctor-status-change', { doctorId: doctor.doctorId, status })
    res.json({ success: true, data: doctor })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

router.delete('/:id', restrictTo('admin'), async (req, res) => {
  try {
    await Doctor.findByIdAndUpdate(req.params.id, { isActive: false })
    res.json({ success: true, message: 'Doctor record archived' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

module.exports = router
