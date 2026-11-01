/**
 * Reusable stat cards row
 */
export default function StatRow({ stats }) {
  return (
    <div style={{ display:'grid', gridTemplateColumns:`repeat(${stats.length},1fr)`, gap:14, marginBottom:24 }}>
      {stats.map((s,i) => (
        <div key={i} style={{
          padding:'18px 20px', borderRadius:16,
          background: s.bg || 'rgba(255,255,255,0.03)',
          border: s.border || '1px solid rgba(255,255,255,0.07)',
        }}>
          <p style={{ fontSize:24, fontWeight:700, color: s.color || '#f1f5f9', fontFamily:'Plus Jakarta Sans,sans-serif' }}>{s.value}</p>
          <p style={{ fontSize:12.5, color:'#475569', marginTop:5 }}>{s.label}</p>
        </div>
      ))}
    </div>
  )
}
