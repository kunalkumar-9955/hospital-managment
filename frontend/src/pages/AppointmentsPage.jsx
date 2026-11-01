import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Clock, Plus, Search, Filter, Check, X, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react'
import { mockAppointments } from '../lib/mockData'
import { getStatusColor, formatDate } from '../lib/utils'
import toast from 'react-hot-toast'

const timeSlots = ['08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM']

function AppointmentRow({ apt, onConfirm, onCancel }) {
  const typeColors = {
    'Follow-up': 'bg-blue-500/10 text-blue-400',
    'Emergency': 'bg-red-500/10 text-red-400',
    'Consultation': 'bg-purple-500/10 text-purple-400',
    'Chemotherapy': 'bg-orange-500/10 text-orange-400',
    'Pre-op': 'bg-cyan-500/10 text-cyan-400',
  }

  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="border-b border-white/5 hover:bg-white/3 transition-colors"
    >
      <td className="px-4 py-3">
        <p className="text-sm font-medium text-white">{apt.patient}</p>
        <p className="text-xs text-gray-500 font-mono">{apt.id}</p>
      </td>
      <td className="px-4 py-3 text-sm text-gray-300">{apt.doctor}</td>
      <td className="px-4 py-3 text-sm text-gray-400">{apt.department}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <Calendar className="w-3.5 h-3.5 text-blue-400" />
          {apt.date}
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
          <Clock className="w-3 h-3" />
          {apt.time}
        </div>
      </td>
      <td className="px-4 py-3">
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${typeColors[apt.type] || 'bg-gray-500/10 text-gray-400'}`}>
          {apt.type}
        </span>
      </td>
      <td className="px-4 py-3">
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getStatusColor(apt.status)}`}>
          {apt.status}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex gap-2">
          {apt.status === 'Pending' && (
            <button onClick={() => onConfirm(apt.id)} className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors">
              <Check className="w-3.5 h-3.5" />
            </button>
          )}
          <button onClick={() => onCancel(apt.id)} className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
    </motion.tr>
  )
}

function BookingModal({ onClose, onBook }) {
  const [form, setForm] = useState({
    patient: '', doctor: '', department: '', date: '', time: '', type: 'Consultation', notes: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const newApt = {
      ...form,
      id: `APT-${Date.now().toString(36).toUpperCase()}`,
      status: 'Pending',
    }
    onBook(newApt)
    toast.success('Appointment booked successfully!')
    onClose()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={e => e.stopPropagation()}
        className="glass rounded-3xl p-6 border border-white/10 w-full max-w-lg"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Book Appointment</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10 text-gray-400"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Patient Name *</label>
              <input required value={form.patient} onChange={e => setForm({...form, patient: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl input-dark text-sm" placeholder="Patient name" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Doctor *</label>
              <input required value={form.doctor} onChange={e => setForm({...form, doctor: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl input-dark text-sm" placeholder="Dr. Name" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Department</label>
              <input value={form.department} onChange={e => setForm({...form, department: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl input-dark text-sm" placeholder="Department" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Type</label>
              <select value={form.type} onChange={e => setForm({...form, type: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl input-dark text-sm">
                {['Consultation', 'Follow-up', 'Emergency', 'Pre-op', 'Chemotherapy', 'Check-up'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Date *</label>
              <input required type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl input-dark text-sm" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Time Slot</label>
              <select value={form.time} onChange={e => setForm({...form, time: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl input-dark text-sm">
                <option value="">Select time</option>
                {timeSlots.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Notes</label>
            <textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})}
              className="w-full px-4 py-2.5 rounded-xl input-dark text-sm resize-none" rows={3} placeholder="Additional notes..." />
          </div>

          {/* AI suggestion */}
          <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-sm">
            <p className="text-purple-400 font-medium mb-1">🤖 AI Suggestion</p>
            <p className="text-gray-400 text-xs">Best available slot: Tomorrow 10:00 AM with Dr. Sarah Chen (Cardiology) — 95% match based on patient history</p>
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl bg-white/5 text-gray-400 font-medium hover:bg-white/10 transition-colors">Cancel</button>
            <button type="submit" className="flex-1 py-3 rounded-xl btn-primary font-medium">Book Appointment</button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState(mockAppointments)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [showBooking, setShowBooking] = useState(false)
  const [viewMode, setViewMode] = useState('list')

  const filtered = appointments.filter(a => {
    const matchSearch = a.patient.toLowerCase().includes(search.toLowerCase()) ||
      a.doctor.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'All' || a.status === statusFilter
    return matchSearch && matchStatus
  })

  const handleConfirm = (id) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'Confirmed' } : a))
    toast.success('Appointment confirmed')
  }

  const handleCancel = (id) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'Cancelled' } : a))
    toast.error('Appointment cancelled')
  }

  const handleBook = (apt) => {
    setAppointments(prev => [apt, ...prev])
  }

  const stats = {
    total: appointments.length,
    confirmed: appointments.filter(a => a.status === 'Confirmed').length,
    pending: appointments.filter(a => a.status === 'Pending').length,
    cancelled: appointments.filter(a => a.status === 'Cancelled').length,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-display">Appointments</h1>
          <p className="text-gray-400 mt-1">Manage and schedule patient appointments</p>
        </div>
        <button onClick={() => setShowBooking(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl btn-primary text-sm font-medium">
          <Plus className="w-4 h-4" /> Book Appointment
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total', value: stats.total, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
          { label: 'Confirmed', value: stats.confirmed, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
          { label: 'Pending', value: stats.pending, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
          { label: 'Cancelled', value: stats.cancelled, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
        ].map((s, i) => (
          <div key={i} className={`p-4 rounded-2xl border ${s.bg}`}>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-sm text-gray-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search appointments..." className="w-full pl-10 pr-4 py-2.5 rounded-xl input-dark text-sm" />
        </div>
        {['All', 'Confirmed', 'Pending', 'Cancelled'].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${statusFilter === s ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
            {s}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="glass rounded-2xl border border-white/8 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              {['Patient', 'Doctor', 'Department', 'Date & Time', 'Type', 'Status', 'Actions'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {filtered.map(apt => (
                <AppointmentRow key={apt.id} apt={apt} onConfirm={handleConfirm} onCancel={handleCancel} />
              ))}
            </AnimatePresence>
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Calendar className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>No appointments found</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showBooking && <BookingModal onClose={() => setShowBooking(false)} onBook={handleBook} />}
      </AnimatePresence>
    </div>
  )
}
