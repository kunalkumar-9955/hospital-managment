import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FlaskConical, Search, Plus, Download, AlertCircle, CheckCircle, Clock, X, Brain } from 'lucide-react'
import { mockLabTests } from '../lib/mockData'
import { formatDate, getStatusColor } from '../lib/utils'
import toast from 'react-hot-toast'

export default function LaboratoryPage() {
  const [tests, setTests] = useState(mockLabTests)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ patient: '', test: '', doctor: '', urgent: false })

  const filtered = tests.filter(t => {
    const matchSearch = t.patient.toLowerCase().includes(search.toLowerCase()) || t.test.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'All' || t.status === statusFilter
    return matchSearch && matchStatus
  })

  const handleAdd = (e) => {
    e.preventDefault()
    const newTest = {
      ...form,
      id: `LAB-${Date.now().toString(36).toUpperCase()}`,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending',
      result: null,
    }
    setTests(prev => [newTest, ...prev])
    toast.success('Lab test booked successfully')
    setShowAdd(false)
    setForm({ patient: '', test: '', doctor: '', urgent: false })
  }

  const statusIcon = (status) => {
    if (status === 'Completed') return <CheckCircle className="w-4 h-4 text-emerald-400" />
    if (status === 'Processing') return <Clock className="w-4 h-4 text-blue-400 animate-spin" />
    return <Clock className="w-4 h-4 text-yellow-400" />
  }

  const stats = {
    total: tests.length,
    completed: tests.filter(t => t.status === 'Completed').length,
    processing: tests.filter(t => t.status === 'Processing').length,
    urgent: tests.filter(t => t.urgent).length,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-display">Laboratory</h1>
          <p className="text-gray-400 mt-1">Manage lab tests and reports</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl btn-primary text-sm font-medium">
          <Plus className="w-4 h-4" /> Book Test
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Tests', value: stats.total, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
          { label: 'Completed', value: stats.completed, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
          { label: 'Processing', value: stats.processing, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
          { label: 'Urgent', value: stats.urgent, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
        ].map((s, i) => (
          <div key={i} className={`p-4 rounded-2xl border ${s.bg}`}>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-sm text-gray-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* AI Report Summary */}
      <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20">
        <div className="flex items-center gap-2 mb-2">
          <Brain className="w-5 h-5 text-purple-400" />
          <h3 className="font-semibold text-purple-400">AI Report Analysis</h3>
        </div>
        <p className="text-sm text-gray-400">
          3 reports flagged with abnormal results. Robert Thompson's MRI shows potential ischemic changes — recommend immediate neurologist review. David Kim's tumor markers elevated by 15% from last cycle.
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search tests..." className="w-full pl-10 pr-4 py-2.5 rounded-xl input-dark text-sm" />
        </div>
        {['All', 'Completed', 'Processing', 'Pending'].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${statusFilter === s ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
            {s}
          </button>
        ))}
      </div>

      {/* Tests table */}
      <div className="glass rounded-2xl border border-white/8 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              {['Test ID', 'Patient', 'Test Name', 'Doctor', 'Date', 'Status', 'Result', 'Actions'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((test, i) => (
              <motion.tr
                key={test.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="border-b border-white/5 hover:bg-white/3 transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono text-gray-400">{test.id}</span>
                    {test.urgent && (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 font-medium">URGENT</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm font-medium text-white">{test.patient}</td>
                <td className="px-4 py-3 text-sm text-gray-300">{test.test}</td>
                <td className="px-4 py-3 text-sm text-gray-400">{test.doctor}</td>
                <td className="px-4 py-3 text-sm text-gray-400">{formatDate(test.date)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {statusIcon(test.status)}
                    <span className={`text-sm ${test.status === 'Completed' ? 'text-emerald-400' : test.status === 'Processing' ? 'text-blue-400' : 'text-yellow-400'}`}>
                      {test.status}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  {test.result ? (
                    <span className={`text-sm ${test.result.includes('Abnormal') || test.result.includes('Elevated') ? 'text-red-400' : 'text-emerald-400'}`}>
                      {test.result}
                    </span>
                  ) : (
                    <span className="text-sm text-gray-600">Pending</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    {test.status === 'Completed' && (
                      <button className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors">
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {test.result && test.result.includes('Abnormal') && (
                      <button className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">
                        <AlertCircle className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Test Modal */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAdd(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="glass rounded-3xl p-6 border border-white/10 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Book Lab Test</h2>
                <button onClick={() => setShowAdd(false)} className="p-2 rounded-xl hover:bg-white/10 text-gray-400"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleAdd} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Patient Name *</label>
                  <input required value={form.patient} onChange={e => setForm({...form, patient: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl input-dark text-sm" placeholder="Patient name" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Test Name *</label>
                  <input required value={form.test} onChange={e => setForm({...form, test: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl input-dark text-sm" placeholder="e.g. Complete Blood Count" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Referring Doctor</label>
                  <input value={form.doctor} onChange={e => setForm({...form, doctor: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl input-dark text-sm" placeholder="Dr. Name" />
                </div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={form.urgent} onChange={e => setForm({...form, urgent: e.target.checked})} className="rounded" />
                  <span className="text-sm text-gray-300">Mark as Urgent</span>
                </label>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setShowAdd(false)} className="flex-1 py-3 rounded-xl bg-white/5 text-gray-400 font-medium hover:bg-white/10 transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 py-3 rounded-xl btn-primary font-medium">Book Test</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
