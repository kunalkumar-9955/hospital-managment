const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/auth')

router.use(protect)

// In-memory emergency cases (replace with DB in production)
let emergencyCases = []
let ambulances = [
  { id: 'AMB-01', driver: 'Mike Torres', status: 'Available', location: 'Station 1', lat: 40.7128, lng: -74.0060 },
  { id: 'AMB-02', driver: 'Lisa Park', status: 'Available', location: 'Station 2', lat: 40.7580, lng: -73.9855 },
  { id: 'AMB-03', driver: 'James Wilson', status: 'Available', location: 'Station 3', lat: 40.6892, lng: -74.0445 },
]

/**
 * @route   GET /api/emergency/cases
 */
router.get('/cases', (req, res) => {
  res.json({ success: true, data: emergencyCases })
})

/**
 * @route   POST /api/emergency/sos
 * @desc    Trigger emergency SOS
 */
router.post('/sos', async (req, res) => {
  try {
    const { location, condition, patientInfo, coordinates } = req.body

    // Find nearest available ambulance
    const availableAmbulance = ambulances.find(a => a.status === 'Available')

    const emergencyCase = {
      id: `EM-${Date.now().toString(36).toUpperCase()}`,
      patient: patientInfo?.name || 'Unknown',
      condition: condition || 'Emergency',
      location: location || 'Unknown location',
      severity: 'Critical',
      time: new Date(),
      ambulance: availableAmbulance?.id || 'Dispatching...',
      status: 'Dispatched',
      coordinates,
    }

    emergencyCases.push(emergencyCase)

    // Update ambulance status
    if (availableAmbulance) {
      availableAmbulance.status = 'En Route'
    }

    // Broadcast emergency alert
    req.app.get('io')?.emit('emergency-alert', {
      type: 'SOS',
      case: emergencyCase,
      ambulance: availableAmbulance,
      message: `Emergency SOS activated at ${location}`,
    })

    res.status(201).json({
      success: true,
      data: emergencyCase,
      ambulance: availableAmbulance,
      message: 'Emergency services dispatched',
      estimatedArrival: '4-8 minutes',
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

/**
 * @route   GET /api/emergency/ambulances
 */
router.get('/ambulances', (req, res) => {
  res.json({ success: true, data: ambulances })
})

/**
 * @route   PATCH /api/emergency/ambulances/:id/status
 */
router.patch('/ambulances/:id/status', (req, res) => {
  const { status, location } = req.body
  const ambulance = ambulances.find(a => a.id === req.params.id)
  if (!ambulance) return res.status(404).json({ success: false, message: 'Ambulance not found' })

  ambulance.status = status
  if (location) ambulance.location = location

  req.app.get('io')?.emit('ambulance-update', ambulance)
  res.json({ success: true, data: ambulance })
})

/**
 * @route   PATCH /api/emergency/cases/:id/resolve
 */
router.patch('/cases/:id/resolve', (req, res) => {
  const caseIndex = emergencyCases.findIndex(c => c.id === req.params.id)
  if (caseIndex === -1) return res.status(404).json({ success: false, message: 'Case not found' })

  emergencyCases[caseIndex].status = 'Resolved'
  emergencyCases[caseIndex].resolvedAt = new Date()

  // Free up ambulance
  const ambulance = ambulances.find(a => a.id === emergencyCases[caseIndex].ambulance)
  if (ambulance) ambulance.status = 'Available'

  req.app.get('io')?.emit('emergency-resolved', { caseId: req.params.id })

  res.json({ success: true, message: 'Emergency case resolved' })
})

module.exports = router
