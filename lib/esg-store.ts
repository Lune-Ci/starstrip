"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface TripRecord {
  id: string
  name: string
  startDate: string
  endDate: string
  carbonFootprint: number
  breakdown: {
    flights: number
    trains: number
    accommodation: number
    activities: number
  }
}

interface ESGStore {
  trips: TripRecord[]
  addTrip: (trip: TripRecord) => void
  removeTrip: (id: string) => void
  getTotalCarbon: () => number
  getYearlyCarbon: (year: number) => number
}

export const useESGStore = create<ESGStore>()(
  persist(
    (set, get) => ({
      trips: [],
      addTrip: (trip) =>
        set((state) => ({
          trips: [...state.trips, trip],
        })),
      removeTrip: (id) =>
        set((state) => ({
          trips: state.trips.filter((t) => t.id !== id),
        })),
      getTotalCarbon: () => {
        return get().trips.reduce((sum, trip) => sum + trip.carbonFootprint, 0)
      },
      getYearlyCarbon: (year) => {
        return get()
          .trips.filter((trip) => {
            const tripYear = new Date(trip.startDate).getFullYear()
            return tripYear === year
          })
          .reduce((sum, trip) => sum + trip.carbonFootprint, 0)
      },
    }),
    {
      name: "starstrip-esg",
    },
  ),
)
