import { useAuthStore } from '../store/useAuthStore'
import AdminDashboard       from './dashboard/AdminDashboard'
import DoctorDashboard      from './dashboard/DoctorDashboard'
import ReceptionistDashboard from './dashboard/ReceptionistDashboard'

/**
 * Role-based dashboard router.
 * admin       → AdminDashboard       (hospital command center, revenue, staff, analytics)
 * doctor      → DoctorDashboard      (my patients, schedule, lab results, recovery)
 * receptionist→ ReceptionistDashboard(appointments, queue, beds, billing)
 */
export default function Dashboard() {
  const { user } = useAuthStore()
  const role = user?.role || 'admin'

  if (role === 'doctor')       return <DoctorDashboard user={user} />
  if (role === 'receptionist') return <ReceptionistDashboard user={user} />
  return <AdminDashboard user={user} />
}
