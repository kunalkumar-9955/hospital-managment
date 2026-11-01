import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Heart, User, Mail, Phone, Lock, Eye, EyeOff,
  Building2, ArrowRight, CheckCircle,
  Shield, Stethoscope, Activity, UserCheck, FlaskConical, Pill
} from 'lucide-react'
import toast from 'react-hot-toast'

const ROLES = [
  { value: 'admin',          label: 'Admin',          icon: Shield,      color: '#f59e0b', desc: 'Full system access' },
  { value: 'doctor',         label: 'Doctor',         icon: Stethoscope, color: '#10b981', desc: 'Clinical & patients' },
  { value: 'nurse',          label: 'Nurse',          icon: Activity,    color: '#3b82f6', desc: 'Patient care' },
  { value: 'receptionist',   label: 'Receptionist',   icon: UserCheck,   color: '#8b5cf6', desc: 'Front desk' },
  { value: 'pharmacist',     label: 'Pharmacist',     icon: Pill,        color: '#f97316', desc: 'Pharmacy' },
  { value: 'lab_technician', label: 'Lab Tech',       icon: FlaskConical,color: '#06b6d4', desc: 'Laboratory' },
]

const DEPARTMENTS = [
  'Administration', 'Cardiology', 'Neurology', 'Orthopedics', 'Oncology',
  'Emergency', 'ICU', 'General Ward', 'Pharmacy', 'Laboratory',
  'Radiology', 'Pediatrics', 'Surgery', 'Gynecology', 'Psychiatry',
]

const BENEFITS = [
  { icon: '🏥', text: 'Access to unified hospital management platform' },
  { icon: '🤖', text: 'AI-powered tools tailored to your role' },
  { icon: '🔒', text: 'HIPAA-compliant secure access' },
  { icon: '📊', text: 'Real-time data and analytics dashboard' },
]

function InputField({ label, type = 'text', value, onChange, placeholder, icon: Icon, required, rightEl }) {
  const [focused, setFocused] = useState(false)
  return (
    <div>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#94a3b8', marginBottom: 7 }}>{label}</label>
      <div style={{ position: 'relative' }}>
        {Icon && <Icon style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: focused ? '#3b82f6' : '#334155', pointerEvents: 'none', transition: 'color 0.2s' }} />}
        <input
          type={type} value={value} onChange={onChange} placeholder={placeholder} required={required}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{
            width: '100%', paddingLeft: Icon ? 42 : 16, paddingRight: rightEl ? 44 : 16,
            paddingTop: 12, paddingBottom: 12, borderRadius: 13,
            background: focused ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.04)',
            border: `1.5px solid ${focused ? '#3b82f6' : 'rgba(255,255,255,0.08)'}`,
            boxShadow: focused ? '0 0 0 3px rgba(59,130,246,0.1)' : 'none',
            color: '#f1f5f9', fontSize: 14, outline: 'none', fontFamily: 'inherit',
            transition: 'all 0.2s', boxSizing: 'border-box',
          }}
        />
        {rightEl && <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)' }}>{rightEl}</div>}
      </div>
    </div>
  )
}

export default function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '', email: '', phone: '', department: '', role: 'doctor',
    password: '', confirmPassword: '',
  })
  const [showPass, setShowPass]       = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading]         = useState(false)
  const [step, setStep]               = useState(1) // 1 = personal info, 2 = role & password

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleNext = (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.phone) {
      toast.error('Please fill all required fields')
      return
    }
    setStep(2)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    toast.success('Account created! Waiting for admin approval.', { duration: 4000 })
    setTimeout(() => navigate('/login'), 1500)
    setLoading(false)
  }

  const selectedRole = ROLES.find(r => r.value === form.role) || ROLES[1]

  return (
    <div style={{ minHeight: '100vh', background: '#060b18', display: 'flex', overflow: 'hidden', position: 'relative' }}>
      {/* Background */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(59,130,246,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(59,130,246,0.04) 1px,transparent 1px)', backgroundSize: '52px 52px' }} />
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle,rgba(139,92,246,0.1) 0%,transparent 70%)', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', bottom: '-10%', left: '10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,rgba(37,99,235,0.1) 0%,transparent 70%)', filter: 'blur(40px)' }} />
      </div>

      {/* LEFT PANEL */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px 64px', position: 'relative', zIndex: 1 }} className="hidden lg:flex">
        <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 56 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg,#2563eb,#0ea5e9)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 0 1px rgba(255,255,255,0.1), 0 8px 32px rgba(37,99,235,0.4)' }}>
              <Heart style={{ width: 24, height: 24, color: '#fff' }} />
            </div>
            <div>
              <p style={{ color: '#f1f5f9', fontWeight: 800, fontSize: 20, lineHeight: 1, fontFamily: 'Plus Jakarta Sans,sans-serif' }}>MediCore AI</p>
              <p style={{ fontSize: 12, marginTop: 3, color: '#3b82f6', fontWeight: 500 }}>Hospital Management System</p>
            </div>
          </div>

          <h1 style={{ fontSize: 48, fontWeight: 800, lineHeight: 1.1, fontFamily: 'Plus Jakarta Sans,sans-serif', marginBottom: 16 }}>
            <span style={{ color: '#f1f5f9' }}>Join</span>
            <br />
            <span style={{ background: 'linear-gradient(135deg,#60a5fa 0%,#22d3ee 50%,#a78bfa 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>MediCore AI</span>
          </h1>
          <p style={{ fontSize: 16, color: '#64748b', lineHeight: 1.7, maxWidth: 380, marginBottom: 40 }}>
            Create your staff account to access the hospital management platform. Admin approval required for activation.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 48 }}>
            {BENEFITS.map((b, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.1 }}
                style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                  {b.icon}
                </div>
                <p style={{ fontSize: 14, color: '#94a3b8' }}>{b.text}</p>
              </motion.div>
            ))}
          </div>

          {/* Step indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {[1, 2].map(s => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: step >= s ? 'linear-gradient(135deg,#2563eb,#0ea5e9)' : 'rgba(255,255,255,0.06)', border: `1.5px solid ${step >= s ? '#3b82f6' : 'rgba(255,255,255,0.1)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' }}>
                  {step > s ? <CheckCircle style={{ width: 16, height: 16, color: '#fff' }} /> : <span style={{ fontSize: 13, fontWeight: 700, color: step >= s ? '#fff' : '#334155' }}>{s}</span>}
                </div>
                <span style={{ fontSize: 13, color: step >= s ? '#94a3b8' : '#334155', fontWeight: step >= s ? 500 : 400 }}>
                  {s === 1 ? 'Personal Info' : 'Role & Security'}
                </span>
                {s < 2 && <div style={{ width: 32, height: 1.5, background: step > s ? '#3b82f6' : 'rgba(255,255,255,0.08)', transition: 'background 0.3s' }} />}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* RIGHT PANEL */}
      <div style={{ width: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 40px', position: 'relative', zIndex: 1, flexShrink: 0 }}>
        <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} style={{ width: '100%' }}>
          <div style={{ background: 'rgba(12,20,40,0.9)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 28, padding: '36px 32px', backdropFilter: 'blur(32px)', boxShadow: '0 0 0 1px rgba(255,255,255,0.04), 0 32px 80px rgba(0,0,0,0.6)' }}>

            {/* Header */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }} className="flex lg:hidden">
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#2563eb,#0ea5e9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Heart style={{ width: 18, height: 18, color: '#fff' }} />
                </div>
                <p style={{ color: '#f1f5f9', fontWeight: 700, fontSize: 16, fontFamily: 'Plus Jakarta Sans,sans-serif' }}>MediCore AI</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h2 style={{ fontSize: 24, fontWeight: 800, color: '#f1f5f9', fontFamily: 'Plus Jakarta Sans,sans-serif', marginBottom: 4 }}>
                    {step === 1 ? 'Create Account' : 'Role & Password'}
                  </h2>
                  <p style={{ fontSize: 13, color: '#475569' }}>
                    {step === 1 ? 'Step 1 of 2 — Personal information' : 'Step 2 of 2 — Select role & set password'}
                  </p>
                </div>
                {/* Mobile step dots */}
                <div style={{ display: 'flex', gap: 6 }}>
                  {[1, 2].map(s => (
                    <div key={s} style={{ width: s === step ? 20 : 8, height: 8, borderRadius: 99, background: s <= step ? '#3b82f6' : 'rgba(255,255,255,0.1)', transition: 'all 0.3s' }} />
                  ))}
                </div>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {/* STEP 1 */}
              {step === 1 && (
                <motion.form key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} onSubmit={handleNext}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
                    <InputField label="Full Name *" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Dr. John Smith" icon={User} required />
                    <InputField label="Email Address *" type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="john@hospital.com" icon={Mail} required />
                    <InputField label="Phone Number *" type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+1-555-0000" icon={Phone} required />
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#94a3b8', marginBottom: 7 }}>Department</label>
                      <div style={{ position: 'relative' }}>
                        <Building2 style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: '#334155', pointerEvents: 'none' }} />
                        <select value={form.department} onChange={e => set('department', e.target.value)}
                          style={{ width: '100%', paddingLeft: 42, paddingRight: 16, paddingTop: 12, paddingBottom: 12, borderRadius: 13, background: 'rgba(255,255,255,0.04)', border: '1.5px solid rgba(255,255,255,0.08)', color: form.department ? '#f1f5f9' : '#475569', fontSize: 14, outline: 'none', fontFamily: 'inherit', cursor: 'pointer', boxSizing: 'border-box', appearance: 'none' }}>
                          <option value="">Select department</option>
                          {DEPARTMENTS.map(d => <option key={d} value={d} style={{ background: '#0c1428' }}>{d}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                  <motion.button type="submit" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                    style={{ width: '100%', height: 50, borderRadius: 14, border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg,#2563eb,#1d4ed8)', color: '#fff', fontSize: 15, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 4px 20px rgba(37,99,235,0.4)', fontFamily: 'Plus Jakarta Sans,sans-serif' }}>
                    Continue <ArrowRight style={{ width: 17, height: 17 }} />
                  </motion.button>
                </motion.form>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <motion.form key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} onSubmit={handleSubmit}>
                  {/* Role selector */}
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#94a3b8', marginBottom: 10 }}>Select Your Role *</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                      {ROLES.map(r => {
                        const isActive = form.role === r.value
                        const Icon = r.icon
                        return (
                          <motion.button key={r.value} type="button" onClick={() => set('role', r.value)}
                            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                            style={{ padding: '12px 8px', borderRadius: 14, cursor: 'pointer', background: isActive ? `${r.color}14` : 'rgba(255,255,255,0.03)', border: `1.5px solid ${isActive ? r.color + '50' : 'rgba(255,255,255,0.07)'}`, transition: 'all 0.2s', outline: 'none', boxShadow: isActive ? `0 0 16px ${r.color}30` : 'none' }}>
                            <div style={{ width: 32, height: 32, borderRadius: 10, background: isActive ? `${r.color}22` : 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px', transition: 'all 0.2s' }}>
                              <Icon style={{ width: 15, height: 15, color: isActive ? r.color : '#475569' }} />
                            </div>
                            <p style={{ fontSize: 12, fontWeight: 700, color: isActive ? r.color : '#64748b', marginBottom: 1, transition: 'color 0.2s' }}>{r.label}</p>
                            <p style={{ fontSize: 10, color: isActive ? r.color + '99' : '#334155', transition: 'color 0.2s' }}>{r.desc}</p>
                          </motion.button>
                        )
                      })}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
                    <InputField label="Password *" type={showPass ? 'text' : 'password'} value={form.password} onChange={e => set('password', e.target.value)} placeholder="Min. 6 characters" icon={Lock} required
                      rightEl={<button type="button" onClick={() => setShowPass(!showPass)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569', display: 'flex' }}>{showPass ? <EyeOff style={{ width: 15, height: 15 }} /> : <Eye style={{ width: 15, height: 15 }} />}</button>} />
                    <InputField label="Confirm Password *" type={showConfirm ? 'text' : 'password'} value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)} placeholder="Re-enter password" icon={Lock} required
                      rightEl={<button type="button" onClick={() => setShowConfirm(!showConfirm)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569', display: 'flex' }}>{showConfirm ? <EyeOff style={{ width: 15, height: 15 }} /> : <Eye style={{ width: 15, height: 15 }} />}</button>} />
                  </div>

                  {/* Admin approval notice */}
                  <div style={{ padding: '12px 14px', borderRadius: 12, background: 'rgba(251,191,36,0.07)', border: '1px solid rgba(251,191,36,0.2)', marginBottom: 20, display: 'flex', gap: 10 }}>
                    <span style={{ fontSize: 16, flexShrink: 0 }}>⚠️</span>
                    <p style={{ fontSize: 12, color: '#92400e', lineHeight: 1.5 }}>
                      <span style={{ color: '#fbbf24', fontWeight: 700 }}>Admin Approval Required.</span> Your account will be reviewed before activation. You will receive an email once approved.
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: 10 }}>
                    <button type="button" onClick={() => setStep(1)}
                      style={{ flex: 1, height: 50, borderRadius: 14, border: '1.5px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: '#94a3b8', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                      ← Back
                    </button>
                    <motion.button type="submit" disabled={loading} whileHover={!loading ? { scale: 1.01 } : {}} whileTap={!loading ? { scale: 0.99 } : {}}
                      style={{ flex: 2, height: 50, borderRadius: 14, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', background: loading ? 'rgba(37,99,235,0.5)' : `linear-gradient(135deg,${selectedRole.color},${selectedRole.color}bb)`, color: '#fff', fontSize: 15, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: loading ? 'none' : `0 4px 20px ${selectedRole.color}40`, fontFamily: 'Plus Jakarta Sans,sans-serif', transition: 'all 0.2s' }}>
                      {loading
                        ? <div style={{ width: 20, height: 20, border: '2.5px solid rgba(255,255,255,0.25)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.75s linear infinite' }} />
                        : <><span>Create Account</span><ArrowRight style={{ width: 17, height: 17 }} /></>
                      }
                    </motion.button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Sign in link */}
            <p style={{ textAlign: 'center', fontSize: 13, color: '#475569', marginTop: 24 }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#60a5fa', fontWeight: 600, textDecoration: 'none' }}>Sign In</Link>
            </p>
          </div>
        </motion.div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
