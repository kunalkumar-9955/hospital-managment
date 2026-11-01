import { create } from 'zustand'

export const useAppStore = create((set) => ({
  sidebarOpen: true,
  darkMode: true,
  notifications: [],
  emergencyAlerts: [],
  activeModule: 'dashboard',

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
  setActiveModule: (module) => set({ activeModule: module }),

  addNotification: (notification) =>
    set((state) => ({
      notifications: [{ id: Date.now(), ...notification, timestamp: new Date() }, ...state.notifications].slice(0, 50),
    })),

  clearNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),

  addEmergencyAlert: (alert) =>
    set((state) => ({
      emergencyAlerts: [{ id: Date.now(), ...alert, timestamp: new Date() }, ...state.emergencyAlerts].slice(0, 10),
    })),

  clearEmergencyAlert: (id) =>
    set((state) => ({
      emergencyAlerts: state.emergencyAlerts.filter((a) => a.id !== id),
    })),
}))
