import { Outlet, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from './Sidebar'
import Header from './Header'
import { useAppStore } from '../../store/useAppStore'

export default function Layout() {
  const { sidebarOpen } = useAppStore()
  const location = useLocation()
  const sidebarW = sidebarOpen ? 256 : 68

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#060b18', overflow: 'hidden' }}>
      {/* Fixed sidebar */}
      <Sidebar />

      {/* Main area — offset by sidebar width */}
      <div style={{
        position: 'absolute',
        left: sidebarW,
        right: 0,
        top: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        transition: 'left 0.28s cubic-bezier(0.4,0,0.2,1)',
        overflow: 'hidden',
      }}>
        <Header />
        <main style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '28px 32px 48px',
        }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
