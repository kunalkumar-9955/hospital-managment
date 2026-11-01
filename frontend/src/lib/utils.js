import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date, format = 'MMM dd, yyyy') {
  if (!date) return 'N/A'
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  })
}

export function formatTime(date) {
  if (!date) return 'N/A'
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function getInitials(name) {
  if (!name) return 'U'
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function getStatusColor(status) {
  const colors = {
    active: 'text-emerald-400 bg-emerald-400/10',
    inactive: 'text-gray-400 bg-gray-400/10',
    critical: 'text-red-400 bg-red-400/10',
    stable: 'text-blue-400 bg-blue-400/10',
    recovering: 'text-yellow-400 bg-yellow-400/10',
    discharged: 'text-purple-400 bg-purple-400/10',
    pending: 'text-orange-400 bg-orange-400/10',
    confirmed: 'text-emerald-400 bg-emerald-400/10',
    cancelled: 'text-red-400 bg-red-400/10',
    completed: 'text-blue-400 bg-blue-400/10',
    available: 'text-emerald-400 bg-emerald-400/10',
    occupied: 'text-red-400 bg-red-400/10',
    maintenance: 'text-yellow-400 bg-yellow-400/10',
    online: 'text-emerald-400',
    busy: 'text-yellow-400',
    offline: 'text-gray-400',
    emergency: 'text-red-400',
  }
  return colors[status?.toLowerCase()] || 'text-gray-400 bg-gray-400/10'
}

export function generatePatientId() {
  return `PT-${Date.now().toString(36).toUpperCase()}`
}

export function calculateAge(dob) {
  if (!dob) return 'N/A'
  const today = new Date()
  const birthDate = new Date(dob)
  let age = today.getFullYear() - birthDate.getFullYear()
  const m = today.getMonth() - birthDate.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--
  return age
}

export function truncate(str, length = 50) {
  if (!str) return ''
  return str.length > length ? str.substring(0, length) + '...' : str
}

export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

export const SPECIALIZATIONS = [
  'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Oncology',
  'Dermatology', 'Psychiatry', 'Radiology', 'Emergency Medicine',
  'General Surgery', 'Internal Medicine', 'Gynecology', 'Urology',
  'Ophthalmology', 'ENT', 'Anesthesiology', 'Pathology', 'Nephrology',
]

export const DEPARTMENTS = [
  'Emergency', 'ICU', 'General Ward', 'Cardiology', 'Neurology',
  'Orthopedics', 'Pediatrics', 'Oncology', 'Surgery', 'Radiology',
  'Laboratory', 'Pharmacy', 'Outpatient', 'Maternity',
]
