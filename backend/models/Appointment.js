const mongoose = require('mongoose')

const appointmentSchema = new mongoose.Schema({
  appointmentId: {
    type: String,
    unique: true,
    default: () => `APT-${Date.now().toString(36).toUpperCase()}`,
  },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  department: { type: String },
  appointmentDate: { type: Date, required: true },
  appointmentTime: { type: String, required: true },
  type: {
    type: String,
    enum: ['Consultation', 'Follow-up', 'Emergency', 'Pre-op', 'Post-op', 'Chemotherapy', 'Check-up', 'Telemedicine'],
    default: 'Consultation',
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled', 'No Show'],
    default: 'Pending',
  },
  notes: { type: String },
  symptoms: [{ type: String }],
  diagnosis: { type: String },
  prescription: { type: String },
  followUpDate: { type: Date },
  duration: { type: Number, default: 30 }, // minutes
  isEmergency: { type: Boolean, default: false },
  reminderSent: { type: Boolean, default: false },
  // Telemedicine
  videoCallLink: { type: String },
  isVirtual: { type: Boolean, default: false },
  // AI
  aiRecommendedSlot: { type: Boolean, default: false },
  estimatedWaitTime: { type: Number }, // minutes
}, {
  timestamps: true,
})

appointmentSchema.index({ appointmentDate: 1, status: 1 })
appointmentSchema.index({ patient: 1, doctor: 1 })

module.exports = mongoose.model('Appointment', appointmentSchema)
