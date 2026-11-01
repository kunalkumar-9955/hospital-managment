import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, ArrowRight, Shield, Stethoscope, Activity, Lock, Mail, Sparkles, Heart, CheckCircle, X, Camera, ScanFace, Scan } from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'
import toast from 'react-hot-toast'

/* ─────────────────────────────────────────────
   AI Face Recognition Modal
   Steps: camera → scanning → analyzing → success
───────────────────────────────────────────── */
function FaceRecognitionModal({ onClose, onSuccess }) {
  const videoRef  = useRef(null)
  const streamRef = useRef(null)
  // step: 'init' | 'camera' | 'scanning' | 'analyzing' | 'success' | 'error'
  const [step, setStep]       = useState('init')
  const [progress, setProgress] = useState(0)
  const [dots, setDots]       = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [camError, setCamError] = useState(false)

  // Generate random face-mesh dots
  useEffect(() => {
    setDots(Array.from({ length: 28 }, (_, i) => ({
      id: i,
      x: 20 + Math.random() * 60,
      y: 15 + Math.random() * 70,
      delay: Math.random() * 1.5,
    })))
  }, [])

  // Start camera
  const startCamera = useCallback(async () => {
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
      // Auto-start scanning after 1.5s
      setTimeout(() => startScanning(), 1500)
    } catch {
      setCamError(true)
      setStep('error')
    }
  }, [])

  const startScanning = () => {
    setStep('scanning')
    let p = 0
    const t = setInterval(() => {
      p += Math.random() * 8 + 3
      setProgress(Math.min(p, 100))
      if (p >= 100) {
        clearInterval(t)
        setStep('analyzing')
        setTimeout(() => finishAnalysis(), 1800)
      }
    }, 120)
  }

  const finishAnalysis = () => {
    // Randomly pick a demo user to "recognize"
    const users = [
      { name: 'Dr. Admin User', role: 'admin',        email: 'admin@medicore.com',     pass: 'admin123'  },
      { name: 'Dr. Sarah Chen', role: 'doctor',       email: 'doctor@medicore.com',    pass: 'doctor123' },
      { name: 'Jane Smith',     role: 'receptionist', email: 'reception@medicore.com', pass: 'recep123'  },
    ]
    const user = users[Math.floor(Math.random() * users.length)]
    setSelectedUser(user)
    setStep('success')
  }

  const handleLogin = () => {
    stopCamera()
    useAuthStore.setState({
      user: { name: selectedUser.name, role: selectedUser.role },
      token: 'face-' + Date.now(),
      isAuthenticated: true,
      _hasHydrated: true,
    })
    toast.success(`Face recognized! Welcome, ${selectedUser.name}`)
    onSuccess()
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
  }

  const handleClose = () => { stopCamera(); onClose() }

  // Cleanup on unmount
  useEffect(() => () => stopCamera(), [])

  const ROLE_COLOR = { admin: '#f59e0b', doctor: '#10b981', receptionist: '#3b82f6' }
  const rc = selectedUser ? ROLE_COLOR[selectedUser.role] : '#a78bfa'

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
      }}
      onClick={handleClose}
    >
      <motion.div
        initial={{ scale: 0.88, y: 24, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.88, y: 24, opacity: 0 }}
        transition={{ type: 'spring', damping: 22, stiffness: 300 }}
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 420,
          background: 'rgba(10,16,32,0.97)',
          border: '1px solid rgba(167,139,250,0.25)',
          borderRadius: 28,
          padding: 32,
          boxShadow: '0 0 0 1px rgba(167,139,250,0.1), 0 32px 80px rgba(0,0,0,0.7)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(167,139,250,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ScanFace style={{ width: 20, height: 20, color: '#a78bfa' }} />
            </div>
            <div>
              <p style={{ fontSize: 16, fontWeight: 800, color: '#f1f5f9', fontFamily: 'Plus Jakarta Sans,sans-serif' }}>AI Face Recognition</p>
              <p style={{ fontSize: 12, color: '#475569', marginTop: 1 }}>Biometric authentication</p>
            </div>
          </div>
          <button onClick={handleClose}
            style={{ width: 32, height: 32, borderRadius: 9, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}>
            <X style={{ width: 15, height: 15 }} />
          </button>
        </div>

        {/* ── INIT step ── */}
        {step === 'init' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center' }}>
            <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'rgba(167,139,250,0.1)', border: '2px dashed rgba(167,139,250,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <Camera style={{ width: 40, height: 40, color: '#a78bfa' }} />
            </div>
            <p style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', marginBottom: 8 }}>Enable Camera Access</p>
            <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, marginBottom: 28 }}>
              Allow camera access to scan your face. Your biometric data is processed locally and never stored.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
              {['Face data processed on-device only', 'No biometric data stored on servers', 'Encrypted session token generated'].map((t, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <CheckCircle style={{ width: 15, height: 15, color: '#34d399', flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: '#64748b' }}>{t}</span>
                </div>
              ))}
            </div>
            <motion.button onClick={startCamera} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              style={{ width: '100%', height: 48, borderRadius: 14, border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg,#7c3aed,#6d28d9)', color: '#fff', fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 4px 20px rgba(124,58,237,0.4)' }}>
              <Camera style={{ width: 17, height: 17 }} /> Start Face Scan
            </motion.button>
          </motion.div>
        )}

        {/* ── CAMERA / SCANNING step ── */}
        {(step === 'camera' || step === 'scanning') && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Camera viewport */}
            <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3', borderRadius: 18, overflow: 'hidden', background: '#000', marginBottom: 20 }}>
              <video ref={videoRef} autoPlay muted playsInline
                style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} />

              {/* Scanning overlay */}
              <div style={{ position: 'absolute', inset: 0 }}>
                {/* Corner brackets */}
                {[
                  { top: 16, left: 16, borderTop: '3px solid #a78bfa', borderLeft: '3px solid #a78bfa' },
                  { top: 16, right: 16, borderTop: '3px solid #a78bfa', borderRight: '3px solid #a78bfa' },
                  { bottom: 16, left: 16, borderBottom: '3px solid #a78bfa', borderLeft: '3px solid #a78bfa' },
                  { bottom: 16, right: 16, borderBottom: '3px solid #a78bfa', borderRight: '3px solid #a78bfa' },
                ].map((s, i) => (
                  <div key={i} style={{ position: 'absolute', width: 28, height: 28, borderRadius: 3, ...s }} />
                ))}

                {/* Face oval guide */}
                <div style={{
                  position: 'absolute', top: '50%', left: '50%',
                  transform: 'translate(-50%,-50%)',
                  width: '55%', height: '75%',
                  border: `2px solid ${step === 'scanning' ? '#a78bfa' : 'rgba(167,139,250,0.4)'}`,
                  borderRadius: '50%',
                  boxShadow: step === 'scanning' ? '0 0 20px rgba(167,139,250,0.4)' : 'none',
                  transition: 'all 0.3s',
                }} />

                {/* Scan line */}
                {step === 'scanning' && (
                  <motion.div
                    style={{ position: 'absolute', left: '22%', right: '22%', height: 2, background: 'linear-gradient(90deg,transparent,#a78bfa,transparent)', boxShadow: '0 0 8px rgba(167,139,250,0.8)' }}
                    animate={{ top: ['20%', '80%', '20%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  />
                )}

                {/* Face mesh dots */}
                {step === 'scanning' && dots.map(d => (
                  <motion.div key={d.id}
                    style={{ position: 'absolute', left: `${d.x}%`, top: `${d.y}%`, width: 4, height: 4, borderRadius: '50%', background: '#a78bfa', boxShadow: '0 0 4px rgba(167,139,250,0.8)' }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: [0, 1, 0.6], scale: [0, 1, 0.8] }}
                    transition={{ delay: d.delay, duration: 0.4, repeat: Infinity, repeatDelay: 1.5 }}
                  />
                ))}

                {/* Status label */}
                <div style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', borderRadius: 99, padding: '5px 14px', display: 'flex', alignItems: 'center', gap: 7 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: step === 'scanning' ? '#a78bfa' : '#64748b', animation: step === 'scanning' ? 'ping 1s infinite' : 'none' }} />
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#e2e8f0' }}>
                    {step === 'camera' ? 'Position your face in the oval' : 'Scanning face…'}
                  </span>
                </div>
              </div>
            </div>

            {/* Progress bar */}
            {step === 'scanning' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#64748b', marginBottom: 8 }}>
                  <span>Scanning biometrics</span>
                  <span style={{ color: '#a78bfa', fontWeight: 700 }}>{Math.round(progress)}%</span>
                </div>
                <div style={{ height: 6, borderRadius: 99, background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
                  <motion.div
                    style={{ height: '100%', borderRadius: 99, background: 'linear-gradient(90deg,#7c3aed,#a78bfa)' }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
                  {['Detect', 'Map', 'Match', 'Verify'].map((label, i) => {
                    const done = progress > (i + 1) * 25
                    return (
                      <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                        <div style={{ width: 24, height: 24, borderRadius: '50%', background: done ? 'rgba(167,139,250,0.2)' : 'rgba(255,255,255,0.05)', border: `1.5px solid ${done ? '#a78bfa' : 'rgba(255,255,255,0.1)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' }}>
                          {done ? <CheckCircle style={{ width: 12, height: 12, color: '#a78bfa' }} /> : <span style={{ fontSize: 9, color: '#334155', fontWeight: 700 }}>{i + 1}</span>}
                        </div>
                        <span style={{ fontSize: 10, color: done ? '#a78bfa' : '#334155', fontWeight: done ? 600 : 400 }}>{label}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* ── ANALYZING step ── */}
        {step === 'analyzing' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{ position: 'relative', width: 100, height: 100, margin: '0 auto 24px' }}>
              <motion.div
                style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '3px solid transparent', borderTopColor: '#a78bfa', borderRightColor: '#a78bfa' }}
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
              <motion.div
                style={{ position: 'absolute', inset: 8, borderRadius: '50%', border: '2px solid transparent', borderTopColor: '#7c3aed' }}
                animate={{ rotate: -360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              />
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Scan style={{ width: 32, height: 32, color: '#a78bfa' }} />
              </div>
            </div>
            <p style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', marginBottom: 8 }}>Analyzing Biometrics</p>
            <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>Matching facial features against enrolled staff database…</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 20 }}>
              {[0, 1, 2].map(i => (
                <motion.div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: '#a78bfa' }}
                  animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 0.8, delay: i * 0.2, repeat: Infinity }} />
              ))}
            </div>
          </motion.div>
        )}

        {/* ── SUCCESS step ── */}
        {step === 'success' && selectedUser && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center' }}>
            {/* Success ring */}
            <div style={{ position: 'relative', width: 100, height: 100, margin: '0 auto 24px' }}>
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', damping: 15, stiffness: 200 }}
                style={{ width: 100, height: 100, borderRadius: '50%', background: `${rc}18`, border: `3px solid ${rc}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 30px ${rc}40` }}>
                <CheckCircle style={{ width: 44, height: 44, color: rc }} />
              </motion.div>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1.3, opacity: 0 }}
                transition={{ duration: 1, repeat: Infinity }}
                style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: `2px solid ${rc}` }}
              />
            </div>

            <p style={{ fontSize: 16, fontWeight: 800, color: '#f1f5f9', marginBottom: 4 }}>Face Recognized! ✓</p>
            <p style={{ fontSize: 13, color: '#64748b', marginBottom: 24 }}>Identity verified successfully</p>

            {/* User card */}
            <div style={{ padding: '16px 20px', borderRadius: 16, background: `${rc}0d`, border: `1px solid ${rc}30`, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: `${rc}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 800, color: rc, flexShrink: 0 }}>
                {selectedUser.name.charAt(0)}
              </div>
              <div style={{ textAlign: 'left' }}>
                <p style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9' }}>{selectedUser.name}</p>
                <p style={{ fontSize: 12, color: rc, fontWeight: 600, textTransform: 'capitalize', marginTop: 2 }}>{selectedUser.role} · MediCore AI</p>
              </div>
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#34d399' }} />
                <span style={{ fontSize: 11, color: '#34d399', fontWeight: 600 }}>Verified</span>
              </div>
            </div>

            <motion.button onClick={handleLogin} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              style={{ width: '100%', height: 50, borderRadius: 14, border: 'none', cursor: 'pointer', background: `linear-gradient(135deg,${rc},${rc}cc)`, color: '#fff', fontSize: 15, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: `0 4px 20px ${rc}50` }}>
              <ArrowRight style={{ width: 18, height: 18 }} /> Enter Dashboard
            </motion.button>
          </motion.div>
        )}

        {/* ── ERROR step ── */}
        {step === 'error' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '8px 0' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(248,113,113,0.1)', border: '2px solid rgba(248,113,113,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <X style={{ width: 36, height: 36, color: '#f87171' }} />
            </div>
            <p style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', marginBottom: 8 }}>Camera Access Denied</p>
            <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, marginBottom: 24 }}>
              Please allow camera access in your browser settings, then try again.
            </p>
            <button onClick={() => { setCamError(false); setStep('init') }}
              style={{ padding: '10px 24px', borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
              Try Again
            </button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  )
}

const ROLES = [
  {
    label: 'Admin',
    sub: 'Full system access',
    email: 'admin@medicore.com',
    pass: 'admin123',
    Icon: Shield,
    gradient: 'linear-gradient(135deg,#f59e0b,#d97706)',
    glow: 'rgba(245,158,11,0.35)',
    accent: '#f59e0b',
  },
  {
    label: 'Doctor',
    sub: 'Patient & clinical',
    email: 'doctor@medicore.com',
    pass: 'doctor123',
    Icon: Stethoscope,
    gradient: 'linear-gradient(135deg,#10b981,#059669)',
    glow: 'rgba(16,185,129,0.35)',
    accent: '#10b981',
  },
  {
    label: 'Receptionist',
    sub: 'Front desk access',
    email: 'reception@medicore.com',
    pass: 'recep123',
    Icon: Activity,
    gradient: 'linear-gradient(135deg,#3b82f6,#2563eb)',
    glow: 'rgba(59,130,246,0.35)',
    accent: '#3b82f6',
  },
]

const FEATURES = [
  { icon: '🤖', title: 'AI-Powered Diagnostics', desc: 'Predictive analytics & risk scoring' },
  { icon: '⚡', title: 'Real-Time Monitoring',   desc: 'Live alerts & emergency dispatch' },
  { icon: '🔒', title: 'HIPAA Compliant',        desc: 'End-to-end encrypted & SOC 2' },
  { icon: '📊', title: 'Advanced Analytics',     desc: 'Revenue forecasting & insights' },
]

// Animated floating particle
function Particle({ x, y, size, duration, delay }) {
  return (
    <motion.div
      style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, width: size, height: size, borderRadius: '50%', background: 'rgba(59,130,246,0.15)', pointerEvents: 'none' }}
      animate={{ y: [0, -30, 0], opacity: [0.15, 0.5, 0.15] }}
      transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}

export default function LoginPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const [email, setEmail]     = useState('admin@medicore.com')
  const [password, setPass]   = useState('admin123')
  const [showPass, setShowPass] = useState(false)
  const [active, setActive]   = useState(0)
  const [loading, setLoading] = useState(false)
  const [showFaceModal, setShowFaceModal] = useState(false)
  const [particles]           = useState(() =>
    Array.from({ length: 18 }, (_, i) => ({
      id: i, x: Math.random() * 100, y: Math.random() * 100,
      size: Math.random() * 5 + 3,
      duration: Math.random() * 8 + 6,
      delay: Math.random() * 4,
    }))
  )

  useEffect(() => { if (isAuthenticated) navigate('/dashboard') }, [isAuthenticated])

  const pickRole = (i) => {
    setActive(i)
    setEmail(ROLES[i].email)
    setPass(ROLES[i].pass)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 900))
    const map = {
      'admin@medicore.com':     { name: 'Dr. Admin User', role: 'admin' },
      'doctor@medicore.com':    { name: 'Dr. Sarah Chen', role: 'doctor' },
      'reception@medicore.com': { name: 'Jane Smith',     role: 'receptionist' },
    }
    const passMap = {
      'admin@medicore.com': 'admin123',
      'doctor@medicore.com': 'doctor123',
      'reception@medicore.com': 'recep123',
    }
    if (map[email] && passMap[email] === password) {
      useAuthStore.setState({ user: map[email], token: 'demo-' + Date.now(), isAuthenticated: true, _hasHydrated: true })
      toast.success(`Welcome, ${map[email].name}!`)
      navigate('/dashboard')
    } else {
      toast.error('Invalid credentials. Use the demo buttons above.')
    }
    setLoading(false)
  }

  const activeRole = ROLES[active]

  return (
    <div style={{
      minHeight: '100vh',
      background: '#060b18',
      display: 'flex',
      overflow: 'hidden',
      position: 'relative',
    }}>
      {/* ── Ambient background ── */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {/* Grid */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(59,130,246,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(59,130,246,0.04) 1px,transparent 1px)',
          backgroundSize: '52px 52px',
        }} />
        {/* Orbs */}
        <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle,rgba(37,99,235,0.12) 0%,transparent 70%)', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', bottom: '-10%', right: '20%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,rgba(139,92,246,0.1) 0%,transparent 70%)', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', top: '40%', right: '35%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle,rgba(6,182,212,0.07) 0%,transparent 70%)', filter: 'blur(30px)' }} />
        {/* Particles */}
        {particles.map(p => <Particle key={p.id} {...p} />)}
      </div>

      {/* ── LEFT PANEL ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px 64px', position: 'relative', zIndex: 1 }}
        className="hidden lg:flex">
        <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>

          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 56 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: 'linear-gradient(135deg,#2563eb,#0ea5e9)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 0 1px rgba(255,255,255,0.1), 0 8px 32px rgba(37,99,235,0.4)',
            }}>
              <Heart style={{ width: 24, height: 24, color: '#fff' }} />
            </div>
            <div>
              <p style={{ color: '#f1f5f9', fontWeight: 800, fontSize: 20, lineHeight: 1, fontFamily: 'Plus Jakarta Sans,sans-serif' }}>MediCore AI</p>
              <p style={{ fontSize: 12, marginTop: 3, color: '#3b82f6', fontWeight: 500 }}>Hospital Management System</p>
            </div>
          </div>

          {/* Headline */}
          <div style={{ marginBottom: 32 }}>
            <h1 style={{ fontSize: 52, fontWeight: 800, lineHeight: 1.1, fontFamily: 'Plus Jakarta Sans,sans-serif', marginBottom: 16 }}>
              <span style={{ color: '#f1f5f9' }}>The Future of</span>
              <br />
              <span style={{
                background: 'linear-gradient(135deg,#60a5fa 0%,#22d3ee 50%,#a78bfa 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>Healthcare</span>
            </h1>
            <p style={{ fontSize: 16, color: '#64748b', lineHeight: 1.7, maxWidth: 400 }}>
              AI-powered platform trusted by 500+ hospitals worldwide. Manage patients, doctors, billing and emergencies — all in one place.
            </p>
          </div>

          {/* Feature list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 52 }}>
            {FEATURES.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.1 }}
                style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                  {f.icon}
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0' }}>{f.title}</p>
                  <p style={{ fontSize: 12, color: '#475569', marginTop: 1 }}>{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 40 }}>
            {[['50K+', 'Patients Managed'], ['500+', 'Hospitals'], ['99.9%', 'Uptime']].map(([v, l], i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + i * 0.1 }}>
                <p style={{ fontSize: 28, fontWeight: 800, fontFamily: 'Plus Jakarta Sans,sans-serif', background: 'linear-gradient(135deg,#60a5fa,#22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{v}</p>
                <p style={{ fontSize: 12, color: '#334155', marginTop: 3 }}>{l}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div style={{ width: 480, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 40px', position: 'relative', zIndex: 1, flexShrink: 0 }}>
        <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ width: '100%' }}>

          {/* Card */}
          <div style={{
            background: 'rgba(12,20,40,0.9)',
            border: '1px solid rgba(255,255,255,0.09)',
            borderRadius: 28,
            padding: '40px 36px',
            backdropFilter: 'blur(32px)',
            boxShadow: '0 0 0 1px rgba(255,255,255,0.04), 0 32px 80px rgba(0,0,0,0.6)',
          }}>

            {/* Card header */}
            <div style={{ marginBottom: 32 }}>
              {/* Mobile logo */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }} className="flex lg:hidden">
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#2563eb,#0ea5e9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Heart style={{ width: 18, height: 18, color: '#fff' }} />
                </div>
                <p style={{ color: '#f1f5f9', fontWeight: 700, fontSize: 16, fontFamily: 'Plus Jakarta Sans,sans-serif' }}>MediCore AI</p>
              </div>
              <h2 style={{ fontSize: 26, fontWeight: 800, color: '#f1f5f9', fontFamily: 'Plus Jakarta Sans,sans-serif', marginBottom: 6 }}>Welcome back</h2>
              <p style={{ fontSize: 14, color: '#475569' }}>Sign in to access your dashboard</p>
            </div>

            {/* Role selector */}
            <div style={{ marginBottom: 28 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#334155', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>
                Quick Demo Login
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
                {ROLES.map((r, i) => {
                  const isActive = active === i
                  return (
                    <motion.button key={i} type="button" onClick={() => pickRole(i)}
                      whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      style={{
                        padding: '14px 10px', borderRadius: 16, cursor: 'pointer',
                        background: isActive ? `${r.accent}14` : 'rgba(255,255,255,0.03)',
                        border: `1.5px solid ${isActive ? r.accent + '50' : 'rgba(255,255,255,0.07)'}`,
                        transition: 'all 0.2s', outline: 'none',
                        boxShadow: isActive ? `0 0 20px ${r.glow}` : 'none',
                      }}>
                      <div style={{ width: 36, height: 36, borderRadius: 11, background: isActive ? r.gradient : 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', boxShadow: isActive ? `0 4px 14px ${r.glow}` : 'none', transition: 'all 0.2s' }}>
                        <r.Icon style={{ width: 17, height: 17, color: isActive ? '#fff' : '#475569' }} />
                      </div>
                      <p style={{ fontSize: 13, fontWeight: 700, color: isActive ? r.accent : '#64748b', marginBottom: 2, transition: 'color 0.2s' }}>{r.label}</p>
                      <p style={{ fontSize: 10, color: isActive ? r.accent + 'aa' : '#334155', transition: 'color 0.2s' }}>{r.sub}</p>
                    </motion.button>
                  )
                })}
              </div>
            </div>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
              <span style={{ fontSize: 11, color: '#334155', fontWeight: 500 }}>or sign in manually</span>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              {/* Email */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#94a3b8', marginBottom: 8 }}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: '#334155', pointerEvents: 'none' }} />
                  <input
                    type="email" value={email} onChange={e => setEmail(e.target.value)} required
                    placeholder="your@email.com"
                    style={{
                      width: '100%', paddingLeft: 44, paddingRight: 16, paddingTop: 13, paddingBottom: 13,
                      borderRadius: 14, background: 'rgba(255,255,255,0.04)', border: '1.5px solid rgba(255,255,255,0.08)',
                      color: '#f1f5f9', fontSize: 14, outline: 'none', fontFamily: 'inherit', transition: 'all 0.2s', boxSizing: 'border-box',
                    }}
                    onFocus={e => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.12)'; e.target.style.background = 'rgba(255,255,255,0.06)' }}
                    onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; e.target.style.background = 'rgba(255,255,255,0.04)' }}
                  />
                </div>
              </div>

              {/* Password */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8' }}>Password</label>
                  <button type="button" style={{ fontSize: 12, color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}>Forgot password?</button>
                </div>
                <div style={{ position: 'relative' }}>
                  <Lock style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: '#334155', pointerEvents: 'none' }} />
                  <input
                    type={showPass ? 'text' : 'password'} value={password} onChange={e => setPass(e.target.value)} required
                    placeholder="••••••••"
                    style={{
                      width: '100%', paddingLeft: 44, paddingRight: 48, paddingTop: 13, paddingBottom: 13,
                      borderRadius: 14, background: 'rgba(255,255,255,0.04)', border: '1.5px solid rgba(255,255,255,0.08)',
                      color: '#f1f5f9', fontSize: 14, outline: 'none', fontFamily: 'inherit', transition: 'all 0.2s', boxSizing: 'border-box',
                    }}
                    onFocus={e => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.12)'; e.target.style.background = 'rgba(255,255,255,0.06)' }}
                    onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; e.target.style.background = 'rgba(255,255,255,0.04)' }}
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#475569', display: 'flex', alignItems: 'center' }}>
                    {showPass ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
                <input type="checkbox" id="remember" style={{ width: 16, height: 16, accentColor: '#3b82f6', cursor: 'pointer' }} />
                <label htmlFor="remember" style={{ fontSize: 13, color: '#64748b', cursor: 'pointer' }}>Remember me for 7 days</label>
              </div>

              {/* Submit */}
              <motion.button type="submit" disabled={loading}
                whileHover={!loading ? { scale: 1.01 } : {}}
                whileTap={!loading ? { scale: 0.99 } : {}}
                style={{
                  width: '100%', height: 52, borderRadius: 16, border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                  background: loading ? 'rgba(37,99,235,0.5)' : 'linear-gradient(135deg,#2563eb,#1d4ed8)',
                  color: '#fff', fontSize: 15, fontWeight: 700, fontFamily: 'Plus Jakarta Sans,sans-serif',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  boxShadow: loading ? 'none' : '0 4px 24px rgba(37,99,235,0.45)',
                  transition: 'all 0.2s',
                }}>
                {loading
                  ? <div style={{ width: 22, height: 22, border: '2.5px solid rgba(255,255,255,0.25)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.75s linear infinite' }} />
                  : <><span>Sign In</span><ArrowRight style={{ width: 18, height: 18 }} /></>
                }
              </motion.button>
            </form>

            {/* AI biometric */}
            <div style={{ marginTop: 20, padding: '14px 16px', borderRadius: 16, background: 'rgba(167,139,250,0.07)', border: '1px solid rgba(167,139,250,0.18)', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(167,139,250,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Sparkles style={{ width: 17, height: 17, color: '#a78bfa' }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#a78bfa', marginBottom: 2 }}>AI Face Recognition</p>
                <p style={{ fontSize: 11, color: '#475569' }}>Biometric login available for enrolled staff</p>
              </div>
              <motion.button
                onClick={() => setShowFaceModal(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ fontSize: 12, fontWeight: 700, color: '#a78bfa', background: 'rgba(167,139,250,0.15)', border: '1px solid rgba(167,139,250,0.3)', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', flexShrink: 0, boxShadow: '0 0 12px rgba(167,139,250,0.2)' }}>
                Try Demo
              </motion.button>
            </div>

            {/* Create account link */}
            <p style={{ textAlign: 'center', fontSize: 13, color: '#475569', marginTop: 20, marginBottom: 0 }}>
              Don't have an account?{' '}
              <a href="/register" style={{ color: '#60a5fa', fontWeight: 600, textDecoration: 'none' }}>Create one</a>
            </p>

            {/* Trust badges */}
            <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
              {[['🔒', 'E2E Encrypted'], ['✅', 'HIPAA'], ['🛡️', 'SOC 2']].map(([icon, label]) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ fontSize: 13 }}>{icon}</span>
                  <span style={{ fontSize: 11, color: '#334155', fontWeight: 500 }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Face Recognition Modal */}
      <AnimatePresence>
        {showFaceModal && (
          <FaceRecognitionModal
            onClose={() => setShowFaceModal(false)}
            onSuccess={() => { setShowFaceModal(false); navigate('/dashboard') }}
          />
        )}
      </AnimatePresence>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        @keyframes ping { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.5)} }
      `}</style>
    </div>
  )
}
