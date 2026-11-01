/**
 * Reusable page shell — consistent header + content wrapper
 */
export default function PageShell({ title, subtitle, actions, children }) {
  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
        <div>
          <h1 className="page-title">{title}</h1>
          {subtitle && <p className="page-subtitle">{subtitle}</p>}
        </div>
        {actions && <div style={{ display:'flex', gap:10 }}>{actions}</div>}
      </div>
      {children}
    </div>
  )
}
