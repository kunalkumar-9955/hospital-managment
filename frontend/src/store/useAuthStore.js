import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      _hasHydrated: false,

      setHasHydrated: (val) => set({ _hasHydrated: val }),

      login: async (credentials) => {
        // handled directly in LoginPage for demo
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false })
        // clear localStorage
        try { localStorage.removeItem('medicore-auth') } catch {}
      },

      setUser: (user) => set({ user }),

      initAuth: () => {
        // no-op — persist handles rehydration
      },
    }),
    {
      name: 'medicore-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) state.setHasHydrated(true)
      },
    }
  )
)
