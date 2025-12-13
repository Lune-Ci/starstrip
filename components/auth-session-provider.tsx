"use client"

import { SessionProvider } from "next-auth/react"
import type { ReactNode } from "react"
import { AuthBridge } from "@/components/auth-bridge"

export function AuthSessionProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AuthBridge />
      {children}
    </SessionProvider>
  )
}