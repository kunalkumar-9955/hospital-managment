const mongoose = require('mongoose')

const billingSchema = new mongoose.Schema({
  invoiceId: {
    type: String,
    unique: true,
    default: () => `INV-${Date.now().toString(36).toUpperCase()}`,
  },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
  services: [{
    name: { type: String, required: true },
    quantity: { type: Number, default: 1 },
    unitPrice: { type: Number, required: true },
    total: { type: Number, required: true },
    category: { type: String, enum: ['Consultation', 'Surgery', 'Lab', 'Medication', 'Room', 'Emergency', 'Other'] },
  }],
  subtotal: { type: Number, required: true },
  taxRate: { type: Number, default: 18 }, // GST percentage
  taxAmount: { type: Number },
  discount: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  paidAmount: { type: Number, default: 0 },
  balanceDue: { type: Number },
  status: {
    type: String,
    enum: ['Pending', 'Partial', 'Paid', 'Overdue', 'Cancelled', 'Refunded'],
    default: 'Pending',
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Card', 'Insurance', 'Online', 'Cheque'],
  },
  insurance: {
    provider: String,
    policyNumber: String,
    claimAmount: Number,
    claimStatus: { type: String, enum: ['Pending', 'Approved', 'Rejected'] },
  },
  payments: [{
    amount: Number,
    method: String,
    date: { type: Date, default: Date.now },
    transactionId: String,
    notes: String,
  }],
  dueDate: { type: Date },
  notes: { type: String },
  // AI fraud detection
  fraudRiskScore: { type: Number, default: 0 },
  flaggedForReview: { type: Boolean, default: false },
}, {
  timestamps: true,
})

// Auto-calculate balance
billingSchema.pre('save', function (next) {
  this.taxAmount = (this.subtotal * this.taxRate) / 100
  this.totalAmount = this.subtotal + this.taxAmount - this.discount
  this.balanceDue = this.totalAmount - this.paidAmount
  if (this.paidAmount >= this.totalAmount) this.status = 'Paid'
  else if (this.paidAmount > 0) this.status = 'Partial'
  next()
})

module.exports = mongoose.model('Billing', billingSchema)
