import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      setToken: (token) => set({ token, isAuthenticated: !!token }),
      setUser: (user) => set({ user }),

      setAuth: (token, user) => set({ token, user, isAuthenticated: !!token }),

      logout: () => set({ token: null, user: null, isAuthenticated: false })
    }),
    { name: 'auth-storage' }
  )
)
