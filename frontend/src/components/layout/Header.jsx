import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Search, X, AlertTriangle, Activity } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { useAuthStore } from '../../store/useAuthStore'

const ROLE_COLOR = {
  admin:        '#f59e0b',
  doctor:       '#10b981',
  receptionist: '#3b82f6',
}

export default function Header() {
  const { notifications, clearNotification, emergencyAlerts } = useAppStore()
  const { user } = useAuthStore()
  const [showNotif, setShowNotif] = useState(false)
  const [search, setSearch]       = useState('')
  const [time, setTime]           = useState(new Date())
  const ref = useRef(null)

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setShowNotif(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const roleColor = ROLE_COLOR[user?.role] || '#3b82f6'

  return (
    <header style={{
      height: 64,
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '0 28px',
      flexShrink: 0,
      background: 'rgba(6,11,24,0.92)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      backdropFilter: 'blur(20px)',
      position: 'relative',
      zIndex: 40,
    }}>

      {/* Search */}
      <div style={{ position: 'relative', flex: 1, maxWidth: 360 }}>
        <Search style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: '#334155', pointerEvents: 'none' }} />
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search patients, doctors, records…"
          style={{
            width: '100%', paddingLeft: 40, paddingRight: 16, paddingTop: 9, paddingBottom: 9,
            borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
            color: '#f1f5f9', fontSize: 13, outline: 'none', fontFamily: 'inherit', transition: 'all 0.2s', boxSizing: 'border-box',
          }}
          onFocus={e => { e.target.style.borderColor = '#3b82f6'; e.target.style.background = 'rgba(255,255,255,0.06)' }}
          onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.07)'; e.target.style.background = 'rgba(255,255,255,0.04)' }}
        />
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>

        {/* Emergency badge */}
        {emergencyAlerts.length > 0 && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
            style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '6px 14px', borderRadius: 10, background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.25)' }}>
            <AlertTriangle style={{ width: 13, height: 13, color: '#f87171' }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#f87171' }}>{emergencyAlerts.length} Emergency</span>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#f87171', animation: 'ping 1s infinite' }} />
          </motion.div>
        )}

        {/* Live clock */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '6px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <Activity style={{ width: 13, height: 13, color: '#34d399' }} />
          <span style={{ fontSize: 12, color: '#475569', fontWeight: 500 }}>
            {time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </span>
          <span style={{ fontSize: 12, color: '#60a5fa', fontFamily: 'monospace', fontWeight: 600 }}>
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
        </div>

        {/* Notifications */}
        <div style={{ position: 'relative' }} ref={ref}>
          <button onClick={() => setShowNotif(!showNotif)}
            style={{ width: 38, height: 38, borderRadius: 11, position: 'relative', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b', transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#94a3b8' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#64748b' }}>
            <Bell style={{ width: 16, height: 16 }} />
            {notifications.length > 0 && (
              <span style={{ position: 'absolute', top: 7, right: 7, width: 7, height: 7, borderRadius: '50%', background: '#3b82f6', border: '1.5px solid #060b18' }} />
            )}
          </button>

          <AnimatePresence>
            {showNotif && (
              <motion.div initial={{ opacity: 0, y: 8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.96 }} transition={{ duration: 0.15 }}
                style={{ position: 'absolute', right: 0, top: 46, width: 300, background: '#0c1428', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 18, boxShadow: '0 24px 60px rgba(0,0,0,0.5)', overflow: 'hidden', zIndex: 50 }}>
                <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9' }}>Notifications</p>
                  <button onClick={() => setShowNotif(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569' }}><X style={{ width: 15, height: 15 }} /></button>
                </div>
                <div style={{ maxHeight: 280, overflowY: 'auto' }}>
                  {notifications.length === 0
                    ? <p style={{ textAlign: 'center', fontSize: 13, color: '#334155', padding: '32px 0' }}>No new notifications</p>
                    : notifications.map(n => (
                      <div key={n.id} style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'flex', gap: 10 }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#3b82f6', marginTop: 5, flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: 12, color: '#94a3b8' }}>{n.message}</p>
                          <p style={{ fontSize: 11, color: '#334155', marginTop: 3 }}>{new Date(n.timestamp).toLocaleTimeString()}</p>
                        </div>
                        <button onClick={() => clearNotification(n.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#334155', flexShrink: 0 }}><X style={{ width: 12, height: 12 }} /></button>
                      </div>
                    ))
                  }
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Divider */}
        <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.07)' }} />

        {/* User chip */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 11, background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13, fontWeight: 800, flexShrink: 0, boxShadow: '0 2px 10px rgba(59,130,246,0.3)' }}>
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div style={{ display: 'none' }} className="md:block">
            <p style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9', lineHeight: 1 }}>{user?.name || 'Admin'}</p>
            <p style={{ fontSize: 11, marginTop: 3, color: roleColor, fontWeight: 600, textTransform: 'capitalize' }}>{user?.role || 'Administrator'}</p>
          </div>
        </div>
      </div>

      <style>{`@keyframes ping { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.4)} }`}</style>
    </header>
  )
}
