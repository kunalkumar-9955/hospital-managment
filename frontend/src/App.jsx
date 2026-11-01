import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from './store/useAuthStore'
import Layout        from './components/layout/Layout'
import LoginPage     from './pages/LoginPage'
import RegisterPage  from './pages/RegisterPage'
import Dashboard     from './pages/Dashboard'
import PatientsPage  from './pages/PatientsPage'
import DoctorsPage   from './pages/DoctorsPage'
import AppointmentsPage from './pages/AppointmentsPage'
import BillingPage   from './pages/BillingPage'
import PharmacyPage  from './pages/PharmacyPage'
import LaboratoryPage from './pages/LaboratoryPage'
import BedsPage      from './pages/BedsPage'
import EmergencyPage from './pages/EmergencyPage'
import AnalyticsPage from './pages/AnalyticsPage'
import SettingsPage  from './pages/SettingsPage'
import AIAssistantPage from './pages/AIAssistantPage'

// ── Error Boundary ──────────────────────────────────────────────────────────
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }
  static getDerivedStateFromError(error) {
    return { error }
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{
          height: '100vh', display: 'flex', alignItems: 'center',
          justifyContent: 'center', background: '#060b18',
          flexDirection: 'column', gap: 16, padding: 24,
        }}>
          <div style={{ fontSize: 48 }}>⚠️</div>
          <p style={{ color: '#f87171', fontSize: 18, fontWeight: 700 }}>Something went wrong</p>
          <p style={{ color: '#475569', fontSize: 13, maxWidth: 480, textAlign: 'center', lineHeight: 1.6 }}>
            {this.state.error.message}
          </p>
          <button
            onClick={() => { this.setState({ error: null }); window.location.href = '/' }}
            style={{
              padding: '10px 28px', borderRadius: 10, background: '#2563eb',
              color: '#fff', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600,
            }}
          >
            Reload App
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

// ── Protected Route ─────────────────────────────────────────────────────────
function ProtectedRoute({ children }) {
  const { isAuthenticated, _hasHydrated } = useAuthStore()

  // Wait for Zustand persist to rehydrate from localStorage
  if (!_hasHydrated) {
    return (
      <div style={{
        height: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: '#060b18', flexDirection: 'column', gap: 16,
      }}>
        <div style={{
          width: 44, height: 44,
          border: '3px solid rgba(59,130,246,0.15)',
          borderTopColor: '#3b82f6',
          borderRadius: '50%',
          animation: 'spin 0.75s linear infinite',
        }} />
        <p style={{ color: '#334155', fontSize: 13 }}>Loading MediCore AI…</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    )
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />
  return children
}

// ── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#0c1428',
              color: '#f1f5f9',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              fontSize: '13px',
            },
            success: { iconTheme: { primary: '#34d399', secondary: '#fff' } },
            error:   { iconTheme: { primary: '#f87171', secondary: '#fff' } },
          }}
        />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard"    element={<Dashboard />} />
            <Route path="patients"     element={<PatientsPage />} />
            <Route path="doctors"      element={<DoctorsPage />} />
            <Route path="appointments" element={<AppointmentsPage />} />
            <Route path="billing"      element={<BillingPage />} />
            <Route path="pharmacy"     element={<PharmacyPage />} />
            <Route path="laboratory"   element={<LaboratoryPage />} />
            <Route path="beds"         element={<BedsPage />} />
            <Route path="emergency"    element={<EmergencyPage />} />
            <Route path="analytics"    element={<AnalyticsPage />} />
            <Route path="ai-assistant" element={<AIAssistantPage />} />
            <Route path="settings"     element={<SettingsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  )
}
