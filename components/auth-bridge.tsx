"use client"

import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { useAuthStore } from "@/lib/auth-store"
import { useFavoritesStore } from "@/lib/favorites-store"
import { useRoutePlannerStore, type RoutePlannerState } from "@/lib/route-planner-store"

export function AuthBridge() {
  const { data: session, status } = useSession()
  const setUserFromOAuth = useAuthStore((s) => s.setUserFromOAuth)
  const mergeGuestDataToUser = useAuthStore((s) => s.mergeGuestDataToUser)
  const logout = useAuthStore((s) => s.logout)

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const id = (session.user as any).id as string | undefined
      const email = session.user.email ?? undefined
      const provider = ((session.user as any).provider ?? "credentials") as "google" | "apple" | "facebook" | "credentials"
      if (id) {
        setUserFromOAuth({ id, email, provider })
        // Merge guest data into the new user profile across stores
        const guestId = useAuthStore.getState().guestId
        if (guestId) {
          // Favorites merge with dedup
          const fav = useFavoritesStore.getState()
          const fromFav = fav.profiles[guestId] || fav.profiles.global || { attractions: [], restaurants: [] }
          const toFav = fav.profiles[id] || { attractions: [], restaurants: [] }
          const dedupById = <T extends { id: string }>(items: T[]): T[] => {
            const map = new Map<string, T>()
            for (const it of items) if (!map.has(it.id)) map.set(it.id, it)
            return Array.from(map.values())
          }
          const mergedFav = {
            attractions: dedupById([...toFav.attractions, ...fromFav.attractions]),
            restaurants: dedupById([...toFav.restaurants, ...fromFav.restaurants]),
          }
          useFavoritesStore.setState((s) => ({ profiles: { ...s.profiles, [id]: mergedFav } }))

          // Route planner: prefer existing user state, else adopt guest
          const route = useRoutePlannerStore.getState()
          const fromRoute: RoutePlannerState = route.profiles[guestId] || route.profiles.global || route.state
          const toRoute: RoutePlannerState = route.profiles[id] || route.state
          const isEmpty = (rp: RoutePlannerState) => rp.itinerary.length === 0 && rp.currentStep === 0 && !rp.selectedScheme
          const mergedRoute = isEmpty(toRoute) ? fromRoute : toRoute
          useRoutePlannerStore.setState((s) => ({ profiles: { ...s.profiles, [id]: mergedRoute }, state: mergedRoute }))

          // Finally clear guestId in auth store
          useAuthStore.setState({ guestId: null })
        }
      }
    } else if (status === "unauthenticated") {
      logout()
    }
  }, [status, session, setUserFromOAuth, logout])

  return null
}
