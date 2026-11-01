import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Calendar, Users, Clock, CheckCircle, AlertTriangle,
  FlaskConical, FileText, Heart, Activity, ArrowUpRight,
  Stethoscope, Brain, MessageSquare, Video
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import AnimatedNumber from '../../hooks/useCountUp.jsx'
import FaceRecognitionWidget from '../../components/FaceRecognitionWidget'

// Doctor's own patient data
const MY_PATIENTS = [
  { id: 'PT-001', name: 'James Wilson',    age: 45, condition: 'Hypertension',     status: 'Stable',    nextVisit: 'Today 9:00 AM',  risk: 72, avatar: 'JW' },
  { id: 'PT-002', name: 'Emily Rodriguez', age: 32, condition: 'Acute MI',          status: 'Critical',  nextVisit: 'Today 10:30 AM', risk: 95, avatar: 'ER' },
  { id: 'PT-003', name: 'Robert Thompson', age: 67, condition: 'Stroke Recovery',   status: 'Stable',    nextVisit: 'Tomorrow 2 PM',  risk: 58, avatar: 'RT' },
  { id: 'PT-004', name: 'Aisha Patel',     age: 28, condition: 'Post-op Recovery',  status: 'Recovering',nextVisit: 'May 13',         risk: 35, avatar: 'AP' },
  { id: 'PT-005', name: 'David Kim',       age: 54, condition: 'Lung Cancer St. II',status: 'Active',    nextVisit: 'May 14 3:30 PM', risk: 88, avatar: 'DK' },
]

const TODAY_SCHEDULE = [
  { time: '09:00 AM', patient: 'James Wilson',    type: 'Follow-up',    duration: '30 min', status: 'upcoming' },
  { time: '10:30 AM', patient: 'Emily Rodriguez', type: 'Emergency',    duration: '45 min', status: 'upcoming' },
  { time: '12:00 PM', patient: 'New Patient',     type: 'Consultation', duration: '30 min', status: 'upcoming' },
  { time: '02:00 PM', patient: 'Robert Thompson', type: 'Follow-up',    duration: '20 min', status: 'upcoming' },
  { time: '03:30 PM', patient: 'David Kim',       type: 'Chemo Review', duration: '60 min', status: 'upcoming' },
]

const PENDING_LABS = [
  { patient: 'Emily Rodriguez', test: 'Cardiac Enzymes',  ordered: '2h ago',  urgent: true  },
  { patient: 'Robert Thompson', test: 'MRI Brain Report', ordered: '1d ago',  urgent: true  },
  { patient: 'David Kim',       test: 'Tumor Markers',    ordered: '2d ago',  urgent: false },
]

const myPatientTrend = [
  { week: 'W1', patients: 18, recovered: 12 },
  { week: 'W2', patients: 22, recovered: 16 },
  { week: 'W3', patients: 19, recovered: 14 },
  { week: 'W4', patients: 25, recovered: 20 },
]

const STATS = [
  { title: 'My Patients',        value: 12,  accent: '#3b82f6', icon: Users,        change: '+2 this week' },
  { title: "Today's Appointments",value: 5,  accent: '#8b5cf6', icon: Calendar,     change: '2 remaining' },
  { title: 'Pending Lab Results', value: 3,  accent: '#f87171', icon: FlaskConical, change: '2 urgent' },
  { title: 'Avg Recovery Score',  value: 78, accent: '#34d399', icon: Heart,        change: '+5 pts', suffix: '%' },
]

const statusStyle = s => ({
  Critical:   { color: '#f87171', bg: 'rgba(248,113,113,0.1)',  border: 'rgba(248,113,113,0.25)' },
  Stable:     { color: '#34d399', bg: 'rgba(52,211,153,0.1)',   border: 'rgba(52,211,153,0.25)' },
  Recovering: { color: '#fbbf24', bg: 'rgba(251,191,36,0.1)',   border: 'rgba(251,191,36,0.25)' },
  Active:     { color: '#60a5fa', bg: 'rgba(96,165,250,0.1)',   border: 'rgba(96,165,250,0.25)' },
}[s] || { color: '#94a3b8', bg: 'rgba(148,163,184,0.1)', border: 'rgba(148,163,184,0.2)' })

const fade = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } }
const container = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }

export default function DoctorDashboard({ user }) {
  const [now, setNow] = useState(new Date())
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t) }, [])

  const nextAppt = TODAY_SCHEDULE[0]

  return (
    <motion.div variants={container} initial="hidden" animate="visible" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Header */}
      <motion.div variants={fade} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <div style={{ padding: '4px 12px', borderRadius: 99, background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.25)', fontSize: 11, fontWeight: 700, color: '#34d399', letterSpacing: '0.06em' }}>
              DOCTOR PORTAL
            </div>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#f1f5f9', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Welcome, {user?.name || 'Dr. Sarah Chen'} 👨‍⚕️
          </h1>
          <p style={{ fontSize: 13, color: '#475569', marginTop: 4 }}>
            Cardiology · {now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            <span style={{ color: '#60a5fa', fontFamily: 'monospace', marginLeft: 8 }}>{now.toLocaleTimeString()}</span>
          </p>
        </div>
        {/* Next appointment alert */}
        <div style={{ padding: '12px 18px', borderRadius: 14, background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.25)', textAlign: 'right' }}>
          <p style={{ fontSize: 11, color: '#a78bfa', fontWeight: 600, marginBottom: 2 }}>NEXT APPOINTMENT</p>
          <p style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9' }}>{nextAppt.patient}</p>
          <p style={{ fontSize: 12, color: '#64748b' }}>{nextAppt.time} · {nextAppt.type}</p>
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
                <AnimatedNumber end={s.value} suffix={s.suffix || ''} />
              </p>
              <p style={{ fontSize: 12, color: '#475569', marginTop: 6 }}>{s.title}</p>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Today's Schedule + Pending Labs */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

        {/* Schedule */}
        <motion.div variants={fade} style={{ background: '#0f1a30', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <p style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Today's Schedule</p>
            <span style={{ fontSize: 12, color: '#60a5fa', fontWeight: 600 }}>{TODAY_SCHEDULE.length} appointments</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {TODAY_SCHEDULE.map((appt, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 12, background: i === 0 ? 'rgba(139,92,246,0.08)' : 'rgba(255,255,255,0.03)', border: `1px solid ${i === 0 ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.05)'}` }}>
                <div style={{ textAlign: 'center', minWidth: 60 }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: i === 0 ? '#a78bfa' : '#60a5fa' }}>{appt.time}</p>
                  <p style={{ fontSize: 10, color: '#334155', marginTop: 1 }}>{appt.duration}</p>
                </div>
                <div style={{ width: 1, height: 32, background: 'rgba(255,255,255,0.06)' }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9' }}>{appt.patient}</p>
                  <p style={{ fontSize: 11, color: '#475569', marginTop: 1 }}>{appt.type}</p>
                </div>
                {i === 0 && (
                  <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 99, background: 'rgba(139,92,246,0.2)', color: '#a78bfa' }}>NEXT</span>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Pending Labs + Quick Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <motion.div variants={fade} style={{ background: '#0f1a30', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: 24, flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <p style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Pending Lab Results</p>
              <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 99, background: 'rgba(248,113,113,0.15)', color: '#f87171' }}>{PENDING_LABS.length} pending</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {PENDING_LABS.map((lab, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderRadius: 12, background: lab.urgent ? 'rgba(248,113,113,0.06)' : 'rgba(255,255,255,0.03)', border: `1px solid ${lab.urgent ? 'rgba(248,113,113,0.2)' : 'rgba(255,255,255,0.05)'}` }}>
                  <FlaskConical style={{ width: 16, height: 16, color: lab.urgent ? '#f87171' : '#60a5fa', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9' }}>{lab.test}</p>
                    <p style={{ fontSize: 11, color: '#475569' }}>{lab.patient} · {lab.ordered}</p>
                  </div>
                  {lab.urgent && <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 99, background: 'rgba(248,113,113,0.2)', color: '#f87171' }}>URGENT</span>}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quick actions */}
          <motion.div variants={fade} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { label: 'Write Prescription', emoji: '📝', accent: '#3b82f6', href: '/patients' },
              { label: 'Video Consult',       emoji: '📹', accent: '#8b5cf6', href: '/appointments' },
              { label: 'View Lab Reports',    emoji: '🧪', accent: '#06b6d4', href: '/laboratory' },
              { label: 'AI Symptom Check',    emoji: '🤖', accent: '#a78bfa', href: '/ai-assistant' },
            ].map((a, i) => (
              <motion.a key={i} href={a.href} whileHover={{ y: -2 }}
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 14px', borderRadius: 14, textDecoration: 'none', background: `${a.accent}0d`, border: `1px solid ${a.accent}22`, transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = `${a.accent}18` }}
                onMouseLeave={e => { e.currentTarget.style.background = `${a.accent}0d` }}>
                <span style={{ fontSize: 18 }}>{a.emoji}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#f1f5f9' }}>{a.label}</span>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </div>

      {/* My Patients */}
      <motion.div variants={fade} style={{ background: '#0f1a30', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <p style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>My Patients</p>
          <a href="/patients" style={{ fontSize: 12, color: '#60a5fa', textDecoration: 'none', fontWeight: 600 }}>View All →</a>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
          {MY_PATIENTS.map((p, i) => {
            const ss = statusStyle(p.status)
            const riskColor = p.risk >= 80 ? '#f87171' : p.risk >= 50 ? '#fbbf24' : '#34d399'
            return (
              <motion.div key={i} whileHover={{ y: -3 }}
                style={{ padding: 16, borderRadius: 16, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', transition: 'all 0.2s', cursor: 'pointer' }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,rgba(59,130,246,0.3),rgba(139,92,246,0.3))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f1f5f9', fontSize: 13, fontWeight: 700, marginBottom: 10 }}>
                  {p.avatar}
                </div>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9', marginBottom: 2 }}>{p.name}</p>
                <p style={{ fontSize: 11, color: '#475569', marginBottom: 8 }}>{p.age}y · {p.condition}</p>
                <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99, background: ss.bg, border: `1px solid ${ss.border}`, color: ss.color, display: 'inline-block', marginBottom: 10 }}>
                  {p.status}
                </span>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#475569', marginBottom: 3 }}>
                    <span>Risk</span><span style={{ color: riskColor, fontWeight: 700 }}>{p.risk}%</span>
                  </div>
                  <div style={{ height: 4, borderRadius: 99, background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${p.risk}%`, borderRadius: 99, background: riskColor, transition: 'width 1s' }} />
                  </div>
                </div>
                <p style={{ fontSize: 10, color: '#334155', marginTop: 8 }}>📅 {p.nextVisit}</p>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Face Recognition Widget */}
      <motion.div variants={fade}>
        <FaceRecognitionWidget role="doctor" />
      </motion.div>

      {/* Patient recovery trend */}
      <motion.div variants={fade} style={{ background: '#0f1a30', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: 24 }}>
        <p style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', fontFamily: 'Plus Jakarta Sans, sans-serif', marginBottom: 4 }}>My Patient Recovery Trend</p>
        <p style={{ fontSize: 12, color: '#475569', marginBottom: 20 }}>Weekly patients treated vs recovered</p>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={myPatientTrend} barGap={6}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="week" tick={{ fill: '#334155', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#334155', fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: '#0c1428', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#f1f5f9', fontSize: 12 }} />
            <Bar dataKey="patients"  fill="#3b82f6" radius={[4, 4, 0, 0]} name="Treated" />
            <Bar dataKey="recovered" fill="#34d399" radius={[4, 4, 0, 0]} name="Recovered" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </motion.div>
  )
}
