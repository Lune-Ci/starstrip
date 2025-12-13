"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Attraction, Meal } from "./route-planner-store"
import { useAuthStore } from "./auth-store"

type FavoritesProfile = {
  attractions: Attraction[]
  restaurants: Meal[]
}

function getActiveProfileKey(): string {
  const auth = useAuthStore.getState()
  return auth.user?.id || auth.guestId || "global"
}

interface FavoritesStore {
  profiles: Record<string, FavoritesProfile>
  getActiveFavorites: () => FavoritesProfile
  addAttraction: (attraction: Attraction) => void
  removeAttraction: (id: string) => void
  addRestaurant: (restaurant: Meal) => void
  removeRestaurant: (id: string) => void
  isAttractionFavorited: (id: string) => boolean
  isRestaurantFavorited: (id: string) => boolean
}

const emptyProfile: FavoritesProfile = { attractions: [], restaurants: [] }

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      profiles: { global: emptyProfile },
      getActiveFavorites: () => {
        const key = getActiveProfileKey()
        return get().profiles[key] || emptyProfile
      },
      addAttraction: (attraction) =>
        set((state) => {
          const key = getActiveProfileKey()
          const current = state.profiles[key] || emptyProfile
          const updated: FavoritesProfile = {
            ...current,
            attractions: [...current.attractions, attraction],
          }
          return { profiles: { ...state.profiles, [key]: updated } }
        }),
      removeAttraction: (id) =>
        set((state) => {
          const key = getActiveProfileKey()
          const current = state.profiles[key] || emptyProfile
          const updated: FavoritesProfile = {
            ...current,
            attractions: current.attractions.filter((a) => a.id !== id),
          }
          return { profiles: { ...state.profiles, [key]: updated } }
        }),
      addRestaurant: (restaurant) =>
        set((state) => {
          const key = getActiveProfileKey()
          const current = state.profiles[key] || emptyProfile
          const updated: FavoritesProfile = {
            ...current,
            restaurants: [...current.restaurants, restaurant],
          }
          return { profiles: { ...state.profiles, [key]: updated } }
        }),
      removeRestaurant: (id) =>
        set((state) => {
          const key = getActiveProfileKey()
          const current = state.profiles[key] || emptyProfile
          const updated: FavoritesProfile = {
            ...current,
            restaurants: current.restaurants.filter((r) => r.id !== id),
          }
          return { profiles: { ...state.profiles, [key]: updated } }
        }),
      isAttractionFavorited: (id) => {
        const key = getActiveProfileKey()
        const current = get().profiles[key] || emptyProfile
        return current.attractions.some((a) => a.id === id)
      },
      isRestaurantFavorited: (id) => {
        const key = getActiveProfileKey()
        const current = get().profiles[key] || emptyProfile
        return current.restaurants.some((r) => r.id === id)
      },
    }),
    {
      name: "starstrip-favorites",
      version: 2,
      migrate: (persistedState: any, version) => {
        if (!persistedState) return { profiles: { global: emptyProfile } }
        if (version === 0 || version === 1) {
          // Migrate from flat structure to profiles
          const attractions = persistedState.attractions || []
          const restaurants = persistedState.restaurants || []
          return { profiles: { global: { attractions, restaurants } } }
        }
        return persistedState
      },
    },
  ),
)

// Sync active profile changes to re-render consumers
useAuthStore.subscribe(() => {
  // Trigger a no-op state update to ensure selectors re-run
  useFavoritesStore.setState((s) => ({ ...s }))
})
