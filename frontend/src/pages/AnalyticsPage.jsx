import { motion } from 'framer-motion'
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, RadarChart, Radar, PolarGrid, PolarAngleAxis
} from 'recharts'
import { TrendingUp, Brain, Activity, Users, DollarSign, Award } from 'lucide-react'
import { revenueData, patientGrowthData, departmentData } from '../lib/mockData'
import { formatCurrency } from '../lib/utils'

const doctorPerformance = [
  { name: 'Dr. Chen', patients: 145, rating: 4.9, revenue: 52000, satisfaction: 96 },
  { name: 'Dr. Park', patients: 98, rating: 4.8, revenue: 38000, satisfaction: 94 },
  { name: 'Dr. Kumar', patients: 132, rating: 4.7, revenue: 45000, satisfaction: 91 },
  { name: 'Dr. Lee', patients: 87, rating: 4.6, revenue: 29000, satisfaction: 89 },
  { name: 'Dr. White', patients: 156, rating: 4.9, revenue: 68000, satisfaction: 97 },
]

const diseaseData = [
  { disease: 'Hypertension', cases: 342, trend: '+5%' },
  { disease: 'Diabetes', cases: 287, trend: '+8%' },
  { disease: 'Cardiac', cases: 198, trend: '+12%' },
  { disease: 'Respiratory', cases: 165, trend: '-3%' },
  { disease: 'Orthopedic', cases: 143, trend: '+2%' },
  { disease: 'Neurological', cases: 121, trend: '+7%' },
]

const radarData = [
  { metric: 'Patient Care', score: 92 },
  { metric: 'Efficiency', score: 85 },
  { metric: 'Revenue', score: 88 },
  { metric: 'Staff', score: 79 },
  { metric: 'Technology', score: 94 },
  { metric: 'Safety', score: 97 },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass rounded-xl p-3 border border-white/10 text-sm">
        <p className="text-gray-400 mb-2">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }} className="font-medium">
            {p.name}: {typeof p.value === 'number' && p.value > 1000 ? formatCurrency(p.value) : p.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function AnalyticsPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
  }
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  const totalRevenue = revenueData.reduce((sum, d) => sum + d.revenue, 0)
  const totalProfit = revenueData.reduce((sum, d) => sum + d.profit, 0)
  const avgOccupancy = 68

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold text-white font-display">Analytics & Reports</h1>
        <p className="text-gray-400 mt-1">AI-powered hospital performance insights</p>
      </motion.div>

      {/* KPI Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Annual Revenue', value: formatCurrency(totalRevenue), change: '+18.5%', icon: DollarSign, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
          { label: 'Net Profit', value: formatCurrency(totalProfit), change: '+22.1%', icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
          { label: 'Avg Occupancy', value: `${avgOccupancy}%`, change: '+5.2%', icon: Activity, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
          { label: 'Patient Satisfaction', value: '94.2%', change: '+1.8%', icon: Award, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
        ].map((kpi, i) => {
          const Icon = kpi.icon
          return (
            <div key={i} className={`p-5 rounded-2xl border ${kpi.bg}`}>
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`w-5 h-5 ${kpi.color}`} />
                <span className="text-sm text-gray-400">{kpi.label}</span>
              </div>
              <p className={`text-xl font-bold ${kpi.color}`}>{kpi.value}</p>
              <p className="text-xs text-emerald-400 mt-1">{kpi.change} vs last year</p>
            </div>
          )
        })}
      </motion.div>

      {/* Revenue trend */}
      <motion.div variants={itemVariants} className="glass rounded-2xl p-6 border border-white/8">
        <h3 className="font-semibold text-white mb-1">Revenue vs Expenses vs Profit</h3>
        <p className="text-sm text-gray-400 mb-5">12-month financial performance</p>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={revenueData}>
            <defs>
              <linearGradient id="revGrad2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="profGrad2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ color: '#9ca3af', fontSize: '12px' }} />
            <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} fill="url(#revGrad2)" name="Revenue" />
            <Area type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={2} fill="url(#profGrad2)" name="Profit" />
            <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Expenses" />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Patient growth */}
        <motion.div variants={itemVariants} className="glass rounded-2xl p-6 border border-white/8">
          <h3 className="font-semibold text-white mb-1">Patient Flow Analysis</h3>
          <p className="text-sm text-gray-400 mb-5">Monthly patient categories</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={patientGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#1f2937', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#f1f5f9' }} />
              <Legend wrapperStyle={{ color: '#9ca3af', fontSize: '12px' }} />
              <Bar dataKey="inpatients" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Inpatients" />
              <Bar dataKey="outpatients" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Outpatients" />
              <Bar dataKey="emergency" fill="#ef4444" radius={[4, 4, 0, 0]} name="Emergency" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Hospital efficiency radar */}
        <motion.div variants={itemVariants} className="glass rounded-2xl p-6 border border-white/8">
          <h3 className="font-semibold text-white mb-1">Hospital Efficiency Score</h3>
          <p className="text-sm text-gray-400 mb-5">AI-generated performance metrics</p>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.1)" />
              <PolarAngleAxis dataKey="metric" tick={{ fill: '#9ca3af', fontSize: 11 }} />
              <Radar name="Score" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} strokeWidth={2} />
              <Tooltip contentStyle={{ background: '#1f2937', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#f1f5f9' }} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Doctor performance */}
      <motion.div variants={itemVariants} className="glass rounded-2xl p-6 border border-white/8">
        <h3 className="font-semibold text-white mb-5">Doctor Performance Leaderboard</h3>
        <div className="space-y-3">
          {doctorPerformance.sort((a, b) => b.satisfaction - a.satisfaction).map((doc, i) => (
            <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${i === 0 ? 'bg-yellow-500/20 text-yellow-400' : i === 1 ? 'bg-gray-400/20 text-gray-300' : i === 2 ? 'bg-orange-500/20 text-orange-400' : 'bg-white/5 text-gray-500'}`}>
                {i + 1}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-white">{doc.name}</span>
                  <span className="text-sm text-emerald-400 font-medium">{doc.satisfaction}%</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${doc.satisfaction}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-500"
                  />
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">{doc.patients} patients</p>
                <p className="text-xs text-blue-400">{formatCurrency(doc.revenue)}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Disease analytics */}
      <motion.div variants={itemVariants} className="glass rounded-2xl p-6 border border-white/8">
        <div className="flex items-center gap-3 mb-5">
          <Brain className="w-5 h-5 text-purple-400" />
          <h3 className="font-semibold text-white">Disease Trend Analytics</h3>
          <span className="ml-auto text-xs px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">AI Powered</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {diseaseData.map((d, i) => (
            <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-white">{d.disease}</span>
                <span className={`text-xs font-medium ${d.trend.startsWith('+') ? 'text-red-400' : 'text-emerald-400'}`}>{d.trend}</span>
              </div>
              <p className="text-2xl font-bold text-blue-400">{d.cases}</p>
              <p className="text-xs text-gray-500">cases this month</p>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
