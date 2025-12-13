"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export type TravelPace = "relaxed" | "moderate" | "fast"
export type BudgetLevel = "budget" | "moderate" | "luxury"

export interface UserProfile {
  nationality: string
  travelPace: TravelPace
  budgetLevel: BudgetLevel
  interests: string[]
  hasCompletedProfile: boolean
}

interface UserProfileStore {
  profile: UserProfile
  updateProfile: (updates: Partial<UserProfile>) => void
  resetProfile: () => void
}

const defaultProfile: UserProfile = {
  nationality: "",
  travelPace: "moderate",
  budgetLevel: "moderate",
  interests: [],
  hasCompletedProfile: false,
}

export const useUserProfileStore = create<UserProfileStore>()(
  persist(
    (set) => ({
      profile: defaultProfile,
      updateProfile: (updates) =>
        set((state) => ({
          profile: { ...state.profile, ...updates },
        })),
      resetProfile: () => set({ profile: defaultProfile }),
    }),
    {
      name: "starstrip-user-profile",
    },
  ),
)
