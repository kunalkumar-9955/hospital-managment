import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Plus, Download, Eye, Edit, Trash2, X, Brain, Heart, AlertCircle, QrCode, Filter } from 'lucide-react'
import { mockPatients } from '../lib/mockData'
import { getStatusColor, formatDate, BLOOD_GROUPS, DEPARTMENTS } from '../lib/utils'
import toast from 'react-hot-toast'

const STATUS_OPTS = ['All','Active','Critical','Stable','Recovering','Discharged']

function statusBadge(status) {
  const map = {
    Active:'badge-blue', Critical:'badge-red', Stable:'badge-green',
    Recovering:'badge-amber', Discharged:'badge-gray',
  }
  return map[status] || 'badge-gray'
}

function RiskBar({ score }) {
  const color = score>=80 ? '#f87171' : score>=50 ? '#fbbf24' : '#34d399'
  return (
    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
      <div className="progress-bar" style={{ flex:1 }}>
        <div className="progress-fill" style={{ width:`${score}%`, background:color }} />
      </div>
      <span style={{ fontSize:11, fontWeight:700, color, minWidth:28 }}>{score}%</span>
    </div>
  )
}

function PatientModal({ patient, onClose }) {
  if (!patient) return null
  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div initial={{ opacity:0, scale:0.95, y:16 }} animate={{ opacity:1, scale:1, y:0 }}
        exit={{ opacity:0, scale:0.95 }} transition={{ duration:0.2 }}
        className="modal" style={{ maxWidth:600 }} onClick={e=>e.stopPropagation()}>
        <div style={{ padding:28 }}>
          {/* Header */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
            <h2 className="font-display" style={{ fontSize:18, fontWeight:700, color:'#f1f5f9' }}>Patient Profile</h2>
            <button onClick={onClose} style={{ width:32, height:32, borderRadius:8, background:'rgba(255,255,255,0.05)',
              border:'1px solid rgba(255,255,255,0.08)', display:'flex', alignItems:'center', justifyContent:'center',
              cursor:'pointer', color:'#64748b' }}>
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Profile row */}
          <div style={{ display:'flex', alignItems:'center', gap:16, padding:20, borderRadius:16,
            background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', marginBottom:20 }}>
            <div style={{ width:60, height:60, borderRadius:16, background:'linear-gradient(135deg,#3b82f6,#8b5cf6)',
              display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:20, fontWeight:700, flexShrink:0 }}>
              {patient.name.split(' ').map(n=>n[0]).join('')}
            </div>
            <div className="flex-1">
              <p style={{ fontSize:18, fontWeight:700, color:'#f1f5f9' }}>{patient.name}</p>
              <p style={{ fontSize:13, color:'#64748b', marginTop:2 }}>{patient.id} · {patient.age}y · {patient.gender}</p>
              <span className={`badge mt-2 inline-flex ${statusBadge(patient.status)}`}>{patient.status}</span>
            </div>
            <QrCode className="w-12 h-12" style={{ color:'#1e3a5f' }} />
          </div>

          {/* Info grid */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:16 }}>
            {[
              ['Blood Group', patient.bloodGroup],
              ['Department', patient.department],
              ['Doctor', patient.doctor],
              ['Admitted', formatDate(patient.admissionDate)],
              ['Phone', patient.phone],
              ['Email', patient.email],
            ].map(([l,v],i) => (
              <div key={i} style={{ padding:'12px 14px', borderRadius:12, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.05)' }}>
                <p style={{ fontSize:11, color:'#475569', marginBottom:4 }}>{l}</p>
                <p style={{ fontSize:13, color:'#f1f5f9', fontWeight:500 }}>{v}</p>
              </div>
            ))}
          </div>

          {/* Diagnosis */}
          <div style={{ padding:'14px 16px', borderRadius:12, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.05)', marginBottom:12 }}>
            <p style={{ fontSize:11, color:'#475569', marginBottom:6 }}>Diagnosis</p>
            <p style={{ fontSize:13, color:'#94a3b8' }}>{patient.diagnosis}</p>
          </div>

          {/* Allergies */}
          {patient.allergies?.length > 0 && (
            <div style={{ padding:'14px 16px', borderRadius:12, background:'rgba(248,113,113,0.06)', border:'1px solid rgba(248,113,113,0.18)', marginBottom:12 }}>
              <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:8 }}>
                <AlertCircle className="w-4 h-4" style={{ color:'#f87171' }} />
                <p style={{ fontSize:12, fontWeight:600, color:'#f87171' }}>Allergies</p>
              </div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                {patient.allergies.map((a,i) => (
                  <span key={i} className="badge badge-red">{a}</span>
                ))}
              </div>
            </div>
          )}

          {/* AI Risk */}
          <div style={{ padding:'14px 16px', borderRadius:12, background:'rgba(167,139,250,0.06)', border:'1px solid rgba(167,139,250,0.18)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:10 }}>
              <Brain className="w-4 h-4" style={{ color:'#a78bfa' }} />
              <p style={{ fontSize:12, fontWeight:600, color:'#a78bfa' }}>AI Risk Assessment</p>
            </div>
            <RiskBar score={patient.riskScore} />
            <p style={{ fontSize:11, color:'#64748b', marginTop:8 }}>
              {patient.riskScore>=80 ? '⚠️ High risk — immediate attention required'
               : patient.riskScore>=50 ? '⚡ Moderate risk — monitor closely'
               : '✅ Low risk — stable condition'}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function AddModal({ onClose, onAdd }) {
  const [f, setF] = useState({ name:'', age:'', gender:'Male', bloodGroup:'O+', phone:'', email:'', department:'General Ward', doctor:'', diagnosis:'', allergies:'', emergencyContact:'' })
  const set = (k,v) => setF(p=>({...p,[k]:v}))

  const submit = (e) => {
    e.preventDefault()
    onAdd({ ...f, id:`PT-${Date.now().toString(36).toUpperCase()}`, status:'Active',
      admissionDate:new Date().toISOString().split('T')[0],
      allergies: f.allergies ? f.allergies.split(',').map(a=>a.trim()) : [],
      riskScore: Math.floor(Math.random()*60)+20 })
    toast.success('Patient added successfully!')
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div initial={{ opacity:0, scale:0.95, y:16 }} animate={{ opacity:1, scale:1, y:0 }}
        exit={{ opacity:0, scale:0.95 }} transition={{ duration:0.2 }}
        className="modal" style={{ maxWidth:580 }} onClick={e=>e.stopPropagation()}>
        <div style={{ padding:28 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
            <h2 className="font-display" style={{ fontSize:18, fontWeight:700, color:'#f1f5f9' }}>Add New Patient</h2>
            <button onClick={onClose} style={{ width:32, height:32, borderRadius:8, background:'rgba(255,255,255,0.05)',
              border:'1px solid rgba(255,255,255,0.08)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'#64748b' }}>
              <X className="w-4 h-4" />
            </button>
          </div>
          <form onSubmit={submit}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>
              {[
                { label:'Full Name *', key:'name', type:'text', placeholder:'Patient full name' },
                { label:'Age *', key:'age', type:'number', placeholder:'Age' },
                { label:'Phone', key:'phone', type:'tel', placeholder:'+1-555-0000' },
                { label:'Email', key:'email', type:'email', placeholder:'patient@email.com' },
                { label:'Doctor', key:'doctor', type:'text', placeholder:'Dr. Name' },
                { label:'Diagnosis', key:'diagnosis', type:'text', placeholder:'Primary diagnosis' },
              ].map(({label,key,type,placeholder}) => (
                <div key={key}>
                  <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#64748b', marginBottom:6 }}>{label}</label>
                  <input type={type} value={f[key]} onChange={e=>set(key,e.target.value)}
                    className="input" placeholder={placeholder} required={label.includes('*')} />
                </div>
              ))}
              <div>
                <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#64748b', marginBottom:6 }}>Gender</label>
                <select value={f.gender} onChange={e=>set('gender',e.target.value)} className="input">
                  <option>Male</option><option>Female</option><option>Other</option>
                </select>
              </div>
              <div>
                <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#64748b', marginBottom:6 }}>Blood Group</label>
                <select value={f.bloodGroup} onChange={e=>set('bloodGroup',e.target.value)} className="input">
                  {BLOOD_GROUPS.map(b=><option key={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#64748b', marginBottom:6 }}>Department</label>
                <select value={f.department} onChange={e=>set('department',e.target.value)} className="input">
                  {DEPARTMENTS.map(d=><option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#64748b', marginBottom:6 }}>Allergies (comma separated)</label>
                <input value={f.allergies} onChange={e=>set('allergies',e.target.value)} className="input" placeholder="Penicillin, Aspirin…" />
              </div>
            </div>
            <div style={{ marginBottom:20 }}>
              <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#64748b', marginBottom:6 }}>Emergency Contact</label>
              <input value={f.emergencyContact} onChange={e=>set('emergencyContact',e.target.value)} className="input" placeholder="Name (Phone)" />
            </div>
            <div style={{ display:'flex', gap:12 }}>
              <button type="button" onClick={onClose} className="btn btn-ghost" style={{ flex:1 }}>Cancel</button>
              <button type="submit" className="btn btn-primary" style={{ flex:1 }}>Add Patient</button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

export default function PatientsPage() {
  const [patients, setPatients] = useState(mockPatients)
  const [search, setSearch]     = useState('')
  const [status, setStatus]     = useState('All')
  const [view, setView]         = useState('table')
  const [selected, setSelected] = useState(null)
  const [showAdd, setShowAdd]   = useState(false)

  const filtered = patients.filter(p => {
    const ms = p.name.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase())
    const mst = status==='All' || p.status===status
    return ms && mst
  })

  const del = (id) => { setPatients(p=>p.filter(x=>x.id!==id)); toast.success('Patient removed') }

  return (
    <div>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
        <div>
          <h1 className="page-title">Patient Management</h1>
          <p className="page-subtitle">{patients.length} total patients · {filtered.length} shown</p>
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <button className="btn btn-ghost"><Download className="w-4 h-4" />Export</button>
          <button className="btn btn-primary" onClick={()=>setShowAdd(true)}><Plus className="w-4 h-4" />Add Patient</button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display:'flex', gap:12, marginBottom:20, flexWrap:'wrap' }}>
        <div style={{ position:'relative', flex:1, minWidth:220 }}>
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color:'#334155' }} />
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search patients…"
            className="input" style={{ paddingLeft:40 }} />
        </div>
        <div style={{ display:'flex', gap:6 }}>
          {STATUS_OPTS.map(s => (
            <button key={s} onClick={()=>setStatus(s)}
              style={{
                padding:'9px 14px', borderRadius:10, fontSize:13, fontWeight:500, cursor:'pointer',
                background: status===s ? 'rgba(59,130,246,0.12)' : 'rgba(255,255,255,0.04)',
                border: status===s ? '1px solid rgba(59,130,246,0.3)' : '1px solid rgba(255,255,255,0.07)',
                color: status===s ? '#60a5fa' : '#64748b',
                transition:'all 0.15s',
              }}>
              {s}
            </button>
          ))}
        </div>
        <div style={{ display:'flex', gap:2, padding:4, borderRadius:10, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)' }}>
          {['table','grid'].map(v => (
            <button key={v} onClick={()=>setView(v)}
              style={{ padding:'5px 12px', borderRadius:8, fontSize:12, fontWeight:500, cursor:'pointer',
                background: view===v ? 'rgba(255,255,255,0.08)' : 'transparent',
                color: view===v ? '#f1f5f9' : '#475569', border:'none', transition:'all 0.15s', textTransform:'capitalize' }}>
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Table view */}
      {view==='table' && (
        <div className="card table-wrap">
          <table>
            <thead>
              <tr>
                {['Patient','ID','Department','Doctor','Status','Risk Score','Actions'].map(h=>(
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filtered.map((p,i) => (
                  <motion.tr key={p.id} initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                    transition={{ delay:i*0.03 }}>
                    <td>
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <div style={{ width:34, height:34, borderRadius:10, background:'linear-gradient(135deg,rgba(59,130,246,0.3),rgba(139,92,246,0.3))',
                          display:'flex', alignItems:'center', justifyContent:'center', color:'#f1f5f9', fontSize:12, fontWeight:700, flexShrink:0 }}>
                          {p.name.split(' ').map(n=>n[0]).join('')}
                        </div>
                        <div>
                          <p style={{ fontSize:13.5, fontWeight:600, color:'#f1f5f9' }}>{p.name}</p>
                          <p style={{ fontSize:11, color:'#475569' }}>{p.age}y · {p.gender}</p>
                        </div>
                      </div>
                    </td>
                    <td><span style={{ fontFamily:'monospace', fontSize:12, color:'#475569' }}>{p.id}</span></td>
                    <td>{p.department}</td>
                    <td>{p.doctor}</td>
                    <td><span className={`badge ${statusBadge(p.status)}`}>{p.status}</span></td>
                    <td style={{ minWidth:140 }}><RiskBar score={p.riskScore} /></td>
                    <td>
                      <div style={{ display:'flex', gap:6 }}>
                        <button onClick={()=>setSelected(p)} style={{ width:30, height:30, borderRadius:8, background:'rgba(59,130,246,0.1)', border:'1px solid rgba(59,130,246,0.2)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'#60a5fa' }}>
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button style={{ width:30, height:30, borderRadius:8, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'#64748b' }}>
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={()=>del(p.id)} style={{ width:30, height:30, borderRadius:8, background:'rgba(248,113,113,0.08)', border:'1px solid rgba(248,113,113,0.18)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'#f87171' }}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {filtered.length===0 && (
            <div style={{ textAlign:'center', padding:'48px 0', color:'#334155' }}>
              <p style={{ fontSize:14 }}>No patients found</p>
            </div>
          )}
        </div>
      )}

      {/* Grid view */}
      {view==='grid' && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
          <AnimatePresence>
            {filtered.map((p,i) => (
              <motion.div key={p.id} initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
                exit={{ opacity:0 }} transition={{ delay:i*0.04 }}
                className="card card-hover" style={{ padding:20 }}>
                <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:14 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <div style={{ width:42, height:42, borderRadius:12, background:'linear-gradient(135deg,rgba(59,130,246,0.3),rgba(139,92,246,0.3))',
                      display:'flex', alignItems:'center', justifyContent:'center', color:'#f1f5f9', fontSize:14, fontWeight:700 }}>
                      {p.name.split(' ').map(n=>n[0]).join('')}
                    </div>
                    <div>
                      <p style={{ fontSize:14, fontWeight:600, color:'#f1f5f9' }}>{p.name}</p>
                      <p style={{ fontSize:11, color:'#475569' }}>{p.id} · {p.age}y</p>
                    </div>
                  </div>
                  <span className={`badge ${statusBadge(p.status)}`}>{p.status}</span>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:6, marginBottom:14 }}>
                  <p style={{ fontSize:12, color:'#64748b' }}>🩺 {p.department} · {p.doctor}</p>
                  <p style={{ fontSize:12, color:'#64748b' }}>🩸 {p.bloodGroup} · {p.diagnosis}</p>
                </div>
                <div style={{ marginBottom:14 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'#475569', marginBottom:5 }}>
                    <span>AI Risk Score</span>
                  </div>
                  <RiskBar score={p.riskScore} />
                </div>
                <div style={{ display:'flex', gap:8 }}>
                  <button onClick={()=>setSelected(p)} className="btn btn-ghost" style={{ flex:1, height:34, fontSize:12 }}>
                    <Eye className="w-3.5 h-3.5" />View
                  </button>
                  <button onClick={()=>del(p.id)} style={{ width:34, height:34, borderRadius:8, background:'rgba(248,113,113,0.08)', border:'1px solid rgba(248,113,113,0.18)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'#f87171' }}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <AnimatePresence>
        {selected  && <PatientModal patient={selected} onClose={()=>setSelected(null)} />}
        {showAdd   && <AddModal onClose={()=>setShowAdd(false)} onAdd={p=>{setPatients(prev=>[p,...prev])}} />}
      </AnimatePresence>
    </div>
  )
}
