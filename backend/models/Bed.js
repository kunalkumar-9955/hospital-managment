const mongoose = require('mongoose')

const bedSchema = new mongoose.Schema({
  bedId: {
    type: String,
    unique: true,
    required: true,
  },
  roomNumber: { type: String, required: true },
  ward: {
    type: String,
    enum: ['General', 'ICU', 'CCU', 'NICU', 'Pediatrics', 'Maternity', 'Oncology', 'Cardiology', 'Neurology', 'Orthopedics', 'Emergency'],
    required: true,
  },
  floor: { type: Number, required: true },
  bedType: {
    type: String,
    enum: ['Standard', 'Semi-Private', 'Private', 'ICU', 'Isolation'],
    default: 'Standard',
  },
  status: {
    type: String,
    enum: ['Available', 'Occupied', 'Maintenance', 'Reserved', 'Cleaning'],
    default: 'Available',
  },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
  admittedAt: { type: Date },
  expectedDischarge: { type: Date },
  // Features
  hasOxygen: { type: Boolean, default: false },
  hasMonitor: { type: Boolean, default: false },
  hasVentilator: { type: Boolean, default: false },
  dailyRate: { type: Number, default: 0 },
  notes: { type: String },
  lastCleaned: { type: Date },
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true,
})

bedSchema.index({ ward: 1, status: 1 })

module.exports = mongoose.model('Bed', bedSchema)
