import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Users, UserCheck, DollarSign, TrendingUp, AlertTriangle,
  Bed, Pill, Activity, ArrowUpRight, ArrowDownRight,
  Brain, Zap, Shield, BarChart3, Settings, Bell
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line
} from 'recharts'
import AnimatedNumber from '../../hooks/useCountUp.jsx'
import { revenueData, patientGrowthData, departmentData, activityFeed } from '../../lib/mockData'
import { formatCurrency } from '../../lib/utils'
import FaceRecognitionWidget from '../../components/FaceRecognitionWidget'

const STATS = [
  { title: 'Total Revenue (Month)', value: 378000, prefix: '$', suffix: '', change: '+15.3%', up: true,  accent: '#f59e0b', icon: DollarSign },
  { title: 'Total Patients',        value: 2847,   prefix: '',  suffix: '', change: '+12.5%', up: true,  accent: '#3b82f6', icon: Users },
  { title: 'Active Staff',          value: 186,    prefix: '',  suffix: '', change: '+4',     up: true,  accent: '#10b981', icon: UserCheck },
  { title: 'Bed Occupancy',         value: 68,     prefix: '',  suffix: '%',change: '+5%',    up: false, accent: '#f43f5e', icon: Bed },
  { title: 'Emergency Cases',       value: 7,      prefix: '',  suffix: '', change: '-2',     up: true,  accent: '#ef4444', icon: AlertTriangle },
  { title: 'Medicine Alerts',       value: 5,      prefix: '',  suffix: '', change: 'Low stock', up: false, accent: '#f97316', icon: Pill },
  { title: 'Pending Invoices',      value: 23,     prefix: '',  suffix: '', change: '$48K due', up: null, accent: '#8b5cf6', icon: TrendingUp },
  { title: 'System Uptime',         value: 99,     prefix: '',  suffix: '.9%', change: 'All systems OK', up: true, accent: '#06b6d4', icon: Shield },
]

const AI_INSIGHTS = [
  { icon: Brain,    text: 'Patient load +18% predicted next week — prepare extra staff', color: '#a78bfa', bg: 'rgba(167,139,250,0.08)' },
  { icon: Zap,      text: 'ICU may reach critical capacity in 48 hours',                 color: '#f87171', bg: 'rgba(248,113,113,0.08)' },
  { icon: TrendingUp, text: 'Revenue forecast: ₹5.2L this month (+12% vs last)',         color: '#34d399', bg: 'rgba(52,211,153,0.08)' },
  { icon: Shield,   text: 'Flu outbreak risk 34% — recommend preventive protocols',      color: '#fbbf24', bg: 'rgba(251,191,36,0.08)' },
]

const staffPerformance = [
  { dept: 'Cardiology', efficiency: 94, patients: 145, revenue: 52000 },
  { dept: 'Neurology',  efficiency: 88, patients: 132, revenue: 45000 },
  { dept: 'Oncology',   efficiency: 96, patients: 156, revenue: 68000 },
  { dept: 'Emergency',  efficiency: 91, patients: 98,  revenue: 38000 },
  { dept: 'Orthopedics',efficiency: 85, patients: 87,  revenue: 29000 },
]

const ChartTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: '#0c1428', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '10px 14px', fontSize: 12 }}>
      <p style={{ color: '#64748b', marginBottom: 6 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color, fontWeight: 600 }}>
          {p.name}: {typeof p.value === 'number' && p.value > 1000 ? formatCurrency(p.value) : p.value}
        </p>
      ))}
    </div>
  )
}

const fade = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } }
const container = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }

export default function AdminDashboard({ user }) {
  const [now, setNow] = useState(new Date())
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t) }, [])

  return (
    <motion.div variants={container} initial="hidden" animate="visible" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Header */}
      <motion.div variants={fade} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <div style={{ padding: '4px 12px', borderRadius: 99, background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.25)', fontSize: 11, fontWeight: 700, color: '#fbbf24', letterSpacing: '0.06em' }}>
              ADMIN PANEL
            </div>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#f1f5f9', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Hospital Command Center
          </h1>
          <p style={{ fontSize: 13, color: '#475569', marginTop: 4 }}>
            Full system overview · {now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            <span style={{ color: '#60a5fa', fontFamily: 'monospace', marginLeft: 8 }}>{now.toLocaleTimeString()}</span>
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ padding: '8px 16px', borderRadius: 12, background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className="live-dot" />
            <span style={{ fontSize: 13, fontWeight: 600, color: '#34d399' }}>All Systems Live</span>
          </div>
          <button style={{ padding: '8px 16px', borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
            <BarChart3 style={{ width: 15, height: 15 }} /> Full Report
          </button>
        </div>
      </motion.div>

      {/* KPI Grid */}
      <motion.div variants={fade} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {STATS.map((s, i) => {
          const Icon = s.icon
          return (
            <motion.div key={i} whileHover={{ y: -3, boxShadow: '0 12px 40px rgba(0,0,0,0.35)' }}
              style={{ background: '#0f1a30', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 18, padding: 20, cursor: 'default', transition: 'all 0.2s' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{ width: 38, height: 38, borderRadius: 11, background: `${s.accent}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon style={{ width: 18, height: 18, color: s.accent }} />
                </div>
                {s.up !== null && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, fontWeight: 700, color: s.up ? '#34d399' : '#f87171' }}>
                    {s.up ? <ArrowUpRight style={{ width: 13, height: 13 }} /> : <ArrowDownRight style={{ width: 13, height: 13 }} />}
                    {s.change}
                  </div>
                )}
              </div>
              <p style={{ fontSize: 26, fontWeight: 700, color: '#f1f5f9', lineHeight: 1, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                <AnimatedNumber end={s.value} prefix={s.prefix} suffix={s.suffix} />
              </p>
              <p style={{ fontSize: 12, color: '#475569', marginTop: 6 }}>{s.title}</p>
              {s.up === null && <p style={{ fontSize: 11, color: '#334155', marginTop: 3 }}>{s.change}</p>}
            </motion.div>
          )
        })}
      </motion.div>

      {/* Revenue + Department */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        <motion.div variants={fade} style={{ background: '#0f1a30', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
            <div>
              <p style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Revenue vs Expenses</p>
              <p style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>12-month financial performance</p>
            </div>
            <div style={{ display: 'flex', gap: 14, fontSize: 11 }}>
              {[['#f59e0b', 'Revenue'], ['#34d399', 'Profit'], ['#f87171', 'Expenses']].map(([c, l]) => (
                <span key={l} style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#64748b' }}>
                  <span style={{ width: 20, height: 3, borderRadius: 2, background: c, display: 'inline-block' }} />{l}
                </span>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={210}>
            <AreaChart data={revenueData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
              <defs>
                {[['r', '#f59e0b'], ['p', '#34d399']].map(([id, c]) => (
                  <linearGradient key={id} id={`ag${id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={c} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={c} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: '#334155', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#334155', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<ChartTip />} />
              <Area type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={2} fill="url(#agr)" name="Revenue" />
              <Area type="monotone" dataKey="profit" stroke="#34d399" strokeWidth={2} fill="url(#agp)" name="Profit" />
              <Line type="monotone" dataKey="expenses" stroke="#f87171" strokeWidth={1.5} strokeDasharray="4 4" dot={false} name="Expenses" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div variants={fade} style={{ background: '#0f1a30', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: 24 }}>
          <p style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', fontFamily: 'Plus Jakarta Sans, sans-serif', marginBottom: 4 }}>Patient by Dept.</p>
          <p style={{ fontSize: 12, color: '#475569', marginBottom: 16 }}>Distribution this month</p>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie data={departmentData} cx="50%" cy="50%" innerRadius={40} outerRadius={62} paddingAngle={3} dataKey="value">
                {departmentData.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Pie>
              <Tooltip formatter={v => [`${v}%`, 'Share']} contentStyle={{ background: '#0c1428', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#f1f5f9', fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: 8 }}>
            {departmentData.map((d, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: d.color }} />
                  <span style={{ color: '#64748b' }}>{d.name}</span>
                </div>
                <span style={{ color: '#94a3b8', fontWeight: 600 }}>{d.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Staff Performance + Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        <motion.div variants={fade} style={{ background: '#0f1a30', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: 24 }}>
          <p style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', fontFamily: 'Plus Jakarta Sans, sans-serif', marginBottom: 20 }}>Department Performance</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {staffPerformance.map((d, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#64748b', flexShrink: 0 }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9' }}>{d.dept}</span>
                    <span style={{ fontSize: 12, color: '#34d399', fontWeight: 700 }}>{d.efficiency}%</span>
                  </div>
                  <div style={{ height: 5, borderRadius: 99, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${d.efficiency}%` }} transition={{ duration: 1, delay: i * 0.1 }}
                      style={{ height: '100%', borderRadius: 99, background: 'linear-gradient(90deg, #3b82f6, #34d399)' }} />
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <p style={{ fontSize: 11, color: '#475569' }}>{d.patients} pts</p>
                  <p style={{ fontSize: 11, color: '#60a5fa' }}>{formatCurrency(d.revenue)}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={fade} style={{ background: '#0f1a30', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <p style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Live Activity</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div className="live-dot" />
              <span style={{ fontSize: 11, fontWeight: 600, color: '#34d399' }}>Live</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto', maxHeight: 260 }}>
            {activityFeed.map((a, i) => (
              <div key={a.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '9px 8px', borderRadius: 10 }}>
                <span style={{ fontSize: 15, flexShrink: 0 }}>
                  {a.type === 'admission' ? '👤' : a.type === 'emergency' ? '🚨' : a.type === 'lab' ? '🧪' : a.type === 'billing' ? '💰' : a.type === 'appointment' ? '📅' : a.type === 'medicine' ? '💊' : '✅'}
                </span>
                <div>
                  <p style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.5 }}>{a.message}</p>
                  <p style={{ fontSize: 11, color: '#334155', marginTop: 2 }}>{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* AI Insights */}
      <motion.div variants={fade} style={{ background: '#0f1a30', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
          <div style={{ width: 36, height: 36, borderRadius: 11, background: 'rgba(167,139,250,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Brain style={{ width: 18, height: 18, color: '#a78bfa' }} />
          </div>
          <div>
            <p style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>AI Admin Insights</p>
            <p style={{ fontSize: 12, color: '#475569' }}>Predictive analytics for hospital management</p>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 8, background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.2)' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#a78bfa', animation: 'ping 1.5s infinite' }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: '#a78bfa' }}>AI Active</span>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {AI_INSIGHTS.map((ins, i) => {
            const Icon = ins.icon
            return (
              <div key={i} style={{ padding: 16, borderRadius: 14, background: ins.bg, border: '1px solid rgba(255,255,255,0.05)' }}>
                <Icon style={{ width: 18, height: 18, color: ins.color, marginBottom: 10 }} />
                <p style={{ fontSize: 12.5, color: '#94a3b8', lineHeight: 1.6 }}>{ins.text}</p>
              </div>
            )
          })}
        </div>
      </motion.div>

      {/* Face Recognition Widget */}
      <motion.div variants={fade}>
        <FaceRecognitionWidget role="admin" />
      </motion.div>

      {/* Quick Admin Actions */}
      <motion.div variants={fade} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[
          { label: 'Manage Staff',     emoji: '👥', accent: '#3b82f6', href: '/doctors' },
          { label: 'View Analytics',   emoji: '📊', accent: '#f59e0b', href: '/analytics' },
          { label: 'Billing Reports',  emoji: '💰', accent: '#10b981', href: '/billing' },
          { label: 'System Settings',  emoji: '⚙️', accent: '#8b5cf6', href: '/settings' },
        ].map((a, i) => (
          <motion.a key={i} href={a.href} whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }}
            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 18px', borderRadius: 16, textDecoration: 'none', background: `${a.accent}0d`, border: `1px solid ${a.accent}25`, transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = `${a.accent}18`; e.currentTarget.style.borderColor = `${a.accent}40` }}
            onMouseLeave={e => { e.currentTarget.style.background = `${a.accent}0d`; e.currentTarget.style.borderColor = `${a.accent}25` }}>
            <span style={{ fontSize: 22 }}>{a.emoji}</span>
            <span style={{ fontSize: 13.5, fontWeight: 600, color: '#f1f5f9' }}>{a.label}</span>
          </motion.a>
        ))}
      </motion.div>
    </motion.div>
  )
}
