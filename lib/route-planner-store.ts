"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { useAuthStore } from "./auth-store"

export type RouteScheme = "time" | "experience" | "value" | "lowCarbon"

export interface ItineraryDay {
  date: string
  attractions: Attraction[]
  meals: Meal[]
}

export interface Attraction {
  id: string
  name: string
  city: string
  duration: number // in hours
  cost: number
  carbonFootprint: number // in kg CO2
  coordinates: { lat: number; lng: number }
  type: string
  image?: string
}

export interface Meal {
  id: string
  name: string
  city: string
  cost: number
  carbonFootprint: number // added carbon footprint field
  type: string // changed from union type to string for flexibility
  cuisine: string // added cuisine field
  image?: string // added image field for food photos
}

export interface RoutePlannerState {
  currentStep: number
  startLocation: string
  dateRange: { from: Date | null; to: Date | null }
  selectedScheme: RouteScheme | null
  itinerary: ItineraryDay[]
  totalCost: number
  totalCarbon: number
}

interface RoutePlannerStore {
  state: RoutePlannerState
  profiles: Record<string, RoutePlannerState>
  setStep: (step: number) => void
  updateState: (updates: Partial<RoutePlannerState>) => void
  resetPlanner: () => void
  addAttractionToDay: (date: string, attraction: Attraction) => void
  removeAttractionFromDay: (date: string, attractionId: string) => void
  reorderAttractions: (date: string, attractions: Attraction[]) => void
}

const initialState: RoutePlannerState = {
  currentStep: 0,
  startLocation: "",
  dateRange: { from: null, to: null },
  selectedScheme: null,
  itinerary: [],
  totalCost: 0,
  totalCarbon: 0,
}

export const useRoutePlannerStore = create<RoutePlannerStore>()(
  persist(
    (set, get) => ({
      state: initialState,
      profiles: { global: initialState },
      setStep: (step) =>
        set((store) => {
          const key = getActiveProfileKey()
          const profile = store.profiles[key] || initialState
          const updated = { ...profile, currentStep: step }
          return {
            state: updated,
            profiles: { ...store.profiles, [key]: updated },
          }
        }),
      updateState: (updates) =>
        set((store) => {
          const key = getActiveProfileKey()
          const profile = store.profiles[key] || initialState
          const updated = { ...profile, ...updates }
          return { state: updated, profiles: { ...store.profiles, [key]: updated } }
        }),
      resetPlanner: () =>
        set((store) => {
          const key = getActiveProfileKey()
          return { state: initialState, profiles: { ...store.profiles, [key]: initialState } }
        }),
      addAttractionToDay: (date, attraction) =>
        set((store) => {
          const key = getActiveProfileKey()
          const base = store.profiles[key] || initialState
          const itinerary = [...base.itinerary]
          const dayIndex = itinerary.findIndex((day) => day.date === date)

          if (dayIndex >= 0) {
            itinerary[dayIndex].attractions.push(attraction)
          } else {
            itinerary.push({
              date,
              attractions: [attraction],
              meals: [],
            })
          }

          const totalCost = itinerary.reduce(
            (sum, day) =>
              sum + day.attractions.reduce((s, a) => s + a.cost, 0) + day.meals.reduce((s, m) => s + m.cost, 0),
            0,
          )

          const totalCarbon = itinerary.reduce(
            (sum, day) => sum + day.attractions.reduce((s, a) => s + a.carbonFootprint, 0),
            0,
          )

          const updated = { ...base, itinerary, totalCost, totalCarbon }
          return { state: updated, profiles: { ...store.profiles, [key]: updated } }
        }),
      removeAttractionFromDay: (date, attractionId) =>
        set((store) => {
          const key = getActiveProfileKey()
          const base = store.profiles[key] || initialState
          const itinerary = base.itinerary.map((day) => {
            if (day.date === date) {
              return {
                ...day,
                attractions: day.attractions.filter((a) => a.id !== attractionId),
              }
            }
            return day
          })

          const totalCost = itinerary.reduce(
            (sum, day) =>
              sum + day.attractions.reduce((s, a) => s + a.cost, 0) + day.meals.reduce((s, m) => s + m.cost, 0),
            0,
          )

          const totalCarbon = itinerary.reduce(
            (sum, day) => sum + day.attractions.reduce((s, a) => s + a.carbonFootprint, 0),
            0,
          )

          const updated = { ...base, itinerary, totalCost, totalCarbon }
          return { state: updated, profiles: { ...store.profiles, [key]: updated } }
        }),
      reorderAttractions: (date, attractions) =>
        set((store) => {
          const key = getActiveProfileKey()
          const base = store.profiles[key] || initialState
          const itinerary = base.itinerary.map((day) => {
            if (day.date === date) {
              return { ...day, attractions }
            }
            return day
          })
          const updated = { ...base, itinerary }
          return { state: updated, profiles: { ...store.profiles, [key]: updated } }
        }),
    }),
    {
      name: "starstrip-route-planner",
      version: 2,
      migrate: (persistedState: any, version) => {
        if (!persistedState) return { state: initialState, profiles: { global: initialState } }
        if (version === 0 || version === 1) {
          // Old schema had flat `state`, move it under global profile
          const oldState = persistedState.state || initialState
          return { state: oldState, profiles: { global: oldState } }
        }
        return persistedState
      },
    },
  ),
)

function getActiveProfileKey(): string {
  const auth = useAuthStore.getState()
  return auth.user?.id || auth.guestId || "global"
}

// Keep `state` aligned with active profile as auth changes
useAuthStore.subscribe(() => {
  const key = getActiveProfileKey()
  const store = useRoutePlannerStore.getState()
  const next = store.profiles[key] || initialState
  useRoutePlannerStore.setState({ state: next })
})
