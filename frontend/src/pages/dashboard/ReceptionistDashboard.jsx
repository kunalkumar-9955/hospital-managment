import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Calendar, Users, Bed, Phone, Clock, Plus,
  CheckCircle, XCircle, AlertTriangle, Search,
  CreditCard, ArrowRight, UserPlus, ClipboardList
} from 'lucide-react'
import AnimatedNumber from '../../hooks/useCountUp.jsx'
import FaceRecognitionWidget from '../../components/FaceRecognitionWidget'

const TODAYS_APPOINTMENTS = [
  { id: 'APT-001', patient: 'James Wilson',    doctor: 'Dr. Sarah Chen',   time: '09:00 AM', type: 'Follow-up',    status: 'Confirmed', phone: '+1-555-0101' },
  { id: 'APT-002', patient: 'Emily Rodriguez', doctor: 'Dr. Michael Park',  time: '10:30 AM', type: 'Emergency',    status: 'Confirmed', phone: '+1-555-0103' },
  { id: 'APT-003', patient: 'Robert Thompson', doctor: 'Dr. Lisa Kumar',    time: '02:00 PM', type: 'Consultation', status: 'Pending',   phone: '+1-555-0105' },
  { id: 'APT-004', patient: 'Aisha Patel',     doctor: 'Dr. James Lee',     time: '11:00 AM', type: 'Follow-up',    status: 'Confirmed', phone: '+1-555-0107' },
  { id: 'APT-005', patient: 'New Walk-in',     doctor: 'Dr. Tom Brown',     time: '12:30 PM', type: 'Walk-in',      status: 'Waiting',   phone: '—' },
  { id: 'APT-006', patient: 'David Kim',       doctor: 'Dr. Anna White',    time: '03:30 PM', type: 'Chemo',        status: 'Confirmed', phone: '+1-555-0109' },
]

const WAITING_QUEUE = [
  { token: 'T-01', name: 'New Walk-in',     waitTime: '12 min', dept: 'General',    priority: 'Normal' },
  { token: 'T-02', name: 'Priya Sharma',    waitTime: '8 min',  dept: 'Cardiology', priority: 'Normal' },
  { token: 'T-03', name: 'Mark Johnson',    waitTime: '3 min',  dept: 'Emergency',  priority: 'Urgent' },
]

const BED_SUMMARY = [
  { ward: 'General',    total: 30, available: 12, occupied: 18 },
  { ward: 'ICU',        total: 6,  available: 2,  occupied: 4  },
  { ward: 'Cardiology', total: 10, available: 3,  occupied: 7  },
  { ward: 'Oncology',   total: 8,  available: 2,  occupied: 6  },
]

const PENDING_BILLS = [
  { patient: 'Emily Rodriguez', amount: 10200, due: 'Today',    status: 'Overdue' },
  { patient: 'Robert Thompson', amount: 3200,  due: 'May 12',   status: 'Pending' },
  { patient: 'David Kim',       amount: 12000, due: 'May 14',   status: 'Pending' },
]

const STATS = [
  { title: "Today's Appointments", value: 6,   accent: '#8b5cf6', icon: Calendar,     change: '3 remaining' },
  { title: 'Waiting Queue',        value: 3,   accent: '#f59e0b', icon: Clock,        change: 'Avg 8 min wait' },
  { title: 'Beds Available',       value: 19,  accent: '#34d399', icon: Bed,          change: 'Out of 54 total' },
  { title: 'Pending Payments',     value: 3,   accent: '#f87171', icon: CreditCard,   change: '₹25.4K due' },
]

const statusStyle = s => ({
  Confirmed: { color: '#34d399', bg: 'rgba(52,211,153,0.1)',   border: 'rgba(52,211,153,0.25)' },
  Pending:   { color: '#fbbf24', bg: 'rgba(251,191,36,0.1)',   border: 'rgba(251,191,36,0.25)' },
  Waiting:   { color: '#60a5fa', bg: 'rgba(96,165,250,0.1)',   border: 'rgba(96,165,250,0.25)' },
  Cancelled: { color: '#f87171', bg: 'rgba(248,113,113,0.1)',  border: 'rgba(248,113,113,0.25)' },
}[s] || { color: '#94a3b8', bg: 'rgba(148,163,184,0.1)', border: 'rgba(148,163,184,0.2)' })

const fade = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } }
const container = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }

export default function ReceptionistDashboard({ user }) {
  const [now, setNow] = useState(new Date())
  const [search, setSearch] = useState('')
  const [apts, setApts] = useState(TODAYS_APPOINTMENTS)

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const filtered = apts.filter(a =>
    a.patient.toLowerCase().includes(search.toLowerCase()) ||
    a.doctor.toLowerCase().includes(search.toLowerCase())
  )

  const markArrived = (id) => setApts(p => p.map(a => a.id === id ? { ...a, status: 'Arrived' } : a))
  const markCancel  = (id) => setApts(p => p.map(a => a.id === id ? { ...a, status: 'Cancelled' } : a))

  return (
    <motion.div variants={container} initial="hidden" animate="visible" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Header */}
      <motion.div variants={fade} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <div style={{ padding: '4px 12px', borderRadius: 99, background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.25)', fontSize: 11, fontWeight: 700, color: '#60a5fa', letterSpacing: '0.06em' }}>
              RECEPTION DESK
            </div>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#f1f5f9', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Front Desk — {user?.name || 'Jane Smith'} 🏥
          </h1>
          <p style={{ fontSize: 13, color: '#475569', marginTop: 4 }}>
            {now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            <span style={{ color: '#60a5fa', fontFamily: 'monospace', marginLeft: 8 }}>{now.toLocaleTimeString()}</span>
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <a href="/patients" style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 16px', borderRadius: 12, background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.25)', color: '#34d399', textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>
            <UserPlus style={{ width: 15, height: 15 }} /> Register Patient
          </a>
          <a href="/appointments" style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 16px', borderRadius: 12, background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.25)', color: '#a78bfa', textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>
            <Plus style={{ width: 15, height: 15 }} /> Book Appointment
          </a>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={fade} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {STATS.map((s, i) => {
          const Icon = s.icon
          return (
            <motion.div key={i} whileHover={{ y: -3 }}
              style={{ background: '#0f1a30', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 18, padding: 20, transition: 'all 0.2s' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{ width: 38, height: 38, borderRadius: 11, background: `${s.accent}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon style={{ width: 18, height: 18, color: s.accent }} />
                </div>
                <span style={{ fontSize: 11, color: '#475569' }}>{s.change}</span>
              </div>
              <p style={{ fontSize: 28, fontWeight: 700, color: '#f1f5f9', lineHeight: 1, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                <AnimatedNumber end={s.value} />
              </p>
              <p style={{ fontSize: 12, color: '#475569', marginTop: 6 }}>{s.title}</p>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Appointments Table + Waiting Queue */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>

        {/* Appointments */}
        <motion.div variants={fade} style={{ background: '#0f1a30', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, overflow: 'hidden' }}>
          <div style={{ padding: '18px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <p style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Today's Appointments</p>
            <div style={{ position: 'relative' }}>
              <Search style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', width: 13, height: 13, color: '#334155' }} />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search…"
                style={{ paddingLeft: 30, paddingRight: 12, paddingTop: 7, paddingBottom: 7, borderRadius: 9, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#f1f5f9', fontSize: 12, outline: 'none', width: 160 }} />
            </div>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                {['Time', 'Patient', 'Doctor', 'Type', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '10px 16px', fontSize: 11, fontWeight: 600, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((a, i) => {
                const ss = statusStyle(a.status)
                return (
                  <motion.tr key={a.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.025)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '12px 16px' }}>
                      <p style={{ fontSize: 13, fontWeight: 700, color: '#60a5fa' }}>{a.time}</p>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9' }}>{a.patient}</p>
                      <p style={{ fontSize: 11, color: '#475569', marginTop: 1 }}>{a.phone}</p>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: '#94a3b8' }}>{a.doctor}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontSize: 11, padding: '3px 9px', borderRadius: 99, background: 'rgba(255,255,255,0.05)', color: '#64748b', fontWeight: 500 }}>{a.type}</span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 99, background: ss.bg, border: `1px solid ${ss.border}`, color: ss.color }}>{a.status}</span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {a.status !== 'Arrived' && a.status !== 'Cancelled' && (
                          <button onClick={() => markArrived(a.id)}
                            title="Mark Arrived"
                            style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#34d399' }}>
                            <CheckCircle style={{ width: 13, height: 13 }} />
                          </button>
                        )}
                        {a.status !== 'Cancelled' && (
                          <button onClick={() => markCancel(a.id)}
                            title="Cancel"
                            style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#f87171' }}>
                            <XCircle style={{ width: 13, height: 13 }} />
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </motion.div>

        {/* Waiting Queue */}
        <motion.div variants={fade} style={{ background: '#0f1a30', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <p style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Waiting Queue</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div className="live-dot" />
              <span style={{ fontSize: 11, fontWeight: 600, color: '#34d399' }}>Live</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
            {WAITING_QUEUE.map((q, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 14, background: q.priority === 'Urgent' ? 'rgba(248,113,113,0.07)' : 'rgba(255,255,255,0.03)', border: `1px solid ${q.priority === 'Urgent' ? 'rgba(248,113,113,0.2)' : 'rgba(255,255,255,0.05)'}` }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: q.priority === 'Urgent' ? 'rgba(248,113,113,0.15)' : 'rgba(96,165,250,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: q.priority === 'Urgent' ? '#f87171' : '#60a5fa', flexShrink: 0 }}>
                  {q.token}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9' }}>{q.name}</p>
                  <p style={{ fontSize: 11, color: '#475569' }}>{q.dept} · waiting {q.waitTime}</p>
                </div>
                {q.priority === 'Urgent' && (
                  <AlertTriangle style={{ width: 14, height: 14, color: '#f87171', flexShrink: 0 }} />
                )}
              </motion.div>
            ))}
          </div>

          {/* Bed availability mini */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 16 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8', marginBottom: 12 }}>Bed Availability</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {BED_SUMMARY.map((b, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 12, color: '#64748b', minWidth: 80 }}>{b.ward}</span>
                  <div style={{ flex: 1, height: 6, borderRadius: 99, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${(b.occupied / b.total) * 100}%` }} transition={{ duration: 1, delay: i * 0.1 }}
                      style={{ height: '100%', borderRadius: 99, background: b.available <= 2 ? '#f87171' : b.available <= 4 ? '#fbbf24' : '#34d399' }} />
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: b.available <= 2 ? '#f87171' : '#34d399', minWidth: 40, textAlign: 'right' }}>
                    {b.available} free
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Pending Payments + Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

        {/* Pending bills */}
        <motion.div variants={fade} style={{ background: '#0f1a30', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <p style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Pending Payments</p>
            <a href="/billing" style={{ fontSize: 12, color: '#60a5fa', textDecoration: 'none', fontWeight: 600 }}>View All →</a>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {PENDING_BILLS.map((b, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px', borderRadius: 14, background: b.status === 'Overdue' ? 'rgba(248,113,113,0.06)' : 'rgba(255,255,255,0.03)', border: `1px solid ${b.status === 'Overdue' ? 'rgba(248,113,113,0.2)' : 'rgba(255,255,255,0.05)'}` }}>
                <CreditCard style={{ width: 16, height: 16, color: b.status === 'Overdue' ? '#f87171' : '#60a5fa', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9' }}>{b.patient}</p>
                  <p style={{ fontSize: 11, color: '#475569' }}>Due: {b.due}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: b.status === 'Overdue' ? '#f87171' : '#f1f5f9' }}>${b.amount.toLocaleString()}</p>
                  <span style={{ fontSize: 10, fontWeight: 700, color: b.status === 'Overdue' ? '#f87171' : '#fbbf24' }}>{b.status}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick actions */}
        <motion.div variants={fade} style={{ background: '#0f1a30', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: 22 }}>
          <p style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', fontFamily: 'Plus Jakarta Sans, sans-serif', marginBottom: 16 }}>Quick Actions</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { label: 'Register New Patient', emoji: '👤', accent: '#3b82f6', href: '/patients' },
              { label: 'Book Appointment',     emoji: '📅', accent: '#8b5cf6', href: '/appointments' },
              { label: 'Check Bed Status',     emoji: '🛏️', accent: '#06b6d4', href: '/beds' },
              { label: 'Generate Invoice',     emoji: '🧾', accent: '#f59e0b', href: '/billing' },
              { label: 'Emergency Admit',      emoji: '🚨', accent: '#ef4444', href: '/emergency' },
              { label: 'Pharmacy Stock',       emoji: '💊', accent: '#10b981', href: '/pharmacy' },
            ].map((a, i) => (
              <motion.a key={i} href={a.href} whileHover={{ y: -2 }}
                style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '13px 14px', borderRadius: 14, textDecoration: 'none', background: `${a.accent}0d`, border: `1px solid ${a.accent}22`, transition: 'all 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = `${a.accent}18`}
                onMouseLeave={e => e.currentTarget.style.background = `${a.accent}0d`}>
                <span style={{ fontSize: 18 }}>{a.emoji}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#f1f5f9' }}>{a.label}</span>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Face Recognition Widget */}
      <motion.div variants={fade}>
        <FaceRecognitionWidget role="receptionist" />
      </motion.div>
    </motion.div>
  )
}