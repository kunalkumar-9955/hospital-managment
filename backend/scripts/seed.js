/**
 * Database Seeder - Populates the database with realistic demo data
 * Run: node scripts/seed.js
 */

require('dotenv').config()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const User = require('../models/User')
const Doctor = require('../models/Doctor')
const Patient = require('../models/Patient')
const Medicine = require('../models/Medicine')
const Bed = require('../models/Bed')

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/medicore'

const seedUsers = [
  { name: 'Dr. Admin User', email: 'admin@medicore.com', password: 'admin123', role: 'admin', department: 'Administration' },
  { name: 'Dr. Sarah Chen', email: 'doctor@medicore.com', password: 'doctor123', role: 'doctor', department: 'Cardiology' },
  { name: 'Jane Smith', email: 'reception@medicore.com', password: 'recep123', role: 'receptionist', department: 'Front Desk' },
  { name: 'Dr. Michael Park', email: 'mpark@medicore.com', password: 'doctor123', role: 'doctor', department: 'Emergency' },
  { name: 'Dr. Lisa Kumar', email: 'lkumar@medicore.com', password: 'doctor123', role: 'doctor', department: 'Neurology' },
]

const seedDoctors = [
  { name: 'Dr. Sarah Chen', email: 'doctor@medicore.com', phone: '+1-555-1001', specialization: 'Cardiology', department: 'Cardiology', experience: 15, consultationFee: 250, rating: 4.9, status: 'Online' },
  { name: 'Dr. Michael Park', email: 'mpark@medicore.com', phone: '+1-555-1002', specialization: 'Emergency Medicine', department: 'ICU', experience: 12, consultationFee: 300, rating: 4.8, status: 'Busy' },
  { name: 'Dr. Lisa Kumar', email: 'lkumar@medicore.com', phone: '+1-555-1003', specialization: 'Neurology', department: 'Neurology', experience: 18, consultationFee: 280, rating: 4.7, status: 'Online' },
  { name: 'Dr. James Lee', email: 'jlee@medicore.com', phone: '+1-555-1004', specialization: 'Orthopedics', department: 'Orthopedics', experience: 10, consultationFee: 220, rating: 4.6, status: 'Offline' },
  { name: 'Dr. Anna White', email: 'awhite@medicore.com', phone: '+1-555-1005', specialization: 'Oncology', department: 'Oncology', experience: 20, consultationFee: 350, rating: 4.9, status: 'Online' },
]

const seedMedicines = [
  { name: 'Metformin 500mg', genericName: 'Metformin', category: 'Antidiabetic', currentStock: 450, minStockLevel: 100, sellingPrice: 12.50, supplier: 'PharmaCorp', expiryDate: new Date('2027-06-30') },
  { name: 'Lisinopril 10mg', genericName: 'Lisinopril', category: 'Antihypertensive', currentStock: 85, minStockLevel: 100, sellingPrice: 18.00, supplier: 'MediSupply', expiryDate: new Date('2027-03-15') },
  { name: 'Atorvastatin 20mg', genericName: 'Atorvastatin', category: 'Statin', currentStock: 320, minStockLevel: 80, sellingPrice: 25.00, supplier: 'PharmaCorp', expiryDate: new Date('2026-12-31') },
  { name: 'Amoxicillin 250mg', genericName: 'Amoxicillin', category: 'Antibiotic', currentStock: 15, minStockLevel: 50, sellingPrice: 8.75, supplier: 'BioMed', expiryDate: new Date('2026-08-20') },
  { name: 'Paracetamol 500mg', genericName: 'Paracetamol', category: 'Analgesic', currentStock: 1200, minStockLevel: 200, sellingPrice: 5.00, supplier: 'GenericPharma', expiryDate: new Date('2028-01-01') },
]

const seedBeds = [
  { bedId: 'BED-101', roomNumber: '101', ward: 'General', floor: 1, status: 'Available' },
  { bedId: 'BED-102', roomNumber: '102', ward: 'General', floor: 1, status: 'Available' },
  { bedId: 'BED-ICU-01', roomNumber: 'ICU-01', ward: 'ICU', floor: 2, status: 'Available', hasOxygen: true, hasMonitor: true },
  { bedId: 'BED-ICU-02', roomNumber: 'ICU-02', ward: 'ICU', floor: 2, status: 'Available', hasOxygen: true, hasMonitor: true, hasVentilator: true },
  { bedId: 'BED-ICU-03', roomNumber: 'ICU-03', ward: 'ICU', floor: 2, status: 'Available', hasOxygen: true, hasMonitor: true },
  { bedId: 'BED-201', roomNumber: '201', ward: 'Cardiology', floor: 2, status: 'Available', hasMonitor: true },
  { bedId: 'BED-301', roomNumber: '301', ward: 'Oncology', floor: 3, status: 'Available' },
]

async function seed() {
  try {
    console.log('🌱 Connecting to MongoDB...')
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    // Clear existing data
    console.log('🗑️  Clearing existing data...')
    await Promise.all([
      User.deleteMany({}),
      Doctor.deleteMany({}),
      Patient.deleteMany({}),
      Medicine.deleteMany({}),
      Bed.deleteMany({}),
    ])

    // Seed users
    console.log('👥 Seeding users...')
    await User.create(seedUsers)

    // Seed doctors
    console.log('👨‍⚕️ Seeding doctors...')
    await Doctor.create(seedDoctors)

    // Seed medicines
    console.log('💊 Seeding medicines...')
    await Medicine.create(seedMedicines)

    // Seed beds
    console.log('🛏️  Seeding beds...')
    await Bed.create(seedBeds)

    console.log('\n✅ Database seeded successfully!')
    console.log('📧 Demo accounts:')
    console.log('   Admin: admin@medicore.com / admin123')
    console.log('   Doctor: doctor@medicore.com / doctor123')
    console.log('   Reception: reception@medicore.com / recep123')

    process.exit(0)
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  }
}

seed()
