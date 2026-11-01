const mongoose = require('mongoose')

const labTestSchema = new mongoose.Schema({
  testId: {
    type: String,
    unique: true,
    default: () => `LAB-${Date.now().toString(36).toUpperCase()}`,
  },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
  testName: { type: String, required: true },
  testCategory: {
    type: String,
    enum: ['Blood', 'Urine', 'Imaging', 'Biopsy', 'Microbiology', 'Genetics', 'Cardiology', 'Neurology', 'Other'],
  },
  status: {
    type: String,
    enum: ['Pending', 'Sample Collected', 'Processing', 'Completed', 'Cancelled'],
    default: 'Pending',
  },
  priority: {
    type: String,
    enum: ['Routine', 'Urgent', 'STAT'],
    default: 'Routine',
  },
  scheduledDate: { type: Date },
  completedDate: { type: Date },
  result: {
    value: String,
    unit: String,
    normalRange: String,
    interpretation: { type: String, enum: ['Normal', 'Abnormal', 'Critical', 'Borderline'] },
    notes: String,
  },
  reportUrl: { type: String }, // Cloudinary URL
  cost: { type: Number },
  // AI analysis
  aiSummary: { type: String },
  aiAbnormalFlags: [{ type: String }],
  requiresImmediateAttention: { type: Boolean, default: false },
  technician: { type: String },
  notes: { type: String },
}, {
  timestamps: true,
})

labTestSchema.index({ patient: 1, status: 1 })
labTestSchema.index({ scheduledDate: 1, priority: 1 })

module.exports = mongoose.model('LabTest', labTestSchema)
