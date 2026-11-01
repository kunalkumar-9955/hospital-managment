import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bed, User, Clock, Plus, Filter } from 'lucide-react'
import { mockBeds } from '../lib/mockData'
import { formatDate } from '../lib/utils'
import toast from 'react-hot-toast'

const wardColors = {
  'General': 'border-blue-500/20 bg-blue-500/5',
  'ICU': 'border-red-500/20 bg-red-500/5',
  'Cardiology': 'border-pink-500/20 bg-pink-500/5',
  'Oncology': 'border-purple-500/20 bg-purple-500/5',
}

function BedCard({ bed, onAllocate, onRelease }) {
  const statusConfig = {
    Available: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', dot: 'bg-emerald-400' },
    Occupied: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', dot: 'bg-red-400' },
    Maintenance: { color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', dot: 'bg-yellow-400' },
  }
  const config = statusConfig[bed.status] || statusConfig.Available

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      className={`p-4 rounded-2xl border ${config.border} ${config.bg} transition-all cursor-pointer`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Bed className={`w-5 h-5 ${config.color}`} />
          <span className="font-bold text-white">{bed.id}</span>
        </div>
        <div className={`flex items-center gap-1.5 text-xs font-medium ${config.color}`}>
          <div className={`w-1.5 h-1.5 rounded-full ${config.dot}`}></div>
          {bed.status}
        </div>
      </div>

      <div className="space-y-1.5 mb-3">
        <p className="text-xs text-gray-500">Room {bed.room} · {bed.ward} Ward · Floor {bed.floor}</p>
        {bed.patient && (
          <div className="flex items-center gap-1.5 text-sm text-gray-300">
            <User className="w-3.5 h-3.5 text-blue-400" />
            <span>{bed.patient}</span>
          </div>
        )}
        {bed.admittedSince && (
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            <span>Since {formatDate(bed.admittedSince)}</span>
          </div>
        )}
      </div>

      {bed.status === 'Available' ? (
        <button
          onClick={() => onAllocate(bed.id)}
          className="w-full py-2 rounded-xl bg-emerald-500/10 text-emerald-400 text-sm font-medium hover:bg-emerald-500/20 transition-colors"
        >
          Allocate Bed
        </button>
      ) : bed.status === 'Occupied' ? (
        <button
          onClick={() => onRelease(bed.id)}
          className="w-full py-2 rounded-xl bg-blue-500/10 text-blue-400 text-sm font-medium hover:bg-blue-500/20 transition-colors"
        >
          Release Bed
        </button>
      ) : (
        <button className="w-full py-2 rounded-xl bg-yellow-500/10 text-yellow-400 text-sm font-medium cursor-not-allowed">
          Under Maintenance
        </button>
      )}
    </motion.div>
  )
}

export default function BedsPage() {
  const [beds, setBeds] = useState(mockBeds)
  const [wardFilter, setWardFilter] = useState('All')

  const wards = ['All', ...new Set(beds.map(b => b.ward))]

  const filtered = beds.filter(b => wardFilter === 'All' || b.ward === wardFilter)

  const stats = {
    total: beds.length,
    available: beds.filter(b => b.status === 'Available').length,
    occupied: beds.filter(b => b.status === 'Occupied').length,
    maintenance: beds.filter(b => b.status === 'Maintenance').length,
    occupancyRate: Math.round((beds.filter(b => b.status === 'Occupied').length / beds.length) * 100),
  }

  const handleAllocate = (id) => {
    setBeds(prev => prev.map(b => b.id === id ? { ...b, status: 'Occupied', patient: 'New Patient', admittedSince: new Date().toISOString().split('T')[0] } : b))
    toast.success('Bed allocated successfully')
  }

  const handleRelease = (id) => {
    setBeds(prev => prev.map(b => b.id === id ? { ...b, status: 'Available', patient: null, admittedSince: null } : b))
    toast.success('Bed released')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-display">Beds & Rooms</h1>
          <p className="text-gray-400 mt-1">Real-time bed availability management</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl btn-primary text-sm font-medium">
          <Plus className="w-4 h-4" /> Add Bed
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Total Beds', value: stats.total, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
          { label: 'Available', value: stats.available, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
          { label: 'Occupied', value: stats.occupied, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
          { label: 'Maintenance', value: stats.maintenance, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
          { label: 'Occupancy Rate', value: `${stats.occupancyRate}%`, color: stats.occupancyRate > 80 ? 'text-red-400' : 'text-emerald-400', bg: stats.occupancyRate > 80 ? 'bg-red-500/10 border-red-500/20' : 'bg-emerald-500/10 border-emerald-500/20' },
        ].map((s, i) => (
          <div key={i} className={`p-4 rounded-2xl border ${s.bg}`}>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-sm text-gray-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Occupancy bar */}
      <div className="glass rounded-2xl p-5 border border-white/8">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-white">Overall Occupancy</h3>
          <span className={`text-sm font-bold ${stats.occupancyRate > 80 ? 'text-red-400' : stats.occupancyRate > 60 ? 'text-yellow-400' : 'text-emerald-400'}`}>
            {stats.occupancyRate}%
          </span>
        </div>
        <div className="h-3 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${stats.occupancyRate}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className={`h-full rounded-full ${stats.occupancyRate > 80 ? 'bg-gradient-to-r from-red-500 to-red-400' : stats.occupancyRate > 60 ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' : 'bg-gradient-to-r from-emerald-500 to-emerald-400'}`}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>0%</span>
          <span className="text-yellow-400">Warning: 70%</span>
          <span className="text-red-400">Critical: 90%</span>
          <span>100%</span>
        </div>
      </div>

      {/* AI Prediction */}
      <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20">
        <p className="text-sm text-purple-400 font-medium mb-1">🤖 AI Occupancy Prediction</p>
        <p className="text-sm text-gray-400">Based on current admission trends, ICU occupancy will reach 95% within 36 hours. Recommend preparing overflow protocols and contacting partner hospitals.</p>
      </div>

      {/* Ward filter */}
      <div className="flex gap-2 flex-wrap">
        {wards.map(w => (
          <button key={w} onClick={() => setWardFilter(w)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${wardFilter === w ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
            {w}
          </button>
        ))}
      </div>

      {/* Bed grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((bed, i) => (
          <motion.div
            key={bed.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <BedCard bed={bed} onAllocate={handleAllocate} onRelease={handleRelease} />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
