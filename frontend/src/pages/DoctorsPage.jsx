import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Plus, Star, Phone, Mail, Clock, X, Award } from 'lucide-react'
import { mockDoctors } from '../lib/mockData'
import { SPECIALIZATIONS } from '../lib/utils'
import toast from 'react-hot-toast'

function statusStyle(s) {
  if (s==='Online')  return { color:'#34d399', bg:'rgba(52,211,153,0.1)',  border:'rgba(52,211,153,0.2)' }
  if (s==='Busy')    return { color:'#fbbf24', bg:'rgba(251,191,36,0.1)',  border:'rgba(251,191,36,0.2)' }
  return               { color:'#64748b',  bg:'rgba(100,116,139,0.1)', border:'rgba(100,116,139,0.2)' }
}

function DoctorCard({ doc, onView }) {
  const ss = statusStyle(doc.status)
  return (
    <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
      whileHover={{ y:-3, boxShadow:'0 12px 40px rgba(0,0,0,0.35)' }}
      className="card" style={{ padding:22, cursor:'default', transition:'all 0.2s' }}>
      <div style={{ display:'flex', alignItems:'flex-start', gap:14, marginBottom:16 }}>
        <div style={{ position:'relative', flexShrink:0 }}>
          <div style={{ width:52, height:52, borderRadius:16, background:'linear-gradient(135deg,#2563eb,#0ea5e9)',
            display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:20, fontWeight:700 }}>
            {doc.name.split(' ').slice(-1)[0].charAt(0)}
          </div>
          <div style={{ position:'absolute', bottom:-2, right:-2, width:14, height:14, borderRadius:'50%',
            background:ss.color, border:'2px solid #0f1a30' }} />
        </div>
        <div className="flex-1 min-w-0">
          <p style={{ fontSize:14.5, fontWeight:700, color:'#f1f5f9', marginBottom:2 }}>{doc.name}</p>
          <p style={{ fontSize:12.5, color:'#60a5fa', marginBottom:2 }}>{doc.specialization}</p>
          <p style={{ fontSize:11.5, color:'#475569' }}>{doc.department}</p>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:4 }}>
          <Star className="w-3.5 h-3.5" style={{ color:'#fbbf24', fill:'#fbbf24' }} />
          <span style={{ fontSize:13, fontWeight:700, color:'#fbbf24' }}>{doc.rating}</span>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, marginBottom:14 }}>
        {[['Patients',doc.patients],['Exp.',`${doc.experience}y`],['Fee',`$${doc.consultationFee}`]].map(([l,v])=>(
          <div key={l} style={{ textAlign:'center', padding:'10px 6px', borderRadius:10, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.05)' }}>
            <p style={{ fontSize:15, fontWeight:700, color:'#f1f5f9' }}>{v}</p>
            <p style={{ fontSize:10.5, color:'#475569', marginTop:2 }}>{l}</p>
          </div>
        ))}
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:6, marginBottom:14 }}>
        <div style={{ display:'flex', alignItems:'center', gap:7, fontSize:12, color:'#64748b' }}>
          <Clock className="w-3.5 h-3.5" style={{ color:'#3b82f6', flexShrink:0 }} />
          <span>{doc.availability}</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:7, fontSize:12, color:'#64748b' }}>
          <Mail className="w-3.5 h-3.5" style={{ color:'#8b5cf6', flexShrink:0 }} />
          <span style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{doc.email}</span>
        </div>
      </div>

      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <span style={{ display:'inline-flex', alignItems:'center', gap:5, fontSize:12, fontWeight:600,
          padding:'4px 10px', borderRadius:99, background:ss.bg, border:`1px solid ${ss.border}`, color:ss.color }}>
          <div style={{ width:6, height:6, borderRadius:'50%', background:ss.color }} />
          {doc.status}
        </span>
        <button onClick={()=>onView(doc)} className="btn btn-ghost" style={{ height:32, fontSize:12, padding:'0 14px' }}>
          View Profile
        </button>
      </div>
    </motion.div>
  )
}

export default function DoctorsPage() {
  const [doctors] = useState(mockDoctors)
  const [search, setSearch]   = useState('')
  const [spec, setSpec]       = useState('All')
  const [statusF, setStatusF] = useState('All')
  const [selected, setSelected] = useState(null)

  const filtered = doctors.filter(d => {
    const ms = d.name.toLowerCase().includes(search.toLowerCase()) || d.specialization.toLowerCase().includes(search.toLowerCase())
    const msp = spec==='All' || d.specialization===spec
    const mst = statusF==='All' || d.status===statusF
    return ms && msp && mst
  })

  const stats = [
    { label:'Total Doctors', value:doctors.length, color:'#60a5fa', bg:'rgba(59,130,246,0.06)', border:'1px solid rgba(59,130,246,0.15)' },
    { label:'Online',  value:doctors.filter(d=>d.status==='Online').length,  color:'#34d399', bg:'rgba(52,211,153,0.06)', border:'1px solid rgba(52,211,153,0.15)' },
    { label:'Busy',    value:doctors.filter(d=>d.status==='Busy').length,    color:'#fbbf24', bg:'rgba(251,191,36,0.06)', border:'1px solid rgba(251,191,36,0.15)' },
    { label:'Offline', value:doctors.filter(d=>d.status==='Offline').length, color:'#64748b', bg:'rgba(100,116,139,0.06)', border:'1px solid rgba(100,116,139,0.15)' },
  ]

  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
        <div>
          <h1 className="page-title">Doctor Management</h1>
          <p className="page-subtitle">{doctors.length} registered doctors</p>
        </div>
        <button className="btn btn-primary"><Plus className="w-4 h-4" />Add Doctor</button>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:24 }}>
        {stats.map((s,i) => (
          <div key={i} style={{ padding:'18px 20px', borderRadius:16, background:s.bg, border:s.border }}>
            <p style={{ fontSize:26, fontWeight:700, color:s.color, fontFamily:'Plus Jakarta Sans,sans-serif' }}>{s.value}</p>
            <p style={{ fontSize:12.5, color:'#475569', marginTop:5 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display:'flex', gap:12, marginBottom:24, flexWrap:'wrap' }}>
        <div style={{ position:'relative', flex:1, minWidth:220 }}>
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color:'#334155' }} />
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search doctors…"
            className="input" style={{ paddingLeft:40 }} />
        </div>
        <select value={statusF} onChange={e=>setStatusF(e.target.value)} className="input" style={{ width:'auto', minWidth:140 }}>
          <option value="All">All Status</option>
          <option>Online</option><option>Busy</option><option>Offline</option>
        </select>
        <select value={spec} onChange={e=>setSpec(e.target.value)} className="input" style={{ width:'auto', minWidth:180 }}>
          <option value="All">All Specializations</option>
          {SPECIALIZATIONS.map(s=><option key={s}>{s}</option>)}
        </select>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
        {filtered.map(doc => <DoctorCard key={doc.id} doc={doc} onView={setSelected} />)}
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {selected && (
          <div className="modal-overlay" onClick={()=>setSelected(null)}>
            <motion.div initial={{ opacity:0, scale:0.95, y:16 }} animate={{ opacity:1, scale:1, y:0 }}
              exit={{ opacity:0, scale:0.95 }} transition={{ duration:0.2 }}
              className="modal" style={{ maxWidth:480 }} onClick={e=>e.stopPropagation()}>
              <div style={{ padding:28 }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
                  <h2 className="font-display" style={{ fontSize:18, fontWeight:700, color:'#f1f5f9' }}>Doctor Profile</h2>
                  <button onClick={()=>setSelected(null)} style={{ width:32, height:32, borderRadius:8, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'#64748b' }}>
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:16, padding:20, borderRadius:16, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', marginBottom:20 }}>
                  <div style={{ width:60, height:60, borderRadius:16, background:'linear-gradient(135deg,#2563eb,#0ea5e9)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:22, fontWeight:700 }}>
                    {selected.name.split(' ').slice(-1)[0].charAt(0)}
                  </div>
                  <div>
                    <p style={{ fontSize:18, fontWeight:700, color:'#f1f5f9' }}>{selected.name}</p>
                    <p style={{ fontSize:13, color:'#60a5fa' }}>{selected.specialization}</p>
                    <div style={{ display:'flex', alignItems:'center', gap:5, marginTop:4 }}>
                      <Star className="w-3.5 h-3.5" style={{ color:'#fbbf24', fill:'#fbbf24' }} />
                      <span style={{ fontSize:13, fontWeight:700, color:'#fbbf24' }}>{selected.rating}</span>
                      <span style={{ fontSize:12, color:'#475569' }}>· {selected.experience} years exp.</span>
                    </div>
                  </div>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:20 }}>
                  {[['Department',selected.department],['Fee',`$${selected.consultationFee}`],['Patients',selected.patients],['Availability',selected.availability],['Phone',selected.phone],['Email',selected.email]].map(([l,v])=>(
                    <div key={l} style={{ padding:'12px 14px', borderRadius:12, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.05)' }}>
                      <p style={{ fontSize:11, color:'#475569', marginBottom:4 }}>{l}</p>
                      <p style={{ fontSize:13, color:'#f1f5f9', fontWeight:500, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{v}</p>
                    </div>
                  ))}
                </div>
                <div style={{ display:'flex', gap:10 }}>
                  <button className="btn btn-ghost" style={{ flex:1 }}><Phone className="w-4 h-4" />Contact</button>
                  <button className="btn btn-primary" style={{ flex:1 }}><Award className="w-4 h-4" />Schedule</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
