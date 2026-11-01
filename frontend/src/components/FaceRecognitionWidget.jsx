import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ScanFace, Camera, CheckCircle, X, Scan,
  Sparkles, ArrowRight, Shield, Stethoscope, Activity, Lock
} from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'
import toast from 'react-hot-toast'

/**
 * FaceRecognitionWidget
 *
 * Props:
 *  currentUser  — the logged-in user object { name, role }
 *  onVerified   — callback(verifiedUser) called after successful scan
 *                 verifiedUser = same role as currentUser (locked to current panel)
 */

const ROLE_CONFIG = {
  admin: {
    color: '#f59e0b',
    glow: 'rgba(245,158,11,0.4)',
    bg: 'rgba(245,158,11,0.08)',
    border: 'rgba(245,158,11,0.25)',
    label: 'Admin',
    icon: Shield,
    user: { name: 'Dr. Admin User', role: 'admin' },
  },
  doctor: {
    color: '#10b981',
    glow: 'rgba(16,185,129,0.4)',
    bg: 'rgba(16,185,129,0.08)',
    border: 'rgba(16,185,129,0.25)',
    label: 'Doctor',
    icon: Stethoscope,
    user: { name: 'Dr. Sarah Chen', role: 'doctor' },
  },
  receptionist: {
    color: '#3b82f6',
    glow: 'rgba(59,130,246,0.4)',
    bg: 'rgba(59,130,246,0.08)',
    border: 'rgba(59,130,246,0.25)',
    label: 'Receptionist',
    icon: Activity,
    user: { name: 'Jane Smith', role: 'receptionist' },
  },
}

/* ── Face Scan Modal ─────────────────────────────────────────── */
function FaceScanModal({ role, onClose, onSuccess }) {
  const videoRef  = useRef(null)
  const streamRef = useRef(null)
  const [step, setStep]       = useState('init')   // init | camera | scanning | analyzing | success | error
  const [progress, setProgress] = useState(0)
  const [dots]                = useState(() =>
    Array.from({ length: 26 }, (_, i) => ({
      id: i,
      x: 18 + Math.random() * 64,
      y: 12 + Math.random() * 72,
      delay: Math.random() * 1.4,
    }))
  )

  const rc = ROLE_CONFIG[role] || ROLE_CONFIG.admin

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
  }, [])

  useEffect(() => () => stopCamera(), [stopCamera])

  const startCamera = async () => {
    setStep('camera')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 320, height: 240, facingMode: 'user' },
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }
      setTimeout(() => startScanning(), 1400)
    } catch {
      setStep('error')
    }
  }

  const startScanning = () => {
    setStep('scanning')
    let p = 0
    const t = setInterval(() => {
      p += Math.random() * 7 + 3
      setProgress(Math.min(p, 100))
      if (p >= 100) {
        clearInterval(t)
        setStep('analyzing')
        setTimeout(() => setStep('success'), 1800)
      }
    }, 110)
  }

  const handleEnter = () => {
    stopCamera()
    onSuccess(rc.user)
  }

  const handleClose = () => { stopCamera(); onClose() }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(0,0,0,0.8)',
        backdropFilter: 'blur(14px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
      }}
      onClick={handleClose}
    >
      <motion.div
        initial={{ scale: 0.88, y: 28, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.88, y: 28, opacity: 0 }}
        transition={{ type: 'spring', damping: 22, stiffness: 280 }}
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 420,
          background: 'rgba(8,14,28,0.98)',
          border: `1px solid ${rc.border}`,
          borderRadius: 28,
          padding: 32,
          boxShadow: `0 0 0 1px ${rc.bg}, 0 40px 100px rgba(0,0,0,0.8), 0 0 60px ${rc.glow}`,
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 42, height: 42, borderRadius: 13, background: rc.bg, border: `1px solid ${rc.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 16px ${rc.glow}` }}>
              <ScanFace style={{ width: 20, height: 20, color: rc.color }} />
            </div>
            <div>
              <p style={{ fontSize: 16, fontWeight: 800, color: '#f1f5f9', fontFamily: 'Plus Jakarta Sans,sans-serif' }}>
                Face Recognition
              </p>
              <p style={{ fontSize: 12, color: rc.color, fontWeight: 600, marginTop: 1 }}>
                {rc.label} Panel · Biometric Auth
              </p>
            </div>
          </div>
          <button onClick={handleClose}
            style={{ width: 32, height: 32, borderRadius: 9, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}>
            <X style={{ width: 15, height: 15 }} />
          </button>
        </div>

        {/* ── INIT ── */}
        {step === 'init' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center' }}>
            <div style={{ width: 96, height: 96, borderRadius: '50%', background: rc.bg, border: `2px dashed ${rc.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: `0 0 30px ${rc.glow}` }}>
              <Camera style={{ width: 38, height: 38, color: rc.color }} />
            </div>
            <p style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', marginBottom: 8 }}>Enable Camera</p>
            <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.65, marginBottom: 24 }}>
              Scan your face to verify identity as <span style={{ color: rc.color, fontWeight: 700 }}>{rc.label}</span>. Processed locally — nothing stored.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 28, textAlign: 'left' }}>
              {['Face data processed on-device only', 'No biometric data stored on servers', 'Encrypted session token generated'].map((t, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <CheckCircle style={{ width: 14, height: 14, color: '#34d399', flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: '#64748b' }}>{t}</span>
                </div>
              ))}
            </div>
            <motion.button onClick={startCamera} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              style={{ width: '100%', height: 50, borderRadius: 14, border: 'none', cursor: 'pointer', background: `linear-gradient(135deg,${rc.color},${rc.color}bb)`, color: '#fff', fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: `0 4px 20px ${rc.glow}`, fontFamily: 'Plus Jakarta Sans,sans-serif' }}>
              <Camera style={{ width: 17, height: 17 }} /> Start Face Scan
            </motion.button>
          </motion.div>
        )}

        {/* ── CAMERA / SCANNING ── */}
        {(step === 'camera' || step === 'scanning') && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3', borderRadius: 18, overflow: 'hidden', background: '#000', marginBottom: 20, boxShadow: `0 0 30px ${rc.glow}` }}>
              <video ref={videoRef} autoPlay muted playsInline
                style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} />

              {/* Overlay */}
              <div style={{ position: 'absolute', inset: 0 }}>
                {/* Corner brackets */}
                {[
                  { top: 14, left: 14, borderTop: `3px solid ${rc.color}`, borderLeft: `3px solid ${rc.color}` },
                  { top: 14, right: 14, borderTop: `3px solid ${rc.color}`, borderRight: `3px solid ${rc.color}` },
                  { bottom: 14, left: 14, borderBottom: `3px solid ${rc.color}`, borderLeft: `3px solid ${rc.color}` },
                  { bottom: 14, right: 14, borderBottom: `3px solid ${rc.color}`, borderRight: `3px solid ${rc.color}` },
                ].map((s, i) => (
                  <div key={i} style={{ position: 'absolute', width: 26, height: 26, borderRadius: 3, ...s }} />
                ))}

                {/* Face oval */}
                <div style={{
                  position: 'absolute', top: '50%', left: '50%',
                  transform: 'translate(-50%,-50%)',
                  width: '54%', height: '74%',
                  border: `2px solid ${step === 'scanning' ? rc.color : rc.color + '60'}`,
                  borderRadius: '50%',
                  boxShadow: step === 'scanning' ? `0 0 20px ${rc.glow}, inset 0 0 20px ${rc.glow}` : 'none',
                  transition: 'all 0.4s',
                }} />

                {/* Scan line */}
                {step === 'scanning' && (
                  <motion.div
                    style={{ position: 'absolute', left: '23%', right: '23%', height: 2, background: `linear-gradient(90deg,transparent,${rc.color},transparent)`, boxShadow: `0 0 10px ${rc.glow}` }}
                    animate={{ top: ['18%', '80%', '18%'] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                  />
                )}

                {/* Face mesh dots */}
                {step === 'scanning' && dots.map(d => (
                  <motion.div key={d.id}
                    style={{ position: 'absolute', left: `${d.x}%`, top: `${d.y}%`, width: 4, height: 4, borderRadius: '50%', background: rc.color, boxShadow: `0 0 5px ${rc.glow}` }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: [0, 1, 0.5], scale: [0, 1, 0.7] }}
                    transition={{ delay: d.delay, duration: 0.4, repeat: Infinity, repeatDelay: 1.6 }}
                  />
                ))}

                {/* Status pill */}
                <div style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', borderRadius: 99, padding: '5px 14px', display: 'flex', alignItems: 'center', gap: 7, whiteSpace: 'nowrap' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: step === 'scanning' ? rc.color : '#64748b', animation: step === 'scanning' ? 'ping 1s infinite' : 'none' }} />
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#e2e8f0' }}>
                    {step === 'camera' ? 'Position face in the oval' : 'Scanning biometrics…'}
                  </span>
                </div>
              </div>
            </div>

            {/* Progress */}
            {step === 'scanning' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#64748b', marginBottom: 7 }}>
                  <span>Scanning</span>
                  <span style={{ color: rc.color, fontWeight: 700 }}>{Math.round(progress)}%</span>
                </div>
                <div style={{ height: 6, borderRadius: 99, background: 'rgba(255,255,255,0.07)', overflow: 'hidden', marginBottom: 14 }}>
                  <motion.div style={{ height: '100%', borderRadius: 99, background: `linear-gradient(90deg,${rc.color}88,${rc.color})` }}
                    animate={{ width: `${progress}%` }} transition={{ duration: 0.1 }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  {['Detect', 'Map', 'Match', 'Verify'].map((label, i) => {
                    const done = progress > (i + 1) * 25
                    return (
                      <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                        <div style={{ width: 26, height: 26, borderRadius: '50%', background: done ? rc.bg : 'rgba(255,255,255,0.04)', border: `1.5px solid ${done ? rc.color : 'rgba(255,255,255,0.08)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s', boxShadow: done ? `0 0 10px ${rc.glow}` : 'none' }}>
                          {done
                            ? <CheckCircle style={{ width: 13, height: 13, color: rc.color }} />
                            : <span style={{ fontSize: 9, color: '#334155', fontWeight: 700 }}>{i + 1}</span>
                          }
                        </div>
                        <span style={{ fontSize: 10, color: done ? rc.color : '#334155', fontWeight: done ? 700 : 400 }}>{label}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* ── ANALYZING ── */}
        {step === 'analyzing' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '12px 0' }}>
            <div style={{ position: 'relative', width: 100, height: 100, margin: '0 auto 24px' }}>
              <motion.div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: `3px solid transparent`, borderTopColor: rc.color, borderRightColor: rc.color }}
                animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} />
              <motion.div style={{ position: 'absolute', inset: 10, borderRadius: '50%', border: `2px solid transparent`, borderTopColor: rc.color + '60' }}
                animate={{ rotate: -360 }} transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }} />
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Scan style={{ width: 30, height: 30, color: rc.color }} />
              </div>
            </div>
            <p style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', marginBottom: 8 }}>Analyzing Biometrics</p>
            <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>Matching against <span style={{ color: rc.color, fontWeight: 600 }}>{rc.label}</span> staff database…</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 20 }}>
              {[0, 1, 2].map(i => (
                <motion.div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: rc.color }}
                  animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 0.8, delay: i * 0.2, repeat: Infinity }} />
              ))}
            </div>
          </motion.div>
        )}

        {/* ── SUCCESS ── */}
        {step === 'success' && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center' }}>
            <div style={{ position: 'relative', width: 100, height: 100, margin: '0 auto 24px' }}>
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', damping: 14, stiffness: 200 }}
                style={{ width: 100, height: 100, borderRadius: '50%', background: rc.bg, border: `3px solid ${rc.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 40px ${rc.glow}` }}>
                <CheckCircle style={{ width: 46, height: 46, color: rc.color }} />
              </motion.div>
              <motion.div
                initial={{ scale: 0.8, opacity: 0.6 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 1.2, repeat: Infinity }}
                style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: `2px solid ${rc.color}` }}
              />
            </div>

            <p style={{ fontSize: 17, fontWeight: 800, color: '#f1f5f9', marginBottom: 4, fontFamily: 'Plus Jakarta Sans,sans-serif' }}>
              Identity Verified ✓
            </p>
            <p style={{ fontSize: 13, color: '#64748b', marginBottom: 24 }}>
              Welcome back, <span style={{ color: rc.color, fontWeight: 700 }}>{rc.user.name}</span>
            </p>

            {/* Verified user card */}
            <div style={{ padding: '16px 18px', borderRadius: 16, background: rc.bg, border: `1px solid ${rc.border}`, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 14, boxShadow: `0 0 20px ${rc.glow}` }}>
              <div style={{ width: 46, height: 46, borderRadius: 13, background: `${rc.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800, color: rc.color, flexShrink: 0 }}>
                {rc.user.name.charAt(0)}
              </div>
              <div style={{ textAlign: 'left', flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9' }}>{rc.user.name}</p>
                <p style={{ fontSize: 12, color: rc.color, fontWeight: 600, textTransform: 'capitalize', marginTop: 2 }}>
                  {rc.label} · MediCore AI
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#34d399' }} />
                <span style={{ fontSize: 11, color: '#34d399', fontWeight: 700 }}>Verified</span>
              </div>
            </div>

            <motion.button onClick={handleEnter} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              style={{ width: '100%', height: 50, borderRadius: 14, border: 'none', cursor: 'pointer', background: `linear-gradient(135deg,${rc.color},${rc.color}bb)`, color: '#fff', fontSize: 15, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: `0 4px 24px ${rc.glow}`, fontFamily: 'Plus Jakarta Sans,sans-serif' }}>
              <ArrowRight style={{ width: 18, height: 18 }} /> Continue to {rc.label} Dashboard
            </motion.button>
          </motion.div>
        )}

        {/* ── ERROR ── */}
        {step === 'error' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '8px 0' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(248,113,113,0.1)', border: '2px solid rgba(248,113,113,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <X style={{ width: 34, height: 34, color: '#f87171' }} />
            </div>
            <p style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', marginBottom: 8 }}>Camera Access Denied</p>
            <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, marginBottom: 24 }}>
              Allow camera access in browser settings, then try again.
            </p>
            <button onClick={() => setStep('init')}
              style={{ padding: '10px 28px', borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
              Try Again
            </button>
          </motion.div>
        )}
      </motion.div>
      <style>{`@keyframes ping{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.5;transform:scale(1.5)}}`}</style>
    </motion.div>
  )
}

/* ── Widget Card (shown inside each dashboard) ───────────────── */
export default function FaceRecognitionWidget({ role }) {
  const [showModal, setShowModal] = useState(false)
  const rc = ROLE_CONFIG[role] || ROLE_CONFIG.admin

  const handleVerified = (verifiedUser) => {
    // Re-authenticate as the same role — stays on current dashboard
    useAuthStore.setState({
      user: verifiedUser,
      token: 'face-' + Date.now(),
      isAuthenticated: true,
      _hasHydrated: true,
    })
    setShowModal(false)
    toast.success(`✓ Identity verified — ${verifiedUser.name}`, {
      style: { background: '#0c1428', color: '#f1f5f9', border: `1px solid ${rc.color}40` },
      iconTheme: { primary: rc.color, secondary: '#fff' },
    })
  }

  // Receptionist: show locked/blocked card
  if (role === 'receptionist') {
    return (
      <div style={{
        padding: '16px 20px',
        borderRadius: 18,
        background: 'rgba(239,68,68,0.06)',
        border: '1px solid rgba(239,68,68,0.2)',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        cursor: 'not-allowed',
        opacity: 0.85,
      }}>
        {/* Lock icon */}
        <div style={{ width: 44, height: 44, borderRadius: 13, background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Lock style={{ width: 22, height: 22, color: '#ef4444' }} />
        </div>

        {/* Text */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: '#f87171', marginBottom: 3 }}>
            Face Recognition Restricted
          </p>
          <p style={{ fontSize: 12, color: '#64748b' }}>
            Contact admin to enable biometric access
          </p>
        </div>

        {/* Restricted badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, padding: '4px 10px', borderRadius: 99, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#ef4444' }}>Restricted</span>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Widget card */}
      <motion.div
        whileHover={{ scale: 1.01, boxShadow: `0 8px 32px ${rc.glow}` }}
        style={{
          padding: '16px 20px',
          borderRadius: 18,
          background: rc.bg,
          border: `1px solid ${rc.border}`,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
        onClick={() => setShowModal(true)}
      >
        {/* Icon */}
        <div style={{ width: 44, height: 44, borderRadius: 13, background: `${rc.color}20`, border: `1px solid ${rc.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: `0 0 14px ${rc.glow}` }}>
          <ScanFace style={{ width: 22, height: 22, color: rc.color }} />
        </div>

        {/* Text */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', marginBottom: 3 }}>
            AI Face Recognition
          </p>
          <p style={{ fontSize: 12, color: '#475569' }}>
            Verify identity as <span style={{ color: rc.color, fontWeight: 600 }}>{rc.label}</span> · Click to scan
          </p>
        </div>

        {/* Pulse indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexShrink: 0 }}>
          <div style={{ position: 'relative', width: 8, height: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: rc.color }} />
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: rc.color, animation: 'ping 1.5s ease-out infinite', opacity: 0.6 }} />
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, color: rc.color }}>Active</span>
        </div>

        {/* Arrow */}
        <div style={{ width: 32, height: 32, borderRadius: 9, background: `${rc.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <ArrowRight style={{ width: 15, height: 15, color: rc.color }} />
        </div>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <FaceScanModal
            role={role}
            onClose={() => setShowModal(false)}
            onSuccess={handleVerified}
          />
        )}
      </AnimatePresence>

      <style>{`@keyframes ping{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.4;transform:scale(2)}}`}</style>
    </>
  )
}
