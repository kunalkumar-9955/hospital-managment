const express = require('express')
const router = express.Router()
const Appointment = require('../models/Appointment')
const { protect } = require('../middleware/auth')

router.use(protect)

router.get('/', async (req, res) => {
  try {
    const { status, date, doctor, patient, page = 1, limit = 20 } = req.query
    const filter = {}
    if (status) filter.status = status
    if (doctor) filter.doctor = doctor
    if (patient) filter.patient = patient
    if (date) {
      const start = new Date(date)
      const end = new Date(date)
      end.setDate(end.getDate() + 1)
      filter.appointmentDate = { $gte: start, $lt: end }
    }

    const skip = (parseInt(page) - 1) * parseInt(limit)
    const [appointments, total] = await Promise.all([
      Appointment.find(filter)
        .populate('patient', 'name patientId phone')
        .populate('doctor', 'name specialization')
        .sort({ appointmentDate: 1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Appointment.countDocuments(filter),
    ])

    res.json({ success: true, data: appointments, pagination: { total, page: parseInt(page), limit: parseInt(limit) } })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

router.post('/', async (req, res) => {
  try {
    // Check for slot conflicts
    const conflict = await Appointment.findOne({
      doctor: req.body.doctor,
      appointmentDate: req.body.appointmentDate,
      appointmentTime: req.body.appointmentTime,
      status: { $nin: ['Cancelled', 'No Show'] },
    })

    if (conflict) {
      return res.status(400).json({ success: false, message: 'Time slot already booked for this doctor' })
    }

    const appointment = await Appointment.create(req.body)
    await appointment.populate('patient', 'name patientId')
    await appointment.populate('doctor', 'name specialization')

    req.app.get('io')?.emit('appointment-booked', {
      appointmentId: appointment.appointmentId,
      patient: appointment.patient?.name,
    })

    res.status(201).json({ success: true, data: appointment })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('patient', 'name patientId')
      .populate('doctor', 'name specialization')

    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' })
    res.json({ success: true, data: appointment })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, { status }, { new: true })
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' })
    res.json({ success: true, data: appointment })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    await Appointment.findByIdAndUpdate(req.params.id, { status: 'Cancelled' })
    res.json({ success: true, message: 'Appointment cancelled' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// Get available slots for a doctor on a date
router.get('/available-slots/:doctorId', async (req, res) => {
  try {
    const { date } = req.query
    const allSlots = ['08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM']

    const bookedSlots = await Appointment.find({
      doctor: req.params.doctorId,
      appointmentDate: new Date(date),
      status: { $nin: ['Cancelled', 'No Show'] },
    }).select('appointmentTime')

    const bookedTimes = bookedSlots.map(a => a.appointmentTime)
    const availableSlots = allSlots.filter(slot => !bookedTimes.includes(slot))

    res.json({ success: true, data: availableSlots })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

module.exports = router
