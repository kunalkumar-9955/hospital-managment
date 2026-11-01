import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Users, UserCheck, Calendar, CreditCard,
  Pill, FlaskConical, Bed, AlertTriangle, BarChart3,
  Settings, Bot, ChevronLeft, ChevronRight, Heart
} from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { useAuthStore } from '../../store/useAuthStore'

// All nav items with role visibility
const ALL_NAV = [
  { path: '/dashboard',    icon: LayoutDashboard, label: 'Dashboard',    roles: ['admin','doctor','receptionist'] },
  { path: '/patients',     icon: Users,           label: 'Patients',     roles: ['admin','doctor','receptionist'], badge: null },
  { path: '/doctors',      icon: UserCheck,       label: 'Doctors',      roles: ['admin','receptionist'] },
  { path: '/appointments', icon: Calendar,        label: 'Appointments', roles: ['admin','doctor','receptionist'], badge: '12', badgeColor: '#8b5cf6' },
  { path: '/emergency',    icon: AlertTriangle,   label: 'Emergency',    roles: ['admin','doctor','receptionist'], badge: '3',  badgeColor: '#ef4444' },
  { path: '/billing',      icon: CreditCard,      label: 'Billing',      roles: ['admin','receptionist'] },
  { path: '/pharmacy',     icon: Pill,            label: 'Pharmacy',     roles: ['admin'],                         badge: '!',  badgeColor: '#f59e0b' },
  { path: '/laboratory',   icon: FlaskConical,    label: 'Laboratory',   roles: ['admin','doctor'] },
  { path: '/beds',         icon: Bed,             label: 'Beds & Rooms', roles: ['admin','receptionist'] },
  { path: '/analytics',    icon: BarChart3,       label: 'Analytics',    roles: ['admin'] },
  { path: '/ai-assistant', icon: Bot,             label: 'AI Assistant', roles: ['admin','doctor','receptionist'], badge: 'AI', badgeColor: '#a78bfa' },
  { path: '/settings',     icon: Settings,        label: 'Settings',     roles: ['admin'] },
]

// Role accent colors for the role badge
const ROLE_STYLE = {
  admin:        { label: 'Admin',        color: '#fbbf24', bg: 'rgba(251,191,36,0.12)',  border: 'rgba(251,191,36,0.25)' },
  doctor:       { label: 'Doctor',       color: '#34d399', bg: 'rgba(52,211,153,0.12)',  border: 'rgba(52,211,153,0.25)' },
  receptionist: { label: 'Receptionist', color: '#60a5fa', bg: 'rgba(96,165,250,0.12)',  border: 'rgba(96,165,250,0.25)' },
}

export default function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useAppStore()
  const { user, logout } = useAuthStore()
  const location = useLocation()
  const role = user?.role || 'admin'
  const rs = ROLE_STYLE[role] || ROLE_STYLE.admin
  const W = sidebarOpen ? 256 : 68

  // Filter nav by role
  const navItems = ALL_NAV.filter(n => n.roles.includes(role))

  return (
    <motion.aside
      animate={{ width: W }}
      transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
      style={{
        position: 'fixed', left: 0, top: 0, height: '100vh', zIndex: 50,
        background: '#0c1428',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden', width: W,
      }}
    >
      {/* Logo */}
      <div style={{ height: 64, display: 'flex', alignItems: 'center', padding: '0 14px', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, background: 'linear-gradient(135deg,#2563eb,#0ea5e9)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 16px rgba(37,99,235,0.4)' }}>
            <Heart style={{ width: 18, height: 18, color: '#fff' }} />
          </div>
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.18 }} style={{ overflow: 'hidden' }}>
                <p style={{ color: '#fff', fontWeight: 700, fontSize: 14, lineHeight: 1, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>MediCore AI</p>
                <p style={{ fontSize: 11, marginTop: 2, color: '#3b82f6' }}>Healthcare Platform</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <button onClick={toggleSidebar}
          style={{ width: 26, height: 26, borderRadius: 7, flexShrink: 0, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#475569' }}
          onMouseEnter={e => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)' }}
          onMouseLeave={e => { e.currentTarget.style.color = '#475569'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}>
          {sidebarOpen ? <ChevronLeft style={{ width: 13, height: 13 }} /> : <ChevronRight style={{ width: 13, height: 13 }} />}
        </button>
      </div>

      {/* Role badge */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            style={{ padding: '10px 12px 0', flexShrink: 0 }}>
            <div style={{ background: rs.bg, border: `1px solid ${rs.border}`, borderRadius: 10, padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: rs.color, flexShrink: 0 }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: rs.color, letterSpacing: '0.05em' }}>
                {rs.label.toUpperCase()} ACCESS
              </span>
              <div className="live-dot" style={{ marginLeft: 'auto', background: '#34d399' }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '10px 8px' }}>
        {navItems.map(item => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          return (
            <NavLink key={item.path} to={item.path}
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 12, marginBottom: 2, textDecoration: 'none', overflow: 'hidden', position: 'relative', transition: 'all 0.15s',
                background: isActive ? 'rgba(59,130,246,0.1)' : 'transparent',
                border: isActive ? '1px solid rgba(59,130,246,0.2)' : '1px solid transparent',
                color: isActive ? '#60a5fa' : '#475569',
              }}
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#94a3b8' } }}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#475569' } }}
            >
              <Icon style={{ width: 17, height: 17, flexShrink: 0, color: isActive ? '#60a5fa' : 'currentColor' }} />
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
                    style={{ fontSize: 13.5, fontWeight: 500, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              {item.badge && sidebarOpen && (
                <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 99, background: `${item.badgeColor}22`, color: item.badgeColor, flexShrink: 0 }}>
                  {item.badge}
                </span>
              )}
              {item.badge && !sidebarOpen && (
                <span style={{ position: 'absolute', top: 4, right: 4, width: 13, height: 13, borderRadius: '50%', background: item.badgeColor, fontSize: 8, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                  •
                </span>
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* User */}
      <div style={{ padding: '10px 8px', borderTop: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 10px', borderRadius: 12, overflow: 'hidden', cursor: 'pointer', transition: 'background 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
          <div style={{ width: 32, height: 32, borderRadius: 10, flexShrink: 0, background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 700 }}>
            {user?.name?.charAt(0) || 'A'}
          </div>
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1 }}>{user?.name || 'Admin'}</p>
                <p style={{ fontSize: 11, marginTop: 3, color: rs.color, fontWeight: 600 }}>{rs.label}</p>
              </motion.div>
            )}
          </AnimatePresence>
          {sidebarOpen && (
            <button onClick={logout} title="Logout"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#334155', flexShrink: 0, padding: 4, borderRadius: 6, transition: 'color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#f87171'}
              onMouseLeave={e => e.currentTarget.style.color = '#334155'}>
              <svg style={{ width: 15, height: 15 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </motion.aside>
  )
}
