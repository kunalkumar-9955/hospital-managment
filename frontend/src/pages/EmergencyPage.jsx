import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Phone, MapPin, Clock, Heart, Activity, Zap, X, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const CASES = [
  { id:'EM-001', patient:'Unknown Male', age:'~45', condition:'Cardiac Arrest', location:'5th Ave & Main St', severity:'Critical', time:'2 min ago', ambulance:'AMB-03', status:'En Route', vitals:{ bp:'80/50', pulse:'120', spo2:'88%' } },
  { id:'EM-002', patient:'Sarah Johnson', age:'28', condition:'Severe Trauma', location:'Highway 101, Mile 45', severity:'Critical', time:'8 min ago', ambulance:'AMB-01', status:'On Scene', vitals:{ bp:'90/60', pulse:'140', spo2:'92%' } },
  { id:'EM-003', patient:'Robert Chen', age:'67', condition:'Stroke Symptoms', location:'123 Oak Street', severity:'High', time:'15 min ago', ambulance:'AMB-05', status:'Transporting', vitals:{ bp:'180/110', pulse:'88', spo2:'95%' } },
]

const AMBULANCES = [
  { id:'AMB-01', driver:'Mike Torres', status:'On Scene',    location:'Highway 101', battery:85, fuel:72 },
  { id:'AMB-02', driver:'Lisa Park',   status:'Available',   location:'Station 2',   battery:100,fuel:95 },
  { id:'AMB-03', driver:'James Wilson',status:'En Route',    location:'5th Ave',     battery:62, fuel:58 },
  { id:'AMB-04', driver:'Anna Smith',  status:'Available',   location:'Station 1',   battery:100,fuel:88 },
  { id:'AMB-05', driver:'Carlos Ruiz', status:'Transporting',location:'Highway 45',  battery:78, fuel:65 },
]

const ICU = [
  { id:'ICU-01', status:'Occupied',    patient:'Emily Rodriguez', since:'2 days' },
  { id:'ICU-02', status:'Occupied',    patient:'Critical Patient', since:'1 day' },
  { id:'ICU-03', status:'Available',   patient:null, since:null },
  { id:'ICU-04', status:'Occupied',    patient:'John Doe', since:'4 hours' },
  { id:'ICU-05', status:'Available',   patient:null, since:null },
  { id:'ICU-06', status:'Maintenance', patient:null, since:null },
]

function SOSButton({ onActivate }) {
  const [hold, setHold] = useState(false)
  const [cd, setCd] = useState(null)

  const press = () => {
    setHold(true); setCd(3)
    const t = setInterval(() => {
      setCd(p => {
        if (p<=1) { clearInterval(t); onActivate(); setHold(false); setCd(null); return null }
        return p-1
      })
    }, 1000)
  }

  return (
    <motion.button onClick={press} whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }}
      style={{
        width:128, height:128, borderRadius:'50%', cursor:'pointer', border:'none',
        background:'linear-gradient(135deg,#dc2626,#991b1b)',
        display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
        boxShadow:'0 0 40px rgba(220,38,38,0.5), 0 0 80px rgba(220,38,38,0.2)',
        position:'relative',
      }}>
      <div style={{ position:'absolute', inset:0, borderRadius:'50%', background:'rgba(220,38,38,0.3)', animation:'ping 1.5s ease-out infinite' }} />
      <AlertTriangle className="w-10 h-10 text-white mb-1" />
      <span style={{ color:'#fff', fontWeight:700, fontSize:14 }}>{cd ? `${cd}…` : 'SOS'}</span>
    </motion.button>
  )
}

export default function EmergencyPage() {
  const [cases, setCases] = useState(CASES)
  const [alert, setAlert] = useState(false)

  const handleSOS = () => {
    setAlert(true)
    toast.error('🚨 EMERGENCY SOS ACTIVATED — Dispatching AMB-02!', { duration:5000 })
    setTimeout(()=>setAlert(false), 10000)
  }

  const resolve = (id) => { setCases(p=>p.filter(c=>c.id!==id)); toast.success('Emergency resolved') }

  const sevColor = s => s==='Critical' ? { color:'#f87171', bg:'rgba(248,113,113,0.1)', border:'rgba(248,113,113,0.25)' }
    : { color:'#fbbf24', bg:'rgba(251,191,36,0.1)', border:'rgba(251,191,36,0.25)' }

  const ambColor = s => s==='Available' ? '#34d399' : s==='En Route' ? '#60a5fa' : s==='On Scene' ? '#fbbf24' : '#f97316'

  const icuColor = s => s==='Available' ? { bg:'rgba(52,211,153,0.08)', border:'rgba(52,211,153,0.2)', color:'#34d399' }
    : s==='Occupied' ? { bg:'rgba(248,113,113,0.08)', border:'rgba(248,113,113,0.2)', color:'#f87171' }
    : { bg:'rgba(251,191,36,0.08)', border:'rgba(251,191,36,0.2)', color:'#fbbf24' }

  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
        <div>
          <h1 className="page-title">Emergency Center</h1>
          <p className="page-subtitle">Real-time emergency monitoring & dispatch</p>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 16px', borderRadius:12, background:'rgba(248,113,113,0.08)', border:'1px solid rgba(248,113,113,0.2)' }}>
          <div className="live-dot" style={{ background:'#f87171' }} />
          <span style={{ fontSize:13, fontWeight:600, color:'#f87171' }}>{cases.length} Active Emergencies</span>
        </div>
      </div>

      {/* Alert banner */}
      <AnimatePresence>
        {alert && (
          <motion.div initial={{ opacity:0, y:-12 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-12 }}
            style={{ padding:'14px 18px', borderRadius:14, background:'rgba(248,113,113,0.1)', border:'1px solid rgba(248,113,113,0.3)', display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
            <div style={{ width:8, height:8, borderRadius:'50%', background:'#f87171', animation:'ping 1s infinite', flexShrink:0 }} />
            <AlertTriangle className="w-4 h-4" style={{ color:'#f87171', flexShrink:0 }} />
            <p style={{ fontSize:13, fontWeight:500, color:'#fca5a5', flex:1 }}>🚨 EMERGENCY SOS ACTIVE — AMB-02 dispatched. ETA: 4 minutes</p>
            <button onClick={()=>setAlert(false)} style={{ background:'none', border:'none', cursor:'pointer', color:'#f87171' }}><X className="w-4 h-4" /></button>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display:'grid', gridTemplateColumns:'280px 1fr', gap:20, marginBottom:20 }}>
        {/* SOS panel */}
        <div className="card" style={{ padding:24, display:'flex', flexDirection:'column', alignItems:'center', gap:20 }}>
          <div style={{ textAlign:'center' }}>
            <p className="font-display" style={{ fontSize:15, fontWeight:700, color:'#f1f5f9', marginBottom:4 }}>Emergency SOS</p>
            <p style={{ fontSize:12, color:'#475569' }}>Hold to activate dispatch</p>
          </div>
          <SOSButton onActivate={handleSOS} />
          <div style={{ width:'100%', display:'flex', flexDirection:'column', gap:8 }}>
            <button className="btn btn-ghost" style={{ width:'100%', justifyContent:'center' }}>
              <Phone className="w-4 h-4" />Call Emergency Line
            </button>
            <button className="btn btn-ghost" style={{ width:'100%', justifyContent:'center' }}>
              <MapPin className="w-4 h-4" />Track Ambulances
            </button>
          </div>
        </div>

        {/* Active cases */}
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <p className="font-display" style={{ fontSize:15, fontWeight:700, color:'#f1f5f9' }}>Active Emergency Cases</p>
          {cases.map((c,i) => {
            const sc = sevColor(c.severity)
            return (
              <motion.div key={c.id} initial={{ opacity:0, x:16 }} animate={{ opacity:1, x:0 }} transition={{ delay:i*0.08 }}
                className="card" style={{ padding:18 }}>
                <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:12 }}>
                  <div>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
                      <span style={{ fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:99, background:sc.bg, border:`1px solid ${sc.border}`, color:sc.color }}>{c.severity}</span>
                      <span style={{ fontSize:11, color:'#334155', fontFamily:'monospace' }}>{c.id}</span>
                    </div>
                    <p style={{ fontSize:15, fontWeight:700, color:'#f1f5f9' }}>{c.patient} · Age {c.age}</p>
                    <p style={{ fontSize:13, fontWeight:600, color:'#f87171', marginTop:2 }}>{c.condition}</p>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <p style={{ fontSize:11, color:'#475569' }}>{c.time}</p>
                    <p style={{ fontSize:11, color:'#60a5fa', marginTop:3 }}>{c.ambulance} · {c.status}</p>
                  </div>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:'#64748b', marginBottom:12 }}>
                  <MapPin className="w-3.5 h-3.5" style={{ color:'#f87171', flexShrink:0 }} />
                  {c.location}
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, marginBottom:14 }}>
                  {[['BP',c.vitals.bp,Activity],['Pulse',c.vitals.pulse,Heart],['SpO2',c.vitals.spo2,Zap]].map(([l,v,Icon])=>(
                    <div key={l} style={{ padding:'10px 8px', borderRadius:10, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.05)', textAlign:'center' }}>
                      <Icon className="w-3.5 h-3.5 mx-auto mb-1.5" style={{ color:'#f87171' }} />
                      <p style={{ fontSize:13, fontWeight:700, color:'#f1f5f9' }}>{v}</p>
                      <p style={{ fontSize:10.5, color:'#475569', marginTop:2 }}>{l}</p>
                    </div>
                  ))}
                </div>
                <div style={{ display:'flex', gap:8 }}>
                  <button className="btn btn-ghost" style={{ flex:1, height:34, fontSize:12 }}>Track Live</button>
                  <button onClick={()=>resolve(c.id)} className="btn" style={{ flex:1, height:34, fontSize:12, background:'rgba(52,211,153,0.1)', border:'1px solid rgba(52,211,153,0.2)', color:'#34d399', borderRadius:10, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:6, fontWeight:600 }}>
                    <CheckCircle className="w-3.5 h-3.5" />Resolve
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Ambulance fleet */}
      <div className="card" style={{ padding:24, marginBottom:20 }}>
        <p className="font-display" style={{ fontSize:15, fontWeight:700, color:'#f1f5f9', marginBottom:16 }}>Ambulance Fleet</p>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:12 }}>
          {AMBULANCES.map((a,i) => (
            <motion.div key={a.id} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.05 }}
              style={{ padding:14, borderRadius:14, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
                <span style={{ fontSize:13, fontWeight:700, color:'#f1f5f9' }}>{a.id}</span>
                <span style={{ fontSize:11, fontWeight:600, color:ambColor(a.status) }}>{a.status}</span>
              </div>
              <p style={{ fontSize:11.5, color:'#64748b', marginBottom:4 }}>{a.driver}</p>
              <p style={{ fontSize:11, color:'#475569', display:'flex', alignItems:'center', gap:4, marginBottom:10 }}>
                <MapPin className="w-3 h-3" />{a.location}
              </p>
              {[['Battery',a.battery],['Fuel',a.fuel]].map(([l,v])=>(
                <div key={l} style={{ marginBottom:6 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:10.5, color:'#475569', marginBottom:3 }}>
                    <span>{l}</span><span>{v}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width:`${v}%`, background: v>50?'#34d399':v>20?'#fbbf24':'#f87171' }} />
                  </div>
                </div>
              ))}
            </motion.div>
          ))}
        </div>
      </div>

      {/* ICU beds */}
      <div className="card" style={{ padding:24 }}>
        <p className="font-display" style={{ fontSize:15, fontWeight:700, color:'#f1f5f9', marginBottom:16 }}>ICU Bed Status</p>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:10 }}>
          {ICU.map((bed,i) => {
            const bc = icuColor(bed.status)
            return (
              <motion.div key={bed.id} initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} transition={{ delay:i*0.05 }}
                style={{ padding:14, borderRadius:14, background:bc.bg, border:`1px solid ${bc.border}`, textAlign:'center' }}>
                <p style={{ fontSize:13, fontWeight:700, color:'#f1f5f9', marginBottom:4 }}>{bed.id}</p>
                <p style={{ fontSize:11.5, fontWeight:600, color:bc.color }}>{bed.status}</p>
                {bed.patient && <p style={{ fontSize:10.5, color:'#475569', marginTop:4, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{bed.patient}</p>}
                {bed.since && <p style={{ fontSize:10, color:'#334155', marginTop:2 }}>{bed.since}</p>}
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
