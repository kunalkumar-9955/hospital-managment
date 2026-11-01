const express = require('express')
const router = express.Router()
const { protect, restrictTo } = require('../middleware/auth')

router.use(protect)

/**
 * @route   GET /api/analytics/dashboard
 * @desc    Get dashboard summary stats
 */
router.get('/dashboard', async (req, res) => {
  try {
    // In production, these would be real DB aggregations
    // For demo, returning realistic mock data
    const stats = {
      patients: {
        total: 2847,
        active: 188,
        critical: 7,
        discharged: 2652,
        change: '+12.5%',
      },
      doctors: {
        total: 48,
        online: 18,
        busy: 12,
        offline: 18,
      },
      appointments: {
        today: 124,
        pending: 38,
        confirmed: 86,
        change: '+8.2%',
      },
      revenue: {
        today: 48250,
        thisMonth: 378000,
        thisYear: 3850000,
        change: '+15.3%',
      },
      beds: {
        total: 120,
        available: 43,
        occupied: 72,
        maintenance: 5,
        occupancyRate: 60,
      },
      emergency: {
        active: 3,
        resolved: 28,
        ambulancesAvailable: 2,
      },
      pharmacy: {
        totalMedicines: 248,
        lowStock: 5,
        outOfStock: 2,
        expiringIn30Days: 8,
      },
    }

    res.json({ success: true, data: stats })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

/**
 * @route   GET /api/analytics/revenue
 * @desc    Revenue analytics
 */
router.get('/revenue', async (req, res) => {
  try {
    const { period = 'monthly' } = req.query

    const data = [
      { month: 'Jan', revenue: 285000, expenses: 180000, profit: 105000 },
      { month: 'Feb', revenue: 310000, expenses: 195000, profit: 115000 },
      { month: 'Mar', revenue: 298000, expenses: 188000, profit: 110000 },
      { month: 'Apr', revenue: 342000, expenses: 210000, profit: 132000 },
      { month: 'May', revenue: 378000, expenses: 225000, profit: 153000 },
      { month: 'Jun', revenue: 365000, expenses: 218000, profit: 147000 },
      { month: 'Jul', revenue: 390000, expenses: 235000, profit: 155000 },
      { month: 'Aug', revenue: 415000, expenses: 248000, profit: 167000 },
      { month: 'Sep', revenue: 402000, expenses: 240000, profit: 162000 },
      { month: 'Oct', revenue: 438000, expenses: 260000, profit: 178000 },
      { month: 'Nov', revenue: 425000, expenses: 255000, profit: 170000 },
      { month: 'Dec', revenue: 460000, expenses: 275000, profit: 185000 },
    ]

    res.json({ success: true, data })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

/**
 * @route   GET /api/analytics/patients
 * @desc    Patient analytics
 */
router.get('/patients', async (req, res) => {
  try {
    const data = {
      growth: [
        { month: 'Jan', inpatients: 145, outpatients: 520, emergency: 38 },
        { month: 'Feb', inpatients: 158, outpatients: 548, emergency: 42 },
        { month: 'Mar', inpatients: 162, outpatients: 590, emergency: 35 },
        { month: 'Apr', inpatients: 175, outpatients: 612, emergency: 48 },
        { month: 'May', inpatients: 188, outpatients: 645, emergency: 52 },
        { month: 'Jun', inpatients: 172, outpatients: 628, emergency: 44 },
      ],
      byDepartment: [
        { name: 'Cardiology', value: 28 },
        { name: 'Neurology', value: 18 },
        { name: 'Orthopedics', value: 15 },
        { name: 'Oncology', value: 12 },
        { name: 'Emergency', value: 20 },
        { name: 'Others', value: 7 },
      ],
      ageDistribution: [
        { range: '0-18', count: 245 },
        { range: '19-35', count: 612 },
        { range: '36-50', count: 845 },
        { range: '51-65', count: 723 },
        { range: '65+', count: 422 },
      ],
    }

    res.json({ success: true, data })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

/**
 * @route   GET /api/analytics/ai-insights
 * @desc    AI-generated insights
 */
router.get('/ai-insights', async (req, res) => {
  try {
    const insights = [
      {
        type: 'prediction',
        title: 'Patient Load Forecast',
        message: 'Patient load predicted to increase 18% next week based on seasonal trends',
        severity: 'warning',
        confidence: 87,
      },
      {
        type: 'alert',
        title: 'ICU Capacity Warning',
        message: 'ICU capacity may reach critical levels in 48 hours',
        severity: 'critical',
        confidence: 92,
      },
      {
        type: 'insight',
        title: 'Disease Outbreak Risk',
        message: 'Flu season outbreak risk: 34% probability detected in the region',
        severity: 'warning',
        confidence: 78,
      },
      {
        type: 'forecast',
        title: 'Revenue Forecast',
        message: 'Revenue forecast: $520K this month (+12% vs last month)',
        severity: 'positive',
        confidence: 85,
      },
    ]

    res.json({ success: true, data: insights })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

module.exports = router
