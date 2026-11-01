const mongoose = require('mongoose')

const patientSchema = new mongoose.Schema({
  patientId: {
    type: String,
    unique: true,
    default: () => `PT-${Date.now().toString(36).toUpperCase()}`,
  },
  name: { type: String, required: true, trim: true },
  dateOfBirth: { type: Date },
  age: { type: Number },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  bloodGroup: { type: String, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
  phone: { type: String, trim: true },
  email: { type: String, lowercase: true, trim: true },
  address: { type: String },
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String,
  },
  // Medical info
  department: { type: String },
  attendingDoctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
  admissionDate: { type: Date, default: Date.now },
  dischargeDate: { type: Date },
  status: {
    type: String,
    enum: ['Active', 'Critical', 'Stable', 'Recovering', 'Discharged', 'Deceased'],
    default: 'Active',
  },
  diagnosis: { type: String },
  allergies: [{ type: String }],
  medicalHistory: [{
    condition: String,
    diagnosedDate: Date,
    notes: String,
  }],
  prescriptions: [{
    medicine: String,
    dosage: String,
    frequency: String,
    startDate: Date,
    endDate: Date,
    prescribedBy: String,
  }],
  // AI fields
  aiRiskScore: { type: Number, min: 0, max: 100, default: 0 },
  aiHealthInsights: [{ type: String }],
  // Files
  reports: [{
    name: String,
    url: String,
    type: String,
    uploadedAt: { type: Date, default: Date.now },
  }],
  // Insurance
  insurance: {
    provider: String,
    policyNumber: String,
    expiryDate: Date,
  },
  // Bed assignment
  bedId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bed' },
  ward: { type: String },
  room: { type: String },
  // QR code
  qrCode: { type: String },
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true,
})

// Index for search
patientSchema.index({ name: 'text', patientId: 'text', diagnosis: 'text' })
patientSchema.index({ status: 1, department: 1 })

module.exports = mongoose.model('Patient', patientSchema)
