const express = require('express')
const router = express.Router()
const Bed = require('../models/Bed')
const { protect } = require('../middleware/auth')

router.use(protect)

router.get('/', async (req, res) => {
  try {
    const { ward, status } = req.query
    const filter = { isActive: true }
    if (ward) filter.ward = ward
    if (status) filter.status = status

    const beds = await Bed.find(filter)
      .populate('patient', 'name patientId status')
      .sort({ ward: 1, bedId: 1 })
      .lean()

    const stats = {
      total: beds.length,
      available: beds.filter(b => b.status === 'Available').length,
      occupied: beds.filter(b => b.status === 'Occupied').length,
      maintenance: beds.filter(b => b.status === 'Maintenance').length,
      occupancyRate: beds.length > 0 ? Math.round((beds.filter(b => b.status === 'Occupied').length / beds.length) * 100) : 0,
    }

    res.json({ success: true, data: beds, stats })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

router.post('/', async (req, res) => {
  try {
    const bed = await Bed.create(req.body)
    res.status(201).json({ success: true, data: bed })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// Allocate bed to patient
router.patch('/:id/allocate', async (req, res) => {
  try {
    const { patientId } = req.body
    const bed = await Bed.findById(req.params.id)
    if (!bed) return res.status(404).json({ success: false, message: 'Bed not found' })
    if (bed.status !== 'Available') {
      return res.status(400).json({ success: false, message: 'Bed is not available' })
    }

    bed.status = 'Occupied'
    bed.patient = patientId
    bed.admittedAt = new Date()
    await bed.save()

    req.app.get('io')?.emit('bed-status-change', { bedId: bed.bedId, status: 'Occupied', ward: bed.ward })

    res.json({ success: true, data: bed, message: 'Bed allocated successfully' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// Release bed
router.patch('/:id/release', async (req, res) => {
  try {
    const bed = await Bed.findById(req.params.id)
    if (!bed) return res.status(404).json({ success: false, message: 'Bed not found' })

    bed.status = 'Cleaning'
    bed.patient = null
    bed.admittedAt = null
    await bed.save()

    // Auto-set to available after cleaning (simulated)
    setTimeout(async () => {
      await Bed.findByIdAndUpdate(bed._id, { status: 'Available', lastCleaned: new Date() })
      req.app.get('io')?.emit('bed-status-change', { bedId: bed.bedId, status: 'Available', ward: bed.ward })
    }, 5000)

    res.json({ success: true, message: 'Bed released for cleaning' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

module.exports = router
