import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DollarSign, Download, Search, Plus, Eye, FileText, CreditCard, TrendingUp, X, CheckCircle } from 'lucide-react'
import { mockBillings } from '../lib/mockData'
import { formatCurrency, getStatusColor, formatDate } from '../lib/utils'
import toast from 'react-hot-toast'

function InvoiceModal({ bill, onClose }) {
  if (!bill) return null
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
        className="glass rounded-3xl p-6 border border-white/10 w-full max-w-md"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Invoice Details</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10 text-gray-400"><X className="w-5 h-5" /></button>
        </div>

        {/* Invoice header */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/10 mb-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-gray-500">Invoice</p>
              <p className="text-lg font-bold text-white font-mono">{bill.id}</p>
            </div>
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getStatusColor(bill.status)}`}>{bill.status}</span>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Patient</span>
            <span className="text-white font-medium">{bill.patient}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Date</span>
            <span className="text-white">{formatDate(bill.date)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Insurance</span>
            <span className="text-white">{bill.insurance}</span>
          </div>
        </div>

        <div className="border-t border-white/10 pt-4 mb-4">
          <p className="text-sm font-medium text-gray-400 mb-3">Services</p>
          {bill.services.map((s, i) => (
            <div key={i} className="flex justify-between text-sm py-1.5">
              <span className="text-gray-300">{s}</span>
              <span className="text-white">{formatCurrency(bill.amount / bill.services.length)}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Subtotal</span>
            <span className="text-white">{formatCurrency(bill.amount)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">GST (18%)</span>
            <span className="text-white">{formatCurrency(bill.amount * 0.18)}</span>
          </div>
          <div className="flex justify-between text-base font-bold pt-2 border-t border-white/10">
            <span className="text-white">Total</span>
            <span className="text-blue-400">{formatCurrency(bill.amount * 1.18)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Paid</span>
            <span className="text-emerald-400">{formatCurrency(bill.paid)}</span>
          </div>
          <div className="flex justify-between text-sm font-medium">
            <span className="text-gray-400">Balance Due</span>
            <span className={bill.amount - bill.paid > 0 ? 'text-red-400' : 'text-emerald-400'}>
              {formatCurrency(Math.max(0, bill.amount - bill.paid))}
            </span>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button className="flex-1 py-2.5 rounded-xl bg-blue-500/10 text-blue-400 font-medium hover:bg-blue-500/20 transition-colors flex items-center justify-center gap-2">
            <Download className="w-4 h-4" /> Download PDF
          </button>
          {bill.status !== 'Paid' && (
            <button onClick={() => { toast.success('Payment processed!'); onClose() }} className="flex-1 py-2.5 rounded-xl btn-primary font-medium flex items-center justify-center gap-2">
              <CreditCard className="w-4 h-4" /> Pay Now
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function BillingPage() {
  const [bills, setBills] = useState(mockBillings)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [selectedBill, setSelectedBill] = useState(null)

  const filtered = bills.filter(b => {
    const matchSearch = b.patient.toLowerCase().includes(search.toLowerCase()) || b.id.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'All' || b.status === statusFilter
    return matchSearch && matchStatus
  })

  const totalRevenue = bills.reduce((sum, b) => sum + b.paid, 0)
  const totalPending = bills.reduce((sum, b) => sum + (b.amount - b.paid), 0)
  const totalBilled = bills.reduce((sum, b) => sum + b.amount, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-display">Billing & Payments</h1>
          <p className="text-gray-400 mt-1">Manage invoices and financial records</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl btn-primary text-sm font-medium">
          <Plus className="w-4 h-4" /> New Invoice
        </button>
      </div>

      {/* Financial stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Total Billed', value: totalBilled, icon: FileText, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
          { label: 'Collected', value: totalRevenue, icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
          { label: 'Pending', value: totalPending, icon: TrendingUp, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
        ].map((s, i) => {
          const Icon = s.icon
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-5 rounded-2xl border ${s.bg}`}
            >
              <div className="flex items-center gap-3 mb-2">
                <Icon className={`w-5 h-5 ${s.color}`} />
                <span className="text-sm text-gray-400">{s.label}</span>
              </div>
              <p className={`text-2xl font-bold ${s.color}`}>{formatCurrency(s.value)}</p>
            </motion.div>
          )
        })}
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search bills..." className="w-full pl-10 pr-4 py-2.5 rounded-xl input-dark text-sm" />
        </div>
        {['All', 'Paid', 'Partial', 'Pending'].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${statusFilter === s ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
            {s}
          </button>
        ))}
      </div>

      {/* Bills table */}
      <div className="glass rounded-2xl border border-white/8 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              {['Invoice', 'Patient', 'Date', 'Services', 'Amount', 'Paid', 'Status', 'Actions'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((bill, i) => (
              <motion.tr
                key={bill.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="border-b border-white/5 hover:bg-white/3 transition-colors"
              >
                <td className="px-4 py-3 text-sm font-mono text-gray-400">{bill.id}</td>
                <td className="px-4 py-3 text-sm font-medium text-white">{bill.patient}</td>
                <td className="px-4 py-3 text-sm text-gray-400">{formatDate(bill.date)}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {bill.services.slice(0, 2).map((s, j) => (
                      <span key={j} className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-gray-400">{s}</span>
                    ))}
                    {bill.services.length > 2 && <span className="text-xs text-gray-500">+{bill.services.length - 2}</span>}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm font-medium text-white">{formatCurrency(bill.amount)}</td>
                <td className="px-4 py-3 text-sm text-emerald-400">{formatCurrency(bill.paid)}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getStatusColor(bill.status)}`}>{bill.status}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => setSelectedBill(bill)} className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors">
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button className="p-1.5 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 transition-colors">
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {selectedBill && <InvoiceModal bill={selectedBill} onClose={() => setSelectedBill(null)} />}
      </AnimatePresence>
    </div>
  )
}
