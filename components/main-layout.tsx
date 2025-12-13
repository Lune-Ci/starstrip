"use client"

import type React from "react"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { TopBar } from "./top-bar"
import { SideNav } from "./side-nav"
import { translations, type Language } from "@/lib/translations"
import { useLanguageStore } from "@/lib/language-store"

export function MainLayout({ children }: { children: React.ReactNode }) {
  const [isNavOpen, setIsNavOpen] = useState(false)
  const pathname = usePathname()
  const { language, setLanguage } = useLanguageStore()

  const currentTranslations = translations[language]

  return (
    <div className="min-h-screen starstrip-gradient">
      <TopBar
        onMenuClick={() => setIsNavOpen(true)}
        currentLanguage={language}
        onLanguageChange={(lang) => setLanguage(lang as Language)}
      />
      <SideNav
        isOpen={isNavOpen}
        onClose={() => setIsNavOpen(false)}
        currentPath={pathname}
        translations={currentTranslations}
      />
      <main className="pt-14 md:pt-16">{children}</main>
    </div>
  )
}
