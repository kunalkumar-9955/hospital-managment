/**
 * MediCore AI - Hospital Management System
 * Main Server Entry Point
 */

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const { createServer } = require('http')
const { Server } = require('socket.io')
require('dotenv').config()

const app = express()
const httpServer = createServer(app)

// Socket.IO for real-time features
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
})

// Make io accessible in routes
app.set('io', io)

// ─── Middleware ───────────────────────────────────────────────────────────────

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}))

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  message: { success: false, message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
})
app.use('/api/', limiter)

// Body parsing
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'))
}

// ─── Routes ──────────────────────────────────────────────────────────────────

app.use('/api/auth', require('./routes/auth'))
app.use('/api/patients', require('./routes/patients'))
app.use('/api/doctors', require('./routes/doctors'))
app.use('/api/appointments', require('./routes/appointments'))
app.use('/api/billing', require('./routes/billing'))
app.use('/api/pharmacy', require('./routes/pharmacy'))
app.use('/api/laboratory', require('./routes/laboratory'))
app.use('/api/beds', require('./routes/beds'))
app.use('/api/emergency', require('./routes/emergency'))
app.use('/api/analytics', require('./routes/analytics'))
app.use('/api/ai', require('./routes/ai'))

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'MediCore API is running',
    version: '2.4.1',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' })
})

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message)
  const statusCode = err.statusCode || 500
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
})

// ─── Socket.IO Events ─────────────────────────────────────────────────────────

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`)

  socket.on('join-room', (room) => {
    socket.join(room)
    console.log(`Socket ${socket.id} joined room: ${room}`)
  })

  socket.on('emergency-alert', (data) => {
    io.emit('emergency-broadcast', data)
  })

  socket.on('bed-update', (data) => {
    io.emit('bed-status-change', data)
  })

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`)
  })
})

// Emit live stats every 30 seconds
setInterval(() => {
  io.emit('live-stats', {
    timestamp: new Date(),
    activePatients: Math.floor(Math.random() * 20) + 180,
    icuOccupancy: Math.floor(Math.random() * 10) + 80,
    emergencyCases: Math.floor(Math.random() * 5) + 2,
  })
}, 30000)

// ─── Database & Server Start ──────────────────────────────────────────────────

const PORT = process.env.PORT || 5000

const startServer = async () => {
  try {
    // Connect to MongoDB (optional - server runs in demo mode without it)
    if (process.env.MONGODB_URI && !process.env.MONGODB_URI.includes('localhost')) {
      try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('✅ MongoDB connected successfully')
      } catch (dbError) {
        console.log('⚠️  MongoDB connection failed - running in demo mode:', dbError.message)
      }
    } else {
      // Try local MongoDB, but don't fail if not available
      try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/medicore')
        console.log('✅ MongoDB connected successfully')
      } catch (dbError) {
        console.log('⚠️  Local MongoDB not available - running in demo mode (no DB required for demo)')
      }
    }

    httpServer.listen(PORT, () => {
      console.log(`
╔═══════════════════════════════════════════╗
║     MediCore AI - Hospital Management     ║
║     Backend Server v2.4.1                 ║
╠═══════════════════════════════════════════╣
║  🚀 Server: http://localhost:${PORT}         ║
║  📊 Health: http://localhost:${PORT}/api/health ║
║  🌍 Environment: ${process.env.NODE_ENV || 'development'}          ║
╚═══════════════════════════════════════════╝
      `)
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

startServer()

module.exports = { app, io }
