const mongoose = require('mongoose')

const medicineSchema = new mongoose.Schema({
  medicineId: {
    type: String,
    unique: true,
    default: () => `MED-${Date.now().toString(36).toUpperCase()}`,
  },
  name: { type: String, required: true, trim: true },
  genericName: { type: String },
  category: { type: String, required: true },
  manufacturer: { type: String },
  supplier: { type: String },
  batchNumber: { type: String },
  barcode: { type: String },
  // Stock
  currentStock: { type: Number, required: true, default: 0 },
  minStockLevel: { type: Number, default: 50 },
  maxStockLevel: { type: Number, default: 1000 },
  unitOfMeasure: { type: String, default: 'units' },
  // Pricing
  purchasePrice: { type: Number },
  sellingPrice: { type: Number, required: true },
  // Dates
  manufacturingDate: { type: Date },
  expiryDate: { type: Date, required: true },
  // Status
  status: {
    type: String,
    enum: ['In Stock', 'Low Stock', 'Critical', 'Out of Stock', 'Expired'],
    default: 'In Stock',
  },
  // Storage
  storageConditions: { type: String },
  location: { type: String }, // shelf/rack location
  // Prescription
  requiresPrescription: { type: Boolean, default: false },
  // AI
  aiDemandForecast: { type: Number }, // predicted units needed next month
  reorderPoint: { type: Number },
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true,
})

// Auto-update status based on stock
medicineSchema.pre('save', function (next) {
  if (this.currentStock === 0) this.status = 'Out of Stock'
  else if (this.currentStock <= this.minStockLevel * 0.3) this.status = 'Critical'
  else if (this.currentStock <= this.minStockLevel) this.status = 'Low Stock'
  else this.status = 'In Stock'

  // Check expiry
  if (this.expiryDate && this.expiryDate < new Date()) this.status = 'Expired'
  next()
})

medicineSchema.index({ name: 'text', genericName: 'text' })
medicineSchema.index({ status: 1, expiryDate: 1 })

module.exports = mongoose.model('Medicine', medicineSchema)
