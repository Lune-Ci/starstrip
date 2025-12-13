"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Language } from "./translations"

interface LanguageStore {
  language: Language
  setLanguage: (language: Language) => void
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set) => ({
      language: "en",
      setLanguage: (language) => set({ language }),
    }),
    {
      name: "starstrip-language",
    },
  ),
)
