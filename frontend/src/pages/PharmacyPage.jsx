import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Pill, Search, Plus, AlertTriangle, Package, TrendingDown, X, Edit, Trash2 } from 'lucide-react'
import { mockMedicines } from '../lib/mockData'
import { formatCurrency, formatDate } from '../lib/utils'
import toast from 'react-hot-toast'

function StockBadge({ status }) {
  const colors = {
    'In Stock': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    'Low Stock': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    'Critical': 'bg-red-500/10 text-red-400 border-red-500/20',
    'Out of Stock': 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  }
  return (
    <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${colors[status] || colors['In Stock']}`}>
      {status}
    </span>
  )
}

export default function PharmacyPage() {
  const [medicines, setMedicines] = useState(mockMedicines)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ name: '', category: '', stock: '', minStock: '', price: '', supplier: '', expiry: '' })

  const categories = ['All', ...new Set(medicines.map(m => m.category))]

  const filtered = medicines.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.supplier.toLowerCase().includes(search.toLowerCase())
    const matchCat = categoryFilter === 'All' || m.category === categoryFilter
    return matchSearch && matchCat
  })

  const alerts = medicines.filter(m => m.status === 'Low Stock' || m.status === 'Critical')

  const handleAdd = (e) => {
    e.preventDefault()
    const stock = parseInt(form.stock)
    const minStock = parseInt(form.minStock)
    const status = stock === 0 ? 'Out of Stock' : stock <= minStock * 0.3 ? 'Critical' : stock <= minStock ? 'Low Stock' : 'In Stock'
    const newMed = {
      ...form,
      id: `MED-${Date.now().toString(36).toUpperCase()}`,
      stock,
      minStock,
      price: parseFloat(form.price),
      status,
    }
    setMedicines(prev => [newMed, ...prev])
    toast.success('Medicine added to inventory')
    setShowAdd(false)
    setForm({ name: '', category: '', stock: '', minStock: '', price: '', supplier: '', expiry: '' })
  }

  const handleDelete = (id) => {
    setMedicines(prev => prev.filter(m => m.id !== id))
    toast.success('Medicine removed from inventory')
  }

  const totalValue = medicines.reduce((sum, m) => sum + m.stock * m.price, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-display">Pharmacy & Inventory</h1>
          <p className="text-gray-400 mt-1">{medicines.length} medicines tracked</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl btn-primary text-sm font-medium">
          <Plus className="w-4 h-4" /> Add Medicine
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Medicines', value: medicines.length, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
          { label: 'In Stock', value: medicines.filter(m => m.status === 'In Stock').length, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
          { label: 'Low/Critical', value: alerts.length, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
          { label: 'Inventory Value', value: formatCurrency(totalValue), color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20', isString: true },
        ].map((s, i) => (
          <div key={i} className={`p-4 rounded-2xl border ${s.bg}`}>
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-sm text-gray-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-orange-400" />
            <h3 className="font-semibold text-orange-400">Stock Alerts ({alerts.length})</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {alerts.map(m => (
              <div key={m.id} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 text-sm">
                <Pill className="w-3.5 h-3.5 text-orange-400" />
                <span className="text-gray-300">{m.name}</span>
                <span className={m.status === 'Critical' ? 'text-red-400' : 'text-yellow-400'}>({m.stock} left)</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Prediction */}
      <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-purple-400">🤖</span>
          <h3 className="font-semibold text-purple-400">AI Demand Prediction</h3>
        </div>
        <p className="text-sm text-gray-400">Based on current patient trends, Amoxicillin demand will increase 40% next week. Recommend ordering 200+ units. Paracetamol stock is optimal for the next 30 days.</p>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search medicines..." className="w-full pl-10 pr-4 py-2.5 rounded-xl input-dark text-sm" />
        </div>
        <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl input-dark text-sm">
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* Medicine table */}
      <div className="glass rounded-2xl border border-white/8 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              {['Medicine', 'Category', 'Stock', 'Min Stock', 'Price', 'Supplier', 'Expiry', 'Status', 'Actions'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((med, i) => (
              <motion.tr
                key={med.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="border-b border-white/5 hover:bg-white/3 transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <Pill className="w-4 h-4 text-blue-400" />
                    </div>
                    <span className="text-sm font-medium text-white">{med.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-400">{med.category}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${med.stock <= med.minStock * 0.3 ? 'text-red-400' : med.stock <= med.minStock ? 'text-yellow-400' : 'text-white'}`}>
                      {med.stock}
                    </span>
                    <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${med.stock <= med.minStock * 0.3 ? 'bg-red-400' : med.stock <= med.minStock ? 'bg-yellow-400' : 'bg-emerald-400'}`}
                        style={{ width: `${Math.min(100, (med.stock / (med.minStock * 3)) * 100)}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-400">{med.minStock}</td>
                <td className="px-4 py-3 text-sm text-white">{formatCurrency(med.price)}</td>
                <td className="px-4 py-3 text-sm text-gray-400">{med.supplier}</td>
                <td className="px-4 py-3 text-sm text-gray-400">{formatDate(med.expiry)}</td>
                <td className="px-4 py-3"><StockBadge status={med.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button className="p-1.5 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 transition-colors"><Edit className="w-3.5 h-3.5" /></button>
                    <button onClick={() => handleDelete(med.id)} className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Medicine Modal */}
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
              className="glass rounded-3xl p-6 border border-white/10 w-full max-w-lg"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Add Medicine</h2>
                <button onClick={() => setShowAdd(false)} className="p-2 rounded-xl hover:bg-white/10 text-gray-400"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleAdd} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1.5">Medicine Name *</label>
                    <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl input-dark text-sm" placeholder="e.g. Metformin 500mg" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1.5">Category</label>
                    <input value={form.category} onChange={e => setForm({...form, category: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl input-dark text-sm" placeholder="e.g. Antibiotic" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1.5">Current Stock *</label>
                    <input required type="number" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl input-dark text-sm" placeholder="Units" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1.5">Min Stock Level</label>
                    <input type="number" value={form.minStock} onChange={e => setForm({...form, minStock: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl input-dark text-sm" placeholder="Alert threshold" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1.5">Price per Unit</label>
                    <input type="number" step="0.01" value={form.price} onChange={e => setForm({...form, price: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl input-dark text-sm" placeholder="$0.00" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1.5">Supplier</label>
                    <input value={form.supplier} onChange={e => setForm({...form, supplier: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl input-dark text-sm" placeholder="Supplier name" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm text-gray-400 mb-1.5">Expiry Date</label>
                    <input type="date" value={form.expiry} onChange={e => setForm({...form, expiry: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl input-dark text-sm" />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setShowAdd(false)} className="flex-1 py-3 rounded-xl bg-white/5 text-gray-400 font-medium hover:bg-white/10 transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 py-3 rounded-xl btn-primary font-medium">Add Medicine</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
