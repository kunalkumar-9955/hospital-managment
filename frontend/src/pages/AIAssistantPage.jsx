import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, Send, Mic, MicOff, Sparkles, Brain, Heart, Pill, AlertTriangle, RefreshCw } from 'lucide-react'

const QUICK = [
  { icon:Heart,        text:'Chest pain symptoms',       color:'#f87171', bg:'rgba(248,113,113,0.08)' },
  { icon:Pill,         text:'Medicine interaction check', color:'#60a5fa', bg:'rgba(96,165,250,0.08)' },
  { icon:AlertTriangle,text:'Emergency first aid guide',  color:'#fbbf24', bg:'rgba(251,191,36,0.08)' },
  { icon:Brain,        text:'AI health risk assessment',  color:'#a78bfa', bg:'rgba(167,139,250,0.08)' },
]

const RESPONSES = {
  symptoms: `**Symptom Analysis:**\n\nBased on the symptoms described, here are possible conditions:\n\n1. **Hypertension** (78% probability)\n   - Symptoms: headache, dizziness, chest discomfort\n   - Recommended: Blood pressure monitoring, ECG\n\n2. **Anxiety Disorder** (45% probability)\n   - Symptoms: palpitations, shortness of breath\n   - Recommended: Psychological evaluation\n\n⚠️ This is an AI assessment only. Please consult a qualified physician.`,
  medicine: `**Medicine Interaction Analysis:**\n\n✅ Metformin + Lisinopril: Safe combination\n⚠️ Aspirin + Warfarin: Increased bleeding risk — monitor INR closely\n❌ Amoxicillin + Methotrexate: Contraindicated — can increase toxicity\n\n**Recommendation:** Review the Aspirin + Warfarin combination with the attending physician.`,
  emergency: `**Emergency First Aid Protocol:**\n\n🚨 **Cardiac Arrest:**\n1. Call emergency services immediately (911)\n2. Begin CPR: 30 compressions, 2 breaths\n3. Use AED if available\n4. Continue until help arrives\n\n🩸 **Severe Bleeding:**\n1. Apply direct pressure with clean cloth\n2. Elevate the injured area\n3. Do not remove embedded objects\n\n⚡ **Stroke (FAST):**\n- Face drooping · Arm weakness · Speech slurring · Time: call 911`,
  default: [
    "Based on the patient data, I recommend consulting with a cardiologist. The combination of symptoms warrants immediate evaluation. Would you like me to check available appointment slots?",
    "I've analyzed the medication regimen. There's a potential interaction that should be reviewed by the attending physician before proceeding.",
    "The AI health risk assessment indicates a moderate risk level (Score: 65/100). Key risk factors include elevated blood pressure and family history. A detailed care plan has been prepared.",
    "Emergency protocol activated. Based on the symptoms, this appears to be a potential stroke. FAST assessment: Face drooping detected, Arm weakness reported. Recommend immediate CT scan.",
  ]
}

function getResponse(msg) {
  const l = msg.toLowerCase()
  if (l.includes('symptom')||l.includes('pain')||l.includes('fever')) return RESPONSES.symptoms
  if (l.includes('medicine')||l.includes('drug')||l.includes('interaction')) return RESPONSES.medicine
  if (l.includes('emergency')||l.includes('first aid')||l.includes('cpr')) return RESPONSES.emergency
  return RESPONSES.default[Math.floor(Math.random()*RESPONSES.default.length)]
}

function formatMsg(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>')
    .replace(/\n/g,'<br/>')
}

function TypingDots() {
  return (
    <div style={{ display:'flex', gap:4, padding:'12px 16px' }}>
      {[0,1,2].map(i=>(
        <motion.div key={i} style={{ width:7, height:7, borderRadius:'50%', background:'#3b82f6' }}
          animate={{ y:[-4,0,-4] }} transition={{ duration:0.6, delay:i*0.15, repeat:Infinity }} />
      ))}
    </div>
  )
}

export default function AIAssistantPage() {
  const [msgs, setMsgs] = useState([{
    id:1, role:'assistant', ts:new Date(),
    text:"Hello! I'm **MediCore AI**, your intelligent healthcare assistant.\n\nI can help you with:\n• **Symptom analysis** and health risk assessment\n• **Medicine interaction** checking\n• **Emergency protocols** and first aid guidance\n• **Appointment scheduling** assistance\n• **Medical record** queries\n\nHow can I assist you today?",
  }])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [listening, setListening] = useState(false)
  const endRef = useRef(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior:'smooth' }) }, [msgs, typing])

  const send = async (text) => {
    const t = (text || input).trim()
    if (!t) return
    setMsgs(p=>[...p,{ id:Date.now(), role:'user', ts:new Date(), text:t }])
    setInput('')
    setTyping(true)
    await new Promise(r=>setTimeout(r, 1000+Math.random()*600))
    setMsgs(p=>[...p,{ id:Date.now()+1, role:'assistant', ts:new Date(), text:getResponse(t) }])
    setTyping(false)
  }

  const toggleMic = () => {
    setListening(!listening)
    if (!listening) setTimeout(()=>{ setListening(false); setInput('Patient has chest pain and shortness of breath for 2 hours') }, 3000)
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'calc(100vh - 120px)', gap:16 }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:42, height:42, borderRadius:14, background:'linear-gradient(135deg,#8b5cf6,#3b82f6)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="font-display" style={{ fontSize:16, fontWeight:700, color:'#f1f5f9' }}>MediCore AI Assistant</p>
            <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:2 }}>
              <div className="live-dot" />
              <span style={{ fontSize:11, fontWeight:600, color:'#34d399' }}>AI Online · Medical Model v4</span>
            </div>
          </div>
        </div>
        <button onClick={()=>setMsgs([{id:1,role:'assistant',ts:new Date(),text:'Chat cleared. How can I assist you?'}])}
          className="btn btn-ghost" style={{ height:36, fontSize:12 }}>
          <RefreshCw className="w-3.5 h-3.5" />Clear Chat
        </button>
      </div>

      {/* Quick prompts */}
      <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
        {QUICK.map((q,i) => {
          const Icon = q.icon
          return (
            <button key={i} onClick={()=>send(q.text)}
              style={{ display:'flex', alignItems:'center', gap:7, padding:'7px 14px', borderRadius:10, cursor:'pointer',
                background:q.bg, border:`1px solid ${q.color}25`, color:q.color, fontSize:12.5, fontWeight:500,
                transition:'all 0.15s' }}
              onMouseEnter={e=>e.currentTarget.style.transform='scale(1.03)'}
              onMouseLeave={e=>e.currentTarget.style.transform='scale(1)'}
            >
              <Icon className="w-3.5 h-3.5" />{q.text}
            </button>
          )
        })}
      </div>

      {/* Chat area */}
      <div className="card" style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
        {/* Messages */}
        <div style={{ flex:1, overflowY:'auto', padding:20, display:'flex', flexDirection:'column', gap:16 }}>
          <AnimatePresence>
            {msgs.map(msg => (
              <motion.div key={msg.id} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
                style={{ display:'flex', justifyContent:msg.role==='user'?'flex-end':'flex-start', gap:10 }}>
                {msg.role==='assistant' && (
                  <div style={{ width:32, height:32, borderRadius:10, background:'linear-gradient(135deg,#8b5cf6,#3b82f6)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:2 }}>
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                <div style={{
                  maxWidth:'72%', padding:'12px 16px', borderRadius:16, fontSize:13.5, lineHeight:1.65,
                  ...(msg.role==='user'
                    ? { background:'rgba(59,130,246,0.15)', border:'1px solid rgba(59,130,246,0.25)', color:'#e2e8f0', borderTopRightRadius:4 }
                    : { background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)', color:'#cbd5e1', borderTopLeftRadius:4 }
                  )
                }}>
                  <div dangerouslySetInnerHTML={{ __html:formatMsg(msg.text) }} />
                  <p style={{ fontSize:10.5, color:'#334155', marginTop:8 }}>
                    {msg.ts.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}
                  </p>
                </div>
                {msg.role==='user' && (
                  <div style={{ width:32, height:32, borderRadius:10, background:'linear-gradient(135deg,#3b82f6,#06b6d4)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:2, color:'#fff', fontSize:12, fontWeight:700 }}>
                    U
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          {typing && (
            <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
              style={{ display:'flex', alignItems:'flex-start', gap:10 }}>
              <div style={{ width:32, height:32, borderRadius:10, background:'linear-gradient(135deg,#8b5cf6,#3b82f6)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:16, borderTopLeftRadius:4 }}>
                <TypingDots />
              </div>
            </motion.div>
          )}
          <div ref={endRef} />
        </div>

        {/* Input */}
        <div style={{ padding:'16px 20px', borderTop:'1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display:'flex', gap:10, alignItems:'flex-end' }}>
            <div style={{ flex:1, position:'relative' }}>
              <textarea value={input} onChange={e=>setInput(e.target.value)}
                onKeyDown={e=>{ if(e.key==='Enter'&&!e.shiftKey){ e.preventDefault(); send() } }}
                placeholder="Ask about symptoms, medicines, appointments, or any health query…"
                rows={1} className="input"
                style={{ resize:'none', minHeight:46, maxHeight:120, paddingRight:44, lineHeight:1.5 }} />
              <Sparkles className="absolute right-3.5 bottom-3.5 w-4 h-4" style={{ color:'#334155' }} />
            </div>
            <button onClick={toggleMic}
              style={{ width:46, height:46, borderRadius:12, border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'all 0.15s',
                background: listening ? 'rgba(248,113,113,0.15)' : 'rgba(255,255,255,0.05)',
                color: listening ? '#f87171' : '#64748b',
                boxShadow: listening ? '0 0 0 2px rgba(248,113,113,0.3)' : 'none',
              }}>
              {listening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
            <button onClick={()=>send()} disabled={!input.trim()||typing}
              style={{ width:46, height:46, borderRadius:12, border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
                background: input.trim()&&!typing ? 'linear-gradient(135deg,#2563eb,#1d4ed8)' : 'rgba(255,255,255,0.05)',
                color: input.trim()&&!typing ? '#fff' : '#334155',
                boxShadow: input.trim()&&!typing ? '0 4px 14px rgba(37,99,235,0.4)' : 'none',
                transition:'all 0.2s',
              }}>
              <Send className="w-5 h-5" />
            </button>
          </div>
          {listening && (
            <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }}
              style={{ fontSize:11.5, color:'#f87171', marginTop:8, display:'flex', alignItems:'center', gap:6 }}>
              <div style={{ width:6, height:6, borderRadius:'50%', background:'#f87171', animation:'ping 1s infinite' }} />
              Listening… Speak your query
            </motion.p>
          )}
          <p style={{ fontSize:11, color:'#1e293b', marginTop:8, textAlign:'center' }}>
            AI responses are for informational purposes only. Always consult qualified medical professionals.
          </p>
        </div>
      </div>
    </div>
  )
}
