import { useState } from 'react'
import { motion } from 'framer-motion'
import { Settings, User, Bell, Shield, Palette, Database, Globe, Save, Eye, EyeOff } from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'
import toast from 'react-hot-toast'

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'system', label: 'System', icon: Database },
]

export default function SettingsPage() {
  const { user } = useAuthStore()
  const [activeTab, setActiveTab] = useState('profile')
  const [showPassword, setShowPassword] = useState(false)
  const [notifications, setNotifications] = useState({
    email: true, sms: true, emergency: true, appointments: true, billing: false, reports: true,
  })
  const [appearance, setAppearance] = useState({
    theme: 'dark', accentColor: 'blue', fontSize: 'medium', animations: true, compactMode: false,
  })

  const handleSave = () => {
    toast.success('Settings saved successfully!')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white font-display">Settings</h1>
        <p className="text-gray-400 mt-1">Manage your account and system preferences</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar tabs */}
        <div className="w-48 flex-shrink-0">
          <div className="glass rounded-2xl p-2 border border-white/8 space-y-1">
            {tabs.map(tab => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    activeTab === tab.id ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20' : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className="glass rounded-2xl p-6 border border-white/8"
          >
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-white">Profile Settings</h2>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                    {user?.name?.charAt(0) || 'A'}
                  </div>
                  <div>
                    <button className="px-4 py-2 rounded-xl bg-blue-500/10 text-blue-400 text-sm font-medium hover:bg-blue-500/20 transition-colors">
                      Change Photo
                    </button>
                    <p className="text-xs text-gray-500 mt-1">JPG, PNG up to 5MB</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Full Name', value: user?.name || 'Admin User', type: 'text' },
                    { label: 'Email', value: user?.email || 'admin@medicore.com', type: 'email' },
                    { label: 'Role', value: user?.role || 'Administrator', type: 'text', disabled: true },
                    { label: 'Phone', value: '+1-555-0100', type: 'tel' },
                    { label: 'Department', value: 'Administration', type: 'text' },
                    { label: 'Employee ID', value: 'EMP-001', type: 'text', disabled: true },
                  ].map((field, i) => (
                    <div key={i}>
                      <label className="block text-sm text-gray-400 mb-1.5">{field.label}</label>
                      <input
                        type={field.type}
                        defaultValue={field.value}
                        disabled={field.disabled}
                        className="w-full px-4 py-2.5 rounded-xl input-dark text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-white">Notification Preferences</h2>
                <div className="space-y-4">
                  {Object.entries(notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                      <div>
                        <p className="text-sm font-medium text-white capitalize">{key.replace(/([A-Z])/g, ' $1')} Notifications</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {key === 'email' ? 'Receive notifications via email' :
                           key === 'sms' ? 'Receive SMS alerts on your phone' :
                           key === 'emergency' ? 'Critical emergency alerts (always recommended)' :
                           key === 'appointments' ? 'Appointment reminders and updates' :
                           key === 'billing' ? 'Payment and invoice notifications' :
                           'Lab reports and test results'}
                        </p>
                      </div>
                      <button
                        onClick={() => setNotifications(prev => ({ ...prev, [key]: !prev[key] }))}
                        className={`relative w-12 h-6 rounded-full transition-colors ${value ? 'bg-blue-500' : 'bg-gray-600'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${value ? 'translate-x-7' : 'translate-x-1'}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-white">Security Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1.5">Current Password</label>
                    <div className="relative">
                      <input type={showPassword ? 'text' : 'password'} placeholder="Enter current password"
                        className="w-full px-4 py-2.5 pr-12 rounded-xl input-dark text-sm" />
                      <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1.5">New Password</label>
                    <input type="password" placeholder="Enter new password" className="w-full px-4 py-2.5 rounded-xl input-dark text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1.5">Confirm New Password</label>
                    <input type="password" placeholder="Confirm new password" className="w-full px-4 py-2.5 rounded-xl input-dark text-sm" />
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 space-y-3">
                    <h3 className="text-sm font-medium text-white">Two-Factor Authentication</h3>
                    <p className="text-xs text-gray-400">Add an extra layer of security to your account</p>
                    <button className="px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 text-sm font-medium hover:bg-emerald-500/20 transition-colors">
                      Enable 2FA
                    </button>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5">
                    <h3 className="text-sm font-medium text-white mb-2">Active Sessions</h3>
                    {[
                      { device: 'Chrome on Windows', location: 'New York, US', current: true },
                      { device: 'Safari on iPhone', location: 'New York, US', current: false },
                    ].map((session, i) => (
                      <div key={i} className="flex items-center justify-between py-2">
                        <div>
                          <p className="text-sm text-gray-300">{session.device}</p>
                          <p className="text-xs text-gray-500">{session.location}</p>
                        </div>
                        {session.current ? (
                          <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">Current</span>
                        ) : (
                          <button className="text-xs text-red-400 hover:text-red-300">Revoke</button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-white">Appearance</h2>
                <div>
                  <label className="block text-sm text-gray-400 mb-3">Theme</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['dark', 'light', 'system'].map(theme => (
                      <button
                        key={theme}
                        onClick={() => setAppearance(prev => ({ ...prev, theme }))}
                        className={`p-4 rounded-xl border text-sm font-medium capitalize transition-all ${
                          appearance.theme === theme ? 'border-blue-500/50 bg-blue-500/10 text-blue-400' : 'border-white/10 text-gray-400 hover:border-white/20'
                        }`}
                      >
                        {theme === 'dark' ? '🌙' : theme === 'light' ? '☀️' : '💻'} {theme}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-3">Accent Color</label>
                  <div className="flex gap-3">
                    {[
                      { name: 'blue', color: 'bg-blue-500' },
                      { name: 'purple', color: 'bg-purple-500' },
                      { name: 'emerald', color: 'bg-emerald-500' },
                      { name: 'cyan', color: 'bg-cyan-500' },
                      { name: 'orange', color: 'bg-orange-500' },
                    ].map(c => (
                      <button
                        key={c.name}
                        onClick={() => setAppearance(prev => ({ ...prev, accentColor: c.name }))}
                        className={`w-8 h-8 rounded-full ${c.color} transition-all ${appearance.accentColor === c.name ? 'ring-2 ring-white ring-offset-2 ring-offset-[#0d1526] scale-110' : ''}`}
                      />
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    { key: 'animations', label: 'Enable Animations', desc: 'Smooth transitions and motion effects' },
                    { key: 'compactMode', label: 'Compact Mode', desc: 'Reduce spacing for more content' },
                  ].map(item => (
                    <div key={item.key} className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                      <div>
                        <p className="text-sm font-medium text-white">{item.label}</p>
                        <p className="text-xs text-gray-500">{item.desc}</p>
                      </div>
                      <button
                        onClick={() => setAppearance(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                        className={`relative w-12 h-6 rounded-full transition-colors ${appearance[item.key] ? 'bg-blue-500' : 'bg-gray-600'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${appearance[item.key] ? 'translate-x-7' : 'translate-x-1'}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'system' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-white">System Configuration</h2>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Hospital Name', value: 'MediCore General Hospital' },
                    { label: 'License Number', value: 'HC-2024-001234' },
                    { label: 'Time Zone', value: 'America/New_York (UTC-5)' },
                    { label: 'Currency', value: 'USD ($)' },
                    { label: 'Date Format', value: 'MM/DD/YYYY' },
                    { label: 'Language', value: 'English (US)' },
                  ].map((field, i) => (
                    <div key={i}>
                      <label className="block text-sm text-gray-400 mb-1.5">{field.label}</label>
                      <input defaultValue={field.value} className="w-full px-4 py-2.5 rounded-xl input-dark text-sm" />
                    </div>
                  ))}
                </div>
                <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <h3 className="text-sm font-medium text-blue-400 mb-2">API Configuration</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">OpenAI API Key</label>
                      <input type="password" placeholder="sk-..." className="w-full px-4 py-2 rounded-xl input-dark text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Cloudinary Cloud Name</label>
                      <input placeholder="your-cloud-name" className="w-full px-4 py-2 rounded-xl input-dark text-sm" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-white/5">
              <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2.5 rounded-xl btn-primary font-medium">
                <Save className="w-4 h-4" /> Save Changes
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
