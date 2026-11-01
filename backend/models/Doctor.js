const mongoose = require('mongoose')

const doctorSchema = new mongoose.Schema({
  doctorId: {
    type: String,
    unique: true,
    default: () => `DR-${Date.now().toString(36).toUpperCase()}`,
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true },
  phone: { type: String },
  specialization: { type: String, required: true },
  department: { type: String, required: true },
  qualification: [{ type: String }],
  experience: { type: Number, default: 0 }, // years
  consultationFee: { type: Number, default: 0 },
  availability: {
    days: [{ type: String }],
    startTime: String,
    endTime: String,
    isOnCall: { type: Boolean, default: false },
  },
  status: {
    type: String,
    enum: ['Online', 'Busy', 'Offline', 'On Leave'],
    default: 'Offline',
  },
  rating: { type: Number, min: 0, max: 5, default: 0 },
  totalRatings: { type: Number, default: 0 },
  activePatients: { type: Number, default: 0 },
  totalPatientsTreated: { type: Number, default: 0 },
  avatar: { type: String },
  bio: { type: String },
  licenseNumber: { type: String },
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true,
})

doctorSchema.index({ name: 'text', specialization: 'text' })
doctorSchema.index({ department: 1, status: 1 })

module.exports = mongoose.model('Doctor', doctorSchema)
