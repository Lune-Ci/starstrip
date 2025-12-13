"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
// Note: cross-store migration is implemented in the AuthBridge component to avoid import cycles.

export type AuthProvider = "local" | "apple" | "google" | "facebook" | "credentials"

export interface AuthUser {
  id: string
  email?: string
  provider: AuthProvider
}

interface AuthState {
  user: AuthUser | null
  guestId: string | null
  remember: boolean
  loginWithEmail: (email: string, remember: boolean) => void
  loginWithProvider: (provider: Exclude<AuthProvider, "local">) => void
  setUserFromOAuth: (user: { id: string; email?: string; provider: Exclude<AuthProvider, "local"> }) => void
  mergeGuestDataToUser: () => void
  setRemember: (remember: boolean) => void
  ensureGuest: () => string
  logout: () => void
}

function randomId(prefix = "usr") {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      guestId: null,
      remember: true,
      loginWithEmail: (email, remember) => {
        const id = randomId("user")
        set({ user: { id, email, provider: "local" }, remember })
      },
      loginWithProvider: (provider) => {
        const id = randomId(provider)
        set({ user: { id, provider }, remember: true })
      },
      setUserFromOAuth: (user) => {
        set({ user })
      },
      mergeGuestDataToUser: () => {
        const { guestId, user } = get()
        if (!guestId || !user) return
        // Clearing guestId indicates upgrade; actual data migration is handled in AuthBridge to avoid circular dependencies.
        set({ guestId: null })
      },
      setRemember: (remember) => set({ remember }),
      ensureGuest: () => {
        const current = get().guestId
        if (current) return current
        const guest = randomId("guest")
        set({ guestId: guest })
        return guest
      },
      logout: () => set({ user: null }),
    }),
    {
      name: "starstrip-auth",
    },
  ),
)

export const isAuthenticated = () => !!useAuthStore.getState().user
export const getGuestId = () => useAuthStore.getState().guestId
